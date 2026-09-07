import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useVoiceCapture } from '../../hooks/useVoiceCapture';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';
import Spectrum from '../shared/Spectrum';
import ConversationPanel from '../shared/ConversationPanel';

const VoiceInputScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, addConversationMessage, conversationHistory } = useAppContext();
  const { isRecording, transcript, startRecording, stopRecording, error, isSupported } = useVoiceCapture();
  const [showConversation, setShowConversation] = useState(false);

  const handleConfirm = () => {
    if (transcript.trim()) {
      addConversationMessage({ type: 'assistant', text: transcript });
      navigate('/confirmacion', { state: { phrase: transcript } });
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <div className="bg-white border border-muted rounded-card p-8 max-w-md text-center">
          <h2 className="text-lg font-bold mb-2">Navegador no compatible</h2>
          <p className="text-sm text-brand-muted mb-4">Use Chrome, Edge o Safari.</p>
          <button onClick={() => navigate('/')} className="btn-press bg-brand-orange text-white px-5 py-2.5 rounded-soft font-bold">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-app flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 grid grid-cols-2 gap-0 px-6 pb-6 overflow-hidden">
        {/* Left panel */}
        <div className="flex flex-col pr-5 border-r border-muted overflow-y-auto">
          {/* Orientation badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-muted rounded-pill text-[11px] font-semibold text-brand-muted w-fit mb-4 mt-2">
            <div className="w-7 h-3.5 border-2 border-brand-muted rounded-[3px]" />
            Modo trabajador — Tableta rotada
          </div>

          <div className="text-[11px] font-bold uppercase text-brand-orange mb-2" style={{ letterSpacing: '0.1em' }}>Pantalla 04</div>

          {/* Recording badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-softRed border border-brand-softRedBorder rounded-pill text-[13px] font-bold text-brand-red w-fit mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-rec-pulse" />
            {isRecording ? 'Grabando...' : 'Listo para grabar'}
          </div>

          {/* Spectrum */}
          {isRecording && <Spectrum className="mb-4" />}

          {/* Mic button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`btn-press w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isRecording ? 'bg-brand-red' : 'bg-brand-teal'
              }`}
              style={{ boxShadow: isRecording ? '0 4px 16px rgba(220, 38, 38, 0.3)' : '0 4px 16px rgba(17, 82, 90, 0.2)' }}
              aria-label={isRecording ? 'Detener' : 'Grabar'}
            >
              {isRecording ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Transcript card */}
          <div className="flex-1 bg-white border border-muted rounded-card p-5 flex flex-col">
            <div className="text-[11px] font-bold uppercase text-brand-muted mb-2.5" style={{ letterSpacing: '0.08em' }}>Transcripción en tiempo real</div>
            <p className="text-[20px] font-medium flex-1" style={{ lineHeight: '1.6' }}>
              {transcript || 'Presione el botón para comenzar a hablar...'}
              {isRecording && <span className="inline-block w-0.5 h-5 bg-brand-teal ml-0.5 animate-blink align-text-bottom" />}
            </p>
          </div>

          {error && (
            <div className="mt-3 px-4 py-2.5 bg-brand-softRed border border-brand-softRedBorder text-brand-red text-sm rounded-soft">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 mt-4">
            <button
              onClick={handleConfirm}
              disabled={!transcript.trim()}
              className="btn-press flex-[1.5] py-3.5 bg-brand-teal text-white text-[15px] font-bold rounded-soft disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 16px rgba(17, 82, 90, 0.2)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Confirmar
            </button>
            <button
              onClick={() => navigate(-1)}
              className="btn-press flex-1 py-3.5 bg-muted text-brand-ink text-[15px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors"
            >
              Volver
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-press py-3.5 px-5 bg-brand-softRed text-brand-red border border-brand-softRedBorder text-[15px] font-bold rounded-soft hover:bg-[#FEE2E2] transition-colors"
            >
              Terminar
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col pl-5 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase text-brand-teal mb-2 mt-2" style={{ letterSpacing: '0.1em' }}>Vista del trabajador</div>
          <h2 className="text-[22px] font-bold mb-1">Entrada por voz</h2>
          <p className="text-[14px] text-brand-muted mb-5">Hable para transcribir su respuesta al cliente.</p>

          {/* History card */}
          <div className="bg-white border border-muted rounded-card overflow-hidden flex-1 mb-4">
            <div className="px-[18px] py-3.5 border-b border-muted text-[12px] font-bold uppercase text-brand-muted" style={{ letterSpacing: '0.06em' }}>
              Conversación
            </div>
            <div className="p-2">
              {conversationHistory.length === 0 ? (
                <p className="text-brand-muted text-sm text-center py-8">No hay mensajes aún</p>
              ) : (
                conversationHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-soft mb-1 text-[14px] leading-relaxed flex items-start gap-2.5 ${
                      msg.type === 'user' ? 'bg-brand-softOrange' : 'bg-brand-softTeal'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-brand-teal uppercase min-w-[60px] pt-0.5" style={{ letterSpacing: '0.04em' }}>
                      {msg.type === 'user' ? 'Cliente' : 'Trabajador'}
                    </span>
                    <span className="flex-1">{msg.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Orientation badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-muted rounded-pill text-[11px] font-semibold text-brand-muted w-fit">
            <div className="w-7 h-3.5 border-2 border-brand-muted rounded-[3px]" />
            La tableta está orientada horizontalmente para el trabajador
          </div>

          {selectedCategory && (
            <div className="mt-3 px-4 py-3 bg-white border border-muted rounded-soft text-sm">
              <span className="text-[11px] font-bold uppercase text-brand-muted block mb-1" style={{ letterSpacing: '0.06em' }}>Opción seleccionada</span>
              <span className="font-semibold">{selectedCategory.name}</span>
            </div>
          )}
        </div>
      </div>

      <BottomIndicator />

      <ConversationPanel
        messages={conversationHistory}
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
      />
    </div>
  );
};

export default VoiceInputScreen;
