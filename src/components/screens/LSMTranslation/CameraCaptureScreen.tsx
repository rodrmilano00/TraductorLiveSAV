import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCameraCapture } from '../../../hooks/useCameraCapture';
import StatusBar from '../../shared/StatusBar';
import BottomIndicator from '../../shared/BottomIndicator';

const CameraCaptureScreen: React.FC = () => {
  const navigate = useNavigate();
  const { videoRef, canvasRef, isCapturing, landmarks, startCapture, stopCapture, error } = useCameraCapture();
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(68);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startCapture();
    return () => { stopCapture(); if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (isCapturing) {
      timerRef.current = setInterval(() => {
        setElapsed(e => e + 1);
        setProgress(p => Math.min(p + Math.random() * 2, 95));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isCapturing]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleConfirm = () => {
    if (landmarks) { stopCapture(); navigate('/lsm/procesando', { state: { landmarks } }); }
    else alert('No se detectó ninguna mano. Asegúrese de que su mano sea visible.');
  };

  return (
    <div className="relative min-h-screen bg-app flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col px-8 py-5 overflow-y-auto">
        <div className="text-[12px] font-bold uppercase text-brand-orange mb-2" style={{ letterSpacing: '0.1em' }}>Pantalla 06</div>
        <h1 className="text-[26px] font-extrabold mb-1" style={{ letterSpacing: '-0.03em' }}>
          Entrada de <span className="text-brand-orange">Señas</span>
        </h1>
        <p className="text-[15px] text-brand-muted mb-5">Realice señas frente a la cámara para comunicarse con el trabajador.</p>

        {/* Camera card */}
        <div className="w-full bg-[#1A1A1A] rounded-card overflow-hidden relative mb-5">
          <div className="w-full h-[300px] flex items-center justify-center relative">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

            {/* Camera label */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 rounded-pill text-white text-[12px] font-semibold">
              <span className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-brand-success animate-pulse-opacity' : 'bg-brand-red animate-rec-pulse'}`} />
              {isCapturing ? 'Cámara activa' : 'Iniciando...'}
            </div>

            {/* Timer */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 rounded-pill text-white text-[12px] font-bold tabular-nums">
              {formatTimer(elapsed)}
            </div>

            {/* Silhouette placeholder when no camera */}
            {!isCapturing && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-brand-cyan" />
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                <div className="text-white text-center p-4">
                  <p className="text-sm font-bold mb-1">Error de cámara</p>
                  <p className="text-xs opacity-80">{error}</p>
                </div>
              </div>
            )}

            {/* Bottom overlay */}
            {isCapturing && (
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                <div className="flex items-center gap-2 text-white text-[14px] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-pulse-opacity" />
                  Interpretando señas...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress section */}
        <div className="mb-5">
          <div className="text-[12px] font-bold uppercase text-brand-muted mb-2.5" style={{ letterSpacing: '0.08em' }}>Progreso de interpretación</div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] font-semibold text-brand-orange">Análisis en curso</span>
              <span className="text-[14px] font-bold tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-[4px] overflow-hidden">
              <div
                className="h-full rounded-[4px] transition-all duration-300"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #E0702B, #7C4023)' }}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-softOrange rounded-pill text-[13px] font-semibold text-brand-orange">
            <span className="w-3.5 h-3.5 border-2 border-muted border-t-brand-orange rounded-full animate-spin-fast" />
            Interpretando...
          </div>
        </div>

        {/* Phrase preview */}
        <div className="bg-white border border-muted rounded-card p-5 mb-5">
          <div className="text-[12px] font-bold uppercase text-brand-muted mb-2" style={{ letterSpacing: '0.08em' }}>Frase previsualizada</div>
          <p className="text-[18px] font-medium" style={{ lineHeight: '1.5' }}>
            {landmarks ? '"Mano detectada — listo para confirmar"' : '"Esperando señas..."'}
          </p>
        </div>

        {/* Guide card */}
        <div className="bg-white border border-muted rounded-card p-5 mb-5">
          <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0702B" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Guía rápida
          </h3>
          <div className="flex flex-col gap-2.5">
            {['Mire a la cámara y posicione sus manos en el marco', 'Realice las señas con movimientos claros y pausados', 'Espere a que la frase aparezca en la vista previa', 'Confirme, repita o añada más contenido'].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-[14px]" style={{ lineHeight: '1.5' }}>
                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[12px] font-bold text-brand-muted shrink-0">{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => { setElapsed(0); setProgress(0); startCapture(); }}
            className="btn-press flex-1 py-4 bg-muted text-brand-ink text-[15px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="1 4 1 10 7 10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Repetir
          </button>
          <button
            onClick={() => navigate('/confirmacion')}
            className="btn-press flex-1 py-4 bg-brand-softOrange text-brand-orange border border-brand-softOrangeBorder text-[15px] font-bold rounded-soft hover:bg-[#FDDEC8] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
            Añadir
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isCapturing || !landmarks}
            className="btn-press flex-1 py-4 bg-brand-success text-white text-[15px] font-bold rounded-soft disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 16px rgba(22, 163, 74, 0.2)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Confirmar
          </button>
        </div>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default CameraCaptureScreen;
