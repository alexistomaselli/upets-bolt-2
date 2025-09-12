# Guía de SEO para AFPets

## Implementaciones realizadas

### 1. Metaetiquetas básicas
- Se ha actualizado el archivo `index.html` con metaetiquetas optimizadas para SEO:
  - Título descriptivo en español
  - Descripción relevante sobre el negocio
  - Palabras clave relacionadas con mascotas, bienestar animal y QR
  - Configuración de idioma a español

### 2. Datos estructurados (JSON-LD)
- Se ha implementado el componente `SEOStructuredData.tsx` que proporciona datos estructurados según Schema.org
- Tipos implementados:
  - WebSite: información general del sitio
  - Organization: datos de la empresa
  - Service: información sobre el servicio de QR para mascotas

### 3. Metaetiquetas para redes sociales
- Se ha implementado el componente `SocialMetaTags.tsx` con:
  - Open Graph para Facebook, WhatsApp y otras plataformas
  - Twitter Cards para previsualización en Twitter
  - Metadatos específicos según la página visitada

### 4. Archivos para indexación
- `robots.txt`: permite a los buscadores indexar todo el sitio
- `sitemap.xml`: mapa del sitio para facilitar la indexación
- Imagen OG: para mejorar la presentación en redes sociales

## Próximos pasos recomendados

1. **Verificar el sitio en Google Search Console**:
   - Accede a [Google Search Console](https://search.google.com/search-console)
   - Añade tu propiedad (afpets.com)
   - Sigue las instrucciones para verificar la propiedad
   - Reemplaza el código en `google-site-verification.html` con el proporcionado

2. **Crear cuentas en redes sociales**:
   - Crea perfiles en Facebook, Instagram y Twitter con el nombre "AFPets"
   - Actualiza las URLs en el componente de datos estructurados

3. **Generar contenido regular**:
   - Blog con artículos sobre cuidado de mascotas
   - Testimonios de clientes
   - Casos de éxito de mascotas encontradas gracias al QR

4. **Optimización local**:
   - Registra tu negocio en Google My Business
   - Añade la ubicación y datos de contacto

5. **Monitoreo de rendimiento**:
   - Instala Google Analytics para seguir el tráfico
   - Revisa regularmente Google Search Console para detectar problemas

## Palabras clave implementadas

- QR mascotas
- Bienestar animal
- Seguridad mascotas
- Veterinario IA
- WhatsApp veterinario
- Identificación mascotas
- Mascotas perdidas
- Vínculo humano-mascota
- Cuidado mascotas
- Consulta veterinaria online

## Notas importantes

- Las metaetiquetas se adaptan dinámicamente según la página visitada
- Los datos estructurados mejoran la comprensión del sitio por los buscadores
- La imagen OG (og-image.svg) debe convertirse a formato JPG o PNG para mejor compatibilidad