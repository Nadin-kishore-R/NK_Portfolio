import { useRef, useCallback } from 'react';
import { useContentStore } from '../store';

/**
 * useDraggablePosition
 *
 * Manages free-position dragging for a named element.
 * Persists {x, y} via Zustand → layoutService → localStorage.
 */
export function useDraggablePosition(id: string) {
  const positions = useContentStore((s) => s.positions);
  const setPosition = useContentStore((s) => s.setPosition);

  const position = positions[id] ?? { x: 0, y: 0 };

  const dragOffset = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const onDragStart = useCallback(
    (clientX: number, clientY: number) => {
      if (!elementRef.current) return;
      const rect = elementRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: clientX - rect.left - position.x,
        y: clientY - rect.top - position.y,
      };
    },
    [position]
  );

  const onDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!elementRef.current) return;
      const parent = elementRef.current.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const x = clientX - parentRect.left - dragOffset.current.x;
      const y = clientY - parentRect.top - dragOffset.current.y;
      setPosition(id, { x, y });
    },
    [id, setPosition]
  );

  return { position, elementRef, onDragStart, onDragMove };
}
