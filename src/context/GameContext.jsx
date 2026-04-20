import { createContext, useContext, useReducer } from 'react';
import { GAME_CONFIG } from '../config/game.js';

const initialState = {
  phase: 'lobby',
  players: [],
  currentPlayerIndex: 0,
  hints: [],
  votes: {},
  eliminatedThisRound: null,
  winner: null,
  wordPair: null,
  round: 1,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const { players, wordPair } = action.payload;
      const imposterIndex = Math.floor(Math.random() * players.length);
      return {
        ...initialState,
        phase: 'card-reveal',
        wordPair,
        players: players.map((name, i) => ({
          id: String(i),
          name,
          word: i === imposterIndex ? wordPair.imposter : wordPair.crew,
          isEliminated: false,
          isImposter: i === imposterIndex,
        })),
      };
    }

    case 'CARD_SEEN': {
      const activePlayers = state.players.filter(p => !p.isEliminated);
      const nextIndex = state.currentPlayerIndex + 1;
      if (nextIndex >= activePlayers.length) {
        return { ...state, phase: 'hint-round', currentPlayerIndex: 0 };
      }
      return { ...state, currentPlayerIndex: nextIndex };
    }

    case 'SUBMIT_HINT': {
      const { playerId, hint } = action.payload;
      const newHints = [...state.hints, { playerId, hint }];
      const activePlayers = state.players.filter(p => !p.isEliminated);
      const nextIndex = state.currentPlayerIndex + 1;
      if (nextIndex >= activePlayers.length) {
        return { ...state, hints: newHints, phase: 'voting', currentPlayerIndex: 0 };
      }
      return { ...state, hints: newHints, currentPlayerIndex: nextIndex };
    }

    case 'CAST_VOTE': {
      const { voterId, targetId } = action.payload;
      return { ...state, votes: { ...state.votes, [voterId]: targetId } };
    }

    case 'RESOLVE_VOTE': {
      const tally = {};
      Object.values(state.votes).forEach(targetId => {
        tally[targetId] = (tally[targetId] || 0) + 1;
      });
      const maxVotes = Math.max(...Object.values(tally));
      const topTargets = Object.keys(tally).filter(id => tally[id] === maxVotes);

      if (topTargets.length > 1) {
        // Tie — no elimination, repeat hint round
        return {
          ...state,
          phase: 'hint-round',
          votes: {},
          hints: [],
          currentPlayerIndex: 0,
          round: state.round + 1,
          eliminatedThisRound: null,
        };
      }

      const eliminatedId = topTargets[0];
      const eliminated = state.players.find(p => p.id === eliminatedId);
      const updatedPlayers = state.players.map(p =>
        p.id === eliminatedId ? { ...p, isEliminated: true } : p
      );

      if (eliminated.isImposter) {
        return {
          ...state,
          players: updatedPlayers,
          phase: 'game-over',
          winner: 'crew',
          eliminatedThisRound: eliminated,
        };
      }

      const remaining = updatedPlayers.filter(p => !p.isEliminated);
      if (remaining.length <= GAME_CONFIG.IMPOSTER_WIN_AT) {
        return {
          ...state,
          players: updatedPlayers,
          phase: 'game-over',
          winner: 'imposter',
          eliminatedThisRound: eliminated,
        };
      }

      return {
        ...state,
        players: updatedPlayers,
        phase: 'elimination',
        eliminatedThisRound: eliminated,
      };
    }

    case 'NEXT_ROUND':
      return {
        ...state,
        phase: 'hint-round',
        votes: {},
        hints: [],
        currentPlayerIndex: 0,
        round: state.round + 1,
        eliminatedThisRound: null,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
