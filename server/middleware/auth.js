const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Verifies the JWT from the HTTP-only cookie (or Authorization header as fallback)
// and attaches req.admin.
const authenticateUser = async (req, res, next) => {
  try {
    const cookieName = process.env.JWT_COOKIE_NAME || 'portfolio_token';
    let token = req.cookies?.[cookieName];

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid session.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
};

// Must be used after authenticateUser
const authorizeAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }
  next();
};

module.exports = { authenticateUser, authorizeAdmin };
