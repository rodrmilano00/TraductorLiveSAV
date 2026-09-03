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
        // Call the LSM recognition API
        const result = await recognize(landmarks);
        
        // NOTE: The current backend model only classifies static alphabet letters, 
        // not dynamic signs or complete phrases. This shows the raw letter-by-letter result.
        // Future extension: Implement word/phrase assembly when backend supports it.
        const interpretedText = result.letter; // This will be a single letter
        
        // Add the interpreted result to conversation history
        addConversationMessage({
          type: 'assistant',
          text: `Letra reconocida: ${interpretedText}${result.confidence ? ` (confianza: ${Math.round(result.confidence * 100)}%)` : ''}`
        });
        
        // Navigate to result screen after a short delay
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
        // Navigate back to capture screen on error
        setTimeout(() => {
          navigate('/lsm/captura');
        }, 2000);
      }
    };

    processLandmarks();
  }, [location.state, recognize, navigate, addConversationMessage]);

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
        {/* Center panel - Processing animation */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="mb-8">
                <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600 mx-auto"></div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Procesando...
              </h2>

              <div className="flex items-center justify-center mb-8">
                <StatusIndicator type="processing" />
              </div>

              <p className="text-gray-600 text-lg mb-4">
                Analizando las señas capturadas
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">Error en el procesamiento</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-sm mt-2">Regresando a la captura...</p>
                </div>
              )}

              {!error && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-gray-700">
                    El sistema está enviando los datos de las señas al servicio de reconocimiento 
                    y esperando la interpretación.
                  </p>
                </div>
              )}
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

export default ProcessingScreen;
