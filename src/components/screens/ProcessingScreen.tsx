import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProcessingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 2) {
          clearInterval(interval);
          setTimeout(() => navigate('/interpretada'), 1000);
          return 2;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [navigate]);

  const steps = [
    { title: 'Señas capturadas', desc: 'Cámara procesó el movimiento correctamente' },
    { title: 'Interpretando lenguaje', desc: 'Analizando gestos y convirtiendo a texto' },
    { title: 'Generando respuesta', desc: 'Preparando la frase traducida' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 text-center">
      {/* Spinner ring */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary animate-pulse-opacity" />
      </div>

      <h1 className="font-display text-3xl font-extrabold mb-2 text-ink" style={{ letterSpacing: '-.03em' }}>Procesando...</h1>
      <p className="text-base text-text-muted mb-10 max-w-[400px]" style={{ lineHeight: '1.5' }}>
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
              className={`flex items-center gap-3.5 px-5 py-4 surface-card text-left transition-all ${
                isActive ? 'border-primary bg-soft-orange' :
                isDone ? 'border-success bg-success-bg' :
                'border-muted'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                isDone ? 'bg-success text-white' :
                isActive ? 'bg-primary text-white' :
                'bg-muted text-text-muted'
              }`}>
                {isDone ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : i + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-display text-sm font-bold mb-0.5 text-ink">{step.title}</h4>
                <p className="text-xs text-text-muted">{step.desc}</p>
              </div>
              {isDone && (
                <svg className="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/senas')}
        className="btn-press px-8 py-3.5 bg-transparent text-text-muted text-sm font-semibold border border-muted rounded-soft hover:bg-muted hover:text-ink transition-colors"
      >
        Cancelar
      </button>
    </div>
  );
};

export default ProcessingScreen;
