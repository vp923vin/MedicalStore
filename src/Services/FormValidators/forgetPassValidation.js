const { body } = require('express-validator');
const validator = require('validator');
const User = require('../../Models/userModel');

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

module.exports = {
  forgetPasswordValidationRules,
};
