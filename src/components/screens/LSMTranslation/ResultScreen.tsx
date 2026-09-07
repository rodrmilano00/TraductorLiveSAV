import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import StatusBar from '../../shared/StatusBar';
import BottomIndicator from '../../shared/BottomIndicator';

const ResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addConversationMessage } = useAppContext();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const result = location.state?.result as string;
  const confidence = location.state?.confidence as number;
  const topK = location.state?.topK as Array<{ letter: string; confidence: number }>;

  const handleRepeat = () => {
    if (!result || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(result);
    u.lang = 'es-MX'; u.rate = 0.9;
    u.onstart = () => setIsPlayingAudio(true);
    u.onend = () => setIsPlayingAudio(false);
    u.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(u);
  };

  const handleAdd = () => navigate('/lsm/captura');
  const handleConfirm = () => {
    if (result) {
      addConversationMessage({ type: 'assistant', text: `Resultado: ${result}` });
      navigate('/voz');
    }
  };

  useEffect(() => {
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <button onClick={() => navigate('/lsm/captura')} className="btn-press bg-brand-orange text-white px-6 py-3 rounded-soft font-bold">
          Volver a capturar
        </button>
      </div>
    );
  }

  const confidencePct = confidence ? Math.round(confidence * 100) : 92;

  return (
    <div className="relative min-h-screen bg-app flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col px-8 py-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[12px] font-bold uppercase text-brand-teal mb-2" style={{ letterSpacing: '0.1em' }}>Frase Interpretada</div>
            <h1 className="text-[26px] font-extrabold" style={{ letterSpacing: '-0.03em' }}>Resultado de la interpretación</h1>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-successBg rounded-pill text-[12px] font-semibold text-brand-success">
            <span className="w-2 h-2 rounded-full bg-brand-success" />
            Interpretación exitosa
          </div>
        </div>

        {/* Source card */}
        <div className="flex items-center gap-3.5 p-4 bg-white border border-muted rounded-card mb-4">
          <div className="w-11 h-11 rounded-soft bg-muted flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-brand-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold mb-0.5">Interpretación de señas</h3>
            <p className="text-[13px] text-brand-muted">Se detectaron gestos en la secuencia</p>
          </div>
        </div>

        {/* Phrase card — green left border, slide-up animation */}
        <div className="bg-white border-2 border-brand-successBg rounded-card p-7 pl-8 mb-4 relative animate-slide-up-fade">
          <div className="absolute left-0 top-4 bottom-4 w-1 bg-brand-success rounded-[2px]" />
          <div className="text-[12px] font-bold uppercase text-brand-muted mb-3" style={{ letterSpacing: '0.08em' }}>Frase interpretada</div>
          <p className="text-[24px] font-semibold" style={{ lineHeight: '1.45' }}>"{result}"</p>
        </div>

        {/* Confidence */}
        <div className="flex items-center gap-3 p-3.5 bg-white border border-muted rounded-soft mb-4">
          <span className="text-[13px] font-semibold text-brand-muted min-w-[100px]">Confianza</span>
          <div className="flex-1 h-1.5 bg-muted rounded-[3px] overflow-hidden">
            <div className="h-full bg-brand-success rounded-[3px]" style={{ width: `${confidencePct}%` }} />
          </div>
          <span className="text-[14px] font-bold text-brand-success min-w-[40px] text-right">{confidencePct}%</span>
        </div>

        {/* Timeline */}
        <div className="flex items-center mb-5 px-4 py-3 bg-white border border-muted rounded-soft">
          {['Captura', 'Análisis', 'Traducción', 'Revisión', 'Envío'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  i < 3 ? 'bg-brand-successBg text-brand-success' :
                  i === 3 ? 'bg-brand-teal text-white' :
                  'bg-muted text-brand-muted'
                }`}>
                  {i < 3 ? (
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className="text-[9px] font-semibold text-brand-muted uppercase" style={{ letterSpacing: '0.04em' }}>{label}</span>
              </div>
              {i < 4 && <div className={`flex-1 h-0.5 mx-1.5 mb-4 ${i < 3 ? 'bg-brand-success' : 'bg-muted'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Top K alternatives */}
        {topK && topK.length > 1 && (
          <div className="bg-white border border-muted rounded-soft p-3.5 mb-4">
            <h3 className="text-[12px] font-bold mb-2">Otras posibles letras:</h3>
            <div className="flex gap-1.5 flex-wrap">
              {topK.slice(1, 4).map((alt, i) => (
                <span key={i} className="bg-white px-2.5 py-1 rounded-pill text-xs border border-muted font-semibold">
                  {alt.letter} <span className="text-brand-muted">· {Math.round(alt.confidence * 100)}%</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={handleRepeat}
            className="btn-press flex-1 py-4 bg-muted text-brand-ink text-[15px] font-bold rounded-soft hover:bg-[#E5E2DB] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="1 4 1 10 7 10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            {isPlayingAudio ? 'Sonando...' : 'Repetir'}
          </button>
          <button
            onClick={handleAdd}
            className="btn-press flex-1 py-4 bg-brand-softOrange text-brand-orange border border-brand-softOrangeBorder text-[15px] font-bold rounded-soft hover:bg-[#FDDEC8] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
            Añadir
          </button>
          <button
            onClick={handleConfirm}
            className="btn-press flex-1 py-4 bg-brand-success text-white text-[15px] font-bold rounded-soft transition-all flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 16px rgba(22, 163, 74, 0.2)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Confirmar
          </button>
        </div>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default ResultScreen;
