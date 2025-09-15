/*
  # Asignar rol super_admin a Alexis Tomaselli

  1. Busca el usuario por email
  2. Crea/actualiza su perfil
  3. Asigna el rol super_admin
  4. Desactiva otros roles para evitar conflictos
*/

DO $$
DECLARE
    target_user_id uuid;
    superadmin_role_id uuid;
    profile_exists boolean;
    existing_role_count integer;
BEGIN
    -- 1. Buscar el usuario por email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'alexistomaselli@gmail.com';
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con email alexistomaselli@gmail.com no encontrado';
    END IF;
    
    RAISE NOTICE 'Usuario encontrado: %', target_user_id;
    
    -- 2. Buscar el rol super_admin
    SELECT id INTO superadmin_role_id 
    FROM roles 
    WHERE name = 'super_admin';
    
    IF superadmin_role_id IS NULL THEN
        RAISE EXCEPTION 'Rol super_admin no encontrado';
    END IF;
    
    RAISE NOTICE 'Rol super_admin encontrado: %', superadmin_role_id;
    
    -- 3. Verificar si ya existe el perfil
    SELECT EXISTS(
        SELECT 1 FROM user_profiles 
        WHERE user_id = target_user_id
    ) INTO profile_exists;
    
    -- 4. Crear o actualizar perfil
    IF profile_exists THEN
        UPDATE user_profiles 
        SET 
            first_name = 'Alexis',
            last_name = 'Tomaselli',
            is_active = true,
            updated_at = now()
        WHERE user_id = target_user_id;
        
        RAISE NOTICE 'Perfil actualizado para usuario %', target_user_id;
    ELSE
        INSERT INTO user_profiles (
            user_id,
            first_name,
            last_name,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            target_user_id,
            'Alexis',
            'Tomaselli',
            true,
            now(),
            now()
        );
        
        RAISE NOTICE 'Perfil creado para usuario %', target_user_id;
    END IF;
    
    -- 5. Desactivar roles existentes
    UPDATE user_roles 
    SET is_active = false 
    WHERE user_id = target_user_id AND is_active = true;
    
    GET DIAGNOSTICS existing_role_count = ROW_COUNT;
    
    IF existing_role_count > 0 THEN
        RAISE NOTICE 'Desactivados % roles existentes', existing_role_count;
    END IF;
    
    -- 6. Verificar si ya tiene el rol super_admin
    IF EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = target_user_id 
        AND role_id = superadmin_role_id
    ) THEN
        -- Actualizar rol existente
        UPDATE user_roles 
        SET 
            is_active = true,
            granted_at = now()
        WHERE user_id = target_user_id 
        AND role_id = superadmin_role_id;
        
        RAISE NOTICE 'Rol super_admin reactivado para usuario %', target_user_id;
    ELSE
        -- Crear nuevo rol
        INSERT INTO user_roles (
            user_id,
            role_id,
            granted_at,
            is_active
        ) VALUES (
            target_user_id,
            superadmin_role_id,
            now(),
            true
        );
        
        RAISE NOTICE 'Rol super_admin asignado exitosamente a usuario %', target_user_id;
    END IF;
    
    -- Verificación final
    RAISE NOTICE 'Verificación final:';
    RAISE NOTICE 'Usuario: % (%)', target_user_id, 'alexistomaselli@gmail.com';
    RAISE NOTICE 'Perfil creado: %', profile_exists;
    RAISE NOTICE 'Rol asignado: super_admin (nivel 100)';
    
END $$;