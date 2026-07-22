const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/helpers');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorObj = errors.array().reduce((acc, err) => {
      acc[err.path] = err.msg;
      return acc;
    }, {});
    return errorResponse(res, 'Validation failed. Please check your input.', errorObj, 422);
  }
  next();
};

module.exports = validate;
