import React from 'react';
import { useNavigate } from 'react-router-dom';

const InterpretedPhraseScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col px-8 pt-6 pb-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-extrabold text-ink" style={{ letterSpacing: '-.03em' }}>Resultado de la interpretación</h1>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-success-bg rounded-pill text-xs font-semibold text-success">
          <span className="w-2 h-2 rounded-full bg-success" />
          Interpretación exitosa
        </div>
      </div>

      {/* Source card */}
      <div className="flex items-center gap-3.5 py-4 px-5 bg-card border border-muted rounded-card mb-4">
        <div className="w-11 h-11 rounded-soft bg-muted flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-base font-bold mb-0.5 text-ink">Interpretación de señas</h3>
          <p className="text-sm text-text-muted">Se detectaron 3 gestos en la secuencia</p>
        </div>
      </div>

      {/* Phrase card */}
      <div className="bg-card border-2 border-success-bg rounded-card pt-7 pb-7 pl-8 pr-7 mb-4 relative animate-slide-up-fade">
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-success rounded-[2px]" />
        <div className="text-xs font-bold uppercase text-text-muted mb-3" style={{ letterSpacing: '.08em' }}>Frase interpretada</div>
        <p className="text-xl font-semibold text-ink" style={{ lineHeight: '1.45' }}>
          "Me gustaría solicitar <span className="text-primary">una mesa para cuatro personas</span>, por favor. También quisiera ver la carta de especialidades."
        </p>
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-3 py-3.5 px-5 bg-card border border-muted rounded-soft mb-4">
        <span className="text-sm font-semibold text-text-muted min-w-[100px]">Confianza</span>
        <div className="flex-1 h-1.5 bg-muted rounded-[3px] overflow-hidden">
          <div className="h-full bg-success rounded-[3px]" style={{ width: '92%' }} />
        </div>
        <span className="text-sm font-bold text-success min-w-[40px] text-right">92%</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-auto">
        <button className="btn-press flex-1 py-4 bg-muted text-ink text-base font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          Repetir
        </button>
        <button className="btn-press flex-1 py-4 bg-soft-orange text-primary border border-soft-orange-border text-base font-bold rounded-soft hover:bg-[#FDDEC8] transition-colors flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Añadir
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn-press flex-1 py-4 bg-success text-white text-base font-bold rounded-soft flex items-center justify-center gap-2"
          style={{ boxShadow: '0 4px 16px rgba(13,92,111,.2)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default InterpretedPhraseScreen;
