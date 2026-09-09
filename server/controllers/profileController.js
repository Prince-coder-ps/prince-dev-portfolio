const Profile = require('../models/Profile');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { ok } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

// Ensures a single Profile document always exists.
const getOrCreateProfile = async () => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  return profile;
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile();
    return ok(res, 'Profile fetched.', { profile });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile();

    const allowedFields = [
      'name', 'eyebrow', 'heroHeading', 'title', 'tagline', 'heroDescription',
      'aboutText', 'email', 'phone', 'location', 'openToRelocation',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) profile[field] = req.body[field];
    });

    if (req.body.socials) {
      profile.socials = { ...profile.socials.toObject(), ...req.body.socials };
    }

    await profile.save();
    return ok(res, 'Profile updated.', { profile });
  } catch (err) {
    next(err);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No image file provided.');
    const profile = await getOrCreateProfile();

    const field = req.params.type === 'about' ? 'aboutImage' : 'profileImage';

    if (profile[field]?.publicId) {
      await deleteFromCloudinary(profile[field].publicId).catch(() => {});
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/profile');
    profile[field] = { url: result.secure_url, publicId: result.public_id };
    await profile.save();

    return ok(res, 'Image uploaded.', { profile });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, uploadProfileImage };
