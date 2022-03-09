const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user');

/* Get all resources */
router.get('/', userController.getUser);

/* Get a specific resource */
router.get('/:exampleId', userController.show);

/* Store a new resource */
router.post('/', userValidationRules.createRules, userController.store);

/* Update a specific resource */
router.put('/:exampleId', userValidationRules.updateRules, userController.update);

/* Destroy a specific resource */
router.delete('/:exampleId', userController.destroy);

module.exports = router;