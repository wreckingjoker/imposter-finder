import { createContext, useContext, useReducer } from 'react';

const initialState = {
  mode: null,
  players: [],
  phase: 'setup',
  currentPair: null,
  lastPair: null,
  currentPrompt: null,
};

function truthOrDareReducer(state, action) {
  switch (action.type) {
    case 'START': {
      const { mode, players } = action.payload;
      return {
        ...initialState,
        mode,
        phase: 'wheel',
        players: players.map((name, i) => ({ id: String(i), name })),
      };
    }

    case 'SELECT_PAIR': {
      const { askerId, targetId } = action.payload;
      const pair = { askerId, targetId };
      return { ...state, currentPair: pair, lastPair: pair, phase: 'prompt' };
    }

    case 'CHOOSE_TYPE': {
      const { prompt } = action.payload;
      return { ...state, currentPrompt: prompt };
    }

    case 'SKIP_PROMPT': {
      const { prompt } = action.payload;
      return { ...state, currentPrompt: prompt };
    }

    case 'NEXT_ROUND':
      return { ...state, currentPair: null, currentPrompt: null, phase: 'wheel' };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

const TruthOrDareContext = createContext(null);

export function TruthOrDareProvider({ children }) {
  const [state, dispatch] = useReducer(truthOrDareReducer, initialState);
  return (
    <TruthOrDareContext.Provider value={{ state, dispatch }}>
      {children}
    </TruthOrDareContext.Provider>
  );
}

export function useTruthOrDare() {
  const ctx = useContext(TruthOrDareContext);
  if (!ctx) throw new Error('useTruthOrDare must be used inside <TruthOrDareProvider>');
  return ctx;
}
