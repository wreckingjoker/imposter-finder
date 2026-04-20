const BAR_COLORS = [
  'bg-violet-400', 'bg-pink-400', 'bg-amber-400',
  'bg-teal-400', 'bg-blue-400', 'bg-rose-400',
  'bg-emerald-400', 'bg-orange-400', 'bg-indigo-400', 'bg-cyan-400',
];

export default function VoteBar({ votes, players }) {
  const activePlayers = players.filter(p => !p.isEliminated);
  const totalVotes = Object.keys(votes).length;

  const tally = {};
  Object.values(votes).forEach(targetId => {
    tally[targetId] = (tally[targetId] || 0) + 1;
  });

  const maxVotes = Math.max(1, ...Object.values(tally));

  return (
    <div className="space-y-2.5">
      {activePlayers.map((player, i) => {
        const count = tally[player.id] || 0;
        const pct = (count / maxVotes) * 100;
        return (
          <div key={player.id} className="flex items-center gap-3">
            <span className="text-gray-600 text-xs font-semibold w-20 truncate shrink-0">{player.name}</span>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${BAR_COLORS[i % BAR_COLORS.length]} rounded-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-gray-500 text-xs w-4 text-right tabular-nums font-bold">{count}</span>
          </div>
        );
      })}
      <p className="text-gray-400 text-xs text-right pt-1">
        {totalVotes} / {activePlayers.length} voted
      </p>
    </div>
  );
}
