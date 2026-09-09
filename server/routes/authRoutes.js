const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, login);
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getMe);

module.exports = router;
