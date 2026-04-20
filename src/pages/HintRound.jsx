import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import TurnIndicator from '../components/TurnIndicator.jsx';

export default function HintRound() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.phase === 'lobby') navigate('/lobby');
    if (state.phase === 'voting') navigate('/voting');
    if (state.phase === 'elimination') navigate('/elimination');
    if (state.phase === 'game-over') navigate('/game-over');
  }, [state.phase, navigate]);

  const activePlayers = state.players.filter(p => !p.isEliminated);
  const currentPlayer = activePlayers[state.currentPlayerIndex];
  const isLastPlayer = state.currentPlayerIndex === activePlayers.length - 1;

  if (!currentPlayer) return null;

  function next() {
    dispatch({ type: 'SUBMIT_HINT', payload: { playerId: currentPlayer.id, hint: '' } });
  }

  return (
    <div className="min-h-dvh flex flex-col max-w-sm mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-gray-500 text-sm font-medium">Hint Round</span>
        <span className="text-xs font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
          Round {state.round}
        </span>
      </div>

      {/* Turn indicator */}
      <TurnIndicator players={activePlayers} currentIndex={state.currentPlayerIndex} />

      {/* Current player card */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10">
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 px-8 py-10 w-full">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-3">Now giving a hint</p>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{currentPlayer.name}</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Say one sentence about your word —<br />without saying it directly.
          </p>
        </div>
      </div>

      {/* Progress */}
      <p className="text-center text-gray-400 text-xs mb-4">
        {state.currentPlayerIndex + 1} of {activePlayers.length} players
      </p>

      <button
        onClick={next}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-2xl font-bold text-lg py-4 transition-all shadow-lg shadow-pink-100"
      >
        {isLastPlayer ? '🗳️ Start Voting' : 'Next Player →'}
      </button>
    </div>
  );
}
