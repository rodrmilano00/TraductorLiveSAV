import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';

const InterpretedPhraseScreen: React.FC = () => {
  const navigate = useNavigate();

  const timeline = [
    { label: 'Captura', state: 'done' },
    { label: 'Análisis', state: 'done' },
    { label: 'Traducción', state: 'done' },
    { label: 'Revisión', state: 'current' },
    { label: 'Envío', state: 'pending' },
  ];

  return (
    <div className="relative min-h-screen bg-bg flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col px-8 pt-5 pb-10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[12px] font-bold uppercase text-teal mb-2" style={{ letterSpacing: '.1em' }}>Satélite — Frase Interpretada</div>
            <h1 className="text-[26px] font-extrabold" style={{ letterSpacing: '-.03em' }}>Resultado de la interpretación</h1>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-success-bg rounded-pill text-[12px] font-semibold text-success">
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
            <h3 className="text-[15px] font-bold mb-0.5">Interpretación de señas</h3>
            <p className="text-[13px] text-text-muted">Se detectaron 3 gestos en la secuencia</p>
          </div>
        </div>

        {/* Phrase card */}
        <div className="bg-card border-2 border-success-bg rounded-card pt-7 pb-7 pl-8 pr-7 mb-4 relative animate-slide-up-fade">
          <div className="absolute left-0 top-4 bottom-4 w-1 bg-success rounded-[2px]" />
          <div className="text-[12px] font-bold uppercase text-text-muted mb-3" style={{ letterSpacing: '.08em' }}>Frase interpretada</div>
          <p className="text-[24px] font-semibold" style={{ lineHeight: '1.45' }}>
            "Me gustaría solicitar <span className="text-primary">una mesa para cuatro personas</span>, por favor. También quisiera ver la carta de especialidades."
          </p>
        </div>

        {/* Confidence */}
        <div className="flex items-center gap-3 py-3.5 px-5 bg-card border border-muted rounded-soft mb-4">
          <span className="text-[13px] font-semibold text-text-muted min-w-[100px]">Confianza</span>
          <div className="flex-1 h-1.5 bg-muted rounded-[3px] overflow-hidden">
            <div className="h-full bg-success rounded-[3px]" style={{ width: '92%' }} />
          </div>
          <span className="text-[14px] font-bold text-success min-w-[40px] text-right">92%</span>
        </div>

        {/* Timeline */}
        <div className="flex items-center mb-5 py-3 px-4 bg-card border border-muted rounded-soft">
          {timeline.map((node, i) => (
            <React.Fragment key={node.label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  node.state === 'done' ? 'bg-success-bg text-success' :
                  node.state === 'current' ? 'bg-teal text-white' :
                  'bg-muted text-text-muted'
                }`}>
                  {node.state === 'done' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className="text-[9px] font-semibold text-text-muted uppercase" style={{ letterSpacing: '.04em' }}>{node.label}</span>
              </div>
              {i < timeline.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1.5 mb-4 ${node.state === 'done' ? 'bg-success' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <button className="btn-press flex-1 py-4 bg-muted text-ink text-[15px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Repetir
          </button>
          <button className="btn-press flex-1 py-4 bg-soft-orange text-primary border border-soft-orange-border text-[15px] font-bold rounded-soft hover:bg-[#FDDEC8] transition-colors flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Añadir
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-press flex-1 py-4 bg-success text-white text-[15px] font-bold rounded-soft flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 16px rgba(22,163,74,.2)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Confirmar
          </button>
        </div>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default InterpretedPhraseScreen;
