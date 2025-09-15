import React, { useState } from 'react';
import { Plus, Filter, Download, QrCode } from 'lucide-react';
import { useQRCodes } from '../../hooks/qr/useQRCodes';
import { QRCode, QRFilters } from '../../types/qr';
import { QRCard } from './QRCard';
import { Button, Input, EmptyState, LoadingSpinner } from '../ui';

interface QRListProps {
  ownerId?: string;
  branchId?: string;
  onCreateNew?: () => void;
  onView?: (qrCode: QRCode) => void;
  onEdit?: (qrCode: QRCode) => void;
  onDelete?: (qrCode: QRCode) => void;
  showActions?: boolean;
}

export const QRList: React.FC<QRListProps> = ({
  ownerId,
  branchId,
  onCreateNew,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const [filters, setFilters] = useState<QRFilters>({
    owner_id: ownerId,
    branch_id: branchId,
  });

  const { data: qrCodes, isLoading } = useQRCodes(filters);

  const handleFilterChange = (key: keyof QRFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
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
          <h2 className="text-2xl font-bold text-gray-900">Códigos QR</h2>
          <p className="text-gray-600 mt-1">
            Gestiona los códigos QR para identificación de mascotas
          </p>
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew} icon={<Plus className="h-4 w-4" />}>
            Nuevo Lote QR
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar por código..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            leftIcon={<Filter className="h-4 w-4" />}
          />

          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos los estados</option>
            <option value="inactive">Inactivos</option>
            <option value="active">Activos</option>
            <option value="lost">Perdidos</option>
            <option value="found">Encontrados</option>
            <option value="expired">Expirados</option>
          </select>

          <select
            value={filters.qr_type || ''}
            onChange={(e) => handleFilterChange('qr_type', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos los tipos</option>
            <option value="basic">Básico</option>
            <option value="premium">Premium</option>
            <option value="institutional">Institucional</option>
          </select>

          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            Exportar
          </Button>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-600">
          <Filter className="h-4 w-4 mr-2" />
          {qrCodes?.length || 0} códigos QR encontrados
        </div>
      </div>

      {/* QR Codes Grid */}
      {!qrCodes || qrCodes.length === 0 ? (
        <EmptyState
          icon={<QrCode className="h-12 w-12" />}
          title="No hay códigos QR"
          description="Comienza creando tu primer lote de códigos QR para identificación de mascotas"
          action={
            onCreateNew && (
              <Button onClick={onCreateNew} icon={<Plus className="h-4 w-4" />}>
                Crear Primer Lote
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <QRCard
              key={qrCode.id}
              qrCode={qrCode}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  );
};