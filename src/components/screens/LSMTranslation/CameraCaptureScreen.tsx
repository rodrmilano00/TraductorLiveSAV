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
      // Show error or alert that no hand was detected
      alert('No se detectó ninguna mano. Por favor asegúrese de que su mano sea visible y luego presione Terminar nuevamente.');
    }
  };

  React.useEffect(() => {
    // Auto-start camera when component mounts
    startCapture();
    
    return () => {
      stopCapture();
    };
  }, []);

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
        {/* Center panel - Camera capture */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Captura de Señas
                </h2>
                <StatusIndicator type="recording" />
              </div>

              {/* Camera container */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Iniciando cámara...</p>
                    </div>
                  </div>
                )}

                {/* Error overlay */}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-90">
                    <div className="text-white text-center p-6">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-lg font-semibold mb-2">Error de cámara</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Landmark detection indicator */}
                {isCapturing && landmarks && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ✋ Mano detectada
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                <p className="text-gray-700">
                  <strong>Instrucciones:</strong> Coloque su mano frente a la cámara para realizar las señas. 
                  El sistema detectará los movimientos y los traducirá a texto.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleTerminateCapture}
                  disabled={!isCapturing || !landmarks}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-xl px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[64px]"
                  style={{ minHeight: '64px' }}
                >
                  Terminar
                </button>
              </div>

              {!landmarks && isCapturing && (
                <p className="text-center text-gray-500 mt-4">
                  Esperando detección de mano...
                </p>
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

export default CameraCaptureScreen;
