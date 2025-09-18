import React from 'react';
import { switchSupabaseEnvironment } from '../../lib/supabase';
import { Cloud, Database } from 'lucide-react';

const SupabaseEnvironmentSwitch: React.FC = () => {
  // Verificar el entorno actual
  const [isLocal, setIsLocal] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('supabase_environment') === 'local';
    } catch (error) {
      return false;
    }
  });

  const handleToggle = () => {
    const newEnvironment = isLocal ? 'remote' : 'local';
    switchSupabaseEnvironment(newEnvironment);
    setIsLocal(!isLocal);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Entorno actual:</p>
          <p className={`font-bold ${isLocal ? 'text-amber-600' : 'text-blue-600'}`}>
            {isLocal ? 'LOCAL' : 'REMOTO'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${!isLocal ? 'font-medium' : 'text-gray-500'}`}>Remoto</span>
          <button 
            onClick={handleToggle}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <span 
              className={`${isLocal ? 'bg-amber-600' : 'bg-blue-600'} inline-block h-6 w-11 rounded-full transition-colors`}
            />
            <span 
              className={`${isLocal ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          <span className={`text-sm ${isLocal ? 'font-medium' : 'text-gray-500'}`}>Local</span>
        </div>
      </div>
      
      <div className="flex justify-between gap-4 mt-4">
        <button 
          className={`flex items-center justify-center px-4 py-2 rounded-lg ${isLocal 
            ? 'bg-amber-600 text-white' 
            : 'border border-amber-600 text-amber-600 hover:bg-amber-50'} ${isLocal ? 'opacity-50 cursor-not-allowed' : ''} flex-1`}
          onClick={() => !isLocal && switchSupabaseEnvironment('local')}
          disabled={isLocal}
        >
          <Database className="h-4 w-4 mr-2" />
          Usar Supabase Local
        </button>
        
        <button 
          className={`flex items-center justify-center px-4 py-2 rounded-lg ${!isLocal 
            ? 'bg-blue-600 text-white' 
            : 'border border-blue-600 text-blue-600 hover:bg-blue-50'} ${!isLocal ? 'opacity-50 cursor-not-allowed' : ''} flex-1`}
          onClick={() => isLocal && switchSupabaseEnvironment('remote')}
          disabled={!isLocal}
        >
          <Cloud className="h-4 w-4 mr-2" />
          Usar Supabase Remoto
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        {isLocal 
          ? 'Conectado a http://localhost:54321 - Asegúrate de que Supabase esté ejecutándose localmente.'
          : 'Conectado a la instancia remota de Supabase configurada en las variables de entorno.'}
      </p>
    </div>
  );
};

export default SupabaseEnvironmentSwitch;