# Funcionalidad de Switch entre Supabase Local y Remoto

## Descripción

Se ha implementado una nueva funcionalidad que permite a los super administradores cambiar fácilmente entre la instancia local de Supabase y la instancia remota. Esta característica es especialmente útil durante el desarrollo y pruebas, ya que permite trabajar con datos locales sin afectar el entorno de producción.

## Ubicación

La funcionalidad está disponible en el panel de Super Admin, en la sección "Configuración Sistema".

## Cómo usar

1. Inicia sesión como super_admin
2. Navega al panel de Super Admin
3. Selecciona la opción "Configuración Sistema" en el menú lateral
4. En la sección "Configuración de Supabase", verás un switch que te permite cambiar entre:
   - **Supabase Remoto** (por defecto): Conecta con la instancia remota configurada en las variables de entorno
   - **Supabase Local**: Conecta con la instancia local en http://localhost:54321

## Requisitos para usar Supabase Local

1. Debes tener Supabase ejecutándose localmente en el puerto 54321
2. La instancia local debe tener la misma estructura de base de datos que la remota

## Implementación Técnica

La funcionalidad se ha implementado mediante:

1. Un contexto de React (`SupabaseConfigContext`) que gestiona la configuración de Supabase
2. Modificaciones en el cliente de Supabase para usar la configuración activa
3. Almacenamiento de la preferencia en localStorage para persistencia entre sesiones
4. Un componente de UI para cambiar entre entornos

## Archivos modificados/creados

- `/src/context/SupabaseConfigContext.tsx` (nuevo)
- `/src/lib/supabase.ts` (modificado)
- `/src/components/admin/SupabaseEnvironmentSwitch.tsx` (nuevo)
- `/src/pages/admin/SuperAdminDashboard.tsx` (modificado)
- `/src/App.tsx` (modificado)

## Notas importantes

- Al cambiar entre entornos, la página se recargará automáticamente para aplicar los cambios
- Si no tienes Supabase ejecutándose localmente y cambias a ese entorno, la aplicación no funcionará correctamente
- La sesión de usuario se mantendrá, pero deberás volver a autenticarte si las credenciales no existen en el entorno al que cambias