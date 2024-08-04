const { User, Role } = require('../../Models/Index');

const addUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'User added successfully',
            data: { user }
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

const listUsersByPagination = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const { rows, count } = await User.findAndCountAll({
            offset,
            limit,
            include: {
                model: Role,
                attributes: ['role_name']
            }
        });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Users fetched successfully',
            data: { users: rows, total: count }
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

const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId, {
            include: {
                model: Role,
                attributes: ['role_name']
            }
        });
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User profile fetched successfully',
            data: { user }
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

const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'User not found'
            });
        }
        await user.update(req.body);
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User profile updated successfully',
            data: { user }
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

const tempDeleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'User not found'
            });
        }
        await user.destroy();
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User temporarily deleted successfully',
            data: { user }
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

const bulkTempDeleteUsers = async (req, res) => {
    const { userIds } = req.body;
    try {
        const users = await User.findAll({
            where: { user_id: { [Op.in]: userIds } }
        });
        if (users.length === 0) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Users not found'
            });
        }
        await User.destroy({
            where: { user_id: { [Op.in]: userIds } }
        });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Users temporarily deleted successfully',
            data: { users }
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

const permanentlyDeleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId, { paranoid: false });
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'User not found'
            });
        }
        await user.destroy({ force: true });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User permanently deleted successfully',
            data: { user }
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

const permanentlyMultiDeleteUsers = async (req, res) => {
    const { userIds } = req.body;
    try {
        const users = await User.findAll({
            where: { user_id: { [Op.in]: userIds } },
            paranoid: false
        });
        if (users.length === 0) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Users not found'
            });
        }
        await User.destroy({
            where: { user_id: { [Op.in]: userIds } },
            force: true
        });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Users permanently deleted successfully',
            data: { users }
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

const restoreUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId, { paranoid: false });
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'User not found'
            });
        }
        await user.restore();
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User restored successfully',
            data: { user }
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

const restoreMultipleUsers = async (req, res) => {
    const { userIds } = req.body;
    try {
        const users = await User.findAll({
            where: { user_id: { [Op.in]: userIds } },
            paranoid: false
        });
        if (users.length === 0) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Users not found'
            });
        }
        await User.restore({
            where: { user_id: { [Op.in]: userIds } }
        });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Users restored successfully',
            data: { users }
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

const activateUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'User not found'
            });
        }
        await user.update({ is_active: 'active' });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User activated successfully',
            data: { user }
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

const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { roleId } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'User not found'
            });
        }
        await user.update({ role_id: roleId });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User role updated successfully',
            data: { user }
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

const searchUsers = async (req, res) => {
    const { query } = req.query;
    try {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { fullname: { [Op.like]: `%${query}%` } },
                    { username: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { phone: { [Op.like]: `%${query}%` } }
                ]
            },
            include: {
                model: Role,
                attributes: ['role_name']
            }
        });
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Users searched successfully',
            data: { users }
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
    addUser,
    listUsersByPagination,
    getUserById,
    updateUserProfile,
    tempDeleteUser,
    activateUser,
    updateUserRole,
    bulkTempDeleteUsers,
    permanentlyDeleteUser,
    permanentlyMultiDeleteUsers,
    restoreUser,
    restoreMultipleUsers,
    searchUsers
};