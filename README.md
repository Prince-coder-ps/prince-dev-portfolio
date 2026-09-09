# Prince Saini — MERN Portfolio + CMS

A full-stack portfolio website with a built-in content-management admin panel, built with MongoDB, Express, React (Vite), and Node.js. Rebuilt from an original static HTML/CSS/JS portfolio, using the resume and existing site as the source of truth for all professional content.

## Features

- **Public site**: Hero, About, Skills, Projects (+ dedicated project detail pages), Education, Certifications, Gallery, Contact — all content loaded dynamically from MongoDB, not hard-coded.
- **Admin CMS** at a non-obvious route (`/secure-admin-login`), protected by real authentication (JWT + HTTP-only cookies + bcrypt), not by the route being secret.
- Full CRUD for Projects, Skills, Education, Certifications, Gallery, Resume, and Profile/Hero/About content, plus a Contact Messages inbox with read/unread tracking.
- Cloudinary-backed image and resume storage (no local file paths that break on deploy).
- Contact form backed by a rate-limited, validated, sanitized API with SMTP email notifications via Nodemailer.
- Security: Helmet, CORS whitelist, rate limiting (general/login/contact), Mongo sanitization, XSS cleaning, brute-force login lockout, centralized error handling that never leaks stack traces in production.

## Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, Framer Motion, react-hot-toast, react-icons. Plain modern CSS (no Tailwind, no TypeScript).

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, Cloudinary, Nodemailer, Helmet, express-rate-limit.

## Folder Structure

```
prince-portfolio/
├── server/
│   ├── config/          # db.js, cloudinary.js
│   ├── controllers/     # business logic per resource
│   ├── middleware/       # auth, error handling, rate limiting, uploads
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers (public + admin split per resource)
│   ├── seed/              # seed.js — populates DB with real resume data + first admin
│   ├── utils/             # apiResponse.js, sendEmail.js
│   ├── app.js
│   └── server.js
└── client/
    └── src/
        ├── components/    # Navbar, Footer, shared UI, admin/ (Modal, DataTable, ConfirmDialog)
        ├── components/sections/  # Hero, About, Skills, Projects, Education, Certifications, Gallery, Contact
        ├── pages/         # Home, ProjectDetail, NotFound, admin/*
        ├── layouts/        # PublicLayout, AdminLayout
        ├── context/        # AuthContext
        ├── services/       # api.js, content.js
        ├── hooks/          # useContent.js
        └── styles/         # global.css (design tokens)
```

## Local Setup

### 1. Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- A Cloudinary account (free tier is enough)
- An SMTP account for outgoing email (Gmail app password, SendGrid, etc.)

### 2. Backend

```bash
cd server
cp .env.example .env   # fill in real values (see below)
npm install
npm run seed            # creates the first admin account + seeds resume-based content
npm run dev              # starts the API on http://localhost:5000
```

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev              # starts the site on http://localhost:5173
```

### 4. Environment Variables

**server/.env**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/prince-portfolio
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=1d
JWT_COOKIE_NAME=portfolio_token
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
CONTACT_RECEIVER=prince.saini0116@gmail.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_SEED_EMAIL=admin@example.com
ADMIN_SEED_PASSWORD=change_this_password
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### 5. Admin Access

Go to `http://localhost:5173/secure-admin-login` and sign in with the `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` you set before running `npm run seed`. Change the password by adding a "change password" endpoint if you plan to expose this publicly for real (not included by default — update `ADMIN_SEED_PASSWORD` and re-seed, or add one directly via MongoDB, for now).

**Important:** the login route is intentionally not linked from the public navbar, but security comes entirely from JWT authentication + bcrypt + role checks on every protected endpoint — not from the URL being hidden.

## Notes on Default Content

- The Hero and About sections ship with the exact copy that was reviewed and approved before this app was built.
- Project, Skill, Education, and Certification data is seeded directly from the resume. Nothing was invented.
- Image/thumbnail defaults temporarily point at `/legacy-assets/*` (copied from the original static portfolio) so the site isn't blank on first run. Replace them via the admin panel once Cloudinary is configured — new uploads will go to Cloudinary and can fully replace these fallbacks.
- Two project links (MyGallery repo, SaarthiX repo/live URL) were left blank per your instruction to fill them in later — do this from **Admin → Projects → Edit**.

## Production Build

```bash
# client
cd client && npm run build   # outputs to client/dist

# server
cd server && npm start
```

Set `NODE_ENV=production` in the server `.env` so cookies are marked `Secure` and error responses omit stack traces.

## Deployment

- **Frontend:** Vercel or Netlify — set `VITE_API_URL` to your deployed backend's URL.
- **Backend:** Render, Railway, or similar Node hosting — set all `server/.env` values as environment variables in the host's dashboard, and set `CLIENT_URL` to your deployed frontend's URL (comma-separate multiple origins if needed).
- **Database:** MongoDB Atlas.
- **Images/Resume:** Cloudinary.
- **Email:** any SMTP provider.

No localhost URLs are hard-coded anywhere — everything reads from environment variables.

## Security Notes

- Passwords are hashed with bcrypt (never stored or returned in plain text).
- JWTs are stored in HTTP-only cookies (not `localStorage`), with `Secure`/`SameSite=None` in production.
- Login endpoint is rate-limited and locks an account for 15 minutes after 5 failed attempts.
- All admin API routes require both authentication and `ADMIN` role authorization — the admin login route being hard to guess is not itself a security boundary.
- Contact form has a honeypot field, server-side validation, and rate limiting to reduce spam.
- CORS only allows the configured `CLIENT_URL` origin(s); Mongo/XSS sanitization is applied to all incoming input.
