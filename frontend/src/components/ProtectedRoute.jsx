import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary-rose)' }}>
          Preparing your atelier...
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary-rose)' }}>
          Verifying administrative credentials...
        </div>
      </div>
    );
  }

  return user && isAdmin ? <Outlet /> : <Navigate to="/auth" replace />;
};
