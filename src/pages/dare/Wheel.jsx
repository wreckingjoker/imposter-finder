import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTruthOrDare } from '../../context/TruthOrDareContext.jsx';
import SpinWheel from '../../components/SpinWheel.jsx';

export default function Wheel() {
  const { state, dispatch } = useTruthOrDare();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.players.length === 0) navigate('/dare/players');
  }, [state.players, navigate]);

  useEffect(() => {
    if (state.phase === 'prompt') navigate('/dare/prompt');
  }, [state.phase, navigate]);

  function handleResult({ askerId, targetId }) {
    dispatch({ type: 'SELECT_PAIR', payload: { askerId, targetId } });
  }

  return (
    <div className="min-h-dvh flex flex-col max-w-sm mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8 select-none">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 via-orange-400 to-violet-500 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_16px_rgba(255,255,255,0.85)]">
          Spin the Wheel
        </h1>
        <p className="text-gray-700 text-sm font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
          {state.mode === 'family' ? 'Family mode' : 'Friends mode'} · {state.players.length} players
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <SpinWheel players={state.players} lastPair={state.lastPair} onResult={handleResult} />
      </div>

    </div>
  );
}
