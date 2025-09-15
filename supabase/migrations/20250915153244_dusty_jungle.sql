/*
  # Asignar rol super admin a usuario existente

  1. Busca el usuario con email alexistomaselli@gmail.com
  2. Le asigna el rol de super_admin
  3. Actualiza su perfil si es necesario

  IMPORTANTE: Ejecutar esta migración después de que el usuario se haya registrado
*/

-- Primero, asegurémonos de que el rol super_admin existe
INSERT INTO roles (name, description, level, is_system) 
VALUES ('super_admin', 'Super Administrador con acceso completo', 100, true)
ON CONFLICT (name) DO NOTHING;

-- Asignar rol super_admin al usuario con email alexistomaselli@gmail.com
INSERT INTO user_roles (user_id, role_id, granted_by, is_active)
SELECT 
  auth.users.id,
  roles.id,
  auth.users.id, -- Se auto-asigna
  true
FROM auth.users
CROSS JOIN roles
WHERE auth.users.email = 'alexistomaselli@gmail.com'
  AND roles.name = 'super_admin'
ON CONFLICT (user_id, role_id) DO UPDATE SET
  is_active = true,
  granted_at = now();

-- Actualizar el perfil para asegurar que tenga nombre
UPDATE user_profiles 
SET 
  first_name = COALESCE(first_name, 'Alexis'),
  last_name = COALESCE(last_name, 'Tomaselli'),
  updated_at = now()
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'alexistomaselli@gmail.com'
);

-- Si no existe el perfil, crearlo
INSERT INTO user_profiles (user_id, first_name, last_name, is_active)
SELECT 
  auth.users.id,
  'Alexis',
  'Tomaselli',
  true
FROM auth.users
WHERE auth.users.email = 'alexistomaselli@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.users.id
  );