const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Programming', 'Frontend', 'Backend', 'Databases', 'Tools', 'Concepts'],
    },
    proficiency: { type: Number, min: 0, max: 100, default: 60 },
    icon: { type: String, default: '' }, // react-icons key, e.g. "SiReact"
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
