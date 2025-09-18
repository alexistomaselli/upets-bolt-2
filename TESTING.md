# Pruebas de Flujo de Autenticación

Este documento describe los pasos para probar el flujo de autenticación con el nuevo AuthContext implementado.

## Pruebas para Super Admin

1. **Login de Super Admin**
   - Navegar a `/admin/login`
   - Ingresar credenciales de super_admin
   - Verificar redirección a `/admin/dashboard`
   - Verificar que el componente DebugAuth muestra el rol "super_admin"

2. **Acceso a rutas protegidas**
   - Desde el dashboard, verificar acceso a todas las secciones
   - Verificar que el menú muestra las opciones correspondientes al rol

3. **Cierre de sesión**
   - Hacer clic en "Cerrar Sesión"
   - Verificar redirección a la página de login

## Pruebas para Cliente

1. **Registro de nuevo usuario**
   - Navegar a `/registro`
   - Completar el formulario con datos válidos
   - Verificar redirección a la página principal o dashboard de cliente

2. **Login de Cliente**
   - Navegar a `/login`
   - Ingresar credenciales de cliente
   - Verificar redirección a la página principal
   - Verificar que el componente DebugAuth muestra el rol "customer"

3. **Acceso a rutas protegidas**
   - Intentar acceder a `/mi-cuenta`
   - Verificar acceso correcto
   - Intentar acceder a `/admin/dashboard`
   - Verificar redirección a página de acceso denegado

4. **Cierre de sesión**
   - Hacer clic en "Cerrar Sesión"
   - Verificar redirección a la página de login

## Pruebas de Redirección Inteligente

1. **Redirección basada en rol**
   - Iniciar sesión con diferentes tipos de usuarios
   - Navegar a `/redirect`
   - Verificar redirección al dashboard correspondiente según el rol

## Credenciales de Prueba

- **Super Admin**:
  - Email: alexistomaselli@gmail.com
  - Password: (usar la contraseña correcta)

- **Cliente**:
  - Email: cliente@ejemplo.com
  - Password: (usar la contraseña correcta)

## Notas

- Verificar que el componente DebugAuth muestra la información correcta en cada caso
- Comprobar que las redirecciones funcionan correctamente
- Verificar que los permisos se aplican adecuadamente