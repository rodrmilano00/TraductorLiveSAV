import React from 'react';

interface LogoProps {
  variant?: 'full' | 'isotipo' | 'crop';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 56,
};

const Logo: React.FC<LogoProps> = ({ variant = 'full', size = 'sm', className = '' }) => {
  const px = sizeMap[size];

  if (variant === 'isotipo') {
    return (
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E0702B"
        strokeWidth={1.5}
        className={`select-none ${className}`}
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} strokeLinecap="round" />
      </svg>
    );
  }

  const circlePx = variant === 'crop' ? px : px * 2;
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 select-none ${className}`}
      style={{
        width: circlePx,
        height: circlePx,
        background: 'linear-gradient(135deg, #FEF3EC, #FDE0CC)',
        boxShadow: '0 4px 20px rgba(224, 112, 43, 0.15)',
      }}
    >
      <svg
        width={circlePx * 0.5}
        height={circlePx * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E0702B"
        strokeWidth={1.5}
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default Logo;
