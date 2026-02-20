/**
 * Job Routes
 * 
 * Defines all job-related endpoints for the Job Portal application.
 * Includes job creation, retrieval, updating, and deletion.
 * 
 * Routes:
 * - GET /jobs - Public endpoint to get all active jobs with filtering
 * - POST /jobs - Protected endpoint for employers to create jobs
 * - GET /my-jobs - Protected endpoint for employers to get their jobs
 * - PUT /:id - Protected endpoint for employers to update their jobs
 * - DELETE /:id - Protected endpoint for employers to delete their jobs
 * 
 * @module routes/jobRoutes
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateJob } = require('../middleware/validation');
const {
  createJob,
  getJobs,
  getMyJobs,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

/**
 * @route   GET /api/v1/jobs
 * @desc    Get all active jobs with optional filtering
 * @access  Public
 * @requirements 3.1, 4.1
 */
router.get('/', getJobs);

/**
 * @route   POST /api/v1/jobs
 * @desc    Create a new job listing
 * @access  Protected (employer only)
 * @middleware protect, authorize('employer'), validateJob
 * @requirements 3.1, 3.7, 10.1, 10.2
 */
router.post('/', protect, authorize('employer'), validateJob, createJob);

/**
 * @route   GET /api/v1/jobs/my-jobs
 * @desc    Get all jobs posted by the authenticated employer
 * @access  Protected (employer only)
 * @middleware protect, authorize('employer')
 * @requirements 10.4
 */
router.get('/my-jobs', protect, authorize('employer'), getMyJobs);

/**
 * @route   PUT /api/v1/jobs/:id
 * @desc    Update a job listing
 * @access  Protected (employer only, must own the job)
 * @middleware protect, authorize('employer'), validateJob
 * @requirements 10.7
 */
router.put('/:id', protect, authorize('employer'), validateJob, updateJob);

/**
 * @route   DELETE /api/v1/jobs/:id
 * @desc    Delete a job listing (soft delete)
 * @access  Protected (employer only, must own the job)
 * @middleware protect, authorize('employer')
 * @requirements 10.7
 */
router.delete('/:id', protect, authorize('employer'), deleteJob);

module.exports = router;
