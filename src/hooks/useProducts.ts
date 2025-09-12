import { useQuery } from '@tanstack/react-query';
import { WooCommerceAPI } from '../services/woocommerce';

export const useProducts = (params?: {
  per_page?: number;
  page?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => WooCommerceAPI.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => WooCommerceAPI.getProduct(id),
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: () => WooCommerceAPI.getProductBySlug(slug),
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => WooCommerceAPI.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};