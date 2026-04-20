import { useState, useEffect } from 'react';
import { defaultWordPairs, adultWordPairs } from '../data/wordPresets.js';

const STORAGE_KEY = 'imposter-finder-word-pairs';

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

function loadPairs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultWordPairs;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultWordPairs;
    const valid = parsed.filter(isValidPair);
    return valid.length > 0 ? valid : defaultWordPairs;
  } catch {
    return defaultWordPairs;
  }
}

export function useWordPairs() {
  const [pairs, setPairs] = useState(loadPairs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
  }, [pairs]);

  function addPair({ category, crew, imposter }) {
    const newPair = { id: Date.now().toString(), category, crew, imposter };
    setPairs(prev => [...prev, newPair]);
  }

  function deletePair(id) {
    setPairs(prev => prev.filter(p => p.id !== id));
  }

  function resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    setPairs(defaultWordPairs);
  }

  function getRandomPair() {
    const preset = localStorage.getItem('imposter-finder-preset');
    const pool = preset === 'adult' ? adultWordPairs : pairs;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return { pairs, addPair, deletePair, resetToDefaults, getRandomPair };
}
