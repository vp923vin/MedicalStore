const { Product, Category, SubCategory, Inventory } = require('../../Models/Index');
const upload = require('../../Services/Utils/imageUpload');

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

const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Product fetched successfully',
            data: { product }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
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

const getProductsByPagination = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const { rows, count } = await Product.findAndCountAll({ offset, limit });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Products fetched successfully',
            data: { products: rows, total: count }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const tempDeleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Product not found'
            });
        }
        await product.destroy();
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Product temporarily deleted successfully',
            data: { product }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const bulkTempDeleteProducts = async (req, res) => {
    const { productIds } = req.body;
    try {
        const products = await Product.findAll({
            where: { product_id: { [Op.in]: productIds } }
        });
        if (products.length === 0) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Products not found'
            });
        }
        await Product.destroy({
            where: { product_id: { [Op.in]: productIds } }
        });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Products temporarily deleted successfully',
            data: { products }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const restoreProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findByPk(productId, { paranoid: false });
        if (!product) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Product not found'
            });
        }
        await product.restore();
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Product restored successfully',
            data: { product }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const restoreMultipleProducts = async (req, res) => {
    const { productIds } = req.body;
    try {
        const products = await Product.findAll({
            where: { product_id: { [Op.in]: productIds } },
            paranoid: false
        });
        if (products.length === 0) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Products not found'
            });
        }
        await Product.restore({
            where: { product_id: { [Op.in]: productIds } }
        });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Products restored successfully',
            data: { products }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const permanentlyDeleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findByPk(productId, { paranoid: false });
        if (!product) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Product not found'
            });
        }
        await product.destroy({ force: true });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Product permanently deleted successfully',
            data: { product }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const permanentlyDeleteMultipleProducts = async (req, res) => {
    const { productIds } = req.body;
    try {
        const products = await Product.findAll({
            where: { product_id: { [Op.in]: productIds } },
            paranoid: false
        });
        if (products.length === 0) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Products not found'
            });
        }
        await Product.destroy({
            where: { product_id: { [Op.in]: productIds } },
            force: true
        });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Products permanently deleted successfully',
            data: { products }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProductById,
    updateProduct,
    getProductsByPagination,
    tempDeleteProduct,
    bulkTempDeleteProducts,
    restoreProduct,
    restoreMultipleProducts,
    permanentlyDeleteProduct,
    permanentlyDeleteMultipleProducts
};
