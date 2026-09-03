import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import type { Category } from '../../types';

const CategorySelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useAppContext();

  // Sample categories - these could be loaded from an API in the future
  const categories: Category[] = [
    { id: '1', name: 'Trámites de Documentación', description: 'Actas, certificados y documentos oficiales' },
    { id: '2', name: 'Servicios Médicos', description: 'Consultas y servicios de salud' },
    { id: '3', name: 'Apoyo Social', description: 'Programas de asistencia social' },
    { id: '4', name: 'Servicios Educativos', description: 'Educación y capacitación' },
    { id: '5', name: 'Trámites Legales', description: 'Asesoría y trámites legales' },
    { id: '6', name: 'Otros Servicios', description: 'Consultas generales' },
  ];

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    navigate(`/detalle/${category.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ¿Cómo podemos atenderle?
          </h1>
          <p className="text-xl text-gray-600">
            Seleccione el tipo de trámite o servicio que necesita
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border-2 border-transparent hover:border-blue-500 text-left min-h-[120px]"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionScreen;
