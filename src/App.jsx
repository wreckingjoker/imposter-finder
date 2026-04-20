import { Routes, Route } from 'react-router-dom';
import PresetSelect from './pages/PresetSelect.jsx';
import Lobby from './pages/Lobby.jsx';
import CardReveal from './pages/CardReveal.jsx';
import HintRound from './pages/HintRound.jsx';
import VotingRound from './pages/VotingRound.jsx';
import Elimination from './pages/Elimination.jsx';
import GameOver from './pages/GameOver.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

export default function App() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-violet-50 via-white to-sky-50">
      <Routes>
        <Route path="/" element={<PresetSelect />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/card-reveal" element={<CardReveal />} />
        <Route path="/hint-round" element={<HintRound />} />
        <Route path="/voting" element={<VotingRound />} />
        <Route path="/elimination" element={<Elimination />} />
        <Route path="/game-over" element={<GameOver />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}
