import React, { useState } from 'react';
import { Package, Plus, Download, Calendar, Building } from 'lucide-react';
import { useQRBatches, useCreateQRBatch } from '../../hooks/qr/useQRCodes';
import { useBranches } from '../../hooks/companies/useCompanies';
import { CreateQRBatchData, QRBatch } from '../../types/qr';
import { Button, Input, Card, Badge, Modal, EmptyState, LoadingSpinner } from '../ui';

interface QRBatchManagerProps {
  branchId?: string;
}

export const QRBatchManager: React.FC<QRBatchManagerProps> = ({ branchId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [batchData, setBatchData] = useState<CreateQRBatchData>({
    quantity: 50,
    qr_type: 'basic',
    price_per_unit: 2500,
    branch_id: branchId,
    notes: '',
  });

  const { data: batches, isLoading } = useQRBatches(branchId);
  const { data: branches } = useBranches();
  const createBatchMutation = useCreateQRBatch();

  const handleCreateBatch = async () => {
    try {
      await createBatchMutation.mutateAsync(batchData);
      setShowCreateModal(false);
      setBatchData({
        quantity: 50,
        qr_type: 'basic',
        price_per_unit: 2500,
        branch_id: branchId,
        notes: '',
      });
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'success';
      case 'pending': return 'warning';
      case 'delivered': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'generated': return 'Generado';
      case 'pending': return 'Pendiente';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lotes de QR</h2>
          <p className="text-gray-600 mt-1">
            Gestiona la generación y distribución de códigos QR en lotes
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Nuevo Lote
        </Button>
      </div>

      {/* Batches List */}
      {!batches || batches.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title="No hay lotes de QR"
          description="Comienza creando tu primer lote de códigos QR"
          action={
            <Button 
              onClick={() => setShowCreateModal(true)}
              icon={<Plus className="h-4 w-4" />}
            >
              Crear Primer Lote
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Card key={batch.id} hover>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{batch.batch_number}</h3>
                    <Badge variant={getStatusColor(batch.status)} size="sm">
                      {getStatusLabel(batch.status)}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
                  Descargar
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cantidad:</span>
                  <span className="font-medium">{batch.quantity} QRs</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium capitalize">{batch.qr_type}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Precio unitario:</span>
                  <span className="font-medium">${batch.price_per_unit}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-green-600">${batch.total_amount}</span>
                </div>

                {batch.branch && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{batch.branch.name}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Creado: {new Date(batch.created_at).toLocaleDateString()}</span>
                </div>

                {batch.generated_at && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Generado: {new Date(batch.generated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Lote de QR"
        size="md"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cantidad"
              type="number"
              min="1"
              max="1000"
              value={batchData.quantity}
              onChange={(e) => setBatchData(prev => ({ 
                ...prev, 
                quantity: parseInt(e.target.value) || 0 
              }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de QR
              </label>
              <select
                value={batchData.qr_type}
                onChange={(e) => setBatchData(prev => ({ 
                  ...prev, 
                  qr_type: e.target.value as any 
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="basic">Básico</option>
                <option value="premium">Premium</option>
                <option value="institutional">Institucional</option>
              </select>
            </div>
          </div>

          <Input
            label="Precio por Unidad"
            type="number"
            min="0"
            step="0.01"
            value={batchData.price_per_unit}
            onChange={(e) => setBatchData(prev => ({ 
              ...prev, 
              price_per_unit: parseFloat(e.target.value) || 0 
            }))}
          />

          {!branchId && branches && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sucursal (Opcional)
              </label>
              <select
                value={batchData.branch_id || ''}
                onChange={(e) => setBatchData(prev => ({ 
                  ...prev, 
                  branch_id: e.target.value || undefined 
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Sin asignar</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.company?.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              rows={3}
              value={batchData.notes}
              onChange={(e) => setBatchData(prev => ({ 
                ...prev, 
                notes: e.target.value 
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Notas adicionales sobre este lote..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total del Lote:</span>
              <span className="text-green-600">
                ${(batchData.quantity * batchData.price_per_unit).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateBatch}
              loading={createBatchMutation.isPending}
            >
              Crear Lote
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};