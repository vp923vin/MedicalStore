const ejs = require('ejs');
const path = require('path');
const { User, Role, OTPManager } = require('../../Models/Index');
const { appConfig } = require('../../Configs/app');
const { hashPassword } = require('../../Services/Utils/hashPasswordService');
const { generatePayloadToken, decodeToken } = require('../../Services/Utils/jwtToken');
const { generateRandomUsername, generateMPIN, isOTPExpired, generateRandomNumber } = require('../../Services/Utils/functions');
const { sendMail } = require('../../Services/Utils/mailService');
const sendMobileMessage = require('../../Services/Utils/sendMobileOtp');

const register = async (req, res) => {
    const { fullname, username, email, password, mobile } = req.body;
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
        const result = await OTPManager.findOne({ where: { auth_token: email, otp_reason: 'email_verify', otp_status: 'verified' } });
        const mobileVer = await OTPManager.findOne({ where: { auth_token: mobile, otp_reason: 'mobile_verify', otp_status: 'verified' } });
        let newUsername = username || generateRandomUsername(fullname);
        while (await User.findOne({ where: { username: newUsername } })) {
            newUsername = generateRandomUsername(fullname);
        }

        const mpin = generateMPIN() + '';
        const encrytMPIN = await hashPassword(mpin);
        const user = await User.create({
            fullname,
            username: newUsername,
            email,
            password: hashedPassword,
            mpin: encrytMPIN,
            phone: mobile,
            role_id: customerRole.role_id,
            email_verified_at: result ? new Date() : null,
            mobile_verified_at: mobileVer ? new Date() : null,
        });

        if(user){
            const emailTemplatePath = path.join(__dirname, '../..', 'Views', 'emails', 'register.ejs');
    
            const emailTemplate = await ejs.renderFile(emailTemplatePath, {
                name: fullname,
                username: newUsername,
                email,
                password,
                mpin,
                appName: appConfig.appName
            });
    
            const subject = 'User Registeration';
            const text = `User Registeration`;
            await sendMail(email, subject, text, emailTemplate);
    
            return res.status(201).json({
                status: 'success',
                statusCode: 201,
                message: 'User registered successfully',
            });
        }else{
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Something went wrong in server, Please try again after Some time',
                errors: [{message: 'Unable to Register User'}]
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            errors: error.message
        });
    }
}; // completed

const verifyEmail = async (req, res) => {
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
            otp_status: 'delivered',
            createdAt: new Date(),
            expiresAt: otpExpiry
        });

        const emailTemplatePath = path.join(__dirname, '../..', 'Views', 'emails', 'otpSend.ejs');

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
}; // completed

const verifyEmailOTP = async (req, res) => {
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
                otp_reason: 'email_verify'
            },
            order: [['otp_id', 'DESC']],
            limit: 1
        });

        if (!otpRecord) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Invalid OTP',
                errors: [{ message: 'Invalid OTP' }]
            });
        }
        if(isOTPExpired(otpRecord.expiresAt)) {
            const newToken = await generatePayloadToken({
                otp: null,
                otp_reason: 'email_verify',
                otp_status: 'failed',
                otp_expiry: 'Expired',
                user_email: decoded.user_email,
            });
            await otpRecord.update({
                otp: null,
                otp_reason: 'email_verify',
                otp_expiry: 'Expired',
                auth_token: decoded.user_email,
                otp_status: 'failed',
                expiresAt: null
            });
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'OTP Expired',
                data: {
                    token: newToken,
                }
            });
        }else{
            await otpRecord.update({
                otp: null,
                otp_reason: 'email_verify',
                otp_expiry: 'Verified',
                auth_token: decoded.user_email,
                otp_status: 'Verified',
                expiresAt: null
            });
    
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Email verified successfully',
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

const resendEmailOTP = async function(req, res) {
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
        console.log("token", decoded);
        const otpRecord = await OTPManager.findOne({
            where: {
                otp: null,
                otp_reason: 'email_verify',
                otp_expiry: 'Expired',
                auth_token: decoded.user_email,
                otp_status: 'failed',
                expiresAt: null
            },
            order: [['otp_id', 'DESC']],
            limit: 1
        });
        console.log("record", otpRecord);
        if (!otpRecord) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Invalied request',
                errors: [{ message: 'Invalied request' }]
            });
        }
        const otp = generateRandomNumber();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min. expiration
        const newToken = await generatePayloadToken({
            otp: otp,
            user: 'new_user',
            user_email: decoded.user_email,
            otp_reason: 'email_verify',
            otp_status: 'resend_email',
            otp_expiry: otpExpiry
        });

        await otpRecord.update({
            otp: otp,
            otp_reason: 'email_verify',
            otp_expiry: null,
            auth_token: newToken,
            otp_status: 'resend',
            expiresAt: otpExpiry
        });
    
        const emailTemplatePath = path.join(__dirname, '../..', 'Views', 'emails', 'otpSend.ejs');
        const emailTemplate = await ejs.renderFile(emailTemplatePath, {
            name: 'user',
            otp: otp,
            otp_expiry: otpExpiry,
            appName: appConfig.appName
        });

        const subject = 'Resend Email Verification - OTP';
        const text = `Resend Email Verification - OTP`;
        await sendMail(decoded.user_email, subject, text, emailTemplate);
        

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Verification OTP resent successfully',
            data: { 
                token: newToken, 
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
}; // completed

const verifyMobile = async function(req, res) {
    const { mobile } = req.body;
    try {
        const otp = generateRandomNumber();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min. expiration
        const token = await generatePayloadToken({
            user: 'new_user',
            user_mobile: mobile,
            otp_reason: 'mobile_verify',
            otp_expiry: otpExpiry
        });

        await OTPManager.create({
            user_id: null,
            otp: otp,
            auth_token: token,
            otp_reason: 'mobile_verify',
            otp_status: 'delivered',
            createdAt: new Date(),
            expiresAt: otpExpiry
        });

        const message = `Your OTP for mobile verification is ${otp}. It will expire in 15 minutes.`;
        const sendStatus = await sendMobileMessage(message, mobile);
    
        if (sendStatus) {
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Verification SMS sent successfully',
                data: { 
                    token: token, 
                    otp_expiry: otpExpiry,
                    message: 'Mobile OTP sent successfully'
                }
            });
        } else {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Unable to send OTP. Please try again later.',
                data: { 
                    token: token, 
                    otp_expiry: otpExpiry,
                    message: 'Unable to send OTP on your device'
                }
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

const verifyMobileOTP = async function(req, res) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const formattedErrors = formatErrors(errors.array());
    //     return res.status(400).json({
    //         status: 'failed',
    //         statusCode: 400,
    //         message: "Validation Failed",
    //         errors: formattedErrors,
    //     });
    // }

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
                otp_reason: 'mobile_verify'
            },
            order: [['otp_id', 'DESC']],
            limit: 1

        });

        if (!otpRecord) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Invalid OTP',
                errors: [{ message: 'Invalid OTP' }]
            });
        }

        if(isOTPExpired(otpRecord.expiresAt)){
            const newToken = await generatePayloadToken({
                user_mobile: decoded.user_mobile,
                otp_expiry: 'Expired',
                otp_reason: 'mobile_verify',
                otp_status: 'failed',
            });
            await otpRecord.update({
                otp: null,
                auth_token: decoded.user_mobile,
                otp_status: 'failed',
                expiresAt: null
            });
    
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'OTP Expired, Resend OTP',
                data: {
                    token: newToken,
                }
            });
        }else{
            await otpRecord.update({
                otp: null,
                auth_token: decoded.user_mobile,
                otp_status: 'verified',
                expiresAt: null
            });
    
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Mobile verified successfully',
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

const resendMobileOTP = async function(req, res) {
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
        const decoded = await decodeToken(token);

        // Find the expired OTP record
        const otpRecord = await OTPManager.findOne({
            where: {
                otp_reason: 'mobile_verify',
                otp: null,
                auth_token: decoded.user_mobile
            },
            order: [['otp_id', 'DESC']],
            limit: 1,
        });

        if (!otpRecord) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Invalid request',
                errors: [{ message: 'Invalid request' }]
            });
        }

        const otp = generateRandomNumber();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiration
        const newToken = await generatePayloadToken({
            user: 'new_user',
            user_mobile: decoded.user_mobile,
            otp_reason: 'mobile_verify',
            otp_expiry: otpExpiry
        });

        await otpRecord.update({
            otp: otp,
            otp_status: 'resend',
            otp_reason: 'mobile_verify',
            auth_token: newToken,
            expiresAt: otpExpiry
        });

        const message = `Your OTP for mobile verification is ${otp}. It will expire in 15 minutes.`;
        const sendStatus = await sendMobileMessage(message, decoded.user_mobile);

        if (sendStatus) {
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Verification SMS resent successfully',
                data: {
                    token: newToken,
                    otp_expiry: otpExpiry,
                    message: 'Mobile OTP resent successfully'
                }
            });
        } else {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Unable to resend OTP. Please try again later.',
                data: {
                    token: newToken,
                    otp_expiry: otpExpiry,
                    message: 'Unable to resend OTP on your device'
                }
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

module.exports = {
    register,
    verifyEmail,
    verifyEmailOTP,
    resendEmailOTP,
    verifyMobile,
    verifyMobileOTP,
    resendMobileOTP
};