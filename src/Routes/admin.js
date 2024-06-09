const express = require('express');

const { roleValidationRules } = require('../Services/FormValidators/roleValidation');
const { 
    createRole, 
    getRoles, 
    updateRole, 
    deleteRole, 
    listAllUsers,
    getUserProfile, 
    updateUserProfile, 
    deleteUserProfile 
} = require('../Controllers/adminController');
const authMiddleware = require('../Middlewares/authMiddleware');
const roleMiddleware = require('../Middlewares/roleMiddleware');

const router = express.Router();

router.get('/', 
(req, res) => {
    res.send("Hello, world!");
});

router.post('/create-role', roleValidationRules(), authMiddleware, roleMiddleware('admin'), createRole);
router.get('/all-roles', authMiddleware, roleMiddleware('admin'), getRoles);
router.put('/update-role/:roleId', roleValidationRules(), authMiddleware, roleMiddleware('admin'), updateRole);
router.delete('/delete-role/:roleId', authMiddleware, roleMiddleware('admin'), deleteRole);
router.get('/all-user', authMiddleware, roleMiddleware('admin'), listAllUsers);
router.get('/fetch-user/:userId', authMiddleware, roleMiddleware('admin'),  getUserProfile);
router.put('/update-user/:userId', authMiddleware, roleMiddleware('admin'), updateUserProfile);
router.delete('/delete-user/:userId', authMiddleware, roleMiddleware('admin'), deleteUserProfile);

module.exports = router;