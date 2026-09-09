import useContent from '../../hooks/useContent';
import { getDashboardStats } from '../../services/content';
import AsyncState from '../../components/AsyncState';
import './Dashboard.css';

const Dashboard = () => {
  const { data, loading, error } = useContent(getDashboardStats);
  const stats = data?.stats;
  const recentMessages = data?.recentMessages || [];

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <AsyncState loading={loading} error={error} isEmpty={false}>
        <div className="stat-grid">
          <StatCard label="Projects" value={stats?.totalProjects} />
          <StatCard label="Skills" value={stats?.totalSkills} />
          <StatCard label="Certifications" value={stats?.totalCertifications} />
          <StatCard label="Gallery items" value={stats?.totalGalleryItems} />
          <StatCard label="Messages" value={stats?.totalMessages} />
          <StatCard label="Unread messages" value={stats?.unreadMessages} accent />
        </div>

        <p className="dashboard__resume-status">Resume status: <strong>{stats?.resumeStatus}</strong></p>

        <h2 className="dashboard__section-title">Recent messages</h2>
        {recentMessages.length === 0 ? (
          <p className="state-message">No messages yet.</p>
        ) : (
          <ul className="dashboard__messages">
            {recentMessages.map((m) => (
              <li key={m._id}>
                <div>
                  <strong>{m.name}</strong> <span>{m.email}</span>
                </div>
                <p>{m.message.slice(0, 120)}{m.message.length > 120 ? '…' : ''}</p>
                <span className={`pill ${m.read ? 'pill--off' : 'pill--on'}`}>{m.read ? 'Read' : 'Unread'}</span>
              </li>
            ))}
          </ul>
        )}
      </AsyncState>
    </div>
  );
};

const StatCard = ({ label, value, accent }) => (
  <div className={`stat-card ${accent ? 'stat-card--accent' : ''}`}>
    <span>{label}</span>
    <strong>{value ?? '—'}</strong>
  </div>
);

export default Dashboard;
