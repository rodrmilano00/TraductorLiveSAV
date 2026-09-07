import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';

const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phrase = (location.state?.phrase as string) || '';

  return (
    <div className="relative min-h-screen bg-app flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col items-center justify-center px-12 py-10 text-center">
        <div className="text-[12px] font-bold uppercase text-brand-teal mb-4" style={{ letterSpacing: '0.1em' }}>Pantalla 05</div>

        {/* Success icon — 88x88 with scale-in-bounce animation */}
        <div
          className="w-[88px] h-[88px] rounded-full bg-brand-successBg flex items-center justify-center mb-7 animate-scale-in-bounce"
        >
          <svg className="w-[44px] h-[44px] text-brand-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-[28px] font-extrabold mb-2" style={{ letterSpacing: '-0.03em' }}>
          Frase <span className="text-brand-success">confirmada</span>
        </h1>
        <p className="text-[16px] text-brand-muted mb-8 max-w-[400px]" style={{ lineHeight: '1.5' }}>
          La frase ha sido registrada exitosamente y será enviada al cliente para su comprensión.
        </p>

        {/* Phrase display — green left border */}
        <div className="w-full max-w-[520px] bg-white border-2 border-brand-successBg rounded-card py-7 px-8 mb-8 relative">
          <div className="absolute left-0 top-4 bottom-4 w-1 bg-brand-success rounded-[2px]" />
          <div className="text-[12px] font-bold uppercase text-brand-muted mb-2.5 text-left" style={{ letterSpacing: '0.08em' }}>
            Frase confirmada
          </div>
          <p className="text-[24px] font-semibold text-left" style={{ lineHeight: '1.4' }}>"{phrase}"</p>
        </div>

        {/* Confirmed by */}
        <div className="flex items-center justify-center gap-2.5 mb-9 text-[13px] text-brand-muted">
          <div className="w-7 h-7 rounded-full bg-brand-teal text-white flex items-center justify-center text-[12px] font-bold">T</div>
          Confirmado por Trabajador
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full max-w-[520px]">
          <button
            onClick={() => navigate('/voz')}
            className="btn-press flex-1 py-[18px] bg-muted text-brand-ink text-[16px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver
          </button>
          <button
            onClick={() => navigate('/lsm/captura')}
            className="btn-press flex-1 py-[18px] bg-brand-success text-white text-[16px] font-bold rounded-soft transition-all flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 16px rgba(22, 163, 74, 0.25)' }}
          >
            Continuar
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 mt-10 px-5 py-3 bg-white border border-muted rounded-pill">
          <div className="w-7 h-7 rounded-full bg-brand-successBg text-brand-success flex items-center justify-center text-[11px] font-bold">1</div>
          <div className="w-6 h-0.5 bg-brand-success" />
          <div className="w-7 h-7 rounded-full bg-brand-successBg text-brand-success flex items-center justify-center text-[11px] font-bold">2</div>
          <div className="w-6 h-0.5 bg-brand-success" />
          <div className="w-7 h-7 rounded-full bg-brand-successBg text-brand-success flex items-center justify-center text-[11px] font-bold">3</div>
          <div className="w-6 h-0.5 bg-brand-success" />
          <div className="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center text-[11px] font-bold">4</div>
          <div className="w-6 h-0.5 bg-muted" />
          <div className="w-7 h-7 rounded-full bg-muted text-brand-muted flex items-center justify-center text-[11px] font-bold">5</div>
        </div>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default ConfirmationScreen;
