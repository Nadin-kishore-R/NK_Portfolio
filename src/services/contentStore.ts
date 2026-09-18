import type { PortfolioContent, FontSizeMap, PositionMap } from '../types/content';
import { defaultContent } from '../data/defaultContent';

// ============================================================
// Content Store Service — localStorage abstraction layer
// TODO: Swap implementation for Supabase/Firebase when ready
// ============================================================

const CONTENT_KEY = 'nk_portfolio_content';

export const contentService = {
  load(): PortfolioContent {
    try {
      const raw = localStorage.getItem(CONTENT_KEY);
      if (!raw) return defaultContent;
      const parsed = JSON.parse(raw) as Partial<PortfolioContent>;
      // Deep merge: stored data takes priority, defaults fill any missing keys
      return deepMerge(defaultContent, parsed) as PortfolioContent;
    } catch {
      return defaultContent;
    }
  },

  save(content: PortfolioContent): void {
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('[contentStore] Failed to save content:', e);
    }
  },

  reset(): void {
    localStorage.removeItem(CONTENT_KEY);
  },
};

// ============================================================
// Layout Store Service — element positions + font sizes
// ============================================================

const POSITIONS_KEY = 'nk_portfolio_positions';
const FONTS_KEY = 'nk_portfolio_fonts';

export const layoutService = {
  loadPositions(): PositionMap {
    try {
      const raw = localStorage.getItem(POSITIONS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  savePositions(positions: PositionMap): void {
    try {
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
    } catch (e) {
      console.error('[layoutStore] Failed to save positions:', e);
    }
  },

  loadFontSizes(): FontSizeMap {
    try {
      const raw = localStorage.getItem(FONTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  saveFontSizes(fonts: FontSizeMap): void {
    try {
      localStorage.setItem(FONTS_KEY, JSON.stringify(fonts));
    } catch (e) {
      console.error('[layoutStore] Failed to save font sizes:', e);
    }
  },
};

// ============================================================
// Auth Service — sessionStorage, mock credentials
// TODO: Replace with real backend auth (Supabase/Firebase)
// ============================================================

const AUTH_KEY = 'nk_portfolio_auth';

// ⚠️ MOCK CREDENTIALS — replace with server-side validation before production
const MOCK_EMAIL = 'admin@nkportfolio.com';
const MOCK_PASSWORD = 'nkportfolio2024';

export const authService = {
  /** Returns true if credentials are valid */
  signIn(email: string, password: string): boolean {
    // TODO: Replace with real API call
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({ email, signedInAt: Date.now() }));
      return true;
    }
    return false;
  },

  signOut(): void {
    sessionStorage.removeItem(AUTH_KEY);
  },

  isAuthenticated(): boolean {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY);
      return !!raw;
    } catch {
      return false;
    }
  },
};

// ============================================================
// Utility — deep merge (plain objects only, arrays overwrite)
// ============================================================

function deepMerge(base: unknown, override: unknown): unknown {
  if (!isObject(base) || !isObject(override)) return override ?? base;
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const bv = (base as Record<string, unknown>)[key];
    const ov = (override as Record<string, unknown>)[key];
    result[key] = deepMerge(bv, ov);
  }
  return result;
}

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}
