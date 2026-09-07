import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import Header from '../../shared/Header';
import StatusIndicator from '../../shared/StatusIndicator';
import ConversationPanel from '../../shared/ConversationPanel';

const ResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationHistory, setCurrentPhrase } = useAppContext();
  const [showConversation, setShowConversation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const result = location.state?.result as string;
  const confidence = location.state?.confidence as number;
  const topK = location.state?.topK as Array<{ letter: string; confidence: number }>;

  const handleRepeat = () => {
    if (!result) return;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(result);
      utterance.lang = 'es-MX';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  const handleAdd = () => {
    navigate('/voz');
  };

  const handleScan = () => {
    navigate('/lsm/captura');
  };

  const handleContinue = () => {
    if (result) {
      setCurrentPhrase(result);
      navigate('/lsm/frase');
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="surface-card p-10 text-center max-w-md animate-scaleIn">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-brand-orange/15 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-brand-ink mb-4 font-display">No hay resultado disponible</p>
          <button
            onClick={() => navigate('/lsm/captura')}
            className="btn-premium bg-brand-teal hover:bg-brand-deep text-white font-semibold px-6 py-3 rounded-soft font-body"
          >
            Volver a capturar
          </button>
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
        messages={conversationHistory}
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
      />

      <div className="flex min-h-[calc(100vh-72px)]">
        {/* Center - Result */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="surface-card p-9 animate-scaleIn">
              <p className="card-eyebrow text-center mb-2">Resultado</p>
              <h2 className="text-2xl font-extrabold text-brand-ink mb-6 text-center font-display">
                Frase Interpretada
              </h2>

              {/* Main result */}
              <div className="relative bg-gradient-to-br from-brand-mint/20 to-brand-cyan/10 border-2 border-brand-mint/40 rounded-softer p-8 mb-6 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-mint/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-cyan/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />
                <p className="relative text-5xl font-extrabold text-brand-ink mb-2 font-display">
                  {result}
                </p>
                {confidence && (
                  <div className="relative flex items-center justify-center gap-2">
                    <div className="w-24 h-1.5 bg-brand-mist rounded-full overflow-hidden">
                      <div className="h-full bg-brand-mint rounded-full" style={{ width: `${Math.round(confidence * 100)}%` }} />
                    </div>
                    <p className="text-sm text-brand-muted font-body font-semibold">
                      {Math.round(confidence * 100)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Audio status */}
              <div className="flex items-center justify-center mb-6">
                {isPlayingAudio ? (
                  <StatusIndicator type="playing" text="Sonando..." />
                ) : (
                  <StatusIndicator type="playing" text="Resultado listo" />
                )}
              </div>

              {/* Top K alternatives */}
              {topK && topK.length > 1 && (
                <div className="bg-brand-cream border border-brand-mist rounded-soft p-4 mb-6">
                  <h3 className="text-sm font-bold text-brand-ink mb-3 font-display flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Otras posibles letras:
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {topK.slice(1, 4).map((alt, index) => (
                      <span key={index} className="bg-white px-4 py-1.5 rounded-pill text-sm border border-brand-mist font-body font-semibold text-brand-ink">
                        {alt.letter} <span className="text-brand-muted">· {Math.round(alt.confidence * 100)}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleRepeat}
                  className="btn-press bg-white border-2 border-brand-mist hover:border-brand-teal text-brand-teal font-semibold px-6 py-4 rounded-soft transition-colors flex items-center justify-center gap-2.5 min-h-[64px] font-body"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Repetir
                </button>

                <button
                  onClick={handleAdd}
                  className="btn-press bg-brand-mint/20 hover:bg-brand-mint/30 text-brand-deep font-semibold px-6 py-4 rounded-soft transition-colors flex items-center justify-center gap-2.5 min-h-[64px] font-body border border-brand-mint/40"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar
                </button>

                <button
                  onClick={handleScan}
                  className="btn-press bg-brand-deep hover:bg-brand-card text-white font-semibold px-6 py-4 rounded-soft transition-colors flex items-center justify-center gap-2.5 min-h-[64px] font-body"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Escanear
                </button>

                <button
                  onClick={handleContinue}
                  className="btn-premium bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-6 py-4 rounded-soft min-h-[64px] font-display flex items-center justify-center gap-2.5"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Continuar
                </button>
              </div>

              {/* Limitation note */}
              <div className="bg-brand-orange/8 border-l-4 border-brand-orange p-4 rounded-r-soft">
                <p className="text-brand-ink text-sm font-body leading-relaxed">
                  <strong className="text-brand-orange">Nota:</strong> El sistema actual reconoce letras individuales del alfabeto LSM. Para frases completas, el usuario necesita deletrear letra por letra.
                </p>
              </div>
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

export default ResultScreen;
