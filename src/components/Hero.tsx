import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, MessageCircle, QrCode } from 'lucide-react';
import heroImage from '../assets/images/dogs-hero.png';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 py-20 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <span className="text-blue-600">Conectados</span>
              <QrCode className="inline-block ml-2 text-blue-600" size={48} />{' '}
              por el bienestar de tu{' '}
              <br className="hidden lg:block" />
              <span className="text-green-600">mascota</span>.
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Un QR que protege, una IA que responde. 
              La tranquilidad que buscás para cuidar a quien más querés.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                to="/tienda"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Conseguí tu QR ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/whatsapp"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl border-2 border-green-600 hover:bg-green-50 transition-all duration-200"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar IA
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                Seguro y confiable
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                IA veterinaria 24/7
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src={heroImage}
                alt="Dos perritos golden retriever con collares QR"
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="absolute -top-4 -right-4 bg-green-600 text-white p-3 rounded-full shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            
            {/* Floating QR code */}
            <div className="absolute top-10 -left-6 bg-white p-4 rounded-xl shadow-lg border-2 border-green-100 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded opacity-20"></div>
              </div>
              <p className="text-xs font-medium text-gray-600 mt-2 text-center">Código QR</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};