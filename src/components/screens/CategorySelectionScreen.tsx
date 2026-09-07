import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import Header from '../shared/Header';
import type { Category } from '../../types';

const CategorySelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useAppContext();

  const categories: Category[] = [
    { id: '1', name: 'Trámites de Documentación', description: 'Actas, certificados y documentos oficiales', icon: 'document' },
    { id: '2', name: 'Servicios Médicos', description: 'Consultas y servicios de salud', icon: 'medical' },
    { id: '3', name: 'Apoyo Social', description: 'Programas de asistencia social', icon: 'social' },
    { id: '4', name: 'Servicios Educativos', description: 'Educación y capacitación', icon: 'education' },
    { id: '5', name: 'Trámites Legales', description: 'Asesoría y trámites legales', icon: 'legal' },
    { id: '6', name: 'Otros Servicios', description: 'Consultas generales', icon: 'other' },
  ];

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    navigate(`/detalle/${category.id}`);
  };

  const renderIcon = (icon: string) => {
    const icons: Record<string, React.ReactElement> = {
      document: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      ),
      medical: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      ),
      social: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6zm-12 0a3 3 0 100-6 3 3 0 000 6z" />
      ),
      education: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 008 20c-2.8 0-5.486-.682-7.84-1.879A12.083 12.083 0 01.665 10.578L12 14z M12 14v6" />
      ),
      legal: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      ),
      other: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    };

    return (
      <svg className="w-7 h-7 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icons[icon] || icons.other}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header showConversation={false} />

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -top-24 -right-24 w-80 h-80 rounded-full bg-brand-orange/8 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -left-24 w-96 h-96 rounded-full bg-brand-teal/6 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-8 py-10">
        {/* Heading */}
        <div className="text-center mb-10 animate-fade">
          <p className="card-eyebrow mb-2">Paso 1 · Selección</p>
          <h1 className="text-4xl font-extrabold text-brand-ink mb-3 font-display">
            ¿Cómo podemos atenderle?
          </h1>
          <p className="text-lg text-brand-muted font-body">
            Seleccione el tipo de trámite o servicio que necesita
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className="surface-card btn-press p-6 text-left animate-slideUp"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 bg-gradient-to-br from-brand-teal/12 to-brand-cyan/8 p-3.5 rounded-soft">
                  {renderIcon(category.icon || 'other')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-brand-ink mb-1.5 font-display leading-snug">
                    {category.name}
                  </h3>
                  <p className="text-brand-muted text-sm font-body leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <svg className="w-5 h-5 text-brand-mist shrink-0 mt-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionScreen;
