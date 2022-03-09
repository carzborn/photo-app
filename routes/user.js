const express = require('express');
const router = express.Router();
const userController = require('../controllers/auth_controller');
const userValidationRules = require('../validation/user');

/* Register a new user */
router.post('/', userValidationRules.createUserRules, userController.register);

module.exports = router;