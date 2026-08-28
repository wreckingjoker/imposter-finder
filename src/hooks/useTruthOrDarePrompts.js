import { useState, useEffect } from 'react';
import { friendsPrompts, familyPrompts } from '../data/truthOrDarePrompts.js';

const KEYS = {
  friends: 'truth-or-dare-prompts-friends',
  family:  'truth-or-dare-prompts-family',
};

const DEFAULTS = {
  friends: friendsPrompts,
  family:  familyPrompts,
};

function getMode() {
  return localStorage.getItem('truth-or-dare-mode') === 'family' ? 'family' : 'friends';
}

function isValidPrompt(p) {
  return (
    p !== null &&
    typeof p === 'object' &&
    typeof p.id === 'string' &&
    (p.type === 'truth' || p.type === 'dare') &&
    typeof p.text === 'string' &&
    p.text.trim() !== ''
  );
}

function loadPrompts(mode) {
  const defaults = DEFAULTS[mode];
  try {
    const raw = localStorage.getItem(KEYS[mode]);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaults;
    const valid = parsed.filter(isValidPrompt);
    if (valid.length === 0) return defaults;
    return valid;
  } catch {
    return defaults;
  }
}

export function useTruthOrDarePrompts() {
  const mode = getMode();
  const [prompts, setPrompts] = useState(() => loadPrompts(mode));

  useEffect(() => {
    localStorage.setItem(KEYS[mode], JSON.stringify(prompts));
  }, [prompts, mode]);

  function addPrompt({ type, text }) {
    const newPrompt = { id: Date.now().toString(), type, text };
    setPrompts(prev => [...prev, newPrompt]);
  }

  function deletePrompt(id) {
    setPrompts(prev => prev.filter(p => p.id !== id));
  }

  function resetToDefaults() {
    localStorage.removeItem(KEYS[mode]);
    setPrompts(DEFAULTS[mode]);
  }

  function getRandomPrompt(type, excludeIds = []) {
    const ofType = prompts.filter(p => p.type === type);
    const fresh = ofType.filter(p => !excludeIds.includes(p.id));
    const pool = fresh.length > 0 ? fresh : ofType;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return { prompts, addPrompt, deletePrompt, resetToDefaults, getRandomPrompt };
}
