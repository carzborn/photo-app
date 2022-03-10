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
  */
 const updateRules = [
     body('title').optional().isLength({ min: 4 }),
 ];

 /* Add photo to album validation rules */
 const addPhotoToAlbum = [
    body('photo_id').exists().isInt().custom(
        async value => {
            const photo = await new models.photo({ id: value }).fetch({ require: false});

            if (!photo) {
                return Promise.reject('There is no photo with that id');
            }
            return Promise.resolve();
        }
    )
 ];

 module.exports = {
     createRules,
     updateRules,
     addPhotoToAlbum,
 }