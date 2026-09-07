import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import Header from '../shared/Header';
import StatusIndicator from '../shared/StatusIndicator';

const DetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/voz');
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="surface-card p-10 text-center max-w-md animate-scaleIn">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-brand-orange/15 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-brand-ink mb-4 font-display">No se seleccionó ninguna categoría</p>
          <button
            onClick={() => navigate('/categorias')}
            className="btn-premium bg-brand-teal hover:bg-brand-deep text-white font-semibold px-6 py-3 rounded-soft font-body"
          >
            Volver a categorías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header showConversation={false} />

      {/* Decorative blob */}
      <div className="pointer-events-none fixed -top-20 -right-20 w-72 h-72 rounded-full bg-brand-teal/6 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-8 py-8">
        {/* Category header card */}
        <div className="surface-card p-7 mb-6 animate-fade">
          <div className="flex items-center gap-5">
            <div className="shrink-0 bg-gradient-to-br from-brand-teal to-brand-deep p-4 rounded-soft shadow-soft">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="card-eyebrow mb-1">Trámite seleccionado</p>
              <h1 className="text-2xl font-extrabold text-brand-ink mb-1 font-display leading-tight">
                {selectedCategory.name}
              </h1>
              <p className="text-base text-brand-muted font-body">
                {selectedCategory.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content card */}
        <div className="surface-card p-8 animate-slideUp">
          <h2 className="text-xl font-bold text-brand-ink mb-5 font-display">
            Información del trámite
          </h2>

          {/* Video preview area */}
          <div className="relative bg-gradient-to-br from-brand-deep to-brand-teal rounded-softer overflow-hidden mb-6 min-h-[280px] flex items-center justify-center">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-brand-cyan/30 blur-2xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-brand-orange/30 blur-2xl" />
            </div>

            <div className="relative text-center">
              <div className={`mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-white/20 animate-pulse-subtle' : 'bg-brand-mint'}`}>
                {isPlaying ? (
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-brand-deep" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
              <p className="text-white/90 text-lg font-body font-medium">
                {isPlaying ? 'Reproduciendo video informativo...' : 'Video completado'}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center mb-6">
            <StatusIndicator type="playing" text={isPlaying ? 'Reproduciendo...' : 'Completado'} />
          </div>

          {/* Info callout */}
          <div className="bg-brand-teal/8 border-l-4 border-brand-teal p-4 rounded-r-soft mb-7">
            <p className="text-brand-ink font-body leading-relaxed">
              Este es un video explicativo sobre los requisitos y pasos para realizar el trámite de
              <strong className="text-brand-teal"> {selectedCategory.name}</strong>. Por favor revise la información antes de continuar.
            </p>
          </div>

          {/* Continue button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={isPlaying}
              className="btn-premium bg-brand-teal hover:bg-brand-deep disabled:bg-brand-muted disabled:cursor-not-allowed text-white font-bold text-lg px-12 py-4 rounded-softer shadow-soft min-h-[64px] font-display inline-flex items-center gap-3"
            >
              Continuar
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailScreen;
