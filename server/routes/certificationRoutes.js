const express = require('express');
const router = express.Router();
const {
  getPublic, getAllAdmin, createItem, updateItem, deleteItem, uploadCertificationImage,
} = require('../controllers/certificationController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', getPublic);

router.get('/admin/all', authenticateUser, authorizeAdmin, getAllAdmin);
router.post('/', authenticateUser, authorizeAdmin, createItem);
router.put('/:id', authenticateUser, authorizeAdmin, updateItem);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteItem);
router.post('/:id/image', authenticateUser, authorizeAdmin, uploadImage.single('image'), uploadCertificationImage);

module.exports = router;
