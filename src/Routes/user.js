const express = require('express');
const { sendWelcomeEmail } = require('../Controllers/testController');
const { getUserProfile } = require('../Controllers/userController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Admin access' });
});

router.post('/welcome-email', sendWelcomeEmail);
router.get('/users', getUserProfile);

module.exports = router;