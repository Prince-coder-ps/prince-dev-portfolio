const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfileImage } = require('../controllers/profileController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// Public
router.get('/', getProfile);

// Protected
router.put('/', authenticateUser, authorizeAdmin, updateProfile);
router.post(
  '/image/:type', // type = 'profile' | 'about'
  authenticateUser,
  authorizeAdmin,
  uploadImage.single('image'),
  uploadProfileImage
);

module.exports = router;
