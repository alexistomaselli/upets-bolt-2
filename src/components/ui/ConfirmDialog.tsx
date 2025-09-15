import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
}) => {
  const variantConfig = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      confirmVariant: 'danger' as const,
      iconBg: 'bg-red-100'
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      confirmVariant: 'primary' as const,
      iconBg: 'bg-yellow-100'
    },
    info: {
      icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
      confirmVariant: 'primary' as const,
      iconBg: 'bg-blue-100'
    }
  };

  const config = variantConfig[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${config.iconBg} mb-4`}>
          {config.icon}
        </div>
        
        {title && (
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
        )}
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex space-x-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};