import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { QRCode, QRScan, QRBatch, QRStats, QRFilters, CreateQRBatchData, UpdateQRData, QRType, CreateMultipleQRsData } from '../../types/qr';

export const useQRCodes = (filters?: QRFilters) => {
  return useQuery({
    queryKey: ['qr-codes', filters],
    queryFn: async () => {
      try {
        // Verificar si hay una sesión activa antes de hacer la consulta
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn('No hay sesión activa al intentar obtener códigos QR');
          return [];
        }

        let query = supabase
          .from('qr_codes')
          .select(`
            *,
            pet:pets(*),
            owner:user_profiles(*),
            branch:branches(*)
          `)
          .order('created_at', { ascending: false });

        if (filters?.status) {
          query = query.eq('status', filters.status);
        }
        if (filters?.qr_type) {
          query = query.eq('qr_type', filters.qr_type);
        }
        if (filters?.owner_id) {
          query = query.eq('owner_id', filters.owner_id);
        }
        if (filters?.branch_id) {
          query = query.eq('sold_by_branch_id', filters.branch_id);
        }
        if (filters?.search) {
          query = query.or(`code.ilike.%${filters.search}%`);
        }
        if (filters?.date_from) {
          query = query.gte('created_at', filters.date_from);
        }
        if (filters?.date_to) {
          query = query.lte('created_at', filters.date_to);
        }

        const { data, error } = await query;
        if (error) {
          console.error('Error al obtener códigos QR:', error);
          throw error;
        }
        return data as QRCode[];
      } catch (error) {
        console.error('Error en useQRCodes:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
};

export const useQRCode = (id: string) => {
  return useQuery({
    queryKey: ['qr-code', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qr_codes')
        .select(`
          *,
          pet:pets(*),
          owner:user_profiles(*),
          branch:branches(*),
          scans:qr_scans(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as QRCode;
    },
    enabled: !!id,
  });
};

export const useQRCodeByCode = (code: string) => {
  return useQuery({
    queryKey: ['qr-code-by-code', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qr_codes')
        .select(`
          *,
          pet:pets(*),
          owner:user_profiles(*)
        `)
        .eq('code', code)
        .single();

      if (error) throw error;
      return data as QRCode;
    },
    enabled: !!code,
  });
};

export const useCreateQRBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchData: CreateQRBatchData) => {
      // Crear el batch
      const { data: batch, error: batchError } = await supabase
        .from('qr_batches')
        .insert([{
          batch_number: `BATCH-${Date.now()}`,
          quantity: batchData.quantity,
          qr_type: batchData.qr_type,
          branch_id: batchData.branch_id,
          notes: batchData.notes,
          status: 'pending'
        }])
        .select()
        .single();

      if (batchError) throw batchError;

      // Generar códigos QR
      const qrCodes = [];
      for (let i = 0; i < batchData.quantity; i++) {
        const code = `QR${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        qrCodes.push({
          code,
          qr_type: batchData.qr_type,
          sold_by_branch_id: batchData.branch_id,
          status: 'inactive',
          metadata: { batch_id: batch.id }
        });
      }

      const { data: createdQRs, error: qrError } = await supabase
        .from('qr_codes')
        .insert(qrCodes)
        .select();

      if (qrError) throw qrError;

      // Actualizar el batch como generado
      await supabase
        .from('qr_batches')
        .update({ 
          status: 'generated', 
          generated_at: new Date().toISOString() 
        })
        .eq('id', batch.id);

      return { batch, qr_codes: createdQRs };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      queryClient.invalidateQueries({ queryKey: ['qr-batches'] });
    },
  });
};

export const useUpdateQRCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateQRData }) => {
      const { data, error } = await supabase
        .from('qr_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as QRCode;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      queryClient.invalidateQueries({ queryKey: ['qr-code', data.id] });
    },
  });
};

export const useCreateMultipleQRs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMultipleQRsData) => {
      // Generar códigos QR
      const qrCodes = [];
      for (let i = 0; i < data.quantity; i++) {
        const code = `QR${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        qrCodes.push({
          code,
          qr_type: data.qr_type,
          sold_by_branch_id: data.branch_id,
          status: 'inactive',
          metadata: { notes: data.notes || '' }
        });
      }

      const { data: createdQRs, error: qrError } = await supabase
        .from('qr_codes')
        .insert(qrCodes)
        .select();

      if (qrError) throw qrError;

      return { qr_codes: createdQRs };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
    },
  });
};

export const useActivateQRCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      qr_id, 
      pet_id, 
      owner_id 
    }: { 
      qr_id: string; 
      pet_id: string; 
      owner_id: string; 
    }) => {
      const { data, error } = await supabase
        .from('qr_codes')
        .update({
          pet_id,
          owner_id,
          status: 'active',
          activation_date: new Date().toISOString()
        })
        .eq('id', qr_id)
        .select()
        .single();

      if (error) throw error;
      return data as QRCode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
    },
  });
};

export const useRecordQRScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scanData: {
      qr_code_id: string;
      scanner_ip?: string;
      scanner_user_agent?: string;
      scan_location?: string;
      contact_made?: boolean;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('qr_scans')
        .insert([{
          ...scanData,
          scan_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Actualizar contador de escaneos en el QR
      await supabase.rpc('increment_qr_scan_count', { 
        qr_id: scanData.qr_code_id 
      });

      return data as QRScan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      queryClient.invalidateQueries({ queryKey: ['qr-scans'] });
    },
  });
};

export const useQRStats = (filters?: { 
  owner_id?: string; 
  branch_id?: string; 
  date_from?: string; 
  date_to?: string; 
}) => {
  return useQuery({
    queryKey: ['qr-stats', filters],
    queryFn: async () => {
      // Esta función podría ser un RPC en Supabase para mejor performance
      const { data: qrCodes, error: qrError } = await supabase
        .from('qr_codes')
        .select('id, status, scan_count')
        .eq('owner_id', filters?.owner_id || '');

      if (qrError) throw qrError;

      const { data: recentScans, error: scansError } = await supabase
        .from('qr_scans')
        .select(`
          *,
          qr_code:qr_codes(code, pet:pets(name))
        `)
        .order('scan_date', { ascending: false })
        .limit(10);

      if (scansError) throw scansError;

      const stats: QRStats = {
        total_qrs: qrCodes.length,
        active_qrs: qrCodes.filter(qr => qr.status === 'active').length,
        inactive_qrs: qrCodes.filter(qr => qr.status === 'inactive').length,
        total_scans: qrCodes.reduce((sum, qr) => sum + qr.scan_count, 0),
        pets_found: qrCodes.filter(qr => qr.status === 'found').length,
        recent_scans: recentScans || []
      };

      return stats;
    },
  });
};

export const useQRBatches = (branchId?: string) => {
  return useQuery({
    queryKey: ['qr-batches', branchId],
    queryFn: async () => {
      try {
        // Verificar si hay una sesión activa antes de hacer la consulta
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn('No hay sesión activa al intentar obtener lotes de QR');
          return [];
        }

        let query = supabase
          .from('qr_batches')
          .select(`
            *,
            branch:branches(*)
          `)
          .order('created_at', { ascending: false });

        if (branchId) {
          query = query.eq('branch_id', branchId);
        }

        const { data, error } = await query;
        if (error) {
          console.error('Error al obtener lotes de QR:', error);
          throw error;
        }
        return data as QRBatch[];
      } catch (error) {
        console.error('Error en useQRBatches:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
};