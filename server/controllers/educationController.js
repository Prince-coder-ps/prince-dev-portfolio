const Education = require('../models/Education');
const buildCrud = require('./genericCrud');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { ok } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

const base = buildCrud(Education, { visibleField: 'visible', label: 'Education record' });

const uploadEducationImage = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No image file provided.');
    const record = await Education.findById(req.params.id);
    if (!record) throw new ApiError(404, 'Education record not found.');

    if (record.image?.publicId) {
      await deleteFromCloudinary(record.image.publicId).catch(() => {});
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/education');
    record.image = { url: result.secure_url, publicId: result.public_id };
    await record.save();

    return ok(res, 'Image uploaded.', { item: record });
  } catch (err) {
    next(err);
  }
};

module.exports = { ...base, uploadEducationImage };
