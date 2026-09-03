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
          bgColor: 'bg-brand-red',
          textColor: 'text-brand-red',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          ),
          defaultText: 'Grabando...'
        };
      case 'confirming':
        return {
          bgColor: 'bg-brand-cyan',
          textColor: 'text-brand-deep',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          ),
          defaultText: 'Confirmar'
        };
      case 'playing':
        return {
          bgColor: 'bg-brand-mint',
          textColor: 'text-brand-deep',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          ),
          defaultText: 'Reproduciendo...'
        };
      case 'processing':
        return {
          bgColor: 'bg-brand-orange',
          textColor: 'text-brand-deep',
          icon: (
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ),
          defaultText: 'Procesando...'
        };
      default:
        return {
          bgColor: 'bg-brand-muted',
          textColor: 'text-brand-ink',
          icon: null,
          defaultText: ''
        };
    }
  };

  const config = getStatusConfig();
  const displayText = text || config.defaultText;

  return (
    <div className="flex items-center gap-2">
      <div className={`${config.bgColor} rounded-full p-2`}>
        {config.icon}
      </div>
      <span className={`${config.textColor} font-semibold text-lg`}>
        {displayText}
      </span>
    </div>
  );
};

export default StatusIndicator;
