const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/albums', auth.basic, require('./albums'));
router.use('/photos', auth.basic, require('./photos'));
router.use('/user', require('./user'));

module.exports = router;