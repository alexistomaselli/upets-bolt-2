import React, { useState } from 'react';
import { Company } from '../../types/company';
import { useCreateCompany, useUpdateCompany } from '../../hooks/companies/useCompanies';
import { CompanyList } from './CompanyList';
import { CompanyForm } from './CompanyForm';

export const CompanyManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

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

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDelete = (company: Company) => {
    // TODO: Implement delete functionality
    console.log('Delete company:', company.id);
  };

  const handleCreateNew = () => {
    setEditingCompany(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  if (showForm) {
    return (
      <CompanyForm
        company={editingCompany}
        onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
        onCancel={handleCancel}
        isLoading={createCompanyMutation.isPending || updateCompanyMutation.isPending}
      />
    );
  }

  return (
    <CompanyList
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreateNew={handleCreateNew}
    />
  );
};