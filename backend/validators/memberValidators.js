const { body, param, query } = require('express-validator');

const createMemberValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim(),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say']).withMessage('Invalid gender'),
  body('maritalStatus')
    .optional()
    .isIn(['single', 'married', 'divorced', 'widowed', 'separated']).withMessage('Invalid marital status'),
  body('membershipStatus')
    .optional()
    .isIn(['active', 'inactive', 'pending', 'transferred', 'deceased']).withMessage('Invalid membership status'),
  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Invalid date of birth'),
  body('membershipDate')
    .optional()
    .isISO8601().withMessage('Invalid membership date'),
];

const updateMemberValidator = [
  param('id').isMongoId().withMessage('Invalid member ID'),
  body('firstName').optional().trim().isLength({ max: 50 }),
  body('lastName').optional().trim().isLength({ max: 50 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']),
  body('maritalStatus').optional().isIn(['single', 'married', 'divorced', 'widowed', 'separated']),
  body('membershipStatus').optional().isIn(['active', 'inactive', 'pending', 'transferred', 'deceased']),
];

const memberIdValidator = [
  param('id').isMongoId().withMessage('Invalid member ID'),
];

module.exports = {
  createMemberValidator,
  updateMemberValidator,
  memberIdValidator,
};
