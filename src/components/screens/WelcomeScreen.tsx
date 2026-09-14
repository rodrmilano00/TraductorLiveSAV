import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';
import Logo from '../shared/Logo';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-bg flex flex-col overflow-hidden">
      <StatusBar />

      <div className="flex flex-col items-center justify-center flex-1 px-[60px] text-center">
        {/* Logo */}
        <Logo variant="crop" className="w-48 sm:w-56 mb-8" />

        <div className="text-[17px] font-medium text-text-muted mb-3" style={{ letterSpacing: '-.01em' }}>
          Bienvenido a
        </div>
        <h1 className="font-display text-[42px] font-extrabold mb-3 text-ink" style={{ letterSpacing: '-.03em', lineHeight: '1.15' }}>
          <span className="text-primary">Señas a Voces</span>
          <br />
          Academy
        </h1>
        <p className="text-[18px] font-normal text-text-muted mb-12 max-w-[480px]" style={{ lineHeight: '1.5' }}>
          Tu asistente de comunicación accesible. Conectamos personas a través de la lengua de señas y la voz.
        </p>

        <button
          onClick={() => navigate('/categorias')}
          className="btn-press w-full max-w-[380px] py-5 px-12 bg-primary text-white text-[18px] font-bold rounded-soft"
          style={{ letterSpacing: '.06em', boxShadow: '0 6px 20px rgba(217,119,54,.3)' }}
        >
          Empezar
        </button>
      </div>

      {/* Accessibility badge */}
      <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-card border border-muted rounded-pill text-[12px] font-semibold text-text-muted">
        <span className="w-2 h-2 rounded-full bg-teal" />
        Accesibilidad habilitada
      </div>

      <BottomIndicator />
    </div>
  );
};

export default WelcomeScreen;
