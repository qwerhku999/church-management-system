const { body, param } = require('express-validator');

const createDonationValidator = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['tithe', 'offering', 'building_fund', 'missions', 'special', 'pledge', 'other']),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['cash', 'check', 'credit_card', 'debit_card', 'bank_transfer', 'online', 'mobile_money', 'other']),
  body('donationDate')
    .optional()
    .isISO8601().withMessage('Invalid donation date'),
  body('donor')
    .optional()
    .isMongoId().withMessage('Invalid donor ID'),
];

const updateDonationValidator = [
  param('id').isMongoId().withMessage('Invalid donation ID'),
  body('amount').optional().isFloat({ min: 0.01 }),
  body('category').optional().isIn(['tithe', 'offering', 'building_fund', 'missions', 'special', 'pledge', 'other']),
  body('paymentMethod').optional().isIn(['cash', 'check', 'credit_card', 'debit_card', 'bank_transfer', 'online', 'mobile_money', 'other']),
];

const donationIdValidator = [
  param('id').isMongoId().withMessage('Invalid donation ID'),
];

module.exports = { createDonationValidator, updateDonationValidator, donationIdValidator };
