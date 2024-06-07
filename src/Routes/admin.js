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


const router = express.Router();

router.get('/', 
(req, res) => {
    res.send("Hello, world!");
});

router.post('/create-role', roleValidationRules(), createRole);
router.get('/all-roles',  getRoles);
router.put('/update-role/:roleId', roleValidationRules(), updateRole);
router.delete('/delete-role/:roleId', deleteRole);
router.get('/all-user',  listAllUsers);
router.get('/fetch-user/:userId',  getUserProfile);
router.put('/update-user/:userId', updateUserProfile);
router.delete('/delete-user/:userId', deleteUserProfile);

module.exports = router;