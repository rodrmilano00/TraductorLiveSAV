import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../shared/Logo';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/categorias');
  };

  return (
    <div className="relative min-h-screen bg-brand-cream flex flex-col items-center justify-center overflow-hidden p-8">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-teal/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-cyan/8 blur-3xl" />

      {/* Wave divider at bottom */}
      <div className="wave-divider animate-wave-drift bg-wave-soft bg-cover bg-bottom" />

      <div className="relative z-10 text-center max-w-3xl animate-float-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-teal/10 rounded-full blur-2xl scale-110" />
            <img
              src="/logo-senas-a-voces.png"
              alt="Señas a Voces"
              className="relative h-40 w-auto object-contain drop-shadow-sm"
              draggable={false}
            />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="card-eyebrow mb-3">DIF · Sistema de Traducción</p>

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-brand-ink mb-4 font-display leading-tight">
          Bienvenido/a
        </h1>

        <p className="text-xl text-brand-muted mb-2 font-body leading-relaxed max-w-xl mx-auto">
          Traducción de voz a texto y de <strong className="text-brand-teal">Lengua de Señas Mexicana</strong> a texto y voz.
        </p>

        <p className="text-base text-brand-soft mb-10 font-body">
          Comunicación accesible para todas las personas.
        </p>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="btn-premium bg-brand-teal hover:bg-brand-deep text-white font-bold text-2xl px-16 py-5 rounded-softer shadow-soft min-h-[64px] font-display inline-flex items-center gap-3"
        >
          EMPEZAR
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        {/* Footer hint */}
        <div className="mt-12 flex items-center justify-center gap-2 text-brand-muted text-sm font-body">
          <svg className="w-4 h-4 text-brand-teal/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0 0l6-6m-6 6l-6-6" />
          </svg>
          <span>Orientación horizontal recomendada</span>
        </div>
      </div>

      {/* Corner brand mark */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-60">
        <Logo variant="isotipo" size="sm" />
        <span className="text-xs font-body text-brand-muted font-semibold">Señas a Voces</span>
      </div>
    </div>
  );
};

export default WelcomeScreen;
