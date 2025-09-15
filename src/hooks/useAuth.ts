import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
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
}

export interface UserRole {
  role_name: string;
  role_level: number;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  roles: UserRole[];
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    roles: [],
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserData(session.user);
      }
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user || null,
        loading: false,
      }));
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          await loadUserData(session.user);
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
        
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
          loading: false,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (user: User) => {
    try {
      console.log('🔄 Cargando datos del usuario:', user.email);
      
      // Cargar perfil del usuario
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      }

      // Cargar roles del usuario
      console.log('🔄 Cargando roles para usuario ID:', user.id);
      
      // Primero intentar con la función RPC
      let roles = null;
      const { data: rolesRPC, error: rolesRPCError } = await supabase
        .rpc('get_user_roles', { user_uuid: user.id });
      
      if (rolesRPCError) {
        console.error('❌ Error con RPC get_user_roles:', rolesRPCError);
        
        // Fallback: consulta directa a las tablas
        console.log('🔄 Intentando consulta directa...');
        const { data: rolesDirect, error: rolesDirectError } = await supabase
          .from('user_roles')
          .select(`
            roles!inner(name, level)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);
        
        if (rolesDirectError) {
          console.error('❌ Error con consulta directa:', rolesDirectError);
          roles = [];
        } else {
          console.log('✅ Roles obtenidos con consulta directa:', rolesDirect);
          roles = rolesDirect?.map(ur => ({
            role_name: ur.roles.name,
            role_level: ur.roles.level
          })) || [];
        }
      } else {
        console.log('✅ Roles obtenidos con RPC:', rolesRPC);
        roles = rolesRPC || [];
      }

      console.log('🎭 Roles finales asignados:', roles);

      setAuthState(prev => ({
        ...prev,
        profile: profile || null,
        roles: roles,
      }));
    } catch (error) {
      console.error('Error loading user data:', error);
      // En caso de error, al menos marcar como no loading
      setAuthState(prev => ({
        ...prev,
        profile: null,
        roles: [],
      }));
    }
  };

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
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
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

  const hasRole = (roleName: string): boolean => {
    return authState.roles.some(role => role.role_name === roleName);
  };

  const hasMinimumRole = (minimumLevel: number): boolean => {
    return authState.roles.some(role => role.role_level >= minimumLevel);
  };

  const hasPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const { data, error } = await supabase
        .rpc('user_has_permission', {
          user_uuid: authState.user.id,
          resource_name: resource,
          action_name: action,
        });

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

  return {
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
    loadUserData: () => authState.user ? loadUserData(authState.user) : Promise.resolve(),
  };
};