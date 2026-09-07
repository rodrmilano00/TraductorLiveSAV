import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import StatusBar from '../../shared/StatusBar';
import BottomIndicator from '../../shared/BottomIndicator';
import ConversationPanel from '../../shared/ConversationPanel';

const PhraseViewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentPhrase, conversationHistory } = useAppContext();
  const [showConversation, setShowConversation] = useState(false);

  const handleContinue = () => {
    navigate('/lsm/captura');
  };

  return (
    <div className="relative min-h-screen bg-app flex flex-col overflow-hidden">
      <StatusBar />

      {/* Top nav — teal bar matching HTML identity */}
      <div className="flex items-center justify-between px-8 py-3 bg-brand-teal shrink-0">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.5}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} strokeLinecap="round" />
          </svg>
          <span className="text-white text-[14px] font-bold" style={{ letterSpacing: '0.02em' }}>
            Señas a Voces
          </span>
        </div>
        <div className="flex gap-1">
          <div className="px-4 py-2 rounded-pill text-[13px] font-semibold bg-white/15 text-white cursor-pointer">Opciones</div>
          <div className="px-4 py-2 rounded-pill text-[13px] font-semibold text-white/60 cursor-pointer hover:text-white transition-colors">Historial</div>
          <div
            onClick={() => setShowConversation(true)}
            className="px-4 py-2 rounded-pill text-[13px] font-semibold text-white/60 cursor-pointer hover:text-white transition-colors"
          >
            Ayuda
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8 overflow-y-auto">
        <div className="text-[12px] font-bold uppercase text-brand-orange mb-2" style={{ letterSpacing: '0.1em' }}>Pantalla 03 · Traducción LSM</div>
        <h1 className="text-[34px] font-extrabold mb-1.5" style={{ letterSpacing: '-0.03em', lineHeight: '1.2' }}>
          Frase a <span className="text-brand-orange">traducir</span>
        </h1>
        <p className="text-[16px] text-brand-muted mb-8" style={{ lineHeight: '1.5' }}>
          El usuario sordo podrá responder usando lenguaje de señas mexicano.
        </p>

        {/* Phrase card */}
        <div className="bg-white border border-muted rounded-card p-6 mb-6">
          <div className="text-[12px] font-bold uppercase text-brand-muted mb-3" style={{ letterSpacing: '0.08em' }}>
            Frase seleccionada
          </div>
          <p className="text-[22px] font-semibold" style={{ lineHeight: '1.5', letterSpacing: '-0.01em' }}>
            "{currentPhrase || 'No hay frase seleccionada'}"
          </p>
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-[18px] py-2 bg-brand-softOrange rounded-pill text-[14px] font-semibold text-brand-orange mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse-opacity" />
          Lista para traducir
        </div>

        {/* Instructions card */}
        <div className="bg-white border border-muted rounded-card p-5 mb-6">
          <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0702B" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Instrucciones
          </h3>
          <div className="flex flex-col gap-2.5">
            {[
              'La cámara capturará las señas del usuario sordo',
              'El sistema traducirá los gestos a texto automáticamente',
              'La frase traducida aparecerá en pantalla para confirmar',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-[14px]" style={{ lineHeight: '1.5' }}>
                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[12px] font-bold text-brand-muted shrink-0">{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-press flex-1 py-4 bg-muted text-brand-ink text-[15px] font-semibold rounded-soft hover:bg-[#E5E2DB] transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handleContinue}
            className="btn-press flex-1 py-4 bg-brand-orange text-white text-[15px] font-bold rounded-soft transition-all"
            style={{ boxShadow: '0 4px 16px rgba(224, 112, 43, 0.25)' }}
          >
            Iniciar captura
          </button>
        </div>
      </div>

      <BottomIndicator />

      <ConversationPanel
        messages={conversationHistory}
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
      />
    </div>
  );
};

export default PhraseViewScreen;
