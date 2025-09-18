# Instrucciones para ejecutar la migración

## Aplicación manual de la migración

No es posible aplicar la migración automáticamente a través de la API de Supabase desde el script `apply-migration.js`. Sin embargo, puedes ejecutar el script para ver las instrucciones y el SQL que necesitas ejecutar manualmente:

```bash
node scripts/apply-migration.js
```

El script mostrará instrucciones detalladas sobre cómo aplicar la migración manualmente a través del panel de Supabase.

## Pasos para aplicar la migración manualmente

1. Accede al panel de Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a la sección "SQL Editor"
4. Crea una nueva consulta
5. Pega el siguiente SQL y ejecútalo:

```sql
/*
  # Eliminar campo de precio de QRs

  Esta migración elimina el campo purchase_price de la tabla qr_codes ya que los QRs
  no son productos para venta y su precio depende de planes de membresía.
*/

-- Eliminar la columna purchase_price de la tabla qr_codes
ALTER TABLE qr_codes DROP COLUMN IF EXISTS purchase_price;

-- Eliminar la columna price_per_unit de la tabla qr_batches
ALTER TABLE qr_batches DROP COLUMN IF EXISTS price_per_unit;

-- Eliminar la columna total_amount de la tabla qr_batches que depende del precio
ALTER TABLE qr_batches DROP COLUMN IF EXISTS total_amount;

RAISE NOTICE '✅ Columnas de precio eliminadas de las tablas qr_codes y qr_batches';
```

## Verificación

Después de aplicar la migración, puedes verificar que los campos se hayan eliminado correctamente ejecutando las siguientes consultas en el SQL Editor de Supabase:

```sql
-- Verificar que la columna purchase_price ya no existe en qr_codes
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'qr_codes' AND column_name = 'purchase_price';

-- Verificar que las columnas price_per_unit y total_amount ya no existen en qr_batches
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'qr_batches' AND column_name IN ('price_per_unit', 'total_amount');
```

Si las consultas no devuelven resultados, significa que las columnas se han eliminado correctamente.