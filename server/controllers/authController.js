const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { ok } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

const signToken = (admin) =>
  jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
});

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required.');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // Same generic message whether the user doesn't exist or the password is wrong.
    const invalidCredsError = new ApiError(401, 'Invalid email or password.');

    if (!admin) throw invalidCredsError;

    if (admin.isLocked()) {
      throw new ApiError(423, 'Account temporarily locked due to failed login attempts. Try again later.');
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      admin.failedLoginAttempts += 1;
      if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        admin.failedLoginAttempts = 0;
      }
      await admin.save();
      throw invalidCredsError;
    }

    admin.failedLoginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = signToken(admin);
    res.cookie(process.env.JWT_COOKIE_NAME || 'portfolio_token', token, cookieOptions());

    return ok(res, 'Logged in successfully.', { admin: admin.toJSON() });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  res.clearCookie(process.env.JWT_COOKIE_NAME || 'portfolio_token', cookieOptions());
  return ok(res, 'Logged out successfully.');
};

const getMe = async (req, res) => {
  return ok(res, 'Current admin fetched.', { admin: req.admin.toJSON() });
};

module.exports = { login, logout, getMe };
