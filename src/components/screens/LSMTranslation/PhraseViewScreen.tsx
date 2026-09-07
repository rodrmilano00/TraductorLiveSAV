import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import Header from '../../shared/Header';
import StatusIndicator from '../../shared/StatusIndicator';
import ConversationPanel from '../../shared/ConversationPanel';

const PhraseViewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentPhrase, conversationHistory } = useAppContext();
  const [showConversation, setShowConversation] = React.useState(false);

  const handleContinue = () => {
    navigate('/lsm/captura');
  };

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
        {/* Center - Phrase display */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="surface-card p-9 text-center animate-fade">
              <p className="card-eyebrow mb-2">Paso 3 · Traducción LSM</p>
              <h2 className="text-2xl font-extrabold text-brand-ink mb-7 font-display">
                Frase a traducir
              </h2>

              {/* Phrase display */}
              <div className="relative bg-gradient-to-br from-brand-teal/8 to-brand-cyan/5 border-2 border-brand-teal/15 rounded-softer p-8 mb-7 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <p className="relative text-3xl text-brand-ink font-medium leading-relaxed font-body">
                  {currentPhrase || "No hay frase seleccionada"}
                </p>
              </div>

              <div className="flex items-center justify-center mb-7">
                <StatusIndicator type="playing" text="Lista para traducir" />
              </div>

              {/* Instructions */}
              <div className="bg-brand-orange/8 border-l-4 border-brand-orange p-4 rounded-r-soft mb-7 text-left">
                <p className="text-brand-ink font-body leading-relaxed">
                  <strong className="text-brand-orange">Instrucciones:</strong> El usuario sordo podrá responder usando lenguaje de señas mexicano. La cámara capturará las señas y las traducirá a texto.
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="btn-premium bg-brand-teal hover:bg-brand-deep text-white font-bold text-lg px-12 py-4 rounded-softer shadow-soft min-h-[64px] font-display inline-flex items-center gap-3"
              >
                Iniciar captura
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
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

export default PhraseViewScreen;
