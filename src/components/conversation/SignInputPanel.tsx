import React, { useState, useEffect, useRef } from 'react';

interface SignInputPanelProps {
  onConfirm: (text: string) => void;
  onProcessing: () => void;
}

const SignInputPanel: React.FC<SignInputPanelProps> = ({ onConfirm, onProcessing }) => {
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCapturing, setIsCapturing] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isCapturing) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      progRef.current = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 3, 100)), 400);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progRef.current) clearInterval(progRef.current);
    };
  }, [isCapturing]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleConfirm = () => {
    setIsCapturing(false);
    onProcessing();
    setTimeout(() => {
      onConfirm('Me gustaría solicitar una mesa para cuatro personas, por favor.');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Camera preview */}
      <div className="w-full bg-[#1A1A1A] rounded-card overflow-hidden relative mb-4 flex-1 min-h-[380px]">
        <div className="w-full h-full flex items-center justify-center relative">
          {/* Camera label */}
          <div className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-black/60 rounded-pill text-white text-base font-semibold">
            <span className={`w-2.5 h-2.5 rounded-full ${isCapturing ? 'bg-success animate-pulse-opacity' : 'bg-text-muted'}`} />
            {isCapturing ? 'Cámara activa' : 'Cámara pausada'}
          </div>

          {/* Timer */}
          <div className="absolute top-5 right-5 px-4 py-2 bg-black/60 rounded-pill text-white text-base font-bold tabular-nums">
            {formatTimer(elapsed)}
          </div>

          {/* Silhouette */}
          <svg width="160" height="300" viewBox="0 0 140 260" fill="none">
            <circle cx="70" cy="28" r="22" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
            <line x1="70" y1="50" x2="70" y2="150" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
            <line x1="70" y1="75" x2="20" y2="120" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" />
            <line x1="70" y1="75" x2="120" y2="100" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" />
            <line x1="70" y1="150" x2="30" y2="240" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" />
            <line x1="70" y1="150" x2="110" y2="240" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="120" r="6" fill="rgba(217,119,54,.5)" />
            <circle cx="120" cy="100" r="6" fill="rgba(217,119,54,.5)" />
          </svg>

          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,.7))' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-white text-base font-semibold">
                <span className="w-3 h-3 rounded-full bg-success animate-pulse-opacity" />
                {isCapturing ? 'Capturando señas...' : 'Pausado'}
              </div>
              {progress > 0 && (
                <span className="text-white text-base font-bold tabular-nums">{Math.round(progress)}%</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => { setElapsed(0); setProgress(0); setIsCapturing(true); }}
          className="btn-press flex-1 py-4 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          Reiniciar
        </button>
        <button
          onClick={handleConfirm}
          disabled={!isCapturing || progress < 30}
          className="btn-press flex-[2] py-4 bg-primary text-white text-lg font-bold rounded-soft flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ boxShadow: '0 4px 16px rgba(217,119,54,.25)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Interpretar señas
        </button>
      </div>
    </div>
  );
};

export default SignInputPanel;
