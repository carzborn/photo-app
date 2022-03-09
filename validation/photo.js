/**
 * Example Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');

 /**
  * Create phot validation rules
  *
  * Required: title, url & user_id
  */
 const createRules = [
     body('title').exists().isLength({ min: 5 }),
     body('url').exists().isLength({ min:5}),
     body('user_id').exists().isInt({min:1})
 ];

 /**
  * Update photo validation rules
  *
  * Optional: title, url, comment & user_id
  */
 const updateRules = [
     body('title').optional().isLength({ min: 5 }),
     body('url').optional().isLength({ min:5}),
     body('comment').optional().isLength({min:5}),
     body('user_id').optional()
 ];

 module.exports = {
     createRules,
     updateRules,
 }