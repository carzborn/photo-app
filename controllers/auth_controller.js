/**
 * Authentication Controller
 */
const bcrypt = require('bcrypt');
const debug = require('debug')('books:example_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');



/**
 * Register a new user with POST request
 *
 * POST /
 */
const register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty){
		return res.status(422).send({
			status: "fail",
			data: errors.array()
		});
	}

	const validData = matchedData(req);


	try{
		validData.password = await bcrypt.hash(validData.password, 10);
	} catch(error){
		res.status(500).send({
			status: "error",
			message: "Exception thrown when hashing password.",
		});
		throw error;
	}

	try{
		const user = await new models.user(validData).save();

		res.send({
			status: 'success',
			data: {
				email: validData.email,
				first_name: validData.first_name,
				last_name: validData.last_name,
			}
		});
	}	catch(error) {
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when registering a new user.",
		});
		throw error;
	}
}

const login = async (req, res) => {
	// logging in the user, if user doesnt exists, send error 401
	const user = await models.user.login(req.body.email, req.body.password);
	if (!user) {
		return res.status(401).send({
			status: "fail",
			data: "Authentication failed.",
		});
	}

	// response
	return res.send({
		status: "success",
		data: {
			user,
		},
	});
};

module.exports = {
	register,
	login,
}