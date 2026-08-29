import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTruthOrDare } from '../../context/TruthOrDareContext.jsx';
import { DARE_CONFIG } from '../../config/dare.js';

const CHIP_COLORS = [
  'bg-violet-500', 'bg-pink-500', 'bg-amber-500',
  'bg-teal-500', 'bg-blue-500', 'bg-rose-500',
  'bg-emerald-500', 'bg-orange-500', 'bg-indigo-500', 'bg-cyan-500',
];

export default function Players() {
  const { state, dispatch } = useTruthOrDare();
  const navigate = useNavigate();

  const [players, setPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('truth-or-dare-players');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const pressTimer = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (state.phase === 'wheel') navigate('/dare/wheel');
  }, [state.phase, navigate]);

  useEffect(() => {
    localStorage.setItem('truth-or-dare-players', JSON.stringify(players));
  }, [players]);

  function handleTitlePressStart() {
    pressTimer.current = setTimeout(() => navigate('/dare/admin'), 3000);
  }
  function handleTitlePressEnd() {
    clearTimeout(pressTimer.current);
  }

  function addPlayer() {
    const name = input.trim();
    if (!name) return;
    if (players.length >= DARE_CONFIG.MAX_PLAYERS) {
      setError(`Maximum ${DARE_CONFIG.MAX_PLAYERS} players.`);
      return;
    }
    if (players.some(p => p.toLowerCase() === name.toLowerCase())) {
      setError('Name already added.');
      return;
    }
    setPlayers(prev => [...prev, name]);
    setInput('');
    setError('');
    inputRef.current?.focus();
  }

  function removePlayer(name) {
    setPlayers(prev => prev.filter(p => p !== name));
    setError('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addPlayer();
  }

  function startGame() {
    if (players.length < DARE_CONFIG.MIN_PLAYERS) return;
    const mode = localStorage.getItem('truth-or-dare-mode') === 'family' ? 'family' : 'friends';
    dispatch({ type: 'START', payload: { mode, players } });
  }

  const canStart = players.length >= DARE_CONFIG.MIN_PLAYERS;

  return (
    <div className="min-h-dvh flex flex-col max-w-sm mx-auto px-4 py-8">

      {/* Back to mode select */}
      <button
        onClick={() => navigate('/dare')}
        className="text-violet-500 text-sm mb-4 flex items-center gap-1 hover:text-violet-700 font-semibold transition-colors self-start"
      >
        ← Change Mode
      </button>

      {/* Title */}
      <div className="text-center mb-10 mt-2 select-none">
        <h1
          onMouseDown={handleTitlePressStart}
          onMouseUp={handleTitlePressEnd}
          onMouseLeave={handleTitlePressEnd}
          onTouchStart={handleTitlePressStart}
          onTouchEnd={handleTitlePressEnd}
          className="text-4xl font-extrabold tracking-tight cursor-pointer bg-gradient-to-r from-rose-500 via-orange-400 to-violet-500 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(255,255,255,0.85)]"
        >
          Truth or Dare
        </h1>
        <p className="text-gray-700 text-sm mt-2 font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">Add 3–12 players to spin</p>
      </div>

      {/* Add player input */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => { setInput(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="Enter player name"
            maxLength={20}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-all shadow-sm"
          />
          <button
            onClick={addPlayer}
            disabled={!input.trim() || players.length >= DARE_CONFIG.MAX_PLAYERS}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold px-5 py-3 transition-all shadow-sm"
          >
            Add
          </button>
        </div>
        {error && <p className="text-rose-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Player count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm font-medium">Players</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          canStart
            ? 'bg-violet-100 text-violet-600'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {players.length} / {DARE_CONFIG.MAX_PLAYERS}
        </span>
      </div>

      {/* Player list */}
      <div className="flex-1 mb-6">
        {players.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl px-4 py-10 text-center text-gray-400 text-sm">
            Add at least {DARE_CONFIG.MIN_PLAYERS} players to start
          </div>
        ) : (
          <ul className="space-y-2">
            {players.map((name, i) => (
              <li
                key={name}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full ${CHIP_COLORS[i % CHIP_COLORS.length]} text-white text-xs font-bold`}>
                    {i + 1}
                  </span>
                  <span className="text-gray-800 font-semibold">{name}</span>
                </div>
                <button
                  onClick={() => removePlayer(name)}
                  className="text-gray-300 hover:text-rose-400 text-xl leading-none transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50"
                  aria-label={`Remove ${name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Start */}
      <button
        onClick={startGame}
        disabled={!canStart}
        className="w-full bg-gradient-to-r from-rose-500 via-orange-400 to-violet-500 hover:brightness-105 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg py-4 transition-all shadow-lg shadow-rose-200"
      >
        {canStart
          ? `Start · ${players.length} Players`
          : `Need ${DARE_CONFIG.MIN_PLAYERS - players.length} more player${DARE_CONFIG.MIN_PLAYERS - players.length === 1 ? '' : 's'}`}
      </button>
    </div>
  );
}
