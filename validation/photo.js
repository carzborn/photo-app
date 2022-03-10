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
	body("url").exists().isURL(),
	body("comment").optional().isLength({ min: 3 }),
	body("title").exists().isLength({ min: 3 }),
];

 /**
  * Update photo validation rules
  *
  * Optional: title, url, comment & user_id
  */
 const updateRules = [
     body('title').optional().isLength({ min: 3 }),
     body('url').optional().isLength({ min:5}).isURL(),
     body('comment').optional().isLength({min:3}),
     body('user_id').optional()
 ];

 module.exports = {
     createRules,
     updateRules,
 }