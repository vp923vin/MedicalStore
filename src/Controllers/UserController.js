const User = require('../Models/userModel');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserProfile,
};