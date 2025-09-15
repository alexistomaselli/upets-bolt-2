import React from 'react';
import { Search, Filter } from 'lucide-react';
import { CompanyType, CompanyStatus } from '../../types/company';

interface CompanyFiltersProps {
  filters: {
    type: CompanyType | '';
    status: CompanyStatus | '';
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  resultCount: number;
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  filters,
  onFiltersChange,
  resultCount,
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar comercios..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Todos los tipos</option>
          <option value="commercial">Comercios</option>
          <option value="institution">Instituciones</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="pending">Pendientes</option>
          <option value="inactive">Inactivos</option>
          <option value="suspended">Suspendidos</option>
        </select>

        <div className="flex items-center text-sm text-gray-600">
          <Filter className="h-4 w-4 mr-2" />
          {resultCount} resultados
        </div>
      </div>
    </div>
  );
};