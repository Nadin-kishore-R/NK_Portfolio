import { create } from 'zustand';
import { contentService, layoutService, authService } from '../services/contentStore';
import type { PortfolioContent, FontSizeMap, PositionMap } from '../types/content';

// ============================================================
// Edit Mode Store
// ============================================================
interface EditModeState {
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
}

export const useEditModeStore = create<EditModeState>((set) => ({
  isEditMode: false,
  setEditMode: (val) => set({ isEditMode: val }),
}));

// ============================================================
// Auth Store
// ============================================================
interface AuthState {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>(() => ({
  isAuthenticated: authService.isAuthenticated(),

  signIn: (email, password) => {
    const ok = authService.signIn(email, password);
    if (ok) {
      useAuthStore.setState({ isAuthenticated: true });
      useEditModeStore.setState({ isEditMode: true });
    }
    return ok;
  },

  signOut: () => {
    authService.signOut();
    useAuthStore.setState({ isAuthenticated: false });
    useEditModeStore.setState({ isEditMode: false });
  },
}));

// ============================================================
// Content Store
// ============================================================
interface ContentState {
  content: PortfolioContent;
  fontSizes: FontSizeMap;
  positions: PositionMap;
  setContent: (content: PortfolioContent) => void;
  updateContent: (partial: Partial<PortfolioContent>) => void;
  setFontSize: (id: string, size: number) => void;
  setPosition: (id: string, pos: { x: number; y: number }) => void;
  saveAll: () => void;
  resetContent: () => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  content: contentService.load(),
  fontSizes: layoutService.loadFontSizes(),
  positions: layoutService.loadPositions(),

  setContent: (content) => set({ content }),

  updateContent: (partial) =>
    set((state) => ({
      content: { ...state.content, ...partial },
    })),

  setFontSize: (id, size) =>
    set((state) => {
      const fontSizes = { ...state.fontSizes, [id]: size };
      layoutService.saveFontSizes(fontSizes);
      return { fontSizes };
    }),

  setPosition: (id, pos) =>
    set((state) => {
      const positions = { ...state.positions, [id]: pos };
      layoutService.savePositions(positions);
      return { positions };
    }),

  saveAll: () => {
    const { content, fontSizes, positions } = get();
    contentService.save(content);
    layoutService.saveFontSizes(fontSizes);
    layoutService.savePositions(positions);
  },

  resetContent: () => {
    contentService.reset();
    set({ content: contentService.load() });
  },
}));

// ============================================================
// Load Store
// ============================================================
interface LoadState {
  isLoaded: boolean;
  setLoaded: () => void;
}

export const useLoadStore = create<LoadState>((set) => ({
  isLoaded: false,
  setLoaded: () => set({ isLoaded: true }),
}));
