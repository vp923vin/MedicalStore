require('dotenv').config();

const jwtConfigs = {
    secretKey: process.env.JWT_SECRET_KEY,
    expiresIn: '1h',
};

module.exports = { jwtConfigs };