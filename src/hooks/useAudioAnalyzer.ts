import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioAnalyzerHook {
  frequencyData: Uint8Array | null;
  start: (deviceId?: string) => Promise<void>;
  stop: () => void;
  isAnalyzing: boolean;
}

export const useAudioAnalyzer = (bars = 24): AudioAnalyzerHook => {
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
    analyserRef.current = null;
    setIsAnalyzing(false);
    setFrequencyData(null);
  }, []);

  const start = useCallback(async (deviceId?: string) => {
    stop();
    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsAnalyzing(true);

      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Downsample to `bars` count
        const sampled = new Uint8Array(bars);
        const step = Math.floor(bufferLength / bars);
        for (let i = 0; i < bars; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) {
            sum += dataArray[i * step + j] || 0;
          }
          sampled[i] = Math.min(255, Math.round(sum / step));
        }
        setFrequencyData(sampled);
        rafRef.current = requestAnimationFrame(update);
      };
      update();
    } catch {
      setIsAnalyzing(false);
    }
  }, [stop, bars]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { frequencyData, start, stop, isAnalyzing };
};
