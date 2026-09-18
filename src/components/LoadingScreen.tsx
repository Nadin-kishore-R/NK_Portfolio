import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreload } from '../hooks/usePreload';
import { useContentStore, useLoadStore } from '../store';

/**
 * LoadingScreen — full-screen branded splash shown on every page load.
 * - Waits for minimum duration (1.5s) AND asset readiness before dismissing.
 * - Dissolves smoothly with opacity + scale transition.
 * - "NK" animated logo mark matches the LogoAnimated visual style.
 */
export function LoadingScreen() {
  const logoConfig = useContentStore((s) => s.content.logo);
  const bgUrl = useContentStore((s) => s.content.backgroundImageUrl);
  const setLoaded = useLoadStore((s) => s.setLoaded);

  const { isReady, progress } = usePreload(bgUrl);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isReady && !dismissed) {
      // Small extra delay for visual polish
      const timer = setTimeout(() => {
        setDismissed(true);
        setLoaded();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isReady, dismissed, setLoaded]);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0e7490 40%, #0f766e 100%)' }}
        >
          {/* Soft blurred bg hint */}
          {bgUrl && (
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)',
              }}
            />
          )}

          {/* Centered content */}
          <div className="relative flex flex-col items-center gap-6 z-10">
            {/* Animated NK Logo Mark */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer rotating conic ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, #38bdf8, #14b8a6, #7dd3fc, #5eead4, #38bdf8)',
                  padding: '3px',
                  borderRadius: '50%',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0c4a6e, #0e7490)',
                  }}
                />
              </motion.div>

              {/* Inner pulsing glow */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(56,189,248,0.4), transparent 70%)',
                }}
              />

              {/* Logo content — custom image or NK initials */}
              <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #075985, #0e7490)' }}>
                {logoConfig.imageUrl ? (
                  <img src={logoConfig.imageUrl} alt="NK Logo" className="w-full h-full object-cover" />
                ) : (
                  <span
                    className="font-display font-bold text-white text-3xl select-none"
                    style={{ fontFamily: 'Outfit, sans-serif', textShadow: '0 0 20px rgba(56,189,248,0.6)' }}
                  >
                    NK
                  </span>
                )}
              </div>
            </div>

            {/* Loading text with shimmer */}
            <div className="flex flex-col items-center gap-2">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="shimmer-text font-display font-semibold text-lg tracking-wide"
              >
                NK profile loading...!!
              </motion.p>

              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-48 h-1 bg-white/10 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #38bdf8, #14b8a6)' }}
                  animate={{ width: `${Math.round(progress * 100)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
