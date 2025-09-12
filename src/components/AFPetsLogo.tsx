import React from 'react';
import logoHorizontal from '../assets/images/logo-horizontal.webp';

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
      src={logoHorizontal}
      alt={alt}
      className={className}
    />
  );
};