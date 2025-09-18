import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { QRMultipleCreator } from '../../components/qr/QRMultipleCreator';
import { QRList } from '../../components/qr/QRList';
import { QrCode, Package, BarChart3, ArrowLeft } from 'lucide-react';
import { Card, Tabs, TabsContent, TabsList, TabsTrigger, Button } from '../../components/ui';
import { Link } from 'react-router-dom';

export const SystemQRPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('qr-codes');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Verificar la sesión al cargar el componente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.warn('No hay sesión activa en SystemQRPage');
          setHasError(true);
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const stats = [
    { name: 'QRs Activos', value: '234', icon: QrCode, color: 'text-green-600' },
    { name: 'QRs Creados', value: '1,245', icon: Package, color: 'text-purple-600' },
    { name: 'QRs Vendidos', value: '1,245', icon: BarChart3, color: 'text-blue-600' },
  ];

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Sistema QR...</p>
        </div>
      </div>
    );
  }

  // Renderizar estado de error
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error de conexión</h2>
          <p className="text-gray-600 mb-6">
            No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a internet y vuelve a intentarlo.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => window.location.reload()} variant="primary">
              Reintentar
            </Button>
            <Link to="/admin/dashboard">
              <Button variant="outline">
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar contenido principal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
                    Volver al Dashboard
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Sistema QR</h1>
              </div>
              <p className="text-gray-600 mt-1">
                Gestión integral de códigos QR para identificación de mascotas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="qr-codes" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white shadow-sm rounded-lg p-1">
            <TabsTrigger value="qr-codes" className="py-2 px-4">
              <QrCode className="h-4 w-4 mr-2" />
              Códigos QR
            </TabsTrigger>
            <TabsTrigger value="qr-batches" className="py-2 px-4">
              <Package className="h-4 w-4 mr-2" />
              Crear QRs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-codes" className="mt-6">
            <QRList 
              showActions={true}
              onCreateNew={() => setActiveTab('qr-batches')}
            />
          </TabsContent>

          <TabsContent value="qr-batches" className="mt-6">
            <QRMultipleCreator onSuccess={() => setActiveTab('qr-codes')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};