import { useNavigate } from 'react-router-dom';

const PRESETS = [
  {
    id: 'family',
    emoji: '🌈',
    name: 'Wholesome',
    card: 'from-violet-400 to-indigo-500',
    shadow: 'shadow-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    badgeLabel: 'Family Safe',
  },
  {
    id: 'adult',
    emoji: '🍷',
    name: 'Unhinged',
    card: 'from-rose-400 to-pink-500',
    shadow: 'shadow-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    badgeLabel: 'After Dark',
  },
];

export default function PresetSelect() {
  const navigate = useNavigate();

  function selectPreset(id) {
    localStorage.setItem('imposter-finder-preset', id);
    navigate('/lobby');
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center max-w-sm mx-auto px-4 py-10">

      {/* Title */}
      <div className="text-center mb-10 select-none">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent mb-2">
          Find the Imposter
        </h1>
      </div>

      {/* Mode cards */}
      <div className="w-full space-y-4">
        {PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => selectPreset(preset.id)}
            className="w-full text-left group transition-all active:scale-[0.98]"
          >
            <div className={`rounded-3xl bg-gradient-to-br ${preset.card} p-[2px] shadow-lg ${preset.shadow}`}>
              <div className="bg-white rounded-[22px] p-5 flex items-start gap-4">

                {/* Emoji */}
                <span className="text-4xl shrink-0 mt-0.5">{preset.emoji}</span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span className="text-gray-900 font-extrabold text-lg leading-tight block mb-1.5">{preset.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${preset.badge}`}>
                    {preset.badgeLabel}
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
        onClick={() => navigate('/admin')}
        className="fixed bottom-4 left-4 text-xl opacity-40 select-none"
        aria-label=""
        tabIndex={-1}
      >
        😊
      </button>

    </div>
  );
}
