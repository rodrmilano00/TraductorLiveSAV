import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../shared/StatusBar';
import BottomIndicator from '../shared/BottomIndicator';
import TopNav from '../shared/TopNav';

const options = [
  { id: 1, title: 'Información general', desc: 'Consultas sobre el establecimiento, horarios o servicios' },
  { id: 2, title: 'Hacer una reserva', desc: 'Reservar mesa, habitación o espacio disponible' },
  { id: 3, title: 'Realizar un pedido', desc: 'Solicitar alimentos, bebidas o productos' },
  { id: 4, title: 'Otro servicio', desc: 'Cualquier otra solicitud o necesidad específica' },
];

const CategorySelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);

  return (
    <div className="relative min-h-screen bg-bg flex flex-col overflow-hidden">
      <StatusBar />
      <TopNav activeTab="Opciones" />

      {/* Content */}
      <div className="flex-1 px-8 pt-8 pb-10 overflow-y-auto">
        <div className="text-xs font-bold uppercase text-secondary mb-2" style={{ letterSpacing: '.1em' }}>Pantalla 02</div>
        <h1 className="font-display text-[34px] font-extrabold mb-1.5 text-ink" style={{ letterSpacing: '-.03em', lineHeight: '1.2' }}>
          ¿Cómo podemos <span className="text-primary">atenderle</span>?
        </h1>
        <p className="text-[16px] text-text-muted mb-8" style={{ lineHeight: '1.5' }}>
          Seleccione el servicio que necesita para comenzar la atención.
        </p>

        {/* Option list */}
        <div className="flex flex-col gap-3 mb-8">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`flex items-center gap-4 py-5 px-6 bg-card border-2 rounded-card cursor-pointer transition-all ${
                selected === opt.id
                  ? 'border-primary bg-soft-orange'
                  : 'border-muted'
              }`
              }
              style={selected === opt.id ? { boxShadow: '0 2px 12px rgba(217,119,54,.1)' } : {}}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[18px] font-extrabold shrink-0 transition-all ${
                selected === opt.id ? 'bg-primary text-white' : 'bg-muted text-text-muted'
              }`}>
                {opt.id}
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-bold mb-0.5">{opt.title}</h3>
                <p className="text-[13px] text-text-muted">{opt.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selected === opt.id ? 'bg-primary border-primary' : 'border-muted'
              }`}>
                {selected === opt.id && (
                  <div className="w-2 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] -mt-0.5" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-press flex-1 py-4 bg-muted text-ink text-[15px] font-semibold rounded-soft hover:bg-[#E5E2DB] transition-colors"
          >
            Volver
          </button>
          <button
            onClick={() => navigate('/detalle')}
            className="btn-press flex-1 py-4 bg-primary text-white text-[15px] font-bold rounded-soft transition-all"
            style={{ boxShadow: '0 4px 16px rgba(217,119,54,.25)' }}
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
