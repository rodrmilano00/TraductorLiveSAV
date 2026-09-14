import React, { useState, useRef, useEffect } from 'react';
import Spectrum from '../shared/Spectrum';

interface VoiceInputPanelProps {
  onConfirm: (text: string) => void;
}

const VoiceInputPanel: React.FC<VoiceInputPanelProps> = ({ onConfirm }) => {
  const [isRecording, setIsRecording] = useState(true);
  const [transcript, setTranscript] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const demoText = 'Su pedido será atendido en breve, por favor espere un momento mientras verificamos la disponibilidad';

  useEffect(() => {
    if (isRecording && transcript.length < demoText.length) {
      timerRef.current = setInterval(() => {
        setTranscript((prev) => {
          const next = demoText.slice(0, prev.length + 2);
          if (next.length >= demoText.length) {
            if (timerRef.current) clearInterval(timerRef.current);
          }
          return next;
        });
      }, 50);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording, transcript.length]);

  return (
    <div className="flex flex-col h-full">
      {/* Recording status */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-pill text-base font-bold ${
          isRecording
            ? 'bg-red-bg border border-red-border text-red'
            : 'bg-muted text-text-muted'
        }`}>
          <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red animate-rec-pulse' : 'bg-text-muted'}`} />
          {isRecording ? 'Grabando...' : 'Pausado'}
        </div>
        <button
          onClick={() => setIsRecording(!isRecording)}
          className="px-5 py-3 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors"
        >
          {isRecording ? 'Pausar' : 'Reanudar'}
        </button>
      </div>

      {/* Spectrum */}
      {isRecording && (
        <div className="py-6">
          <Spectrum />
        </div>
      )}

      {/* Transcript */}
      <div className="flex-1 bg-card border border-muted rounded-card p-6 flex flex-col min-h-[180px]">
        <div className="text-sm font-bold uppercase text-text-muted mb-3" style={{ letterSpacing: '.08em' }}>
          Transcripción en tiempo real
        </div>
        <div className="text-2xl font-medium flex-1 text-ink" style={{ lineHeight: '1.7' }}>
          {transcript}
          {isRecording && transcript.length < demoText.length && (
            <span className="inline-block w-1 h-6 bg-teal ml-0.5 animate-blink align-text-bottom" />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => { setTranscript(''); setIsRecording(true); }}
          className="btn-press flex-1 py-4 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors"
        >
          Limpiar
        </button>
        <button
          onClick={() => onConfirm(transcript || demoText)}
          disabled={transcript.length === 0}
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
