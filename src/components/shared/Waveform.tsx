import React, { useMemo } from 'react';

interface WaveformProps {
  bars?: number;
  isPlaying?: boolean;
  className?: string;
}

const Waveform: React.FC<WaveformProps> = ({ bars = 36, isPlaying = true, className = '' }) => {
  const barData = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => ({
        delay: `${i * 0.04}s`,
        height: 8 + Math.random() * 56,
      })),
    [bars]
  );

  return (
    <div className={`flex items-center justify-center gap-[3px] h-20 ${className}`}>
      {barData.map((bar, i) => (
        <div
          key={i}
          className="w-[5px] rounded-[3px] bg-brand-orange animate-wave-anim"
          style={{
            animationDelay: bar.delay,
            height: `${bar.height}px`,
            animationPlayState: isPlaying ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
