import { useState, useRef, useEffect, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { fingerStates, detectBestLetter } from '../utils/lsm_detector';
import { formatSignLabel } from '../data/signLabels';
import { WordDetector, detectStaticWord } from '../utils/wordGestures';

export interface CameraDevice {
  deviceId: string;
  label: string;
}

interface SignRecognitionHook {
  isCameraActive: boolean;
  isModelLoading: boolean;
  error: string | null;
  detectedSign: string;
  detectedConfidence: number;
  transcript: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  devices: CameraDevice[];
  selectedDeviceId: string | null;
  start: (deviceId?: string) => void;
  stop: () => void;
  clearError: () => void;
  selectDevice: (deviceId: string) => void;
  confirmSign: () => void;
  clearTranscript: () => void;
}

const STABLE_FRAMES = 5;
const CONFIDENCE_THRESHOLD = 0.50;
const DETECT_INTERVAL = 2; // Run detection every N frames

const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20],
  [0,17],
];

export const useSignRecognition = (): SignRecognitionHook => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detectedSign, setDetectedSign] = useState('');
  const [detectedConfidence, setDetectedConfidence] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingRef = useRef(false);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const stableBufferRef = useRef<{ sign: string; conf: number }[]>([]);
  const lastConfirmedRef = useRef<string>('');
  const cooldownRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const wordDetectorRef = useRef<WordDetector>(new WordDetector());
  const wordCooldownRef = useRef<number>(0);

  // Init MediaPipe HandLandmarker
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.4,
          minHandPresenceConfidence: 0.4,
          minTrackingConfidence: 0.3,
        });
        if (!cancelled) {
          handLandmarkerRef.current = landmarker;
          setIsModelLoading(false);
          console.log('[Sign] HandLandmarker loaded');
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('[Sign] Error loading HandLandmarker:', err);
          setError('Error al cargar el detector de manos');
          setIsModelLoading(false);
        }
      }
    };
    init();
    return () => {
      cancelled = true;
      handLandmarkerRef.current?.close();
    };
  }, []);

  // Draw landmarks on canvas (optimized)
  const drawLandmarks = useCallback((landmarks: any[], canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    if (canvas.width !== vw) canvas.width = vw;
    if (canvas.height !== vh) canvas.height = vh;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    for (const hand of landmarks) {
      // Draw connections in a single path
      ctx.strokeStyle = 'rgba(13, 92, 111, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (const [a, b] of HAND_CONNECTIONS) {
        ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
        ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
      }
      ctx.stroke();
      // Draw all points in a single path
      ctx.fillStyle = 'rgba(217, 119, 54, 0.95)';
      for (const lm of hand) {
        ctx.moveTo(lm.x * canvas.width + 4, lm.y * canvas.height);
        ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
      }
      ctx.fill();
    }
    ctx.restore();
  }, []);

  // Detection loop (throttled for performance)
  const detectLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = handLandmarkerRef.current;
    if (!video || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    frameCountRef.current++;
    const shouldDetect = frameCountRef.current % DETECT_INTERVAL === 0;

    if (shouldDetect) {
      // Use video.currentTime to avoid duplicate frame processing
      if (video.currentTime === lastVideoTimeRef.current) {
        rafRef.current = requestAnimationFrame(detectLoop);
        return;
      }
      lastVideoTimeRef.current = video.currentTime;

      const timestamp = performance.now();
      const results = landmarker.detectForVideo(video, timestamp);
      if (canvas && results.landmarks && results.landmarks.length > 0) {
        drawLandmarks(results.landmarks, canvas, video);
        // Detect from the most prominent hand (first result)
        const handLandmarks = results.landmarks[0];
        const states = fingerStates(handLandmarks.map((lm: any) => ({ x: lm.x, y: lm.y, z: lm.z ?? 0 })));
        if (states) {
          const [letter, score] = detectBestLetter(states, false);
          const signName = letter || '';
          const confidence = score;

          // Try static word gesture detection (e.g. Hola, Yo, Bien)
          if (wordCooldownRef.current <= 0) {
            const handLandmarks = results.landmarks[0];
            const wordResult = detectStaticWord(states, handLandmarks.map((lm: any) => ({ x: lm.x, y: lm.y, z: lm.z ?? 0 })));
            if (wordResult && wordResult.confidence >= 0.65) {
              wordCooldownRef.current = 25;
              setDetectedSign(wordResult.word);
              setDetectedConfidence(Math.round(wordResult.confidence * 100));
              setTranscript((prev) => (prev + ' ' + wordResult.word).trim());
              console.log(`[Sign] Word gesture: ${wordResult.word} (${Math.round(wordResult.confidence * 100)}%)`);
              rafRef.current = requestAnimationFrame(detectLoop);
              return;
            }
          }
          if (wordCooldownRef.current > 0) wordCooldownRef.current--;

          // Letter detection with spelling-to-word matching
          stableBufferRef.current.push({ sign: signName, conf: confidence });
          if (stableBufferRef.current.length > STABLE_FRAMES) stableBufferRef.current.shift();
          if (stableBufferRef.current.length === STABLE_FRAMES && cooldownRef.current <= 0) {
            const counts: Record<string, number> = {};
            let totalConf = 0;
            for (const entry of stableBufferRef.current) {
              if (entry.sign) {
                counts[entry.sign] = (counts[entry.sign] || 0) + 1;
                totalConf += entry.conf;
              }
            }
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            if (sorted.length > 0) {
              const [bestSign, count] = sorted[0];
              const avgConf = totalConf / stableBufferRef.current.length;
              const stabilityRatio = count / STABLE_FRAMES;
              if (stabilityRatio >= 0.6 && avgConf >= CONFIDENCE_THRESHOLD && bestSign !== lastConfirmedRef.current) {
                lastConfirmedRef.current = bestSign;
                cooldownRef.current = 12;
                const display = formatSignLabel(bestSign);
                setDetectedSign(display);
                setDetectedConfidence(Math.round(avgConf * 100));

                // Try to match spelled letters into a known word
                const wordMatch = wordDetectorRef.current.addLetter(bestSign);
                if (wordMatch) {
                  // Replace recent individual letters with the word
                  setTranscript((prev) => {
                    // Remove last N words that match the spelled letters
                    const words = prev.split(' ');
                    const wordLen = wordMatch.length;
                    // Remove last few entries and add the word
                    const toRemove = Math.min(words.length, wordLen + 2);
                    const remaining = words.slice(0, words.length - toRemove);
                    return [...remaining, wordMatch].join(' ').trim();
                  });
                  console.log(`[Sign] Spelled word: ${wordMatch}`);
                } else {
                  setTranscript((prev) => (prev + ' ' + display).trim());
                }
                console.log(`[Sign] Detected: ${display} (${Math.round(avgConf * 100)}%)`);
              } else if (bestSign === lastConfirmedRef.current) {
                setDetectedSign(formatSignLabel(bestSign));
                setDetectedConfidence(Math.round(avgConf * 100));
              }
            }
          }
          if (cooldownRef.current > 0) cooldownRef.current--;
        } else {
          setDetectedSign('');
          setDetectedConfidence(0);
        }
      } else if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const vw = video.videoWidth || 640;
          const vh = video.videoHeight || 480;
          if (canvas.width !== vw) canvas.width = vw;
          if (canvas.height !== vh) canvas.height = vh;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setDetectedSign('');
        setDetectedConfidence(0);
      }
    }
    rafRef.current = requestAnimationFrame(detectLoop);
  }, [drawLandmarks]);

  // Enumerate video devices
  const enumerateCameras = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const cameras = allDevices
        .filter(d => d.kind === 'videoinput')
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Cámara ${i + 1}`,
        }));
      console.log('[Camera] Found', cameras.length, 'cameras:', cameras.map(c => c.label));
      setDevices(cameras);
      // Auto-select first if none selected
      if (cameras.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(cameras[0].deviceId);
      }
      return cameras;
    } catch (err) {
      console.error('[Camera] Error enumerating devices:', err);
      return [];
    }
  }, [selectedDeviceId]);

  const start = useCallback(async (deviceId?: string) => {
    // Prevent multiple concurrent calls
    if (isStartingRef.current) {
      console.log('[Camera] Already starting, skipping');
      return;
    }
    isStartingRef.current = true;

    // Clean up any previous stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    const video = videoRef.current;
    if (!video) {
      setError('Error: elemento de video no encontrado.');
      isStartingRef.current = false;
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Tu navegador no soporta acceso a cámara.');
      isStartingRef.current = false;
      return;
    }

    // Clear any previous srcObject
    video.srcObject = null;

    const targetDeviceId = deviceId || selectedDeviceId || undefined;
    console.log('[Camera] Requesting access... deviceId:', targetDeviceId || 'default');

    try {
      // Build constraints: use specific device if available, otherwise default
      const videoConstraints: MediaTrackConstraints = targetDeviceId
        ? { deviceId: { exact: targetDeviceId }, width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } }
        : { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } };
      const constraints: MediaStreamConstraints = {
        video: videoConstraints,
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log('[Camera] Got stream:', stream.getVideoTracks().map(t => t.label));
      streamRef.current = stream;
      video.srcObject = stream;
      await video.play();

      // After getting stream, enumerate devices again to get labels
      // (labels are only available after permission is granted)
      if (devices.length === 0) {
        await enumerateCameras();
      }

      setIsCameraActive(true);
      stableBufferRef.current = [];
      lastConfirmedRef.current = '';
      cooldownRef.current = 0;
      wordDetectorRef.current.reset();
      wordCooldownRef.current = 0;
      rafRef.current = requestAnimationFrame(detectLoop);
      console.log('[Camera] Started successfully');
    } catch (err: any) {
      console.error('[Camera] Error:', err.name, err.message);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      video.srcObject = null;
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        setError('Permiso de cámara denegado.');
      } else if (err.name === 'NotFoundError') {
        setError('No se encontró ninguna cámara.');
      } else if (err.name === 'NotReadableError') {
        setError('La cámara está siendo usada por otra app.');
      } else if (err.name === 'OverconstrainedError') {
        // Device not found — retry with default constraints
        console.warn('[Camera] Overconstrained, retrying with default...');
        try {
          const stream2 = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
            audio: false,
          });
          streamRef.current = stream2;
          video.srcObject = stream2;
          await video.play();
          setIsCameraActive(true);
          stableBufferRef.current = [];
          lastConfirmedRef.current = '';
          cooldownRef.current = 0;
          wordDetectorRef.current.reset();
          wordCooldownRef.current = 0;
          rafRef.current = requestAnimationFrame(detectLoop);
          console.log('[Camera] Started with default constraints');
        } catch (err2: any) {
          setError('Error: ' + (err2.message || err2.name));
        }
      } else {
        setError('Error: ' + (err.message || err.name));
      }
    } finally {
      isStartingRef.current = false;
    }
  }, [selectedDeviceId, devices.length, enumerateCameras, detectLoop]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) video.srcObject = null;
    setIsCameraActive(false);
    setDetectedSign('');
    setDetectedConfidence(0);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const confirmSign = useCallback(() => {
    if (detectedSign) {
      setTranscript((prev) => (prev + ' ' + detectedSign).trim());
    }
  }, [detectedSign]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    lastConfirmedRef.current = '';
    wordDetectorRef.current.reset();
  }, []);

  const selectDevice = useCallback((deviceId: string) => {
    console.log('[Camera] Selected device:', deviceId);
    setSelectedDeviceId(deviceId);
    // If camera is active, restart with new device
    if (isCameraActive) {
      stop();
      setTimeout(() => start(deviceId), 200);
    }
  }, [isCameraActive, start, stop]);

  // Auto-start camera if permission is already granted
  useEffect(() => {
    const checkPermissionAndStart = async () => {
      try {
        if (navigator.permissions?.query) {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          console.log('[Camera] Permission status:', result.state);
          if (result.state === 'granted') {
            // Enumerate first, then start
            await enumerateCameras();
            start();
          }
          result.onchange = () => {
            if (result.state === 'granted' && !streamRef.current) {
              enumerateCameras();
              start();
            }
          };
        }
      } catch {
        // permissions.query not supported
      }
    };
    checkPermissionAndStart();
  }, [start, enumerateCameras]);

  // Listen for device changes (plug/unplug camera)
  useEffect(() => {
    const handleDeviceChange = () => {
      console.log('[Camera] Devices changed, re-enumerating...');
      enumerateCameras();
    };
    navigator.mediaDevices?.addEventListener?.('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener?.('devicechange', handleDeviceChange);
    };
  }, [enumerateCameras]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return {
    isCameraActive,
    isModelLoading,
    error,
    detectedSign,
    detectedConfidence,
    transcript,
    videoRef,
    canvasRef,
    devices,
    selectedDeviceId,
    start,
    stop,
    clearError,
    selectDevice,
    confirmSign,
    clearTranscript,
  };
};
