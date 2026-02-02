import React, { useState, useEffect } from 'react';
import DesktopLayout from './components/DesktopLayout';
import MobileLayout from './components/MobileLayout';
import { MOCK_PAIRS } from './constants';
import { Pair } from './types';

export default function App() {
  const [selectedPair, setSelectedPair] = useState<Pair>(MOCK_PAIRS[0]);
  const [activeTool, setActiveTool] = useState('cursor');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? (
    <MobileLayout
      selectedPair={selectedPair}
      setSelectedPair={setSelectedPair}
      activeTool={activeTool}
      setActiveTool={setActiveTool}
    />
  ) : (
    <DesktopLayout
      selectedPair={selectedPair}
      setSelectedPair={setSelectedPair}
      activeTool={activeTool}
      setActiveTool={setActiveTool}
    />
  );
}