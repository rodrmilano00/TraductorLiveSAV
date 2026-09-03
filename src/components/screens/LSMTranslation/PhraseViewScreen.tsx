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
    <div className="min-h-screen bg-gray-50">
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
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Frase a traducir
              </h2>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-8">
                <p className="text-3xl text-gray-800 font-medium leading-relaxed">
                  {currentPhrase || "No hay frase seleccionada"}
                </p>
              </div>

              <div className="flex items-center justify-center mb-8">
                <StatusIndicator type="playing" text="Lista para traducir" />
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-8">
                <p className="text-gray-700 text-left">
                  <strong>Instrucciones:</strong> El usuario sordo podrá responder usando lenguaje de señas mexicano. 
                  La cámara capturará las señas y las traducirá a texto.
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[64px]"
                style={{ minHeight: '64px' }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>

        {/* Right panel - Conversation preview */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Conversación actual
          </h3>
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {conversationHistory.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No hay mensajes aún
              </p>
            ) : (
              conversationHistory.slice(-3).map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
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
