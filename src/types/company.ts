export interface Company {
  id: string;
  name: string;
  type: 'commercial' | 'institution';
  business_type: string | null;
  tax_id: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  website: string | null;
  social_media: Record<string, string>;
  commission_rate: number;
  special_terms: string | null;
  payment_terms: string | null;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  notes: string | null;
  metadata: Record<string, any>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  coordinates: [number, number] | null;
  manager_name: string | null;
  manager_phone: string | null;
  manager_email: string | null;
  operating_hours: Record<string, any>;
  services_offered: string[] | null;
  capacity_info: Record<string, any>;
  commission_rate: number | null;
  status: 'active' | 'inactive' | 'maintenance';
  notes: string | null;
  metadata: Record<string, any>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface CompanyUser {
  id: string;
  company_id: string;
  branch_id: string | null;
  user_id: string;
  role: 'company_admin' | 'branch_admin' | 'staff';
  permissions: Record<string, any>;
  assigned_by: string | null;
  assigned_at: string;
  is_active: boolean;
  company?: Company;
  branch?: Branch;
}

export type CompanyType = 'commercial' | 'institution';
export type CompanyStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type BranchStatus = 'active' | 'inactive' | 'maintenance';
export type CompanyUserRole = 'company_admin' | 'branch_admin' | 'staff';