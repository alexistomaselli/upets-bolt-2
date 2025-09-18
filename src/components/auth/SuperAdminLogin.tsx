import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';

export const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, user, isSuperAdmin } = useAuthContext();

  // Si ya está logueado y es super admin, redirigir al dashboard
  useEffect(() => {
    if (user && isSuperAdmin()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isSuperAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else if (data?.user) {
        // Esperar un momento para que se carguen los roles
        setTimeout(() => {
          // Verificar si es super admin después del login
          if (isSuperAdmin()) {
            navigate('/admin/dashboard', { replace: true });
          } else {
            setError('Acceso denegado. Solo super administradores pueden acceder.');
          }
        }, 1000);
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Super Admin
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Acceso restringido al panel de administración
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                  placeholder="admin@afpets.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verificando acceso...
              </div>
            ) : (
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Acceder como Super Admin
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};