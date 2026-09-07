import React from 'react';

interface LogoProps {
  variant?: 'full' | 'isotipo' | 'crop';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { full: 'h-8', isotipo: 'h-8 w-8', crop: 'h-8' },
  md: { full: 'h-12', isotipo: 'h-12 w-12', crop: 'h-12' },
  lg: { full: 'h-20', isotipo: 'h-20 w-20', crop: 'h-20' },
  xl: { full: 'h-32', isotipo: 'h-32 w-32', crop: 'h-32' },
};

const Logo: React.FC<LogoProps> = ({ variant = 'full', size = 'md', className = '' }) => {
  const src =
    variant === 'isotipo'
      ? '/isotipo-b.png'
      : variant === 'crop'
      ? '/logo-senas-a-voces-crop.png'
      : '/logo-senas-a-voces.png';

  const sizeClass = sizeMap[size][variant];

  return (
    <img
      src={src}
      alt="Señas a Voces"
      className={`${sizeClass} w-auto object-contain select-none ${className}`}
      draggable={false}
    />
  );
};

export default Logo;
