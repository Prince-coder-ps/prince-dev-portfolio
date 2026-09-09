const express = require('express');
const router = express.Router();
const {
  getPublicGallery, getAllGalleryAdmin, createGalleryItem, updateGalleryItem, deleteGalleryItem,
} = require('../controllers/galleryController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', getPublicGallery);

router.get('/admin/all', authenticateUser, authorizeAdmin, getAllGalleryAdmin);
router.post('/', authenticateUser, authorizeAdmin, uploadImage.single('image'), createGalleryItem);
router.put('/:id', authenticateUser, authorizeAdmin, updateGalleryItem);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteGalleryItem);

module.exports = router;
