/**
 * Authentication Controller
 */
const bcrypt = require('bcrypt');
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
		validData.password = await bcrypt.hash(validData.password, models.user.hashSaltRounds);
	} catch(error){
		res.status(500).send({ 
			status: error,
			message: "Exception thrown when hashing password.",
		});
		throw error;
	}

	try{
		const user = await models.user(validData).save();

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

module.exports = {
	register,
}