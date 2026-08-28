import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTruthOrDarePrompts } from '../../hooks/useTruthOrDarePrompts.js';

const TYPE_LABELS = { truth: 'Truth', dare: 'Dare' };

export default function AdminPanel() {
  const navigate = useNavigate();
  const { prompts, addPrompt, deletePrompt, resetToDefaults } = useTruthOrDarePrompts();

  const [form, setForm] = useState({ type: 'truth', text: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const grouped = prompts.reduce((acc, prompt) => {
    const key = prompt.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(prompt);
    return acc;
  }, {});

  function handleAdd(e) {
    e.preventDefault();
    if (!form.text.trim()) {
      setError('Prompt text is required.');
      return;
    }
    addPrompt({ type: form.type, text: form.text.trim() });
    setForm({ type: 'truth', text: '' });
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
        onClick={() => navigate('/dare/players')}
        className="text-violet-500 text-sm mb-6 flex items-center gap-1 hover:text-violet-700 font-semibold transition-colors"
      >
        ← Back to Players
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Truth or Dare Prompts</h1>
        <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">
          {prompts.length} prompts
        </span>
      </div>

      {/* Add toggle */}
      <button
        onClick={() => { setShowForm(v => !v); setError(''); }}
        className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-xl py-3 font-bold transition-all shadow-sm shadow-violet-100 mb-4"
      >
        {showForm ? 'Cancel' : '+ Add Prompt'}
      </button>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex gap-2 mb-2">
            {['truth', 'dare'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, type }))}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                  form.type === type
                    ? type === 'truth'
                      ? 'bg-violet-500 text-white'
                      : 'bg-rose-500 text-white'
                    : 'bg-gray-50 text-gray-400 border-2 border-gray-100'
                }`}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
          <textarea
            value={form.text}
            onChange={e => { setForm(prev => ({ ...prev, text: e.target.value })); setError(''); }}
            placeholder="Prompt text"
            maxLength={200}
            rows={3}
            className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-lg px-3 py-2 mb-2 placeholder-gray-400 focus:outline-none focus:border-violet-300 transition-all resize-none"
          />
          {error && <p className="text-rose-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl py-2.5 font-bold transition-all"
          >
            Add
          </button>
        </form>
      )}

      {/* Prompts list */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center text-gray-400 py-8 text-sm">
          No prompts yet. Add one above.
        </div>
      ) : (
        ['truth', 'dare'].filter(type => grouped[type]?.length).map(type => (
          <div key={type} className="mb-5">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
              {TYPE_LABELS[type]} — {grouped[type].length}
            </h2>
            {grouped[type].map(prompt => (
              <div
                key={prompt.id}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 mb-2 border border-gray-100 shadow-sm gap-3"
              >
                <span className="text-gray-700 text-sm font-medium">
                  {prompt.text}
                </span>
                <button
                  onClick={() => deletePrompt(prompt.id)}
                  className="text-gray-300 hover:text-rose-400 text-xl leading-none shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 transition-colors"
                  aria-label="Delete prompt"
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
            This will delete all custom prompts and restore the 20 defaults.
          </p>
        )}
      </div>
    </div>
  );
}
