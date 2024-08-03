const Category = require('../Models/Category');
const { validationResult } = require('express-validator');
const formatErrors = require('../Services/Utils/formErrorFormat');

const createCategory = async (req, res) => {
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
    const { category_name } = req.body;
    try {
        const existingCategory = await Category.findOne({ where: { category_name } });
        if (existingCategory) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Category already exists',
                errors: [
                    { message: 'Category with this name already exists' }
                ]
            });
        } 
        const category = await Category.create({ category_name });
        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'Category created successfully',
            data: { category: category },
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

const getCategories = async (req, res) => {

    try {
        const categories = await Category.findAll();
        if(!categories){
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Category Not Found',
                errors: [
                    { message: 'Category Not Found' }
                ]
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Categories fetched successfully',
            data: categories,
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

const getCategoriesById = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const categories = await Category.findOne({ where: {category_id: categoryId}});
        if(!categories){
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Category Not Found',
                errors: [
                    { message: 'Category Not Found' }
                ]
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Categories fetched successfully',
            data: categories,
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

const updateCategory = async (req, res) => {
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
    const { categoryId } = req.params;
    const { category_name } = req.body;
    try {
        const existingCategory = await Category.findOne({ where: { category_name } });
        if (existingCategory) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Category already exists',
                errors: [
                    { message: 'Category with this name already exists' }
                ]
            });
        } 
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Category Not Found',
                errors: [
                    { message: 'Category Not Found' }
                ]
            });

        }
        category.category_name = category_name;
        await category.save();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Category updated successfully',
            data: { category: category },
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

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Category not found',
                errors: [{message: 'Category not found'}]
            });
        }
        await category.destroy();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Category deleted successfully',
            data: { category: category }
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
    createCategory,
    getCategories,
    getCategoriesById,
    updateCategory,
    deleteCategory,
};
