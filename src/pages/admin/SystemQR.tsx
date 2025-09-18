import React, { useState } from 'react';
import { QRBatchManager } from '../../components/qr/QRBatchManager';
import { QRList } from '../../components/qr/QRList';
import { QrCode, Package, BarChart3 } from 'lucide-react';
import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui';

export const SystemQR: React.FC = () => {
  const [activeTab, setActiveTab] = useState('qr-codes');

  const stats = [
    { name: 'QRs Activos', value: '234', icon: QrCode, color: 'text-green-600' },
    { name: 'Lotes Generados', value: '18', icon: Package, color: 'text-purple-600' },
    { name: 'QRs Vendidos', value: '1,245', icon: BarChart3, color: 'text-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema QR</h1>
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
              Lotes QR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-codes" className="mt-6">
            <QRList 
              showActions={true}
              onCreateNew={() => setActiveTab('qr-batches')}
            />
          </TabsContent>

          <TabsContent value="qr-batches" className="mt-6">
            <QRBatchManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};