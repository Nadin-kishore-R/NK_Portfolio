import React from 'react';
import { motion } from 'framer-motion';
import { useContentStore } from '../store';

interface LogoAnimatedProps {
  onLogoClick?: () => void;
  size?: 'sm' | 'md';
}

/**
 * LogoAnimated — "NK" badge with rotating gradient ring + pulsing glow.
 * The animation wrapper is decoupled from the image source so swapping
 * the logo image in Edit Mode never breaks the ring/glow animation.
 */
export function LogoAnimated({ onLogoClick, size = 'md' }: LogoAnimatedProps) {
  const logoConfig = useContentStore((s) => s.content.logo);
  const dim = size === 'md' ? 44 : 36;
  const innerDim = size === 'md' ? 36 : 28;
  const textSize = size === 'md' ? 'text-base' : 'text-sm';

  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer select-none"
      onClick={onLogoClick}
      role="button"
      aria-label="NK Portfolio logo (5 clicks to enter admin mode)"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onLogoClick?.()}
    >
      {/* Animated ring + logo mark */}
      <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>
        {/* Rotating conic gradient ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #38bdf8, #14b8a6, #7dd3fc, #5eead4, #38bdf8)',
            padding: 2,
            borderRadius: '50%',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0c4a6e, #075985)',
            }}
          />
        </motion.div>

        {/* Soft outer glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.35), transparent 70%)',
            filter: 'blur(6px)',
          }}
        />

        {/* Inner logo */}
        <div
          className="absolute rounded-full overflow-hidden flex items-center justify-center"
          style={{
            top: '50%',
            left: '50%',
            width: innerDim,
            height: innerDim,
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #075985, #0e7490)',
          }}
        >
          {logoConfig.imageUrl ? (
            <img
              src={logoConfig.imageUrl}
              alt="NK Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className="font-display font-bold text-white select-none"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: size === 'md' ? 14 : 11,
                textShadow: '0 0 12px rgba(56,189,248,0.7)',
              }}
            >
              NK
            </span>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className={`font-display font-bold text-ocean-900 ${textSize} leading-tight`}>
          NK Portfolio
        </span>
        <span className="text-xs text-ocean-600/70 font-medium leading-tight tracking-wide">
          Nadin K
        </span>
      </div>
    </div>
  );
}
