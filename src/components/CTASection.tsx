import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          ¿Listo para darle seguridad a tu mascota?
        </h2>
        
        <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
          Unite a miles de dueños que ya protegen a sus mascotas con AFPets. 
          La tranquilidad que buscás está a un click de distancia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Comprá tu QR ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          <button className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-200">
            <Bell className="mr-2 h-5 w-5" />
            Lista para dispositivos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="text-white">
            <div className="text-2xl font-bold mb-1">+1000</div>
            <div className="text-green-200 text-sm">mascotas protegidas</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold mb-1">24/7</div>
            <div className="text-green-200 text-sm">IA veterinaria</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold mb-1">99%</div>
            <div className="text-green-200 text-sm">mascotas recuperadas</div>
          </div>
        </div>
      </div>
    </section>
  );
};