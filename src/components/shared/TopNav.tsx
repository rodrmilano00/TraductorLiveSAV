import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TopNavProps {
  activeTab?: 'Opciones' | 'Historial' | 'Ayuda';
  onConversation?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
  activeTab = 'Opciones',
  onConversation,
}) => {
  const navigate = useNavigate();

  const tabs: Array<'Opciones' | 'Historial' | 'Ayuda'> = ['Opciones', 'Historial', 'Ayuda'];

  return (
    <div className="flex items-center justify-between px-8 py-3 bg-brand-teal shrink-0">
      <div className="flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth={1.5}
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
        <span className="text-white text-[14px] font-bold" style={{ letterSpacing: '0.02em' }}>
          Señas a Voces
        </span>
      </div>

      <div className="flex gap-1">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => {
              if (tab === 'Opciones') navigate('/categorias');
              if (tab === 'Ayuda' && onConversation) onConversation();
            }}
            className={`px-4 py-2 rounded-pill text-[13px] font-semibold cursor-pointer transition-colors ${
              tab === activeTab
                ? 'bg-white/15 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopNav;
