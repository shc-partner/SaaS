// 칸반 보드 전역 상태 — React Context + useReducer.
// BoardProvider 로 감싼 트리 안에서만 useBoardState / useBoardDispatch 를 호출할 수 있다.

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { BoardState, BoardAction, ContentItem, Idea } from './boardTypes';

function reducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items], showNewContentModal: false };
    case 'ADD_IDEA':
      return { ...state, ideas: [action.payload, ...state.ideas], showNewIdeaModal: false };
    case 'SELECT_ITEM':
      return { ...state, selectedItemId: action.payload };
    case 'TOGGLE_NEW_CONTENT_MODAL':
      return { ...state, showNewContentModal: !state.showNewContentModal };
    case 'TOGGLE_NEW_IDEA_MODAL':
      return { ...state, showNewIdeaModal: !state.showNewIdeaModal };
    case 'SET_FILTER_CHANNEL':
      return { ...state, filterChannel: action.payload };
    case 'SET_FILTER_FORMAT':
      return { ...state, filterFormat: action.payload };
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

const BoardStateCtx    = createContext<BoardState | null>(null);
const BoardDispatchCtx = createContext<Dispatch<BoardAction> | null>(null);

export function BoardProvider({
  children,
  initialItems,
  initialIdeas,
}: {
  children: ReactNode;
  initialItems: ContentItem[];
  initialIdeas: Idea[];
}) {
  const [state, dispatch] = useReducer(reducer, {
    items: initialItems,
    ideas: initialIdeas,
    selectedItemId: null,
    showNewContentModal: false,
    showNewIdeaModal: false,
    filterChannel: '',
    filterFormat: '',
    filterStatus: '',
    searchQuery: '',
  });

  return (
    <BoardStateCtx.Provider value={state}>
      <BoardDispatchCtx.Provider value={dispatch}>
        {children}
      </BoardDispatchCtx.Provider>
    </BoardStateCtx.Provider>
  );
}

export function useBoardState(): BoardState {
  const ctx = useContext(BoardStateCtx);
  if (!ctx) throw new Error('useBoardState must be inside BoardProvider');
  return ctx;
}

export function useBoardDispatch(): Dispatch<BoardAction> {
  const ctx = useContext(BoardDispatchCtx);
  if (!ctx) throw new Error('useBoardDispatch must be inside BoardProvider');
  return ctx;
}
