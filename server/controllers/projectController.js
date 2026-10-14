const Project = require('../models/Project');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { ok, created } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

const slugify = (str) =>
  String(str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const OBJECT_ID = /^[a-f0-9]{24}$/i;

// Always produce a URL-safe slug (a-z, 0-9, hyphens). Falls back to the title,
// and finally to a generated value, so a project can never end up with an empty
// or unroutable slug (e.g. one containing spaces, "/", "?" or "#").
const buildSlug = (slug, title) =>
  slugify(slug) || slugify(title) || `project-${Date.now().toString(36)}`;

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
    // Accept the slug as stored, its normalized form (older projects may have been
    // saved with spaces/capitals), or the project's _id as a last-resort link.
    const key = String(req.params.slug || '').trim();
    const candidates = [key.toLowerCase(), slugify(key)].filter(Boolean);
    const match = [{ slug: { $in: candidates } }];
    if (OBJECT_ID.test(key)) match.push({ _id: key });

    const project = await Project.findOne({ published: true, $or: match });
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
    body.slug = buildSlug(body.slug, body.title);
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

    // Normalize the slug on every save, so re-saving an old project repairs it.
    if (body.slug !== undefined) {
      const clean = slugify(body.slug) || slugify(body.title);
      if (clean) body.slug = clean;
      else delete body.slug; // keep the existing slug
    }

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
