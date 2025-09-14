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
      src="/src/assets/images/afpets-4.webp"
      alt={alt}
      className={className}
    />
  );
};