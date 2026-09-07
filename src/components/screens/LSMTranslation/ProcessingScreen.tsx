import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import { useLSMRecognition } from '../../../hooks/useLSMRecognition';
import type { HandLandmarks } from '../../../types';
import Header from '../../shared/Header';
import StatusIndicator from '../../shared/StatusIndicator';
import ConversationPanel from '../../shared/ConversationPanel';

const ProcessingScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationHistory, addConversationMessage } = useAppContext();
  const { recognize, error } = useLSMRecognition();
  const [showConversation, setShowConversation] = useState(false);

  useEffect(() => {
    const processLandmarks = async () => {
      const landmarks = location.state?.landmarks as HandLandmarks;

      if (!landmarks) {
        console.error('No landmarks received from previous screen');
        navigate('/lsm/captura');
        return;
      }

      try {
        const result = await recognize(landmarks);

        // NOTE: The current backend model only classifies static alphabet letters,
        // not dynamic signs or complete phrases. This shows the raw letter-by-letter result.
        const interpretedText = result.letter;

        addConversationMessage({
          type: 'assistant',
          text: `Letra reconocida: ${interpretedText}${result.confidence ? ` (confianza: ${Math.round(result.confidence * 100)}%)` : ''}`
        });

        setTimeout(() => {
          navigate('/lsm/resultado', {
            state: {
              result: interpretedText,
              confidence: result.confidence,
              topK: result.top_k
            }
          });
        }, 500);

      } catch (err) {
        console.error('Error processing landmarks:', err);
        setTimeout(() => {
          navigate('/lsm/captura');
        }, 2000);
      }
    };

    processLandmarks();
  }, [location.state, recognize, navigate, addConversationMessage]);

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
        {/* Center - Processing */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="surface-card p-10 text-center animate-scaleIn">
              {/* Spinner */}
              <div className="mb-8">
                <div className="relative w-28 h-28 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-mist" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-teal border-r-brand-cyan animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl animate-hand-pulse">✋</span>
                  </div>
                </div>
              </div>

              <p className="card-eyebrow mb-2">Analizando</p>
              <h2 className="text-3xl font-extrabold text-brand-ink mb-4 font-display">
                Procesando...
              </h2>

              <div className="flex items-center justify-center mb-7">
                <StatusIndicator type="processing" />
              </div>

              <p className="text-brand-muted text-lg mb-5 font-body">
                Analizando las señas capturadas
              </p>

              {error && (
                <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red px-5 py-4 rounded-soft mb-4 text-left">
                  <p className="font-bold font-display flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Error en el procesamiento
                  </p>
                  <p className="text-sm font-body mt-1">{error}</p>
                  <p className="text-sm mt-2 font-body opacity-70">Regresando a la captura...</p>
                </div>
              )}

              {!error && (
                <div className="bg-brand-teal/8 border-l-4 border-brand-teal p-4 rounded-r-soft text-left">
                  <p className="text-brand-ink font-body leading-relaxed">
                    El sistema está enviando los datos de las señas al servicio de reconocimiento y esperando la interpretación.
                  </p>
                </div>
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

export default ProcessingScreen;
