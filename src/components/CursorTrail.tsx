import React, { useEffect, useRef } from 'react';
import { useLoadStore } from '../store';

/**
 * CursorTrail — Canvas-based particle trail effect.
 * Only activates after loading screen dismisses.
 * Disabled on touch-only devices.
 * Never creates DOM nodes per particle — all rendering via Canvas 2D.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  hue: number; // HSL hue — ocean blues/seafoam
}

// Touch detection: pointer: fine means mouse/stylus available
const isTouchOnly = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export function CursorTrail() {
  const isLoaded = useLoadStore((s) => s.isLoaded);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const lastParticlePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const isActive = useRef(false);

  useEffect(() => {
    if (!isLoaded || isTouchOnly()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isActive.current = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      const dx = e.clientX - lastParticlePos.current.x;
      const dy = e.clientY - lastParticlePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Throttle: only spawn when cursor has moved > 4px
      if (dist > 4) {
        lastParticlePos.current = { x: e.clientX, y: e.clientY };

        // Spawn 1-2 particles per move event
        const count = Math.floor(1 + dist / 20);
        for (let i = 0; i < Math.min(count, 3); i++) {
          const hue = 185 + Math.random() * 30; // 185-215: ocean-teal range
          particles.current.push({
            x: e.clientX + (Math.random() - 0.5) * 4,
            y: e.clientY + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 - 0.3,
            radius: 2 + Math.random() * 3,
            alpha: 0.7 + Math.random() * 0.3,
            decay: 0.012 + Math.random() * 0.018,
            hue,
          });
        }

        // Cap particle count for performance
        if (particles.current.length > 120) {
          particles.current = particles.current.slice(-120);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const animate = () => {
      if (!isActive.current) return;
      rafId.current = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.radius *= 0.99;
        if (p.alpha <= 0) return false;

        // Radial gradient glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        gradient.addColorStop(0, `hsla(${p.hue}, 85%, 70%, ${p.alpha})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 70%, 60%, ${p.alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 60%, 55%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        return true;
      });
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      isActive.current = false;
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [isLoaded]);

  if (isTouchOnly() || !isLoaded) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[90]"
      aria-hidden="true"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
