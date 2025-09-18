import React, { useState } from 'react';
import { QrCode, Plus, Download, Building } from 'lucide-react';
import { useCreateMultipleQRs } from '../../hooks/qr/useQRCodes';
import { useBranches } from '../../hooks/companies/useCompanies';
import { CreateMultipleQRsData, QRType } from '../../types/qr';
import { Button, Input, Card, Modal, EmptyState, LoadingSpinner } from '../ui';

interface QRMultipleCreatorProps {
  branchId?: string;
  onSuccess?: () => void;
}

export const QRMultipleCreator: React.FC<QRMultipleCreatorProps> = ({ branchId, onSuccess }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [qrData, setQRData] = useState<CreateMultipleQRsData>({
    quantity: 50,
    qr_type: 'basic',
    branch_id: branchId,
    notes: '',
  });

  const { data: branches } = useBranches();
  const createQRsMutation = useCreateMultipleQRs();

  const handleCreateQRs = async () => {
    try {
      await createQRsMutation.mutateAsync(qrData);
      setShowCreateModal(false);
      setQRData({
        quantity: 50,
        qr_type: 'basic',
        branch_id: branchId,
        notes: '',
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating QRs:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Códigos QR</h2>
          <p className="text-gray-600 mt-1">
            Crea múltiples códigos QR para identificación de mascotas
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Crear QRs
        </Button>
      </div>

      {/* Create QRs Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Múltiples Códigos QR"
        size="md"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cantidad"
              type="number"
              min="1"
              max="1000"
              value={qrData.quantity}
              onChange={(e) => setQRData((prev: CreateMultipleQRsData) => ({ 
                ...prev, 
                quantity: parseInt(e.target.value) || 0 
              }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de QR
              </label>
              <select
                value={qrData.qr_type}
                onChange={(e) => setQRData((prev: CreateMultipleQRsData) => ({ 
                  ...prev, 
                  qr_type: e.target.value as QRType 
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="basic">Básico</option>
                <option value="premium">Premium</option>
                <option value="institutional">Institucional</option>
              </select>
            </div>
          </div>



          {!branchId && branches && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sucursal (Opcional)
              </label>
              <select
                value={qrData.branch_id || ''}
                onChange={(e) => setQRData((prev: CreateMultipleQRsData) => ({ 
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
              value={qrData.notes}
              onChange={(e) => setQRData((prev: CreateMultipleQRsData) => ({ 
                ...prev, 
                notes: e.target.value 
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Notas adicionales sobre estos códigos QR..."
            />
          </div>



          <div className="flex items-center justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateQRs}
              loading={createQRsMutation.isPending}
            >
              Crear QRs
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};