import React from 'react';
import { Building, Heart, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { Company, CompanyType, CompanyStatus } from '../../types/company';

interface CompanyCardProps {
  company: Company;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onEdit,
  onDelete,
}) => {
  const getTypeIcon = (type: CompanyType) => {
    return type === 'commercial' ? Building : Heart;
  };

  const getTypeLabel = (type: CompanyType) => {
    return type === 'commercial' ? 'Comercio' : 'Institución';
  };

  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: CompanyStatus) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      case 'suspended': return 'Suspendido';
      default: return status;
    }
  };

  const TypeIcon = getTypeIcon(company.type);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${
            company.type === 'commercial' ? 'bg-blue-100' : 'bg-pink-100'
          }`}>
            <TypeIcon className={`h-6 w-6 ${
              company.type === 'commercial' ? 'text-blue-600' : 'text-pink-600'
            }`} />
          </div>
          
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}>
                {getStatusLabel(company.status)}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {getTypeLabel(company.type)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              {company.business_type && (
                <span>{company.business_type}</span>
              )}
              {company.city && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {company.city}
                </div>
              )}
              {company.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {company.email}
                </div>
              )}
              {company.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {company.phone}
                </div>
              )}
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              Comisión: {company.commission_rate}% • 
              Creado: {new Date(company.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(company)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(company)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};