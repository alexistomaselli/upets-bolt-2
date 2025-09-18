import { createClient } from '@supabase/supabase-js';

// Valores por defecto (remoto)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Verificar si hay una configuración guardada en localStorage
let activeUrl = supabaseUrl;
let activeKey = supabaseAnonKey;

try {
  const savedEnv = localStorage.getItem('supabase_environment');
  if (savedEnv === 'local') {
    activeUrl = 'http://localhost:54321';
    activeKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    console.log('🔧 Usando Supabase LOCAL');
  } else {
    console.log('🌐 Usando Supabase REMOTO');
  }
} catch (error) {
  console.error('Error al leer la configuración de Supabase:', error);
}

// Crear una única instancia global de Supabase para evitar múltiples GoTrueClient
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Función para obtener la instancia de Supabase (singleton)
const getSupabaseInstance = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(activeUrl, activeKey, {
  auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'afpets_auth_token',
      storage: {
        getItem: (key) => {
          try {
            const value = localStorage.getItem(key);
            return value;
          } catch (error) {
            console.error('Error al obtener el token de autenticación:', error);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch (error) {
            console.error('Error al guardar el token de autenticación:', error);
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error('Error al eliminar el token de autenticación:', error);
          }
        }
      }
    }
  });
  }
  return supabaseInstance;
};

// Exportar la instancia singleton
export const supabase = getSupabaseInstance();

// Función para cambiar entre entornos (se usará desde el componente de configuración)
export const switchSupabaseEnvironment = (env: 'local' | 'remote') => {
  try {
    localStorage.setItem('supabase_environment', env);
    console.log(`🔄 Cambiando a entorno ${env.toUpperCase()}`);
    
    // Resetear la instancia para que se cree una nueva con la nueva configuración
    supabaseInstance = null;
    
    // Recargar la página para aplicar los cambios
    window.location.reload();
  } catch (error) {
    console.error('Error al cambiar el entorno de Supabase:', error);
  }
};

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          level: number;
          is_system: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          level?: number;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          level?: number;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      permissions: {
        Row: {
          id: string;
          resource: string;
          action: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource: string;
          action: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resource?: string;
          action?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          company_id: string | null;
          branch_id: string | null;
          metadata: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          company_id?: string | null;
          branch_id?: string | null;
          metadata?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          company_id?: string | null;
          branch_id?: string | null;
          metadata?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          granted_by: string | null;
          granted_at: string;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_id: string;
          granted_by?: string | null;
          granted_at?: string;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          role_id?: string;
          granted_by?: string | null;
          granted_at?: string;
          expires_at?: string | null;
          is_active?: boolean;
        };
      };
    };
    Functions: {
      get_user_roles: {
        Args: { user_uuid: string };
        Returns: { role_name: string; role_level: number }[];
      };
      user_has_permission: {
        Args: { user_uuid: string; resource_name: string; action_name: string };
        Returns: boolean;
      };
    };
  };
};