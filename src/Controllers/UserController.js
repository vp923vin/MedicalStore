const User = require('../Models/userModel');

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