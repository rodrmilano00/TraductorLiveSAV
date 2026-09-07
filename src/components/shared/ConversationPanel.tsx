import React from 'react';
import type { ConversationMessage } from '../../types';

interface ConversationPanelProps {
  messages: ConversationMessage[];
  isOpen: boolean;
  onClose: () => void;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-deep/30 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[28rem] max-w-[90vw] bg-white border-l border-brand-mist shadow-soft overflow-y-auto z-50 animate-slideUp">
        <div className="sticky top-0 p-5 border-b border-brand-mist flex items-center justify-between bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h2 className="text-lg font-bold text-brand-ink font-display">Conversación</h2>
          </div>
          <button
            onClick={onClose}
            className="btn-press p-2 hover:bg-brand-cream rounded-full transition-colors"
            aria-label="Cerrar panel"
          >
            <svg className="w-5 h-5 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-brand-muted py-16 font-body">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm">No hay mensajes en la conversación</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-softer px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-brand-teal text-white rounded-br-md'
                      : message.type === 'assistant'
                      ? 'bg-brand-cream text-brand-ink rounded-bl-md border border-brand-mist'
                      : 'bg-brand-orange/10 text-brand-ink rounded-bl-md border border-brand-orange/20'
                  }`}
                >
                  <p className="text-sm font-body leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1.5 font-body ${message.type === 'user' ? 'text-white/60' : 'opacity-50'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('es-MX', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ConversationPanel;
