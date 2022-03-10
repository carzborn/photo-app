/**
 * User Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');
 
 /**
  * Register new user validation rules
  *
  * Required: email, password, first_name, last_name
  */
 const createUserRules = [
    body('email').exists().isLength({ min: 5 }).isEmail().custom(async value => {
		const email = await new models.user({ email: value }).fetch({ require: false });
		if (email) {
			return Promise.reject("Email already registered.");
		}

		return Promise.resolve();
	}),
     body('password').exists().isLength({ min: 10 }),
     body('first_name').exists().isLength({ min: 2 }),
     body('last_name').exists().isLength({ min: 2 }),
 ];

 module.exports = {
     createUserRules,
 }