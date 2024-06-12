const { check, body, validationResult } = require('express-validator');
const validator = require('validator');

const inventoryValidationRules = () => {
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
};

module.exports = { inventoryValidationRules };
