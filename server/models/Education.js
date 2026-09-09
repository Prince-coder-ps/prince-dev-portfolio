const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    duration: { type: String, default: '' },
    status: { type: String, default: '' }, // e.g. "Pursuing", "Completed"
    scoreLabel: { type: String, default: '' }, // e.g. "CGPA: 7.4" or "84.20%"
    description: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
