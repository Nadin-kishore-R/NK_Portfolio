import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdZoomIn, MdZoomOut, MdOpenInNew } from 'react-icons/md';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export function Lightbox({ isOpen, onClose, imageUrl, alt = 'Image' }: LightboxProps) {
  const [zoom, setZoom] = React.useState(1);

  React.useEffect(() => {
    if (!isOpen) setZoom(1);
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="lb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              key="lb-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Controls */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-2 glass rounded-lg text-white hover:bg-white/20 transition-colors"
                  aria-label="Zoom out"
                >
                  <MdZoomOut size={20} />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-2 glass rounded-lg text-white hover:bg-white/20 transition-colors"
                  aria-label="Zoom in"
                >
                  <MdZoomIn size={20} />
                </button>
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass rounded-lg text-white hover:bg-white/20 transition-colors"
                  aria-label="Open in new tab"
                >
                  <MdOpenInNew size={20} />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 glass rounded-lg text-white hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <MdClose size={20} />
                </button>
              </div>
              {/* Image */}
              <div className="overflow-auto rounded-xl max-h-[80vh] w-full flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={alt}
                  style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
