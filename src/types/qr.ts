export interface QRCode {
  id: string;
  code: string;
  pet_id: string | null;
  owner_id: string | null;
  qr_type: 'basic' | 'premium' | 'institutional';
  status: 'inactive' | 'active' | 'lost' | 'found' | 'expired';
  activation_date: string | null;
  expiry_date: string | null;
  scan_count: number;
  last_scan_date: string | null;
  last_scan_location: string | null;
  purchase_date: string;
  purchase_price: number | null;
  sold_by_branch_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  pet?: Pet;
  owner?: UserProfile;
  branch?: Branch;
  scans?: QRScan[];
}

export interface QRScan {
  id: string;
  qr_code_id: string;
  scanner_ip: string | null;
  scanner_user_agent: string | null;
  scan_location: string | null;
  scan_date: string;
  contact_made: boolean;
  notes: string | null;
  
  // Relaciones
  qr_code?: QRCode;
}

export interface QRBatch {
  id: string;
  batch_number: string;
  quantity: number;
  qr_type: 'basic' | 'premium' | 'institutional';
  price_per_unit: number;
  total_amount: number;
  branch_id: string | null;
  created_by: string;
  status: 'pending' | 'generated' | 'delivered' | 'cancelled';
  generated_at: string | null;
  delivered_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  qr_codes?: QRCode[];
  branch?: Branch;
  created_by_user?: UserProfile;
}

export interface QRStats {
  total_qrs: number;
  active_qrs: number;
  inactive_qrs: number;
  total_scans: number;
  pets_found: number;
  recent_scans: QRScan[];
}

export type QRType = 'basic' | 'premium' | 'institutional';
export type QRStatus = 'inactive' | 'active' | 'lost' | 'found' | 'expired';
export type QRBatchStatus = 'pending' | 'generated' | 'delivered' | 'cancelled';

// Interfaces para formularios
export interface CreateQRBatchData {
  quantity: number;
  qr_type: QRType;
  price_per_unit: number;
  branch_id?: string;
  notes?: string;
}

export interface UpdateQRData {
  pet_id?: string | null;
  owner_id?: string | null;
  status?: QRStatus;
  metadata?: Record<string, any>;
}

export interface QRFilters {
  status?: QRStatus;
  qr_type?: QRType;
  owner_id?: string;
  branch_id?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

// Para el sistema de escaneo público
export interface PublicQRData {
  pet_name: string;
  pet_photo?: string;
  owner_name: string;
  owner_phone: string;
  owner_whatsapp?: string;
  emergency_contact?: {
    name: string;
    phone: string;
  };
  medical_info?: string;
  reward_offered?: boolean;
  reward_amount?: number;
  last_seen_location?: string;
  additional_notes?: string;
}