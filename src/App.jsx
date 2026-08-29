import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SplashScreen from './components/SplashScreen.jsx';
import Iridescence from './components/Iridescence.jsx';
import GameSelect from './pages/GameSelect.jsx';
import PresetSelect from './pages/PresetSelect.jsx';
import Lobby from './pages/Lobby.jsx';
import CardReveal from './pages/CardReveal.jsx';
import HintRound from './pages/HintRound.jsx';
import VotingRound from './pages/VotingRound.jsx';
import Elimination from './pages/Elimination.jsx';
import GameOver from './pages/GameOver.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import DareModeSelect from './pages/dare/ModeSelect.jsx';
import DarePlayers from './pages/dare/Players.jsx';
import DareWheel from './pages/dare/Wheel.jsx';
import DarePrompt from './pages/dare/Prompt.jsx';
import DareAdminPanel from './pages/dare/AdminPanel.jsx';

export default function App() {
  const [splash, setSplash] = useState(true);
  const location = useLocation();
  const path = location.pathname;
  const isDare = path.startsWith('/dare');

  const SOLID_BACKGROUNDS = {
    '/': [0.3, 0.45, 0.95],        // blue — game select
    '/imposter': [0.15, 0.65, 0.4], // green — imposter preset select
  };
  const backgroundColor = isDare ? [0.85, 0.3, 0.55] : SOLID_BACKGROUNDS[path];
  const showBackground = isDare || Boolean(backgroundColor);

  return (
    <div className={`min-h-dvh relative ${showBackground ? 'bg-white' : 'bg-gradient-to-br from-violet-50 via-white to-sky-50'}`}>
      {showBackground && (
        <div className="fixed inset-0 z-0">
          <Iridescence color={backgroundColor} speed={0.6} amplitude={0.08} mouseReact={false} />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
        </div>
      )}

      <div className="relative z-10">
        {splash && <SplashScreen onDone={() => setSplash(false)} />}
        <Routes>
          <Route path="/" element={<GameSelect />} />
          <Route path="/imposter" element={<PresetSelect />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/card-reveal" element={<CardReveal />} />
          <Route path="/hint-round" element={<HintRound />} />
          <Route path="/voting" element={<VotingRound />} />
          <Route path="/elimination" element={<Elimination />} />
          <Route path="/game-over" element={<GameOver />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/dare" element={<DareModeSelect />} />
          <Route path="/dare/players" element={<DarePlayers />} />
          <Route path="/dare/wheel" element={<DareWheel />} />
          <Route path="/dare/prompt" element={<DarePrompt />} />
          <Route path="/dare/admin" element={<DareAdminPanel />} />
        </Routes>
      </div>
    </div>
  );
}
