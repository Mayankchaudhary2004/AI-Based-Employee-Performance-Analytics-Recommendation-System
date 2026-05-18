const { body, validationResult } = require('express-validator');

/**
 * Validation rules for employee registration
 */
const validateEmployee = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('department')
    .trim()
    .notEmpty().withMessage('Department is required')
    .isIn(['Development', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'QA'])
    .withMessage('Invalid department'),

  body('skills')
    .isArray({ min: 1 }).withMessage('At least one skill is required'),

  body('performanceScore')
    .notEmpty().withMessage('Performance score is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Performance score must be between 0 and 100'),

  body('experience')
    .notEmpty().withMessage('Years of experience is required')
    .isFloat({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years'),
];

/**
 * Validation rules for user signup
 */
const validateSignup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

/**
 * Validation rules for login
 */
const validateLogin = [
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Middleware to handle validation results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = {
  validateEmployee,
  validateSignup,
  validateLogin,
  handleValidationErrors,
};
