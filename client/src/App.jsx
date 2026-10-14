import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Everything below is code-split: public visitors never download the admin
// panel, and the project detail page loads only when it is opened.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager'));
const SkillsManager = lazy(() => import('./pages/admin/SkillsManager'));
const EducationManager = lazy(() => import('./pages/admin/EducationManager'));
const CertificationsManager = lazy(() => import('./pages/admin/CertificationsManager'));
const GalleryManager = lazy(() => import('./pages/admin/GalleryManager'));
const ResumeManager = lazy(() => import('./pages/admin/ResumeManager'));
const MessagesManager = lazy(() => import('./pages/admin/MessagesManager'));
const ProfileManager = lazy(() => import('./pages/admin/ProfileManager'));

const RouteFallback = () => (
  <p className="state-message container" role="status">Loading…</p>
);

// The auth session check (/auth/me) now only runs for admin routes, instead of
// on every public page view.
const AuthShell = () => (
  <AuthProvider>
    <Suspense fallback={<RouteFallback />}>
      <Outlet />
    </Suspense>
  </AuthProvider>
);

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Route>

        <Route element={<AuthShell />}>
          {/* Admin auth — deliberately not linked from the public navbar */}
          <Route path="/secure-admin-login" element={<Login />} />

          {/* Admin dashboard — protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="education" element={<EducationManager />} />
            <Route path="certifications" element={<CertificationsManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="resume" element={<ResumeManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="profile" element={<ProfileManager />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
