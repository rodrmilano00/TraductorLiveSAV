import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/screens/WelcomeScreen';
import CategorySelectionScreen from './components/screens/CategorySelectionScreen';
import DetailScreen from './components/screens/DetailScreen';
import VoiceInputScreen from './components/screens/VoiceInputScreen';
import ConfirmationScreen from './components/screens/ConfirmationScreen';
import SignInputScreen from './components/screens/SignInputScreen';
import ProcessingScreen from './components/screens/ProcessingScreen';
import InterpretedPhraseScreen from './components/screens/InterpretedPhraseScreen';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/categorias" element={<CategorySelectionScreen />} />
      <Route path="/detalle" element={<DetailScreen />} />
      <Route path="/voz" element={<VoiceInputScreen />} />
      <Route path="/confirmacion" element={<ConfirmationScreen />} />
      <Route path="/senas" element={<SignInputScreen />} />
      <Route path="/procesando" element={<ProcessingScreen />} />
      <Route path="/interpretada" element={<InterpretedPhraseScreen />} />
    </Routes>
  );
};

export default App;
