import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import { useCameraCapture } from '../../../hooks/useCameraCapture';
import Header from '../../shared/Header';
import StatusIndicator from '../../shared/StatusIndicator';
import ConversationPanel from '../../shared/ConversationPanel';

const CameraCaptureScreen: React.FC = () => {
  const navigate = useNavigate();
  const { conversationHistory } = useAppContext();
  const { videoRef, canvasRef, isCapturing, landmarks, startCapture, stopCapture, error } = useCameraCapture();
  const [showConversation, setShowConversation] = useState(false);

  const handleTerminateCapture = () => {
    if (landmarks) {
      stopCapture();
      navigate('/lsm/procesando', { state: { landmarks } });
    } else {
      alert('No se detectó ninguna mano. Por favor asegúrese de que su mano sea visible y luego presione Terminar nuevamente.');
    }
  };

  React.useEffect(() => {
    startCapture();
    return () => {
      stopCapture();
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header
        showConversation={true}
        onConversationToggle={() => setShowConversation(!showConversation)}
      />

      <ConversationPanel
        messages={conversationHistory}
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
      />

      <div className="flex min-h-[calc(100vh-72px)]">
        {/* Center - Camera capture */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="surface-card p-6 animate-fade">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="card-eyebrow mb-0.5">Paso 4 · Captura</p>
                  <h2 className="text-2xl font-extrabold text-brand-ink font-display">Captura de Señas</h2>
                </div>
                <StatusIndicator type="recording" />
              </div>

              {/* Camera container */}
              <div className="relative bg-brand-deep rounded-softer overflow-hidden mb-5 ring-4 ring-brand-teal/10" style={{ aspectRatio: '16/9' }}>
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Loading overlay */}
                {!isCapturing && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-deep/80 backdrop-blur-sm">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-brand-cyan mx-auto mb-4" />
                      <p className="font-body font-medium">Iniciando cámara...</p>
                    </div>
                  </div>
                )}

                {/* Error overlay */}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-deep/90 backdrop-blur-sm">
                    <div className="text-white text-center p-6 max-w-sm">
                      <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-brand-red/20 flex items-center justify-center">
                        <svg className="w-7 h-7 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-lg font-bold mb-2 font-display">Error de cámara</p>
                      <p className="text-sm font-body opacity-80">{error}</p>
                    </div>
                  </div>
                )}

                {/* Hand detected badge */}
                {isCapturing && landmarks && (
                  <div className="absolute top-4 left-4 bg-brand-mint/90 backdrop-blur-sm text-brand-deep px-4 py-2 rounded-pill text-sm font-bold font-display flex items-center gap-2 animate-scaleIn">
                    <span className="text-lg">✋</span> Mano detectada
                  </div>
                )}

                {/* Recording indicator */}
                {isCapturing && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-brand-red/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-pill text-xs font-bold font-body">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    REC
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-brand-teal/8 border-l-4 border-brand-teal p-4 rounded-r-soft mb-6">
                <p className="text-brand-ink font-body leading-relaxed">
                  <strong className="text-brand-teal">Instrucciones:</strong> Coloque su mano frente a la cámara para realizar las señas. El sistema detectará los movimientos y los traducirá a texto.
                </p>
              </div>

              {/* Action button */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleTerminateCapture}
                  disabled={!isCapturing || !landmarks}
                  className="btn-premium bg-brand-red hover:bg-brand-red/90 disabled:bg-brand-muted disabled:cursor-not-allowed text-white font-bold text-lg px-12 py-4 rounded-softer shadow-soft min-h-[64px] font-display inline-flex items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="3" />
                  </svg>
                  Terminar
                </button>
              </div>

              {!landmarks && isCapturing && (
                <p className="text-center text-brand-muted mt-4 font-body flex items-center justify-center gap-2">
                  <span className="animate-hand-pulse text-xl">✋</span>
                  Esperando detección de mano...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right - Conversation preview */}
        <div className="w-80 bg-white/60 border-l border-brand-mist p-6 backdrop-blur-sm">
          <p className="card-eyebrow mb-3">Conversación actual</p>
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {conversationHistory.length === 0 ? (
              <p className="text-brand-muted text-sm text-center py-8 font-body">No hay mensajes aún</p>
            ) : (
              conversationHistory.slice(-3).map((message) => (
                <div
                  key={message.id}
                  className={`p-3.5 rounded-soft ${message.type === 'user'
                    ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/15'
                    : 'bg-brand-cream text-brand-ink border border-brand-mist'
                    }`}
                >
                  <p className="text-sm font-body leading-relaxed">{message.text}</p>
                  <p className="text-xs mt-1.5 opacity-50 font-body">
                    {new Date(message.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureScreen;
