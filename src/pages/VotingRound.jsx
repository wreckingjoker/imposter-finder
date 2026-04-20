import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import VoteBar from '../components/VoteBar.jsx';

export default function VotingRound() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const [voterIndex, setVoterIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (state.phase === 'lobby') navigate('/lobby');
    if (state.phase === 'hint-round') navigate('/hint-round');
    if (state.phase === 'elimination') navigate('/elimination');
    if (state.phase === 'game-over') navigate('/game-over');
  }, [state.phase, navigate]);

  const activePlayers = state.players.filter(p => !p.isEliminated);
  const currentVoter = activePlayers[voterIndex];
  const allVoted = voterIndex >= activePlayers.length;

  useEffect(() => {
    if (allVoted) dispatch({ type: 'RESOLVE_VOTE' });
  }, [allVoted, dispatch]);

  if (!currentVoter && !allVoted) return null;

  function confirmVote() {
    if (!selected) return;
    dispatch({ type: 'CAST_VOTE', payload: { voterId: currentVoter.id, targetId: selected } });
    setSelected(null);
    setVoterIndex(i => i + 1);
  }

  const candidates = activePlayers.filter(p => p.id !== currentVoter?.id);

  if (allVoted) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500 text-sm">Counting votes…</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col max-w-sm mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-500 text-sm font-medium">Vote</span>
        <span className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
          {voterIndex + 1} of {activePlayers.length}
        </span>
      </div>

      {/* Current voter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Voting now</p>
        <h2 className="text-2xl font-extrabold text-gray-900">{currentVoter.name}</h2>
        <p className="text-gray-400 text-sm mt-1">Who do you think is the Imposter?</p>
      </div>

      {/* Candidates */}
      <div className="flex-1 space-y-2 mb-6">
        {candidates.map(player => (
          <button
            key={player.id}
            onClick={() => setSelected(player.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all text-left ${
              selected === player.id
                ? 'border-rose-400 bg-rose-50'
                : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              selected === player.id ? 'border-rose-400 bg-rose-400' : 'border-gray-300'
            }`}>
              {selected === player.id && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span className={`font-bold transition-colors ${
              selected === player.id ? 'text-rose-700' : 'text-gray-700'
            }`}>
              {player.name}
            </span>
          </button>
        ))}
      </div>

      {/* Live tally */}
      {Object.keys(state.votes).length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-3">Live tally</p>
          <VoteBar votes={state.votes} players={state.players} />
        </div>
      )}

      <button
        onClick={confirmVote}
        disabled={!selected}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg py-4 transition-all shadow-lg shadow-rose-100"
      >
        Confirm Vote
      </button>
    </div>
  );
}
