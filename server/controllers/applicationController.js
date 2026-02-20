const Application = require('../models/Application');
const Job = require('../models/Job');

/**
 * @desc    Apply to a job
 * @route   POST /api/v1/apply/:jobId
 * @access  Private (jobSeeker)
 */
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicantId = req.user.id;

    // Verify job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ message: 'This job is no longer active' });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({ jobId, applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Create application with status pending and appliedAt timestamp
    const application = await Application.create({
      jobId,
      applicantId,
      status: 'pending',
      appliedAt: Date.now()
    });

    res.status(201).json({ application });
  } catch (error) {
    console.error('Error in applyToJob:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get my applications
 * @route   GET /api/v1/my-applications
 * @access  Private (jobSeeker)
 */
exports.getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user.id;

    // Get applications for authenticated user, populate job details, sort by appliedAt descending
    const applications = await Application.find({ applicantId })
      .populate({
        path: 'jobId',
        select: 'title company location salary skillsRequired isActive'
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error in getMyApplications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get applicants for a job
 * @route   GET /api/v1/jobs/:jobId/applicants
 * @access  Private (employer)
 */
exports.getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    // Verify job exists and belongs to the authenticated employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId.toString() !== employerId) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    // Get all applications for this job and populate applicant details
    const applicants = await Application.find({ jobId })
      .populate({
        path: 'applicantId',
        select: 'name email profile'
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({ applicants });
  } catch (error) {
    console.error('Error in getJobApplicants:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/v1/application/:id/status
 * @access  Private (employer)
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employerId = req.user.id;

    // Find the application and populate the job
    const application = await Application.findById(id).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify job ownership
    if (application.jobId.employerId.toString() !== employerId) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Update status
    application.status = status;
    await application.save();

    res.status(200).json({ application });
  } catch (error) {
    console.error('Error in updateApplicationStatus:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
