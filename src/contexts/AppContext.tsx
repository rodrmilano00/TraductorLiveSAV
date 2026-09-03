import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Category, ConversationMessage } from '../types';

interface AppContextType extends AppState {
  setSelectedCategory: (category: Category | null) => void;
  addConversationMessage: (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => void;
  setCurrentPhrase: (phrase: string) => void;
  clearConversation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [currentPhrase, setCurrentPhrase] = useState('');

  const addConversationMessage = (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    const newMessage: ConversationMessage = {
      ...message,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };
    setConversationHistory(prev => [...prev, newMessage]);
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setSelectedCategory(null);
    setCurrentPhrase('');
  };

  return (
    <AppContext.Provider
      value={{
        selectedCategory,
        conversationHistory,
        currentPhrase,
        setSelectedCategory,
        addConversationMessage,
        setCurrentPhrase,
        clearConversation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
