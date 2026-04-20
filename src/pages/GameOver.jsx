import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import WordRevealGrid from '../components/WordRevealGrid.jsx';

export default function GameOver() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.phase === 'lobby') navigate('/lobby');
  }, [state.phase, navigate]);

  const imposter = state.players.find(p => p.isImposter);
  const crewWon = state.winner === 'crew';

  function playAgain() {
    dispatch({ type: 'RESET' });
    navigate('/lobby');
  }

  return (
    <div className="min-h-dvh flex flex-col max-w-sm mx-auto px-4 py-8">

      {/* Winner banner */}
      <div className={`rounded-3xl p-6 text-center mb-6 ${
        crewWon
          ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
          : 'bg-gradient-to-br from-rose-400 to-pink-500'
      } shadow-xl ${crewWon ? 'shadow-emerald-100' : 'shadow-rose-100'}`}>
        <div className="text-5xl mb-3">{crewWon ? '🎉' : '🕵️'}</div>
        <h1 className="text-3xl font-extrabold text-white mb-1">
          {crewWon ? 'Crew Wins!' : 'Imposter Wins!'}
        </h1>
        <p className="text-white/80 text-sm mt-1">
          {crewWon
            ? 'The Imposter was caught by the crew.'
            : 'The Imposter fooled everyone and survived.'}
        </p>
      </div>

      {/* Imposter reveal */}
      {imposter && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-xl shrink-0">
            🕵️
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">The Imposter</p>
            <p className="text-gray-900 font-extrabold text-lg">{imposter.name}</p>
            <p className="text-gray-500 text-sm">
              Had: <span className="text-rose-500 font-bold">"{imposter.word}"</span>
              {' · '}Crew had: <span className="text-gray-700 font-bold">"{state.wordPair?.crew}"</span>
            </p>
          </div>
        </div>
      )}

      {/* Word grid */}
      <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-3">All Words</h3>
      <WordRevealGrid players={state.players} />

      <button
        onClick={playAgain}
        className="w-full mt-8 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white rounded-2xl font-bold text-lg py-4 transition-all shadow-lg shadow-violet-100"
      >
        Play Again
      </button>
    </div>
  );
}
