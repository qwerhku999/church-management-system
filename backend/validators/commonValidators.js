const { param, query } = require('express-validator');

const idValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = { idValidator, paginationValidator };
