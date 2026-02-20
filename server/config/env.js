/**
 * Environment Configuration Module
 * 
 * This module loads and validates all required environment variables for the Job Portal application.
 * It ensures that all necessary configuration is present before the application starts.
 * 
 * Required Environment Variables:
 * - MONGODB_URI: MongoDB connection string
 * - JWT_SECRET: Secret key for JWT token signing
 * - CLOUDINARY_CLOUD_NAME: Cloudinary cloud name for file uploads
 * - CLOUDINARY_API_KEY: Cloudinary API key
 * - CLOUDINARY_API_SECRET: Cloudinary API secret
 * 
 * Optional Environment Variables (with defaults):
 * - PORT: Server port (default: 5000)
 * - NODE_ENV: Node environment (default: development)
 * 
 * @module config/env
 */

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required variable is missing
 */
const validateEnv = () => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
};

// Validate environment variables on module load
validateEnv();

/**
 * Environment configuration object
 * Provides centralized access to all environment variables with defaults
 */
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongoUri: process.env.MONGODB_URI,
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET,
  
  // Cloudinary configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};

module.exports = config;
