import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

interface HeaderProps {
  showConversation?: boolean;
  onConversationToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showConversation = true, onConversationToggle }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleTerminate = () => {
    navigate('/');
  };

  return (
    <header className="app-header sticky top-0 z-40 border-b px-6 py-3 flex items-center justify-between">
      {/* Left: back + terminate */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="btn-press flex items-center gap-2 px-4 py-2.5 bg-white/70 hover:bg-white border border-brand-mist rounded-soft transition-colors font-body"
          aria-label="Regresar"
        >
          <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-semibold text-brand-ink text-sm">Regresar</span>
        </button>

        <button
          onClick={handleTerminate}
          className="btn-press flex items-center gap-2 px-4 py-2.5 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red rounded-soft transition-colors font-body"
          aria-label="Terminar conversación"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="font-semibold text-sm">Terminar</span>
        </button>
      </div>

      {/* Center: logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5">
        <Logo variant="crop" size="sm" />
        <span className="font-display font-extrabold text-brand-teal text-lg tracking-tight hidden sm:block">
          Señas a Voces
        </span>
      </div>

      {/* Right: conversation toggle */}
      {showConversation && (
        <button
          onClick={onConversationToggle}
          className="btn-press flex items-center gap-2 px-4 py-2.5 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal rounded-soft transition-colors font-body"
          aria-label="Ver conversación"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold text-sm">Conversación</span>
        </button>
      )}
    </header>
  );
};

export default Header;
