import React from 'react';
import { ShoppingBag, Smartphone, Phone } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: ShoppingBag,
      title: 'Comprás tu QR',
      description: 'Elegí el colgante y covers que más te gusten. Envío a todo el país.',
      color: 'text-green-600'
    },
    {
      icon: Smartphone,
      title: 'Activás y cargás datos',
      description: 'Registrás la info de tu mascota y tus datos de contacto en nuestra plataforma.',
      color: 'text-blue-600'
    },
    {
      icon: Phone,
      title: 'Te contactan al instante',
      description: 'Si se pierde, quien la encuentre escanea el QR y recibe tus datos para contactarte.',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona el QR?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tres pasos simples para mantener a tu mascota segura y a vos tranquilo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-8 w-8" />
                </div>
                
                <div className="flex items-center mb-4">
                  <span className="bg-gray-200 text-gray-700 text-sm font-bold px-3 py-1 rounded-full mr-3">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>

              {/* Connecting line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};