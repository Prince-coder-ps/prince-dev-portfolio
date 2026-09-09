// One-time seed script: populates the DB with the content confirmed from
// Prince's resume + existing portfolio, and creates the first admin account.
// Run with: npm run seed  (after setting up .env)

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Project = require('../models/Project');

const skills = [
  { name: 'Java', category: 'Programming', proficiency: 60, order: 1 },
  { name: 'React.js', category: 'Frontend', proficiency: 50, order: 1 },
  { name: 'HTML5', category: 'Frontend', proficiency: 90, order: 2 },
  { name: 'CSS', category: 'Frontend', proficiency: 85, order: 3 },
  { name: 'Bootstrap', category: 'Frontend', proficiency: 75, order: 4 },
  { name: 'Node.js', category: 'Backend', proficiency: 60, order: 1 },
  { name: 'Express.js', category: 'Backend', proficiency: 60, order: 2 },
  { name: 'REST APIs', category: 'Backend', proficiency: 65, order: 3 },
  { name: 'MongoDB', category: 'Databases', proficiency: 55, order: 1 },
  { name: 'MySQL', category: 'Databases', proficiency: 60, order: 2 },
  { name: 'Git', category: 'Tools', proficiency: 80, order: 1 },
  { name: 'GitHub', category: 'Tools', proficiency: 80, order: 2 },
  { name: 'VS Code', category: 'Tools', proficiency: 85, order: 3 },
  { name: 'Data Structures & Algorithms', category: 'Concepts', proficiency: 60, order: 1 },
  { name: 'OOP', category: 'Concepts', proficiency: 65, order: 2 },
  { name: 'DBMS', category: 'Concepts', proficiency: 60, order: 3 },
  { name: 'System Design Fundamentals', category: 'Concepts', proficiency: 40, order: 4 },
  { name: 'Clean Code', category: 'Concepts', proficiency: 60, order: 5 },
];

const education = [
  {
    degree: 'Bachelor of Technology in Computer Science & Engineering',
    institution: 'St. Andrews Institute of Technology & Management (SAITM), Gurugram',
    duration: 'Sep 2023 – Jun 2027 (Expected)',
    status: 'Pursuing',
    scoreLabel: 'CGPA: 7.4',
    description:
      'Relevant coursework: Data Structures & Algorithms, Database Management Systems, Object-Oriented Programming, Software Engineering, Operating Systems, Computer Networks.',
    image: { url: '/legacy-assets/SAITM.webp', publicId: '' },
    order: 1,
  },
  {
    degree: 'Senior Secondary (Class XII)',
    institution: 'RBSE',
    duration: '',
    status: 'Completed',
    scoreLabel: '84.20%',
    description: '',
    image: { url: '/legacy-assets/School.avif', publicId: '' },
    order: 2,
  },
  {
    degree: 'Secondary (Class X)',
    institution: 'RBSE',
    duration: '',
    status: 'Completed',
    scoreLabel: '89.67%',
    description: '',
    order: 3,
  },
];

const certifications = [
  {
    name: 'Full Stack Web Development Certification',
    issuer: 'Kreativan Technologies',
    description: 'End-to-end web development: frontend, backend logic, and database integration.',
    order: 1,
  },
  {
    name: 'Frontend Development Certification',
    issuer: 'Kreativan Technologies',
    description: 'HTML5, CSS3, JavaScript, Responsive Design, and Bootstrap frameworks.',
    order: 2,
  },
  {
    name: 'Coding Fundamentals (C, HTML, CSS)',
    issuer: 'Coding Blocks',
    description: '',
    order: 3,
  },
  {
    name: 'Coding and Programming',
    issuer: 'Samsung Innovation Campus',
    description: '',
    order: 4,
  },
  {
    name: 'IT Fundamentals',
    issuer: 'IBM',
    description: '',
    order: 5,
  },
  {
    name: 'JavaScript (Basic)',
    issuer: 'HackerRank',
    description: '',
    order: 6,
  },
];

const projects = [
  {
    title: 'SaarthiX',
    slug: 'saarthix',
    shortDescription: 'A full-stack MERN alumni-student mentorship platform with role-based dashboards.',
    detailedDescription:
      'SaarthiX is a full-stack MERN (MongoDB, Express, React, Node.js) alumni-student mentorship platform with role-based dashboards for students, alumni, and admin. It supports a mentorship workflow (request → accept/reject → schedule session → mark complete) with status tracking, plus a social feed for posts across user roles.',
    features: [
      'Role-based dashboards for students, alumni, and admin',
      'Mentorship workflow with status tracking (request, accept/reject, schedule, complete)',
      'Social feed for posts across user roles',
      'Secure JWT authentication with bcrypt password hashing',
      'Role-based access control (RBAC) on protected routes',
      'Admin panel for verifying alumni and managing users',
      'Helmet security headers, CORS whitelisting, rate limiting on auth routes',
      'React frontend with React Query for server state and Axios for API calls',
    ],
    technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'React Query', 'Axios'],
    category: 'MERN Stack',
    featured: true,
    order: 1,
    year: '2026',
  },
  {
    title: 'MyGallery',
    slug: 'mygallery',
    shortDescription: 'Full-stack media showcase platform for uploading and organizing photos & videos.',
    detailedDescription:
      'MyGallery lets users upload, organize, and showcase photos/videos with secure authentication and session management, role-based access control for public/private media visibility, and a personalized profile-based gallery per user.',
    features: [
      'Secure authentication and session management',
      'Role-based access control for public/private media visibility',
      'Personalized profile-based gallery per user',
      'Category-based media filtering system',
      'Interactive image slider',
      'Normalized SQL schema with prepared statements to prevent SQL injection',
    ],
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    category: 'Full Stack',
    featured: false,
    order: 2,
    year: '2025',
    thumbnail: { url: '/legacy-assets/MyGallery.jpg', publicId: '' },
  },
  {
    title: 'RDI Institute',
    slug: 'rdi-institute',
    shortDescription: 'Responsive institutional informational website for a real-world client.',
    detailedDescription:
      'A multi-page responsive website developed for a real-world client, achieving cross-device compatibility across mobile, tablet, and desktop, with a functional contact form and smooth scroll navigation.',
    features: [
      'Multi-page responsive design',
      'Functional contact form with client-side validation',
      'Smooth scroll navigation',
      'Cross-device compatibility (mobile, tablet, desktop)',
      'CSS Flexbox layout for consistent rendering across browsers',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    category: 'Frontend',
    featured: false,
    order: 3,
    year: '2025',
    liveUrl: 'https://instituedemo.netlify.app',
    githubUrl: 'https://github.com/Prince-coder-ps/instituteDemo',
    thumbnail: { url: '/legacy-assets/RDI.jpg', publicId: '' },
  },
  {
    title: 'Landing Page Website',
    slug: 'landing-page-website',
    shortDescription: 'A responsive landing page built with HTML, CSS, and JavaScript.',
    detailedDescription: 'An earlier responsive landing page project built with HTML, CSS, and JavaScript.',
    features: [],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Frontend',
    featured: false,
    order: 4,
    year: '',
    githubUrl: 'https://github.com/Prince-coder-ps/CodeSoft/blob/main/LandingPage/index.html',
    thumbnail: { url: '/legacy-assets/CartoonUniverse.jpg', publicId: '' },
  },
  {
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    shortDescription: 'A responsive personal portfolio website built with HTML, CSS, and JavaScript.',
    detailedDescription:
      'The original single-page personal portfolio website, later rebuilt as this MERN application.',
    features: [],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Frontend',
    featured: false,
    order: 5,
    year: '',
    githubUrl: 'https://github.com/Prince-coder-ps/CodeSoft/tree/main/Portfolio',
    thumbnail: { url: '/legacy-assets/portfolio.png', publicId: '' },
  },
];

const run = async () => {
  await connectDB();

  console.log('Seeding admin account...');
  const adminEmail = (process.env.ADMIN_SEED_EMAIL || '').toLowerCase();
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD not set — skipping admin creation.');
  } else {
    const existing = await Admin.findOne({ email: adminEmail });
    if (!existing) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await Admin.create({ email: adminEmail, passwordHash, role: 'ADMIN' });
      console.log(`Admin account created: ${adminEmail}`);
    } else {
      console.log('Admin account already exists — skipping.');
    }
  }

  console.log('Seeding profile...');
  const profileExists = await Profile.findOne();
  if (!profileExists) {
    await Profile.create({});
    console.log('Default profile created.');
  }

  console.log('Seeding skills...');
  for (const s of skills) {
    await Skill.updateOne({ name: s.name }, { $setOnInsert: s }, { upsert: true });
  }

  console.log('Seeding education...');
  for (const e of education) {
    await Education.updateOne({ degree: e.degree, institution: e.institution }, { $setOnInsert: e }, { upsert: true });
  }

  console.log('Seeding certifications...');
  for (const c of certifications) {
    await Certification.updateOne({ name: c.name, issuer: c.issuer }, { $setOnInsert: c }, { upsert: true });
  }

  console.log('Seeding projects...');
  for (const p of projects) {
    await Project.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
  }

  console.log('Seed complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
