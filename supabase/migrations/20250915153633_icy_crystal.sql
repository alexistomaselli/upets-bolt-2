/*
  # Función para crear super admin

  1. Función para asignar rol super admin a cualquier usuario
  2. Se ejecuta después de que el usuario se registre manualmente
*/

-- Función para convertir un usuario en super admin
CREATE OR REPLACE FUNCTION make_user_superadmin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
  superadmin_role_id UUID;
  result_message TEXT;
BEGIN
  -- Buscar el usuario por email en auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'ERROR: Usuario con email ' || user_email || ' no encontrado';
  END IF;
  
  -- Buscar el rol super_admin
  SELECT id INTO superadmin_role_id
  FROM roles
  WHERE name = 'super_admin';
  
  IF superadmin_role_id IS NULL THEN
    RETURN 'ERROR: Rol super_admin no encontrado';
  END IF;
  
  -- Crear o actualizar el perfil del usuario
  INSERT INTO user_profiles (
    user_id,
    first_name,
    last_name,
    is_active
  ) VALUES (
    target_user_id,
    'Alexis',
    'Tomaselli',
    true
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    first_name = 'Alexis',
    last_name = 'Tomaselli',
    is_active = true,
    updated_at = now();
  
  -- Asignar el rol super_admin
  INSERT INTO user_roles (
    user_id,
    role_id,
    granted_by,
    is_active
  ) VALUES (
    target_user_id,
    superadmin_role_id,
    target_user_id, -- Se asigna a sí mismo
    true
  )
  ON CONFLICT (user_id, role_id)
  DO UPDATE SET
    is_active = true,
    granted_at = now();
  
  result_message := 'SUCCESS: Usuario ' || user_email || ' convertido en super admin';
  RETURN result_message;
END;
$$;

-- Ejemplo de uso (comentado):
-- SELECT make_user_superadmin('alexistomaselli@gmail.com');