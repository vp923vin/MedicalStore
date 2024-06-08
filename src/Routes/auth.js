const express = require('express');
const {
    register,
    login,
    verifyEmail,
    forgetPassword,
    verifyOTP,
    resendOTP,
    resetPassword,
    logout
} = require('../Controllers/authController');
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
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/reset-password', resetPassword);
module.exports = router;