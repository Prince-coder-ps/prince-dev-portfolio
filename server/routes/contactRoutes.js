const express = require('express');
const router = express.Router();
const {
  submitContactMessage, getAllMessages, updateMessageStatus, deleteMessage,
} = require('../controllers/contactController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, submitContactMessage);

router.get('/', authenticateUser, authorizeAdmin, getAllMessages);
router.put('/:id', authenticateUser, authorizeAdmin, updateMessageStatus);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteMessage);

module.exports = router;
