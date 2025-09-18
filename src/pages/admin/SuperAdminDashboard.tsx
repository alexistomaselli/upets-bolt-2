import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Building2, 
  QrCode, 
  Settings, 
  Database,
  Activity,
  AlertTriangle,
  LogOut,
  Eye,
  UserCheck
} from 'lucide-react';
import SupabaseEnvironmentSwitch from '../../components/admin/SupabaseEnvironmentSwitch';

export const SuperAdminDashboard: React.FC = () => {
  const { user, signOut, roles } = useAuthContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  const stats = [
    {
      title: 'Usuarios Totales',
      value: '1,234',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Empresas Activas',
      value: '89',
      icon: Building2,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'QRs Generados',
      value: '5,678',
      icon: QrCode,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Alertas Sistema',
      value: '3',
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-2'
    }
  ];

  const menuItems = [
    { id: 'overview', label: 'Resumen General', icon: Activity },
    { id: 'users', label: 'Gestión de Usuarios', icon: Users },
    { id: 'companies', label: 'Gestión de Empresas', icon: Building2 },
    { id: 'qr-system', label: 'Sistema QR', icon: QrCode },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'system', label: 'Configuración Sistema', icon: Settings },
  ];

  const handleSectionChange = (sectionId: string) => {
    if (sectionId === 'qr-system') {
      navigate('/admin/sistema-qr');
    } else {
      setActiveSection(sectionId);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${
                          stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change} vs mes anterior
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Nueva empresa registrada: PetShop Central</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">100 nuevos QRs generados</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Actualización de sistema completada</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base de Datos</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operativo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Supabase</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operativo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Servidor Web</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operativo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Usuarios</h3>
            <p className="text-gray-600">Funcionalidad de gestión de usuarios en desarrollo...</p>
          </div>
        );
      
      case 'companies':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Empresas</h3>
            <p className="text-gray-600">Funcionalidad de gestión de empresas en desarrollo...</p>
          </div>
        );
      
      case 'qr-system':
        // Esta sección ahora se maneja a través de la navegación a /admin/sistema-qr
        return null;

      
      case 'database':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Administración de Base de Datos</h3>
            <p className="text-gray-600">Herramientas de administración de BD en desarrollo...</p>
          </div>
        );
      
      case 'system':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Supabase</h3>
              <SupabaseEnvironmentSwitch />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Sistema</h3>
              <p className="text-gray-600">Panel de configuración del sistema en desarrollo...</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Super Admin Panel</h1>
                <p className="text-sm text-gray-300">AFPets - Control Total del Sistema</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.email}</p>
                <div className="flex items-center space-x-1">
                  <UserCheck className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">Super Admin</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};