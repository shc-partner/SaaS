// 칸반 보드 전역 상태 — React Context + useReducer.
// BoardProvider 로 감싼 트리 안에서만 useBoardState / useBoardDispatch 를 호출할 수 있다.

import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { fetchBoard, syncBoard } from '../../api/workspaces';
import type { BoardState, BoardAction, ContentItem, ContentTaskRequest, Idea } from './boardTypes';
const SEEDED_ITEM_IDS = new Set(['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6']);
const SEEDED_IDEA_IDS = new Set(['idea-1', 'idea-2', 'idea-3']);

function belongsToWorkspace(item: ContentItem, workspaceId: string): boolean {
  return item.workspaceId === workspaceId && !SEEDED_ITEM_IDS.has(item.id);
}

function ideaBelongsToWorkspace(idea: Idea, workspaceId: string): boolean {
  return idea.workspaceId === workspaceId && !SEEDED_IDEA_IDS.has(idea.id);
}

function taskRequestBelongsToWorkspace(task: ContentTaskRequest, workspaceId: string): boolean {
  return task.workspaceId === workspaceId;
}

function reducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'HYDRATE_BOARD':
      return {
        ...state,
        boardLoaded: true,
        items: action.payload.items.filter((item) => belongsToWorkspace(item, state.workspaceId)),
        ideas: action.payload.ideas.filter((idea) => ideaBelongsToWorkspace(idea, state.workspaceId)),
        taskRequests: (action.payload.taskRequests ?? []).filter((task) => taskRequestBelongsToWorkspace(task, state.workspaceId)),
      };
    case 'ADD_ITEM':
      if (action.payload.workspaceId !== state.workspaceId) return state;
      return { ...state, items: [action.payload, ...state.items], showNewContentModal: false };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        taskRequests: state.taskRequests.filter((task) => task.contentItemId !== action.payload),
        selectedItemId: state.selectedItemId === action.payload ? null : state.selectedItemId,
      };
    case 'ADD_IDEA':
      if (action.payload.workspaceId !== state.workspaceId) return state;
      return { ...state, ideas: [action.payload, ...state.ideas], showNewIdeaModal: false };
    case 'ADD_TASK_REQUEST':
      if (action.payload.workspaceId !== state.workspaceId) return state;
      return { ...state, taskRequests: [action.payload, ...state.taskRequests] };
    case 'UPDATE_TASK_REQUEST_STATUS':
      return {
        ...state,
        taskRequests: state.taskRequests.map((task) => (
          task.id === action.payload.id
            ? { ...task, status: action.payload.status, updatedAt: new Date().toISOString() }
            : task
        )),
      };
    case 'UPDATE_ITEM_STATUS':
      return {
        ...state,
        items: state.items.map((item) => (
          item.id === action.payload.id
            ? { ...item, status: action.payload.status, updatedAt: new Date().toISOString() }
            : item
        )),
      };
    case 'UPDATE_ITEM_DATES':
      return {
        ...state,
        items: state.items.map((item) => (
          item.id === action.payload.id
            ? {
                ...item,
                shootDate: action.payload.shootDate,
                editDueDate: action.payload.editDueDate,
                publishDate: action.payload.publishDate,
                updatedAt: new Date().toISOString(),
              }
            : item
        )),
      };
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
  workspaceId,
  initialItems,
  initialIdeas,
}: {
  children: ReactNode;
  workspaceId: string;
  initialItems: ContentItem[];
  initialIdeas: Idea[];
}) {
  const [state, dispatch] = useReducer(reducer, {
    initialItems,
    initialIdeas,
  }, ({ initialItems, initialIdeas }) => {
    return {
      workspaceId,
      boardLoaded: false,
      items: initialItems.filter((item) => belongsToWorkspace(item, workspaceId)),
      ideas: initialIdeas.filter((idea) => ideaBelongsToWorkspace(idea, workspaceId)),
      taskRequests: [],
      selectedItemId: null,
      showNewContentModal: false,
      showNewIdeaModal: false,
      filterChannel: '',
      filterFormat: '',
      filterStatus: '',
      searchQuery: '',
    };
  });

  useEffect(() => {
    let alive = true;
    fetchBoard(workspaceId)
      .then((data) => {
        if (alive) dispatch({ type: 'HYDRATE_BOARD', payload: data });
      })
      .catch((error) => {
        console.error('Failed to load board data', error);
        if (alive) dispatch({ type: 'HYDRATE_BOARD', payload: { items: [], ideas: [], taskRequests: [] } });
      });
    return () => { alive = false; };
  }, [workspaceId]);

  useEffect(() => {
    if (!state.boardLoaded) return;
    syncBoard(workspaceId, {
      items: state.items,
      ideas: state.ideas,
      taskRequests: state.taskRequests,
    }).catch((error) => {
      console.error('Failed to sync board data', error);
    });
  }, [state.boardLoaded, state.items, state.ideas, state.taskRequests, workspaceId]);

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
