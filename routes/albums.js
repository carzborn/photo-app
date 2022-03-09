const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/* Get all resources */
router.get('/', albumController.index);

/* Get a specific resource */
router.get('/:exampleId', albumController.showAlbum);

/* Store a new resource */
router.post('/', albumValidationRules.createRules, albumController.storeAlbum);

/* Update a specific resource */
router.put('/:exampleId', albumValidationRules.updateRules, albumController.update);

module.exports = router;