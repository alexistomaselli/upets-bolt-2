import axios from 'axios';
import { Product, ProductCategory, Order, Cart } from '../types/product';

// Configuración de variables de entorno
const WC_API_BASE_URL = import.meta.env.VITE_WC_API_BASE_URL;
const WC_CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;
const WP_AUTH_METHOD = import.meta.env.VITE_WP_AUTH_METHOD || 'wc_keys';

// Validar configuración
if (!WC_API_BASE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.warn('⚠️ Variables de entorno de WooCommerce no configuradas completamente');
  console.warn('Verificar:', {
    WC_API_BASE_URL: !!WC_API_BASE_URL,
    WC_CONSUMER_KEY: !!WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET: !!WC_CONSUMER_SECRET
  });
}

// Configurar cliente axios
const wcApi = axios.create({
  baseURL: WC_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Variable para controlar peticiones duplicadas
const pendingRequests = new Map<string, Promise<any>>();

// Extender el tipo de configuración de Axios para incluir nuestra propiedad personalizada
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _requestKey?: string;
  }
}

// Interceptor para autenticación y control de peticiones duplicadas
wcApi.interceptors.request.use((config) => {
  if (WC_CONSUMER_KEY && WC_CONSUMER_SECRET) {
    // Usar autenticación básica con las claves de WooCommerce
    const credentials = btoa(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`);
    config.headers.Authorization = `Basic ${credentials}`;
    
    // También agregar como parámetros de query (método alternativo)
    config.params = {
      ...config.params,
      consumer_key: WC_CONSUMER_KEY,
      consumer_secret: WC_CONSUMER_SECRET,
    };
  }
  
  // Crear una clave única para esta petición
  const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
  
  // Verificar si hay una petición idéntica pendiente
  if (pendingRequests.has(requestKey)) {
    console.log('⚠️ Petición duplicada detectada, usando promesa existente:', config.url);
    return Promise.reject({ 
      duplicateRequest: true, 
      pendingPromise: pendingRequests.get(requestKey) 
    });
  }
  
  // Registrar esta petición como pendiente
  const requestPromise = new Promise<any>((resolve) => {
    config._requestKey = requestKey;
    resolve(config);
  });
  pendingRequests.set(requestKey, requestPromise);
  
  // Reducir logs para evitar saturar la consola
  if (import.meta.env.DEV) {
    console.log('🔄 Realizando petición a:', config.url);
  }
  return config;
});

// Interceptor para respuestas
wcApi.interceptors.response.use(
  (response) => {
    // Limpiar la petición pendiente
    if (response.config._requestKey) {
      pendingRequests.delete(response.config._requestKey);
    }
    // Reducir logs para evitar saturar la consola
    if (import.meta.env.DEV) {
      console.log('✅ Respuesta exitosa de WooCommerce:', response.config.url);
    }
    return response;
  },
  (error) => {
    // Manejar peticiones duplicadas
    if (error.duplicateRequest && error.pendingPromise) {
      // Reutilizar la promesa existente sin generar logs adicionales
      return error.pendingPromise;
    }
    
    // Limpiar la petición pendiente en caso de error
    if (error.config?._requestKey) {
      pendingRequests.delete(error.config._requestKey);
    }
    
    // Solo mostrar errores detallados en desarrollo
    if (import.meta.env.DEV) {
      console.error('❌ Error en petición WooCommerce:', {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message
      });
      
      // Si es un error de CORS, mostrar mensaje específico
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.error('🚫 Error de CORS o red. Verificar configuración del servidor WordPress.');
      }
    }
    
    return Promise.reject(error);
  }
);

export class WooCommerceAPI {
  // Método para probar la conexión
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Probando conexión con WooCommerce...');
      const response = await wcApi.get('/products', { params: { per_page: 1 } });
      console.log('✅ Conexión con WooCommerce exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión con WooCommerce:', error);
      return false;
    }
  }

  // Productos
  static async getProducts(params?: {
    per_page?: number;
    page?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  }): Promise<Product[]> {
    try {
      // Reducir logs para evitar saturar la consola
      if (import.meta.env.DEV) {
        console.log('📦 Obteniendo productos con parámetros:', params);
      }
      
      // Preparar parámetros de la consulta
      const queryParams: any = {
        per_page: params?.per_page || 12,
        page: params?.page || 1,
        status: 'publish',
        ...params
      };

      // Si hay categoría, buscar por slug
      if (params?.category) {
        // Primero obtener el ID de la categoría por slug
        const categories = await this.getCategories();
        const category = categories.find(cat => cat.slug === params.category);
        if (category) {
          queryParams.category = category.id;
        }
        delete queryParams.category; // Remover el slug
      }

      const response = await wcApi.get('/products', { params: queryParams });
      const products = response.data;
      
      // Reducir logs para evitar saturar la consola
      if (import.meta.env.DEV) {
        console.log(`✅ ${products.length} productos obtenidos de WooCommerce`);
      }
      return products;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error obteniendo productos:', error);
      }
      return [];
    }
  }

  static async getProduct(id: number): Promise<Product | null> {
    try {
      console.log(`📦 Obteniendo producto ID: ${id}`);
      const response = await wcApi.get(`/products/${id}`);
      console.log('✅ Producto obtenido exitosamente');
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo producto ${id}:`, error);
      return null;
    }
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      console.log(`📦 Obteniendo producto por slug: ${slug}`);
      const response = await wcApi.get('/products', { 
        params: { 
          slug,
          per_page: 1,
          status: 'publish'
        } 
      });
      
      const product = response.data[0] || null;
      if (product) {
        console.log('✅ Producto encontrado por slug');
      } else {
        console.log('⚠️ No se encontró producto con ese slug');
      }
      return product;
    } catch (error) {
      console.error(`❌ Error obteniendo producto por slug ${slug}:`, error);
      return null;
    }
  }

  // Categorías
  static async getCategories(): Promise<ProductCategory[]> {
    try {
      console.log('📂 Obteniendo categorías...');
      const response = await wcApi.get('/products/categories', {
        params: {
          per_page: 100,
          hide_empty: true
        }
      });
      
      const categories = response.data;
      console.log(`✅ ${categories.length} categorías obtenidas`);
      return categories;
    } catch (error) {
      console.error('❌ Error obteniendo categorías:', error);
      return [];
    }
  }

  // Variaciones de producto
  static async getProductVariations(productId: number) {
    try {
      console.log(`🔄 Obteniendo variaciones para producto ${productId}`);
      const response = await wcApi.get(`/products/${productId}/variations`);
      console.log('✅ Variaciones obtenidas');
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo variaciones del producto ${productId}:`, error);
      return [];
    }
  }

  // Órdenes
  static async createOrder(orderData: any): Promise<Order | null> {
    try {
      console.log('🛒 Creando orden...', orderData);
      const response = await wcApi.post('/orders', orderData);
      console.log('✅ Orden creada exitosamente:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando orden:', error);
      throw error;
    }
  }

  static async getOrder(id: number): Promise<Order | null> {
    try {
      console.log(`📋 Obteniendo orden ${id}`);
      const response = await wcApi.get(`/orders/${id}`);
      console.log('✅ Orden obtenida');
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo orden ${id}:`, error);
      return null;
    }
  }

  // Carrito (localStorage)
  static async updateCart(items: any[]): Promise<Cart> {
    try {
      const cart = {
        items: items,
        item_count: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping_total: 0,
        tax_total: 0,
        total: 0
      };
      cart.total = cart.subtotal + cart.shipping_total + cart.tax_total;
      
      localStorage.setItem('afpets_cart', JSON.stringify(cart));
      console.log('🛒 Carrito actualizado:', cart.item_count, 'items');
      return cart;
    } catch (error) {
      console.error('❌ Error actualizando carrito:', error);
      return this.getCartFromStorage();
    }
  }

  static getCartFromStorage(): Cart {
    try {
      const cartData = localStorage.getItem('afpets_cart');
      return cartData ? JSON.parse(cartData) : {
        items: [],
        item_count: 0,
        total: 0,
        subtotal: 0,
        shipping_total: 0,
        tax_total: 0
      };
    } catch (error) {
      console.error('❌ Error obteniendo carrito del localStorage:', error);
      return {
        items: [],
        item_count: 0,
        total: 0,
        subtotal: 0,
        shipping_total: 0,
        tax_total: 0
      };
    }
  }
}

// Probar conexión al cargar el módulo
if (typeof window !== 'undefined') {
  WooCommerceAPI.testConnection();
}