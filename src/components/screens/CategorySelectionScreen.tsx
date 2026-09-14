import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '../../context/ConversationContext';

const options = [
  { id: 1, title: 'Información general', desc: 'Consultas sobre el establecimiento, horarios o servicios' },
  { id: 2, title: 'Hacer una reserva', desc: 'Reservar mesa, habitación o espacio disponible' },
  { id: 3, title: 'Realizar un pedido', desc: 'Solicitar alimentos, bebidas o productos' },
  { id: 4, title: 'Otro servicio', desc: 'Cualquier otra solicitud o necesidad específica' },
];

const CategorySelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setCategory } = useConversation();
  const [selected, setSelected] = useState(1);

  const handleSelect = () => {
    const opt = options.find((o) => o.id === selected);
    if (opt) setCategory(opt.title);
    navigate('/conversacion');
  };

  return (
    <div className="flex-1 flex flex-col px-8 pt-8 pb-8 overflow-y-auto">
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2 text-ink" style={{ letterSpacing: '-.03em', lineHeight: '1.2' }}>
        ¿Cómo podemos <span className="text-primary">atenderle</span>?
      </h1>
      <p className="text-base text-text-muted mb-8" style={{ lineHeight: '1.5' }}>
        Seleccione el servicio que necesita para comenzar la atención.
      </p>

      {/* Option list */}
      <div className="flex flex-col gap-3 mb-8 flex-1">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`flex items-center gap-4 py-5 px-6 bg-card border-2 rounded-card cursor-pointer transition-all ${
              selected === opt.id
                ? 'border-primary bg-soft-orange'
                : 'border-muted'
            }`}
            style={selected === opt.id ? { boxShadow: '0 2px 12px rgba(217,119,54,.1)' } : {}}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0 transition-all ${
              selected === opt.id ? 'bg-primary text-white' : 'bg-muted text-text-muted'
            }`}>
              {opt.id}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-0.5 text-ink">{opt.title}</h3>
              <p className="text-sm text-text-muted">{opt.desc}</p>
            </div>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
              selected === opt.id ? 'bg-primary border-primary' : 'border-muted'
            }`}>
              {selected === opt.id && (
                <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] -mt-0.5" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="btn-press flex-1 py-4 bg-muted text-ink text-base font-semibold rounded-soft hover:bg-[#E5E2DB] transition-colors"
        >
          Volver
        </button>
        <button
          onClick={handleSelect}
          className="btn-press flex-1 py-4 bg-primary text-white text-base font-bold rounded-soft transition-all"
          style={{ boxShadow: '0 4px 16px rgba(217,119,54,.25)' }}
        >
          Iniciar conversación
        </button>
      </div>
    </div>
  );
};

export default CategorySelectionScreen;
