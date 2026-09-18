import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  color?: 'ocean' | 'seafoam' | 'sand' | 'default';
  onRemove?: () => void;
  index?: number;
}

const colorStyles: Record<string, string> = {
  ocean: 'bg-ocean-100/70 text-ocean-800 border-ocean-300/50',
  seafoam: 'bg-seafoam-100/70 text-seafoam-800 border-seafoam-300/50',
  sand: 'bg-sand-100/70 text-sand-700 border-sand-300/50',
  default: 'bg-white/40 text-ocean-800 border-white/50',
};

export function Chip({ label, color = 'default', onRemove, index = 0 }: ChipProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm transition-all duration-200 hover:scale-105',
        colorStyles[color],
      ].join(' ')}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-current opacity-60 hover:opacity-100 transition-opacity leading-none"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </motion.span>
  );
}
