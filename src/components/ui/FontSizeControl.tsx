import React from 'react';
import { motion } from 'framer-motion';
import { MdTextDecrease, MdTextIncrease } from 'react-icons/md';
import { useContentStore } from '../../store';

interface FontSizeControlProps {
  elementId: string;
  defaultSize?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function FontSizeControl({
  elementId,
  defaultSize = 16,
  min = 10,
  max = 72,
  step = 2,
  className = '',
}: FontSizeControlProps) {
  const fontSizes = useContentStore((s) => s.fontSizes);
  const setFontSize = useContentStore((s) => s.setFontSize);

  const currentSize = fontSizes[elementId] ?? defaultSize;

  return (
    <div
      className={[
        'inline-flex items-center gap-1 glass border border-white/30 rounded-lg px-2 py-1',
        className,
      ].join(' ')}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setFontSize(elementId, Math.max(min, currentSize - step))}
        disabled={currentSize <= min}
        className="p-1 text-ocean-700 hover:text-ocean-900 disabled:opacity-30 transition-colors"
        aria-label="Decrease font size"
      >
        <MdTextDecrease size={14} />
      </motion.button>
      <span className="text-xs font-mono text-ocean-800 min-w-[2rem] text-center">
        {currentSize}
      </span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setFontSize(elementId, Math.min(max, currentSize + step))}
        disabled={currentSize >= max}
        className="p-1 text-ocean-700 hover:text-ocean-900 disabled:opacity-30 transition-colors"
        aria-label="Increase font size"
      >
        <MdTextIncrease size={14} />
      </motion.button>
    </div>
  );
}
