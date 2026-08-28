import { useState, useRef } from 'react';
import { DARE_CONFIG } from '../config/dare.js';

const CHIP_COLORS = [
  'bg-violet-500', 'bg-pink-500', 'bg-amber-500',
  'bg-teal-500', 'bg-blue-500', 'bg-rose-500',
  'bg-emerald-500', 'bg-orange-500', 'bg-indigo-500', 'bg-cyan-500',
];

function angleToIndex(bearing, n) {
  const slice = 360 / n;
  return Math.round(bearing / slice) % n;
}

function isSamePair(idA, idB, pair) {
  if (!pair) return false;
  return (idA === pair.askerId && idB === pair.targetId) || (idA === pair.targetId && idB === pair.askerId);
}

// Fewer players -> bigger, more legible chips. More players -> smaller, so they
// still fit the rim without overlapping.
function chipSizeFor(n) {
  if (n <= 4) return { px: 68, text: 'text-sm' };
  if (n <= 6) return { px: 58, text: 'text-xs' };
  if (n <= 9) return { px: 48, text: 'text-[11px]' };
  return { px: 40, text: 'text-[10px]' };
}

function pickLanding(players, lastPair) {
  const n = players.length;
  let restAngle, askerIdx, targetIdx;
  let attempts = 0;
  do {
    restAngle = Math.random() * 360;
    askerIdx = angleToIndex(restAngle, n);
    targetIdx = angleToIndex((restAngle + 180) % 360, n);
    attempts++;
  } while (
    attempts < 5 &&
    (askerIdx === targetIdx || (n > 2 && isSamePair(players[askerIdx].id, players[targetIdx].id, lastPair)))
  );
  if (askerIdx === targetIdx) targetIdx = (askerIdx + 1) % n;
  return { restAngle, askerIdx, targetIdx };
}

export default function SpinWheel({ players, lastPair, onResult }) {
  // Random idle angle so the needle doesn't always rest on player 0 before the first spin.
  const [rotation, setRotation] = useState(() => Math.random() * 360);
  const [spinning, setSpinning] = useState(false);
  const pendingResult = useRef(null);

  const n = players.length;
  const canSpin = n >= 2 && !spinning;

  function spin() {
    if (!canSpin) return;
    const { restAngle, askerIdx, targetIdx } = pickLanding(players, lastPair);

    const extraTurns =
      (DARE_CONFIG.MIN_EXTRA_SPINS + Math.random() * (DARE_CONFIG.MAX_EXTRA_SPINS - DARE_CONFIG.MIN_EXTRA_SPINS)) * 360;
    const current = ((rotation % 360) + 360) % 360;
    let delta = restAngle - current;
    if (delta < 0) delta += 360;

    pendingResult.current = { askerId: players[askerIdx].id, targetId: players[targetIdx].id };
    setSpinning(true);
    setRotation(rotation + extraTurns + delta);
  }

  function handleTransitionEnd(e) {
    if (e.target !== e.currentTarget || !spinning) return;
    setSpinning(false);
    const result = pendingResult.current;
    pendingResult.current = null;
    if (result) onResult(result);
  }

  const R = 38; // percent of container
  const { px: chipPx, text: chipText } = chipSizeFor(n);
  const chips = players.map((p, i) => {
    const bearing = i * (360 / n);
    const rad = (bearing * Math.PI) / 180;
    const x = 50 + R * Math.sin(rad);
    const y = 50 - R * Math.cos(rad);
    return (
      <div
        key={p.id}
        className={`absolute rounded-full ${CHIP_COLORS[i % CHIP_COLORS.length]} text-white ${chipText} font-bold flex items-center justify-center text-center px-1.5 leading-tight shadow-md`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: chipPx,
          height: chipPx,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <span className="line-clamp-2 w-full break-words">{p.name}</span>
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative rounded-full bg-white border-4 border-violet-100 shadow-lg shadow-violet-200"
        style={{ width: 'min(78vw, 280px)', height: 'min(78vw, 280px)' }}
      >
        {chips}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '50% 50%',
            transition: spinning ? `transform ${DARE_CONFIG.SPIN_DURATION_MS}ms cubic-bezier(0.32,0.72,0.35,1)` : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Arrow end — the "asker" */}
          <line x1="50" y1="22" x2="50" y2="50" strokeWidth="3" className="stroke-violet-600" />
          <polygon points="50,8 44,22 56,22" className="fill-violet-600" />
          {/* Dot end — the "target" */}
          <line x1="50" y1="50" x2="50" y2="80" strokeWidth="3" className="stroke-rose-400" />
          <circle cx="50" cy="84" r="5" className="fill-rose-400" />
          <circle cx="50" cy="50" r="5" className="fill-violet-600" />
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={!canSpin}
        className="w-full max-w-[240px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg py-4 transition-all shadow-lg shadow-violet-200 active:scale-[0.98]"
      >
        {spinning ? 'Spinning…' : n < 2 ? 'Need more players' : '🎯 Spin'}
      </button>
    </div>
  );
}
