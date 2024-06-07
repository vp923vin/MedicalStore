const { validationResult } = require('express-validator');
const Role = require('../Models/userRoleModel');
const formatErrors = require('../Services/Utils/formErrorFormat');

const createRole = async (req, res) => {
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
    const { role_name } = req.body;
    try {
        const role = await Role.create({ role_name });
        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'Role created successfully',
            data: { role: role },
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

const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'All roles get successfully',
            data: { role: roles },
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

const updateRole = async (req, res) => {
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
    const { roleId } = req.params;
    const { role_name } = req.body;
    try {
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: "Unable to update",
                errors: [{
                    message: "Role Not Found"
                }],
            });
        }
        await role.update({ role_name });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Role Updated successfully',
            data: { update_role: role },
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

const deleteRole = async (req, res) => {
    const { roleId } = req.params;
    try {
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: "Unable to update",
                errors: [{
                    message: "Role Not Found"
                }],
            });
        }
        await role.destroy();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Role deleted successfully',
            data: { deleted_role: role },
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
    createRole,
    getRoles,
    updateRole,
    deleteRole
};