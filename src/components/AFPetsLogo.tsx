import React from 'react';

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
      src="/afpets-6.webp"
      alt={alt}
      className={className}
    />
  );
};