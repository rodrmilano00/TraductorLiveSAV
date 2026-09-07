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
      <div
        className="fixed inset-0 bg-brand-deep/25 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white border-l border-muted overflow-y-auto z-50">
        <div className="sticky top-0 p-3 border-b border-muted flex items-center justify-between bg-white/95 backdrop-blur-md">
          <h2 className="text-sm font-bold text-brand-ink">Conversación</h2>
          <button
            onClick={onClose}
            className="btn-press p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-2 space-y-1">
          {messages.length === 0 ? (
            <p className="text-brand-muted text-xs text-center py-10">No hay mensajes</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-soft text-sm leading-relaxed ${
                  msg.type === 'user'
                    ? 'bg-brand-softOrange text-brand-ink'
                    : msg.type === 'assistant'
                    ? 'bg-brand-softTeal text-brand-ink'
                    : 'bg-muted text-brand-ink'
                }`}
              >
                <span className="text-[11px] font-bold text-brand-teal uppercase tracking-wide block mb-0.5">
                  {msg.type === 'user' ? 'Cliente' : msg.type === 'assistant' ? 'Trabajador' : 'Sistema'}
                </span>
                {msg.text}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ConversationPanel;
