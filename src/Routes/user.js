const express = require('express');
const { sendWelcomeEmail } = require('../Controllers/testController');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello, world!");
});

router.post('/welcome-email', sendWelcomeEmail);

module.exports = router;