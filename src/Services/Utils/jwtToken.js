require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfigs = require('../../Configs/jwt');
const secretKey = process.env.JWT_SECRET_KEY

const generateToken = (user) => {
    try {
        const token = jwt.sign({ id: user.user_id, role: user.role_id }, secretKey, { expiresIn: '1h' });
        console.log(token);
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

const generatePayloadToken = (payload) => {
    try {
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        console.log(token);
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

module.exports = {
    generateToken,
    generatePayloadToken
}