import React from 'react';
import { MapPin, Utensils, Cog, Users, Zap, Camera, Calendar, Bell } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const roadmapItems = [
    {
      phase: 'FASE 1 - DISPONIBLE AHORA',
      year: '2025 Q1',
      status: 'live',
      items: [
        { title: 'Colgantes QR Inteligentes', description: 'Sistema de identificación con QR para mascotas perdidas', icon: Zap },
        { title: 'Covers Decorativos', description: 'Fundas intercambiables con temáticas variadas', icon: Camera },
        { title: 'Agente IA Veterinario', description: 'Consultas por WhatsApp las 24 horas', icon: Users }
      ]
    },
    {
      phase: 'FASE 2 - DISPOSITIVOS INTELIGENTES',
      year: '2025 Q3-Q4',
      status: 'development',
      items: [
        { title: 'GPS Tracker', description: 'Seguimiento en tiempo real con geovallas y alertas', icon: MapPin },
        { title: 'Comedero Inteligente', description: 'Alimentación automática con control remoto y horarios', icon: Utensils },
        { title: 'Monitor de Salud', description: 'Sensores para actividad, temperatura y bienestar', icon: Zap }
      ]
    },
    {
      phase: 'FASE 3 - PERSONALIZACIÓN 3D',
      year: '2026 Q1-Q2',
      status: 'planning',
      items: [
        { title: 'Accesorios Impresos 3D', description: 'Collares, juguetes y accesorios personalizados', icon: Cog },
        { title: 'Prótesis Veterinarias', description: 'Soluciones ortopédicas personalizadas para mascotas', icon: Cog },
        { title: 'Diseños Colaborativos', description: 'Marketplace de diseños de la comunidad', icon: Users }
      ]
    },
    {
      phase: 'FASE 4 - ECOSISTEMA COMPLETO',
      year: '2026 Q3-Q4',
      status: 'vision',
      items: [
        { title: 'Red de Veterinarios', description: 'Plataforma que conecta dueños con veterinarios locales', icon: Users },
        { title: 'Comercios Pet-Friendly', description: 'Directorio y beneficios en comercios para mascotas', icon: MapPin },
        { title: 'Comunidad AFPets', description: 'Red social para dueños, eventos y recursos compartidos', icon: Users }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'development': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'vision': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'Disponible';
      case 'development': return 'En desarrollo';
      case 'planning': return 'Planificado';
      case 'vision': return 'Visión a futuro';
      default: return 'Estado desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Roadmap AFPets
          </h1>
          <p className="text-xl text-green-100 mb-8">
            La evolución de la tecnología para mascotas. Desde identificación QR hasta un ecosistema completo de bienestar animal.
          </p>
          
          <button className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            <Bell className="mr-2 h-5 w-5" />
            Sumate a la lista de novedades
          </button>
        </div>
      </div>

      {/* Roadmap */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {roadmapItems.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="relative">
                {/* Phase Header */}
                <div className="flex items-center mb-8">
                  <div className="flex-shrink-0">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(phase.status)}`}>
                      {getStatusText(phase.status)}
                    </div>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">{phase.phase}</h2>
                    <p className="text-gray-600">{phase.year}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="grid md:grid-cols-3 gap-6 ml-0 md:ml-32">
                  {phase.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 p-3 rounded-full mr-4">
                          <item.icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>

                {/* Timeline connector */}
                {phaseIndex < roadmapItems.length - 1 && (
                  <div className="hidden md:block absolute left-16 top-24 w-0.5 h-32 bg-gradient-to-b from-gray-300 to-transparent"></div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Te interesa ser parte del futuro?
            </h2>
            <p className="text-lg text-green-100 mb-6 max-w-2xl mx-auto">
              Sumate a nuestra lista para recibir actualizaciones exclusivas sobre cada lanzamiento 
              y acceso anticipado a nuevas funcionalidades.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                <Bell className="mr-2 h-5 w-5" />
                Sumate a la lista
              </button>
              
              <button className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-600 transition-colors">
                <Calendar className="mr-2 h-5 w-5" />
                Calendario de lanzamientos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};