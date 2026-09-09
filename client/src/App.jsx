import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProjectsManager from './pages/admin/ProjectsManager';
import SkillsManager from './pages/admin/SkillsManager';
import EducationManager from './pages/admin/EducationManager';
import CertificationsManager from './pages/admin/CertificationsManager';
import GalleryManager from './pages/admin/GalleryManager';
import ResumeManager from './pages/admin/ResumeManager';
import MessagesManager from './pages/admin/MessagesManager';
import ProfileManager from './pages/admin/ProfileManager';

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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
