import { useState, useCallback, useRef, useEffect } from 'react';
import type { HandLandmarks } from '../types';

// @ts-ignore - MediaPipe types are not available in TypeScript
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

interface UseCameraCaptureReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCapturing: boolean;
  landmarks: HandLandmarks | null;
  startCapture: () => Promise<void>;
  stopCapture: () => void;
  error: string | null;
}

export const useCameraCapture = (): UseCameraCaptureReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [landmarks, setLandmarks] = useState<HandLandmarks | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    const initializeHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
        );
        
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 1
        });
      } catch (err) {
        console.error('Error initializing MediaPipe HandLandmarker:', err);
        setError('Error al inicializar el detector de manos');
      }
    };

    initializeHandLandmarker();

    return () => {
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  // Draw hand landmarks on canvas
  const drawLandmarks = useCallback((detectedLandmarks: HandLandmarks, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set drawing style
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#FF0000';

    // Draw connections (hand skeleton)
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm
    ];

    // Draw connections
    connections.forEach(([start, end]) => {
      const startPoint = detectedLandmarks[start];
      const endPoint = detectedLandmarks[end];
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
      ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
      ctx.stroke();
    });

    // Draw landmark points
    detectedLandmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, []);

  // Process video frame
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !handLandmarkerRef.current || !isCapturing) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Detect hand landmarks
      const results = await handLandmarkerRef.current.detectForVideo(video, performance.now());

      if (results.landmarks && results.landmarks.length > 0) {
        // Convert MediaPipe landmarks to our format
        const handLandmarks: HandLandmarks = results.landmarks[0].map((landmark: any) => ({
          x: landmark.x,
          y: landmark.y,
          z: landmark.z
        }));

        setLandmarks(handLandmarks);
        drawLandmarks(handLandmarks, canvas);
      } else {
        setLandmarks(null);
        // Clear canvas if no hand detected
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error('Error processing frame:', err);
      setError('Error al procesar el video');
    }
  }, [isCapturing, drawLandmarks]);

  const startCapture = useCallback(async () => {
    try {
      setError(null);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCapturing(true);
      
      // Start processing frames
      animationFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('No se pudo acceder a la cámara. Por favor verifique los permisos.');
    }
  }, [processFrame]);

  const stopCapture = useCallback(() => {
    setIsCapturing(false);
    setLandmarks(null);

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return {
    videoRef,
    canvasRef,
    isCapturing,
    landmarks,
    startCapture,
    stopCapture,
    error
  };
};
