import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import FlipCard from '../components/FlipCard.jsx';

export default function CardReveal() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.phase === 'lobby') navigate('/lobby');
    if (state.phase === 'hint-round') navigate('/hint-round');
  }, [state.phase, navigate]);

  const activePlayers = state.players.filter(p => !p.isEliminated);
  const currentPlayer = activePlayers[state.currentPlayerIndex];

  if (!currentPlayer) return null;

  function handleSeen() {
    dispatch({ type: 'CARD_SEEN' });
  }

  return (
    <div className="min-h-dvh flex flex-col items-center max-w-sm mx-auto px-4 py-8">

      {/* Progress */}
      <div className="w-full flex items-center justify-between mb-8">
        <span className="text-gray-500 text-sm font-medium">Card Reveal</span>
        <span className="text-xs font-bold text-violet-600 bg-violet-100 px-3 py-1 rounded-full">
          {state.currentPlayerIndex + 1} of {activePlayers.length}
        </span>
      </div>

      {/* Instruction */}
      <div className="text-center mb-10">
        <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">
          Pass the phone to
        </p>
        <h2 className="text-3xl font-extrabold text-gray-900">{currentPlayer.name}</h2>
      </div>

      {/* Card */}
      <FlipCard key={state.currentPlayerIndex} word={currentPlayer.word} onSeen={handleSeen} />

      {/* Progress dots */}
      <div className="flex gap-2 mt-10">
        {activePlayers.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < state.currentPlayerIndex
                ? 'bg-violet-400 w-4'
                : i === state.currentPlayerIndex
                ? 'bg-violet-600 w-6'
                : 'bg-gray-200 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
