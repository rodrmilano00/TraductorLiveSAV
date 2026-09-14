import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Waveform from '../shared/Waveform';

const DetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(45);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 0.5;
          return next > 100 ? 0 : next;
        });
      }, 200);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  const currentTime = `0:0${Math.floor(progress * 5 / 100)}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 overflow-y-auto">
      {/* Option badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-orange rounded-pill text-sm font-semibold text-primary mb-6">
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-opacity" />
        Opción 3 — Reproduciendo
      </div>

      {/* Player card */}
      <div className="w-full max-w-[600px] bg-card rounded-card border border-muted overflow-hidden mb-6">
        {/* Header */}
        <div className="py-5 px-6 border-b border-muted flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">Reproducción de audio</h2>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-success">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-opacity" />
            En reproducción
          </div>
        </div>

        {/* Visual */}
        <div className="py-5 px-6 flex items-center gap-4 border-b border-muted">
          <div className="w-12 h-12 rounded-soft bg-soft-orange flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base font-bold mb-0.5 text-ink">Opción 3 — Realizar un pedido</h3>
            <p className="text-sm text-text-muted">Audio generado por el sistema</p>
          </div>
        </div>

        {/* Waveform */}
        <div className="px-6 pt-6 pb-4">
          <Waveform isPlaying={isPlaying} />
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-5">
          <div className="w-full h-1.5 bg-muted rounded-[3px] overflow-hidden">
            <div className="h-full bg-primary rounded-[3px] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold text-text-muted tabular-nums">
            <span>{currentTime}</span>
            <span>0:05</span>
          </div>
        </div>
      </div>

      {/* Phrase card */}
      <div className="w-full max-w-[600px] bg-card rounded-card border border-muted p-6 mb-6">
        <div className="text-xs font-bold uppercase text-text-muted mb-3" style={{ letterSpacing: '.08em' }}>
          Frase que se está reproduciendo
        </div>
        <p className="text-xl font-semibold text-ink" style={{ lineHeight: '1.5', letterSpacing: '-.01em' }}>
          "Realizar un pedido para llevar, por favor"
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 w-full max-w-[600px]">
        <button
          onClick={() => setProgress(0)}
          className="btn-press flex-1 py-4 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          Reiniciar
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="btn-press flex-1 py-4 bg-primary text-white text-base font-bold rounded-soft flex items-center justify-center gap-2"
          style={{ boxShadow: '0 4px 16px rgba(217,119,54,.25)' }}
        >
          {isPlaying ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pausar
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Reanudar
            </>
          )}
        </button>
      </div>

      {/* Continue button */}
      <button
        onClick={() => navigate('/voz')}
        className="btn-press w-full max-w-[600px] mt-4 py-4 bg-teal text-white text-base font-bold rounded-soft"
        style={{ boxShadow: '0 4px 16px rgba(13,92,111,.2)' }}
      >
        Continuar
      </button>
    </div>
  );
};

export default DetailScreen;
