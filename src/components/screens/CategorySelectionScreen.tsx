import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';
import type { Category } from '../../types';

const CategorySelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useAppContext();
  const [selectedId, setSelectedId] = useState<string | null>('1');

  const categories: Category[] = [
    { id: '1', name: 'Información general', description: 'Consultas sobre el establecimiento, horarios o servicios' },
    { id: '2', name: 'Hacer una reserva', description: 'Reservar mesa, habitación o espacio disponible' },
    { id: '3', name: 'Realizar un pedido', description: 'Solicitar alimentos, bebidas o productos' },
    { id: '4', name: 'Otro servicio', description: 'Cualquier otra solicitud o necesidad específica' },
  ];

  const handleSelect = (cat: Category) => setSelectedId(cat.id);

  const handleConfirm = () => {
    const cat = categories.find(c => c.id === selectedId);
    if (cat) {
      setSelectedCategory(cat);
      navigate(`/detalle/${cat.id}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-app flex flex-col overflow-hidden">
      <StatusBar />

      {/* Top nav */}
      <div className="flex items-center justify-between px-8 py-3 bg-brand-teal shrink-0">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.5}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} strokeLinecap="round" />
          </svg>
          <span className="text-white text-[14px] font-bold" style={{ letterSpacing: '0.02em' }}>Señas a Voces</span>
        </div>
        <div className="flex gap-1">
          <div className="px-4 py-2 rounded-pill text-[13px] font-semibold bg-white/15 text-white cursor-pointer">Opciones</div>
          <div className="px-4 py-2 rounded-pill text-[13px] font-semibold text-white/60 cursor-pointer hover:text-white transition-colors">Historial</div>
          <div className="px-4 py-2 rounded-pill text-[13px] font-semibold text-white/60 cursor-pointer hover:text-white transition-colors">Ayuda</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8 overflow-y-auto">
        <div className="text-[12px] font-bold uppercase text-brand-orange mb-2" style={{ letterSpacing: '0.1em' }}>Pantalla 02</div>
        <h1 className="text-[34px] font-extrabold mb-1.5" style={{ letterSpacing: '-0.03em', lineHeight: '1.2' }}>
          ¿Cómo podemos <span className="text-brand-orange">atenderle</span>?
        </h1>
        <p className="text-[16px] text-brand-muted mb-8" style={{ lineHeight: '1.5' }}>
          Seleccione el servicio que necesita para comenzar la atención.
        </p>

        {/* Option list */}
        <div className="flex flex-col gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className={`btn-press flex items-center gap-4 p-5 bg-white border-2 rounded-card transition-all text-left ${
                selectedId === cat.id
                  ? 'border-brand-orange bg-brand-softOrange'
                  : 'border-muted hover:border-brand-orange hover:bg-brand-softOrange'
              }`}
              style={selectedId === cat.id ? { boxShadow: '0 2px 12px rgba(224, 112, 43, 0.1)' } : {}}
            >
              <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center text-[18px] font-extrabold shrink-0 transition-colors ${
                selectedId === cat.id ? 'bg-brand-orange text-white' : 'bg-muted text-brand-muted'
              }`}>
                {cat.id}
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-bold mb-0.5">{cat.name}</h3>
                <p className="text-[13px] text-brand-muted">{cat.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selectedId === cat.id ? 'bg-brand-orange border-brand-orange' : 'border-muted'
              }`}>
                {selectedId === cat.id && (
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-press flex-1 py-4 bg-muted text-brand-ink text-[15px] font-semibold rounded-soft hover:bg-[#E5E2DB] transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            className="btn-press flex-1 py-4 bg-brand-orange text-white text-[15px] font-bold rounded-soft transition-all"
            style={{ boxShadow: '0 4px 16px rgba(224, 112, 43, 0.25)' }}
          >
            Seleccionar
          </button>
        </div>
      </div>

      <BottomIndicator />
    </div>
  );
};

export default CategorySelectionScreen;
