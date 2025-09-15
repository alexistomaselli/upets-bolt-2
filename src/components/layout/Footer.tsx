import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { AFPetsLogo } from './AFPetsLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <AFPetsLogo className="h-10 w-auto" />
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Tecnología para mantener seguras a las mascotas que amás. 
              QR inteligentes + IA veterinaria por WhatsApp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <ul className="space-y-2">
              <li><Link to="/tienda" className="text-gray-400 hover:text-white transition-colors">Colgantes QR</Link></li>
              <li><Link to="/tienda?category=covers" className="text-gray-400 hover:text-white transition-colors">Covers Decorativos</Link></li>
              <li><Link to="/tienda?category=packs" className="text-gray-400 hover:text-white transition-colors">Packs y Ofertas</Link></li>
              <li><Link to="/roadmap" className="text-gray-400 hover:text-white transition-colors">Próximamente</Link></li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li><Link to="/whatsapp" className="text-gray-400 hover:text-white transition-colors">Consultas IA</Link></li>
              <li><Link to="/mi-cuenta" className="text-gray-400 hover:text-white transition-colors">Mi Cuenta</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Activar QR</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Soporte</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-green-500" />
                <a href="mailto:hola@afpets.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                  hola@afpets.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-500" />
                <a href="tel:+5491123456789" className="text-gray-400 hover:text-white transition-colors text-sm">
                  +54 9 11 2345-6789
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-gray-400 text-sm">Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AFPets. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};