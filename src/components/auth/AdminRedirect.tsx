import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AdminRedirect: React.FC = () => {
  const { user, loading, isSuperAdmin } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso de administrador...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login de super admin
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si está autenticado y es super admin, redirigir al dashboard
  if (isSuperAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Si está autenticado pero no es super admin, mostrar acceso denegado
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
        <p className="text-gray-600 mb-6">Solo los super administradores pueden acceder a esta área.</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
};