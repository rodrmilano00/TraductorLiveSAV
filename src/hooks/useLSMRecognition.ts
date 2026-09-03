import { useState, useCallback } from 'react';
import type { HandLandmarks, LSMResponse } from '../types';
import { lsmApi } from '../services/lsmApi';

interface UseLSMRecognitionReturn {
  recognize: (landmarks: HandLandmarks) => Promise<LSMResponse>;
  isProcessing: boolean;
  error: string | null;
}

export const useLSMRecognition = (): UseLSMRecognitionReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognize = useCallback(async (landmarks: HandLandmarks): Promise<LSMResponse> => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await lsmApi.recognize(landmarks);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    recognize,
    isProcessing,
    error
  };
};
