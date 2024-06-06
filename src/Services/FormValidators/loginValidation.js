const { body } = require('express-validator');
const validator = require('validator');
const User = require('../../Models/userModel');

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
        if (existingUser) {
            throw new Error('Invalid email or Password');
        }
        return true;
      }),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ];
};

module.exports = {
  loginValidationRules,
};
