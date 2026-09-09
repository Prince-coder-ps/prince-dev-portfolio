const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
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

module.exports = mongoose.model('Certification', certificationSchema);
