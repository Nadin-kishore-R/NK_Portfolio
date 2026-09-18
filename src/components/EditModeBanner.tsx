import React from 'react';
import { motion } from 'framer-motion';
import { MdSave, MdLogout, MdEdit } from 'react-icons/md';
import { useEditMode } from '../hooks/useEditMode';
import { useAuthStore } from '../store';

/**
 * EditModeBanner — persistent top banner shown when in Edit Mode.
 * Has a pulsing animated border to signal "alive" state.
 */
export function EditModeBanner() {
  const { isEditMode, saveChanges, exitEditMode } = useEditMode();
  const signOut = useAuthStore((s) => s.signOut);

  if (!isEditMode) return null;

  const handleExit = () => {
    saveChanges();
    signOut();
    exitEditMode();
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="fixed top-16 left-0 right-0 z-40"
    >
      <div className="relative overflow-hidden">
        {/* Animated shimmer border */}
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #38bdf8, #14b8a6, #7dd3fc, #5eead4, #38bdf8)',
            backgroundSize: '200% 100%',
            height: '2px',
            top: 0,
          }}
        />

        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: 'linear-gradient(90deg, rgba(14,165,233,0.15), rgba(20,184,166,0.12))',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(56,189,248,0.25)',
          }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-ocean-400"
            />
            <MdEdit size={14} className="text-ocean-600" />
            <span className="text-sm font-semibold text-ocean-800">Editing Mode Active</span>
            <span className="hidden sm:inline text-xs text-ocean-600/70">
              — changes saved automatically on Exit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveChanges}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-ocean-800 bg-white/30 hover:bg-white/50 border border-ocean-300/40 transition-all"
            >
              <MdSave size={14} /> Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExit}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-red-600 bg-red-50/30 hover:bg-red-50/60 border border-red-300/40 transition-all"
            >
              <MdLogout size={14} /> Exit Edit Mode
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
