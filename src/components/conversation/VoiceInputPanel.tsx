import React, { useState, useEffect, useRef } from 'react';
import Spectrum from '../shared/Spectrum';
import { useWhisperRecognition } from '../../hooks/useWhisperRecognition';
import { useAudioDevices } from '../../hooks/useAudioDevices';

interface VoiceInputPanelProps {
  onConfirm: (text: string) => void;
}

const VoiceInputPanel: React.FC<VoiceInputPanelProps> = ({ onConfirm }) => {
  const {
    transcript, interimTranscript, isListening, isModelLoading, isModelReady, modelProgress,
    error, frequencyData, start, stop, reset,
  } = useWhisperRecognition();
  const { devices, selectedDeviceId, setSelectedDeviceId, requestPermissions } = useAudioDevices();
  const [hasStarted, setHasStarted] = useState(false);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  // Auto-start ONLY when model is ready
  useEffect(() => {
    if (isModelReady && !hasStarted) {
      start(selectedDeviceId || undefined);
      setHasStarted(true);
    }
  }, [isModelReady, hasStarted]);

  // Restart when device changes
  useEffect(() => {
    if (hasStarted) {
      stop();
      setTimeout(() => start(selectedDeviceId || undefined), 300);
    }
  }, [selectedDeviceId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDeviceSelector(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggleRecording = () => {
    if (isListening) {
      stop();
    } else {
      start(selectedDeviceId || undefined);
    }
  };

  const handleClear = () => {
    reset();
  };

  const fullTranscript = transcript + (interimTranscript ? ' ' + interimTranscript : '');

  return (
    <div className="flex flex-col h-full">
      {/* Model loading indicator */}
      {isModelLoading && (
        <div className="mb-3 px-4 py-3 bg-soft-teal border border-muted rounded-soft text-sm font-semibold text-teal flex items-center gap-3">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 rounded-full border-2 border-muted" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal border-r-teal animate-spin-slow" />
          </div>
          <span>Cargando modelo Whisper... {modelProgress > 0 && `${modelProgress}%`}</span>
        </div>
      )}

      {/* Recording status + device selector */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-pill text-base font-bold ${
          isListening
            ? 'bg-red-bg border border-red-border text-red'
            : 'bg-muted text-text-muted'
        }`}>
          <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-red animate-rec-pulse' : 'bg-text-muted'}`} />
          {isListening ? 'Escuchando...' : 'Pausado'}
        </div>
        <button
          onClick={handleToggleRecording}
          disabled={isModelLoading}
          className="px-5 py-3 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors disabled:opacity-50"
        >
          {isListening ? 'Pausar' : 'Reanudar'}
        </button>

        {/* Device selector dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDeviceSelector(!showDeviceSelector)}
            className="flex items-center gap-2 px-4 py-3 bg-card border border-muted text-ink text-sm font-bold rounded-soft hover:border-primary transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" strokeLinecap="round" />
            </svg>
            <span className="max-w-[120px] truncate">
              {devices.find((d) => d.deviceId === selectedDeviceId)?.label || 'Micrófono'}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showDeviceSelector && (
            <div className="absolute top-full mt-2 right-0 w-[280px] bg-white border border-muted rounded-card shadow-lg overflow-hidden z-50">
              <div className="px-4 py-2.5 text-xs font-bold uppercase text-text-muted border-b border-muted" style={{ letterSpacing: '.08em' }}>
                Dispositivos de entrada
              </div>
              {devices.length === 0 && (
                <div className="px-4 py-3 text-sm text-text-muted">No se encontraron dispositivos</div>
              )}
              {devices.map((device) => (
                <button
                  key={device.deviceId}
                  onClick={() => {
                    setSelectedDeviceId(device.deviceId);
                    setShowDeviceSelector(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors ${
                    device.deviceId === selectedDeviceId
                      ? 'bg-soft-orange text-primary font-bold'
                      : 'text-ink hover:bg-bg'
                  }`}
                >
                  {device.deviceId === selectedDeviceId && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span className="truncate flex-1">{device.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 px-4 py-3 bg-red-bg border border-red-border rounded-soft text-sm font-semibold text-red flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={() => { start(selectedDeviceId || undefined); }}
            className="px-3 py-1.5 bg-red text-white text-xs font-bold rounded-soft hover:opacity-90 transition-opacity shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Spectrum — live audio */}
      {isListening && (
        <div className="py-6">
          <Spectrum frequencyData={frequencyData} />
        </div>
      )}

      {/* Transcript */}
      <div className="flex-1 bg-card border border-muted rounded-card p-6 flex flex-col min-h-[180px]">
        <div className="text-sm font-bold uppercase text-text-muted mb-3" style={{ letterSpacing: '.08em' }}>
          Transcripción en tiempo real
        </div>
        <div className="text-2xl font-medium flex-1 text-ink" style={{ lineHeight: '1.7' }}>
          {transcript}
          {interimTranscript && (
            <span className="text-text-muted italic">{interimTranscript}</span>
          )}
          {isListening && !interimTranscript && (
            <span className="inline-block w-1 h-6 bg-teal ml-0.5 animate-blink align-text-bottom" />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleClear}
          className="btn-press flex-1 py-4 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors"
        >
          Limpiar
        </button>
        <button
          onClick={() => onConfirm(fullTranscript.trim() || transcript)}
          disabled={!transcript}
          className="btn-press flex-[2] py-4 bg-teal text-white text-lg font-bold rounded-soft flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ boxShadow: '0 4px 16px rgba(13,92,111,.2)' }}
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

export default VoiceInputPanel;
