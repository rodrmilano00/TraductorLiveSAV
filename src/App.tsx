import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConversationProvider } from './context/ConversationContext';
import TabletLayout from './components/shared/TabletLayout';
import WelcomeScreen from './components/screens/WelcomeScreen';
import CategorySelectionScreen from './components/screens/CategorySelectionScreen';
import ConversationScreen from './components/screens/ConversationScreen';
import PrivacyPolicyScreen from './components/screens/PrivacyPolicyScreen';

const App: React.FC = () => {
  return (
    <ConversationProvider>
      <TabletLayout>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/categorias" element={<CategorySelectionScreen />} />
          <Route path="/conversacion" element={<ConversationScreen />} />
          <Route path="/privacidad" element={<PrivacyPolicyScreen />} />
        </Routes>
      </TabletLayout>
    </ConversationProvider>
  );
};

export default App;
