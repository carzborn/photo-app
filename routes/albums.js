const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/* Get all Albums */
router.get('/', albumController.showUsersAlbums);

/* Get a specific resource */
router.get('/:albumId', albumController.showUsersAlbum);

/* Store a new resource */
router.post('/', albumValidationRules.createRules, albumController.storeAlbum);

/* Update a specific resource */
router.put('/:albumId', albumValidationRules.updateRules, albumController.update);

module.exports = router;