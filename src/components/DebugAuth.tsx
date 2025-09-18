import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { User } from '@supabase/supabase-js';

// Definir interfaces para los tipos de datos
interface Profile {
  first_name: string | null;
  last_name: string | null;
  id: string;
}

interface Role {
  role_name: string;
  role_level: number;
}

interface AuthData {
  user: User;
  profile: Profile | null;
  roles: Role[];
  loading: boolean;
}

// Componente optimizado con React.memo para evitar renderizados innecesarios
export const DebugAuth: React.FC = React.memo(() => {
  // Solo mostrar en desarrollo y usar estado local para evitar refrescos constantes
  const isDev = import.meta.env.DEV;
  
  // Usar useCallback para evitar recrear funciones en cada renderizado
  const { user, profile, roles, loading } = useAuthContext();
  
  // Usar useRef para almacenar el último estado y evitar actualizaciones innecesarias
  const lastAuthDataRef = useRef<AuthData | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  
  // Contador de renderizados para debug
  const renderCount = useRef<number>(0);
  
  // Referencia para almacenar la última dependencyArray
  const lastDepsRef = useRef<Array<any>>([]);
  
  // Crear una dependencia estable para la actualización con useMemo
  const dependencyArray = useMemo((): Array<any> => {
    // Solo crear un nuevo array si los valores han cambiado realmente
    const newDeps = [
      user?.id,
      profile?.id,
      roles?.length || 0,
      loading
    ];
    
    // Comparar con el último estado para evitar actualizaciones innecesarias
    if (lastAuthDataRef.current?.user?.id === user?.id &&
        lastAuthDataRef.current?.profile?.id === profile?.id &&
        (lastAuthDataRef.current?.roles?.length || 0) === (roles?.length || 0) &&
        lastAuthDataRef.current?.loading === loading) {
      return lastDepsRef.current; // Reutilizar el array anterior si no hay cambios
    }
    
    // Actualizar la referencia con los nuevos deps
    lastDepsRef.current = newDeps;
    return newDeps;
  }, [user?.id, profile?.id, roles?.length, loading]);
  
  // Actualizar datos solo cuando cambian significativamente
  useEffect(() => {
    if (user) {
      // Evitar actualizaciones de estado si los datos son iguales
      const newAuthData: AuthData = { 
        user, 
        profile, 
        roles: roles || [], 
        loading 
      };
      lastAuthDataRef.current = newAuthData;
      setAuthData(newAuthData);
      
      // Log para debug
      console.log('DebugAuth: Actualizando authData', newAuthData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray);
  
  // Memoizar el contenido del perfil para evitar re-renderizados
  const profileContent = useMemo(() => {
    if (!authData?.profile) return 'No cargado';
    return `${authData?.profile?.first_name || ''} ${authData?.profile?.last_name || ''}`;
  }, [authData?.profile]);

  // Memoizar la lista de roles para evitar re-renderizados
  const rolesContent = useMemo(() => {
    if (!authData?.roles || authData?.roles.length === 0) {
      return <p className="ml-2 text-yellow-300">Sin roles cargados</p>;
    }
    
    return (
      <ul className="ml-2">
        {authData?.roles.map((role, i) => (
          <li key={i}>• {role?.role_name} (nivel {role?.role_level})</li>
        ))}
      </ul>
    );
  }, [authData?.roles]);
  
  // Usar useMemo para el componente completo para evitar re-renderizados innecesarios
  const debugComponent = useMemo(() => {
    if (!authData) return null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
        <h4 className="font-bold mb-2">🐛 Debug Auth</h4>
        <div className="space-y-1">
          <p><strong>Email:</strong> {authData.user.email}</p>
          <p><strong>Loading:</strong> {authData.loading ? 'Sí' : 'No'}</p>
          <p><strong>Profile:</strong> {profileContent}</p>
          <p><strong>Renders:</strong> {renderCount.current}</p>
          <p><strong>Roles:</strong></p>
          {rolesContent}
        </div>
      </div>
    );
  }, [authData, profileContent, rolesContent]);
  
  // Incrementar contador de renderizados
  renderCount.current++;
  
  // Registrar renderizados en consola solo en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`DebugAuth renderizado #${renderCount.current}`);
    }
  }, []);
  
  // No mostrar en producción o si no hay usuario
  if (!isDev || !user || !authData) return null;
  
  return debugComponent;
});