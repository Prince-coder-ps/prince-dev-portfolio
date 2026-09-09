const express = require('express');
const router = express.Router();
const { getPublic, getAllAdmin, createItem, updateItem, deleteItem } = require('../controllers/skillController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

router.get('/', getPublic);

router.get('/admin/all', authenticateUser, authorizeAdmin, getAllAdmin);
router.post('/', authenticateUser, authorizeAdmin, createItem);
router.put('/:id', authenticateUser, authorizeAdmin, updateItem);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteItem);

module.exports = router;
