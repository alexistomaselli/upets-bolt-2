FROM node:20-alpine as build

WORKDIR /app

# Declarar ARGs para las variables de entorno de build
ARG VITE_WP_API_BASE_URL
ARG VITE_WC_API_BASE_URL
ARG VITE_WC_CONSUMER_KEY
ARG VITE_WC_CONSUMER_SECRET
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_URL

# Convertir ARGs a ENVs para que estén disponibles durante el build
ENV VITE_WP_API_BASE_URL=$VITE_WP_API_BASE_URL
ENV VITE_WC_API_BASE_URL=$VITE_WC_API_BASE_URL
ENV VITE_WC_CONSUMER_KEY=$VITE_WC_CONSUMER_KEY
ENV VITE_WC_CONSUMER_SECRET=$VITE_WC_CONSUMER_SECRET
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación con las variables de entorno
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]