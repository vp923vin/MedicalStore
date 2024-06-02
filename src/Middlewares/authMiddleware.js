const jwt = require('jsonwebtoken');
const { User } = require('../Models/userModel');
const { jwtConfigs } = require('../Configs/jwt');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtConfigs.secret);
        const user = await User.findOne({ where: { id: decoded.id, access_token: token } });

        if (!user) {
            throw new Error('Authentication failed.');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = authMiddleware;
