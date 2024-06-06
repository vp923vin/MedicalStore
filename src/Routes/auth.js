const express = require('express');
const { register, login } = require('../Controllers/authController');
const { registerValidationRules } = require('../Services/FormValidators/registerValidation');
const { loginValidationRules } = require('../Services/FormValidators/loginValidation');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello, world!");
});

router.post('/register', registerValidationRules(),  register);
router.post('/login', loginValidationRules(),  login);
module.exports = router;