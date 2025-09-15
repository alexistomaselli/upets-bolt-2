/*
  # Crear sistema de comercios e instituciones

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (enum: 'commercial', 'institution')
      - `business_type` (text) - veterinaria, refugio, etc.
      - `tax_id` (text) - CUIT/CUIL
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `postal_code` (text)
      - `country` (text, default 'AR')
      - `website` (text)
      - `social_media` (jsonb)
      - `commission_rate` (decimal)
      - `special_terms` (text)
      - `status` (enum: 'active', 'inactive', 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `branches`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `name` (text)
      - `code` (text, unique) - código interno
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `postal_code` (text)
      - `coordinates` (point) - para geolocalización
      - `manager_name` (text)
      - `manager_phone` (text)
      - `operating_hours` (jsonb)
      - `services_offered` (text[])
      - `commission_rate` (decimal) - puede override la del comercio
      - `status` (enum: 'active', 'inactive')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `company_users`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `branch_id` (uuid, foreign key, nullable)
      - `user_id` (uuid, foreign key)
      - `role` (enum: 'company_admin', 'branch_admin', 'staff')
      - `permissions` (jsonb)
      - `assigned_by` (uuid, foreign key)
      - `assigned_at` (timestamp)
      - `is_active` (boolean, default true)

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Super admins can manage everything
    - Company admins can manage their company and branches
    - Branch admins can only manage their branch

  3. Indexes
    - Add indexes for common queries
    - Geospatial index for branch coordinates
    - Text search indexes for names
*/

-- Create custom types
CREATE TYPE company_type AS ENUM ('commercial', 'institution');
CREATE TYPE company_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE branch_status AS ENUM ('active', 'inactive', 'maintenance');
CREATE TYPE company_user_role AS ENUM ('company_admin', 'branch_admin', 'staff');

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type company_type NOT NULL DEFAULT 'commercial',
  business_type text, -- 'veterinaria', 'refugio', 'pet_shop', etc.
  tax_id text UNIQUE, -- CUIT/CUIL
  email text NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text DEFAULT 'AR',
  website text,
  social_media jsonb DEFAULT '{}',
  
  -- Commercial terms
  commission_rate decimal(5,2) DEFAULT 10.00, -- Porcentaje de comisión
  special_terms text, -- Términos especiales para instituciones
  payment_terms text, -- Términos de pago
  
  -- Status and metadata
  status company_status DEFAULT 'pending',
  notes text, -- Notas internas
  metadata jsonb DEFAULT '{}',
  
  -- Audit fields
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Basic info
  name text NOT NULL,
  code text UNIQUE NOT NULL, -- Código único para identificar sucursal
  email text,
  phone text,
  
  -- Location
  address text,
  city text,
  state text,
  postal_code text,
  coordinates point, -- Para geolocalización
  
  -- Management
  manager_name text,
  manager_phone text,
  manager_email text,
  
  -- Operations
  operating_hours jsonb DEFAULT '{}', -- Horarios de atención
  services_offered text[], -- Servicios que ofrece esta sucursal
  capacity_info jsonb DEFAULT '{}', -- Info de capacidad (para refugios)
  
  -- Commercial
  commission_rate decimal(5,2), -- Override de comisión específica
  
  -- Status
  status branch_status DEFAULT 'active',
  notes text,
  metadata jsonb DEFAULT '{}',
  
  -- Audit
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Company users (asignación de usuarios a comercios/sucursales)
CREATE TABLE IF NOT EXISTS company_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE, -- NULL = acceso a toda la empresa
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Role and permissions
  role company_user_role NOT NULL,
  permissions jsonb DEFAULT '{}', -- Permisos específicos
  
  -- Assignment info
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  
  -- Constraints
  UNIQUE(company_id, user_id, branch_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_type ON companies(type);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_business_type ON companies(business_type);
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);

CREATE INDEX IF NOT EXISTS idx_branches_company_id ON branches(company_id);
CREATE INDEX IF NOT EXISTS idx_branches_code ON branches(code);
CREATE INDEX IF NOT EXISTS idx_branches_status ON branches(status);
CREATE INDEX IF NOT EXISTS idx_branches_city ON branches(city);

-- Geospatial index for branch coordinates
CREATE INDEX IF NOT EXISTS idx_branches_coordinates ON branches USING GIST(coordinates);

-- Text search indexes
CREATE INDEX IF NOT EXISTS idx_companies_name_search ON companies USING GIN(to_tsvector('spanish', name));
CREATE INDEX IF NOT EXISTS idx_branches_name_search ON branches USING GIN(to_tsvector('spanish', name));

CREATE INDEX IF NOT EXISTS idx_company_users_company_id ON company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_user_id ON company_users(user_id);
CREATE INDEX IF NOT EXISTS idx_company_users_branch_id ON company_users(branch_id);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Super admins can manage all companies"
  ON companies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

CREATE POLICY "Company admins can view and update their company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users cu
      WHERE cu.company_id = companies.id 
      AND cu.user_id = auth.uid()
      AND cu.role = 'company_admin'
      AND cu.is_active = true
    )
  );

CREATE POLICY "Company admins can update their company"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users cu
      WHERE cu.company_id = companies.id 
      AND cu.user_id = auth.uid()
      AND cu.role = 'company_admin'
      AND cu.is_active = true
    )
  );

-- RLS Policies for branches
CREATE POLICY "Super admins can manage all branches"
  ON branches FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

CREATE POLICY "Company admins can manage their company branches"
  ON branches FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users cu
      WHERE cu.company_id = branches.company_id 
      AND cu.user_id = auth.uid()
      AND cu.role = 'company_admin'
      AND cu.is_active = true
    )
  );

CREATE POLICY "Branch admins can view and update their branch"
  ON branches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users cu
      WHERE cu.branch_id = branches.id 
      AND cu.user_id = auth.uid()
      AND cu.role IN ('company_admin', 'branch_admin')
      AND cu.is_active = true
    )
  );

CREATE POLICY "Branch admins can update their branch"
  ON branches FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users cu
      WHERE cu.branch_id = branches.id 
      AND cu.user_id = auth.uid()
      AND cu.role IN ('company_admin', 'branch_admin')
      AND cu.is_active = true
    )
  );

-- RLS Policies for company_users
CREATE POLICY "Super admins can manage all company users"
  ON company_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

CREATE POLICY "Company admins can manage users in their company"
  ON company_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users cu
      WHERE cu.company_id = company_users.company_id 
      AND cu.user_id = auth.uid()
      AND cu.role = 'company_admin'
      AND cu.is_active = true
    )
  );

CREATE POLICY "Users can view their own company assignments"
  ON company_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at
  BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some example data for development
INSERT INTO companies (name, type, business_type, email, phone, city, commission_rate, status, created_by) VALUES
('Veterinaria San Martín', 'commercial', 'veterinaria', 'info@vetsanmartin.com', '+54 11 4567-8901', 'Buenos Aires', 15.00, 'active', (SELECT id FROM auth.users LIMIT 1)),
('Refugio Esperanza', 'institution', 'refugio', 'contacto@refugioesperanza.org', '+54 11 4567-8902', 'La Plata', 5.00, 'active', (SELECT id FROM auth.users LIMIT 1)),
('Pet Shop Central', 'commercial', 'pet_shop', 'ventas@petshopcentral.com', '+54 11 4567-8903', 'Córdoba', 12.00, 'active', (SELECT id FROM auth.users LIMIT 1));

-- Insert branches for the companies
INSERT INTO branches (company_id, name, code, email, phone, address, city, manager_name, status, created_by) VALUES
((SELECT id FROM companies WHERE name = 'Veterinaria San Martín'), 'Sucursal Centro', 'VSM-CENTRO', 'centro@vetsanmartin.com', '+54 11 4567-8901', 'Av. San Martín 1234', 'Buenos Aires', 'Dr. Juan Pérez', 'active', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM companies WHERE name = 'Refugio Esperanza'), 'Sede Principal', 'RE-PRINCIPAL', 'contacto@refugioesperanza.org', '+54 11 4567-8902', 'Calle 50 y 120', 'La Plata', 'María González', 'active', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM companies WHERE name = 'Pet Shop Central'), 'Local Córdoba Centro', 'PSC-CBA-CENTRO', 'cordoba@petshopcentral.com', '+54 351 456-7890', 'Av. Colón 567', 'Córdoba', 'Carlos Rodríguez', 'active', (SELECT id FROM auth.users LIMIT 1));