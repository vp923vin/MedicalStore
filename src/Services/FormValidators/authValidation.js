const { body } = require('express-validator');
const validator = require('validator');
const User = require('../../Models/User');

const forgetPasswordValidationRules = () => {
    return [
        body('email').custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Email is required');
            }
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
            const existingUser = await User.findOne({ where: { email: value } });
            if (!existingUser) {
                throw new Error('User Not Exists');
            }
            return true;
        })
    ];
};

const loginValidationRules = () => {
    return [
        body('email').custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Email is required');
            }
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
            const existingUser = await User.findOne({ where: { email: value } });
            if (!existingUser) {
                throw new Error('Invalid email or Password');
            }
            return true;
        }),
        body('password')
            .notEmpty().withMessage('Password is required'),
    ];
};

const registerValidationRules = () => {
    return [
        body('username').custom((value, { req }) => {
            if (!value) {
                throw new Error('Username is required');
            }
            return true;
        }),
        body('email').custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Email is required');
            }
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
            const existingUser = await User.findOne({ where: { email: value } });
            if (existingUser) {
                throw new Error('Email is already in use');
            }
            return true;
        }),
        body('password').custom((value, { req }) => {
            if (!value) {
                throw new Error('Password is required');
            }
            if (value.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }
            return true;
        }),
        body('mobile').custom((value, { req }) => {
            if (!value) {
                throw new Error('Mobile number is required');
            }
            if (!validator.isMobilePhone(value)) {
                throw new Error('Invalid mobile phone number format');
            }
            return true;
        }),
    ];
};

const passwordValidationRules = () => {
    return [
        body('newPassword').custom(async (value, { req }) => {
            if (!value) {
                throw new Error('New Password is required');
            }
        }),
        body('confirmPassword').custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Confirm Password is required');
            }
        })
    ]
};

module.exports = {
    registerValidationRules,
    loginValidationRules,
    forgetPasswordValidationRules,
    passwordValidationRules
}