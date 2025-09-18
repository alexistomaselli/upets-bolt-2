import axios from 'axios';
import { Product, ProductCategory, Order, Cart } from '../types/product';

// Configuración de variables de entorno
const WC_API_BASE_URL = import.meta.env.VITE_WC_API_BASE_URL || 'https://shop.afpets.com/wp-json/wc/v3';
const WC_CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY || 'ck_72d9441104adb4f5fbfe9ae3cb2da5847b2bf5a3';
const WC_CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || 'cs_1380cb1668ca1ca58ae9aa9fac6de571f1092e70';
const WP_AUTH_METHOD = import.meta.env.VITE_WP_AUTH_METHOD || 'wc_keys';

// Validar configuración
if (!WC_API_BASE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.warn('⚠️ Variables de entorno de WooCommerce no configuradas completamente. Usando valores por defecto.');
  console.warn('Verificar:', {
    WC_API_BASE_URL: !!WC_API_BASE_URL,
    WC_CONSUMER_KEY: !!WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET: !!WC_CONSUMER_SECRET
  });
} else {
  console.log('✅ Configuración de WooCommerce cargada:', {
    baseUrl: WC_API_BASE_URL,
    hasKey: !!WC_CONSUMER_KEY,
    hasSecret: !!WC_CONSUMER_SECRET,
    authMethod: WP_AUTH_METHOD
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

// Interceptor para autenticación
wcApi.interceptors.request.use((config) => {
  if (WC_CONSUMER_KEY && WC_CONSUMER_SECRET) {
    // Usar parámetros de query para autenticación (método recomendado para WooCommerce)
    config.params = {
      ...config.params,
      consumer_key: WC_CONSUMER_KEY,
      consumer_secret: WC_CONSUMER_SECRET,
    };
    
    console.log('🔑 Autenticación WooCommerce configurada para:', config.url);
  }
  
  return config;
});

// Interceptor para respuestas
wcApi.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa de WooCommerce:', response.config.url, `(${response.data.length || 1} items)`);
    return response;
  },
  (error) => {
    console.error('❌ Error en petición WooCommerce:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Mensajes de error más específicos
    if (error.response?.status === 401) {
      console.error('🔐 Error de autenticación: Verificar consumer key y secret');
    } else if (error.response?.status === 403) {
      console.error('🚫 Error de permisos: El usuario no tiene acceso a la API');
    } else if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
      console.error('🌐 Error de red: Verificar CORS y conectividad con shop.afpets.com');
    }
    
    return Promise.reject(error);
  }
);

export class WooCommerceAPI {
  // Método para probar la conexión
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Probando conexión con WooCommerce en:', WC_API_BASE_URL);
      const response = await wcApi.get('/products', { params: { per_page: 1 } });
      console.log('✅ Conexión con WooCommerce exitosa. Productos disponibles:', response.data.length);
      return true;
    } catch (error) {
      console.error('❌ Error de conexión con WooCommerce. Usando productos placeholder.');
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
      console.log('📦 Obteniendo productos con parámetros:', params);
      
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
      }

      const response = await wcApi.get('/products', { params: queryParams });
      const products = response.data;
      
      console.log(`✅ ${products.length} productos obtenidos de WooCommerce`);
      return products;
    } catch (error) {
      console.warn('⚠️ No se pudieron obtener productos de WooCommerce. Usando productos placeholder.');
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
      console.log('📂 Obteniendo categorías de WooCommerce...');
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
      console.warn('⚠️ No se pudieron obtener categorías de WooCommerce. Usando categorías placeholder.');
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
      console.log('🛒 Creando orden en WooCommerce...', { 
        items: orderData.line_items?.length || 0,
        total: orderData.total || 'N/A'
      });
      const response = await wcApi.post('/orders', orderData);
      console.log('✅ Orden creada exitosamente en WooCommerce. ID:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando orden en WooCommerce:', error);
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
if (typeof window !== 'undefined' && WC_API_BASE_URL && WC_CONSUMER_KEY) {
  console.log('🚀 Iniciando prueba de conexión con WooCommerce...');
  WooCommerceAPI.testConnection().then(success => {
    if (success) {
      console.log('🎉 WooCommerce conectado exitosamente a shop.afpets.com');
    } else {
      console.log('⚠️ WooCommerce no disponible. La tienda funcionará con productos placeholder.');
    }
  });
}