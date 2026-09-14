import React from 'react';
import Logo from './Logo';

interface TabletLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showHelp?: boolean;
}

const TabletLayout: React.FC<TabletLayoutProps> = ({ children, showHeader = true, showHelp = true }) => {
  return (
    <div className="relative w-full min-h-screen bg-bg flex flex-col overflow-hidden">
      {showHeader && (
        <header className="flex items-center justify-between px-6 py-3 sm:px-8 sm:py-4 bg-white border-b border-muted shrink-0">
          <Logo variant="crop" className="w-28 sm:w-36" />
          {showHelp && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-text-muted hover:bg-bg transition-colors"
              aria-label="Ayuda"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
              </svg>
              Ayuda
            </button>
          )}
        </header>
      )}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default TabletLayout;
