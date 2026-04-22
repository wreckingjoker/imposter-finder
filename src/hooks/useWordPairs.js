import { useState, useEffect } from 'react';
import { defaultWordPairs, adultWordPairs } from '../data/wordPresets.js';

const KEYS = {
  family: 'imposter-finder-pairs-family',
  adult:  'imposter-finder-pairs-adult',
};

const DEFAULTS = {
  family: defaultWordPairs,
  adult:  adultWordPairs,
};

function getPreset() {
  return localStorage.getItem('imposter-finder-preset') === 'adult' ? 'adult' : 'family';
}

function isValidPair(p) {
  return (
    p !== null &&
    typeof p === 'object' &&
    typeof p.id === 'string' &&
    typeof p.category === 'string' &&
    typeof p.crew === 'string' &&
    typeof p.imposter === 'string' &&
    p.crew.trim() !== '' &&
    p.imposter.trim() !== ''
  );
}

function mergeContext(pairs, defaults) {
  const defaultsById = Object.fromEntries(defaults.map(d => [d.id, d]));
  return pairs.map(p => {
    if (p.crewContext && p.imposterContext) return p;
    const def = defaultsById[p.id];
    return def
      ? { ...p, crewContext: def.crewContext, imposterContext: def.imposterContext }
      : p;
  });
}

function loadPairs(preset) {
  const defaults = DEFAULTS[preset];
  try {
    const raw = localStorage.getItem(KEYS[preset]);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaults;
    const valid = parsed.filter(isValidPair);
    if (valid.length === 0) return defaults;
    return mergeContext(valid, defaults);
  } catch {
    return defaults;
  }
}

export function useWordPairs() {
  const preset = getPreset();
  const [pairs, setPairs] = useState(() => loadPairs(preset));

  useEffect(() => {
    localStorage.setItem(KEYS[preset], JSON.stringify(pairs));
  }, [pairs, preset]);

  function addPair({ category, crew, imposter }) {
    const newPair = { id: Date.now().toString(), category, crew, imposter };
    setPairs(prev => [...prev, newPair]);
  }

  function deletePair(id) {
    setPairs(prev => prev.filter(p => p.id !== id));
  }

  function resetToDefaults() {
    localStorage.removeItem(KEYS[preset]);
    setPairs(DEFAULTS[preset]);
  }

  function getRandomPair() {
    return pairs[Math.floor(Math.random() * pairs.length)];
  }

  return { pairs, addPair, deletePair, resetToDefaults, getRandomPair };
}
