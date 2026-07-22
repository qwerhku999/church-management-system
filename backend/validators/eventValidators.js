const { body, param } = require('express-validator');

const createEventValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid start date'),
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Invalid end date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('category')
    .optional()
    .isIn(['worship', 'prayer', 'bible_study', 'outreach', 'fellowship', 'conference', 'seminar', 'youth', 'children', 'special', 'other']),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'cancelled', 'completed']),
];

const updateEventValidator = [
  param('id').isMongoId().withMessage('Invalid event ID'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('category').optional().isIn(['worship', 'prayer', 'bible_study', 'outreach', 'fellowship', 'conference', 'seminar', 'youth', 'children', 'special', 'other']),
  body('status').optional().isIn(['draft', 'published', 'cancelled', 'completed']),
];

const eventIdValidator = [
  param('id').isMongoId().withMessage('Invalid event ID'),
];

module.exports = { createEventValidator, updateEventValidator, eventIdValidator };
