import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { AFPetsLogo } from '../AFPetsLogo';
import { useCart } from '../../hooks/useCart';
import { useAuthContext } from '../../hooks/useAuthContext';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { cart } = useCart();
  const { user, profile, signOut, isSuperAdmin, isCompanyAdmin, isBranchAdmin } = useAuthContext();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Tienda', href: '/tienda' },
    { name: 'IA Veterinaria', href: '/whatsapp' },
    { name: 'Roadmap', href: '/roadmap' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <AFPetsLogo className="h-9 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart - Always visible */}
            <Link
              to="/carrito"
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.item_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.item_count}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:block relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-green-600 transition-colors">
                  <User className="h-6 w-6" />
                  <span className="hidden md:block text-sm font-medium">
                    {profile?.first_name || 'Usuario'}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link
                      to="/mi-cuenta"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Mi Cuenta
                    </Link>
                    
                    {(isSuperAdmin() || isCompanyAdmin() || isBranchAdmin()) && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Administración
                      </Link>
                    )}
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Links */}
            {!user ? (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-green-600 hover:text-green-700 hover:bg-gray-50 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  to="/mi-cuenta"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-5 w-5 mr-3" />
                  Mi Cuenta
                </Link>
                {(isSuperAdmin() || isCompanyAdmin() || isBranchAdmin()) && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Administración
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};