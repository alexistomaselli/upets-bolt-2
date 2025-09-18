import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserRole, AuthState } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../hooks/useAuthContext';

// Constante para el mensaje de error
const ERROR_MESSAGE = 'useAuthContext debe ser usado dentro de un AuthProvider';

// Interfaz para el contexto de autenticación
export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, userData?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data?: any; error?: any }>;
  hasRole: (roleName: string) => boolean;
  hasMinimumRole: (minimumLevel: number) => boolean;
  hasPermission: (resource: string, action: string) => Promise<boolean>;
  isSuperAdmin: () => boolean;
  isCompanyAdmin: () => boolean;
  isBranchAdmin: () => boolean;
  isCustomer: () => boolean;
  loadUserData: () => Promise<void>;
}

// Crear el contexto con un valor inicial
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto con la lógica de autenticación implementada directamente
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    roles: [],
    session: null,
    loading: true,
  });

  // Cargar la sesión inicial
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: false,
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Error al obtener la sesión inicial:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: false,
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            user: null,
            profile: null,
            roles: [],
            session: null,
            loading: false,
          }));
        }
      }
    );

    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funciones de autenticación básicas
  const signUp = async (email: string, password: string, userData?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({
        ...prev,
        user: null,
        profile: null,
        roles: [],
        session: null,
      }));
      
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        window.location.href = '/';
      }
      
      return { error };
    } catch (e) {
      console.error('Error durante el cierre de sesión:', e);
      window.location.href = '/';
      return { error: e };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) return { error: new Error('No user logged in') };

    // Tipado explícito para evitar errores de TypeScript
    type ProfileUpdate = Record<string, any>;
    
    const { data, error } = await (supabase
      .from as any)('user_profiles')
      .update(updates as ProfileUpdate)
      .eq('user_id', authState.user.id)
      .select()
      .single();

    if (!error && data) {
      setAuthState(prev => ({
        ...prev,
        profile: data,
      }));
    }

    return { data, error };
  };

  // Funciones de verificación de roles
  const hasRole = (roleName: string): boolean => {
    return authState.roles.some((role: UserRole) => role.role_name === roleName);
  };

  const hasMinimumRole = (minimumLevel: number): boolean => {
    return authState.roles.some((role: UserRole) => role.role_level >= minimumLevel);
  };

  const hasPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      // Definir el tipo de los parámetros para la función RPC
      interface PermissionParams {
        user_uuid: string;
        resource_name: string;
        action_name: string;
      }
      
      const params: PermissionParams = {
        user_uuid: authState.user.id,
        resource_name: resource,
        action_name: action,
      };
      
      const { data, error } = await (supabase
        .rpc as any)('user_has_permission', params);

      if (error) {
        console.error('Error checking permission:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('super_admin');
  };

  const isCompanyAdmin = (): boolean => {
    return hasRole('company_admin');
  };

  const isBranchAdmin = (): boolean => {
    return hasRole('branch_admin');
  };

  const isCustomer = (): boolean => {
    return hasRole('customer');
  };

  // Implementación completa de loadUserData para cargar perfil y roles
  const loadUserData = async (): Promise<void> => {
    if (!authState.user) return;
    
    try {
      // Cargar perfil de usuario
      const { data: profile, error: profileError } = await (supabase
        .from as any)('user_profiles')
        .select('*')
        .eq('user_id', authState.user.id)
        .single();
        
      if (profileError) {
        console.error('Error al cargar el perfil:', profileError);
      }
      
      // Cargar roles de usuario
      const { data: roles, error: rolesError } = await (supabase
        .from as any)('user_roles')
        .select('*, roles(role_name, role_level)')
        .eq('user_id', authState.user.id);
        
      if (rolesError) {
        console.error('Error al cargar roles:', rolesError);
      }
      
      // Formatear roles para el estado
      const formattedRoles = roles?.map((userRole: any) => ({
        role_id: userRole.roles.id,
        role_name: userRole.roles.role_name,
        role_level: userRole.roles.role_level,
      })) || [];
      
      // Actualizar estado
      setAuthState(prev => ({
        ...prev,
        profile: profile || null,
        roles: formattedRoles,
      }));
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  const auth: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasRole,
    hasMinimumRole,
    hasPermission,
    isSuperAdmin,
    isCompanyAdmin,
    isBranchAdmin,
    isCustomer,
    loadUserData,
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// El hook useAuthContext se ha movido a un archivo separado en src/hooks/useAuthContext.tsx

// Componente para proteger rutas basadas en roles
// Exportar como función nombrada para compatibilidad con Fast Refresh
export function withRoleProtection(
  Component: React.ComponentType,
  requiredRole?: string,
  minimumLevel?: number
) {
  // Definir un nombre para el componente para mejorar la depuración
  function ProtectedRoute(props: any) {
    // Usar el hook importado correctamente
    const { user, loading, hasRole, hasMinimumRole } = useAuthContext();

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando acceso...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      // Redirigir según el rol requerido
      if (requiredRole === 'super_admin') {
        window.location.href = '/admin/login';
        return null;
      } else {
        window.location.href = '/login';
        return null;
      }
    }

    // Verificar rol específico
    if (requiredRole && !hasRole(requiredRole)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }

    // Verificar nivel mínimo
    if (minimumLevel !== undefined && !hasMinimumRole(minimumLevel)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">No tienes el nivel de permisos necesario.</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  }
  
  // Asignar un nombre para mostrar para mejorar la depuración
  ProtectedRoute.displayName = `withRoleProtection(${Component.displayName || Component.name || 'Component'})`;
  
  // Devolver el componente protegido
  return ProtectedRoute;
}