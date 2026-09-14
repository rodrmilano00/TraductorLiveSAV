import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../shared/Logo';

const slidingPhrases = [
  { text: 'Habla. Señala. Conversa.', color: 'text-primary' },
  { text: 'Comunicación sin barreras', color: 'text-teal' },
  { text: 'Voz a texto en tiempo real', color: 'text-primary' },
  { text: 'Señas interpretadas al instante', color: 'text-teal' },
];

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % slidingPhrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 overflow-y-auto">
      {/* Logo — static, larger */}
      <div className="mb-6">
        <Logo variant="full" className="w-72 sm:w-96" />
      </div>

      {/* Welcome text */}
      <div className="text-base font-medium text-text-muted mb-2" style={{ letterSpacing: '-.01em' }}>
        Bienvenido a
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4 text-ink text-center" style={{ letterSpacing: '-.03em', lineHeight: '1.15' }}>
        <span className="text-primary">Señas a Voces</span>
        <br />
        Academy
      </h1>

      {/* Sliding phrases — smooth fade only */}
      <div className="h-8 mb-8 flex items-center justify-center overflow-hidden relative w-full max-w-[400px]">
        {slidingPhrases.map((phrase, i) => (
          <div
            key={i}
            className={`absolute text-base font-semibold transition-all duration-1000 ease-in-out ${
              i === phraseIndex ? 'opacity-100' : 'opacity-0'
            } ${phrase.color}`}
            style={{ letterSpacing: '-.01em' }}
          >
            {phrase.text}
          </div>
        ))}
      </div>

      {/* Icons row — static, no bouncing */}
      <div className="flex items-center gap-5 mb-8">
        {/* Voice icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-soft-orange flex items-center justify-center text-primary">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xs font-bold text-text-muted">Voz</span>
        </div>

        {/* Arrow */}
        <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>

        {/* Sign icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-soft-teal flex items-center justify-center text-teal">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <span className="text-xs font-bold text-text-muted">Señas</span>
        </div>

        {/* Arrow */}
        <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>

        {/* Chat icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center text-success">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-text-muted">Conversa</span>
        </div>
      </div>

      {/* Privacy consent — checkbox separate from link */}
      <div className="w-full max-w-[480px] mb-5">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setAcceptedPrivacy(!acceptedPrivacy)}
            className={`w-7 h-7 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              acceptedPrivacy ? 'bg-primary border-primary' : 'border-muted bg-card hover:border-primary'
            }`}
            aria-label="Aceptar política de privacidad"
          >
            {acceptedPrivacy && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className="text-sm text-text-muted" style={{ lineHeight: '1.5' }}>
            Acepto el tratamiento de mis datos biométricos (voz e imagen) conforme a la{' '}
            <button
              onClick={() => navigate('/privacidad')}
              className="text-primary font-semibold underline hover:text-[#B85C2D] transition-colors"
            >
              Política de Privacidad
            </button>
            .
          </span>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => acceptedPrivacy && navigate('/categorias')}
        disabled={!acceptedPrivacy}
        className={`btn-press w-full max-w-[480px] py-5 px-12 text-lg font-bold rounded-soft transition-all ${
          acceptedPrivacy
            ? 'bg-primary text-white cursor-pointer'
            : 'bg-muted text-text-muted cursor-not-allowed'
        }`}
        style={{ letterSpacing: '.04em', boxShadow: acceptedPrivacy ? '0 6px 20px rgba(217,119,54,.3)' : 'none' }}
      >
        Iniciar traducción
      </button>

      {/* Status badge */}
      <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-card border border-muted rounded-pill text-sm font-semibold text-text-muted">
        <span className="w-2 h-2 rounded-full bg-teal animate-pulse-opacity" />
        Listo para usar
      </div>
    </div>
  );
};

export default WelcomeScreen;
