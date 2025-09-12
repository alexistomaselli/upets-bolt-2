# Integración WordPress + WooCommerce Headless

Esta guía explica cómo configurar WordPress + WooCommerce para que funcione como backend headless con el frontend de AFPets.

## 1. URLs Base

Configurar las siguientes URLs base en tu archivo `.env`:

- **WordPress REST API**: `https://TU-DOMINIO.com/wp-json/`
- **WooCommerce REST API**: `https://TU-DOMINIO.com/wp-json/wc/v3/`

## 2. Autenticación

### Método Recomendado: WooCommerce REST API Keys

1. **Generar claves en WordPress**:
   - Ir a: `WooCommerce > Configuración > Avanzado > REST API`
   - Hacer clic en "Agregar clave"
   - Descripción: "AFPets Frontend"
   - Usuario: Administrador
   - Permisos: "Lectura/Escritura"
   - Generar claves

2. **Configurar variables de entorno**:
```env
WC_CONSUMER_KEY=ck_tu_consumer_key_aqui
WC_CONSUMER_SECRET=cs_tu_consumer_secret_aqui
WP_AUTH_METHOD=wc_keys
```

### Alternativa: JWT (para funciones de usuario)

Si necesitas autenticación de usuarios, instalar plugin JWT Authentication.

## 3. CORS

Configurar CORS para permitir peticiones desde el frontend.

### En .htaccess (Apache):
```apache
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "https://frontend.afpets.com"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"
</IfModule>
```

### En Nginx:
```nginx
add_header Access-Control-Allow-Origin "https://frontend.afpets.com" always;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
add_header Access-Control-Allow-Credentials "true" always;
```

## 4. Permalinks

Configurar permalinks en WordPress:
- Ir a: `Configuración > Enlaces permanentes`
- Seleccionar: "Nombre de la entrada"
- Guardar cambios

## 5. Endpoints de Ejemplo

### Listar productos:
```
GET /wp-json/wc/v3/products?per_page=12&page=1&category=qr
```

**Response**:
```json
[
  {
    "id": 123,
    "name": "Colgante QR Básico",
    "slug": "colgante-qr-basico",
    "price": "2500",
    "regular_price": "2500",
    "images": [{"src": "https://..."}],
    "attributes": [
      {"name": "Tamaño", "options": ["S", "M", "L"]},
      {"name": "Color", "options": ["Negro", "Blanco"]}
    ]
  }
]
```

### Detalle por slug:
```
GET /wp-json/wc/v3/products?slug=colgante-qr-basico
```

### Crear orden:
```
POST /wp-json/wc/v3/orders
```

**Payload mínimo**:
```json
{
  "payment_method": "bacs",
  "payment_method_title": "Transferencia bancaria",
  "set_paid": false,
  "billing": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address_1": "Av. Corrientes 1234",
    "city": "Buenos Aires",
    "postcode": "1000",
    "country": "AR",
    "email": "juan@example.com",
    "phone": "1123456789"
  },
  "shipping": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address_1": "Av. Corrientes 1234",
    "city": "Buenos Aires",
    "postcode": "1000",
    "country": "AR"
  },
  "line_items": [
    {
      "product_id": 123,
      "quantity": 1,
      "variation_id": 456
    }
  ]
}
```

### Obtener categorías:
```
GET /wp-json/wc/v3/products/categories
```

### Obtener atributos para filtros:
```
GET /wp-json/wc/v3/products/attributes
```

## 6. Estructura de Atributos Sugerida

### Producto: Base QR
- **Atributos**:
  - `pa_tamaño`: S, M, L
  - `pa_color_base`: Negro, Blanco, Gris
  - `pa_compatibilidad`: Serie A

### Producto: Cover Decorativo
- **Atributos**:
  - `pa_tema`: Pez (Playa), Oso (Montaña), Hueso (Ciudad), Clásico
  - `pa_color`: Azul, Verde, Naranja, etc.
  - `pa_compatibilidad`: Serie A

### Producto: Packs
- **Tipo**: Producto agrupado o variable
- **Incluye**: Múltiples covers con descuento

## 7. Webhooks (Opcional)

Configurar webhooks para automatizaciones:

1. **En WooCommerce**: `WooCommerce > Configuración > Avanzado > Webhooks`

2. **Eventos útiles**:
   - `order.created` → Enviar email de bienvenida
   - `order.updated` → Actualizar estado en CRM
   - `order.completed` → Activar QR automáticamente

3. **URL de destino**: Tu servicio de automatización (n8n, Zapier, etc.)

## 8. Pruebas de Integración

### Checklist de pruebas:

- [ ] **Catálogo**: Los productos se cargan correctamente
- [ ] **Filtros**: Filtrar por categoría, tema, tamaño funciona
- [ ] **PDP**: Página de producto muestra variantes y permite selección
- [ ] **Carrito**: Agregar/quitar productos funciona
- [ ] **Checkout**: Crear orden y procesar pago funciona
- [ ] **Emails**: Confirmación de orden llega correctamente
- [ ] **CORS**: No hay errores de CORS en consola del navegador

### Comandos de prueba con curl:

```bash
# Probar conexión
curl -X GET "https://TU-WP/wp-json/wc/v3/products" \
  -u "CONSUMER_KEY:CONSUMER_SECRET"

# Probar creación de orden
curl -X POST "https://TU-WP/wp-json/wc/v3/orders" \
  -u "CONSUMER_KEY:CONSUMER_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "bacs",
    "billing": {"first_name": "Test", "email": "test@example.com"},
    "line_items": [{"product_id": 123, "quantity": 1}]
  }'
```

## 9. Configuración de Productos en WordPress

### Categorías sugeridas:
- `qr-colgantes` (ID: qr)
- `covers-decorativos` (ID: covers)
- `packs-ofertas` (ID: packs)

### Atributos del producto:
1. **Tamaño** (pa_tamaño): S, M, L
2. **Tema** (pa_tema): Pez, Oso, Hueso, Clásico
3. **Color** (pa_color): (según tema)
4. **Compatibilidad** (pa_compatibilidad): Serie A

### Productos de ejemplo:
1. **Colgante QR Básico** (producto variable)
2. **Cover Pez - Playa** (producto simple)
3. **Cover Oso - Montaña** (producto simple)
4. **Pack 3 Covers** (producto agrupado)
5. **Starter Kit** (producto agrupado: QR + 2 Covers)

## Troubleshooting

### Error 401 Unauthorized
- Verificar consumer key/secret
- Verificar permisos del usuario asociado
- Comprobar formato de autenticación

### Error CORS
- Verificar configuración CORS en servidor
- Comprobar que el origen esté permitido
- Verificar headers permitidos

### Productos no aparecen
- Verificar que estén publicados
- Comprobar stock disponible
- Verificar configuración de visibilidad del catálogo