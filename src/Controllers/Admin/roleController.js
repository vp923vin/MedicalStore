const { Op } = require('sequelize');
const { Role } = require('../../Models/Index');

const createRole = async (req, res) => {
    const { role_name } = req.body;
    try {
        const existingRole = await Role.findOne({ where: { role_name } });
        if (existingRole) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Role already exists',
                errors: [{ message: 'Role with this name already exists' }],
            });
        }
        const role = await Role.create({ role_name });
        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'Role created successfully',
            data: { role },
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

const getRoleById = async (req, res) => {
    const { roleId } = req.params;
    try {
        const role = await Role.findOne({ where: { role_id: roleId } });
        if (!role) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Role Not Found',
                errors: [{ message: 'Role Not Found' }],
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Role fetched successfully',
            data: { role },
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

const getRolesByPagination = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    try {
        const { count, rows: roles } = await Role.findAndCountAll({
            limit,
            offset,
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Roles fetched successfully',
            data: {
                roles,
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

const updateRole = async (req, res) => {
    const { roleId } = req.params;
    const { role_name } = req.body;
    try {
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Role Not Found',
                errors: [{ message: 'Role Not Found' }],
            });
        }
        if (role.role_name === role_name) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Role with this name already exists',
                errors: [{ message: 'Role with this name already exists' }],
            });
        }
        await role.update({ role_name });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Role updated successfully',
            data: { role },
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

const deleteRole = async (req, res) => {
    const { roleId } = req.params;
    try {
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Role Not Found',
                errors: [{ message: 'Role Not Found' }],
            });
        }
        await role.update({ deletedAt: new Date() });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Role deleted successfully',
            data: { role },
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

const getTrashListRoles = async (req, res) => {
    const { page = 1, size = 10 } = req.query; 
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    try {
        const { count, rows: roles } = await Role.findAndCountAll({
            where: { deletedAt: { [Op.not]: null } },
            limit,
            offset,
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Trashed roles fetched successfully',
            data: {
                roles,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
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

const permanentlyDeleteRole = async (req, res) => {
    const { roleId } = req.params;
    try {
        const role = await Role.findByPk(roleId, { paranoid: false });
        if (!role) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Role Not Found',
                errors: [{ message: 'Role Not Found' }],
            });
        }
        await role.destroy({ force: true });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Role permanently deleted successfully',
            data: { role },
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

const multiDeleteRolePermanently = async (req, res) => {
    const { roleIds } = req.body;
    try {
        await Role.destroy({
            where: { role_id: roleIds },
            force: true,
        });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Roles permanently deleted successfully',
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

const restoreRoleById = async (req, res) => {
    const { roleId } = req.params;
    try {
        const role = await Role.findByPk(roleId, { paranoid: false });
        if (!role || !role.deletedAt) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Role not found or not deleted',
                errors: [{ message: 'Role not found or not deleted' }],
            });
        }
        await role.restore();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Role restored successfully',
            data: { role },
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

const bulkRestoreRoles = async (req, res) => {
    const { roleIds } = req.body;
    try {
        const roles = await Role.findAll({
            where: { id: roleIds },
            paranoid: false,
        });
        for (const role of roles) {
            if (role.deletedAt) {
                await role.restore();
            }
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Roles restored successfully',
            data: { roles },
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

const searchRoles = async (req, res) => {
    const { name } = req.query;
    try {
        const roles = await Role.findAll({
            where: { role_name: { [Op.iLike]: `%${name}%` } },
        });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Roles fetched successfully',
            data: { roles },
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
    createRole,
    getRoleById,
    getRolesByPagination,
    updateRole,
    deleteRole,
    getTrashListRoles,
    permanentlyDeleteRole,
    multiDeleteRolePermanently,
    restoreRoleById,
    bulkRestoreRoles,
    searchRoles,
};
