/**
 * File Upload Middleware
 * 
 * This module configures Multer for handling file uploads with validation.
 * It enforces file size limits and file type restrictions for resume uploads.
 * 
 * Configuration:
 * - Storage: Memory storage (files stored in memory as Buffer objects)
 * - File size limit: 5MB
 * - Allowed file types: PDF, DOC, DOCX
 * 
 * @module middleware/upload
 */

const multer = require('multer');

/**
 * Configure Multer storage to use memory storage
 * Files will be available as req.file.buffer
 */
const storage = multer.memoryStorage();

/**
 * File filter function to validate file types
 * Only allows PDF and DOC/DOCX files for resume uploads
 * 
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Allowed MIME types for resumes
  const allowedMimeTypes = [
    'application/pdf',                                                      // PDF
    'application/msword',                                                   // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Accept file
    cb(null, true);
  } else {
    // Reject file with error
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

/**
 * Configure Multer with storage, file filter, and size limits
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB in bytes
  }
});

module.exports = upload;
