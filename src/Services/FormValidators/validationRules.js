const { body, validationResult } = require('express-validator');
const validator = require('validator');

const { User } = require('../../Models/Index');
const formatErrors = require('../Utils/formErrorFormat');

const customValidationRules = (formtype) => {
    switch (formtype) {
        case 'registration':
            return [
                body('fullname').custom((value, { req }) => {
                    if (!value) {
                        throw new Error('Full Name is required');
                    }
                    return true;
                }),
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
        case 'login':
            return [
                body('email').custom(async (value, { req }) => {
                    if (!value) {
                        throw new Error('Email or username is required');
                    }
                    return true;
                }),
                body('password')
                    .notEmpty().withMessage('Password or Mpin is required'),
            ];
        case 'forgetPassword':
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
        case 'resetPassword':
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
            ];
        case 'otp':
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
            ];
        case 'email':
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
            ];
        case 'mobile':
            return [
                body('mobile').custom(async (value, { req }) => {
                    if (!value) {
                        throw new Error('mobile is required');
                    }
                    if (!validator.isMobilePhone(value, 'any')) {
                        throw new Error('Enter Valid Mobile');
                    }
                    if (!validator.isLength(value, { min: 10, max: 10 })) {
                        throw new Error('Enter Valid 10 digit Mobile Number');
                    }
                    const existingUser = await User.findOne({ where: { phone: value } });
                    if (existingUser) {
                        throw new Error('mobile Exists, Use different mobile');
                    }
                    return true;
                })
            ];
        case 'role':
            return [
                body('role_name').custom((value, { req }) => {
                    if (!value) {
                        throw new Error('Role name is required');
                    }
                    return true;
                })
            ];
        case 'product':
            return [
                body('product_name')
                    .notEmpty()
                    .withMessage('Product name is required')
                    .bail()
                    .isLength({ max: 255 })
                    .withMessage('Product name must be less than 255 characters'),
                
                body('description')
                    .optional()
                    .isLength({ max: 1000 })
                    .withMessage('Description must be less than 1000 characters'),
                
                body('price')
                    .notEmpty()
                    .withMessage('Price is required')
                    .bail()
                    .isFloat({ gt: 0 })
                    .withMessage('Price must be a positive number'),
                
                body('category_id')
                    .notEmpty()
                    .withMessage('Category ID is required')
                    .bail()
                    .isInt()
                    .withMessage('Category ID must be an integer'),
        
                body('sku')
                    .optional()
                    .isLength({ max: 255 })
                    .withMessage('SKU must be less than 255 characters'),
                
                body('product_image')
                    .optional()
                    .custom((value, { req }) => {
                        if (req.file && !req.file.mimetype.startsWith('image/')) {
                            throw new Error('Only image files are allowed');
                        }
                        return true;
                    })
            ];
        case 'inventory':
            return [
                body('product_id')
                    .notEmpty()
                    .withMessage('Product ID is required')
                    .bail()
                    .isInt()
                    .withMessage('Product ID must be an integer'),
        
                body('quantity')
                    .notEmpty()
                    .withMessage('Quantity is required')
                    .bail()
                    .isInt({ gt: 0 })
                    .withMessage('Quantity must be a positive integer'),
                
                body('max_quantity')
                    .optional()
                    .isInt({ gt: 0 })
                    .withMessage('Maximum quantity must be a positive integer'),
                
                body('min_quantity')
                    .notEmpty()
                    .withMessage('Min Qunatity is required')
                    .bail()
                    .isInt({ gt: 0 })
                    .withMessage('Minimum quantity must be a positive integer'),
            ];
        case 'category':
            return [
                body('category_name').custom(async (value, { req }) => {
                    if (!value) {
                        throw new Error('category name is required');
                    }
                    
                    return true;
                })
            ];
        case '':
        case '':
        case '':
        case '':
        case '':
    }

};


const validate = (formType) => {
    return [
        ...customValidationRules(formType),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'failed',
                    statusCode: 400,
                    message: "Validation Failed",
                    errors: formatErrors(errors.array()),
                });
            }
            next();
        }
    ];
};


module.exports = validate;