import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen.jsx';
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

  return (
    <div className="min-h-dvh bg-gradient-to-br from-violet-50 via-white to-sky-50">
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
  );
}
