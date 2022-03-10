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

	// Tries to fetch all the related photos and display them
    try {
        const photos = await new models.photo().where({ 'user_id': req.user.id }).fetchAll({ columns: ['id', 'title', 'url', 'comment'] });


        res.send({
            status: 'success',
            data: photos,
        });
    } catch (error) {
        res.status(404).send({
            status: 'error',
            data: 'Photo(s) Not Found',
        });
        return;
    }
}

/**
 * Get a specific photo
 *
 * GET /:photos/photoId
 */
const showPhoto = async (req, res) => {
	const photo = await new models.photo({id: req.params.photoId}).fetch({require: false});

	if(!photo){
		return res.status(404).send({
			status: 'fail',
			data: "Photo could'nt be found"
		});
	}
	// Check if the user is authorized to view this photo
	if (photo.attributes.user_id !== req.user.id) {
        return res.status(403).send({
            status: 'fail',
            data:"'This doesn't belong to you..!"
        });
    }

	res.status(200).send({
		status: 'success',
		data: photo,
	});
}

/**
 * Store a new photo
 *
 * POST /photos
 */
 const storePhoto = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }


    const validData = matchedData(req);

	validData.user_id = req.user.id;


    try {
        const photo = await new models.photo(validData).save();

        res.send({
            status: 'success',
            data: photo,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new photo.',
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

	let photo = await new models.photo({id: req.params.photoId}).fetch({require: false});

	//  If the photo doesn't exist, return information to the user
	if (!photo) {
        return res.status(404).send({
            status: 'fail',
            data: 'There is no such photo'
        });
    }

	// If the photo doesn't belong to the user, tell em
	if (photo.attributes.user_id !== req.user.id) {
        return res.status(403).send({
            status: 'fail',
            data: 'That is not your photo!'
        });
    }

	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            status: 'fail',
            data: errors.array()
        });
    }

	//  Get the data after its validation
	const validData = matchedData(req);

	try{
		photo = await photo.save(validData);

		res.status(200).send({
			status: 'success',
			data: photo,
		});
	} catch(error){
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when',
		});
	} throw errors;
}

module.exports = {
	getPhotos,
	showPhoto,
	storePhoto,
	updatePhoto,
}