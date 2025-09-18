# Aplicar Migración en Supabase Cloud

Este documento explica cómo aplicar la migración para eliminar los campos de precio de las tablas `qr_codes` y `qr_batches` en Supabase Cloud.

## Requisitos

- Node.js instalado
- Archivo `.env` con las credenciales de Supabase (VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY)

## Pasos para ejecutar la migración

1. Asegúrate de que tu archivo `.env` en la raíz del proyecto contiene las siguientes variables:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

2. Instala las dependencias necesarias:

```bash
cd scripts
npm install
```

3. Ejecuta el script de migración:

```bash
npm run apply-migration
```

4. Verifica que la migración se haya aplicado correctamente. Deberías ver un mensaje de éxito indicando que se han eliminado los campos:
   - `purchase_price` de la tabla `qr_codes`
   - `price_per_unit` de la tabla `qr_batches`
   - `total_amount` de la tabla `qr_batches`

## Alternativa: Aplicar manualmente desde el panel de Supabase

Si prefieres aplicar la migración manualmente, puedes hacerlo desde el panel de administración de Supabase:

1. Inicia sesión en [Supabase](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a la sección "SQL Editor"
4. Crea un nuevo query y pega el contenido del archivo `supabase/migrations/20250915170000_remove_qr_price.sql`
5. Ejecuta el query

## Verificación

Para verificar que los campos se han eliminado correctamente, puedes ejecutar las siguientes consultas SQL en el editor SQL de Supabase:

```sql
-- Verificar estructura de la tabla qr_codes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'qr_codes';

-- Verificar estructura de la tabla qr_batches
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'qr_batches';
```

Los campos `purchase_price`, `price_per_unit` y `total_amount` no deberían aparecer en los resultados.