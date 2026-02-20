/**
 * Application Routes
 * 
 * Defines all application-related endpoints for the Job Portal application.
 * Includes job application submission, viewing applications, and status updates.
 * 
 * Routes:
 * - POST /apply/:jobId - Protected endpoint for job seekers to apply to jobs
 * - GET /my-applications - Protected endpoint for job seekers to view their applications
 * - GET /jobs/:jobId/applicants - Protected endpoint for employers to view applicants
 * - PUT /application/:id/status - Protected endpoint for employers to update application status
 * 
 * @module routes/applicationRoutes
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateApplication } = require('../middleware/validation');
const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');

/**
 * @route   POST /api/v1/apply/:jobId
 * @desc    Apply to a job
 * @access  Protected (jobSeeker only)
 * @middleware protect, authorize('jobSeeker')
 * @requirements 5.1, 5.6
 */
router.post('/apply/:jobId', protect, authorize('jobSeeker'), applyToJob);

/**
 * @route   GET /api/v1/my-applications
 * @desc    Get all applications for the authenticated job seeker
 * @access  Protected (jobSeeker only)
 * @middleware protect, authorize('jobSeeker')
 * @requirements 23.1, 23.5
 */
router.get('/my-applications', protect, authorize('jobSeeker'), getMyApplications);

/**
 * @route   GET /api/v1/jobs/:jobId/applicants
 * @desc    Get all applicants for a specific job
 * @access  Protected (employer only, must own the job)
 * @middleware protect, authorize('employer')
 * @requirements 11.1, 11.6
 */
router.get('/jobs/:jobId/applicants', protect, authorize('employer'), getJobApplicants);

/**
 * @route   PUT /api/v1/application/:id/status
 * @desc    Update application status
 * @access  Protected (employer only, must own the job)
 * @middleware protect, authorize('employer'), validateApplication
 * @requirements 6.1, 6.5
 */
router.put('/application/:id/status', protect, authorize('employer'), validateApplication, updateApplicationStatus);

module.exports = router;
