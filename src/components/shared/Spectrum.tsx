import React, { useMemo } from 'react';

interface SpectrumProps {
  bars?: number;
  className?: string;
}

const Spectrum: React.FC<SpectrumProps> = ({ bars = 24, className = '' }) => {
  const barData = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => ({
        delay: `${i * 0.04}s`,
      })),
    [bars]
  );

  return (
    <div className={`flex items-end gap-0.5 h-24 py-3 ${className}`}>
      {barData.map((bar, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-[2px] bg-brand-teal animate-freq-anim"
          style={{ animationDelay: bar.delay }}
        />
      ))}
    </div>
  );
};

export default Spectrum;
