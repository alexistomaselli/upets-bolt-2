import React, { useState } from 'react';
import { Heart, QrCode, Plus, Settings, Bell, MapPin, Phone, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const CustomerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('pets');

  const tabs = [
    { id: 'pets', label: 'Mis Mascotas', icon: Heart },
    { id: 'qr', label: 'Mis QRs', icon: QrCode },
    { id: 'profile', label: 'Mi Perfil', icon: Settings },
    { id: 'notifications', label: 'Notificaciones', icon: Bell }
  ];

  // Datos mock para desarrollo
  const mockPets = [
    {
      id: 1,
      name: 'Luna',
      species: 'dog',
      breed: 'Golden Retriever',
      color: 'Dorado',
      age: '3 años',
      photo_url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300',
      qr_status: 'active',
      last_scan: '2024-01-15',
      medical_conditions: 'Ninguna conocida'
    },
    {
      id: 2,
      name: 'Max',
      species: 'dog',
      breed: 'Labrador',
      color: 'Negro',
      age: '5 años',
      photo_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300',
      qr_status: 'inactive',
      last_scan: null,
      medical_conditions: 'Alergia a ciertos alimentos'
    }
  ];

  const mockQRs = [
    { id: 1, code: 'QRA1B2C3', pet_name: 'Luna', status: 'active', scans: 12, last_scan: '2024-01-15' },
    { id: 2, code: 'QRD4E5F6', pet_name: 'Max', status: 'inactive', scans: 0, last_scan: null },
    { id: 3, code: 'QRG7H8I9', pet_name: null, status: 'available', scans: 0, last_scan: null }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {profile?.first_name || 'Usuario'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus mascotas y mantén sus QRs siempre actualizados
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mascotas</p>
                <p className="text-2xl font-bold text-gray-900">{mockPets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">QRs Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockQRs.filter(qr => qr.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Escaneos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockQRs.reduce((sum, qr) => sum + qr.scans, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

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
              {activeTab === 'pets' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mis Mascotas</h2>
                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Mascota
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {mockPets.map((pet) => (
                      <div key={pet.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <img
                            src={pet.photo_url}
                            alt={pet.name}
                            className="w-16 h-16 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
                            <p className="text-gray-600">{pet.breed} • {pet.color}</p>
                            <p className="text-sm text-gray-500">{pet.age}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Estado QR:</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              pet.qr_status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pet.qr_status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          {pet.last_scan && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Último escaneo:</span>
                              <span className="text-sm text-gray-900">{pet.last_scan}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Ver Detalles
                          </button>
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'qr' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mis Códigos QR</h2>
                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      <Plus className="h-4 w-4 mr-2" />
                      Comprar QR
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mockQRs.map((qr) => (
                      <div key={qr.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Código: {qr.code}</h3>
                            <p className="text-gray-600">
                              {qr.pet_name ? `Asignado a: ${qr.pet_name}` : 'Sin asignar'}
                            </p>
                            {qr.last_scan && (
                              <p className="text-sm text-gray-500">Último escaneo: {qr.last_scan}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                              qr.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : qr.status === 'inactive'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {qr.status === 'active' ? 'Activo' : qr.status === 'inactive' ? 'Inactivo' : 'Disponible'}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">{qr.scans} escaneos</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          {qr.status === 'available' && (
                            <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              Activar QR
                            </button>
                          )}
                          {qr.status === 'active' && (
                            <>
                              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Ver QR
                              </button>
                              <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                Editar Info
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                          type="text"
                          defaultValue={profile?.first_name || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                        <input
                          type="text"
                          defaultValue={profile?.last_name || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="inline h-4 w-4 mr-1" />
                          WhatsApp
                        </label>
                        <input
                          type="tel"
                          defaultValue={profile?.phone || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="+54 9 11 1234-5678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Buenos Aires"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Av. Corrientes 1234"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto de Emergencia</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="María Pérez"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                          <input
                            type="tel"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="+54 9 11 9876-5432"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Guardar Cambios
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h2>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">Escaneos de QR</h3>
                          <p className="text-sm text-gray-600">Recibir notificación cuando escaneen el QR de tu mascota</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded text-green-600" />
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">Recordatorios Veterinarios</h3>
                          <p className="text-sm text-gray-600">Recordatorios de vacunas y chequeos</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded text-green-600" />
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">Ofertas y Promociones</h3>
                          <p className="text-sm text-gray-600">Nuevos productos y descuentos especiales</p>
                        </div>
                        <input type="checkbox" className="rounded text-green-600" />
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