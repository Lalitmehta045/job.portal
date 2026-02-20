const { body, validationResult } = require('express-validator');

/**
 * Middleware to validate registration input
 * Validates: name, email, password, role
 * Requirements: 15.1, 15.2, 15.3, 15.5, 15.6, 15.7, 17.4
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['jobSeeker', 'employer', 'admin'])
    .withMessage('Role must be one of: jobSeeker, employer, admin'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Middleware to validate login input
 * Validates: email, password
 * Requirements: 15.1, 15.3, 15.7, 17.4
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Middleware to validate job input
 * Validates: title, description, company, location, skillsRequired, salary
 * Requirements: 3.2, 3.3, 15.1, 15.4
 */
const validateJob = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('skillsRequired')
    .notEmpty()
    .withMessage('Skills required is required')
    .isArray({ min: 1 })
    .withMessage('Skills required must be an array with at least one skill'),
  
  body('salary.min')
    .notEmpty()
    .withMessage('Minimum salary is required')
    .isNumeric()
    .withMessage('Minimum salary must be a number'),
  
  body('salary.max')
    .notEmpty()
    .withMessage('Maximum salary is required')
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => {
      const min = parseFloat(req.body.salary.min);
      const max = parseFloat(value);
      if (max < min) {
        throw new Error('Maximum salary must be greater than or equal to minimum salary');
      }
      return true;
    }),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Middleware to validate application status update
 * Validates: status
 * Requirements: 6.2, 15.5
 */
const validateApplication = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'accepted', 'rejected'])
    .withMessage('Status must be one of: pending, accepted, rejected'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

module.exports = {
  validateRegister,
  validateLogin,
  validateJob,
  validateApplication
};
