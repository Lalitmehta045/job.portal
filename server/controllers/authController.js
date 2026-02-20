/**
 * Authentication Controller
 * 
 * Handles user registration, login, profile retrieval, and profile updates.
 * Implements JWT-based authentication with 7-day token expiration.
 * 
 * @module controllers/authController
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const cloudinary = require('../config/cloudinary');

/**
 * Generate JWT token for authenticated user
 * 
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} JWT token valid for 7 days
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

/**
 * Register a new user
 * 
 * POST /api/v1/auth/register
 * 
 * Validates: Requirements 1.1, 1.2
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (min 8 characters)
 * @param {string} req.body.role - User role (jobSeeker, employer, admin)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and JWT token
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return user data (excluding password)
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        profile: user.profile,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login user
 * 
 * POST /api/v1/auth/login
 * 
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return user data (excluding password)
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        profile: user.profile,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Get authenticated user details
 * 
 * GET /api/v1/auth/me
 * 
 * Validates: Requirements 9.1, 9.4
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user (set by protect middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data
 */
const getMe = async (req, res) => {
  try {
    // User is already attached to req by protect middleware
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user data'
    });
  }
};

/**
 * Update job seeker profile
 * 
 * PUT /api/v1/auth/profile
 * 
 * Validates: Requirements 9.1, 9.2, 9.3
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user (set by protect middleware)
 * @param {Object} req.body - Request body
 * @param {string[]} req.body.skills - Array of skills
 * @param {string} req.body.experience - Work experience description
 * @param {string} req.body.education - Education details
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated user data
 */
const updateProfile = async (req, res) => {
  try {
    const { skills, experience, education } = req.body;

    // Validate that skills is an array if provided
    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of strings'
      });
    }

    // Build update object
    const updateData = {};
    if (skills !== undefined) updateData['profile.skills'] = skills;
    if (experience !== undefined) updateData['profile.experience'] = experience;
    if (education !== undefined) updateData['profile.education'] = education;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

/**
 * Upload resume to Cloudinary and update user profile
 * 
 * POST /api/v1/auth/upload-resume
 * 
 * Validates: Requirements 8.1, 8.2, 8.5, 8.6
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user (set by protect middleware)
 * @param {Object} req.file - Uploaded file (set by multer middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with resume URL
 */
const uploadResume = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file'
      });
    }

    // Upload file to Cloudinary
    // Convert buffer to base64 data URI for Cloudinary upload
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'job-portal/resumes',
      resource_type: 'auto',
      public_id: `resume_${req.user._id}_${Date.now()}`
    });

    // Update user profile with Cloudinary URL
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { 'profile.resumeUrl': uploadResponse.secure_url } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: uploadResponse.secure_url,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    
    // Handle Cloudinary-specific errors
    if (error.http_code) {
      return res.status(error.http_code).json({
        success: false,
        message: `Cloudinary upload failed: ${error.message}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload resume. Please try again later.'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  uploadResume
};
