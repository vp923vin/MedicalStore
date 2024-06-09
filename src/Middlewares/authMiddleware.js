const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const Role = require('../Models/userRoleModel');
const { jwtConfigs } = require('../Configs/jwt');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            status: 'failed',
            statusCode: 401,
            message: 'Unauthorized',
            errors: [{ message: 'Unauthorized' }]
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwtConfigs.secretKey );
        const user = await User.findByPk(decoded.id, {
            include: [{ model: Role, attributes: ['role_name'] }]
        });
        if (!user) {
            return res.status(401).json({
                status: 'failed',
                statusCode: 401,
                message: 'User not found',
                errors: [{ message: 'User not found' }]
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'failed',
            statusCode: 401,
            message: 'Invalid token',
            error: error.message,
        });
    }
};

module.exports = authMiddleware;
