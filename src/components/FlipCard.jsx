import { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG } from '../config/game.js';

const TOTAL = GAME_CONFIG.CARD_REVEAL_MS / 1000;

export default function FlipCard({ word, wordContext, onSeen }) {
  const [flipped, setFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);
  const callbackFired = useRef(false);

  function handleTap() {
    if (flipped || started) return;
    setFlipped(true);
    setStarted(true);
  }

  useEffect(() => {
    if (!started) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);

    const flipBack = setTimeout(() => {
      setFlipped(false);
      if (!callbackFired.current) {
        callbackFired.current = true;
        onSeen();
      }
    }, GAME_CONFIG.CARD_REVEAL_MS);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(flipBack);
    };
  }, [started, onSeen]);

  const progress = started ? ((TOTAL - timeLeft) / TOTAL) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Card */}
      <div
        onClick={handleTap}
        className="relative w-64 h-96 cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Back face */}
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex flex-col items-center justify-center gap-3 shadow-2xl shadow-violet-200"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-6xl">🂠</span>
            <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">
              Tap to reveal
            </span>
          </div>

          {/* Front face */}
          <div
            className="absolute inset-0 rounded-3xl bg-white border-2 border-violet-200 flex flex-col items-center justify-center gap-2 shadow-2xl shadow-violet-100 px-4"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="text-violet-400 text-xs font-bold uppercase tracking-widest">Your word</span>
            <span className="text-gray-900 text-3xl font-extrabold text-center leading-tight">{word}</span>
            {wordContext && (
              <span className="text-gray-400 text-xs text-center leading-relaxed mt-1 px-2">{wordContext}</span>
            )}
            <span className="text-gray-300 text-[10px] mt-2 uppercase tracking-widest">Don't show anyone</span>
          </div>
        </div>
      </div>

      {/* Countdown bar */}
      <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full transition-all duration-1000"
          style={{ width: started ? `${100 - progress}%` : '100%' }}
        />
      </div>

      {started
        ? <span className="text-gray-400 text-sm tabular-nums">Flipping back in {timeLeft}s</span>
        : <span className="text-gray-400 text-sm">Tap the card to see your word</span>
      }
    </div>
  );
}
