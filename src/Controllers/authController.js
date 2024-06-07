const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const ejs = require('ejs');
const path = require('path');

const User = require('../Models/userModel');
const Role = require('../Models/userRoleModel');
const OtpManager = require('../Models/otpManager');

const { appConfig } = require('../Configs/app');
const { generateToken, generatePayloadToken } = require('../Services/Utils/jwtToken');
const { hashPassword, comparePassword } = require('../Services/Utils/hashPasswordService');
const formatErrors = require('../Services/Utils/formErrorFormat');
const { sendMail } = require('../Services/Utils/mailService');
const { generateRandomNumber } = require('../Services/Utils/randomNumGen');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = formatErrors(errors.array());
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: "Validation Failed",
            errors: formattedErrors,
        });
    }
    const { username, email, password, mobile } = req.body;
    try {

        const customerRole = await Role.findOne({ where: { role_name: 'customer' } });

        if (!customerRole) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Something went wrong',
                errors: [
                    {
                        message: 'Something went wrong'
                    }
                ]
            });
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            phone_number: mobile,
            role_id: customerRole.role_id
        });

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'User registered successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            errors: error.message
        });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = formatErrors(errors.array());
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: "Validation Failed",
            errors: formattedErrors,
        });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        const passCompare = await comparePassword(password, user.password)
        if (!user || !passCompare) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Validation Failed',
                errors: [
                    {
                        message: 'Invalid email or password'
                    }
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
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const verifyEmail = async () => {

};

const forgetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = formatErrors(errors.array());
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: "Validation Failed",
            errors: formattedErrors,
        });
    }
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'User Not Exists',
                errors: [
                    {
                        message: 'User Not Exists'
                    }
                ]
            });
        }
        const otp = generateRandomNumber();
        await OtpManager.create({
            user_id: user.user_id,
            otp: otp,
            otp_reason: 'password_reset',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        });
        const token = await generatePayloadToken({
            user_id: user.user_id,
            otp_reason: 'password_reset',
        });
        const emailTemplatePath = path.join(__dirname, '..', 'Views', 'emails', 'otpSend.ejs');

        const emailTemplate = await ejs.renderFile(emailTemplatePath, {
            name: user.username,
            otp: otp,
            appName: appConfig.appName
        });
        const subject = 'Forget Password - Otp';
        const text = `Forget Password - Otp`;
        await sendMail(email, subject, text, emailTemplate);
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Password reset OTP sent successfully',
            data: {
                token: token,
            }
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

const verifyOTP = async () => { };

const resetPassword = async () => { };

const logout = async () => { };

module.exports = {
    register,
    login,
    forgetPassword,
}