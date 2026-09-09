const express = require('express');
const router = express.Router();
const {
  getPublicProjects,
  getPublicProjectBySlug,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectThumbnail,
  addProjectImage,
} = require('../controllers/projectController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// Public
router.get('/', getPublicProjects);
router.get('/slug/:slug', getPublicProjectBySlug);

// Protected (admin)
router.get('/admin/all', authenticateUser, authorizeAdmin, getAllProjectsAdmin);
router.post('/', authenticateUser, authorizeAdmin, createProject);
router.put('/:id', authenticateUser, authorizeAdmin, updateProject);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteProject);
router.post(
  '/:id/thumbnail',
  authenticateUser,
  authorizeAdmin,
  uploadImage.single('image'),
  uploadProjectThumbnail
);
router.post(
  '/:id/images',
  authenticateUser,
  authorizeAdmin,
  uploadImage.single('image'),
  addProjectImage
);

module.exports = router;
