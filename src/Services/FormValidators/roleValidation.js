const { body } = require('express-validator');
const validator = require('validator');
const Role = require('../../Models/User');


const roleValidationRules = () => {
    return [
        body('role_name').custom((value, { req }) => {
            if (!value) {
                throw new Error('Role name is required');
            }
            return true;
        })
    ];
};


module.exports = { 
    roleValidationRules 
};