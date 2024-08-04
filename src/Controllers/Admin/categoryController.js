const { Op } = require('sequelize');
const { Category, SubCategory } = require('../../Models/Index');

const createCategory = async (req, res) => {
    const { category_name } = req.body;
    try {
        const existingCategory = await Category.findOne({ where: { category_name } });
        if (existingCategory) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Category already exists',
                errors: [{ message: 'Category with this name already exists' }],
            });
        }
        const category = await Category.create({ category_name });
        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'Category created successfully',
            data: { category },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const getCategoryById = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Category Not Found',
                errors: [{ message: 'Category Not Found' }],
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Category fetched successfully',
            data: { category },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const getCategoriesByPagination = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    try {
        const { count, rows: categories } = await Category.findAndCountAll({
            limit,
            offset,
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Categories fetched successfully',
            data: {
                categories,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page, 10),
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { category_name } = req.body;
    try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Category Not Found',
                errors: [{ message: 'Category Not Found' }],
            });
        }
        if (category.category_name === category_name) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Category with this name already exists',
                errors: [{ message: 'Category with this name already exists' }],
            });
        }
        await category.update({ category_name });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Category updated successfully',
            data: { category },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
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
                message: 'Category Not Found',
                errors: [{ message: 'Category Not Found' }],
            });
        }
        await category.update({ deletedAt: new Date() });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Category deleted successfully',
            data: { category },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const getTrashListCategories = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    try {
        const { count, rows: categories } = await Category.findAndCountAll({
            where: { deletedAt: { [Op.not]: null } },
            limit,
            offset,
            paranoid: false,
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Trashed categories fetched successfully',
            data: {
                categories,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page, 10),
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const permanentlyDeleteCategoryById = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const category = await Category.findByPk(categoryId, { paranoid: false });
        if (!category) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Category Not Found',
                errors: [{ message: 'Category Not Found' }],
            });
        }
        await category.destroy({ force: true });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Category permanently deleted successfully',
            data: { category },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const multiDeleteCategoriesPermanently = async (req, res) => {
    const { categoryIds } = req.body;
    try {
        await Category.destroy({
            where: { id: categoryIds },
            force: true,
            paranoid: false,
        });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Categories permanently deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const restoreCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const category = await Category.findByPk(categoryId, { paranoid: false });
        if (!category || !category.deletedAt) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Category not found or not deleted',
                errors: [{ message: 'Category not found or not deleted' }],
            });
        }
        await category.restore();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Category restored successfully',
            data: { category },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const searchCategories = async (req, res) => {
    const { name } = req.query;
    try {
        const categories = await Category.findAll({
            where: { category_name: { [Op.iLike]: `%${name}%` } },
        });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Categories fetched successfully',
            data: { categories },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const getCategoriesWithSubCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: {
                model: SubCategory,
                as: 'subCategories'
            }
        });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Categories with subcategories fetched successfully',
            data: { categories },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

module.exports = {
    createCategory,
    getCategoryById,
    getCategoriesByPagination,
    updateCategory,
    deleteCategory,
    getTrashListCategories,
    permanentlyDeleteCategoryById,
    multiDeleteCategoriesPermanently,
    restoreCategory,
    searchCategories,
    getCategoriesWithSubCategories,
};
