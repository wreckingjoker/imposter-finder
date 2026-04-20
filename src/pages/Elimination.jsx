import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';

export default function Elimination() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.phase === 'lobby') navigate('/lobby');
    if (state.phase === 'hint-round') navigate('/hint-round');
    if (state.phase === 'game-over') navigate('/game-over');
  }, [state.phase, navigate]);

  const eliminated = state.eliminatedThisRound;
  if (!eliminated) return null;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center max-w-sm mx-auto px-4 text-center">

      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-6 shadow-xl shadow-rose-100">
        <span className="text-4xl">👤</span>
      </div>

      <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Eliminated</p>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">{eliminated.name}</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-10 w-full">
        <p className="text-gray-600 text-base leading-relaxed">
          The crew voted out a <span className="text-gray-900 font-bold">crew member</span>.
          <br />The Imposter is still out there!
        </p>
      </div>

      <button
        onClick={() => dispatch({ type: 'NEXT_ROUND' })}
        className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl font-bold text-lg py-4 transition-all shadow-lg shadow-violet-100"
      >
        Continue to Next Round
      </button>
    </div>
  );
}
