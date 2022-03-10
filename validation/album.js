/**
 * Album Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');

 /**
  * Create album validation rules
  *
  * Required: title
  */
 const createRules = [
     body('title').exists().isLength({ min: 4 }),
 ];

 /**
  * Update album validation rules
  *
  * Required: -
  */
 const updateRules = [
     body('title').optional().isLength({ min: 4 }),
 ];

 const addPhotoToAlbum = [body("photo_id").exists()];

 module.exports = {
     createRules,
     updateRules,
     addPhotoToAlbum,
 }