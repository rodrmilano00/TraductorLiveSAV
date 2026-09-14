import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';
import Spectrum from '../shared/Spectrum';

const VoiceInputScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-bg flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 grid grid-cols-2 gap-0 px-6 pb-6 overflow-hidden">
        {/* Left panel */}
        <div className="flex flex-col pr-5 border-r border-muted overflow-y-auto">
          {/* Orientation badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-muted rounded-pill text-[11px] font-semibold text-text-muted w-fit mb-4 mt-2">
            <div className="w-7 h-3.5 border-2 border-text-muted rounded-[3px]" />
            Modo trabajador — Tableta rotada
          </div>
          <div className="text-[11px] font-bold uppercase text-primary mb-2" style={{ letterSpacing: '.1em' }}>Pantalla 04</div>

          {/* Recording badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-bg border border-red-border rounded-pill text-[13px] font-bold text-red mb-4 w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-red animate-rec-pulse" />
            Grabando...
          </div>

          {/* Spectrum */}
          <Spectrum />

          {/* Transcript card */}
          <div className="flex-1 bg-card border border-muted rounded-card p-5 flex flex-col">
            <div className="text-[11px] font-bold uppercase text-text-muted mb-2.5" style={{ letterSpacing: '.08em' }}>
              Transcripción en tiempo real
            </div>
            <div className="text-[20px] font-medium flex-1" style={{ lineHeight: '1.6' }}>
              Su pedido será atendido en breve, por favor espere un momento mientras verificamos la disponibilidad
              <span className="inline-block w-0.5 h-5 bg-teal ml-0.5 animate-blink align-text-bottom" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 mt-4">
            <button
              onClick={() => navigate('/confirmacion')}
              className="btn-press flex-[1.5] py-3.5 px-6 bg-teal text-white text-[15px] font-bold rounded-soft flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 16px rgba(17,82,90,.2)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Confirmar
            </button>
            <button className="btn-press flex-1 py-3.5 px-6 bg-muted text-ink text-[15px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors">
              Reproducir
            </button>
            <button className="btn-press py-3.5 px-6 bg-red-bg text-red border border-red-border text-[15px] font-bold rounded-soft hover:bg-[#FEE2E2] transition-colors">
              Terminar
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col pl-5 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase text-teal mb-2" style={{ letterSpacing: '.1em' }}>Vista del trabajador</div>
          <h2 className="text-[22px] font-bold mb-1">Entrada por voz</h2>
          <p className="text-[14px] text-text-muted mb-5">Hable para transcribir su respuesta al cliente.</p>

          {/* History card */}
          <div className="bg-card border border-muted rounded-card overflow-hidden mb-4 flex-1">
            <div className="py-3.5 px-4.5 border-b border-muted text-[12px] font-bold uppercase text-text-muted" style={{ letterSpacing: '.06em' }}>
              Conversación
            </div>
            <div className="p-2">
              <div className="py-3 px-3.5 rounded-soft mb-1 text-[14px] flex items-start gap-2.5 bg-soft-orange">
                <span className="text-[11px] font-bold text-teal uppercase pt-0.5 min-w-[60px]" style={{ letterSpacing: '.04em' }}>Cliente</span>
                <span className="flex-1">"Realizar un pedido para llevar, por favor"</span>
              </div>
              <div className="py-3 px-3.5 rounded-soft text-[14px] flex items-start gap-2.5 bg-soft-teal">
                <span className="text-[11px] font-bold text-teal uppercase pt-0.5 min-w-[60px]" style={{ letterSpacing: '.04em' }}>Trabajador</span>
                <span className="flex-1">"Su pedido será atendido en breve..."</span>
              </div>
            </div>
          </div>

          {/* Orientation badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-muted rounded-pill text-[11px] font-semibold text-text-muted w-fit">
            <div className="w-7 h-3.5 border-2 border-text-muted rounded-[3px]" />
            La tableta está orientada horizontalmente para el trabajador
          </div>
        </div>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default VoiceInputScreen;
