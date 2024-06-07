const express = require('express');
const { sendWelcomeEmail } = require('../Controllers/testController');
const { getProfile, updateProfile } = require('../Controllers/UserController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Admin access' });
});

router.post('/welcome-email', sendWelcomeEmail);
router.get('/profile/:user_id', getProfile);
router.put('/update-profile/:user_id', updateProfile);

module.exports = router;