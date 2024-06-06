const express = require('express');
const { register, login, forgetPassword } = require('../Controllers/authController');
const { 
    registerValidationRules, 
    loginValidationRules, 
    forgetPasswordValidationRules 

} = require('../Services/FormValidators/authValidation');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello, world!");
});

router.post('/register', registerValidationRules(),  register);
router.post('/login', loginValidationRules(),  login);
router.post('/forget-password', forgetPasswordValidationRules(),  forgetPassword);
module.exports = router;