const CARD_COLORS = [
  'border-violet-200 bg-violet-50',
  'border-pink-200 bg-pink-50',
  'border-amber-200 bg-amber-50',
  'border-teal-200 bg-teal-50',
  'border-blue-200 bg-blue-50',
  'border-emerald-200 bg-emerald-50',
  'border-orange-200 bg-orange-50',
  'border-indigo-200 bg-indigo-50',
  'border-cyan-200 bg-cyan-50',
  'border-sky-200 bg-sky-50',
];

const TEXT_COLORS = [
  'text-violet-700', 'text-pink-700', 'text-amber-700',
  'text-teal-700', 'text-blue-700', 'text-emerald-700',
  'text-orange-700', 'text-indigo-700', 'text-cyan-700', 'text-sky-700',
];

export default function WordRevealGrid({ players }) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {players.map((player, i) => (
        <div
          key={player.id}
          className={`rounded-2xl border-2 p-4 flex flex-col gap-1 transition-all ${
            player.isImposter
              ? 'bg-rose-50 border-rose-300'
              : player.isEliminated
              ? 'bg-gray-50 border-gray-200 opacity-60'
              : CARD_COLORS[i % CARD_COLORS.length]
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 truncate">{player.name}</span>
            {player.isImposter && (
              <span className="text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold shrink-0 ml-1">
                SPY
              </span>
            )}
            {player.isEliminated && !player.isImposter && (
              <span className="text-xs text-gray-400 shrink-0 ml-1">out</span>
            )}
          </div>
          <span className={`text-base font-extrabold leading-tight ${
            player.isImposter ? 'text-rose-600' : TEXT_COLORS[i % TEXT_COLORS.length]
          }`}>
            {player.word}
          </span>
        </div>
      ))}
    </div>
  );
}
