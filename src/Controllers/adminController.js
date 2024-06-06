const Role = require('../Models/userRoleModel');

const createRole = async (req, res) => {
    const { role_name } = req.body;
    try {
        const role = await Role.create({ role_name });
        res.status(201).json({
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

module.exports = {
    createRole,

};