// Hand landmark from MediaPipe (21 points per hand with x, y, z coordinates)
export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

// Array of 21 landmarks for one hand
export type HandLandmarks = HandLandmark[];

// Response from LSM recognition backend
export interface LSMResponse {
  letter: string;
  confidence: number;
  top_k?: Array<{ letter: string; confidence: number }>;
}

// Status types for UI indicators
export type StatusType = 'recording' | 'confirming' | 'playing' | 'processing';

// Conversation message types
export interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
}

// Transaction/Assistance category
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// App global state
export interface AppState {
  selectedCategory: Category | null;
  conversationHistory: ConversationMessage[];
  currentPhrase: string;
}
