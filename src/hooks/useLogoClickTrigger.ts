import { useRef, useCallback } from 'react';

/**
 * useLogoClickTrigger
 *
 * Detects 5 clicks within a rolling 3-second window on the logo element.
 * On success, calls `onTriggered`. Counter resets if the 5th click misses
 * the window or after a successful trigger.
 */
export function useLogoClickTrigger(onTriggered: () => void) {
  const clickTimestamps = useRef<number[]>([]);

  const handleClick = useCallback(() => {
    const now = Date.now();
    // Keep only clicks within the last 3 seconds
    clickTimestamps.current = clickTimestamps.current.filter(
      (t) => now - t < 3000
    );
    clickTimestamps.current.push(now);

    if (clickTimestamps.current.length >= 5) {
      clickTimestamps.current = [];
      onTriggered();
    }
  }, [onTriggered]);

  return { handleClick };
}
