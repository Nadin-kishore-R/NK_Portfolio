import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * usePreload — tracks critical asset readiness and enforces a minimum
 * display duration for the loading screen.
 *
 * Returns `isReady = true` when BOTH conditions are met:
 *   1. The minimum display duration has elapsed (MIN_DURATION_MS)
 *   2. Critical assets have finished loading (background image + fonts)
 */

const MIN_DURATION_MS = 1500; // 1.5 seconds minimum splash display

export function usePreload(backgroundImageUrl: string | null): {
  isReady: boolean;
  progress: number;
} {
  const [minElapsed, setMinElapsed] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTime = useRef(Date.now());

  // ── Minimum timer ──
  useEffect(() => {
    const remaining = MIN_DURATION_MS - (Date.now() - startTime.current);
    const timer = setTimeout(() => setMinElapsed(true), Math.max(0, remaining));
    return () => clearTimeout(timer);
  }, []);

  // ── Progress animation (UI feedback) ──
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const raw = Math.min(elapsed / MIN_DURATION_MS, 0.95);
      setProgress(raw);
      if (raw < 0.95) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // ── Asset loading ──
  const checkAssets = useCallback(async () => {
    const tasks: Promise<void>[] = [];

    // 1. Fonts
    tasks.push(
      document.fonts.ready.then(() => {}).catch(() => {})
    );

    // 2. Background image
    if (backgroundImageUrl) {
      tasks.push(
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // resolve even on error — don't block
          img.src = backgroundImageUrl;
        })
      );
    }

    await Promise.all(tasks);
    setAssetsReady(true);
    setProgress(1);
  }, [backgroundImageUrl]);

  useEffect(() => {
    checkAssets();
  }, [checkAssets]);

  const isReady = minElapsed && assetsReady;
  return { isReady, progress };
}
