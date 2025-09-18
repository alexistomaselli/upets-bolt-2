import React from 'react';
import { QrCode, Eye, Edit, Trash2, MapPin, Calendar, User } from 'lucide-react';
import { QRCode, QRStatus, QRType } from '../../types/qr';
import { Badge, Card } from '../ui';

interface QRCardProps {
  qrCode: QRCode;
  onView?: (qrCode: QRCode) => void;
  onEdit?: (qrCode: QRCode) => void;
  onDelete?: (qrCode: QRCode) => void;
  showActions?: boolean;
}

export const QRCard: React.FC<QRCardProps> = ({
  qrCode,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const getStatusColor = (status: QRStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'lost': return 'danger';
      case 'found': return 'success';
      case 'expired': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: QRStatus) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'lost': return 'Perdido';
      case 'found': return 'Encontrado';
      case 'expired': return 'Expirado';
      default: return status;
    }
  };

  const getTypeLabel = (type: QRType) => {
    switch (type) {
      case 'basic': return 'Básico';
      case 'premium': return 'Premium';
      case 'institutional': return 'Institucional';
      default: return type;
    }
  };

  const getTypeColor = (type: QRType) => {
    switch (type) {
      case 'basic': return 'default';
      case 'premium': return 'info';
      case 'institutional': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card hover className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <QrCode className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{qrCode.code}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={getStatusColor(qrCode.status)} size="sm">
                {getStatusLabel(qrCode.status)}
              </Badge>
              <Badge variant={getTypeColor(qrCode.qr_type)} size="sm">
                {getTypeLabel(qrCode.qr_type)}
              </Badge>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center space-x-1">
            {onView && (
              <button
                onClick={() => onView(qrCode)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver detalles"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(qrCode)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(qrCode)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {qrCode.pet && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Mascota: <strong>{qrCode.pet.name}</strong></span>
          </div>
        )}

        {qrCode.owner && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Dueño: <strong>{qrCode.owner.first_name} {qrCode.owner.last_name}</strong></span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Creado: {new Date(qrCode.created_at).toLocaleDateString()}</span>
        </div>

        {qrCode.activation_date && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Activado: {new Date(qrCode.activation_date).toLocaleDateString()}</span>
          </div>
        )}

        {qrCode.last_scan_date && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Último escaneo: {new Date(qrCode.last_scan_date).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {qrCode.scan_count} escaneos
          </span>
        </div>
      </div>
    </Card>
  );
};