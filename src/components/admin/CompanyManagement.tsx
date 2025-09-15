import React, { useState } from 'react';
import { Plus, Search, Filter, Building, Heart, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { useCompanies, useCreateCompany, useUpdateCompany } from '../../hooks/useCompanies';
import { Company, CompanyType, CompanyStatus } from '../../types/company';
import { CompanyForm } from './CompanyForm';

export const CompanyManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
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

  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();

  const handleCreateCompany = async (companyData: Partial<Company>) => {
    try {
      await createCompanyMutation.mutateAsync(companyData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleUpdateCompany = async (companyData: Partial<Company>) => {
    if (!editingCompany) return;
    
    try {
      await updateCompanyMutation.mutateAsync({
        id: editingCompany.id,
        updates: companyData,
      });
      setEditingCompany(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

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

  if (showForm) {
    return (
      <CompanyForm
        company={editingCompany}
        onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
        onCancel={() => {
          setShowForm(false);
          setEditingCompany(null);
        }}
        isLoading={createCompanyMutation.isPending || updateCompanyMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Comercios e Instituciones</h2>
          <p className="text-gray-600 mt-1">
            Administra la red de comercios e instituciones que venden productos AFPets
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Comercio
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar comercios..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as CompanyType | '' }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos los tipos</option>
            <option value="commercial">Comercios</option>
            <option value="institution">Instituciones</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as CompanyStatus | '' }))}
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
            {companies?.length || 0} resultados
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando comercios...</p>
          </div>
        ) : companies?.length === 0 ? (
          <div className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay comercios</h3>
            <p className="text-gray-600 mb-4">Comienza agregando tu primer comercio o institución</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Comercio
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {companies?.map((company) => {
              const TypeIcon = getTypeIcon(company.type);
              return (
                <div key={company.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                      <button
                        onClick={() => {
                          setEditingCompany(company);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};