const express = require('express');
const { sendWelcomeEmail } = require('../Controllers/testController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Admin access' });
});

router.post('/welcome-email', sendWelcomeEmail);

module.exports = router;