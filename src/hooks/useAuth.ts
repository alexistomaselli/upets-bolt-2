import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Función para evitar llamadas repetidas
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

// Cache global para roles y perfiles para evitar consultas repetidas
const rolesCache = new Map<string, {roles: UserRole[], timestamp: number}>();
const profilesCache = new Map<string, {profile: UserProfile | null, timestamp: number}>();

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
  // Usar useRef para el estado inicial para evitar recreaciones
  const initialState = useRef<AuthState>({
    user: null,
    profile: null,
    roles: [],
    session: null,
    loading: true,
  });
  
  const [authState, setAuthState] = useState<AuthState>(initialState.current);

  // Referencia para evitar procesamiento duplicado
  const processedEvents = useRef(new Set());
  const lastEventTimestamp = useRef(0);
  const isInitialLoadDone = useRef(false);
  const pendingStateUpdates = useRef<Partial<AuthState> | null>(null);
  
  useEffect(() => {
    // Evitar múltiples inicializaciones
    if (isInitialLoadDone.current) {
      console.log('Sesión inicial ya cargada, omitiendo inicialización');
      return;
    }
    
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        // Establecer un timeout para evitar que la carga se quede indefinidamente
        const timeoutId = setTimeout(() => {
          console.warn('Timeout al cargar la sesión inicial');
          setAuthState(prev => ({
            ...prev,
            loading: false,
          }));
        }, 5000); // 5 segundos máximo para cargar la sesión
        
        const { data: { session } } = await supabase.auth.getSession();
        
        // Limpiar el timeout ya que la operación completó
        clearTimeout(timeoutId);
        
        if (session?.user) {
          // Cargar datos del usuario con un timeout de seguridad
          try {
            const userDataPromise = loadUserData(session.user);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout al cargar datos del usuario')), 3000)
            );
            
            await Promise.race([userDataPromise, timeoutPromise]).catch(err => {
              console.warn('Error o timeout al cargar datos del usuario:', err.message);
            });
          } catch (userDataError) {
            console.error('Error al cargar datos del usuario:', userDataError);
          } finally {
            // Siempre establecer el estado, incluso si hubo error al cargar datos adicionales
            setAuthState(prev => ({
              ...prev,
              session,
              user: session.user,
              loading: false,
            }));
          }
        } else {
          // No hay sesión, establecer loading a false
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Error al obtener la sesión inicial:', error);
        // En caso de error, asegurarse de que loading sea false
        setAuthState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Función debounced para procesar cambios de autenticación
    const processAuthChange = debounce(async (event: string, session: Session | null) => {
      // Ignorar eventos que no requieren actualización
      if (['TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
        console.log(`Ignorando evento ${event} para evitar renderizados innecesarios`);
        return;
      }
      
      // Ignorar eventos SIGNED_IN duplicados si ya tenemos una sesión
      if (event === 'SIGNED_IN' && authState.session?.user?.id === session?.user?.id) {
        console.log('Ignorando evento SIGNED_IN duplicado para el mismo usuario');
        return;
      }
      
      // Evitar procesar el mismo evento en un corto período de tiempo
      const now = Date.now();
      const eventKey = `${event}-${session?.user?.id || 'no-user'}-${Math.floor(now / 1000)}`;
      
      // Si ya procesamos este evento en los últimos 2 segundos, ignorarlo
      if (processedEvents.current.has(eventKey) || (now - lastEventTimestamp.current < 2000)) {
        console.log('Evento ignorado por debounce:', event);
        return;
      }
      
      // Registrar este evento como procesado
      processedEvents.current.add(eventKey);
      lastEventTimestamp.current = now;
      
      // Limpiar eventos antiguos (más de 5 segundos)
      setTimeout(() => {
        processedEvents.current.delete(eventKey);
      }, 5000);
      
      console.log('Auth state changed (debounced):', event, session?.user?.email);
      
      // Establecer un timeout para evitar que la carga se quede indefinidamente
      const timeoutId = setTimeout(() => {
        console.warn('Timeout en onAuthStateChange');
        setAuthState(prev => ({
          ...prev,
          loading: false,
        }));
      }, 5000); // 5 segundos máximo para procesar el cambio de estado
      
      try {
        if (session?.user) {
          // Establecer loading a true mientras se cargan los datos
          setAuthState(prev => ({
            ...prev,
            loading: true,
          }));
          
          // Cargar datos del usuario con un timeout de seguridad
          try {
            const userDataPromise = loadUserData(session.user);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout al cargar datos del usuario')), 3000)
            );
            
            await Promise.race([userDataPromise, timeoutPromise]).catch(err => {
              console.warn('Error o timeout al cargar datos del usuario en onAuthStateChange:', err.message);
            });
          } catch (userDataError) {
            console.error('Error al cargar datos del usuario en onAuthStateChange:', userDataError);
          } finally {
            // Siempre establecer el estado, incluso si hubo error al cargar datos adicionales
            setAuthState(prev => ({
              ...prev,
              session,
              user: session.user,
              loading: false,
            }));
          }
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
      } catch (error) {
        console.error('Error en onAuthStateChange:', error);
        // En caso de error, asegurarse de que loading sea false
        setAuthState(prev => ({
          ...prev,
          loading: false,
        }));
      } finally {
        // Limpiar el timeout ya que la operación completó
        clearTimeout(timeoutId);
      }
    }, 500); // Debounce de 500ms
    
    // Escuchar cambios de autenticación
    // Usar una referencia para la suscripción para evitar múltiples suscripciones
    const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
    
    // Solo suscribirse si no hay una suscripción activa
    if (!authSubscriptionRef.current) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          // Solo registrar el evento en la consola
          console.log('Auth state changed (raw):', event, session?.user?.email);
          
          // Procesar el cambio con debounce
          processAuthChange(event, session);
        }
      );
      
      // Guardar la referencia a la suscripción
      authSubscriptionRef.current = subscription;
    }

    // Limpiar suscripción al desmontar
    return () => {
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe();
        authSubscriptionRef.current = null;
      }
    };
  }, []);

  // Usar una referencia para evitar cargas duplicadas del mismo usuario
  const loadingUserIds = useRef(new Set<string>());
  
  const loadUserData = async (user: User) => {
    try {
      // Evitar cargar datos del mismo usuario simultáneamente
      if (loadingUserIds.current.has(user.id)) {
        console.log('⚠️ Ya se están cargando datos para el usuario:', user.email);
        return;
      }
      
      // Marcar este usuario como en proceso de carga
      loadingUserIds.current.add(user.id);
      
      console.log('🔄 Cargando datos del usuario:', user.email);
      
      // Reducir el timeout a 5 segundos para evitar esperas largas
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout al cargar datos del usuario'));
        }, 5000); // 5 segundos de timeout
      });
      
      // Función para cargar el perfil
      const loadProfile = async () => {
        try {
          // Verificar si ya tenemos el perfil en caché
          const profileCache = new Map<string, {profile: UserProfile | null, timestamp: number}>();
          const cachedData = profileCache.get(user.id);
          const now = Date.now();
          
          if (cachedData && (now - cachedData.timestamp < 120000)) {
            console.log('👤 Usando perfil en caché para usuario ID:', user.id);
            return cachedData.profile;
          }
          
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
  
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error loading profile:', profileError);
          } else {
            // Guardar en caché
            profileCache.set(user.id, {profile, timestamp: now});
          }
          
          return profile;
        } catch (error) {
          console.error('Error inesperado al cargar perfil:', error);
          return null;
        }
      };
      
      // Usar el cache global de roles
      
      // Función para cargar roles con cache
      const loadRoles = async () => {
        // Verificar si tenemos roles en cache y si son recientes (menos de 2 minutos)
        const cachedData = rolesCache.get(user.id);
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < 120000)) {
          console.log('🔄 Usando roles en caché para usuario ID:', user.id);
          return cachedData.roles;
        }
        
        console.log('🔄 Cargando roles para usuario ID:', user.id);
        
        try {
          // Intentar con la función RPC primero con un timeout más corto
          console.log('🔄 Intentando con función RPC get_user_roles...');
          
          // Usar AbortController para limitar el tiempo de la petición
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          
          try {
            const { data: rolesRPC, error: rolesRPCError } = await (supabase
              .rpc as any)('get_user_roles', { user_uuid: user.id }, { signal: controller.signal });
            
            clearTimeout(timeoutId);
            
            if (rolesRPCError) {
              throw rolesRPCError;
            }
            
            // Transformar y guardar en cache
            const roles: UserRole[] = rolesRPC || [];
            
            // Guardar en cache
            rolesCache.set(user.id, {roles, timestamp: now});
            
            return roles;
          } catch (rpcError) {
            console.error('❌ Error con RPC get_user_roles:', rpcError);
            
            // Fallback: consulta directa a las tablas con timeout más corto
            console.log('🔄 Fallback: consulta directa a user_roles...');
            
            const fallbackController = new AbortController();
            const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 2000);
            
            try {
              const { data: rolesDirect, error: rolesDirectError } = await supabase
                .from('user_roles')
                .select(`
                  role_id,
                  roles!inner(
                    name,
                    level
                  )
                `)
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('roles.level', { ascending: false });
              
              clearTimeout(fallbackTimeoutId);
              
              if (rolesDirectError) {
                console.error('❌ Error con consulta directa:', rolesDirectError.message);
                return [];
              }
              // Transformar y guardar en cache
              const roles = (rolesDirect || []).map((ur: { roles: { name: string; level: number } }) => ({
                role_name: ur.roles.name,
                role_level: ur.roles.level
              })) || [];
              
              // Guardar en cache
              rolesCache.set(user.id, {roles, timestamp: now});
              
              return roles;
            } catch (directError) {
              console.error('Error en consulta directa:', directError);
              return [];
            }
          }
        } catch (error) {
          console.error('Error al cargar roles:', error);
          return [];
        }
      };
      
      // Ejecutar ambas operaciones con un timeout
      const [profile, roles] = await Promise.race([
        Promise.all([loadProfile(), loadRoles()]),
        timeoutPromise.then(() => {
          throw new Error('Timeout al cargar datos del usuario');
        })
      ]) as [any, UserRole[]];

      console.log('🎭 Roles finales asignados:', roles);
      
      // Marcar que la carga inicial se ha completado
      isInitialLoadDone.current = true;
      
      // Usar una sola actualización de estado para evitar renderizados múltiples
      setAuthState(prev => {
        // Verificar si realmente hay cambios para evitar actualizaciones innecesarias
        const profileChanged = JSON.stringify(prev.profile) !== JSON.stringify(profile);
        const rolesChanged = JSON.stringify(prev.roles) !== JSON.stringify(roles);
        
        // Si no hay cambios y loading ya es false, no actualizar el estado
        if (!profileChanged && !rolesChanged && !prev.loading) {
          console.log('⚡ No hay cambios en el estado, evitando actualización');
          return prev;
        }
        
        return {
          ...prev,
          profile: profile as UserProfile | null,
          roles: roles || [],
          loading: false, // Asegurarse de que loading sea false
        };
      });
      
      // Si es admin, mostrar mensaje de debug
      const isAdmin = roles.some((role: UserRole) => 
        ['super_admin', 'company_admin', 'branch_admin'].includes(role.role_name)
      );
      
      if (isAdmin) {
        console.log('🔑 Usuario es administrador, roles:', roles.map((r: UserRole) => r.role_name));
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      // En caso de error, establecer un estado mínimo válido y loading a false
      setAuthState(prev => ({
        ...prev,
        profile: null,
        roles: [],
        loading: false, // Importante: asegurarse de que loading sea false
      }));
    } finally {
      // Siempre eliminar el usuario de la lista de carga en curso
      loadingUserIds.current.delete(user.id);
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
    try {
      // Limpiar el estado de autenticación antes de hacer signOut
      setAuthState(prev => ({
        ...prev,
        user: null,
        profile: null,
        roles: [],
        session: null,
      }));
      
      // Limpiar localStorage para evitar problemas de sesión
      localStorage.removeItem('supabase.auth.token');
      
      // Realizar el signOut de Supabase
      const { error } = await supabase.auth.signOut();
      
      // Forzar recarga de la página para asegurar que todo se reinicie correctamente
      if (!error) {
        window.location.href = '/';
      }
      
      return { error };
    } catch (e) {
      console.error('Error durante el cierre de sesión:', e);
      // En caso de error, forzar recarga de todos modos
      window.location.href = '/';
      return { error: e };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) return { error: new Error('No user logged in') };

    const { data, error } = await (supabase
      .from as any)('user_profiles')
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

    // Caché para resultados de verificación de roles
  const roleCheckCache = useRef<Record<string, boolean>>({});
  
  const hasRole = (roleName: string): boolean => {
    // Crear una clave única para esta verificación
    const cacheKey = `role-${roleName}`;
    
    // Si ya tenemos un resultado en caché y los roles no han cambiado, devolver el resultado en caché
    if (cacheKey in roleCheckCache.current) {
      return roleCheckCache.current[cacheKey];
    }
    
    // Calcular el resultado
    const result = authState.roles.some((role: UserRole) => role.role_name === roleName);
    
    // Almacenar en caché
    roleCheckCache.current[cacheKey] = result;
    
    return result;
  };

  // Caché para resultados de verificación de nivel de rol
  const roleLevelCheckCache = useRef<Record<string, boolean>>({});
  
  const hasMinimumRole = (minimumLevel: number): boolean => {
    // Crear una clave única para esta verificación
    const cacheKey = `level-${minimumLevel}`;
    
    // Si ya tenemos un resultado en caché y los roles no han cambiado, devolver el resultado en caché
    if (cacheKey in roleLevelCheckCache.current) {
      return roleLevelCheckCache.current[cacheKey];
    }
    
    // Calcular el resultado
    const result = authState.roles.some((role: UserRole) => role.role_level >= minimumLevel);
    
    // Almacenar en caché
    roleLevelCheckCache.current[cacheKey] = result;
    
    return result;
  };

  // Caché para resultados de verificación de permisos
  const permissionCheckCache = useRef<Record<string, boolean>>({});
  
  const hasPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!authState.user) return false;

    // Crear una clave única para esta verificación
    const cacheKey = `perm-${resource}-${action}`;
    
    // Si ya tenemos un resultado en caché y los roles no han cambiado, devolver el resultado en caché
    if (cacheKey in permissionCheckCache.current) {
      return permissionCheckCache.current[cacheKey];
    }

    try {
      const { data, error } = await (supabase
        .rpc as any)('user_has_permission', {
          user_uuid: authState.user.id,
          resource_name: resource,
          action_name: action,
        });

      if (error) {
        console.error('Error checking permission:', error);
        return false;
      }
      
      // Almacenar en caché
      const result = data || false;
      permissionCheckCache.current[cacheKey] = result;

      return result;
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

  // Limpiar todos los cachés cuando cambia el estado de autenticación
  useEffect(() => {
    // Limpiar el caché cuando cambian los roles
    roleCheckCache.current = {};
    roleLevelCheckCache.current = {};
    permissionCheckCache.current = {};
  }, [authState.roles]);

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