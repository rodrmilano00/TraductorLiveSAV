import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import WelcomeScreen from './components/screens/WelcomeScreen';
import CategorySelectionScreen from './components/screens/CategorySelectionScreen';
import DetailScreen from './components/screens/DetailScreen';
import VoiceInputScreen from './components/screens/VoiceInputScreen';
import PhraseViewScreen from './components/screens/LSMTranslation/PhraseViewScreen';
import CameraCaptureScreen from './components/screens/LSMTranslation/CameraCaptureScreen';
import ProcessingScreen from './components/screens/LSMTranslation/ProcessingScreen';
import ResultScreen from './components/screens/LSMTranslation/ResultScreen';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/categorias" element={<CategorySelectionScreen />} />
          <Route path="/detalle/:id" element={<DetailScreen />} />
          <Route path="/voz" element={<VoiceInputScreen />} />
          <Route path="/lsm/frase" element={<PhraseViewScreen />} />
          <Route path="/lsm/captura" element={<CameraCaptureScreen />} />
          <Route path="/lsm/procesando" element={<ProcessingScreen />} />
          <Route path="/lsm/resultado" element={<ResultScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
