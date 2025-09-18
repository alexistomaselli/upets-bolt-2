#!/usr/bin/env node

/**
 * Script para aplicar la migración que elimina el campo de precio de QRs en Supabase Cloud
 * Uso: node scripts/apply-migration.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Cargar variables de entorno desde .env.local
dotenv.config({ path: '.env.local' })

// Verificar que las variables de entorno necesarias estén definidas
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Las variables de entorno VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas')
  console.error('Asegúrate de que estén definidas en tu archivo .env.local')
  console.error('Consulta el archivo README-MIGRACION.md para más información')
  process.exit(1)
}

// Crear cliente de Supabase con la service role key
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Ruta a la migración
const migrationPath = path.join(process.cwd(), 'supabase/migrations/20250915170000_remove_qr_price.sql')

// Verificar que el archivo de migración existe
if (!fs.existsSync(migrationPath)) {
  console.error(`Error: No se encontró el archivo de migración en ${migrationPath}`)
  process.exit(1)
}

// Leer el contenido del archivo de migración
const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

// Función principal
async function applyMigration() {
  console.log('No se puede aplicar la migración automáticamente a través de la API de Supabase.')
  console.log('\nPara aplicar la migración manualmente, sigue estos pasos:')
  console.log('\n1. Accede al panel de Supabase: https://app.supabase.com')
  console.log('2. Selecciona tu proyecto')
  console.log('3. Ve a la sección "SQL Editor"')
  console.log('4. Crea una nueva consulta')
  console.log('5. Pega el siguiente SQL y ejecútalo:\n')
  console.log('```')
  console.log(migrationSQL)
  console.log('```\n')
  console.log('Esta migración eliminará los siguientes campos:')
  console.log('- purchase_price de la tabla qr_codes')
  console.log('- price_per_unit de la tabla qr_batches')
  console.log('- total_amount de la tabla qr_batches')
  
  // Mostrar el contenido del archivo de migración
  console.log('\nContenido del archivo de migración:')
  console.log(migrationSQL)
}

// Ejecutar la función principal
applyMigration()