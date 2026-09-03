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
      // Add to conversation history
      addConversationMessage({
        type: 'user',
        text: transcript
      });
      
      // Set current phrase for LSM translation
      setCurrentPhrase(transcript);
      
      // Navigate to LSM translation flow
      navigate('/lsm/frase');
    }
  };

  const handleRetry = () => {
    setIsConfirming(false);
    // transcript will be cleared by starting new recording
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-lg text-center">
            <div className="bg-red-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Navegador no compatible
            </h2>
            <p className="text-gray-600 mb-6">
              Su navegador no soporta reconocimiento de voz. Por favor use Google Chrome, Microsoft Edge, o Safari para continuar.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
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
        messages={[]} // Empty for now, will be populated after confirmation
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
      />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left/Center panel - Voice input */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {!isConfirming ? (
              /* Recording state */
              <div className="bg-white rounded-soft shadow-soft p-8 text-center">
                <h2 className="text-2xl font-bold text-brand-ink mb-6 font-display">
                  Hable para traducir
                </h2>
                
                <div className="mb-8">
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-200 ${
                      isRecording 
                        ? 'bg-brand-red hover:bg-brand-red/90 animate-pulse' 
                        : 'bg-brand-teal hover:bg-brand-deep'
                    }`}
                  >
                    {isRecording ? (
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                    ) : (
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <StatusIndicator type="recording" />
                </div>

                {transcript && (
                  <div className="bg-brand-cream rounded-lg p-4 mb-4">
                    <p className="text-brand-ink text-lg font-body">{transcript}</p>
                  </div>
                )}

                {error && (
                  <div className="bg-brand-red/10 border border-brand-red text-brand-red px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <p className="text-brand-muted text-sm font-body">
                  {isRecording ? 'Presione para detener la grabación' : 'Presione para comenzar a grabar'}
                </p>
              </div>
            ) : (
              /* Confirmation state */
              <div className="bg-white rounded-soft shadow-soft p-8 text-center">
                <h2 className="text-2xl font-bold text-brand-ink mb-6 font-display">
                  Confirmar transcripción
                </h2>

                <div className="bg-brand-teal/10 border-2 border-brand-teal rounded-lg p-6 mb-6">
                  <p className="text-xl text-brand-ink font-medium font-body">
                    "{transcript}"
                  </p>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <StatusIndicator type="confirming" />
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRetry}
                    className="bg-brand-muted hover:bg-brand-soft text-white font-semibold px-8 py-4 rounded-soft transition-colors min-h-[64px] font-body"
                    style={{ minHeight: '64px' }}
                  >
                    Reintentar
                  </button>
                  
                  <button
                    onClick={handleConfirm}
                    className="bg-brand-teal hover:bg-brand-deep text-white font-semibold px-8 py-4 rounded-soft transition-colors min-h-[64px] font-display"
                    style={{ minHeight: '64px' }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Selected category preview */}
        <div className="w-80 bg-white border-l border-brand-mist p-6">
          <h3 className="text-lg font-semibold text-brand-ink mb-4 font-display">
            Trámite seleccionado
          </h3>
          {selectedCategory && (
            <div className="bg-brand-cream rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand-teal/10 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="font-semibold text-brand-ink font-display">
                  {selectedCategory.name}
                </h4>
              </div>
              <p className="text-sm text-brand-muted font-body">
                {selectedCategory.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInputScreen;
