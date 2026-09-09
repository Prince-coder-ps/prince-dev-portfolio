const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

router.get('/stats', authenticateUser, authorizeAdmin, getDashboardStats);

module.exports = router;
