import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../shared/Logo';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
      <Logo variant="full" className="w-64 sm:w-80 mb-10" />

      <div className="text-lg font-medium text-text-muted mb-3" style={{ letterSpacing: '-.01em' }}>
        Bienvenido a
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 text-ink" style={{ letterSpacing: '-.03em', lineHeight: '1.15' }}>
        <span className="text-primary">Señas a Voces</span>
        <br />
        Academy
      </h1>
      <p className="text-lg sm:text-xl font-normal text-text-muted mb-12 max-w-[520px]" style={{ lineHeight: '1.5' }}>
        Tu asistente de comunicación accesible. Conectamos personas a través de la lengua de señas y la voz.
      </p>

      <button
        onClick={() => navigate('/categorias')}
        className="btn-press w-full max-w-[400px] py-5 px-12 bg-primary text-white text-lg font-bold rounded-soft"
        style={{ letterSpacing: '.04em', boxShadow: '0 6px 20px rgba(217,119,54,.3)' }}
      >
        Iniciar traducción
      </button>

      <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-card border border-muted rounded-pill text-sm font-semibold text-text-muted">
        <span className="w-2 h-2 rounded-full bg-teal" />
        Listo para usar
      </div>
    </div>
  );
};

export default WelcomeScreen;
