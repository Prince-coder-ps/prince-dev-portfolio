const mongoose = require('mongoose');

// Singleton document holding site-wide profile/hero/about content.
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Prince Saini' },
    eyebrow: { type: String, default: 'Final Year CSE Student' }, // small text above hero heading
    heroHeading: { type: String, default: "Hi, I'm Prince Saini." },
    title: { type: String, default: 'Full Stack Developer' },
    tagline: { type: String, default: 'Building Ideas Into Scalable Web Experiences.' },
    heroDescription: {
      type: String,
      default:
        'Full-stack developer with a strong foundation in Data Structures & Algorithms, OOP, and DBMS. I build real-world MERN applications and I\'m always working toward writing cleaner, more scalable code.',
    },
    aboutText: {
      type: String,
      default:
        "I\u2019m currently pursuing my B.Tech in Computer Science & Engineering at SAITM, Gurugram. Initially, I was interested in front-end development, but as I started working on different projects, my interest gradually grew towards full-stack development.\n\nNow, I enjoy more than just building the UI. I like understanding and building the complete application \u2014 from the database and backend APIs to the frontend interface. Through this journey, I\u2019ve built projects using the MERN stack, with SaarthiX being my main project.\n\nAlong with development, I\u2019m also focusing on Data Structures & Algorithms, clean code, and system design. I believe a good developer should not only know how to write code but also understand how to make it better, reliable, and maintainable.\n\nRight now, my main focus is on continuously learning, building better projects, and improving my problem-solving skills so that I can eventually contribute as a strong Software Development Engineer.",
    },
    email: { type: String, default: 'prince.saini0116@gmail.com' },
    phone: { type: String, default: '+91 9610846739' },
    location: { type: String, default: 'Gurugram, India' },
    openToRelocation: { type: Boolean, default: true },
    // Defaults point at the legacy portfolio photos shipped in /public/legacy-assets
    // so the site isn't blank before Cloudinary is configured. Replace via the
    // admin Profile page once Cloudinary credentials are set up.
    profileImage: {
      url: { type: String, default: '/legacy-assets/me.png' },
      publicId: { type: String, default: '' },
    },
    aboutImage: {
      url: { type: String, default: '/legacy-assets/prince.jpeg' },
      publicId: { type: String, default: '' },
    },
    socials: {
      github: { type: String, default: 'https://github.com/Prince-coder-ps' },
      linkedin: { type: String, default: 'https://www.linkedin.com/in/prince-saini04' },
      instagram: { type: String, default: 'https://www.instagram.com/saini_prince16' },
      twitter: { type: String, default: '' },
      telegram: { type: String, default: '' },
      dev: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
