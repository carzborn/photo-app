const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/* Get all albums */
router.get('/', albumController.showUsersAlbums);

/* Get a specific album */
router.get('/:albumId', albumController.showUsersAlbum);

/* Store a new album */
router.post('/', albumValidationRules.createRules, albumController.storeAlbum);

/* Update a specific album */
router.put('/:albumId', albumValidationRules.updateRules, albumController.updateAlbum);

router.post('/:albumId/photos', albumValidationRules.addPhotoToAlbum, albumController.addPhoto)

module.exports = router;