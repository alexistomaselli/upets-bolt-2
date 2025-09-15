/*
  # Verificar y recrear función get_user_roles

  1. Verificación
    - Comprobar si la función existe
    - Recrear si es necesario
  
  2. Función
    - Obtener roles de un usuario específico
    - Retornar nombre y nivel del rol
*/

-- Eliminar función si existe para recrearla
DROP FUNCTION IF EXISTS get_user_roles(uuid);

-- Crear función get_user_roles
CREATE OR REPLACE FUNCTION get_user_roles(user_uuid uuid)
RETURNS TABLE(role_name text, role_level integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.name::text as role_name,
    r.level::integer as role_level
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = user_uuid 
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > now());
END;
$$;

-- Verificar que la función funciona
DO $$
DECLARE
  test_user_id uuid;
  role_count integer;
BEGIN
  -- Buscar un usuario de prueba
  SELECT id INTO test_user_id 
  FROM auth.users 
  WHERE email = 'alexistomaselli@gmail.com'
  LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Contar roles del usuario
    SELECT COUNT(*) INTO role_count
    FROM get_user_roles(test_user_id);
    
    RAISE NOTICE 'Usuario encontrado: %', test_user_id;
    RAISE NOTICE 'Roles encontrados: %', role_count;
    
    -- Mostrar los roles
    FOR role_name, role_level IN 
      SELECT * FROM get_user_roles(test_user_id)
    LOOP
      RAISE NOTICE 'Rol: % (nivel %)', role_name, role_level;
    END LOOP;
  ELSE
    RAISE NOTICE 'Usuario alexistomaselli@gmail.com no encontrado';
  END IF;
END;
$$;