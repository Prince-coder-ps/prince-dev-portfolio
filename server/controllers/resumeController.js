const Resume = require('../models/Resume');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { ok, created } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

// Public: get the currently active resume
const getActiveResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ active: true }).sort({ createdAt: -1 });
    if (!resume) throw new ApiError(404, 'No resume is currently available.');
    return ok(res, 'Resume fetched.', { resume });
  } catch (err) {
    next(err);
  }
};

// Admin: list all uploaded resumes
const getAllResumesAdmin = async (req, res, next) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    return ok(res, 'Resumes fetched.', { resumes });
  } catch (err) {
    next(err);
  }
};

// Admin: upload a new resume and set it active (deactivating others)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'A PDF file is required.');

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/resume', 'raw');

    await Resume.updateMany({}, { active: false });

    const resume = await Resume.create({
      fileUrl: result.secure_url,
      publicId: result.public_id,
      originalName: req.file.originalname,
      active: true,
    });

    return created(res, 'Resume uploaded and activated.', { resume });
  } catch (err) {
    next(err);
  }
};

const setActiveResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) throw new ApiError(404, 'Resume not found.');

    await Resume.updateMany({}, { active: false });
    resume.active = true;
    await resume.save();

    return ok(res, 'Resume activated.', { resume });
  } catch (err) {
    next(err);
  }
};

const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) throw new ApiError(404, 'Resume not found.');

    await deleteFromCloudinary(resume.publicId, 'raw').catch(() => {});
    await resume.deleteOne();

    return ok(res, 'Resume deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getActiveResume, getAllResumesAdmin, uploadResume, setActiveResume, deleteResume };
