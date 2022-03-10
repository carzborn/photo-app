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

 const addPhotoToAlbum = [
    body('photo_id').exists().isInt().custom(
        // Make sure that there is a photo with given id
        async value => {
            const photo = await new models.photo({ id: value }).fetch({ require: false});

            if (!photo) {
                // Reject if no photo was found
                return Promise.reject('There is no photo with that id');
            }

            // Otherwise resolve
            return Promise.resolve();
        }
    )
 ];

 module.exports = {
     createRules,
     updateRules,
     addPhotoToAlbum,
 }