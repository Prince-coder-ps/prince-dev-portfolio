const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    takenAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
