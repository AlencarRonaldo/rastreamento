'use client';

import { useAuthStore } from '@/store/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'operator' | 'viewer';
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

export default function PermissionGuard({ 
  children, 
  requiredRole = 'viewer',
  fallback,
  showMessage = true 
}: PermissionGuardProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return null;
  }

  const roleHierarchy = {
    admin: 3,
    operator: 2,
    viewer: 1
  };

  const userRoleLevel = roleHierarchy[user.role];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  const hasPermission = userRoleLevel >= requiredRoleLevel;

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showMessage) {
      return null;
    }

    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <Lock className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>
                Acesso restrito. Esta seção é disponível apenas para{' '}
                {requiredRole === 'admin' ? 'administradores' : 
                 requiredRole === 'operator' ? 'operadores' : 'usuários autorizados'}.
              </span>
            </div>
            <div className="mt-2 text-sm text-red-600">
              Seu nível atual: <span className="font-medium">{user.role}</span> | 
              Nível necessário: <span className="font-medium">{requiredRole}</span>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook para verificar permissões
export function usePermissions() {
  const { user } = useAuthStore();
  
  const hasRole = (role: 'admin' | 'operator' | 'viewer') => {
    if (!user) return false;
    
    const roleHierarchy = {
      admin: 3,
      operator: 2,
      viewer: 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[role];
  };

  const isAdmin = () => hasRole('admin');
  const isOperator = () => hasRole('operator');
  const isViewer = () => hasRole('viewer');

  return {
    user,
    hasRole,
    isAdmin: isAdmin(),
    isOperator: isOperator(),
    isViewer: isViewer()
  };
}