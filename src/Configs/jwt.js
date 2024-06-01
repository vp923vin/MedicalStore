require('dotenv').config();
module.exports = {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: '1h',
};