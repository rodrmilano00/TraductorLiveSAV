import React, { useMemo } from 'react';

interface SpectrumProps {
  bars?: number;
  frequencyData?: Uint8Array | null;
}

const Spectrum: React.FC<SpectrumProps> = ({ bars = 24, frequencyData }) => {
  const barData = useMemo(
    () => Array.from({ length: bars }, (_, i) => ({ delay: `${i * 0.04}s` })),
    [bars]
  );

  return (
    <div className="flex items-end gap-0.5 h-[100px] py-3">
      {barData.map((bar, i) => {
        const height = frequencyData
          ? `${Math.max(4, (frequencyData[i] / 255) * 100)}%`
          : undefined;
        return (
          <div
            key={i}
            className="flex-1 rounded-t-[2px] bg-teal transition-[height] duration-75 ease-out"
            style={
              frequencyData
                ? { height }
                : { animationDelay: bar.delay, animation: 'freq-anim 0.8s ease-in-out infinite alternate' }
            }
          />
        );
      })}
    </div>
  );
};

export default Spectrum;
