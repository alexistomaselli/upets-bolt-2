import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  environment: 'local' | 'remote';
}

interface SupabaseConfigContextType {
  config: SupabaseConfig;
  supabaseClient: SupabaseClient;
  setEnvironment: (env: 'local' | 'remote') => void;
  isLocal: boolean;
}

// Valores por defecto (remoto)
const defaultRemoteConfig: SupabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  environment: 'remote'
};

// Valores para entorno local
const localConfig: SupabaseConfig = {
  url: 'http://localhost:54321', // Puerto por defecto de Supabase local
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0', // Clave anónima por defecto de Supabase local
  environment: 'local'
};

// Crear el contexto
const SupabaseConfigContext = createContext<SupabaseConfigContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useSupabaseConfig = () => {
  const context = useContext(SupabaseConfigContext);
  if (!context) {
    throw new Error('useSupabaseConfig debe ser usado dentro de un SupabaseConfigProvider');
  }
  return context;
};

interface SupabaseConfigProviderProps {
  children: ReactNode;
}

export const SupabaseConfigProvider: React.FC<SupabaseConfigProviderProps> = ({ children }) => {
  // Recuperar la configuración guardada en localStorage o usar la remota por defecto
  const getSavedConfig = (): SupabaseConfig => {
    try {
      const savedEnv = localStorage.getItem('supabase_environment');
      if (savedEnv === 'local') {
        return localConfig;
      }
    } catch (error) {
      console.error('Error al leer la configuración de Supabase:', error);
    }
    return defaultRemoteConfig;
  };

  const [config, setConfig] = useState<SupabaseConfig>(getSavedConfig());
  const [supabaseClient, setSupabaseClient] = useState(() => 
    createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'afpets_auth_token',
        storage: {
          getItem: (key) => {
            try {
              return localStorage.getItem(key);
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
    })
  );

  // Función para cambiar entre entornos
  const setEnvironment = (env: 'local' | 'remote') => {
    const newConfig = env === 'local' ? localConfig : defaultRemoteConfig;
    
    // Guardar la preferencia en localStorage
    try {
      localStorage.setItem('supabase_environment', env);
    } catch (error) {
      console.error('Error al guardar la configuración de Supabase:', error);
    }
    
    // Actualizar el estado
    setConfig(newConfig);
    
    // Crear un nuevo cliente con la nueva configuración
    const newClient = createClient(newConfig.url, newConfig.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'afpets_auth_token',
        storage: {
          getItem: (key) => {
            try {
              return localStorage.getItem(key);
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
    
    setSupabaseClient(newClient);
    
    // Recargar la página para aplicar los cambios
    window.location.reload();
  };

  return (
    <SupabaseConfigContext.Provider 
      value={{
        config,
        supabaseClient,
        setEnvironment,
        isLocal: config.environment === 'local'
      }}
    >
      {children}
    </SupabaseConfigContext.Provider>
  );
};