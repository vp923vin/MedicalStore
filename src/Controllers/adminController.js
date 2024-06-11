const { validationResult } = require('express-validator');
const User = require('../Models/userModel');
const Role = require('../Models/userRoleModel');
const formatErrors = require('../Services/Utils/formErrorFormat');

// roles defined 
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
        const existingRole = await Role.findOne({ where: { role_name } });
        if (existingRole) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Role already exists',
                errors: [
                    { message: 'Role with this name already exists' }
                ]
            });
        }
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

const getRoleById = async (req, res) => {
    const { roleId } = req.params;
    try {
        const roles = await Role.findOne({wehre: { role_id: roleId }});
        if (!roles) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: "Unable to update",
                errors: [{
                    message: "Role Not Found"
                }],
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Role get successfully',
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
        if (role.role_name === role_name) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Role already exists',
                errors: [
                    { message: 'Role with this name already exists' }
                ]
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

// user actiond by admin
const listAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: Role,
                attributes: ['role_name'],
            }
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Users fetched successfully',
            data: {all_users: users},
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message,
        });
    }
};

const getUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: "Unable to found",
                errors: [{
                    message: "User not found"
                }],
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User profile get successfully',
            data: { profile: user },
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

const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: "Unable to found",
                errors: [{
                    message: "User not found"
                }],
            });
        }
        await user.update(req.body);
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Profile updated successfully',
            data: { updated_profile: user },
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

const deleteUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: "Unable to fetch",
                errors: [{
                    message: "User not found"
                }],
            });
        }
        await user.destroy();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User deleted successfully',
            data: { deleted_user: user },
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
    getRoleById,
    updateRole,
    deleteRole,
    listAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};