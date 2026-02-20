const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

/**
 * @desc    Save a job
 * @route   POST /api/v1/saved/:jobId
 * @access  Private (jobSeeker)
 */
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check for duplicate saved job
    const existingSavedJob = await SavedJob.findOne({ userId, jobId });
    if (existingSavedJob) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Create saved job with savedAt timestamp
    const savedJob = await SavedJob.create({
      userId,
      jobId,
      savedAt: Date.now()
    });

    res.status(201).json({ savedJob });
  } catch (error) {
    console.error('Error in saveJob:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get saved jobs for authenticated user
 * @route   GET /api/v1/saved
 * @access  Private (jobSeeker)
 */
exports.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get saved jobs for authenticated user and populate job details
    const savedJobs = await SavedJob.find({ userId })
      .populate({
        path: 'jobId',
        select: 'title description company location salary skillsRequired employerId isActive createdAt'
      })
      .sort({ savedAt: -1 });

    res.status(200).json({ savedJobs });
  } catch (error) {
    console.error('Error in getSavedJobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Remove a saved job
 * @route   DELETE /api/v1/saved/:jobId
 * @access  Private (jobSeeker)
 */
exports.removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Delete saved job record
    const result = await SavedJob.findOneAndDelete({ userId, jobId });

    if (!result) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.status(200).json({ message: 'Saved job removed successfully' });
  } catch (error) {
    console.error('Error in removeSavedJob:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
