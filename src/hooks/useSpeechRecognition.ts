import { useState, useRef, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  error: string | null;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldListenRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartCountRef = useRef(0);
  const isSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Create recognition instance
  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setError('Su navegador no soporta reconocimiento de voz. Use Chrome o Edge.');
      return;
    }

    const recognition = new Ctor();
    recognition.lang = 'es-MX';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) {
        setTranscript((prev) => (prev + ' ' + final).trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      const errType = event.error || 'unknown';

      if (errType === 'no-speech') {
        // Normal — just silence, keep going
        return;
      }

      if (errType === 'not-allowed' || errType === 'service-not-allowed') {
        setError('Permiso de micrófono denegado. Habilite el acceso en el navegador.');
        shouldListenRef.current = false;
        setIsListening(false);
        return;
      }

      if (errType === 'network' || errType === 'audio-capture' || errType === 'aborted') {
        // Auto-restart with backoff
        restartCountRef.current += 1;
        const delay = Math.min(1000 * restartCountRef.current, 5000);
        if (shouldListenRef.current) {
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            if (shouldListenRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch {
                // Already started — ignore
              }
            }
          }, delay);
        }
        return;
      }

      // Other errors — show but try to continue
      setError(`Error de reconocimiento: ${errType}`);
    };

    recognition.onend = () => {
      setInterimTranscript('');
      // Auto-restart if we should be listening
      if (shouldListenRef.current) {
        restartCountRef.current += 1;
        const delay = Math.min(200 * restartCountRef.current, 2000);
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (shouldListenRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch {
              // Already started
            }
          }
        }, delay);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      try {
        recognition.stop();
      } catch {
        // Already stopped
      }
    };
  }, []);

  const start = useCallback(() => {
    setError(null);
    restartCountRef.current = 0;
    shouldListenRef.current = true;
    setTranscript('');
    setInterimTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Already started — force restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
              setIsListening(true);
            } catch {
              // Give up silently
            }
          }, 200);
        } catch {
          // Ignore
        }
      }
    }
  }, []);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped
      }
    }
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return { transcript, interimTranscript, isListening, error, isSupported, start, stop, reset };
};
