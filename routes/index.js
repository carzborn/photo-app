const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userValidationRules = require('../validation/user');
const authController = require('../controllers/auth_controller');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/albums', auth.basic, require('./albums'));
router.use('/photos', auth.basic, require('./photos'));
router.use('/user', require('./user'));

// register a new user
router.post('/register', userValidationRules.createUserRules, authController.register);

module.exports = router;