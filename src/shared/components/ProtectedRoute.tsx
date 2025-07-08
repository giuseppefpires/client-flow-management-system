
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { usePermissions } from '@/domains/auth/hooks/usePermissions';
import { UserRole } from '@/domains/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
      <p className="text-muted-foreground mb-4">
        Você não tem permissão para acessar esta página.
      </p>
      <Navigate to="/" replace />
    </div>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const { hasRole, hasPermission } = usePermissions();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <UnauthorizedPage />;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <UnauthorizedPage />;
  }
  
  return <>{children}</>;
};
