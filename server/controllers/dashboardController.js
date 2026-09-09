const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const Gallery = require('../models/Gallery');
const ContactMessage = require('../models/ContactMessage');
const Resume = require('../models/Resume');
const { ok } = require('../utils/apiResponse');

const getDashboardStats = async (req, res, next) => {
  try {
    const [projects, skills, certifications, galleryItems, messages, unreadMessages, activeResume] =
      await Promise.all([
        Project.countDocuments(),
        Skill.countDocuments(),
        Certification.countDocuments(),
        Gallery.countDocuments(),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ read: false }),
        Resume.findOne({ active: true }),
      ]);

    const recentMessages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5);

    return ok(res, 'Dashboard stats fetched.', {
      stats: {
        totalProjects: projects,
        totalSkills: skills,
        totalCertifications: certifications,
        totalGalleryItems: galleryItems,
        totalMessages: messages,
        unreadMessages,
        resumeStatus: activeResume ? 'Active resume on file' : 'No resume uploaded',
      },
      recentMessages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats };
