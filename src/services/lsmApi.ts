import type { HandLandmarks, LSMResponse } from '../types';

const API_URL = import.meta.env.VITE_LSM_API_URL || 'http://localhost:8000';

export const lsmApi = {
  /**
   * Send hand landmarks to the LSM recognition backend
   * @param landmarks - Array of 21 hand landmarks with x, y, z coordinates
   * @returns Promise with the recognition result (letter, confidence, top_k)
   */
  async recognize(landmarks: HandLandmarks): Promise<LSMResponse> {
    try {
      const response = await fetch(`${API_URL}/api/lsm/recognize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ landmarks }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LSMResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling LSM recognition API:', error);
      throw new Error('Error al comunicarse con el servicio de reconocimiento LSM');
    }
  }
};
