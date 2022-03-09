/**
 * User Controller
 */
const bcrypt = require('bcrypt');
const debug = require('debug')('books:user_controller');
const { matchedData, validationResult } = require('express-validator');
const { User } = require('../models');

/**
 * Get authenticated user
 *
 * GET /
 */
const getUser = async (req, res) => {
	try {
		const user = await User.fetchById(req.user.user_id);

		res.send({
			status: 'success',
			data: {
				user,
			}
		});
	} catch (error) {
		return res.sendStatus(404);
	}
}

/**
 * Get a specific resource
 *
 * GET /:exampleId
 */
const show = async (req, res) => {
	const example = await new models.Example({ id: req.params.exampleId })
		.fetch();

	res.send({
		status: 'success',
		data: example,
	});
}

/**
 * Store a new resource
 *
 * POST /
 */
const store = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const example = await new models.Example(validData).save();
		debug("Created new example successfully: %O", example);

		res.send({
			status: 'success',
			data: example,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new example.',
		});
		throw error;
	}
}

/**
 * Update a specific resource
 *
 * PUT /:exampleId
 */
const update = async (req, res) => {
	const exampleId = req.params.exampleId;

	// make sure example exists
	const example = await new models.Example({ id: exampleId }).fetch({ require: false });
	if (!example) {
		debug("Example to update was not found. %o", { id: exampleId });
		res.status(404).send({
			status: 'fail',
			data: 'Example Not Found',
		});
		return;
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const updatedExample = await example.save(validData);
		debug("Updated example successfully: %O", updatedExample);

		res.send({
			status: 'success',
			data: example,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new example.',
		});
		throw error;
	}
}

/**
 * Destroy a specific resource
 *
 * DELETE /:exampleId
 */
const destroy = (req, res) => {
	res.status(400).send({
		status: 'fail',
		message: 'You need to write the code for deleting this resource yourself.',
	});
}

module.exports = {
	getUser,
	show,
	store,
	update,
	destroy,
}