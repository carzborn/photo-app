/**
 * Photos Controller
 */

const debug = require('debug')('books:example_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all photos
 *
 * GET /
 */
const getPhotos = async (req, res) => {
	const allPhotos = await models.photo.fetchAll();

	res.send({
		status: 'success',
		data: { allPhotos
		}
	});
}

/**
 * Get a specific resource
 *
 * GET /:photoId
 */
const showPhoto = async (req, res) => {
	const photo = await new models.photo({ id: req.params.photoId })
		.fetch();

	res.send({
		status: 'success',
		data: photo,
	});
}

/**
 * Store a new resource
 *
 * POST /
 */
const storePhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const photo = await new models.photo(validData).save();
		debug("Created new photo successfully: %O", photo);

		res.send({
			status: 'success',
			data: photo,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a photo.',
		});
		throw error;
	}
}

/**
 * Update a specific photo
 *
 * PUT /:photoId
 */
const updatePhoto = async (req, res) => {
	const photoId = req.params.photoId;

	// make sure photo exists
	const photo = await new models.photo({ id: photoId }).fetch({ require: false });
	if (!photo) {
		debug("Photo to update was not found. %o", { id: photoId });
		res.status(404).send({
			status: 'fail',
			data: 'Photo Not Found',
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
		const updatedPhoto = await photo.save(validData);
		debug("Updated photo successfully: %O", updatedPhoto);

		res.send({
			status: 'success',
			data: photo,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new photo.',
		});
		throw error;
	}
}

module.exports = {
	getPhotos,
	showPhoto,
	storePhoto,
	updatePhoto,
}