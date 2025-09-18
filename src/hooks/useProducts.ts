import { useQuery, useQueryClient } from '@tanstack/react-query';
import { WooCommerceAPI } from '../services/woocommerce';
import { useEffect, useRef, useMemo } from 'react';

export const useProducts = (params?: {
  per_page?: number;
  page?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}) => {
  const queryClient = useQueryClient();
  
  // Crear una dependencia estable para params
  const stableParams = useMemo(() => ({
    per_page: params?.per_page,
    page: params?.page,
    category: params?.category,
    featured: params?.featured,
    search: params?.search
  }), [
    params?.per_page,
    params?.page,
    params?.category,
    params?.featured,
    params?.search
  ]);
  
  // Crear una queryKey estable
  const queryKey = useMemo(() => ['products', stableParams], [stableParams]);
  
  // Mantener una referencia a los parámetros actuales
  const paramsRef = useRef(params);
  
  // Usar un efecto para prefetchear y evitar múltiples refrescos
  useEffect(() => {
    // Verificar si ya tenemos datos en caché
    const cachedData = queryClient.getQueryData(queryKey);
    if (!cachedData) {
      // Solo prefetchear si no tenemos datos
      queryClient.prefetchQuery({
        queryKey,
        queryFn: () => WooCommerceAPI.getProducts(params),
        staleTime: 5 * 60 * 1000, // 5 minutos
      });
    }
    paramsRef.current = params;
  }, [queryClient, queryKey, params]);
  
  return useQuery({
    queryKey,
    queryFn: () => WooCommerceAPI.getProducts(paramsRef.current),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useProduct = (id: number) => {
  const queryClient = useQueryClient();
  
  // Crear una queryKey estable
  const queryKey = useMemo(() => ['product', id], [id]);
  
  // Mantener una referencia al ID actual
  const idRef = useRef(id);
  
  // Prefetchear producto si tenemos ID
  useEffect(() => {
    if (id) {
      const cachedData = queryClient.getQueryData(queryKey);
      if (!cachedData) {
        queryClient.prefetchQuery({
          queryKey,
          queryFn: () => WooCommerceAPI.getProduct(id),
          staleTime: 5 * 60 * 1000, // 5 minutos
        });
      }
    }
    idRef.current = id;
  }, [id, queryClient, queryKey]);
  
  return useQuery({
    queryKey,
    queryFn: () => WooCommerceAPI.getProduct(idRef.current),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  const queryClient = useQueryClient();
  
  // Crear una queryKey estable
  const queryKey = useMemo(() => ['product-by-slug', slug], [slug]);
  
  // Mantener una referencia al slug actual
  const slugRef = useRef(slug);
  
  // Prefetchear producto si tenemos slug
  useEffect(() => {
    if (slug) {
      const cachedData = queryClient.getQueryData(queryKey);
      if (!cachedData) {
        queryClient.prefetchQuery({
          queryKey,
          queryFn: () => WooCommerceAPI.getProductBySlug(slug),
          staleTime: 5 * 60 * 1000, // 5 minutos
        });
      }
    }
    slugRef.current = slug;
  }, [slug, queryClient, queryKey]);
  
  return useQuery({
    queryKey,
    queryFn: () => WooCommerceAPI.getProductBySlug(slugRef.current),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!slug,
  });
};

export const useCategories = () => {
  const queryClient = useQueryClient();
  
  // Crear una queryKey estable
  const queryKey = useMemo(() => ['categories'], []);
  
  // Prefetchear categorías
  useEffect(() => {
    const cachedData = queryClient.getQueryData(queryKey);
    if (!cachedData) {
      queryClient.prefetchQuery({
        queryKey,
        queryFn: () => WooCommerceAPI.getCategories(),
        staleTime: 30 * 60 * 1000, // 30 minutos
      });
    }
  }, [queryClient, queryKey]);
  
  return useQuery({
    queryKey,
    queryFn: () => WooCommerceAPI.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};