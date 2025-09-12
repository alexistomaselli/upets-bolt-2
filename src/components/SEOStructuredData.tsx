import React from 'react';

interface SEOStructuredDataProps {
  type?: 'website' | 'product' | 'service' | 'organization';
  path?: string;
}

export const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({ 
  type = 'website',
  path = ''
}) => {
  // URL base del sitio
  const baseUrl = 'https://afpets.com';
  const currentUrl = `${baseUrl}${path}`;
  
  // Datos estructurados para la página principal
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'AFPets - Bienestar y Seguridad para tu Mascota',
    'url': baseUrl,
    'description': 'Protege a tu mascota con nuestro QR inteligente y consulta a nuestro veterinario IA por WhatsApp. Conectando humanos y mascotas para su bienestar y seguridad.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${baseUrl}/tienda?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Datos estructurados para la organización
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'AFPets',
    'url': baseUrl,
    'logo': `${baseUrl}/logo.png`,
    'description': 'Empresa dedicada al bienestar y seguridad de las mascotas mediante tecnología QR e inteligencia artificial.',
    'sameAs': [
      'https://facebook.com/afpets',
      'https://instagram.com/afpets',
      'https://twitter.com/afpets'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+54-XXX-XXXXXXX',
      'contactType': 'customer service',
      'availableLanguage': ['Spanish']
    }
  };

  // Datos estructurados para el servicio de QR
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'QR para Mascotas AFPets',
    'url': `${baseUrl}/tienda`,
    'description': 'Identificación QR para mascotas que permite su rápida localización en caso de pérdida y acceso a información vital.',
    'provider': {
      '@type': 'Organization',
      'name': 'AFPets',
      'url': baseUrl
    },
    'serviceType': 'Identificación y seguridad para mascotas',
    'areaServed': 'Argentina',
    'offers': {
      '@type': 'Offer',
      'availability': 'https://schema.org/InStock',
      'price': '1500.00',
      'priceCurrency': 'ARS'
    }
  };

  // Seleccionar el tipo de datos estructurados según la página
  let structuredData;
  
  switch (type) {
    case 'organization':
      structuredData = organizationData;
      break;
    case 'service':
      structuredData = serviceData;
      break;
    case 'website':
    default:
      structuredData = websiteData;
      break;
  }

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};