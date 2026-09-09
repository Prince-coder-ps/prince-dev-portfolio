import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p className="state-message" role="status">Checking session…</p>;
  if (!isAuthenticated) return <Navigate to="/secure-admin-login" replace />;

  return children;
};

export default ProtectedRoute;
