import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

interface RoleBasedRedirectProps {
  // Roles que pueden acceder a la ruta destino
  allowedRoles: string[];
  // Ruta a la que redirigir si el usuario tiene uno de los roles permitidos
  redirectTo: string;
  // Ruta a la que redirigir si el usuario no tiene ninguno de los roles permitidos
  fallbackPath?: string;
  // Si es true, redirige a fallbackPath si el usuario no está autenticado
  requireAuth?: boolean;
}

/**
 * Componente que maneja redirecciones basadas en roles.
 * Útil para redirigir a los usuarios a diferentes dashboards según su rol.
 */
export const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({
  allowedRoles,
  redirectTo,
  fallbackPath = '/',
  requireAuth = true,
}) => {
  const { user, loading, hasRole } = useAuthContext();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si requiere autenticación y el usuario no está autenticado
  if (requireAuth && !user) {
    // Si uno de los roles permitidos es super_admin, redirigir al login de admin
    if (allowedRoles.includes('super_admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    // De lo contrario, redirigir al login normal
    return <Navigate to="/login" replace />;
  }

  // Si el usuario tiene uno de los roles permitidos, redirigir a la ruta destino
  if (user && allowedRoles.some(role => hasRole(role))) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si el usuario no tiene ninguno de los roles permitidos, redirigir a la ruta fallback
  return <Navigate to={fallbackPath} replace />;
};

/**
 * Componente específico para redireccionar a super_admin al dashboard correspondiente
 */
export const SuperAdminRedirect: React.FC = () => {
  return (
    <RoleBasedRedirect
      allowedRoles={['super_admin']}
      redirectTo="/admin/dashboard"
      fallbackPath="/access-denied"
      requireAuth={true}
    />
  );
};

/**
 * Componente específico para redireccionar a administradores de empresa al dashboard correspondiente
 */
export const CompanyAdminRedirect: React.FC = () => {
  return (
    <RoleBasedRedirect
      allowedRoles={['company_admin']}
      redirectTo="/company/dashboard"
      fallbackPath="/access-denied"
      requireAuth={true}
    />
  );
};

/**
 * Componente específico para redireccionar a administradores de sucursal al dashboard correspondiente
 */
export const BranchAdminRedirect: React.FC = () => {
  return (
    <RoleBasedRedirect
      allowedRoles={['branch_admin']}
      redirectTo="/branch/dashboard"
      fallbackPath="/access-denied"
      requireAuth={true}
    />
  );
};

/**
 * Componente específico para redireccionar a clientes al dashboard correspondiente
 */
export const CustomerRedirect: React.FC = () => {
  return (
    <RoleBasedRedirect
      allowedRoles={['customer']}
      redirectTo="/customer/dashboard"
      fallbackPath="/"
      requireAuth={true}
    />
  );
};

/**
 * Componente para redireccionar a cualquier usuario autenticado según su rol
 */
export const SmartRedirect: React.FC = () => {
  const { user, hasRole } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasRole('super_admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (hasRole('company_admin')) {
    return <Navigate to="/company/dashboard" replace />;
  }

  if (hasRole('branch_admin')) {
    return <Navigate to="/branch/dashboard" replace />;
  }

  if (hasRole('customer')) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // Si no tiene ningún rol específico, redirigir a la página principal
  return <Navigate to="/" replace />;
};