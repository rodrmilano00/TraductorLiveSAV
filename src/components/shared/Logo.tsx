import React from 'react';

interface LogoProps {
  variant?: 'full' | 'crop' | 'isotipo';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'crop', className = '' }) => {
  const src = {
    full: '/logo-senas-a-voces.png',
    crop: '/logo-senas-a-voces-crop.png',
    isotipo: '/isotipo-b.png',
  }[variant];

  return (
    <img
      src={src}
      alt="Señas a Voces Academy"
      className={`h-auto object-contain ${className}`}
    />
  );
};

export default Logo;
