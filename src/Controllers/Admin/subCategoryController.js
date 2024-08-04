const { Op } = require('sequelize');
const { Category, SubCategory } = require('../../Models/Index');

const createSubCategory = async (req, res) => {
    const { sub_category_name, categoryId } = req.body;
    try {
        const existingSubCategory = await SubCategory.findOne({ where: { sub_category_name, categoryId } });
        if (existingSubCategory) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'SubCategory already exists',
                errors: [{ message: 'SubCategory with this name already exists in this category' }],
            });
        }
        const subCategory = await SubCategory.create({ sub_category_name, categoryId });
        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'SubCategory created successfully',
            data: { subCategory },
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

const getSubCategoryById = async (req, res) => {
    const { subCategoryId } = req.params;
    try {
        const subCategory = await SubCategory.findByPk(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'SubCategory Not Found',
                errors: [{ message: 'SubCategory Not Found' }],
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'SubCategory fetched successfully',
            data: { subCategory },
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

const getSubCategoriesByPagination = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    try {
        const { count, rows: subCategories } = await SubCategory.findAndCountAll({
            limit,
            offset,
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'SubCategories fetched successfully',
            data: {
                subCategories,
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

const updateSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const { sub_category_name, categoryId } = req.body;
    try {
        const subCategory = await SubCategory.findByPk(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'SubCategory Not Found',
                errors: [{ message: 'SubCategory Not Found' }],
            });
        }
        if (subCategory.sub_category_name === sub_category_name && subCategory.categoryId === categoryId) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'SubCategory with this name already exists in this category',
                errors: [{ message: 'SubCategory with this name already exists in this category' }],
            });
        }
        await subCategory.update({ sub_category_name, categoryId });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'SubCategory updated successfully',
            data: { subCategory },
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

const deleteSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    try {
        const subCategory = await SubCategory.findByPk(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'SubCategory Not Found',
                errors: [{ message: 'SubCategory Not Found' }],
            });
        }
        await subCategory.update({ deletedAt: new Date() });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'SubCategory deleted successfully',
            data: { subCategory },
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

const getTrashListSubCategories = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    try {
        const { count, rows: subCategories } = await SubCategory.findAndCountAll({
            where: { deletedAt: { [Op.not]: null } },
            limit,
            offset,
            paranoid: false,
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Trashed subcategories fetched successfully',
            data: {
                subCategories,
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

const permanentlyDeleteSubCategoryById = async (req, res) => {
    const { subCategoryId } = req.params;
    try {
        const subCategory = await SubCategory.findByPk(subCategoryId, { paranoid: false });
        if (!subCategory) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'SubCategory Not Found',
                errors: [{ message: 'SubCategory Not Found' }],
            });
        }
        await subCategory.destroy({ force: true });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'SubCategory permanently deleted successfully',
            data: { subCategory },
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

const multiDeleteSubCategoriesPermanently = async (req, res) => {
    const { subCategoryIds } = req.body;
    try {
        await SubCategory.destroy({
            where: { id: subCategoryIds },
            force: true,
            paranoid: false,
        });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'SubCategories permanently deleted successfully',
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

const restoreSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    try {
        const subCategory = await SubCategory.findByPk(subCategoryId, { paranoid: false });
        if (!subCategory || !subCategory.deletedAt) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'SubCategory not found or not deleted',
                errors: [{ message: 'SubCategory not found or not deleted' }],
            });
        }
        await subCategory.restore();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'SubCategory restored successfully',
            data: { subCategory },
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

const searchSubCategories = async (req, res) => {
    const { name } = req.query;
    try {
        const subCategories = await SubCategory.findAll({
            where: { sub_category_name: { [Op.iLike]: `%${name}%` } },
        });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'SubCategories fetched successfully',
            data: { subCategories },
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
    createSubCategory,
    getSubCategoryById,
    getSubCategoriesByPagination,
    updateSubCategory,
    deleteSubCategory,
    getTrashListSubCategories,
    permanentlyDeleteSubCategoryById,
    multiDeleteSubCategoriesPermanently,
    restoreSubCategory,
    searchSubCategories,
};
