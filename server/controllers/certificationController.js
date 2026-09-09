const Certification = require('../models/Certification');
const buildCrud = require('./genericCrud');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { ok } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

const base = buildCrud(Certification, { visibleField: 'visible', label: 'Certification' });

const uploadCertificationImage = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No file provided.');
    const record = await Certification.findById(req.params.id);
    if (!record) throw new ApiError(404, 'Certification not found.');

    if (record.image?.publicId) {
      await deleteFromCloudinary(record.image.publicId, 'raw').catch(() => {});
    }

    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/certifications', resourceType);
    record.image = { url: result.secure_url, publicId: result.public_id };
    await record.save();

    return ok(res, 'Certificate file uploaded.', { item: record });
  } catch (err) {
    next(err);
  }
};

module.exports = { ...base, uploadCertificationImage };
