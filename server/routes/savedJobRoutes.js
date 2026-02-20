/**
 * Saved Job Routes
 * 
 * Defines all saved job-related endpoints for the Job Portal application.
 * Allows job seekers to save, retrieve, and remove saved jobs.
 * 
 * Routes:
 * - POST /saved/:jobId - Protected endpoint for job seekers to save a job
 * - GET /saved - Protected endpoint for job seekers to get their saved jobs
 * - DELETE /saved/:jobId - Protected endpoint for job seekers to remove a saved job
 * 
 * @module routes/savedJobRoutes
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  saveJob,
  getSavedJobs,
  removeSavedJob
} = require('../controllers/savedJobController');

/**
 * @route   POST /api/v1/saved/:jobId
 * @desc    Save a job for later viewing
 * @access  Protected (jobSeeker only)
 * @middleware protect, authorize('jobSeeker')
 * @requirements 7.1, 7.4
 */
router.post('/:jobId', protect, authorize('jobSeeker'), saveJob);

/**
 * @route   GET /api/v1/saved
 * @desc    Get all saved jobs for the authenticated job seeker
 * @access  Protected (jobSeeker only)
 * @middleware protect, authorize('jobSeeker')
 * @requirements 7.5
 */
router.get('/', protect, authorize('jobSeeker'), getSavedJobs);

/**
 * @route   DELETE /api/v1/saved/:jobId
 * @desc    Remove a saved job
 * @access  Protected (jobSeeker only)
 * @middleware protect, authorize('jobSeeker')
 * @requirements 7.7
 */
router.delete('/:jobId', protect, authorize('jobSeeker'), removeSavedJob);

module.exports = router;
