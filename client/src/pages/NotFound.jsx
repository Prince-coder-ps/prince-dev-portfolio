import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem' }}>404</h1>
    <p style={{ color: 'var(--color-muted)' }}>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
