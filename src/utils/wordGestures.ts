/**
 * wordGestures.ts — Detección de palabras comunes en LSM
 * 1. Por deletreo: secuencia de letras forma una palabra conocida
 * 2. Por gesto estático: configuración de la mano representa una palabra
 */

import { FingerStates } from './lsm_detector';

// Palabras conocidas que pueden ser deletreadas en LSM
const SPELLABLE_WORDS: Record<string, string> = {
  'HOLA': 'Hola',
  'ADIOS': 'Adiós',
  'YO': 'Yo',
  'TU': 'Tú',
  'EL': 'Él',
  'BIEN': 'Bien',
  'MAL': 'Mal',
  'GRACIAS': 'Gracias',
  'PAN': 'Pan',
  'AGUA': 'Agua',
  'ROJO': 'Rojo',
  'AZUL': 'Azul',
  'CASA': 'Casa',
  'PEZ': 'Pez',
  'DIA': 'Día',
  'OJOS': 'Ojos',
  'PIE': 'Pie',
  'VER': 'Ver',
  'IR': 'Ir',
  'QUE': 'Qué',
};

// Máximo número de letras a guardar en el buffer de deletreo
const MAX_SPELL_BUFFER = 12;

export class WordDetector {
  private spellBuffer: string[] = [];
  private lastSpellTime: number = 0;
  private readonly spellTimeout: number = 3000; // 3s entre letras

  /**
   * Agrega una letra detectada al buffer y verifica si forma una palabra
   */
  addLetter(letter: string): string | null {
    const now = Date.now();
    // Reset buffer si pasó mucho tiempo
    if (now - this.lastSpellTime > this.spellTimeout) {
      this.spellBuffer = [];
    }
    this.lastSpellTime = now;

    this.spellBuffer.push(letter);
    if (this.spellBuffer.length > MAX_SPELL_BUFFER) {
      this.spellBuffer.shift();
    }

    // Buscar coincidencia con palabras conocidas
    const current = this.spellBuffer.join('');
    for (const [word, display] of Object.entries(SPELLABLE_WORDS)) {
      if (current.endsWith(word)) {
        // Encontró la palabra — limpia el buffer
        this.spellBuffer = [];
        return display;
      }
    }

    // También verificar si las últimas N letras forman una palabra
    // (por si hay letras extra al inicio)
    for (let len = 2; len <= current.length; len++) {
      const substr = current.slice(-len);
      if (SPELLABLE_WORDS[substr]) {
        this.spellBuffer = [];
        return SIGN_WORDS[substr] || substr;
      }
    }

    return null;
  }

  reset() {
    this.spellBuffer = [];
  }

  getBufferString(): string {
    return this.spellBuffer.join('');
  }
}

// Alias para compatibilidad
const SIGN_WORDS: Record<string, string> = SPELLABLE_WORDS;

/**
 * Detecta gestos estáticos para palabras comunes en LSM
 * basado en la configuración de la mano y su posición relativa a la cara
 */
export function detectStaticWord(
  states: FingerStates | null,
  landmarks: { x: number; y: number; z: number }[] | null
): { word: string; confidence: number } | null {
  if (!states || !landmarks || landmarks.length < 21) return null;

  const wrist = landmarks[0];

  // Posición relativa de la mano respecto al centro del frame
  const handY = wrist.y;

  // --- HOLA: mano abierta cerca de la frente/sien, luego se mueve hacia afuera ---
  // En estático: mano abierta (todos los dedos extendidos) cerca de la sien
  if (states.palmFlat && handY < 0.35) {
    // Mano abierta en la parte superior = posible saludo
    if (states.thumbOut) {
      return { word: 'Hola', confidence: 0.65 };
    }
  }

  // --- YO: dedo índice apuntando hacia uno mismo (hacia abajo/pecho) ---
  if (states.index && !states.middle && !states.ring && !states.pinky && !states.thumbOut) {
    // Índice extendido, otros cerrados, mano apuntando hacia abajo (hacia el pecho)
    if (handY > 0.4 && handY < 0.7) {
      return { word: 'Yo', confidence: 0.70 };
    }
  }

  // --- TU: dedo índice apuntando hacia afuera (hacia la otra persona) ---
  if (states.index && !states.middle && !states.ring && !states.pinky && !states.thumbOut) {
    // Índice extendido apuntando hacia adelante/arriba
    if (handY < 0.4) {
      return { word: 'Tú', confidence: 0.65 };
    }
  }

  // --- BIEN: pulgar arriba (thumbs up), mano cerrada ---
  if (states.thumbOut && !states.index && !states.middle && !states.ring && !states.pinky && states.fistTight) {
    return { word: 'Bien', confidence: 0.75 };
  }

  // --- MAL: puño cerrado con pulgar hacia abajo ---
  if (!states.thumbOut && !states.index && !states.middle && !states.ring && !states.pinky && states.fistTight) {
    // Puño cerrado, mano hacia abajo
    if (handY > 0.5) {
      return { word: 'Mal', confidence: 0.60 };
    }
  }

  return null;
}
