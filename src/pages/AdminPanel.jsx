import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordPairs } from '../hooks/useWordPairs.js';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { pairs, addPair, deletePair, resetToDefaults } = useWordPairs();

  const [form, setForm] = useState({ category: '', crew: '', imposter: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const grouped = pairs.reduce((acc, pair) => {
    const key = pair.category || 'Uncategorised';
    if (!acc[key]) acc[key] = [];
    acc[key].push(pair);
    return acc;
  }, {});

  function handleAdd(e) {
    e.preventDefault();
    const { category, crew, imposter } = form;
    if (!category.trim() || !crew.trim() || !imposter.trim()) {
      setError('All fields are required.');
      return;
    }
    if (crew.trim().toLowerCase() === imposter.trim().toLowerCase()) {
      setError('Crew and Imposter words must be different.');
      return;
    }
    addPair({ category: category.trim(), crew: crew.trim(), imposter: imposter.trim() });
    setForm({ category: '', crew: '', imposter: '' });
    setError('');
    setShowForm(false);
  }

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetToDefaults();
    setConfirmReset(false);
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-violet-50 via-white to-sky-50 max-w-sm mx-auto px-4 py-6">

      {/* Header */}
      <button
        onClick={() => navigate('/lobby')}
        className="text-violet-500 text-sm mb-6 flex items-center gap-1 hover:text-violet-700 font-semibold transition-colors"
      >
        ← Back to Lobby
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Word Pairs</h1>
        <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">
          {pairs.length} pairs
        </span>
      </div>

      {/* Add toggle */}
      <button
        onClick={() => { setShowForm(v => !v); setError(''); }}
        className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-xl py-3 font-bold transition-all shadow-sm shadow-violet-100 mb-4"
      >
        {showForm ? 'Cancel' : '+ Add Pair'}
      </button>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          {[
            { field: 'category', placeholder: 'Category (e.g. Food)' },
            { field: 'crew', placeholder: 'Crew word' },
            { field: 'imposter', placeholder: 'Imposter word' },
          ].map(({ field, placeholder }) => (
            <input
              key={field}
              value={form[field]}
              onChange={e => { setForm(prev => ({ ...prev, [field]: e.target.value })); setError(''); }}
              placeholder={placeholder}
              maxLength={30}
              className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-lg px-3 py-2 mb-2 placeholder-gray-400 focus:outline-none focus:border-violet-300 transition-all"
            />
          ))}
          {error && <p className="text-rose-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl py-2.5 font-bold transition-all"
          >
            Add
          </button>
        </form>
      )}

      {/* Pairs list */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center text-gray-400 py-8 text-sm">
          No pairs yet. Add one above.
        </div>
      ) : (
        Object.entries(grouped).map(([category, categoryPairs]) => (
          <div key={category} className="mb-5">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
              {category} — {categoryPairs.length}
            </h2>
            {categoryPairs.map(pair => (
              <div
                key={pair.id}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 mb-2 border border-gray-100 shadow-sm"
              >
                <span className="text-gray-700 text-sm font-medium">
                  {pair.crew} <span className="text-gray-300">vs</span> {pair.imposter}
                </span>
                <button
                  onClick={() => deletePair(pair.id)}
                  className="text-gray-300 hover:text-rose-400 text-xl leading-none ml-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 transition-colors"
                  aria-label={`Delete ${pair.crew} / ${pair.imposter}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Reset */}
      <div className="mt-8 pb-8">
        <button
          onClick={handleReset}
          className="w-full bg-white border-2 border-rose-200 text-rose-400 hover:bg-rose-50 rounded-xl py-3 font-bold transition-colors"
        >
          {confirmReset ? 'Tap again to confirm reset' : 'Reset to Defaults'}
        </button>
        {confirmReset && (
          <p className="text-gray-400 text-xs text-center mt-2">
            This will delete all custom pairs and restore the 20 defaults.
          </p>
        )}
      </div>
    </div>
  );
}
