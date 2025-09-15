#!/usr/bin/env node

/**
 * Script para asignar rol super_admin a un usuario
 * Uso: node scripts/assign-superadmin.js
 */

import { createClient } from '@supabase/supabase-js'

// ⚠️ REEMPLAZA ESTAS CREDENCIALES CON LAS TUYAS
const SUPABASE_URL = 'https://tu-proyecto-id.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // SERVICE_ROLE_KEY

const EMAIL_TO_PROMOTE = 'alexistomaselli@gmail.com'

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function assignSuperAdmin() {
  try {
    console.log('🔍 Buscando usuario:', EMAIL_TO_PROMOTE)
    
    // 1. Buscar usuario por email
    const { data: authUser, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (userError) {
      console.error('❌ Error buscando usuarios:', userError)
      return
    }
    
    const user = authUser.users.find(u => u.email === EMAIL_TO_PROMOTE)
    
    if (!user) {
      console.error('❌ Usuario no encontrado:', EMAIL_TO_PROMOTE)
      return
    }
    
    console.log('✅ Usuario encontrado:', user.id, user.email)
    
    // 2. Buscar rol super_admin
    console.log('🔍 Buscando rol super_admin...')
    const { data: role, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('id, name, level')
      .eq('name', 'super_admin')
      .single()
    
    if (roleError) {
      console.error('❌ Error buscando rol super_admin:', roleError)
      return
    }
    
    console.log('✅ Rol encontrado:', role)
    
    // 3. Verificar si ya tiene el rol
    console.log('🔍 Verificando roles existentes...')
    const { data: existingRoles, error: existingError } = await supabaseAdmin
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role_id', role.id)
    
    if (existingError) {
      console.error('❌ Error verificando roles:', existingError)
      return
    }
    
    if (existingRoles && existingRoles.length > 0) {
      console.log('⚠️ Usuario ya tiene el rol super_admin asignado')
      
      // Activar el rol si está inactivo
      const { error: updateError } = await supabaseAdmin
        .from('user_roles')
        .update({ is_active: true })
        .eq('user_id', user.id)
        .eq('role_id', role.id)
      
      if (updateError) {
        console.error('❌ Error activando rol:', updateError)
      } else {
        console.log('✅ Rol super_admin activado')
      }
      return
    }
    
    // 4. Asignar rol super_admin
    console.log('🎯 Asignando rol super_admin...')
    const { data: newRole, error: assignError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: user.id,
        role_id: role.id,
        is_active: true,
        granted_at: new Date().toISOString()
      })
      .select()
    
    if (assignError) {
      console.error('❌ Error asignando rol:', assignError)
      return
    }
    
    console.log('🎉 ¡Rol super_admin asignado exitosamente!')
    console.log('📋 Detalles:', newRole)
    
    // 5. Verificar función get_user_roles
    console.log('🔍 Verificando función get_user_roles...')
    const { data: userRoles, error: funcError } = await supabaseAdmin
      .rpc('get_user_roles', { user_uuid: user.id })
    
    if (funcError) {
      console.error('❌ Error con función get_user_roles:', funcError)
    } else {
      console.log('✅ Roles del usuario:', userRoles)
    }
    
  } catch (error) {
    console.error('💥 Error inesperado:', error)
  }
}

// Ejecutar script
assignSuperAdmin()
  .then(() => {
    console.log('\n🏁 Script completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })