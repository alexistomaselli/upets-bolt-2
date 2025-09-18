import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthContext } from './hooks/useAuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SEOStructuredData } from './components/SEOStructuredData';
import { SocialMetaTags } from './components/SocialMetaTags';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm, RegisterForm } from './components/auth';
import { SuperAdminLogin } from './components/auth/SuperAdminLogin';
import { SuperAdminRedirect, SmartRedirect } from './components/auth/RoleBasedRedirect';
import { LandingPage } from './pages/LandingPage';
import { StorePage } from './pages/StorePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';
import { SystemQRPage } from './pages/admin/SystemQRPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { DebugAuth } from './components/DebugAuth';
import AccessDenied from './pages/AccessDenied';
import { AuthProvider } from './context/AuthContext';
import { SupabaseConfigProvider } from './context/SupabaseConfigContext';

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
        <SupabaseConfigProvider>
          <AuthProvider>
            <AppContent isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </AuthProvider>
        </SupabaseConfigProvider>
      </Router>
    </QueryClientProvider>
  );
}

// Componente interno que tiene acceso al contexto del Router
const AppContent = ({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean, setIsMenuOpen: (isOpen: boolean) => void }) => {
  const location = useLocation();
  const { user, loading, roles } = useAuthContext(); // Cambiado de useAuth a useAuthContext para resolver el error
  const path = location.pathname;
  
  // Rutas que no necesitan header/footer
  const authRoutes = ['/login', '/registro'];
  const isAuthRoute = authRoutes.includes(path);
  
  // Debug de roles - comentado para evitar refrescos constantes
  /*
  React.useEffect(() => {
    if (user && roles.length > 0) {
      console.log('👤 Usuario autenticado:', user.email);
      console.log('🎭 Roles del usuario:', roles);
    }
  }, [user, roles]);
  */
  
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando AFPets...</p>
        </div>
      </div>
    );
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
      
      {!isAuthRoute && <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
      
      <main className={!isAuthRoute ? "pt-16" : ""}>
        {/* Debug component solo visible en desarrollo */}
        {import.meta.env.DEV && <DebugAuth />}
        
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tienda" element={<StorePage />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/whatsapp" element={<WhatsAppPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          
          {/* Rutas de autenticación */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registro" element={<RegisterForm />} />
          
          {/* Rutas protegidas */}
          <Route path="/carrito" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/mi-cuenta" element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Rutas de administración */}
          <Route path="/admin" element={<SuperAdminRedirect />} />
          <Route path="/admin/login" element={<SuperAdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute minimumLevel={100}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/sistema-qr" element={
            <ProtectedRoute minimumLevel={100}>
              <SystemQRPage />
            </ProtectedRoute>
          } />
          
          {/* Ruta de redirección inteligente */}
          <Route path="/redirect" element={<SmartRedirect />} />
          
          {/* Ruta de acceso denegado */}
          <Route path="/access-denied" element={<AccessDenied />} />
        </Routes>
      </main>
      
      {!isAuthRoute && <Footer />}
    </div>
  );
};

export default App;