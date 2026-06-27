import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading, verifyAdmin, logout } = useAuth();
  const location = useLocation();
  const [checkingAdmin, setCheckingAdmin] = useState(adminOnly);
  const [adminVerified, setAdminVerified] = useState(false);

  useEffect(() => {
    if (!adminOnly || loading) return;

    let active = true;

    const checkAdminAccess = async () => {
      if (!isAuthenticated) {
        if (active) {
          setCheckingAdmin(false);
          setAdminVerified(false);
        }
        return;
      }

      if (user?.role !== 'admin') {
        if (active) {
          setCheckingAdmin(false);
          setAdminVerified(false);
        }
        return;
      }

      if (active) setCheckingAdmin(true);

      const result = await verifyAdmin();
      if (!active) return;

      if (!result.isAdmin) {
        if (result.unauthorized) {
          logout();
        }
        setAdminVerified(false);
      } else {
        setAdminVerified(true);
      }
      setCheckingAdmin(false);
    };

    checkAdminAccess();

    return () => {
      active = false;
    };
  }, [adminOnly, loading, isAuthenticated, user?.role, verifyAdmin, logout]);

  if (loading || checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={adminOnly ? '/admin/login' : '/login'}
        replace
        state={adminOnly ? { from: location.pathname } : undefined}
      />
    );
  }

  if (adminOnly && (!adminVerified || user?.role !== 'admin')) {
    return <Navigate to="/" replace state={{ adminAccessDenied: true }} />;
  }

  if (!adminOnly && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRoute;
