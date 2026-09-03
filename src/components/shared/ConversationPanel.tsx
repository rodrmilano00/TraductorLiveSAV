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
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-brand-mist shadow-lg overflow-y-auto z-50">
      <div className="p-4 border-b border-brand-mist flex items-center justify-between bg-brand-cream">
        <h2 className="text-lg font-semibold text-brand-ink font-display">Conversación</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-brand-mist rounded-full transition-colors"
          aria-label="Cerrar panel"
        >
          <svg className="w-5 h-5 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-brand-muted py-8 font-body">
            <p>No hay mensajes en la conversación</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-brand-teal text-white'
                    : message.type === 'assistant'
                    ? 'bg-brand-cream text-brand-ink'
                    : 'bg-brand-orange/10 text-brand-ink'
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationPanel;
