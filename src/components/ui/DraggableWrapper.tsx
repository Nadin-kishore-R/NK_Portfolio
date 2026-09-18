import React, { useRef, useState, useCallback } from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { useContentStore } from '../../store';

interface DraggableWrapperProps {
  id: string;
  isEditMode: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DraggableWrapper — wraps content in a freely positionable container.
 * In edit mode: shows drag handle, allows free-form repositioning.
 * Positions persist via Zustand → layoutService → localStorage.
 * In view mode: renders as a normal div with the saved transform applied.
 */
export function DraggableWrapper({
  id,
  isEditMode,
  children,
  className = '',
  style,
}: DraggableWrapperProps) {
  const positions = useContentStore((s) => s.positions);
  const setPosition = useContentStore((s) => s.setPosition);

  const pos = positions[id] ?? { x: 0, y: 0 };
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isEditMode) return;
      isDragging.current = true;
      setDragging(true);
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        posX: pos.x,
        posY: pos.y,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isEditMode, pos]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !isEditMode) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      setPosition(id, {
        x: dragStart.current.posX + dx,
        y: dragStart.current.posY + dy,
      });
    },
    [id, isEditMode, setPosition]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={['relative', className].join(' ')}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: dragging ? 'none' : 'transform 0.1s ease',
        ...style,
      }}
    >
      {isEditMode && (
        <div
          className="absolute -top-8 left-0 z-10 flex items-center gap-1 glass border border-ocean-300/40 rounded-lg px-2 py-1 cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <MdDragIndicator size={14} className="text-ocean-600" />
          <span className="text-xs text-ocean-700 font-medium select-none">drag</span>
        </div>
      )}
      <div
        className="rounded-xl transition-all duration-200"
        style={{
          outline: isEditMode
            ? dragging
              ? '2px solid rgba(14,165,233,0.8)'
              : '2px dashed rgba(14,165,233,0.4)'
            : '2px solid transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
}
