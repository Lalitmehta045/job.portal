const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant ID is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'rejected'],
      message: 'Status must be one of: pending, accepted, rejected'
    },
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate applications
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

// Indexes for performance optimization
applicationSchema.index({ applicantId: 1 });
applicationSchema.index({ jobId: 1 });

module.exports = mongoose.model('Application', applicationSchema);
