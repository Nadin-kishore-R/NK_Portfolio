import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogoAnimated } from './LogoAnimated';
import { useLogoClickTrigger } from '../hooks/useLogoClickTrigger';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Interests', href: '#interests' },
  { label: 'Achievements', href: '#certifications' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
  { label: 'Resume', href: '#resume' },
];

interface NavbarProps {
  onAdminTrigger: () => void;
}

export function Navbar({ onAdminTrigger }: NavbarProps) {
  const { handleClick } = useLogoClickTrigger(onAdminTrigger);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40"
    >
      <div className="glass border-b border-white/20 shadow-lg shadow-ocean-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo — right-aligned per spec, flex row-reverse trick */}
            <div className="flex-1 flex justify-end order-2">
              <LogoAnimated onLogoClick={handleClick} />
            </div>

            {/* Desktop nav links — left/center */}
            <div className="hidden md:flex items-center gap-1 order-1">
              {NAV_LINKS.map((link) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-ocean-800 hover:text-ocean-950 hover:bg-white/25 transition-all duration-200"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden order-1 p-2 rounded-lg text-ocean-700 hover:bg-white/20 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className="block w-5 h-0.5 bg-current mb-1 transition-all" />
              <span className="block w-5 h-0.5 bg-current mb-1 transition-all" />
              <span className="block w-5 h-0.5 bg-current transition-all" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 px-4 pb-4 pt-2 flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-ocean-800 hover:bg-white/20 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
