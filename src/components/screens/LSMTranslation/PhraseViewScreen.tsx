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

      <div className="flex h-[calc(100vh-80px)]">
        {/* Center panel - Phrase display */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-soft shadow-soft p-8 text-center">
              <h2 className="text-2xl font-bold text-brand-ink mb-6 font-display">
                Frase a traducir
              </h2>

              <div className="bg-brand-teal/10 border-2 border-brand-teal rounded-lg p-8 mb-8">
                <p className="text-3xl text-brand-ink font-medium leading-relaxed font-body">
                  {currentPhrase || "No hay frase seleccionada"}
                </p>
              </div>

              <div className="flex items-center justify-center mb-8">
                <StatusIndicator type="playing" text="Lista para traducir" />
              </div>

              <div className="bg-brand-orange/10 border-l-4 border-brand-orange p-4 rounded-r-lg mb-8">
                <p className="text-brand-ink text-left font-body">
                  <strong>Instrucciones:</strong> El usuario sordo podrá responder usando lenguaje de señas mexicano. 
                  La cámara capturará las señas y las traducirá a texto.
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="bg-brand-teal hover:bg-brand-deep text-white font-bold text-xl px-12 py-4 rounded-soft shadow-soft hover:shadow-lg transition-all duration-200 min-h-[64px] font-display"
                style={{ minHeight: '64px' }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>

        {/* Right panel - Conversation preview */}
        <div className="w-80 bg-white border-l border-brand-mist p-6">
          <h3 className="text-lg font-semibold text-brand-ink mb-4 font-display">
            Conversación actual
          </h3>
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {conversationHistory.length === 0 ? (
              <p className="text-brand-muted text-sm text-center py-4 font-body">
                No hay mensajes aún
              </p>
            ) : (
              conversationHistory.slice(-3).map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-brand-teal/10 text-brand-teal'
                      : 'bg-brand-cream text-brand-ink'
                  }`}
                >
                  <p className="text-sm font-body">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70 font-body">
                    {new Date(message.timestamp).toLocaleTimeString('es-MX', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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
