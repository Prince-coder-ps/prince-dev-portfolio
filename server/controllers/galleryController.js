const Gallery = require('../models/Gallery');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { ok, created } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

const getPublicGallery = async (req, res, next) => {
  try {
    const items = await Gallery.find({ visible: true }).sort({ order: 1, createdAt: -1 });
    return ok(res, 'Gallery fetched.', { items });
  } catch (err) {
    next(err);
  }
};

const getAllGalleryAdmin = async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return ok(res, 'Gallery fetched.', { items });
  } catch (err) {
    next(err);
  }
};

// Upload + create in one step (gallery items require an image to exist)
const createGalleryItem = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'An image file is required.');

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/gallery');
    const item = await Gallery.create({
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'General',
      featured: req.body.featured === 'true' || req.body.featured === true,
      order: Number(req.body.order) || 0,
      image: { url: result.secure_url, publicId: result.public_id },
    });

    return created(res, 'Gallery item created.', { item });
  } catch (err) {
    next(err);
  }
};

const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Gallery item not found.');
    return ok(res, 'Gallery item updated.', { item });
  } catch (err) {
    next(err);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Gallery item not found.');

    if (item.image?.publicId) {
      await deleteFromCloudinary(item.image.publicId).catch(() => {});
    }
    await item.deleteOne();

    return ok(res, 'Gallery item deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicGallery,
  getAllGalleryAdmin,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
