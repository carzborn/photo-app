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

	// get only the validated data from the request
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

	// make sure example exists
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

	// get only the validated data from the request
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

	// Get relation between user and album
	const user = await models.user.fetchById(req.user.user_id, {withRelated: ['albums'],});

	// Get relation between album and photo
	const album = await models.album.fetchById(req.params.albumId, { withRelated: ['photos'] });

	// Get the requested album
	const userAlbum = user.related('albums').find(album => album.id == req.params.albumId);

	// Get the photos the user owns
	const userPhoto = user.related('photos').find(photo => photo.id == validData.photo_id);

	// Check if the photo being added already exists
	const existingPhoto = album.related('photos').find(photo => photo.id == validData.photo_id);

		// If the photo exists, fail
		if(existingPhoto){
			return res.send({
				status: "fail",
				data: "The photo already exists"
			});
		}

	// Check if the album belongs to the user
	if(!userAlbum){
		res.status(403).send({
			status: "fail",
			data: "This is not your album.."
		});
		return;
	}

	if(!userPhoto){
		 res.status(403).send({
			status: "fail",
			data: "Photo could not be found"
		});
		return;
	}

	try{
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

// const addPhoto = async (req, res) => {
// 	// check for any validation errors

// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
// 		return res.status(400).send({ status: 'fail', data: errors.array() });
// 	}

// 	// get only the validated data from the request
// 	const validData = matchedData(req);	

// 	// load all req.user photos

	 
// 	 try {
// 		const album = await new models.album({ id: req.params.albumId }).fetch();

// 		if(req.user.id == album.attributes.user_id) {
// 			const photoExists = await new models.photo({id: validData.photo_id}).fetch();
		
			
// 			if(photoExists.id == validData.photo_id) {
// 				await photoExists.save({album_id : album.id})
// 				res.status(200).send({
// 					status: 'success',
// 					data: null
// 				});

// 			} else {
// 				res.status(404).send({
// 					status: 'fail',
// 					message: 'Photo does not exists and cannot be added to your album'
// 				})
// 			}  

// 		} else {
// 			res.status(404).send({
// 					status: 'fail',
// 					message: 'Album does not exist'
// 				})
// 		}

// 	} catch (error) {
// 		res.status(400).send({
// 			 status: 'error',
// 			 message: 'Failed adding photo to album',
// 		})
// 	}
// }

module.exports = {
	showUsersAlbums,
	showUsersAlbum,
	storeAlbum,
	updateAlbum,
	addPhoto,
}