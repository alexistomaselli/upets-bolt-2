# 📋 AFPets - Documentación Completa del Proyecto

## 🎯 **RESUMEN EJECUTIVO**

AFPets es una plataforma integral para el bienestar y seguridad de mascotas que combina:
- **QR inteligentes** para identificación de mascotas perdidas
- **IA veterinaria** por WhatsApp para consultas 24/7
- **Sistema de gestión** para comercios y usuarios
- **Roadmap de productos** futuros (GPS, comederos inteligentes, etc.)

---

## 🏗️ **ARQUITECTURA DEL PROYECTO**

### **Frontend (React + TypeScript)**
- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Auth**: Supabase Auth

### **Backend (Supabase)**
- **Database**: PostgreSQL con Row Level Security (RLS)
- **Auth**: Supabase Authentication
- **Storage**: Supabase Storage (para imágenes)
- **Edge Functions**: Para integraciones externas
- **Real-time**: Supabase Realtime (subscriptions)

---

## 📦 **MÓDULOS IMPLEMENTADOS**

### **1. 🔐 AUTENTICACIÓN Y ROLES**
**Estado**: ✅ **Completado**

#### **Funcionalidades:**
- Registro de usuarios con email/password
- Login con redirección automática según rol
- Sistema de roles jerárquico:
  - `super_admin` (nivel 100) - Control total
  - `company_admin` (nivel 50) - Gestión de comercios
  - `branch_admin` (nivel 30) - Gestión de sucursales
  - `customer` (nivel 10) - Usuario final

#### **Componentes:**
- `LoginForm` - Formulario de inicio de sesión
- `RegisterForm` - Registro de nuevos usuarios
- `ProtectedRoute` - Protección de rutas por rol
- `useAuth` - Hook principal de autenticación

#### **Base de Datos:**
```sql
- auth.users (Supabase Auth)
- user_profiles (perfiles extendidos)
- roles (definición de roles)
- user_roles (asignación usuario-rol)
- permissions (permisos granulares)
- role_permissions (permisos por rol)
```

---

### **2. 🏢 GESTIÓN DE COMERCIOS**
**Estado**: ✅ **Completado**

#### **Funcionalidades:**
- CRUD completo de comercios e instituciones
- Gestión de sucursales por comercio
- Asignación de usuarios a comercios/sucursales
- Filtros avanzados y búsqueda
- Comisiones configurables por comercio

#### **Componentes:**
- `CompanyManagement` - Gestión principal
- `CompanyList` - Lista de comercios
- `CompanyCard` - Tarjeta de comercio
- `CompanyForm` - Formulario de creación/edición
- `CompanyFilters` - Filtros de búsqueda

#### **Base de Datos:**
```sql
- companies (comercios e instituciones)
- branches (sucursales)
- company_users (usuarios asignados)
```

---

### **3. 🏷️ SISTEMA QR**
**Estado**: ✅ **Completado**

#### **Funcionalidades:**
- Generación de lotes de códigos QR
- Activación de QRs por usuarios
- Seguimiento de escaneos
- Estados: inactivo, activo, perdido, encontrado
- Tipos: básico, premium, institucional

#### **Componentes:**
- `QRBatchManager` - Gestión de lotes
- `QRList` - Lista de códigos QR
- `QRCard` - Tarjeta de QR individual
- `QRStats` - Estadísticas de uso

#### **Base de Datos:**
```sql
- qr_codes (códigos QR)
- qr_batches (lotes de QR)
- qr_scans (registro de escaneos)
```

---

### **4. 🐕 GESTIÓN DE MASCOTAS**
**Estado**: ✅ **Estructura Completa** (Frontend pendiente)

#### **Funcionalidades Planificadas:**
- Registro de mascotas por usuario
- Información médica y veterinaria
- Contactos de emergencia
- Vinculación con códigos QR

#### **Base de Datos:**
```sql
- pets (información de mascotas)
- emergency_contacts (contactos de emergencia)
- veterinary_info (información veterinaria)
```

---

### **5. 🛒 E-COMMERCE**
**Estado**: ✅ **Frontend Completo** (Integración WooCommerce pendiente)

#### **Funcionalidades:**
- Catálogo de productos (QRs, covers, packs)
- Carrito de compras reactivo
- Proceso de checkout
- Integración con WooCommerce (headless)

#### **Componentes:**
- `StorePage` - Catálogo principal
- `ProductPage` - Detalle de producto
- `ProductCard` - Tarjeta de producto
- `CartPage` - Carrito de compras
- `CheckoutPage` - Proceso de compra

---

### **6. 🤖 IA VETERINARIA**
**Estado**: ✅ **Landing Completa** (Integración WhatsApp pendiente)

#### **Funcionalidades:**
- Landing explicativa del servicio
- Redirección a WhatsApp con mensaje predefinido
- Información sobre tipos de consultas

#### **Componentes:**
- `WhatsAppPage` - Landing del servicio
- `AIVetSection` - Sección en homepage

---

### **7. 📊 DASHBOARD ADMINISTRATIVO**
**Estado**: ✅ **Estructura Base** (Módulos específicos en desarrollo)

#### **Funcionalidades:**
- Panel principal con estadísticas
- Acceso diferenciado por rol
- Gestión de comercios y QRs
- Navegación modular

#### **Componentes:**
- `AdminDashboard` - Panel principal
- `CustomerDashboard` - Panel de usuario

---

## 🛠️ **ASPECTOS TÉCNICOS**

### **🔧 FRONTEND (React + TypeScript)**

#### **Estructura de Carpetas:**
```
src/
├── components/           # Componentes organizados por módulo
│   ├── ui/              # Componentes reutilizables
│   ├── auth/            # Autenticación
│   ├── companies/       # Gestión de comercios
│   ├── qr/              # Sistema QR
│   ├── layout/          # Header, Footer, etc.
│   └── forms/           # Formularios reutilizables
├── hooks/               # Custom hooks por módulo
├── pages/               # Páginas principales
├── services/            # Integración con APIs
├── types/               # Definiciones TypeScript
└── utils/               # Utilidades
```

#### **Hooks Principales:**
- `useAuth()` - Gestión de autenticación y roles
- `useCart()` - Estado global del carrito
- `useCompanies()` - CRUD de comercios
- `useQRCodes()` - Gestión de códigos QR
- `useProducts()` - Catálogo de productos

#### **Componentes UI Reutilizables:**
- `Button` - Botón con variantes
- `Input` - Input con validación
- `Modal` - Modal reutilizable
- `Card` - Tarjeta base
- `Badge` - Etiquetas de estado
- `LoadingSpinner` - Indicador de carga

#### **Estado Global:**
- **React Query** para cache de datos del servidor
- **Estado local** para carrito de compras
- **Supabase Auth** para estado de autenticación

---

### **🗄️ BACKEND (Supabase)**

#### **Esquema de Base de Datos:**

##### **Autenticación:**
```sql
-- Usuarios base (Supabase Auth)
auth.users

-- Perfiles extendidos
user_profiles (
  id, user_id, first_name, last_name, phone, 
  avatar_url, company_id, branch_id, metadata
)

-- Sistema de roles
roles (id, name, description, level, is_system)
user_roles (id, user_id, role_id, granted_by, is_active)
permissions (id, resource, action, description)
role_permissions (id, role_id, permission_id)
```

##### **Comercios:**
```sql
companies (
  id, name, type, business_type, email, phone,
  address, commission_rate, status, metadata
)

branches (
  id, company_id, name, code, address, 
  coordinates, operating_hours, status
)

company_users (
  id, company_id, branch_id, user_id, role, permissions
)
```

##### **Sistema QR:**
```sql
qr_codes (
  id, code, pet_id, owner_id, qr_type, status,
  activation_date, scan_count, purchase_price
)

qr_batches (
  id, batch_number, quantity, qr_type, 
  price_per_unit, branch_id, status
)

qr_scans (
  id, qr_code_id, scanner_ip, scan_location,
  scan_date, contact_made, notes
)
```

##### **Mascotas:**
```sql
pets (
  id, owner_id, name, species, breed, color,
  birth_date, medical_conditions, photo_url
)

emergency_contacts (
  id, pet_id, name, phone, relationship, is_primary
)

veterinary_info (
  id, pet_id, vet_name, vet_clinic, vaccinations,
  allergies, last_checkup, next_checkup
)
```

#### **Row Level Security (RLS):**
- **Políticas granulares** por tabla y operación
- **Funciones RPC** para verificación de roles
- **Seguridad por defecto** - deny all, allow specific

#### **Funciones RPC:**
```sql
get_user_roles(user_uuid) -- Obtener roles de usuario
user_has_permission(user_uuid, resource, action) -- Verificar permisos
increment_qr_scan_count(qr_id) -- Incrementar contador de escaneos
```

---

## 🚀 **ESTADO ACTUAL Y PRÓXIMOS PASOS**

### **✅ COMPLETADO:**
1. **Autenticación completa** con roles jerárquicos
2. **Gestión de comercios** y sucursales
3. **Sistema QR** con generación de lotes
4. **Frontend e-commerce** con carrito reactivo
5. **Landing pages** principales
6. **Estructura de base de datos** completa
7. **Componentes UI** reutilizables

### **🔄 EN DESARROLLO:**
1. **Integración WooCommerce** para e-commerce real
2. **Módulo de mascotas** (frontend)
3. **Dashboard con métricas** reales
4. **Sistema de notificaciones**

### **📋 PENDIENTE:**
1. **Integración WhatsApp** para IA veterinaria
2. **Sistema de pagos** (Stripe/MercadoPago)
3. **App móvil** para escaneo de QRs
4. **Módulo de reportes** avanzados
5. **API pública** para integraciones

---

## 🔧 **CONFIGURACIÓN Y DEPLOYMENT**

### **Variables de Entorno:**
```env
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# WooCommerce (opcional)
VITE_WC_API_BASE_URL=https://tu-wp.com/wp-json/wc/v3
VITE_WC_CONSUMER_KEY=ck_...
VITE_WC_CONSUMER_SECRET=cs_...

# WhatsApp
VITE_WHATSAPP_PHONE=+5491123456789
```

### **Scripts Disponibles:**
```bash
npm run dev          # Desarrollo local
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

### **Deployment:**
- **Frontend**: Compatible con Vercel, Netlify, etc.
- **Backend**: Supabase (managed)
- **Docker**: Incluye Dockerfile para containerización

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

- `README.md` - Guía de instalación y uso
- `INTEGRACION_WORDPRESS.md` - Integración con WooCommerce
- `SEO-README.md` - Optimización SEO implementada
- `scripts/` - Scripts de administración

---

## 🎯 **ROADMAP FUTURO**

### **Fase 2 - Dispositivos Inteligentes (2025 Q3-Q4):**
- GPS Tracker con geovallas
- Comedero inteligente con control remoto
- Monitor de salud con sensores

### **Fase 3 - Personalización 3D (2026 Q1-Q2):**
- Accesorios impresos en 3D
- Prótesis veterinarias personalizadas
- Marketplace de diseños

### **Fase 4 - Ecosistema Completo (2026 Q3-Q4):**
- Red de veterinarios integrada
- Comercios pet-friendly
- Comunidad AFPets social

---

**🏁 El proyecto tiene una base sólida y escalable, con arquitectura moderna y buenas prácticas implementadas. La estructura modular permite agregar funcionalidades de forma incremental.**