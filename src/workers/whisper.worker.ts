import { pipeline, env } from '@xenova/transformers';
import * as ort from 'onnxruntime-web';

// Configure ONNX Runtime WASM paths to use public directory
ort.env.wasm.wasmPaths = '/';

env.allowLocalModels = false;
env.useBrowserCache = true;
// Configure the ONNX backend to use the WASM files from public
env.backends.onnx.wasm.wasmPaths = '/';

let transcriber: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function getTranscriber() {
  if (transcriber) return transcriber;
  if (loadPromise) return loadPromise;
  if (isLoading) return null;

  isLoading = true;
  loadPromise = pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
    quantized: true,
    progress_callback: (data: any) => {
      self.postMessage({ type: 'progress', data });
    },
  });

  try {
    transcriber = await loadPromise;
    isLoading = false;
    return transcriber;
  } catch (err) {
    isLoading = false;
    loadPromise = null;
    throw err;
  }
}

self.onmessage = async (e: MessageEvent) => {
  const { type, audio, language } = e.data;

  if (type === 'load') {
    try {
      await getTranscriber();
      self.postMessage({ type: 'ready' });
    } catch (err: any) {
      self.postMessage({ type: 'error', error: err.message || 'Error loading model' });
    }
    return;
  }

  if (type === 'transcribe') {
    try {
      const model = await getTranscriber();
      if (!model) {
        self.postMessage({ type: 'error', error: 'Model not loaded' });
        return;
      }

      const output = await model(audio, {
        language: language || 'spanish',
        task: 'transcribe',
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: false,
      });

      self.postMessage({ type: 'result', text: output.text || '' });
    } catch (err: any) {
      self.postMessage({ type: 'error', error: err.message || 'Transcription error' });
    }
  }
};

export {};
