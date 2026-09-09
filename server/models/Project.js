const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, default: '' },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    thumbnail: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    images: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],
    technologies: [{ type: String }],
    features: [{ type: String }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    category: { type: String, default: 'Full Stack' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    year: { type: String, default: '' },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1 });

module.exports = mongoose.model('Project', projectSchema);
