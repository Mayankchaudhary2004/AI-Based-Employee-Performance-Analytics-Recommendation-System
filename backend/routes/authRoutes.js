const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateSignup,
  validateLogin,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');

// @route  POST /api/auth/signup
router.post('/signup', validateSignup, handleValidationErrors, signup);

// @route  POST /api/auth/login
router.post('/login', validateLogin, handleValidationErrors, login);

// @route  GET /api/auth/me
router.get('/me', protect, getProfile);

module.exports = router;
