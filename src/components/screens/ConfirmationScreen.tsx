import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';

const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();

  const timeline = [
    { num: 1, state: 'done' },
    { num: 2, state: 'done' },
    { num: 3, state: 'done' },
    { num: 4, state: 'current' },
    { num: 5, state: 'pending' },
  ];

  return (
    <div className="relative min-h-screen bg-bg flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col items-center justify-center px-12 pt-10 pb-10 text-center">
        <div className="text-[12px] font-bold uppercase text-teal mb-4" style={{ letterSpacing: '.1em' }}>Pantalla 05</div>

        {/* Success icon */}
        <div className="w-[88px] h-[88px] rounded-full bg-success-bg flex items-center justify-center mb-7 animate-scale-in-bounce">
          <svg className="w-[44px] h-[44px] text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-display text-[28px] font-extrabold mb-2 text-ink" style={{ letterSpacing: '-.03em' }}>
          Frase <span className="text-success">confirmada</span>
        </h1>
        <p className="text-[16px] text-text-muted mb-8 max-w-[400px]" style={{ lineHeight: '1.5' }}>
          La frase ha sido registrada exitosamente y será enviada al cliente para su comprensión.
        </p>

        {/* Phrase display */}
        <div className="w-full max-w-[520px] bg-card border-2 border-success-bg rounded-card py-7 px-8 mb-8 relative">
          <div className="absolute left-0 top-4 bottom-4 w-1 bg-success rounded-[2px]" />
          <div className="text-[12px] font-bold uppercase text-text-muted mb-2.5 text-left" style={{ letterSpacing: '.08em' }}>
            Frase confirmada
          </div>
          <p className="text-[24px] font-semibold text-left" style={{ lineHeight: '1.4' }}>
            "Su pedido será atendido en breve, por favor espere un momento mientras verificamos la disponibilidad"
          </p>
        </div>

        {/* Confirmed by */}
        <div className="flex items-center justify-center gap-2.5 mb-9 text-[13px] text-text-muted">
          <div className="w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center text-[12px] font-bold">MC</div>
          Confirmado por María C. — Trabajadora
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full max-w-[520px]">
          <button
            onClick={() => navigate('/voz')}
            className="btn-press flex-1 py-[18px] bg-muted text-ink text-[16px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver
          </button>
          <button
            onClick={() => navigate('/senas')}
            className="btn-press flex-1 py-[18px] bg-success text-white text-[16px] font-bold rounded-soft flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 16px rgba(13,92,111,.25)' }}
          >
            Continuar
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 mt-10 py-3 px-5 bg-card border border-muted rounded-pill">
          {timeline.map((step, i) => (
            <React.Fragment key={step.num}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step.state === 'done' ? 'bg-success-bg text-success' :
                step.state === 'current' ? 'bg-primary text-white' :
                'bg-muted text-text-muted'
              }`}>
                {step.state === 'done' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step.num}
              </div>
              {i < timeline.length - 1 && (
                <div className={`w-6 h-0.5 ${step.state === 'done' ? 'bg-success' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default ConfirmationScreen;
