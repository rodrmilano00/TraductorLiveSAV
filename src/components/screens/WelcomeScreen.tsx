import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/categorias');
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="inline-block p-4 bg-brand-teal rounded-full mb-6">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-brand-ink mb-4 font-display">
            Bienvenido/a a DIF
          </h1>
          <p className="text-xl text-brand-muted mb-8 font-body">
            Sistema de Traducción de Lengua de Señas Mexicana
          </p>
        </div>

        <button
          onClick={handleStart}
          className="bg-brand-teal hover:bg-brand-deep text-white font-bold text-2xl px-12 py-6 rounded-soft shadow-soft hover:shadow-lg transition-all duration-200 transform hover:scale-105 min-h-[64px] font-display"
          style={{ minHeight: '64px' }}
        >
          EMPEZAR
        </button>

        <div className="mt-12 text-brand-muted text-sm font-body">
          <p>Orientación horizontal recomendada para mejor experiencia</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
