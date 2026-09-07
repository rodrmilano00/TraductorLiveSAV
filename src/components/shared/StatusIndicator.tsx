import React from 'react';
import type { StatusType } from '../../types';

interface StatusIndicatorProps {
  type: StatusType;
  text?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ type, text }) => {
  const getStatusConfig = () => {
    switch (type) {
      case 'recording':
        return {
          dot: 'bg-brand-red',
          text: 'text-brand-red',
          bg: 'bg-brand-softRed',
          border: 'border-brand-softRedBorder',
          defaultText: 'Grabando...',
          animate: 'animate-rec-pulse',
        };
      case 'confirming':
        return {
          dot: 'bg-brand-teal',
          text: 'text-brand-teal',
          bg: 'bg-brand-softTeal',
          border: 'border-muted',
          defaultText: 'Confirmar',
          animate: 'animate-pulse-opacity',
        };
      case 'playing':
        return {
          dot: 'bg-brand-success',
          text: 'text-brand-success',
          bg: 'bg-brand-successBg',
          border: 'border-muted',
          defaultText: 'Reproduciendo...',
          animate: 'animate-pulse-opacity',
        };
      case 'processing':
        return {
          dot: 'bg-brand-orange',
          text: 'text-brand-orange',
          bg: 'bg-brand-softOrange',
          border: 'border-muted',
          defaultText: 'Procesando...',
          animate: 'animate-pulse-opacity',
        };
      default:
        return {
          dot: 'bg-brand-muted',
          text: 'text-brand-ink',
          bg: 'bg-muted',
          border: 'border-muted',
          defaultText: '',
          animate: '',
        };
    }
  };

  const config = getStatusConfig();
  const displayText = text || config.defaultText;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 ${config.bg} border ${config.border} rounded-pill text-[13px] font-semibold ${config.text}`}
    >
      <span className={`w-2.5 h-2.5 rounded-full ${config.dot} ${config.animate}`} />
      {displayText}
    </div>
  );
};

export default StatusIndicator;
