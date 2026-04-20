const CHIP_COLORS = [
  'bg-violet-500', 'bg-pink-500', 'bg-amber-400',
  'bg-teal-500', 'bg-blue-500', 'bg-rose-500',
  'bg-emerald-500', 'bg-orange-400', 'bg-indigo-500', 'bg-cyan-500',
];

export default function PlayerChip({ player, isActive = false, isEliminated = false, showWord = false, index = 0 }) {
  const initials = player.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const color = CHIP_COLORS[index % CHIP_COLORS.length];

  return (
    <div className={`flex flex-col items-center gap-1 transition-all ${isEliminated ? 'opacity-35' : ''}`}>
      <div className={`relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all ${
        isEliminated
          ? 'bg-gray-300'
          : isActive
          ? `${color} ring-3 ring-offset-2 ring-offset-white shadow-lg`
          : `${color} opacity-60`
      }`}
        style={isActive ? { ringColor: 'currentColor' } : {}}
      >
        {isEliminated ? '✕' : initials}
      </div>
      <span className={`text-xs max-w-[52px] truncate text-center font-semibold ${
        isActive ? 'text-gray-900' : isEliminated ? 'text-gray-300' : 'text-gray-500'
      }`}>
        {player.name}
      </span>
      {showWord && !isEliminated && (
        <span className="text-xs text-white bg-gray-700 rounded px-1.5 py-0.5 max-w-[64px] truncate">
          {player.word}
        </span>
      )}
    </div>
  );
}
