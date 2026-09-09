import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/education', label: 'Education' },
  { to: '/admin/certifications', label: 'Certifications' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/resume', label: 'Resume' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/profile', label: 'Profile' },
];

const AdminLayout = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/secure-admin-login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">Portfolio CMS</div>
        <nav>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <p>{admin?.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
