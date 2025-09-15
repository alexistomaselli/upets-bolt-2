import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Company, Branch, CompanyUser, CompanyType, CompanyStatus } from '../../types/company';

export const useCompanies = (filters?: {
  type?: CompanyType;
  status?: CompanyStatus;
  city?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['companies', filters],
    queryFn: async () => {
      let query = supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,business_type.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Company[];
    },
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Company;
    },
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyData: Partial<Company>) => {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Company> }) => {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', data.id] });
    },
  });
};

export const useBranches = (companyId?: string) => {
  return useQuery({
    queryKey: ['branches', companyId],
    queryFn: async () => {
      let query = supabase
        .from('branches')
        .select(`
          *,
          company:companies(*)
        `)
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Branch[];
    },
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (branchData: Partial<Branch>) => {
      const { data, error } = await supabase
        .from('branches')
        .insert([branchData])
        .select(`
          *,
          company:companies(*)
        `)
        .single();

      if (error) throw error;
      return data as Branch;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches', data.company_id] });
    },
  });
};

export const useCompanyUsers = (companyId?: string) => {
  return useQuery({
    queryKey: ['company-users', companyId],
    queryFn: async () => {
      let query = supabase
        .from('company_users')
        .select(`
          *,
          company:companies(*),
          branch:branches(*)
        `)
        .order('assigned_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CompanyUser[];
    },
  });
};

export const useAssignUserToCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: Partial<CompanyUser>) => {
      const { data, error } = await supabase
        .from('company_users')
        .insert([assignment])
        .select(`
          *,
          company:companies(*),
          branch:branches(*)
        `)
        .single();

      if (error) throw error;
      return data as CompanyUser;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['company-users'] });
      queryClient.invalidateQueries({ queryKey: ['company-users', data.company_id] });
    },
  });
};