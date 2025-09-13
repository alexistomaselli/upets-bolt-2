/*
  # Sistema de Autenticación, Roles y Permisos

  1. Nuevas Tablas
    - `roles` - Definición de roles del sistema
    - `permissions` - Permisos granulares disponibles
    - `role_permissions` - Relación muchos a muchos entre roles y permisos
    - `user_profiles` - Perfiles extendidos de usuarios
    - `user_roles` - Asignación de roles a usuarios
    - `audit_logs` - Registro de actividades para auditoría

  2. Seguridad
    - Enable RLS en todas las tablas
    - Políticas restrictivas por defecto
    - Solo super admins pueden gestionar roles y permisos
    - Usuarios solo pueden ver sus propios datos

  3. Roles Iniciales
    - Super Admin: Control total del sistema
    - Company Admin: Gestión de comercio y sucursales
    - Branch Admin: Gestión de sucursal específica
    - Customer: Cliente final con mascota
*/

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  level integer NOT NULL DEFAULT 0, -- Para jerarquía: 0=customer, 10=branch, 20=company, 100=super
  is_system boolean DEFAULT false, -- Roles del sistema no se pueden eliminar
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de permisos
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource text NOT NULL, -- 'users', 'qrs', 'companies', 'reports', etc.
  action text NOT NULL, -- 'create', 'read', 'update', 'delete', 'manage'
  description text,
  created_at timestamptz DEFAULT now()
);

-- Relación muchos a muchos: roles y permisos
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Perfiles extendidos de usuarios
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  company_id uuid, -- Se definirá cuando creemos companies
  branch_id uuid, -- Se definirá cuando creemos branches
  metadata jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Asignación de roles a usuarios
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz, -- Para roles temporales
  is_active boolean DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- Logs de auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  
  -- Asignar rol de customer por defecto
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT new.id, id FROM public.roles WHERE name = 'customer';
  
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para obtener roles de un usuario
CREATE OR REPLACE FUNCTION get_user_roles(user_uuid uuid)
RETURNS TABLE(role_name text, role_level integer) AS $$
BEGIN
  RETURN QUERY
  SELECT r.name, r.level
  FROM roles r
  JOIN user_roles ur ON r.id = ur.role_id
  WHERE ur.user_id = user_uuid 
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > now());
END;
$$ language plpgsql security definer;

-- Función para verificar permisos
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid uuid, resource_name text, action_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = user_uuid
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
      AND p.resource = resource_name
      AND p.action = action_name
  );
END;
$$ language plpgsql security definer;

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURIDAD

-- Roles: Solo super admins pueden gestionar
CREATE POLICY "Super admins can manage roles" ON roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- Permisos: Solo super admins pueden gestionar
CREATE POLICY "Super admins can manage permissions" ON permissions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- Role permissions: Solo super admins pueden gestionar
CREATE POLICY "Super admins can manage role permissions" ON role_permissions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- User profiles: Los usuarios pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Super admins pueden ver todos los perfiles
CREATE POLICY "Super admins can view all profiles" ON user_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- User roles: Solo super admins pueden asignar roles
CREATE POLICY "Super admins can manage user roles" ON user_roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- Los usuarios pueden ver sus propios roles
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Audit logs: Solo super admins pueden ver logs
CREATE POLICY "Super admins can view audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- Los usuarios pueden ver sus propios logs
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- INSERTAR DATOS INICIALES

-- Roles del sistema
INSERT INTO roles (name, description, level, is_system) VALUES
  ('super_admin', 'Administrador del sistema con acceso completo', 100, true),
  ('company_admin', 'Administrador de comercio con acceso a todas sus sucursales', 20, true),
  ('branch_admin', 'Administrador de sucursal específica', 10, true),
  ('customer', 'Cliente final con mascota registrada', 0, true);

-- Permisos del sistema
INSERT INTO permissions (resource, action, description) VALUES
  -- Gestión de usuarios
  ('users', 'create', 'Crear nuevos usuarios'),
  ('users', 'read', 'Ver información de usuarios'),
  ('users', 'update', 'Actualizar información de usuarios'),
  ('users', 'delete', 'Eliminar usuarios'),
  ('users', 'manage', 'Gestión completa de usuarios'),
  
  -- Gestión de roles
  ('roles', 'create', 'Crear nuevos roles'),
  ('roles', 'read', 'Ver roles del sistema'),
  ('roles', 'update', 'Actualizar roles'),
  ('roles', 'delete', 'Eliminar roles'),
  ('roles', 'assign', 'Asignar roles a usuarios'),
  
  -- Gestión de comercios
  ('companies', 'create', 'Crear nuevos comercios'),
  ('companies', 'read', 'Ver información de comercios'),
  ('companies', 'update', 'Actualizar comercios'),
  ('companies', 'delete', 'Eliminar comercios'),
  ('companies', 'manage', 'Gestión completa de comercios'),
  
  -- Gestión de sucursales
  ('branches', 'create', 'Crear nuevas sucursales'),
  ('branches', 'read', 'Ver información de sucursales'),
  ('branches', 'update', 'Actualizar sucursales'),
  ('branches', 'delete', 'Eliminar sucursales'),
  ('branches', 'manage', 'Gestión completa de sucursales'),
  
  -- Gestión de QRs
  ('qrs', 'create', 'Crear lotes de QRs'),
  ('qrs', 'read', 'Ver información de QRs'),
  ('qrs', 'update', 'Actualizar estado de QRs'),
  ('qrs', 'activate', 'Activar QRs para clientes'),
  ('qrs', 'sell', 'Vender QRs a clientes'),
  
  -- Reportes y comisiones
  ('reports', 'read', 'Ver reportes del sistema'),
  ('reports', 'export', 'Exportar reportes'),
  ('commissions', 'read', 'Ver comisiones'),
  ('commissions', 'manage', 'Gestionar pagos de comisiones'),
  
  -- Mascotas
  ('pets', 'create', 'Registrar nuevas mascotas'),
  ('pets', 'read', 'Ver información de mascotas'),
  ('pets', 'update', 'Actualizar información de mascotas'),
  ('pets', 'delete', 'Eliminar mascotas');

-- Asignar permisos a roles

-- Super Admin: Todos los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'super_admin';

-- Company Admin: Gestión de su comercio y sucursales
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'company_admin'
  AND p.resource IN ('companies', 'branches', 'users', 'qrs', 'reports', 'commissions')
  AND p.action IN ('read', 'update', 'manage');

-- Branch Admin: Gestión de su sucursal
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'branch_admin'
  AND (
    (p.resource = 'branches' AND p.action IN ('read', 'update')) OR
    (p.resource = 'users' AND p.action IN ('read', 'update')) OR
    (p.resource = 'qrs' AND p.action IN ('read', 'sell', 'activate')) OR
    (p.resource = 'reports' AND p.action = 'read') OR
    (p.resource = 'commissions' AND p.action = 'read')
  );

-- Customer: Solo gestión de sus mascotas
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'customer'
  AND p.resource = 'pets'
  AND p.action IN ('create', 'read', 'update', 'delete');