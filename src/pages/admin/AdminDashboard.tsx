import React from 'react';
import { Users, Shield, Building, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboard: React.FC = () => {
  const { user, profile, roles, isSuperAdmin, isCompanyAdmin, isBranchAdmin } = useAuth();

  const stats = [
    { name: 'Usuarios Totales', value: '1,234', icon: Users, color: 'text-blue-600' },
    { name: 'Comercios Activos', value: '56', icon: Building, color: 'text-green-600' },
    { name: 'QRs Vendidos', value: '8,901', icon: BarChart3, color: 'text-purple-600' },
    { name: 'Roles Configurados', value: '4', icon: Shield, color: 'text-orange-600' },
  ];

  const quickActions = [
    { name: 'Gestionar Usuarios', icon: Users, href: '/admin/users', color: 'bg-blue-600' },
    { name: 'Configurar Roles', icon: Shield, href: '/admin/roles', color: 'bg-green-600' },
    { name: 'Ver Comercios', icon: Building, href: '/admin/companies', color: 'bg-purple-600' },
    { name: 'Configuración', icon: Settings, href: '/admin/settings', color: 'bg-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, {profile?.first_name} {profile?.last_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {roles.map((role) => (
                <span
                  key={role.role_name}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    role.role_name === 'super_admin'
                      ? 'bg-red-100 text-red-800'
                      : role.role_name === 'company_admin'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {role.role_name.replace('_', ' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900 group-hover:text-gray-700">
                    {action.name}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Role-specific content */}
        {isSuperAdmin() && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Panel Super Administrador</h2>
            <p className="text-gray-600 mb-4">
              Como super administrador, tienes acceso completo a todas las funcionalidades del sistema.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2">Gestión de Sistema</h3>
                <p className="text-sm text-red-600">Configuración global, roles y permisos</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Comercios y Sucursales</h3>
                <p className="text-sm text-blue-600">Gestión completa de la red de ventas</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Reportes y Analytics</h3>
                <p className="text-sm text-green-600">Métricas y análisis del negocio</p>
              </div>
            </div>
          </div>
        )}

        {isCompanyAdmin() && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Panel Administrador de Comercio</h2>
            <p className="text-gray-600 mb-4">
              Gestiona tu comercio y todas sus sucursales desde este panel.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Mis Sucursales</h3>
                <p className="text-sm text-blue-600">Ver y gestionar todas las sucursales</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Comisiones</h3>
                <p className="text-sm text-green-600">Reportes de ventas y comisiones</p>
              </div>
            </div>
          </div>
        )}

        {isBranchAdmin() && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Panel Administrador de Sucursal</h2>
            <p className="text-gray-600 mb-4">
              Gestiona las operaciones de tu sucursal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">Ventas de QR</h3>
                <p className="text-sm text-purple-600">Registrar y gestionar ventas</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Mis Comisiones</h3>
                <p className="text-sm text-green-600">Ver comisiones generadas</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};