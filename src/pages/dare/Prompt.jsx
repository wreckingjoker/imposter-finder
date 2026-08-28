import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTruthOrDare } from '../../context/TruthOrDareContext.jsx';
import { useTruthOrDarePrompts } from '../../hooks/useTruthOrDarePrompts.js';

export default function Prompt() {
  const { state, dispatch } = useTruthOrDare();
  const { getRandomPrompt } = useTruthOrDarePrompts();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.currentPair) navigate('/dare/wheel');
  }, [state.currentPair, navigate]);

  if (!state.currentPair) return null;

  const asker = state.players.find(p => p.id === state.currentPair.askerId);
  const target = state.players.find(p => p.id === state.currentPair.targetId);
  const { currentPrompt } = state;

  function chooseType(type) {
    const prompt = getRandomPrompt(type);
    dispatch({ type: 'CHOOSE_TYPE', payload: { type, prompt } });
  }

  function skip() {
    const prompt = getRandomPrompt(currentPrompt.type, [currentPrompt.id]);
    dispatch({ type: 'SKIP_PROMPT', payload: { prompt } });
  }

  function nextSpin() {
    dispatch({ type: 'NEXT_ROUND' });
    navigate('/dare/wheel');
  }

  function endGame() {
    dispatch({ type: 'RESET' });
    navigate('/dare/players');
  }

  return (
    <div className="min-h-dvh flex flex-col max-w-sm mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8 select-none">
        <span className="text-5xl block mb-3">🎯</span>
        <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
          <span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">{asker?.name}</span>
          {' '}can ask{' '}
          <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">{target?.name}</span>
        </h1>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {!currentPrompt ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => chooseType('truth')}
              className="bg-gradient-to-br from-violet-500 to-indigo-500 hover:brightness-105 text-white rounded-3xl font-extrabold text-xl py-10 transition-all shadow-lg shadow-violet-200 active:scale-[0.98]"
            >
              Truth
            </button>
            <button
              onClick={() => chooseType('dare')}
              className="bg-gradient-to-br from-rose-500 to-orange-400 hover:brightness-105 text-white rounded-3xl font-extrabold text-xl py-10 transition-all shadow-lg shadow-rose-200 active:scale-[0.98]"
            >
              Dare
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentPrompt.type === 'truth'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {currentPrompt.type === 'truth' ? 'TRUTH' : 'DARE'}
              </span>
              <p className="text-gray-900 font-semibold text-lg leading-relaxed mt-3">
                {currentPrompt.text}
              </p>
            </div>

            <button
              onClick={skip}
              className="w-full bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl font-semibold py-3 transition-all"
            >
              Skip
            </button>

            <button
              onClick={nextSpin}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white rounded-2xl font-bold text-lg py-4 transition-all shadow-lg shadow-violet-200 active:scale-[0.98]"
            >
              Next Spin
            </button>
          </div>
        )}
      </div>

      <button
        onClick={endGame}
        className="text-gray-400 text-sm mt-8 hover:text-rose-400 font-semibold transition-colors self-center"
      >
        End Game
      </button>
    </div>
  );
}
