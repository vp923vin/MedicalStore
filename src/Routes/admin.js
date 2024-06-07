const express = require('express');

const { createRole, getRoles, updateRole, deleteRole } = require('../Controllers/adminController');
const { roleValidationRules } = require('../Services/FormValidators/roleValidation');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello, world!");
});

router.post('/create-role', roleValidationRules(), createRole);
router.get('/all-roles',  getRoles);
router.put('/update-role/:roleId', roleValidationRules(), updateRole);
router.delete('/delete-role/:roleId', deleteRole);

module.exports = router;