import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Brain, Clock, AlertTriangle } from 'lucide-react';

export const AIVetSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Agente Veterinario con IA
              <br />
              <span className="text-blue-200">por WhatsApp</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8">
              Consultás al instante sobre síntomas, comportamiento, alimentación y cuidados básicos. 
              Respuestas inteligentes disponibles 24/7.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-blue-200" />
                <span className="text-blue-100">Respuestas inmediatas, 24/7</span>
              </div>
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-3 text-blue-200" />
                <span className="text-blue-100">IA entrenada en veterinaria</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-3 text-blue-200" />
                <span className="text-blue-100">Directo en tu WhatsApp</span>
              </div>
            </div>

            <Link
              to="/whatsapp"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Consultar por WhatsApp
            </Link>

            <div className="mt-6 p-4 bg-blue-800/30 rounded-lg border border-blue-500/30">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-300" />
                <span className="text-sm font-medium text-yellow-300">Importante</span>
              </div>
              <p className="text-sm text-blue-100">
                Las consultas de IA son orientativas y no reemplazan la consulta con un veterinario profesional.
              </p>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4790271/pexels-photo-4790271.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Consulta veterinaria digital"
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              
              {/* Chat bubble simulation */}
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg p-3 mr-8">
                  <p className="text-sm text-gray-700">Mi gato no quiere comer desde ayer, ¿qué puede ser?</p>
                </div>
                <div className="bg-blue-600 text-white rounded-lg p-3 ml-8">
                  <p className="text-sm">Puede ser por varios motivos. ¿Notaste otros síntomas? ¿Cambios en su comportamiento?</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 mr-8">
                  <p className="text-sm text-gray-700">Está más quieto de lo normal...</p>
                </div>
              </div>
            </div>

            {/* Floating WhatsApp icon */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-4 rounded-full shadow-lg animate-bounce">
              <MessageCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};