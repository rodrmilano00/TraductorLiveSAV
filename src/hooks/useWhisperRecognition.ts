import { useState, useRef, useEffect, useCallback } from 'react';

interface WhisperRecognitionHook {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isTranscribing: boolean;
  isModelLoading: boolean;
  isModelReady: boolean;
  modelProgress: number;
  error: string | null;
  frequencyData: Uint8Array | null;
  start: (deviceId?: string) => void;
  stop: () => void;
  reset: () => void;
}

const SILENCE_THRESHOLD = 0.006;
const SILENCE_DURATION = 700; // ms of silence before transcribing — faster response
const MAX_CHUNK_DURATION = 5000; // max 5s before forced transcribe — shorter = faster
const TARGET_SAMPLE_RATE = 16000;

function resampleAudio(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = toRate / fromRate;
  const newLength = Math.round(input.length * ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcIndex = i / ratio;
    const srcLow = Math.floor(srcIndex);
    const srcHigh = Math.min(srcLow + 1, input.length - 1);
    const frac = srcIndex - srcLow;
    result[i] = input[srcLow] * (1 - frac) + input[srcHigh] * frac;
  }
  return result;
}

export const useWhisperRecognition = (): WhisperRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribingState] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const vadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chunksRef = useRef<Float32Array[]>([]);
  const totalSamplesRef = useRef(0);
  const isRecordingRef = useRef(false);
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const chunkStartTimeRef = useRef<number>(Date.now());
  const isTranscribingRef = useRef(false);
  const hasSpeechRef = useRef(false);

  // Init worker and pre-load model
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/whisper.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { type, text, error: err, data } = e.data;
      console.log('[Whisper hook] Worker message:', type);

      if (type === 'ready') {
        console.log('[Whisper hook] Model loaded and ready!');
        setIsModelLoading(false);
        setIsModelReady(true);
        setModelProgress(100);
      } else if (type === 'progress') {
        if (data?.status === 'progress') {
          const pct = data.progress || 0;
          setModelProgress(Math.round(pct));
          console.log(`[Whisper hook] Model loading: ${Math.round(pct)}%`);
        } else if (data?.status === 'loading') {
          setIsModelLoading(true);
        }
      } else if (type === 'result') {
        console.log('[Whisper hook] Transcription result:', text);
        isTranscribingRef.current = false;
        setIsTranscribingState(false);
        setInterimTranscript('');
        if (text && text.trim()) {
          setTranscript((prev) => (prev + ' ' + text.trim()).trim());
        }
      } else if (type === 'error') {
        console.error('[Whisper hook] Worker error:', err);
        isTranscribingRef.current = false;
        setIsTranscribingState(false);
        setInterimTranscript('');
        setError(`Error de Whisper: ${err}`);
      }
    };

    workerRef.current.onerror = (e: ErrorEvent) => {
      console.error('[Whisper hook] Worker error event:', e.message);
      setError(`Error del worker: ${e.message}`);
    };

    console.log('[Whisper hook] Sending load command to worker');
    workerRef.current.postMessage({ type: 'load' });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Frequency data update loop
  useEffect(() => {
    let mounted = true;
    const updateFreq = () => {
      if (!mounted || !isRecordingRef.current) return;
      if (analyserRef.current) {
        const buffer = new Uint8Array(24);
        const full = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(full);
        const step = Math.floor(full.length / 24);
        for (let i = 0; i < 24; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) sum += full[i * step + j] || 0;
          buffer[i] = Math.min(255, Math.round(sum / step));
        }
        setFrequencyData(buffer);
      }
      rafRef.current = requestAnimationFrame(updateFreq);
    };
    if (isListening) {
      rafRef.current = requestAnimationFrame(updateFreq);
    }
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isListening]);

  const transcribeChunks = useCallback(() => {
    if (isTranscribingRef.current || chunksRef.current.length === 0) {
      console.log('[Whisper hook] Skip transcribe - transcribing:', isTranscribingRef.current, 'chunks:', chunksRef.current.length);
      return;
    }
    if (!workerRef.current) {
      console.error('[Whisper hook] No worker available');
      return;
    }

    isTranscribingRef.current = true;
    setIsTranscribingState(true);
    setInterimTranscript('Procesando audio...');

    // Merge all chunks
    const totalLength = chunksRef.current.reduce((acc, c) => acc + c.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunksRef.current) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    chunksRef.current = [];

    // Resample to 16kHz for Whisper
    const sampleRate = audioCtxRef.current?.sampleRate || 44100;
    const resampled = sampleRate === TARGET_SAMPLE_RATE
      ? merged
      : resampleAudio(merged, sampleRate, TARGET_SAMPLE_RATE);

    console.log(`[Whisper hook] Sending audio to worker: ${resampled.length} samples at ${TARGET_SAMPLE_RATE}Hz (${(resampled.length / TARGET_SAMPLE_RATE).toFixed(1)}s)`);

    // Send to worker
    workerRef.current.postMessage({
      type: 'transcribe',
      audio: resampled,
      language: 'spanish',
    });
  }, []);

  // VAD loop - check for silence
  useEffect(() => {
    if (!isListening) return;
    let mounted = true;

    const checkSilence = () => {
      if (!mounted || !isRecordingRef.current) return;

      const analyser = analyserRef.current;
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const avg = sum / data.length / 255;

        if (avg > SILENCE_THRESHOLD) {
          lastSpeechTimeRef.current = Date.now();
          hasSpeechRef.current = true;
        }

        const silenceTime = Date.now() - lastSpeechTimeRef.current;
        const chunkTime = Date.now() - chunkStartTimeRef.current;

        // Transcribe on silence after speech, or after max chunk duration
        const chunkSamples = chunksRef.current.reduce((a, c) => a + c.length, 0);
        const chunkSeconds = chunkSamples / (audioCtxRef.current?.sampleRate || 44100);

        if (hasSpeechRef.current && chunkSeconds > 0.3 && (
          (silenceTime > SILENCE_DURATION && chunksRef.current.length > 0) ||
          (chunkTime > MAX_CHUNK_DURATION && chunksRef.current.length > 0)
        )) {
          if (!isTranscribingRef.current) {
            console.log('[Whisper hook] VAD triggered transcribe. Silence:', silenceTime, 'ms, Chunk:', chunkTime, 'ms');
            chunkStartTimeRef.current = Date.now();
            hasSpeechRef.current = false;
            transcribeChunks();
          }
        }
      }

      vadTimerRef.current = setTimeout(checkSilence, 200);
    };

    checkSilence();
    return () => {
      mounted = false;
      if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
    };
  }, [isListening, transcribeChunks]);

  const start = useCallback((deviceId?: string) => {
    if (!isModelReady) {
      console.log('[Whisper hook] Cannot start - model not ready yet');
      setError('El modelo aún está cargando. Espere un momento.');
      return;
    }

    setError(null);
    setInterimTranscript('');
    chunksRef.current = [];
    totalSamplesRef.current = 0;
    hasSpeechRef.current = false;

    console.log('[Whisper hook] Starting audio capture, deviceId:', deviceId || 'default');

    const initAudio = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = audioCtx;
        console.log('[Whisper hook] AudioContext sample rate:', audioCtx.sampleRate);

        const source = audioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.7;
        source.connect(analyser);
        analyserRef.current = analyser;

        // Use ScriptProcessor to capture raw PCM
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (e: AudioProcessingEvent) => {
          if (!isRecordingRef.current) return;
          const input = e.inputBuffer.getChannelData(0);
          // Copy the data since the buffer is reused
          const copy = new Float32Array(input.length);
          copy.set(input);
          chunksRef.current.push(copy);
          totalSamplesRef.current += copy.length;
        };

        // Connect through a zero-gain node to avoid feedback but keep processor alive
        const zeroGain = audioCtx.createGain();
        zeroGain.gain.value = 0;
        source.connect(processor);
        processor.connect(zeroGain);
        zeroGain.connect(audioCtx.destination);
        processorRef.current = processor;

        isRecordingRef.current = true;
        lastSpeechTimeRef.current = Date.now();
        chunkStartTimeRef.current = Date.now();
        setIsListening(true);
        console.log('[Whisper hook] Audio capture started successfully');
      } catch (err: any) {
        console.error('[Whisper hook] Audio init error:', err);
        setError('No se pudo acceder al micrófono. ' + (err.message || ''));
      }
    };

    initAudio();
  }, [isModelReady]);

  const stop = useCallback(() => {
    console.log('[Whisper hook] Stopping. Total samples:', totalSamplesRef.current, 'Chunks:', chunksRef.current.length);
    isRecordingRef.current = false;
    setIsListening(false);

    // Transcribe any remaining audio
    if (chunksRef.current.length > 0 && !isTranscribingRef.current) {
      transcribeChunks();
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, [transcribeChunks]);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    chunksRef.current = [];
    totalSamplesRef.current = 0;
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isTranscribing,
    isModelLoading,
    isModelReady,
    modelProgress,
    error,
    frequencyData,
    start,
    stop,
    reset,
  };
};
