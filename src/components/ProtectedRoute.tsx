import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-6xl">🚫</p>
          <h1 className="text-2xl font-heading font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
          <a href="/" className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-heading font-semibold hover:bg-accent-hover transition-colors">Go Home</a>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
