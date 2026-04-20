import { useEffect, useState } from 'react';

const FLOATERS = [
  { emoji: '🃏', top: '8%',  left: '6%',  rotate: '-15deg', size: '2.2rem', delay: '0s',    duration: '3.8s' },
  { emoji: '🕵️', top: '12%', right: '8%', rotate: '12deg',  size: '2rem',   delay: '0.4s',  duration: '4.2s' },
  { emoji: '🎭', top: '72%', left: '5%',  rotate: '8deg',   size: '2rem',   delay: '0.8s',  duration: '3.5s' },
  { emoji: '🃏', top: '78%', right: '6%', rotate: '-10deg', size: '1.8rem', delay: '0.2s',  duration: '4.5s' },
  { emoji: '👁️', top: '42%', left: '3%',  rotate: '5deg',   size: '1.6rem', delay: '1s',    duration: '3.9s' },
  { emoji: '🎴', top: '38%', right: '4%', rotate: '-8deg',  size: '1.8rem', delay: '0.6s',  duration: '4.1s' },
];

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFading(true), 2200);
    const done = setTimeout(onDone, 2700);
    return () => { clearTimeout(fade); clearTimeout(done); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'linear-gradient(145deg, #2e1065 0%, #4c1d95 35%, #86198f 70%, #be185d 100%)' }}
    >
      {/* Floating background emojis */}
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className="absolute select-none pointer-events-none"
          style={{
            top: f.top, left: f.left, right: f.right,
            rotate: f.rotate,
            fontSize: f.size,
            opacity: 0.18,
            animation: `floatY ${f.duration} ease-in-out ${f.delay} infinite alternate`,
          }}
        >
          {f.emoji}
        </span>
      ))}

      {/* Glow ring behind emoji */}
      <div className="relative flex items-center justify-center mb-8">
        <div
          className="absolute rounded-full"
          style={{
            width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            animation: 'pulseRing 1.6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full border border-white/20"
          style={{
            width: 96, height: 96,
            animation: 'pulseRing 1.6s ease-in-out 0.3s infinite',
          }}
        />
        <div className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
          style={{ fontSize: '2.6rem' }}
        >
          🕵️
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-4xl font-extrabold text-white tracking-tight text-center mb-2 px-6"
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
      >
        Find the Imposter
      </h1>
      <p className="text-white/50 text-xs uppercase tracking-widest mb-10">
        Social deduction · 3–10 players
      </p>

      {/* Animated loading dots */}
      <div className="flex gap-2.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            style={{ animation: `dotBounce 1s ease-in-out ${i * 0.18}s infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes floatY {
          from { transform: translateY(0px) rotate(var(--r, 0deg)); }
          to   { transform: translateY(-14px) rotate(var(--r, 0deg)); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1);   opacity: 0.6; }
          50%       { transform: scale(1.12); opacity: 0.2; }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
          40%           { transform: translateY(-8px); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
