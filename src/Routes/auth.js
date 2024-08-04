const express = require('express');
const {
    register,
    verifyEmail,
    verifyEmailOTP,
    resendEmailOTP,
    verifyMobile,
    verifyMobileOTP,
    resendMobileOTP
} = require('../Controllers/Auth/registerController');
const {
    forgetPassword,
    verifyOTP,
    resendOTP,
    resetPassword
} = require('../Controllers/Auth/resetPasswordController');

const { login } = require('../Controllers/Auth/loginController');
const validate = require('../Services/FormValidators/validationRules');
const router = express.Router();


router.get('/', (req, res) => {
    res.send("Hello, world!");
});

router.post('/register', validate('registration'), register);
router.post('/login', validate('login'), login);
router.post('/forget-password', validate('forgetPassword'), forgetPassword);
router.post('/verify-otp', validate('otp'), verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/reset-password', validate('resetPassword'), resetPassword);
router.post('/verify-email', validate('email'), verifyEmail);
router.post('/verify-email-otp', validate('otp'), verifyEmailOTP);
router.post('/resend-email-otp', resendEmailOTP);
router.post('/verify-mobile', validate('mobile'), verifyMobile);
router.post('/verify-mobile-otp', validate('otp'), verifyMobileOTP);
router.post('/resend-mobile-otp', resendMobileOTP);
module.exports = router;