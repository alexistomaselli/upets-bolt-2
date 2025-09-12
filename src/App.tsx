import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEOStructuredData } from './components/SEOStructuredData';
import { SocialMetaTags } from './components/SocialMetaTags';
import { LandingPage } from './pages/LandingPage';
import { StorePage } from './pages/StorePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { RoadmapPage } from './pages/RoadmapPage';

const queryClient = new QueryClient();

// Componente para manejar los datos estructurados según la ruta
const SEOHandler = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Determinar el tipo de datos estructurados según la ruta
  let type: 'website' | 'product' | 'service' | 'organization' = 'website';
  
  if (path === '/') {
    type = 'organization';
  } else if (path.includes('/tienda') || path.includes('/producto')) {
    type = 'service';
  }
  
  return <SEOStructuredData type={type} path={path} />;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </Router>
    </QueryClientProvider>
  );
}

// Componente interno que tiene acceso al contexto del Router
const AppContent = ({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean, setIsMenuOpen: (isOpen: boolean) => void }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Configurar metadatos específicos según la ruta
  let title = 'AFPets - Bienestar y Seguridad para tu Mascota | QR para Mascotas';
  let description = 'Protege a tu mascota con nuestro QR inteligente y consulta a nuestro veterinario IA por WhatsApp. Conectando humanos y mascotas para su bienestar y seguridad.';
  let type: 'website' | 'article' | 'product' = 'website';
  
  if (path === '/') {
    title = 'AFPets - Bienestar y Seguridad para tu Mascota | QR para Mascotas';
    description = 'Conectamos humanos y mascotas para su bienestar. QR inteligente para identificación y veterinario IA por WhatsApp.';
  } else if (path.includes('/tienda')) {
    title = 'Tienda AFPets | QR para Mascotas y Servicios Veterinarios';
    description = 'Adquiere nuestro QR inteligente para la seguridad de tu mascota y accede a servicios veterinarios por IA.';
    type = 'product';
  } else if (path.includes('/whatsapp')) {
    title = 'Veterinario IA por WhatsApp | Consultas 24/7 | AFPets';
    description = 'Consulta a nuestro veterinario con inteligencia artificial por WhatsApp las 24 horas. Respuestas inmediatas sobre síntomas, alimentación y cuidados básicos.';
    type = 'article';
  }
  
  return (
    <div className="min-h-screen bg-white">
      <SEOHandler />
      <SocialMetaTags 
        title={title}
        description={description}
        url={`https://afpets.com${path}`}
        type={type}
      />
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tienda" element={<StorePage />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mi-cuenta" element={<AccountPage />} />
          <Route path="/whatsapp" element={<WhatsAppPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;