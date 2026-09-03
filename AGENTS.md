# LiveTranslatorSAV - App Tablet Traductora LSM (DIF)

## Project Overview
Frontend en React + Vite para una app kiosco de tablet (landscape) que traduce voz a texto y señas LSM a texto/voz, conectada al backend de reconocimiento LSM.

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (via @tailwindcss/postcss)
- **Routing**: React Router DOM
- **Computer Vision**: @mediapipe/tasks-vision (HandLandmarker)
- **State Management**: React Context API
- **Hardware Access**: Web Speech API (voice), MediaPipe (camera)

## Development Commands

### Build
```bash
npm run build
```
Compila TypeScript y construye el bundle de producción con Vite.

### Development Server
```bash
npm run dev
```
Inicia el servidor de desarrollo con hot reload.

### Preview Production Build
```bash
npm run preview
```
Previsualiza el build de producción localmente.

## Project Structure
```
src/
├── components/
│   ├── screens/              # Pantallas principales
│   │   ├── WelcomeScreen.tsx
│   │   ├── CategorySelectionScreen.tsx
│   │   ├── DetailScreen.tsx
│   │   ├── VoiceInputScreen.tsx
│   │   └── LSMTranslation/  # Pantallas de flujo LSM
│   │       ├── PhraseViewScreen.tsx
│   │       ├── CameraCaptureScreen.tsx
│   │       ├── ProcessingScreen.tsx
│   │       └── ResultScreen.tsx
│   └── shared/              # Componentes reutilizables
│       ├── Header.tsx
│       ├── StatusIndicator.tsx
│       └── ConversationPanel.tsx
├── hooks/                   # Hooks de hardware aislados
│   ├── useCameraCapture.ts
│   ├── useVoiceCapture.ts
│   └── useLSMRecognition.ts
├── services/                # Clientes API
│   └── lsmApi.ts
├── contexts/                # Estado global
│   └── AppContext.tsx
└── types/                   # Definiciones TypeScript
    └── index.ts
```

## Environment Variables
- `VITE_LSM_API_URL`: URL del backend de reconocimiento LSM (default: http://localhost:8000)

## Key Features Implemented

### Hardware Abstraction
- **useCameraCapture**: MediaPipe HandLandmarker con canvas overlay, aislado para fácil port a nativo
- **useVoiceCapture**: Web Speech API con fallback para navegadores sin soporte
- **useLSMRecognition**: Cliente HTTP para POST /api/lsm/recognize

### Screen Flow
1. Welcome → Categories → Detail → Voice Input → LSM Translation Flow
2. LSM Flow: Phrase View → Camera Capture → Processing → Result

### Accessibility
- Status indicators use color + icon + text (never color alone)
- Minimum 64px touch targets for main buttons
- Landscape-only enforcement with CSS

### Backend Integration
- Current backend limitation: recognizes static alphabet letters only
- Result screen shows raw letter-by-letter output
- Commented in code as future extension point for word/phrase assembly

## Future Port Considerations
- Hardware hooks are isolated to simplify Capacitor/Cordova port
- All camera/mic access contained in dedicated hooks
- UI components are framework-agnostic (standard React patterns)
