import React, { createContext, useContext, useState, useCallback } from 'react';

export type Sender = 'worker' | 'customer';
export type Turn = 'voice' | 'sign';

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

interface ConversationContextValue {
  messages: Message[];
  currentTurn: Turn;
  category: string;
  setCategory: (cat: string) => void;
  addMessage: (text: string) => void;
  switchTurn: () => void;
  reset: () => void;
}

const ConversationContext = createContext<ConversationContextValue | undefined>(undefined);

export const useConversation = () => {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversation must be used within ConversationProvider');
  return ctx;
};

let msgId = 0;

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Turn>('voice');
  const [category, setCategory] = useState('');

  const addMessage = useCallback((text: string) => {
    const sender: Sender = currentTurn === 'voice' ? 'worker' : 'customer';
    setMessages((prev) => [...prev, {
      id: `msg-${++msgId}`,
      sender,
      text,
      timestamp: Date.now(),
    }]);
  }, [currentTurn]);

  const switchTurn = useCallback(() => {
    setCurrentTurn((prev) => (prev === 'voice' ? 'sign' : 'voice'));
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setCurrentTurn('voice');
    setCategory('');
  }, []);

  return (
    <ConversationContext.Provider value={{ messages, currentTurn, category, setCategory, addMessage, switchTurn, reset }}>
      {children}
    </ConversationContext.Provider>
  );
};
