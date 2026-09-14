import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation, Turn } from '../../context/ConversationContext';
import VoiceInputPanel from '../conversation/VoiceInputPanel';
import SignInputPanel from '../conversation/SignInputPanel';

const ConversationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { messages, currentTurn, category, addMessage, switchTurn, reset } = useConversation();
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleVoiceConfirm = (text: string) => {
    addMessage(text);
    switchTurn();
  };

  const handleSignProcessing = () => {
    setIsProcessing(true);
  };

  const handleSignConfirm = (text: string) => {
    setIsProcessing(false);
    addMessage(text);
    switchTurn();
  };

  const handleNewConversation = () => {
    reset();
    navigate('/categorias');
  };

  const turnLabel: Record<Turn, string> = {
    voice: 'Trabajador hablando',
    sign: 'Cliente señalando',
  };

  const turnIcon = (turn: Turn) => turn === 'voice' ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 5h12l-4 4M3 5l4 4M3 5v14M21 19H9l4-4M21 19l-4-4M21 19V5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-muted shrink-0">
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-bold ${
            currentTurn === 'voice'
              ? 'bg-soft-orange text-primary'
              : 'bg-soft-teal text-teal'
          }`}>
            {turnIcon(currentTurn)}
            {turnLabel[currentTurn]}
          </div>
          {category && (
            <span className="text-sm text-text-muted font-medium">{category}</span>
          )}
        </div>
        <button
          onClick={handleNewConversation}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted hover:text-ink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          Nueva conversación
        </button>
      </div>

      {/* Main split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat history */}
        <div className="flex-1 flex flex-col overflow-hidden px-6 py-4">
          <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-soft-orange flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <p className="text-base text-text-muted max-w-[300px]" style={{ lineHeight: '1.5' }}>
                  Inicie la conversación. El trabajador habla primero y el cliente responde con señas.
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const isWorker = msg.sender === 'worker';
              return (
                <div key={msg.id} className={`flex ${isWorker ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${isWorker ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`flex items-center gap-1.5 px-2 ${isWorker ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isWorker ? 'bg-primary text-white' : 'bg-teal text-white'
                      }`}>
                        {isWorker ? 'T' : 'C'}
                      </div>
                      <span className="text-xs font-semibold text-text-muted">
                        {isWorker ? 'Trabajador' : 'Cliente'}
                      </span>
                    </div>
                    <div className={`px-5 py-3 rounded-card text-base ${
                      isWorker
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-soft-teal text-ink rounded-tl-sm border border-muted'
                    }`} style={{ lineHeight: '1.5' }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 px-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-teal text-white">C</div>
                    <span className="text-xs font-semibold text-text-muted">Cliente</span>
                  </div>
                  <div className="px-5 py-4 rounded-card bg-soft-teal border border-muted rounded-tl-sm flex items-center gap-3">
                    <div className="relative w-7 h-7">
                      <div className="absolute inset-0 rounded-full border-2 border-muted" />
                      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal border-r-teal animate-spin-slow" />
                    </div>
                    <span className="text-sm font-medium text-text-muted">Interpretando señas...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input panel */}
        <div className="w-[520px] shrink-0 border-l border-muted p-6 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col">
            {currentTurn === 'voice' ? (
              <VoiceInputPanel onConfirm={handleVoiceConfirm} />
            ) : (
              <SignInputPanel onConfirm={handleSignConfirm} onProcessing={handleSignProcessing} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationScreen;
