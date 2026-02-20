/**
 * Admin Routes
 * 
 * Defines all admin-related endpoints for the Job Portal application.
 * Allows administrators to manage users, moderate jobs, and view platform statistics.
 * 
 * Routes:
 * - GET /users - Protected endpoint for admins to get all users
 * - PUT /users/:id/block - Protected endpoint for admins to block/unblock users
 * - GET /jobs - Protected endpoint for admins to get all jobs
 * - DELETE /jobs/:id - Protected endpoint for admins to delete any job
 * - GET /stats - Protected endpoint for admins to get platform statistics
 * 
 * @module routes/adminRoutes
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  toggleUserBlock,
  getAllJobs,
  deleteAnyJob,
  getStats
} = require('../controllers/adminController');

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with their details
 * @access  Protected (admin only)
 * @middleware protect, authorize('admin')
 * @requirements 12.1, 12.6
 */
router.get('/users', protect, authorize('admin'), getAllUsers);

/**
 * @route   PUT /api/v1/admin/users/:id/block
 * @desc    Block or unblock a user account
 * @access  Protected (admin only)
 * @middleware protect, authorize('admin')
 * @requirements 12.6
 */
router.put('/users/:id/block', protect, authorize('admin'), toggleUserBlock);

/**
 * @route   GET /api/v1/admin/jobs
 * @desc    Get all jobs regardless of employer
 * @access  Protected (admin only)
 * @middleware protect, authorize('admin')
 * @requirements 13.1, 13.4
 */
router.get('/jobs', protect, authorize('admin'), getAllJobs);

/**
 * @route   DELETE /api/v1/admin/jobs/:id
 * @desc    Delete any job (sets isActive to false)
 * @access  Protected (admin only)
 * @middleware protect, authorize('admin')
 * @requirements 13.4
 */
router.delete('/jobs/:id', protect, authorize('admin'), deleteAnyJob);

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Get platform statistics and analytics
 * @access  Protected (admin only)
 * @middleware protect, authorize('admin')
 * @requirements 14.1, 14.7
 */
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;
