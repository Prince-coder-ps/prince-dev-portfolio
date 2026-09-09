const express = require('express');
const router = express.Router();
const {
  getActiveResume, getAllResumesAdmin, uploadResume, setActiveResume, deleteResume,
} = require('../controllers/resumeController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { uploadDocument } = require('../middleware/upload');

router.get('/', getActiveResume);

router.get('/admin/all', authenticateUser, authorizeAdmin, getAllResumesAdmin);
router.post('/', authenticateUser, authorizeAdmin, uploadDocument.single('resume'), uploadResume);
router.put('/:id/activate', authenticateUser, authorizeAdmin, setActiveResume);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteResume);

module.exports = router;
