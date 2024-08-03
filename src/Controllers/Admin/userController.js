
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
// create user by admin



const User = require('../Models/User');

const getProfile = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await User.findByPk(user_id);
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Profile fetch successfully',
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

const updateProfile = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await User.findByPk(user_id);
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

module.exports = {
    getProfile,
    updateProfile
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