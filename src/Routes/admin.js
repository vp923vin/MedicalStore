const express = require('express');

const { createRole } = require('../Controllers/adminController');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello, world!");
});

router.post('/create-role', createRole);
module.exports = router;