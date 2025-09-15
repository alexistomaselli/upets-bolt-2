/*
  # Asignar rol super admin a Alexis

  1. Busca el usuario con email alexistomaselli@gmail.com
  2. Le asigna el rol de super_admin
  3. Actualiza su perfil si es necesario
  4. Verifica que todo esté correcto

  ## Cambios
  - Buscar usuario por email
  - Asignar rol super_admin con nivel 100
  - Crear/actualizar perfil de usuario
  - Activar usuario para acceso completo
*/

-- Primero, verificar si el usuario existe
DO $$
DECLARE
    user_uuid uuid;
    profile_exists boolean;
    role_id uuid;
BEGIN
    -- Buscar el usuario por email
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'alexistomaselli@gmail.com';
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'Usuario con email alexistomaselli@gmail.com no encontrado';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Usuario encontrado: %', user_uuid;
    
    -- Verificar si ya tiene perfil
    SELECT EXISTS(
        SELECT 1 FROM user_profiles 
        WHERE user_id = user_uuid
    ) INTO profile_exists;
    
    -- Crear o actualizar perfil
    IF profile_exists THEN
        UPDATE user_profiles 
        SET 
            first_name = 'Alexis',
            last_name = 'Tomaselli',
            is_active = true,
            updated_at = now()
        WHERE user_id = user_uuid;
        RAISE NOTICE 'Perfil actualizado para usuario %', user_uuid;
    ELSE
        INSERT INTO user_profiles (
            user_id,
            first_name,
            last_name,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            user_uuid,
            'Alexis',
            'Tomaselli',
            true,
            now(),
            now()
        );
        RAISE NOTICE 'Perfil creado para usuario %', user_uuid;
    END IF;
    
    -- Buscar el rol super_admin
    SELECT id INTO role_id 
    FROM roles 
    WHERE name = 'super_admin';
    
    IF role_id IS NULL THEN
        RAISE NOTICE 'Rol super_admin no encontrado, creándolo...';
        INSERT INTO roles (name, description, level, is_system)
        VALUES ('super_admin', 'Super Administrador del Sistema', 100, true)
        RETURNING id INTO role_id;
    END IF;
    
    -- Verificar si ya tiene el rol asignado
    IF EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = user_uuid AND role_id = role_id AND is_active = true
    ) THEN
        RAISE NOTICE 'Usuario ya tiene el rol super_admin asignado';
    ELSE
        -- Desactivar otros roles si existen
        UPDATE user_roles 
        SET is_active = false 
        WHERE user_id = user_uuid;
        
        -- Asignar el rol super_admin
        INSERT INTO user_roles (
            user_id,
            role_id,
            granted_by,
            granted_at,
            is_active
        ) VALUES (
            user_uuid,
            role_id,
            user_uuid, -- Se asigna a sí mismo
            now(),
            true
        );
        
        RAISE NOTICE 'Rol super_admin asignado exitosamente a usuario %', user_uuid;
    END IF;
    
    -- Verificación final
    RAISE NOTICE 'Verificación final:';
    RAISE NOTICE 'Usuario: % (%)', user_uuid, 'alexistomaselli@gmail.com';
    RAISE NOTICE 'Perfil creado: %', profile_exists;
    RAISE NOTICE 'Rol asignado: super_admin (nivel 100)';
    
END $$;