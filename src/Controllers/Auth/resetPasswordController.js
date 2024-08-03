const ejs = require('ejs');
const path = require('path');
const { User, OTPManager } = require('../../Models/Index');
const { appConfig } = require('../../Configs/app');
const { generatePayloadToken, decodeToken } = require('../../Services/Utils/jwtToken');
const { hashPassword } = require('../../Services/Utils/hashPasswordService');
const { sendMail } = require('../../Services/Utils/mailService');
const { generateRandomNumber } = require('../../Services/Utils/randomNumGen');
const { isOTPExpired } = require('../../Services/Utils/functions');


const forgetPassword = async (req, res) => {
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
            otp_status: 'delivered',
        });
        await OTPManager.create({
            user_id: user.user_id,
            otp: otp,
            auth_token: token,
            otp_reason: 'password_reset',
            otp_status: 'delivered',
            createdAt: new Date(),
            expiresAt: otpExpiry
        });
        const emailTemplatePath = path.join(__dirname, '..', 'Views', 'emails', 'otpSend.ejs');

        const emailTemplate = await ejs.renderFile(emailTemplatePath, {
            name: user.fullname,
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
}; // completed

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

    const token = authHeader.split(' ')[1];
    const { otp } = req.body;

    try {
        const decoded = await decodeToken(token);
        // console.log(decoded);
        const otpEntry = await OTPManager.findOne({
            where: {
                user_id: decoded.user_id,
                otp: otp,
                auth_token: token,
                otp_reason: decoded.otp_reason,
                otp_status: decoded.otp_status
            },
            order: [['otp_id', 'DESC']],
            limit: 1
        });

        if (!otpEntry) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Invalid OTP',
            });
        }

        if(isOTPExpired(otpEntry.expiresAt)){
            const user = await User.findOne({ where: { user_id: decoded.user_id } });
            const genNewToken = await generatePayloadToken({
                user_id: decoded.user_id,
                user_email: user.email,
                otp_expiry: 'Expired',
                otp_reason: 'password_reset',
                otp_status: 'failed',
            });
            await otpEntry.update({
                otp: null,
                expiresAt: null,
                auth_token: genNewToken,
                otp_status: 'failed',
            });
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'OTP Expired, Ressend Otp',
                data: { token: genNewToken }
            });

        }else{
            const genNewToken = await generatePayloadToken({
                user_id: decoded.user_id,
                otp_expiry: 'validated',
                otp_reason: 'password_reset',
                otp_status: 'verified',
            });
            await otpEntry.update({
                otp: null,
                expiresAt: null,
                otp_expiry: 'validated',
                auth_token: genNewToken,
                otp_status: 'verified',
            });
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'OTP verified successfully',
                data: { token: genNewToken }
            });
        }
        

    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
}; // completed

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
                message: 'Invalid User',
                errors: [{ message: 'Invalid User' }]
            });
        }

        const otp = generateRandomNumber();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
        const genNewToken = await generatePayloadToken({
            user_id: user.user_id,
            otp_expiry: otpExpiry,
            otp_reason: 'password_reset',
            otp_status: 'delivered',
        });
        await OTPManager.update({
            otp: otp,
            auth_token: genNewToken,
            expiresAt: otpExpiry,
            otp_reason: 'password_reset',
            otp_status: 'delivered',
            updatedAt: new Date(),
        }, {
            where: { 
                auth_token: token, 
                otp_reason: 'password_reset', 
                user_id: user.user_id,
            },
            order: [['otp_id', 'DESC']],
            limit: 1
        });

        const emailTemplatePath = path.join(__dirname, '..', 'Views', 'emails', 'otpSend.ejs');

        const emailTemplate = await ejs.renderFile(emailTemplatePath, {
            name: user.fullname,
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
}; // completed

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

    const token = authHeader.split(' ')[1];
    const decoded = await decodeToken(token);
    if(decoded.otp_expiry != 'validated'){
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
            },
            order: [['otp_id', 'DESC']],
            limit: 1
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
}; // completed


module.exports = {
    forgetPassword,
    verifyOTP,
    resendOTP,
    resetPassword
};