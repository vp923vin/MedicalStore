const ejs = require('ejs');
const path = require('path');
const { User } = require('../../Models/Index');
const { appConfig } = require('../../Configs/app');
const { sendMail } = require('../../Services/Utils/mailService');
const { comparePassword, compareMPIN } = require('../../Services/Utils/hashPasswordService');
const { generateToken } = require('../../Services/Utils/jwtToken');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.scope('withSensitiveInfo').findOne({ where: { email: email } });

        if (!user) {
            user = await User.scope('withSensitiveInfo').findOne({ where: { username: email } });
        }

        if (!user) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Validation Failed',
                errors: [
                    { message: 'Invalid email or password1' }
                ]
            });
        }

        const passCompare = await comparePassword(password, user.password);
        const mpinCompare = await compareMPIN(password, user.mpin);

        if (!passCompare && !mpinCompare) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Validation Failed',
                errors: [
                    { message: 'Invalid email or password2' }
                ]
            });
        }

        if (user.is_active !== 'active') {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Account is not active',
                errors: [
                    { message: 'Account is not active' }
                ]
            });
        }

        const token = await generateToken(user);
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Login successfully',
            data: { token: token },
        });
    } catch (error) {
        // console.error('Error in login function:', error);
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
}; // completed

module.exports = { login };