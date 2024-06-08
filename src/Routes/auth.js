const express = require('express');
const {
    register,
    login,
    verifyEmail,
    verifyEmailOTP,
    forgetPassword,
    verifyOTP,
    resendOTP,
    resetPassword,
    logout
} = require('../Controllers/authController');
const { 
    registerValidationRules, 
    loginValidationRules, 
    forgetPasswordValidationRules,
    passwordValidationRules

} = require('../Services/FormValidators/authValidation');
const {
    emailValidatorRules,
    otpValidatorRules
} = require('../Services/FormValidators/customValidation');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello, world!");
});

router.post('/register', registerValidationRules(),  register);
router.post('/login', loginValidationRules(),  login);
router.post('/forget-password', forgetPasswordValidationRules(),  forgetPassword);
router.post('/verify-otp', otpValidatorRules(), verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/reset-password', passwordValidationRules(), resetPassword);
router.post('/verify-email', emailValidatorRules(), verifyEmail);
router.post('/verify-email-otp', otpValidatorRules(), verifyEmailOTP);
module.exports = router;