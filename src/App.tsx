import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from './components/LoadingScreen';
import { AmbientBackground } from './components/AmbientBackground';
import { Watermark } from './components/Watermark';
import { CursorTrail } from './components/CursorTrail';
import { Navbar } from './components/Navbar';
import { EditModeBanner } from './components/EditModeBanner';
import { SignInModal } from './components/SignInModal';
import { Hero } from './components/Hero';
import { Education } from './components/Education';
import { Skills } from './components/Skills';
import { Interests } from './components/Interests';
import { Certifications } from './components/Certifications';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Resume } from './components/Resume';
import { useLoadStore, useEditModeStore, useContentStore } from './store';
import { Button } from './components/ui/Button';
import { MdImage, MdSettings } from 'react-icons/md';

/**
 * EditSettingsPanel — floating settings panel shown only in edit mode.
 * Allows swapping the logo image and background image.
 */
function EditSettingsPanel() {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const content = useContentStore((s) => s.content);
  const updateContent = useContentStore((s) => s.updateContent);
  const [open, setOpen] = useState(false);

  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const bgInputRef = React.useRef<HTMLInputElement>(null);

  if (!isEditMode) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateContent({ logo: { imageUrl: url } });
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateContent({ backgroundImageUrl: url });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)' }}
        aria-label="Site settings"
      >
        <MdSettings size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="absolute bottom-14 right-0 glass rounded-2xl p-5 w-64 shadow-2xl border border-white/30"
          >
            <h3 className="font-display font-semibold text-ocean-900 text-sm mb-4">Site Settings</h3>

            {/* Logo swap */}
            <div className="mb-4">
              <p className="text-xs font-medium text-ocean-700 mb-2">Logo Image</p>
              <div className="flex items-center gap-2">
                {content.logo.imageUrl && (
                  <img src={content.logo.imageUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
                )}
                <Button variant="secondary" size="sm" icon={<MdImage />}
                  onClick={() => logoInputRef.current?.click()}>
                  {content.logo.imageUrl ? 'Change Logo' : 'Upload Logo'}
                </Button>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                  onChange={handleLogoUpload} />
              </div>
              {content.logo.imageUrl && (
                <button
                  className="text-xs text-red-500 hover:underline mt-1 block"
                  onClick={() => updateContent({ logo: { imageUrl: null } })}
                >
                  Remove logo
                </button>
              )}
            </div>

            {/* Background swap */}
            <div>
              <p className="text-xs font-medium text-ocean-700 mb-2">Background Scene</p>
              <Button variant="secondary" size="sm" icon={<MdImage />}
                onClick={() => bgInputRef.current?.click()}>
                Change Background
              </Button>
              <input ref={bgInputRef} type="file" accept="image/*,video/*" className="hidden"
                onChange={handleBgUpload} />
              <button
                className="text-xs text-ocean-500 hover:underline mt-1 block"
                onClick={() => updateContent({ backgroundImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop' })}
              >
                Reset to default
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Portfolio — the full portfolio content (gated behind loading screen).
 */
function Portfolio() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <Education />
      <Skills />
      <Interests />
      <Certifications />
      <Projects />
      <Contact />
      <Resume />

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-ocean-600/60">
          © {new Date().getFullYear()} Nadin K · Built with ❤️ and React
        </p>
      </footer>
    </motion.div>
  );
}

export default function App() {
  const isLoaded = useLoadStore((s) => s.isLoaded);
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <>
      {/* Loading screen — always rendered first, gates everything */}
      <LoadingScreen />

      {/* Fixed layers — always present, zero scroll cost */}
      <AmbientBackground />
      <Watermark />
      <CursorTrail />

      {/* Main app — fades in once loading screen dismisses */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Navbar onAdminTrigger={() => setSignInOpen(true)} />
            <EditModeBanner />
            <EditSettingsPanel />
            <main className="pt-16">
              <Portfolio />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth modal */}
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
