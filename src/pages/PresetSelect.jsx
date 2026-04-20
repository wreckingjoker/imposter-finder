import { useState } from 'react';
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

const HOW_TO_PLAY = [
  { step: '1', title: 'Add Players',   desc: 'Enter 3–10 player names in the lobby.' },
  { step: '2', title: 'Get Your Word', desc: 'Pass the phone around. Each player taps their card — a secret word appears for 3 seconds, then hides.' },
  { step: '3', title: 'Give Hints',    desc: 'Take turns saying one clue about your word without revealing it. The imposter bluffs along.' },
  { step: '4', title: 'Vote',          desc: 'After all hints, everyone votes for who they think is the imposter.' },
  { step: '5', title: 'Win or Lose',   desc: 'Crew wins by voting out the imposter. Imposter wins by surviving until only 2 players remain.' },
];

export default function PresetSelect() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function selectPreset(id) {
    localStorage.setItem('imposter-finder-preset', id);
    navigate('/lobby');
  }

  return (
    <div className="min-h-dvh flex flex-col items-center max-w-sm mx-auto px-4 pt-16 pb-12">

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

      {/* How to Play */}
      <div className="w-full mt-6">
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-600 font-semibold text-sm transition-all active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <span className="text-base">📖</span> How to Play
          </span>
          <span className={`text-gray-400 text-xs transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {open && (
          <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {HOW_TO_PLAY.map((item, i) => (
              <div
                key={item.step}
                className={`flex gap-4 px-4 py-4 ${i < HOW_TO_PLAY.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-600 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </span>
                <div>
                  <p className="text-gray-800 font-bold text-sm mb-0.5">{item.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
