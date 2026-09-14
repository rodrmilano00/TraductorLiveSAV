import React from 'react';
import Logo from './Logo';

interface TopNavProps {
  activeTab?: string;
}

const TopNav: React.FC<TopNavProps> = ({ activeTab = 'Opciones' }) => {
  const tabs = ['Opciones', 'Historial', 'Ayuda'];

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white border-b border-muted shrink-0 backdrop-blur-xl">
      <Logo variant="crop" className="w-32 sm:w-40" />
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              tab === activeTab
                ? 'bg-teal text-white'
                : 'text-text-muted hover:bg-bg'
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
