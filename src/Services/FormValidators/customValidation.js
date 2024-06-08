const { body } = require('express-validator');
const validator = require('validator');
const User = require('../../Models/userModel');

const emailValidatorRules = () => {
    return [
        body('email').custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Email is required');
            }
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
            const existingUser = await User.findOne({ where: { email: value } });
            if (existingUser) {
                throw new Error('Email Exists, Use different Email');
            }
            return true;
        })
    ]
};

const otpValidatorRules = () => {
    return [
        body('otp').custom(async (value, { req }) => {
            if (!value) {
                throw new Error('otp is required');
            }
            if (!validator.isNumeric(value)) {
                throw new Error('Enter numeric value');
            }
            return true;
        })
    ]
    
};

module.exports = {
    emailValidatorRules,
    otpValidatorRules
};
