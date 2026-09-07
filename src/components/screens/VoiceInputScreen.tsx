import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useVoiceCapture } from '../../hooks/useVoiceCapture';
import Header from '../shared/Header';
import StatusIndicator from '../shared/StatusIndicator';
import ConversationPanel from '../shared/ConversationPanel';

const VoiceInputScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory, addConversationMessage, setCurrentPhrase } = useAppContext();
  const { isRecording, transcript, startRecording, stopRecording, error, isSupported } = useVoiceCapture();
  const [showConversation, setShowConversation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleStartRecording = () => {
    setIsConfirming(false);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
    if (transcript.trim()) {
      setIsConfirming(true);
    }
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      addConversationMessage({
        type: 'user',
        text: transcript
      });
      setCurrentPhrase(transcript);
      navigate('/lsm/frase');
    }
  };

  const handleRetry = () => {
    setIsConfirming(false);
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <div className="surface-card p-10 max-w-lg text-center animate-scaleIn">
            <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-brand-red/15 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-ink mb-3 font-display">Navegador no compatible</h2>
            <p className="text-brand-muted mb-6 font-body leading-relaxed">
              Su navegador no soporta reconocimiento de voz. Por favor use Google Chrome, Microsoft Edge, o Safari para continuar.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-premium bg-brand-teal hover:bg-brand-deep text-white font-semibold px-6 py-3 rounded-soft font-body"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header
        showConversation={true}
        onConversationToggle={() => setShowConversation(!showConversation)}
      />

      <ConversationPanel
        messages={[]}
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
      />

      <div className="flex min-h-[calc(100vh-72px)]">
        {/* Center - Voice input */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {!isConfirming ? (
              <div className="surface-card p-9 text-center animate-fade">
                <p className="card-eyebrow mb-2">Paso 2 · Entrada de voz</p>
                <h2 className="text-2xl font-extrabold text-brand-ink mb-7 font-display">
                  Hable para traducir
                </h2>

                {/* Mic button */}
                <div className="mb-7">
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`record-button btn-press w-36 h-36 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${isRecording
                      ? 'bg-brand-red hover:bg-brand-red/90 is-recording ring-8 ring-brand-red/20'
                      : 'bg-gradient-to-br from-brand-teal to-brand-deep hover:shadow-glow ring-8 ring-brand-teal/15'
                      }`}
                    aria-label={isRecording ? 'Detener grabación' : 'Iniciar grabación'}
                  >
                    {isRecording ? (
                      <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="3" />
                      </svg>
                    ) : (
                      <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <StatusIndicator type="recording" text={isRecording ? 'Grabando audio...' : 'Listo para grabar'} />
                </div>

                {transcript && (
                  <div className="bg-brand-cream border border-brand-mist rounded-soft p-5 mb-4 text-left">
                    <p className="card-eyebrow mb-1.5">Transcripción</p>
                    <p className="text-brand-ink text-lg font-body leading-relaxed">{transcript}</p>
                  </div>
                )}

                {error && (
                  <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red px-4 py-3 rounded-soft mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm font-body">{error}</span>
                  </div>
                )}

                <p className="text-brand-muted text-sm font-body">
                  {isRecording ? 'Presione el botón para detener la grabación' : 'Presione el botón para comenzar a grabar'}
                </p>
              </div>
            ) : (
              /* Confirmation state */
              <div className="surface-card p-9 text-center animate-scaleIn">
                <p className="card-eyebrow mb-2">Confirmar transcripción</p>
                <h2 className="text-2xl font-extrabold text-brand-ink mb-6 font-display">
                  ¿Es correcto?
                </h2>

                <div className="bg-brand-teal/8 border-2 border-brand-teal/20 rounded-softer p-7 mb-6">
                  <p className="text-xl text-brand-ink font-medium font-body leading-relaxed">
                    "{transcript}"
                  </p>
                </div>

                <div className="flex items-center justify-center mb-7">
                  <StatusIndicator type="confirming" />
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRetry}
                    className="btn-press bg-white border-2 border-brand-mist hover:border-brand-soft text-brand-ink font-semibold px-8 py-4 rounded-soft transition-colors min-h-[64px] font-body inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reintentar
                  </button>

                  <button
                    onClick={handleConfirm}
                    className="btn-premium bg-brand-teal hover:bg-brand-deep text-white font-semibold px-8 py-4 rounded-soft min-h-[64px] font-display inline-flex items-center gap-2"
                  >
                    Confirmar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Category preview */}
        <div className="w-80 bg-white/60 border-l border-brand-mist p-6 backdrop-blur-sm">
          <p className="card-eyebrow mb-3">Trámite seleccionado</p>
          {selectedCategory ? (
            <div className="surface-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-brand-teal/12 to-brand-cyan/8 p-2.5 rounded-soft">
                  <svg className="w-6 h-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="font-bold text-brand-ink font-display leading-tight">
                  {selectedCategory.name}
                </h4>
              </div>
              <p className="text-sm text-brand-muted font-body leading-relaxed">
                {selectedCategory.description}
              </p>
            </div>
          ) : (
            <p className="text-brand-muted text-sm font-body">Sin categoría seleccionada</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInputScreen;
