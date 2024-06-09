const express = require('express');
const { sendWelcomeEmail } = require('../Controllers/testController');
const { getProfile, updateProfile } = require('../Controllers/UserController');
const authMiddleware = require('../Middlewares/authMiddleware');
const roleMiddleware = require('../Middlewares/roleMiddleware');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Admin access' });
});

router.post('/welcome-email', sendWelcomeEmail);
router.get('/profile/:user_id', authMiddleware, roleMiddleware('customer'), getProfile);
router.put('/update-profile/:user_id', authMiddleware, roleMiddleware('customer'), updateProfile);

module.exports = router;