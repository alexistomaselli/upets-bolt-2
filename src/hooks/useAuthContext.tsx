import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

// Hook personalizado para usar el contexto de autenticación
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
}