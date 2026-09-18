import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * useScrollReveal — returns a ref to attach to the element to observe,
 * and `inView` boolean (true once element enters viewport, stays true).
 * Uses Framer Motion's useInView for GPU-friendly observation.
 */
export function useScrollReveal(options?: { amount?: number; once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.2,
  });

  return { ref, inView };
}
