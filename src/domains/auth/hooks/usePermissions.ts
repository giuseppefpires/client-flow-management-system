
import { useAuth } from './useAuth';
import { UserRole } from '../types';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Admins têm todas as permissões  
    if (user.role === 'admin') return true;

    // Implementar lógica específica de permissões
    switch (permission) {
      case 'manage_users':
        return user.role === 'admin' || user.role === 'moderator';
      case 'view_reports':
        return user.role === 'admin' || user.role === 'moderator';
      case 'manage_clients':
        return true; // Todos os usuários autenticados podem gerenciar clientes
      default:
        return false;
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isModerator = (): boolean => {
    return user?.role === 'moderator';
  };

  return {
    hasPermission,
    hasRole,
    isAdmin,
    isModerator,
  };
};
