/*
  # Crear usuario super admin Alexis

  1. Nuevo usuario super admin
    - Email: alexistomaselli@gmail.com
    - Nombre: Alexis
    - Rol: super_admin
  
  2. Configuración
    - Perfil completo con datos
    - Rol asignado automáticamente
    - Usuario activo desde el inicio
*/

-- Insertar usuario en auth.users (simulando registro)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'alexistomaselli@gmail.com',
  crypt('AFPets2025!', gen_salt('bf')), -- Contraseña: AFPets2025!
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Alexis", "last_name": "Tomaselli"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Obtener el ID del usuario recién creado
DO $$
DECLARE
  user_uuid uuid;
  admin_role_id uuid;
BEGIN
  -- Obtener el ID del usuario
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'alexistomaselli@gmail.com';
  
  -- Obtener el ID del rol super_admin
  SELECT id INTO admin_role_id FROM roles WHERE name = 'super_admin';
  
  -- Crear perfil del usuario
  INSERT INTO user_profiles (
    user_id,
    first_name,
    last_name,
    phone,
    address,
    city,
    country,
    is_active,
    metadata
  ) VALUES (
    user_uuid,
    'Alexis',
    'Tomaselli',
    '+54 9 11 1234-5678',
    'Buenos Aires',
    'CABA',
    'AR',
    true,
    '{"role": "super_admin", "created_by": "system"}'
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = now();
  
  -- Asignar rol de super_admin
  INSERT INTO user_roles (
    user_id,
    role_id,
    granted_by,
    granted_at,
    is_active
  ) VALUES (
    user_uuid,
    admin_role_id,
    user_uuid, -- Se asigna a sí mismo
    now(),
    true
  ) ON CONFLICT (user_id, role_id) DO UPDATE SET
    is_active = true,
    granted_at = now();
    
END $$;