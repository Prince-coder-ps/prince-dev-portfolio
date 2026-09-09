const Project = require('../models/Project');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { ok, created } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Public: only published projects, ordered
const getPublicProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return ok(res, 'Projects fetched.', { projects });
  } catch (err) {
    next(err);
  }
};

const getPublicProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true });
    if (!project) throw new ApiError(404, 'Project not found.');
    return ok(res, 'Project fetched.', { project });
  } catch (err) {
    next(err);
  }
};

// Admin: all projects regardless of published state
const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return ok(res, 'Projects fetched.', { projects });
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.title) body.slug = slugify(body.title);
    if (typeof body.technologies === 'string') body.technologies = JSON.parse(body.technologies);
    if (typeof body.features === 'string') body.features = JSON.parse(body.features);

    const project = await Project.create(body);
    return created(res, 'Project created.', { project });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (typeof body.technologies === 'string') body.technologies = JSON.parse(body.technologies);
    if (typeof body.features === 'string') body.features = JSON.parse(body.features);

    const project = await Project.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!project) throw new ApiError(404, 'Project not found.');
    return ok(res, 'Project updated.', { project });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new ApiError(404, 'Project not found.');

    const imagesToDelete = [project.thumbnail?.publicId, ...(project.images || []).map((i) => i.publicId)]
      .filter(Boolean);
    await Promise.all(imagesToDelete.map((id) => deleteFromCloudinary(id).catch(() => {})));

    await project.deleteOne();
    return ok(res, 'Project deleted.');
  } catch (err) {
    next(err);
  }
};

const uploadProjectThumbnail = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No image file provided.');
    const project = await Project.findById(req.params.id);
    if (!project) throw new ApiError(404, 'Project not found.');

    if (project.thumbnail?.publicId) {
      await deleteFromCloudinary(project.thumbnail.publicId).catch(() => {});
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');
    project.thumbnail = { url: result.secure_url, publicId: result.public_id };
    await project.save();

    return ok(res, 'Thumbnail uploaded.', { project });
  } catch (err) {
    next(err);
  }
};

const addProjectImage = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No image file provided.');
    const project = await Project.findById(req.params.id);
    if (!project) throw new ApiError(404, 'Project not found.');

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');
    project.images.push({ url: result.secure_url, publicId: result.public_id, caption: req.body.caption || '' });
    await project.save();

    return ok(res, 'Image added.', { project });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicProjects,
  getPublicProjectBySlug,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectThumbnail,
  addProjectImage,
};
