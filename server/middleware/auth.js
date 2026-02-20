/**
 * Authentication and Authorization Middleware
 * 
 * This module provides middleware functions for JWT-based authentication
 * and role-based authorization for the Job Portal application.
 * 
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

/**
 * Protect middleware - Verifies JWT token and authenticates user
 * 
 * This middleware:
 * 1. Extracts JWT from Authorization header (Bearer token format)
 * 2. Verifies token signature and expiration using JWT_SECRET
 * 3. Attaches user object to req.user
 * 4. Returns 401 error for invalid/missing/expired tokens
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * 
 * @example
 * router.get('/profile', protect, getProfile);
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from "Bearer <token>" format
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. No token provided.'
      });
    }

    try {
      // Verify token signature and expiration
      const decoded = jwt.verify(token, config.jwtSecret);

      // Attach user to request object (exclude password field)
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.'
        });
      }

      // Check if user is blocked
      if (req.user.isBlocked) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been blocked. Please contact support.'
        });
      }

      next();
    } catch (error) {
      // Handle JWT-specific errors
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please log in again.'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please log in again.'
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route.'
    });
  }
};

/**
 * Authorize middleware - Restricts access based on user roles
 * 
 * This middleware:
 * 1. Checks if req.user.role matches any of the allowed roles
 * 2. Returns 403 error if user role is not authorized
 * 3. Calls next() if user has required role
 * 
 * Note: This middleware must be used AFTER the protect middleware
 * since it depends on req.user being set.
 * 
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'employer', 'jobSeeker')
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Single role
 * router.post('/jobs', protect, authorize('employer'), createJob);
 * 
 * @example
 * // Multiple roles
 * router.get('/dashboard', protect, authorize('admin', 'employer'), getDashboard);
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be set by protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated. Please log in.'
      });
    }

    // Check if user's role is in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route.`
      });
    }

    // User has required role, proceed to next middleware
    next();
  };
};

module.exports = { protect, authorize };
