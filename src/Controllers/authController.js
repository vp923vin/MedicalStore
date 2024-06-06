const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const User = require('../Models/userModel');
const Role = require('../Models/userRoleModel');
const { appConfig } = require('../Configs/app');
const { generateToken } = require('../Services/Utils/jwtToken');
const { hashPassword, comparePassword } = require('../Services/Utils/hashPasswordService');
const formatErrors = require('../Services/Utils/formErrorFormat');


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
        res.status(200).json({
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

        const token = await generateToken(user);
        
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `Click on the link to reset your password: ${resetLink}`
        });
        res.status(200).json({ message: 'Password reset link sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login
}