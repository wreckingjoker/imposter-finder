import { useNavigate } from 'react-router-dom';

const HOW_TO_PLAY = [
  'Spin the wheel — it points to who\'s asking and who\'s answering.',
  'The target picks Truth or Dare.',
  'Answer honestly or do the dare — or skip it if it\'s too much.',
  'Spin again and pass it on.',
];

const MODES = [
  {
    id: 'friends',
    emoji: '😈',
    name: 'Friends',
    card: 'from-rose-400 to-orange-400',
    shadow: 'shadow-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    badgeLabel: 'Spicy',
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    name: 'Family',
    card: 'from-violet-400 to-sky-400',
    shadow: 'shadow-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    badgeLabel: 'Playful',
  },
];

export default function ModeSelect() {
  const navigate = useNavigate();

  function selectMode(id) {
    localStorage.setItem('truth-or-dare-mode', id);
    navigate('/dare/players');
  }

  return (
    <div className="min-h-dvh flex flex-col items-center max-w-sm mx-auto px-4 pt-16 pb-12">

      {/* Back to game select */}
      <button
        onClick={() => navigate('/')}
        className="text-violet-500 text-sm mb-6 flex items-center gap-1 hover:text-violet-700 font-semibold transition-colors self-start"
      >
        ← Choose Game
      </button>

      {/* Title */}
      <div className="text-center mb-10 select-none">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 via-orange-400 to-violet-500 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_16px_rgba(255,255,255,0.85)]">
          Truth or Dare
        </h1>
        <p className="text-gray-700 text-sm font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">Who's playing tonight?</p>
      </div>

      {/* How to play */}
      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="text-gray-900 font-extrabold text-sm mb-4 flex items-center gap-2">
          <span className="text-lg">📖</span> How to Play
        </h2>
        <ol className="space-y-3">
          {HOW_TO_PLAY.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-gray-500 text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Mode cards */}
      <div className="w-full space-y-4">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => selectMode(mode.id)}
            className="w-full text-left group transition-all active:scale-[0.98]"
          >
            <div className={`rounded-3xl bg-gradient-to-br ${mode.card} p-[2px] shadow-lg ${mode.shadow}`}>
              <div className="bg-white rounded-[22px] p-5 flex items-start gap-4">

                {/* Emoji */}
                <span className="text-4xl shrink-0 mt-0.5">{mode.emoji}</span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span className="text-gray-900 font-extrabold text-lg leading-tight block mb-1.5">{mode.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mode.badge}`}>
                    {mode.badgeLabel}
                  </span>
                </div>

                {/* Arrow */}
                <span className="text-gray-300 group-hover:text-gray-500 text-xl shrink-0 mt-1 transition-colors">→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Secret admin access */}
      <button
        onClick={() => navigate('/dare/admin')}
        className="fixed bottom-4 left-4 text-xl opacity-40 select-none"
        aria-label=""
        tabIndex={-1}
      >
        😏
      </button>

    </div>
  );
}
