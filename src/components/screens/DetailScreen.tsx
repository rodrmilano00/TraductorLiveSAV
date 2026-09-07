import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';
import Waveform from '../shared/Waveform';

const DetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, setCurrentPhrase } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setIsPlaying(false); return 100; }
        return p + 0.5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (pct: number) => {
    const sec = Math.floor((pct / 100) * 5);
    return `0:0${sec}`;
  };

  const handleTogglePlay = () => {
    if (progress >= 100) { setProgress(0); setIsPlaying(true); }
    else setIsPlaying(!isPlaying);
  };

  const handleRestart = () => { setProgress(0); setIsPlaying(true); };
  const handleContinue = () => {
    if (selectedCategory) setCurrentPhrase(`Información sobre ${selectedCategory.name}`);
    navigate('/voz');
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <button onClick={() => navigate('/categorias')} className="btn-press bg-brand-orange text-white px-6 py-3 rounded-soft font-bold">
          Volver a categorías
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-app flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col items-center px-12 py-8 overflow-y-auto">
        <div className="text-[12px] font-bold uppercase text-brand-orange mb-2 self-start" style={{ letterSpacing: '0.1em' }}>Pantalla 03</div>

        {/* Option badge */}
        <div className="inline-flex items-center gap-2 px-[18px] py-2 bg-brand-softOrange rounded-pill text-[14px] font-semibold text-brand-orange mb-8 mt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse-opacity" />
          Opción {selectedCategory.id} — Reproduciendo
        </div>

        {/* Player card */}
        <div className="w-full bg-white rounded-card border border-muted overflow-hidden mb-6">
          {/* Header */}
          <div className="px-6 py-5 border-b border-muted flex items-center justify-between">
            <h2 className="text-[20px] font-bold">Reproducción de audio</h2>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-success">
              <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse-opacity" />
              En reproducción
            </div>
          </div>

          {/* Visual */}
          <div className="px-6 py-5 flex items-center gap-4 border-t border-muted">
            <div className="w-12 h-12 rounded-soft bg-brand-softOrange flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-brand-orange" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] font-bold mb-0.5">Opción {selectedCategory.id} — {selectedCategory.name}</h3>
              <p className="text-[13px] text-brand-muted">Audio generado por el sistema</p>
            </div>
          </div>

          {/* Waveform */}
          <div className="px-6 py-4">
            <Waveform isPlaying={isPlaying} />
          </div>

          {/* Progress */}
          <div className="px-6 pb-5">
            <div className="w-full h-1.5 bg-muted rounded-[3px] overflow-hidden">
              <div className="h-full bg-brand-orange rounded-[3px] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-[12px] font-semibold text-brand-muted tabular-nums">
              <span>{formatTime(progress)}</span>
              <span>0:05</span>
            </div>
          </div>
        </div>

        {/* Phrase card */}
        <div className="w-full bg-white rounded-card border border-muted p-6 mb-6">
          <div className="text-[12px] font-bold uppercase text-brand-muted mb-3" style={{ letterSpacing: '0.08em' }}>Frase que se está reproduciendo</div>
          <p className="text-[22px] font-semibold" style={{ lineHeight: '1.5', letterSpacing: '-0.01em' }}>
            "{selectedCategory.description || selectedCategory.name}"
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleRestart}
            className="btn-press flex-1 py-[18px] bg-muted text-brand-ink text-[16px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="1 4 1 10 7 10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Reiniciar
          </button>
          <button
            onClick={handleTogglePlay}
            className="btn-press flex-1 py-[18px] bg-brand-orange text-white text-[16px] font-bold rounded-soft transition-all flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 16px rgba(224, 112, 43, 0.25)' }}
          >
            {isPlaying ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
                Pausar
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {progress >= 100 ? 'Reproducir' : 'Reanudar'}
              </>
            )}
          </button>
          <button
            onClick={handleContinue}
            className="btn-press flex-1 py-[18px] bg-brand-teal text-white text-[16px] font-bold rounded-soft transition-all"
            style={{ boxShadow: '0 4px 16px rgba(17, 82, 90, 0.2)' }}
          >
            Continuar
          </button>
        </div>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default DetailScreen;
