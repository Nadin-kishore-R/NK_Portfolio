import React, { useEffect, useRef } from 'react';
import { useContentStore } from '../store';

/**
 * AmbientBackground — fixed full-viewport nature/seashore background.
 * Uses CSS `position: fixed` so it never repaints on scroll.
 * Applies a soft overlay for text contrast.
 */
export function AmbientBackground() {
  const bgUrl = useContentStore((s) => s.content.backgroundImageUrl);

  return (
    <div
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    >
      {/* Background image */}
      {bgUrl && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'auto', // never transform — stays fixed
          }}
        />
      )}

      {/* Soft warm overlay for readability — warm off-white/pale teal wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(240,249,255,0.30) 0%, rgba(204,251,241,0.22) 50%, rgba(240,249,255,0.30) 100%)',
        }}
      />

      {/* Subtle bottom vignette to keep footer readable */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background: 'linear-gradient(to top, rgba(12,74,110,0.15), transparent)',
        }}
      />
    </div>
  );
}
