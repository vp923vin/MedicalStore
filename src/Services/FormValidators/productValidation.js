const { check, body, validationResult } = require('express-validator');
const validator = require('validator');

const productValidationRules = () => {
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
};

module.exports = { productValidationRules };
