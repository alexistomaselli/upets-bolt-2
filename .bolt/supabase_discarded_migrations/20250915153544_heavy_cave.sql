/*
  # Asignar rol super admin a usuario existente

  1. Busca el usuario Juan Velasco por email
  2. Le asigna el rol de super_admin
  3. Actualiza su perfil con datos completos
  4. Crea el perfil si no existe

  ## Cambios
  - Asigna rol super_admin al usuario existente
  - Actualiza/crea perfil de usuario
  - Garantiza acceso al panel de administración
*/

-- Primero, asegurémonos de que el rol super_admin existe
INSERT INTO roles (name, description, level, is_system) 
VALUES ('super_admin', 'Super Administrador con acceso completo', 100, true)
ON CONFLICT (name) DO NOTHING;

-- Buscar el usuario por email y asignarle el rol de super admin
DO $$
DECLARE
    user_uuid uuid;
    role_uuid uuid;
    profile_exists boolean;
BEGIN
    -- Buscar el usuario por email en auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'juanvelasco9888@gmail.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Obtener el ID del rol super_admin
        SELECT id INTO role_uuid 
        FROM roles 
        WHERE name = 'super_admin';
        
        -- Asignar el rol al usuario (si no lo tiene ya)
        INSERT INTO user_roles (user_id, role_id, granted_by, is_active)
        VALUES (user_uuid, role_uuid, user_uuid, true)
        ON CONFLICT (user_id, role_id) DO UPDATE SET
            is_active = true,
            granted_at = now();
        
        -- Verificar si ya existe un perfil
        SELECT EXISTS(
            SELECT 1 FROM user_profiles WHERE user_id = user_uuid
        ) INTO profile_exists;
        
        IF profile_exists THEN
            -- Actualizar perfil existente
            UPDATE user_profiles SET
                first_name = 'Juan',
                last_name = 'Velasco',
                is_active = true,
                updated_at = now()
            WHERE user_id = user_uuid;
        ELSE
            -- Crear nuevo perfil
            INSERT INTO user_profiles (
                user_id, 
                first_name, 
                last_name, 
                is_active,
                country,
                subscription_status
            ) VALUES (
                user_uuid, 
                'Juan', 
                'Velasco', 
                true,
                'AR',
                'free'
            );
        END IF;
        
        RAISE NOTICE 'Usuario Juan Velasco configurado como Super Admin exitosamente';
    ELSE
        RAISE NOTICE 'Usuario con email juanvelasco9888@gmail.com no encontrado';
    END IF;
END $$;