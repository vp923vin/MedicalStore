const ejs = require('ejs');
const path = require('path');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

const { User, Role, OTPManager } = require('../Models/Index');

const { appConfig } = require('../Configs/app');
const { generateToken, generatePayloadToken, decodeToken } = require('../Services/Utils/jwtToken');
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
        const result = await OTPManager.findOne({ where: { auth_token: email, otp_reason: 'email_verify' } });
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            phone_number: mobile,
            role_id: customerRole.role_id,
            email_verified_at: result ? new Date() : null,
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
        const user = await User.scope('withPassword').findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Validation Failed',
                errors: [
                    { message: 'Invalid email or password' }
                ]
            });
        }
        const passCompare = await comparePassword(password, user.password);
        if (!passCompare) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Validation Failed',
                errors: [
                    { message: 'Invalid email or password' }
                ]
            });
        }
        if(user.is_active !== 'active'){
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
        console.error('Error in login function:', error);
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const verifyEmail = async (req, res) => {
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
        const otp = generateRandomNumber();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min. expiration
        const token = await generatePayloadToken({
            user: 'new_user',
            user_email: email,
            otp_reason: 'email_verify',
            otp_expiry: otpExpiry
        });

        await OTPManager.create({
            user_id: null,
            otp: otp,
            auth_token: token,
            otp_reason: 'email_verify',
            createdAt: new Date(),
            expiresAt: otpExpiry
        });

        const emailTemplatePath = path.join(__dirname, '..', 'Views', 'emails', 'otpSend.ejs');

        const emailTemplate = await ejs.renderFile(emailTemplatePath, {
            name: 'user',
            otp: otp,
            otp_expiry: otpExpiry,
            appName: appConfig.appName
        });

        const subject = 'Email Verification - OTP';
        const text = `Email Verification - OTP`;
        await sendMail(email, subject, text, emailTemplate);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Verification email sent successfully',
            data: { 
                token: token, 
                otp_expiry: otpExpiry 
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

const verifyEmailOTP = async (req, res) => {
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

    const { otp } = req.body;
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            status: 'failed',
            statusCode: 401,
            message: 'Unauthorized',
            errors: [{ message: 'Unauthorized' }],
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await decodeToken(token);
        const otpRecord = await OTPManager.findOne({
            where: {
                otp: otp,
                auth_token: token,
                otp_reason: 'email_verify',
                expiresAt: { [Op.gt]: new Date() }
            }
        });

        if (!otpRecord) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Invalid or Expired OTP ',
                errors: [{ message: 'Invalid or Expired OTP' }]
            });
        }

        await otpRecord.update({
            auth_token: decoded.user_email,
            otp: null,
            expiresAt: null
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Email verified successfully',
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
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
        const token = await generatePayloadToken({
            user_id: user.user_id,
            otp_expiry: otpExpiry,
            otp_reason: 'password_reset',
        });
        await OTPManager.create({
            user_id: user.user_id,
            otp: otp,
            auth_token: token,
            otp_reason: 'password_reset',
            createdAt: new Date(),
            expiresAt: otpExpiry
        });
        const emailTemplatePath = path.join(__dirname, '..', 'Views', 'emails', 'otpSend.ejs');

        const emailTemplate = await ejs.renderFile(emailTemplatePath, {
            name: user.username,
            otp: otp,
            otp_expiry: otpExpiry,
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
                otp_expiry: otpExpiry,
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

const verifyOTP = async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            status: 'failed',
            statusCode: 401,
            message: 'Unauthorized',
            errors: [{message: 'Unauthorized'}]
        });
    }

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

    const token = authHeader.split(' ')[1];
    const { otp } = req.body;

    try {
        const decoded = await decodeToken(token);
        const otpEntry = await OTPManager.findOne({
            where: {
                user_id: decoded.user_id,
                otp: otp,
                auth_token: token,
                otp_reason: decoded.otp_reason,
                expiresAt: { [Op.gt]: new Date() }
            }
        });

        if (!otpEntry) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Invalid or expired OTP',
            });
        }
        const genNewToken = await generatePayloadToken({
            user_id: decoded.user_id,
            otp_expiry: 'Expired',
            otp_reason: 'password_reset',
        });
        await otpEntry.update({
            otp: null,
            expiresAt: null,
            auth_token: genNewToken,
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'OTP verified successfully',
            data: { token: genNewToken }
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

const resendOTP = async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            status: 'failed',
            statusCode: 401,
            message: 'Unauthorized',
            errors: [{message: 'Unauthorized'}]
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await decodeToken(token);
        const user = await User.findByPk(decoded.user_id);
        if (!user) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'User Not Exists',
                errors: [{ message: 'User Not Exists' }]
            });
        }

        const otp = generateRandomNumber();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
        const genNewToken = await generatePayloadToken({
            user_id: user.user_id,
            otp_expiry: otpExpiry,
            otp_reason: 'password_reset',
        });
        await OTPManager.update({
            otp: otp,
            auth_token: genNewToken,
            expiresAt: otpExpiry,
            createdAt: new Date(),
        }, {
            where: { 
                auth_token: token, 
                otp_reason: 'password_reset', 
                user_id: user.user_id,
            }
        });

        const emailTemplatePath = path.join(__dirname, '..', 'Views', 'emails', 'otpSend.ejs');

        const emailTemplate = await ejs.renderFile(emailTemplatePath, {
            name: user.username,
            otp: otp,
            otp_expiry: otpExpiry,
            appName: appConfig.appName
        });

        const subject = 'Forget Password - OTP Resend';
        const text = `Forget Password - OTP Resend`;
        await sendMail(user.email, subject, text, emailTemplate);
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'OTP resent successfully',
            data: { 
                token: genNewToken, 
                otp_expiry: otpExpiry,
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

const resetPassword = async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            status: 'failed',
            statusCode: 401,
            message: 'Unauthorized',
            errors: [{message: 'Unauthorized'}]
        });
    }
    
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

    const token = authHeader.split(' ')[1];
    const decoded = await decodeToken(token);
    if(decoded.otp_expiry != 'Expired'){
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: 'Invalid Request',
            errors: [{ message: 'Invalid Request'}]
        });
    }
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: 'Passwords do not match',
            errors: [{ message: 'Passwords do not match'}]
        });
    }

    try {
        const otpEntry = await OTPManager.findOne({
            where: {
                user_id: decoded.user_id,
                otp: null,
                auth_token: token,
                otp_reason: 'password_reset',
                expiresAt: null,
            }
        });

        if (!otpEntry) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Invalid or expired OTP',
                errors: [{ message: 'Invalid or expired OTP'}]
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        await User.update({ password: hashedPassword }, { where: { user_id: decoded.user_id } });
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Password reset successfully',
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

const logout = async (req, res) => { 

};

module.exports = {
    register,
    login,
    verifyEmail,
    verifyEmailOTP,
    forgetPassword,
    verifyOTP,
    resendOTP,
    resetPassword,
    logout
}