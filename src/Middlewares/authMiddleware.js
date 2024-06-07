const jwt = require('jsonwebtoken');
const { jwtConfigs } = require('../Configs/jwt');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ 
            status: 'failed', 
            statusCode: 401, 
            message: 'Authentication failed. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, jwtConfigs.secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            status: 'failed', 
            statusCode: 401, 
            message: 'Authentication failed. Invalid token.' 
        });
    }
};

module.exports = authenticate;
