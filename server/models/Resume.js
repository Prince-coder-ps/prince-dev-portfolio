const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    originalName: { type: String, default: 'resume.pdf' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
