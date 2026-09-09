const ContactMessage = require('../models/ContactMessage');
const { sendContactNotification } = require('../utils/sendEmail');
const { ok, created } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

const MAX_MESSAGE_LENGTH = 3000;

// Public: submit a contact message
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, honeypot } = req.body;

    // Honeypot field: real users never fill this in; bots often do.
    if (honeypot) {
      // Silently pretend success so bots don't learn the field is checked.
      return created(res, 'Message sent successfully.');
    }

    if (!name || !email || !message) {
      throw new ApiError(400, 'Name, email, and message are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Please provide a valid email address.');
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new ApiError(400, `Message must be under ${MAX_MESSAGE_LENGTH} characters.`);
    }

    const contactMessage = await ContactMessage.create({
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      phone: (phone || '').slice(0, 30),
      subject: (subject || '').slice(0, 200),
      message,
      ip: req.ip,
    });

    // Don't let an SMTP failure block the visitor's success response.
    sendContactNotification(contactMessage).catch((err) =>
      console.error('Failed to send contact notification email:', err.message)
    );

    return created(res, 'Message sent successfully.');
  } catch (err) {
    next(err);
  }
};

// Admin: list all messages
const getAllMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    const unreadCount = await ContactMessage.countDocuments({ read: false });
    return ok(res, 'Messages fetched.', { messages, unreadCount });
  } catch (err) {
    next(err);
  }
};

const updateMessageStatus = async (req, res, next) => {
  try {
    const update = {};
    if (typeof req.body.read === 'boolean') update.read = req.body.read;
    if (req.body.status) update.status = req.body.status;

    const message = await ContactMessage.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!message) throw new ApiError(404, 'Message not found.');

    return ok(res, 'Message updated.', { message });
  } catch (err) {
    next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) throw new ApiError(404, 'Message not found.');
    return ok(res, 'Message deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContactMessage, getAllMessages, updateMessageStatus, deleteMessage };
