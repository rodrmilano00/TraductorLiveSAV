import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center mb-6 animate-scale-in-bounce">
        <svg className="w-10 h-10 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="font-display text-3xl font-extrabold mb-2 text-ink" style={{ letterSpacing: '-.03em' }}>
        Frase <span className="text-success">confirmada</span>
      </h1>
      <p className="text-base text-text-muted mb-8 max-w-[400px]" style={{ lineHeight: '1.5' }}>
        La frase ha sido registrada exitosamente y será enviada al cliente para su comprensión.
      </p>

      {/* Phrase display */}
      <div className="w-full max-w-[520px] bg-card border-2 border-success-bg rounded-card py-7 px-8 mb-8 relative">
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-success rounded-[2px]" />
        <div className="text-xs font-bold uppercase text-text-muted mb-2.5 text-left" style={{ letterSpacing: '.08em' }}>
          Frase confirmada
        </div>
        <p className="text-xl font-semibold text-left text-ink" style={{ lineHeight: '1.4' }}>
          "Su pedido será atendido en breve, por favor espere un momento mientras verificamos la disponibilidad"
        </p>
      </div>

      {/* Confirmed by */}
      <div className="flex items-center justify-center gap-2.5 mb-8 text-sm text-text-muted">
        <div className="w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold">MC</div>
        Confirmado por María C. — Trabajadora
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-[520px]">
        <button
          onClick={() => navigate('/voz')}
          className="btn-press flex-1 py-4 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
        <button
          onClick={() => navigate('/senas')}
          className="btn-press flex-1 py-4 bg-success text-white text-base font-bold rounded-soft flex items-center justify-center gap-2"
          style={{ boxShadow: '0 4px 16px rgba(13,92,111,.25)' }}
        >
          Continuar
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
