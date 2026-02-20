/**
 * Admin Controller
 * 
 * Handles administrative operations including user management, job moderation,
 * and platform analytics. All functions require admin role authorization.
 * 
 * @module controllers/adminController
 */

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

/**
 * Get all users
 * 
 * GET /api/v1/admin/users
 * 
 * Validates: Requirements 12.1, 12.2
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with all users
 */
const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users with selected fields
    const users = await User.find()
      .select('name email role isBlocked createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    });
  }
};

/**
 * Toggle user block status
 * 
 * PUT /api/v1/admin/users/:id/block
 * 
 * Validates: Requirements 12.3, 12.4
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID to block/unblock
 * @param {Object} req.body - Request body
 * @param {boolean} req.body.isBlocked - Block status to set
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated user
 */
const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    // Validate isBlocked field
    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isBlocked must be a boolean value'
      });
    }

    // Update user block status
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isBlocked } },
      { new: true, runValidators: true }
    ).select('name email role isBlocked createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user
    });
  } catch (error) {
    console.error('Toggle user block error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user block status'
    });
  }
};

/**
 * Get all jobs (admin view)
 * 
 * GET /api/v1/admin/jobs
 * 
 * Validates: Requirements 13.1
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with all jobs
 */
const getAllJobs = async (req, res) => {
  try {
    // Retrieve all jobs regardless of employer
    const jobs = await Job.find()
      .populate('employerId', 'name email company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving jobs'
    });
  }
};

/**
 * Delete any job (admin)
 * 
 * DELETE /api/v1/admin/jobs/:id
 * 
 * Validates: Requirements 13.2, 13.3
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Job ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 */
const deleteAnyJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Set isActive to false instead of deleting
    const job = await Job.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      job
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting job'
    });
  }
};

/**
 * Get platform statistics
 * 
 * GET /api/v1/admin/stats
 * 
 * Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with platform statistics
 */
const getStats = async (req, res) => {
  try {
    // Total users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object format
    const userRoleStats = {};
    usersByRole.forEach(item => {
      userRoleStats[item._id] = item.count;
    });

    // Total users
    const totalUsers = await User.countDocuments();

    // Total active jobs
    const totalActiveJobs = await Job.countDocuments({ isActive: true });

    // Total applications
    const totalApplications = await Application.countDocuments();

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object format
    const applicationStatusStats = {};
    applicationsByStatus.forEach(item => {
      applicationStatusStats[item._id] = item.count;
    });

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Recent job postings (last 30 days)
    const recentJobPostings = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        usersByRole: userRoleStats,
        totalActiveJobs,
        totalApplications,
        applicationsByStatus: applicationStatusStats,
        recentRegistrations,
        recentJobPostings
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving statistics'
    });
  }
};

module.exports = {
  getAllUsers,
  toggleUserBlock,
  getAllJobs,
  deleteAnyJob,
  getStats
};
