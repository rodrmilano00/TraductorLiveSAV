import React from 'react';
import { useSignRecognition } from '../../hooks/useSignRecognition';

interface SignInputPanelProps {
  onConfirm: (text: string) => void;
  onProcessing: () => void;
}

const SignInputPanel: React.FC<SignInputPanelProps> = ({ onConfirm, onProcessing }) => {
  const {
    isCameraActive,
    isModelLoading,
    error,
    detectedSign,
    detectedConfidence,
    transcript,
    videoRef,
    canvasRef,
    devices,
    selectedDeviceId,
    start,
    stop,
    clearError,
    selectDevice,
    clearTranscript,
  } = useSignRecognition();

  const handleSend = () => {
    if (!transcript.trim()) return;
    onProcessing();
    setTimeout(() => onConfirm(transcript.trim()), 300);
    clearTranscript();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Camera selector */}
      {devices.length > 1 && (
        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm font-semibold text-text-muted whitespace-nowrap">Cámara:</label>
          <select
            value={selectedDeviceId || ''}
            onChange={(e) => selectDevice(e.target.value)}
            className="flex-1 px-3 py-2 bg-card border border-muted rounded-soft text-sm font-medium text-ink focus:outline-none focus:border-teal"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Camera preview */}
      <div className="w-full bg-[#1A1A1A] rounded-card overflow-hidden relative mb-4 flex-1 min-h-[380px]">
        <div className="w-full h-full flex items-center justify-center relative">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Camera label */}
          <div className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-black/60 rounded-pill text-white text-base font-semibold z-10">
            <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-success animate-pulse-opacity' : 'bg-text-muted'}`} />
            {isCameraActive ? 'Cámara activa' : 'Cámara inactiva'}
          </div>

          {/* Detected sign badge */}
          {isCameraActive && detectedSign && (
            <div className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 bg-teal/80 rounded-pill text-white text-base font-bold z-10">
              {detectedSign}
              {detectedConfidence > 0 && (
                <span className="text-xs opacity-80">{detectedConfidence}%</span>
              )}
            </div>
          )}

          {/* Model loading indicator */}
          {isModelLoading && !error && (
            <div className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 bg-black/60 rounded-pill text-white text-sm font-semibold z-10">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Cargando detector...
            </div>
          )}

          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5 z-10" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,.7))' }}>
            <div className="flex items-center gap-2.5 text-white text-base font-semibold">
              <span className={`w-3 h-3 rounded-full ${isCameraActive ? 'bg-success animate-pulse-opacity' : 'bg-text-muted'}`} />
              {isCameraActive ? 'Cámara en vivo' : 'Cámara pausada'}
            </div>
          </div>

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="text-center px-6 max-w-md">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 mx-auto">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-red-400">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div className="text-red-400 text-base font-bold mb-4">{error}</div>
                <button
                  onClick={() => { clearError(); start(); }}
                  className="px-5 py-2.5 bg-teal text-white text-sm font-bold rounded-soft hover:opacity-90 transition-opacity"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Start camera prompt */}
          {!error && !isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="text-center px-6">
                <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mb-4 mx-auto">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-teal">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <p className="text-white text-base font-semibold mb-4">Activa la cámara para comenzar</p>
                <button
                  onClick={() => start()}
                  className="px-6 py-3 bg-teal text-white text-base font-bold rounded-soft hover:opacity-90 transition-opacity"
                >
                  Iniciar cámara
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="mb-3 px-4 py-3 bg-card border border-muted rounded-soft">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Transcripción</span>
            <button
              onClick={clearTranscript}
              className="text-xs text-text-muted hover:text-red-400 font-semibold"
            >
              Limpiar
            </button>
          </div>
          <p className="text-sm text-ink font-medium">{transcript}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => { isCameraActive ? stop() : start(); }}
          className="btn-press flex-1 py-4 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {isCameraActive ? (
              <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>
            ) : (
              <><polygon points="5 3 19 12 5 21 5 3" /></>
            )}
          </svg>
          {isCameraActive ? 'Pausar' : 'Reanudar'}
        </button>
        <button
          onClick={handleSend}
          disabled={!transcript.trim()}
          className="btn-press flex-[2] py-4 bg-primary text-white text-lg font-bold rounded-soft flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ boxShadow: '0 4px 16px rgba(217,119,54,.25)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Enviar mensaje
        </button>
      </div>
    </div>
  );
};

export default SignInputPanel;
