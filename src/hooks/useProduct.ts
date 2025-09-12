import { useState, useEffect } from 'react';
import { Product } from '../types/product';

export const useProduct = (slug: string) => {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulación de API call - en producción esto sería una llamada real a WooCommerce
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Por ahora retornamos null para usar el producto placeholder
        setData(null);
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { data, isLoading, error };
};