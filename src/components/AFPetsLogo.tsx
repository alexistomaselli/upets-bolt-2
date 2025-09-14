import React from 'react';

interface AFPetsLogoProps {
  className?: string;
  alt?: string;
}

export const AFPetsLogo: React.FC<AFPetsLogoProps> = ({ 
  className = "h-8 w-auto", 
  alt = "AFPets Logo" 
}) => {
  return (
    <img 
      src="/src/assets/images/afpets-logo.webp"
      alt={alt}
      className={className}
      onError={(e) => {
        console.error('Error loading logo:', e);
        // Fallback a texto si la imagen no carga
        e.currentTarget.style.display = 'none';
        e.currentTarget.insertAdjacentHTML('afterend', `<span class="${className} font-bold text-green-600">AFPets</span>`);
      }}
    />
  );
};