# Conexión Externa a Supabase

## 🔑 **OBTENER CREDENCIALES DE SUPABASE**

### **1. Acceder al Dashboard de Supabase**
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto AFPets

### **2. Obtener las Keys**
1. Ve a **Settings** (⚙️) en el sidebar izquierdo
2. Selecciona **API**
3. Encontrarás estas credenciales:

```bash
# URL del proyecto
Project URL: https://tu-proyecto-id.supabase.co

# Clave pública (anon key) - para frontend
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clave de servicio (service_role) - para backend/admin
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **3. Database Connection String**
En la misma página de API, encontrarás:
```bash
# Para conexiones directas a PostgreSQL
Database URL: postgresql://postgres:[PASSWORD]@db.tu-proyecto-id.supabase.co:5432/postgres
```

---

## 🛠️ **MÉTODOS DE CONEXIÓN**

### **OPCIÓN 1: Cliente JavaScript/TypeScript**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tu-proyecto-id.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // SERVICE_ROLE

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Ahora puedes hacer operaciones de admin
const { data, error } = await supabaseAdmin
  .from('user_roles')
  .insert({ user_id: 'uuid', role_id: 'uuid' })
```

### **OPCIÓN 2: cURL (Terminal)**
```bash
# Obtener datos
curl -X GET 'https://tu-proyecto-id.supabase.co/rest/v1/user_roles' \
  -H "apikey: TU_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer TU_SERVICE_ROLE_KEY"

# Insertar datos
curl -X POST 'https://tu-proyecto-id.supabase.co/rest/v1/user_roles' \
  -H "apikey: TU_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer TU_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "uuid", "role_id": "uuid", "is_active": true}'
```

### **OPCIÓN 3: PostgreSQL Directo**
```bash
# Instalar psql si no lo tienes
# Ubuntu/Debian: sudo apt install postgresql-client
# macOS: brew install postgresql

# Conectar
psql "postgresql://postgres:[PASSWORD]@db.tu-proyecto-id.supabase.co:5432/postgres"

# Una vez conectado, puedes ejecutar SQL directamente
SELECT * FROM auth.users WHERE email = 'alexistomaselli@gmail.com';
```

### **OPCIÓN 4: Herramientas GUI**
- **pgAdmin**: Cliente PostgreSQL con interfaz gráfica
- **DBeaver**: Cliente universal de bases de datos
- **TablePlus**: Cliente moderno para bases de datos

---

## 🚨 **SEGURIDAD IMPORTANTE**

### **⚠️ NUNCA EXPONGAS LA SERVICE_ROLE_KEY**
- ❌ No la pongas en código frontend
- ❌ No la subas a repositorios públicos
- ❌ No la uses en aplicaciones cliente
- ✅ Solo úsala en backend/scripts de admin
- ✅ Guárdala en variables de entorno

### **🔒 Variables de Entorno**
```bash
# .env (para scripts locales)
SUPABASE_URL=https://tu-proyecto-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 **PARA TU CASO ESPECÍFICO (Asignar Rol Super Admin)**

### **Script Node.js Rápido:**
```javascript
// admin-script.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'TU_SUPABASE_URL',
  'TU_SERVICE_ROLE_KEY'
)

async function assignSuperAdmin() {
  // 1. Buscar usuario
  const { data: user } = await supabase.auth.admin.getUserByEmail('alexistomaselli@gmail.com')
  console.log('Usuario encontrado:', user)
  
  // 2. Buscar rol super_admin
  const { data: role } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'super_admin')
    .single()
  
  // 3. Asignar rol
  const { data, error } = await supabase
    .from('user_roles')
    .insert({
      user_id: user.user.id,
      role_id: role.id,
      is_active: true
    })
  
  console.log('Resultado:', { data, error })
}

assignSuperAdmin()
```

### **Ejecutar:**
```bash
npm install @supabase/supabase-js
node admin-script.js
```

---

## 📍 **UBICACIÓN DE LAS CREDENCIALES**

1. **Dashboard de Supabase** → **Settings** → **API**
2. Copia el **Project URL** y **service_role key**
3. ⚠️ **NUNCA** uses la service_role key en frontend

**¿Necesitas ayuda con algún método específico?**