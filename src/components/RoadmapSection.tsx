import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Utensils, Cog, Users, ArrowRight } from 'lucide-react';

export const RoadmapSection: React.FC = () => {
  const futureFeatures = [
    {
      icon: MapPin,
      title: 'GPS Inteligente',
      description: 'Seguimiento en tiempo real con alertas de ubicación',
      timeline: '2025',
      color: 'text-blue-600'
    },
    {
      icon: Utensils,
      title: 'Comedero Smart',
      description: 'Alimentación automática con control remoto',
      timeline: '2025',
      color: 'text-green-600'
    },
    {
      icon: Cog,
      title: 'Impresión 3D',
      description: 'Accesorios y prótesis personalizadas',
      timeline: '2026',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Red de dueños, veterinarios y comercios',
      timeline: '2026',
      color: 'text-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            El Futuro de AFPets
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos creando un ecosistema completo de dispositivos y servicios 
            para el bienestar animal. Esto es solo el comienzo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {futureFeatures.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                
                <span className="inline-block bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {feature.timeline}
                </span>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Te interesa ser parte del futuro de AFPets? 
            Sumate a nuestra lista para recibir novedades sobre próximos lanzamientos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/roadmap"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Ver roadmap completo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl border-2 border-green-600 hover:bg-green-50 transition-all duration-200">
              Sumate a la lista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};