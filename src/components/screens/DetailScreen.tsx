import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import StatusIndicator from '../shared/StatusIndicator';

const DetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Simulate video/content playback
    const timer = setTimeout(() => {
      setIsPlaying(false);
    }, 3000); // 3 seconds simulated playback

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/voz');
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No se seleccionó ninguna categoría</p>
          <button
            onClick={() => navigate('/categorias')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Volver a categorías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header section with category details */}
        <div className="bg-white rounded-soft shadow-soft p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-brand-teal/10 p-4 rounded-lg">
              <svg className="w-12 h-12 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-ink mb-2 font-display">
                {selectedCategory.name}
              </h1>
              <p className="text-lg text-brand-muted font-body">
                {selectedCategory.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main content box with playback status */}
        <div className="bg-white rounded-soft shadow-soft p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-brand-ink mb-4 font-display">
              Información del trámite
            </h2>
            
            {/* Simulated video/content preview area */}
            <div className="bg-brand-cream rounded-lg p-8 mb-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="bg-brand-teal p-6 rounded-full mx-auto mb-4 w-24 h-24 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-brand-muted text-lg font-body">
                  {isPlaying ? 'Reproduciendo video informativo...' : 'Video completado'}
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-center mb-6">
              <StatusIndicator type="playing" text={isPlaying ? "Reproduciendo..." : "Completado"} />
            </div>

            <div className="bg-brand-teal/10 border-l-4 border-brand-teal p-4 rounded-r-lg">
              <p className="text-brand-ink font-body">
                Este es un video explicativo sobre los requisitos y pasos para realizar el trámite de 
                <strong> {selectedCategory.name}</strong>. Por favor revise la información antes de continuar.
              </p>
            </div>
          </div>

          {/* Continue button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={isPlaying}
              className="bg-brand-teal hover:bg-brand-deep disabled:bg-brand-muted text-white font-bold text-xl px-12 py-4 rounded-soft shadow-soft hover:shadow-lg transition-all duration-200 min-h-[64px] font-display"
              style={{ minHeight: '64px' }}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailScreen;
