import React, { useState } from 'react';
import { User, Package, Settings, Shield, MapPin } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('qr');

  const tabs = [
    { id: 'qr', label: 'Mis QR', icon: Shield },
    { id: 'orders', label: 'Pedidos', icon: Package },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const mockQRs = [
    { id: 1, pet_name: 'Luna', code: 'QR001', status: 'active', created: '2024-12-15' },
    { id: 2, pet_name: 'Max', code: 'QR002', status: 'active', created: '2024-11-20' }
  ];

  const mockOrders = [
    { id: 1001, date: '2024-12-15', status: 'completed', total: '2500', items: 'Colgante QR Básico' },
    { id: 1002, date: '2024-11-20', status: 'processing', total: '3500', items: 'Starter Kit' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Cuenta</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {activeTab === 'qr' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis QR Registrados</h2>
                  <div className="space-y-4">
                    {mockQRs.map((qr) => (
                      <div key={qr.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{qr.pet_name}</h3>
                            <p className="text-sm text-gray-600">Código: {qr.code}</p>
                            <p className="text-sm text-gray-600">Registrado: {qr.created}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              {qr.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                            <div className="mt-2 space-x-2">
                              <button className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                              <button className="text-sm text-green-600 hover:text-green-800">Ver QR</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Pedidos</h2>
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Pedido #{order.id}</h3>
                            <p className="text-sm text-gray-600">{order.items}</p>
                            <p className="text-sm text-gray-600">Fecha: {order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${order.total}</p>
                            <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status === 'completed' ? 'Completado' : 'Procesando'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                          type="text"
                          defaultValue="Juan"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                        <input
                          type="text"
                          defaultValue="Pérez"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="juan@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Guardar cambios
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h2>
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Notificaciones</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded text-green-600" />
                          <span className="ml-3 text-gray-700">Nuevos productos y ofertas</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded text-green-600" />
                          <span className="ml-3 text-gray-700">Actualizaciones del roadmap</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded text-green-600" />
                          <span className="ml-3 text-gray-700">Tips de cuidado por WhatsApp</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};