import React from 'react';

interface TopNavProps {
  activeTab?: string;
}

const TopNav: React.FC<TopNavProps> = ({ activeTab = 'Opciones' }) => {
  const tabs = ['Opciones', 'Historial', 'Ayuda'];

  return (
    <div className="flex items-center justify-between px-8 py-3 bg-teal shrink-0">
      <span className="text-white text-[14px] font-bold" style={{ letterSpacing: '0.02em' }}>Señas a Voces</span>
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`px-4 py-2 rounded-pill text-[13px] font-semibold cursor-pointer transition-all ${
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
