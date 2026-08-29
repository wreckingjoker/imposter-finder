import { useNavigate } from 'react-router-dom';

const GAMES = [
  {
    id: 'imposter',
    emoji: '🎭',
    name: 'Find the Imposter',
    card: 'from-violet-400 to-indigo-500',
    shadow: 'shadow-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    badgeLabel: 'Social Deduction',
    path: '/imposter',
  },
  {
    id: 'dare',
    emoji: '🎡',
    name: 'Truth or Dare',
    card: 'from-rose-400 to-orange-400',
    shadow: 'shadow-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    badgeLabel: 'Party Game',
    path: '/dare',
  },
];

export default function GameSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex flex-col items-center max-w-sm mx-auto px-4 pt-16 pb-12">

      {/* Title */}
      <div className="text-center mb-10 select-none">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_16px_rgba(255,255,255,0.85)]">
          Pick a Game
        </h1>
        <p className="text-gray-700 text-sm font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">One device, pass it around</p>
      </div>

      {/* Game cards */}
      <div className="w-full space-y-4">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => navigate(game.path)}
            className="w-full text-left group transition-all active:scale-[0.98]"
          >
            <div className={`rounded-3xl bg-gradient-to-br ${game.card} p-[2px] shadow-lg ${game.shadow}`}>
              <div className="bg-white rounded-[22px] p-5 flex items-start gap-4">

                {/* Emoji */}
                <span className="text-4xl shrink-0 mt-0.5">{game.emoji}</span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span className="text-gray-900 font-extrabold text-lg leading-tight block mb-1.5">{game.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${game.badge}`}>
                    {game.badgeLabel}
                  </span>
                </div>

                {/* Arrow */}
                <span className="text-gray-300 group-hover:text-gray-500 text-xl shrink-0 mt-1 transition-colors">→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
