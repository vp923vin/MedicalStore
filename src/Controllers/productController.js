const multer = require('multer');
const path = require('path');
const { validationResult } = require('express-validator');

const Product = require('../Models/Product');
const Category = require('../Models/Category');

const formatErrors = require('../Services/Utils/formErrorFormat');
const upload = require('../Services/Utils/imageUpload');

const createProduct = async (req, res) => {
    upload.single('product_image')(req, res, async function (err) {
        if (err) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Error uploading file',
                error: err.message
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = formatErrors(errors.array());
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: "Validation Failed",
                errors: formattedErrors,
            });
        }
        
        const { product_name, description, price, category_id, sku } = req.body;
        
        try {
            const productData = { name: product_name, description, price, category_id };
            if (sku) productData.sku = sku;
            if (req.file) productData.product_image = req.file.path;
            
            const product = await Product.create(productData);
            
            return res.status(201).json({
                status: 'success',
                statusCode: 201,
                message: 'Product created successfully',
                data: { product: product },
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                statusCode: 500,
                message: 'Something went wrong in server.',
                error: error.message
            });
        }
    });
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category, as: 'Category' }],
        });
        if (!products) {
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'No products in the Record Book',
                data: [],
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Products fetched successfully',
            data: {products: products},
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const getProductById = async (req, res) => { 
    const { productId } = req.params;
    try {
        const product = await Product.findOne({
            where:{ product_id: productId },
            include: [{ model: Category, as: 'Category' }],
        });
        if (!product) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Product not found',
                errors: [{message: 'Product not found'}]
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Products fetched successfully',
            data: {products: product},
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({ field: err.param, message: err.msg }));
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: "Validation Failed",
            errors: formattedErrors,
        });
    }

    const { productId } = req.params;
    const { category_id } = req.body;
    let product_image = null;

    if (req.file) {
        product_image = req.file.path; 
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Product not found',
                errors: [{ message: 'Product not found' }]
            });
        }

        // Validate category_id if provided
        if (category_id) {
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(400).json({
                    status: 'failed',
                    statusCode: 400,
                    message: 'Invalid category ID',
                    errors: [{ field: 'category_id', message: 'Category ID does not exist' }]
                });
            }
        }

        // Update fields selectively
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined && key !== 'category_id') {
                product[key] = req.body[key];
            }
        });

        if (category_id) {
            product.category_id = category_id;
        }
        if (product_image && product.product_image !== product_image) {
            product.product_image = product_image;
        }

        await product.save();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Product updated successfully',
            data: { product: product },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Product not found',
                errors: [{message: 'Product not found'}]
            });
        }
        await product.destroy(); 
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
