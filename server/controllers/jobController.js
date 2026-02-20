/**
 * Job Controller
 * 
 * This module handles all job-related operations including creating,
 * retrieving, updating, and deleting job listings.
 * 
 * @module controllers/jobController
 */

const Job = require('../models/Job');

/**
 * Create a new job listing
 * 
 * @route POST /api/v1/jobs
 * @access Protected (employer only)
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Job details (title, description, company, location, salary, skillsRequired)
 * @param {Object} req.user - Authenticated user from protect middleware
 * @returns {Object} 201 - Created job object
 * @returns {Object} 400 - Validation error
 * @returns {Object} 500 - Server error
 */
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, skillsRequired } = req.body;

    // Create job with employerId set to authenticated user and isActive set to true
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      skillsRequired,
      employerId: req.user.id,
      isActive: true
    });

    res.status(201).json({
      success: true,
      job: job
    });
  } catch (error) {
    console.error('Error creating job:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating job'
    });
  }
};

/**
 * Get all active jobs with filtering and sorting
 * 
 * @route GET /api/v1/jobs
 * @access Public
 * 
 * @param {Object} req - Express request object
 * @param {string} req.query.location - Filter by location (optional)
 * @param {string} req.query.skills - Filter by skills (comma-separated, optional)
 * @param {number} req.query.minSalary - Filter by minimum salary (optional)
 * @param {number} req.query.maxSalary - Filter by maximum salary (optional)
 * @param {string} req.query.company - Filter by company name (optional)
 * @returns {Object} 200 - Array of job objects
 * @returns {Object} 500 - Server error
 */
const getJobs = async (req, res) => {
  try {
    const { location, skills, minSalary, maxSalary, company } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Filter by location (case-insensitive partial match)
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Filter by skills (match any of the provided skills)
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filter.skillsRequired = { $in: skillsArray };
    }

    // Filter by salary range
    if (minSalary || maxSalary) {
      filter.$and = [];

      if (minSalary) {
        filter.$and.push({ 'salary.max': { $gte: Number(minSalary) } });
      }

      if (maxSalary) {
        filter.$and.push({ 'salary.min': { $lte: Number(maxSalary) } });
      }
    }

    // Filter by company (case-insensitive partial match)
    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }

    // Fetch jobs with filters, populate employer info, and sort by createdAt descending
    const jobs = await Job.find(filter)
      .populate('employerId', 'name company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs'
    });
  }
};

/**
 * Get jobs posted by the authenticated employer
 * 
 * @route GET /api/v1/jobs/my-jobs
 * @access Protected (employer only)
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from protect middleware
 * @returns {Object} 200 - Array of job objects
 * @returns {Object} 500 - Server error
 */
const getMyJobs = async (req, res) => {
  try {
    // Find all jobs where employerId matches authenticated user
    const jobs = await Job.find({ employerId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs: jobs
    });
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your jobs'
    });
  }
};

/**
 * Update a job listing
 * 
 * @route PUT /api/v1/jobs/:id
 * @access Protected (employer only, must own the job)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Job ID
 * @param {Object} req.body - Updated job fields
 * @param {Object} req.user - Authenticated user from protect middleware
 * @returns {Object} 200 - Updated job object
 * @returns {Object} 400 - Validation error
 * @returns {Object} 403 - Not authorized (not job owner)
 * @returns {Object} 404 - Job not found
 * @returns {Object} 500 - Server error
 */
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the job
    let job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Verify ownership
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Define allowed fields for update
    const allowedFields = ['title', 'description', 'location', 'salary', 'skillsRequired'];
    const updateData = {};

    // Only include allowed fields in update
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Update the job
    job = await Job.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      job: job
    });
  } catch (error) {
    console.error('Error updating job:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating job'
    });
  }
};

/**
 * Delete a job listing (soft delete by setting isActive to false)
 * 
 * @route DELETE /api/v1/jobs/:id
 * @access Protected (employer only, must own the job)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Job ID
 * @param {Object} req.user - Authenticated user from protect middleware
 * @returns {Object} 200 - Success message
 * @returns {Object} 403 - Not authorized (not job owner)
 * @returns {Object} 404 - Job not found
 * @returns {Object} 500 - Server error
 */
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the job
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Verify ownership
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Soft delete by setting isActive to false
    await Job.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting job'
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getMyJobs,
  updateJob,
  deleteJob
};
