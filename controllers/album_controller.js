/**
 * Album Controller
 */
const debug = require('debug')('album:album_controller')
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
const album = require('../models/album');

	//	Get users albums
const showUsersAlbums = async (req, res) => {
    await req.user.load('albums');

    try {
    res.status(200).send({
        status: 'success',
        data: req.user.related('albums')
    })
    } catch (error) {
        res.status(500).send({
            status: 'fail',
            message: "Exception thrown in database when getting a new album."
        });
        throw error;
    }
};

	// Get a users specfic albums
	const showUsersAlbum = async (req, res) => {
		const album = await new models.album({id: req.params.albumId})
		.fetch({withRelated:['photos']});


		res.status(200).send({
			status: 'success',
			data: album,
		});
	};

/**
 * Store a new album
 *
 * POST /
 */
const storeAlbum = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}


	const validData = matchedData(req);
	validData.user_id = req.user.id;

	try {
		const album = await new models.album(validData).save();
		debug("Created new album successfully: %O", album);

		res.send({
			status: 'success',
			data: album,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
};

/**
 * Update authenticated users album
 *
 * PUT /:albumId
 */
const updateAlbum = async (req, res) => {
	const albumId = req.params.albumId;


	const album = await new models.album({ id: albumId }).fetch({ require: false });
	if (!album) {
		debug("Album to update was not found. %o", { id: albumId });
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}


	const validData = matchedData(req);

	try {
		const updatedAlbum = await album.save(validData);
		debug("Updated album successfully: %O", updatedAlbum);

		res.send({
			status: 'success',
			data: album,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new album.',
		});
		throw error;
	}
}

/**
 * Add photo to specific album
 *
 * Post /albums/albumId/photos
 */
const addPhoto = async (req, res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty){
		return res.status(422).send({ status: "fail", data: errors.array() });
	}
	const validData = matchedData(req);

	const photo = await new models.photo({ id: validData.photo_id }).fetch({ require: false });

	try{
		const album = await models.album.fetchById(req.params.albumId, { withRelated: ['photos'], require: false });

		if(!album){
			return res.status(403).send({
			   status: "fail",
			   data: "This is not your album.."
		   });
	   }

	   if (photo.attributes.user_id !== album.attributes.user_id) {
		return res.status(403).send({
			status: 'fail',
			data: "That's not your photo.."
		});
	}
	if ( album.related('photos').find( photo => photo.id === validData.photo_id ) ) {
		return res.status(400).send({
			status: 'fail',
			data: 'Photo already exists in this album.'
		});
	}

		 await album.photos().attach(validData.photo_id);

		res.send({
			status: 'success',
			data: null,
		});
	}	catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to an album.',
		});
		throw error;
	}
}

module.exports = {
	showUsersAlbums,
	showUsersAlbum,
	storeAlbum,
	updateAlbum,
	addPhoto,
}