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
    
    // Use Web Speech API for text-to-speech
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
    // Navigate back to voice input to add more to the conversation
    navigate('/voz');
  };

  const handleScan = () => {
    // Go back to camera capture for another sign
    navigate('/lsm/captura');
  };

  const handleContinue = () => {
    // Continue with the current result
    if (result) {
      setCurrentPhrase(result);
      navigate('/lsm/frase');
    }
  };

  useEffect(() => {
    // Clean up speech synthesis on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No hay resultado disponible</p>
          <button
            onClick={() => navigate('/lsm/captura')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Volver a capturar
          </button>
        </div>
      </div>
    );
  }

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
        {/* Center panel - Result display */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Frase Interpretada
              </h2>

              {/* Main result display */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-6 text-center">
                <p className="text-4xl font-bold text-gray-800 mb-2">
                  {result}
                </p>
                {confidence && (
                  <p className="text-sm text-gray-600">
                    Confianza: {Math.round(confidence * 100)}%
                  </p>
                )}
              </div>

              {/* Audio status indicator */}
              <div className="flex items-center justify-center mb-6">
                {isPlayingAudio ? (
                  <StatusIndicator type="playing" text="Sonando..." />
                ) : (
                  <StatusIndicator type="playing" text="Resultado listo" />
                )}
              </div>

              {/* Top K alternatives if available */}
              {topK && topK.length > 1 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Otras posibles letras:</h3>
                  <div className="flex gap-2 flex-wrap">
                    {topK.slice(1, 4).map((alt, index) => (
                      <span key={index} className="bg-white px-3 py-1 rounded-full text-sm border">
                        {alt.letter} ({Math.round(alt.confidence * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleRepeat}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[64px]"
                  style={{ minHeight: '64px' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Repetir
                </button>

                <button
                  onClick={handleAdd}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[64px]"
                  style={{ minHeight: '64px' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar
                </button>

                <button
                  onClick={handleScan}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[64px]"
                  style={{ minHeight: '64px' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Escanear
                </button>

                <button
                  onClick={handleContinue}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[64px]"
                  style={{ minHeight: '64px' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Continuar
                </button>
              </div>

              {/* Note about current limitations */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-gray-700 text-sm">
                  <strong>Nota:</strong> El sistema actual reconoce letras individuales del alfabeto LSM. 
                  Para frases completas, el usuario necesita deletrear letra por letra.
                </p>
              </div>
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

export default ResultScreen;
