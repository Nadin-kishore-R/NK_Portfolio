import React from 'react';

/**
 * Watermark — large "NK" fixed at the exact center of the viewport.
 * position: fixed, non-interactive, non-selectable, low opacity.
 */
export function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center no-select"
      style={{ userSelect: 'none' }}
    >
      <span
        className="font-display font-black text-ocean-900 no-select"
        style={{
          fontSize: 'clamp(160px, 30vw, 320px)',
          opacity: 0.055,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          fontFamily: 'Outfit, sans-serif',
          pointerEvents: 'none',
        }}
      >
        NK
      </span>
    </div>
  );
}
