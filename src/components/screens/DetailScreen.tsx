import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';
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
    <div className="relative min-h-screen bg-bg flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col items-center px-12 pt-8 pb-10 overflow-y-auto">
        <div className="text-xs font-bold uppercase text-secondary mb-2 self-start" style={{ letterSpacing: '.1em' }}>Pantalla 03</div>

        {/* Option badge */}
        <div className="inline-flex items-center gap-2 px-[18px] py-2 bg-soft-orange rounded-pill text-[14px] font-semibold text-primary mb-8 mt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-opacity" />
          Opción 3 — Reproduciendo
        </div>

        {/* Player card */}
        <div className="w-full bg-card rounded-card border border-muted overflow-hidden mb-6">
          {/* Header */}
          <div className="py-5 px-6 border-b border-muted flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold text-ink">Reproducción de audio</h2>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-opacity" />
              En reproducción
            </div>
          </div>

          {/* Visual */}
          <div className="py-5 px-6 flex items-center gap-4 border-t border-muted">
            <div className="w-12 h-12 rounded-soft bg-soft-orange flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-[16px] font-bold mb-0.5 text-ink">Opción 3 — Realizar un pedido</h3>
              <p className="text-[13px] text-text-muted">Audio generado por el sistema</p>
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
            <div className="flex justify-between mt-2 text-[12px] font-semibold text-text-muted tabular-nums">
              <span>{currentTime}</span>
              <span>0:05</span>
            </div>
          </div>
        </div>

        {/* Phrase card */}
        <div className="w-full bg-card rounded-card border border-muted p-6 mb-6">
          <div className="text-[12px] font-bold uppercase text-text-muted mb-3" style={{ letterSpacing: '.08em' }}>
            Frase que se está reproduciendo
          </div>
          <p className="text-[22px] font-semibold" style={{ lineHeight: '1.5', letterSpacing: '-.01em' }}>
            "Realizar un pedido para llevar, por favor"
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setProgress(0)}
            className="btn-press flex-1 py-[18px] bg-muted text-ink text-[16px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Reiniciar
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-press flex-1 py-[18px] bg-primary text-white text-[16px] font-bold rounded-soft flex items-center justify-center gap-2"
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
          className="btn-press w-full max-w-[400px] mt-6 py-4 bg-teal text-white text-[15px] font-bold rounded-soft"
          style={{ boxShadow: '0 4px 16px rgba(13,92,111,.2)' }}
        >
          Continuar
        </button>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default DetailScreen;
