import React from 'react';
import logoImage from '../assets/images/afpets-4.webp';

interface AFPetsLogoProps {
  className?: string;
  alt?: string;
}

export const AFPetsLogo: React.FC<AFPetsLogoProps> = ({ 
  className = "h-12 w-auto", 
  alt = "AFPets Logo" 
}) => {
  return (
    <img 
      src={logoImage}
      alt={alt}
      className={className}
    />
  );
};