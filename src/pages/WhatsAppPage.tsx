import React from 'react';
import { MessageCircle, ArrowRight, Clock, Brain, AlertTriangle } from 'lucide-react';

export const WhatsAppPage: React.FC = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_PHONE || '+5491123456789';
  const whatsappMessage = encodeURIComponent(
    import.meta.env.VITE_WHATSAPP_MESSAGE || 
    'Hola! Me interesa consultar sobre AFPets'
  );
  
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const consultationTypes = [
    {
      title: 'Síntomas y Salud',
      description: 'Comportamientos extraños, síntomas preocupantes, primeros auxilios',
      icon: '🩺'
    },
    {
      title: 'Alimentación',
      description: 'Qué puede comer, porciones, dietas especiales, suplementos',
      icon: '🍖'
    },
    {
      title: 'Comportamiento',
      description: 'Entrenamiento, socialización, problemas de conducta',
      icon: '🐕'
    },
    {
      title: 'Cuidados Generales',
      description: 'Higiene, ejercicio, vacunas, desparasitación',
      icon: '💚'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-blue-600 text-white p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <MessageCircle className="h-10 w-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Agente Veterinario con IA
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Consultá al instante sobre la salud y cuidado de tu mascota. 
            Nuestra IA está entrenada en veterinaria para darte respuestas útiles las 24 horas.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg text-lg"
          >
            <MessageCircle className="mr-3 h-6 w-6" />
            Abrir WhatsApp
            <ArrowRight className="ml-3 h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Disponible</h3>
              <p className="text-gray-600">Consultá en cualquier momento, cualquier día del año</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">IA Especializada</h3>
              <p className="text-gray-600">Entrenada con conocimiento veterinario actualizado</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Por WhatsApp</h3>
              <p className="text-gray-600">Directo en la app que ya usás todos los días</p>
            </div>
          </div>

          {/* Consultation Types */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Sobre qué podés consultar?</h2>
            <p className="text-lg text-gray-600">Nuestro agente IA puede ayudarte con estas consultas</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {consultationTypes.map((type, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{type.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
                </div>
                <p className="text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Importante: Disclaimer médico</h3>
                <p className="text-yellow-700 leading-relaxed">
                  Las consultas de IA son orientativas y están basadas en información general. 
                  <strong> No reemplazan la consulta con un veterinario profesional</strong>. 
                  En casos de emergencia o síntomas graves, contactá inmediatamente a tu veterinario de confianza.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg text-lg"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Iniciar consulta en WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};