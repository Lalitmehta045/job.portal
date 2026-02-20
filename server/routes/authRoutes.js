/**
 * Authentication Routes
 * 
 * Defines all authentication-related endpoints for the Job Portal application.
 * Includes user registration, login, profile retrieval, and profile updates.
 * 
 * Routes:
 * - POST /register - Public registration endpoint
 * - POST /login - Public login endpoint
 * - GET /me - Protected endpoint to get current user
 * - PUT /profile - Protected endpoint for job seekers to update profile
 * 
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const upload = require('../middleware/upload');
const {
  register,
  login,
  getMe,
  updateProfile,
  uploadResume
} = require('../controllers/authController');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 * @validation validateRegister middleware
 * @requirements 1.1, 1.2
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 * @validation validateLogin middleware
 * @requirements 2.1
 */
router.post('/login', validateLogin, login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Protected
 * @middleware protect
 * @requirements 9.1, 9.5
 */
router.get('/me', protect, getMe);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update job seeker profile (skills, experience, education)
 * @access  Protected (jobSeeker only)
 * @middleware protect, authorize('jobSeeker')
 * @requirements 9.1, 9.5
 */
router.put('/profile', protect, authorize('jobSeeker'), updateProfile);

/**
 * @route   POST /api/v1/auth/upload-resume
 * @desc    Upload resume file to Cloudinary and update user profile
 * @access  Protected (jobSeeker only)
 * @middleware protect, authorize('jobSeeker'), upload.single('resume')
 * @requirements 8.1, 8.2, 8.5, 8.6, 8.7
 */
router.post('/upload-resume', protect, authorize('jobSeeker'), upload.single('resume'), uploadResume);

module.exports = router;
