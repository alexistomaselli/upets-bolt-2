import React from 'react';
import { Helmet } from 'react-helmet';

interface SocialMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export const SocialMetaTags: React.FC<SocialMetaTagsProps> = ({
  title = 'AFPets - Bienestar y Seguridad para tu Mascota | QR para Mascotas',
  description = 'Protege a tu mascota con nuestro QR inteligente y consulta a nuestro veterinario IA por WhatsApp. Conectando humanos y mascotas para su bienestar y seguridad.',
  image = 'https://afpets.com/og-image.jpg',
  url = 'https://afpets.com',
  type = 'website'
}) => {
  return (
    <Helmet>
      {/* Facebook Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="AFPets" />
      <meta property="og:locale" content="es_ES" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* WhatsApp Preview */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Helmet>
  );
};