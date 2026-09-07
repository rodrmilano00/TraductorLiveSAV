import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import { useLSMRecognition } from '../../../hooks/useLSMRecognition';
import type { HandLandmarks } from '../../../types';
import StatusBar from '../../shared/StatusBar';
import BottomIndicator from '../../shared/BottomIndicator';

const ProcessingScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addConversationMessage } = useAppContext();
  const { recognize, error } = useLSMRecognition();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const processLandmarks = async () => {
      const landmarks = location.state?.landmarks as HandLandmarks;
      if (!landmarks) { navigate('/lsm/captura'); return; }

      const stepInterval = setInterval(() => {
        setCurrentStep(prev => Math.min(prev + 1, 2));
      }, 2000);

      try {
        const result = await recognize(landmarks);
        clearInterval(stepInterval);
        setCurrentStep(2);

        const interpretedText = result.letter;
        addConversationMessage({
          type: 'user',
          text: `Letra reconocida: ${interpretedText}${result.confidence ? ` (${Math.round(result.confidence * 100)}%)` : ''}`,
        });

        setTimeout(() => {
          navigate('/lsm/resultado', { state: { result: interpretedText, confidence: result.confidence, topK: result.top_k } });
        }, 800);
      } catch (err) {
        clearInterval(stepInterval);
        console.error('Error processing landmarks:', err);
        setTimeout(() => navigate('/lsm/captura'), 2000);
      }
    };

    processLandmarks();
  }, [location.state, recognize, navigate, addConversationMessage]);

  const steps = [
    { title: 'Señas capturadas', desc: 'Cámara procesó el movimiento correctamente' },
    { title: 'Interpretando lenguaje', desc: 'Analizando gestos y convirtiendo a texto' },
    { title: 'Generando respuesta', desc: 'Preparando la frase traducida' },
  ];

  return (
    <div className="relative min-h-screen bg-app flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col items-center justify-center px-12 py-10 text-center">
        <div className="text-[12px] font-bold uppercase text-brand-muted mb-8" style={{ letterSpacing: '0.1em' }}>Procesando</div>

        {/* Spinner ring — 80x80 */}
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-orange border-r-brand-orange animate-spin" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-orange animate-pulse-opacity" />
        </div>

        <h1 className="text-[28px] font-extrabold mb-2" style={{ letterSpacing: '-0.03em' }}>Procesando...</h1>
        <p className="text-[16px] text-brand-muted mb-10 max-w-[400px]" style={{ lineHeight: '1.5' }}>
          Estamos interpretando sus señas y preparando la respuesta. Esto solo tomará un momento.
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-3 w-full max-w-[420px] mb-10">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div
                key={i}
                className={`flex items-center gap-3.5 px-5 py-4 bg-white border rounded-soft text-left transition-all ${
                  isActive ? 'border-brand-orange bg-brand-softOrange' :
                  isDone ? 'border-brand-success bg-brand-successBg' :
                  'border-muted'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[14px] font-bold ${
                  isDone ? 'bg-brand-success text-white' :
                  isActive ? 'bg-brand-orange text-white' :
                  'bg-muted text-brand-muted'
                }`}>
                  {isDone ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-bold mb-0.5">{step.title}</h4>
                  <p className="text-[12px] text-brand-muted">{step.desc}</p>
                </div>
                {isDone && (
                  <svg className="w-4 h-4 text-brand-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Dots loading */}
        <div className="flex gap-2 mb-5">
          <div className="w-3 h-3 rounded-full bg-brand-orange animate-dot-bounce" />
          <div className="w-3 h-3 rounded-full bg-brand-orange animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full bg-brand-orange animate-dot-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        <button
          onClick={() => navigate('/lsm/captura')}
          className="btn-press px-8 py-3.5 bg-transparent text-brand-muted text-[14px] font-semibold border border-muted rounded-soft hover:bg-muted hover:text-brand-ink transition-colors"
        >
          Cancelar
        </button>

        {error && (
          <div className="mt-5 px-4 py-3 bg-brand-softRed border border-brand-softRedBorder text-brand-red text-sm rounded-soft max-w-md">
            <p className="font-bold mb-1">Error en el procesamiento</p>
            <p className="text-xs">{error}</p>
          </div>
        )}
      </div>

      <BottomIndicator />
    </div>
  );
};

export default ProcessingScreen;
