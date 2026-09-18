import React, { useRef, useState, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContentStore, useEditModeStore } from '../store';
import { DraggableWrapper } from './ui/DraggableWrapper';
import { FontSizeControl } from './ui/FontSizeControl';
import { Button } from './ui/Button';

/**
 * Hero (About) section:
 * - Background-removed profile cutout (left-aligned, with glow aura)
 * - Name, degree, intro paragraph (right side)
 * - Edit mode: inline text editing + profile image replacement + bg removal
 */

async function removeBackground(file: File): Promise<string> {
  // Lazy-load the WASM bundle only when needed
  const { removeBackground } = await import('@imgly/background-removal');
  const blob = await removeBackground(file);
  return URL.createObjectURL(blob);
}

export function Hero() {
  const { ref, inView } = useScrollReveal({ amount: 0.15 });
  const content = useContentStore((s) => s.content);
  const updateContent = useContentStore((s) => s.updateContent);
  const fontSizes = useContentStore((s) => s.fontSizes);
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const [bgRemoving, setBgRemoving] = useState(false);
  const [bgError, setBgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { profile } = content;

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Show original immediately
      const originalUrl = URL.createObjectURL(file);
      updateContent({
        profile: {
          ...profile,
          profileImageUrl: originalUrl,
          profileCutoutUrl: null,
        },
      });

      setBgRemoving(true);
      setBgError(false);

      try {
        const cutoutUrl = await removeBackground(file);
        updateContent({
          profile: {
            ...profile,
            profileImageUrl: originalUrl,
            profileCutoutUrl: cutoutUrl,
          },
        });
      } catch (err) {
        console.warn('[Hero] Background removal failed, using original:', err);
        setBgError(true);
      } finally {
        setBgRemoving(false);
      }
    },
    [profile, updateContent]
  );

  const displayImageUrl = profile.profileCutoutUrl ?? profile.profileImageUrl;
  const nameSize = fontSizes['hero-name'] ?? 48;
  const degreeSize = fontSizes['hero-degree'] ?? 20;
  const introSize = fontSizes['hero-intro'] ?? 16;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section id="about" className="min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col md:flex-row items-center md:items-start gap-10 lg:gap-16"
        >
          {/* ── Profile image (left) ── */}
          <DraggableWrapper id="hero-photo" isEditMode={isEditMode} className="flex-shrink-0">
            <motion.div variants={childVariants} className="relative flex flex-col items-center gap-4">
              {/* Glow aura behind the image */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(56,189,248,0.35) 0%, rgba(20,184,166,0.2) 50%, transparent 75%)',
                    transform: 'scale(1.3)',
                    filter: 'blur(24px)',
                  }}
                />

                {displayImageUrl ? (
                  <img
                    src={displayImageUrl}
                    alt={profile.name}
                    className="relative z-10 w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 object-cover"
                    style={{
                      // If we have a cutout, show it naturally; otherwise circular crop
                      borderRadius: profile.profileCutoutUrl ? '0' : '50%',
                      filter: 'drop-shadow(0 8px 32px rgba(14,165,233,0.3))',
                    }}
                  />
                ) : (
                  <div
                    className="relative z-10 w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #bae6fd, #99f6e4)' }}
                  >
                    <span className="font-display font-bold text-ocean-800 text-6xl select-none">NK</span>
                  </div>
                )}

                {/* BG removal indicator */}
                {bgRemoving && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/40">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="text-white text-xs font-medium">Removing bg…</span>
                    </div>
                  </div>
                )}

                {bgError && (
                  <p className="text-xs text-amber-600 text-center mt-1">
                    BG removal unavailable — showing original
                  </p>
                )}
              </div>

              {/* Edit: upload button */}
              {isEditMode && (
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    loading={bgRemoving}
                  >
                    {bgRemoving ? 'Processing…' : 'Change Photo'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </motion.div>
          </DraggableWrapper>

          {/* ── Text content (right) ── */}
          <div className="flex-1 flex flex-col gap-5 text-center md:text-left">
            {/* Name */}
            <DraggableWrapper id="hero-name" isEditMode={isEditMode}>
              <motion.div variants={childVariants} className="relative group">
                {isEditMode && (
                  <FontSizeControl
                    elementId="hero-name"
                    defaultSize={48}
                    min={24}
                    max={80}
                    className="absolute -top-8 left-0"
                  />
                )}
                <h1
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    isEditMode &&
                    updateContent({ profile: { ...profile, name: e.currentTarget.textContent ?? profile.name } })
                  }
                  className={`font-display font-bold text-ocean-900 text-glow leading-tight ${isEditMode ? 'editable-outline' : ''}`}
                  style={{ fontSize: nameSize }}
                >
                  {profile.name}
                </h1>
              </motion.div>
            </DraggableWrapper>

            {/* Degree */}
            <DraggableWrapper id="hero-degree" isEditMode={isEditMode}>
              <motion.div variants={childVariants} className="relative group">
                {isEditMode && (
                  <FontSizeControl
                    elementId="hero-degree"
                    defaultSize={20}
                    min={14}
                    max={36}
                    className="absolute -top-8 left-0"
                  />
                )}
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    isEditMode &&
                    updateContent({ profile: { ...profile, degree: e.currentTarget.textContent ?? profile.degree } })
                  }
                  className={`font-medium text-ocean-700 ${isEditMode ? 'editable-outline' : ''}`}
                  style={{ fontSize: degreeSize }}
                >
                  {profile.degree}
                </p>
              </motion.div>
            </DraggableWrapper>

            {/* Divider */}
            <motion.div
              variants={childVariants}
              className="w-16 h-1 mx-auto md:mx-0 rounded-full"
              style={{ background: 'linear-gradient(90deg, #38bdf8, #14b8a6)' }}
            />

            {/* Intro text */}
            <DraggableWrapper id="hero-intro" isEditMode={isEditMode}>
              <motion.div variants={childVariants} className="relative group">
                {isEditMode && (
                  <FontSizeControl
                    elementId="hero-intro"
                    defaultSize={16}
                    min={12}
                    max={24}
                    className="absolute -top-8 left-0"
                  />
                )}
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    isEditMode &&
                    updateContent({ profile: { ...profile, introText: e.currentTarget.textContent ?? profile.introText } })
                  }
                  className={`text-ocean-800 leading-relaxed max-w-xl ${isEditMode ? 'editable-outline' : ''}`}
                  style={{ fontSize: introSize }}
                >
                  {profile.introText}
                </p>
              </motion.div>
            </DraggableWrapper>

            {/* CTA buttons */}
            <motion.div variants={childVariants} className="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get in Touch
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Projects
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
