import React, { useState } from 'react';
import { Building, Heart, MapPin, Phone, Mail, Edit, Trash2, Plus } from 'lucide-react';
import { useCompanies } from '../../hooks/companies/useCompanies';
import { Company, CompanyType, CompanyStatus } from '../../types/company';
import { CompanyCard } from './CompanyCard';
import { CompanyFilters } from './CompanyFilters';

interface CompanyListProps {
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
  onCreateNew?: () => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const [filters, setFilters] = useState({
    type: '' as CompanyType | '',
    status: '' as CompanyStatus | '',
    search: '',
  });

  const { data: companies, isLoading } = useCompanies({
    type: filters.type || undefined,
    status: filters.status || undefined,
    search: filters.search || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comercios e Instituciones</h2>
          <p className="text-gray-600 mt-1">
            Gestiona la red de comercios e instituciones que venden productos AFPets
          </p>
        </div>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Comercio
          </button>
        )}
      </div>

      {/* Filters */}
      <CompanyFilters
        filters={filters}
        onFiltersChange={setFilters}
        resultCount={companies?.length || 0}
      />

      {/* Companies List */}
      <div className="space-y-4">
        {companies?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay comercios</h3>
            <p className="text-gray-600 mb-4">Comienza agregando tu primer comercio o institución</p>
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Comercio
              </button>
            )}
          </div>
        ) : (
          companies?.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};