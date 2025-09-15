/*
  # Verificar roles de Alexis

  Esta migración verifica que el usuario alexistomaselli@gmail.com tenga el rol super_admin correctamente asignado.
*/

DO $$
DECLARE
    user_uuid uuid;
    role_uuid uuid;
    user_role_exists boolean;
    role_data record;
BEGIN
    -- Buscar el usuario
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'alexistomaselli@gmail.com';
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE '❌ Usuario alexistomaselli@gmail.com no encontrado en auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Usuario encontrado: %', user_uuid;
    
    -- Buscar el rol super_admin
    SELECT id INTO role_uuid 
    FROM roles 
    WHERE name = 'super_admin';
    
    IF role_uuid IS NULL THEN
        RAISE NOTICE '❌ Rol super_admin no encontrado';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Rol super_admin encontrado: %', role_uuid;
    
    -- Verificar si el usuario tiene el rol asignado
    SELECT EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = user_uuid 
        AND role_id = role_uuid 
        AND is_active = true
    ) INTO user_role_exists;
    
    IF user_role_exists THEN
        RAISE NOTICE '✅ Usuario ya tiene el rol super_admin asignado';
    ELSE
        RAISE NOTICE '❌ Usuario NO tiene el rol super_admin asignado';
        
        -- Asignar el rol
        INSERT INTO user_roles (user_id, role_id, granted_at, is_active)
        VALUES (user_uuid, role_uuid, now(), true)
        ON CONFLICT (user_id, role_id) DO UPDATE SET
            is_active = true,
            granted_at = now();
            
        RAISE NOTICE '✅ Rol super_admin asignado correctamente';
    END IF;
    
    -- Verificar usando la función RPC
    RAISE NOTICE '🔍 Probando función get_user_roles...';
    
    FOR role_data IN 
        SELECT * FROM get_user_roles(user_uuid)
    LOOP
        RAISE NOTICE '🎭 Rol encontrado: % (nivel %)', role_data.role_name, role_data.role_level;
    END LOOP;
    
    -- Verificar perfil del usuario
    IF EXISTS(SELECT 1 FROM user_profiles WHERE user_id = user_uuid) THEN
        RAISE NOTICE '✅ Perfil de usuario existe';
    ELSE
        RAISE NOTICE '❌ Perfil de usuario NO existe, creando...';
        
        INSERT INTO user_profiles (user_id, first_name, last_name, is_active)
        VALUES (user_uuid, 'Alexis', 'Tomaselli', true)
        ON CONFLICT (user_id) DO UPDATE SET
            first_name = 'Alexis',
            last_name = 'Tomaselli',
            is_active = true;
            
        RAISE NOTICE '✅ Perfil creado correctamente';
    END IF;
    
    RAISE NOTICE '🎉 Verificación completada para alexistomaselli@gmail.com';
    
END $$;