'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * High-Performance Colorful Mouse Follower (Streetwear / Luxury Edition)
 * Features smooth Lerp trailing physics, vibrant neon rose & amber glows,
 * and automatic pause when mouse is idle to eliminate 100% CPU overhead.
 */
export default function MouseFollower() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);

  const cursorRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const isMoving = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    const checkPointer = () => {
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      setIsDesktop(isFinePointer && window.innerWidth >= 1024);
    };

    checkPointer();
    window.addEventListener('resize', checkPointer);

    const updatePosition = () => {
      const ease = 0.2;
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;

      currentPos.current.x += dx * ease;
      currentPos.current.y += dy * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animationFrameId.current = requestAnimationFrame(updatePosition);
      } else {
        isMoving.current = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (!isMoving.current) {
        isMoving.current = true;
        animationFrameId.current = requestAnimationFrame(updatePosition);
      }

      // Check if hovering an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, input, select, textarea, [data-interactive="true"], .product-card-interactive, [role="button"]'
        );
        setIsHoveringInteractive(!!interactive);

        const customText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
        setHoverText(customText || null);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('resize', checkPointer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isVisible]);

  if (!isDesktop) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease-out',
      }}
    >
      {/* Outer Follower Ring with Vibrant Neon Colors */}
      <div
        className={`relative -top-1/2 -left-1/2 flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          isHoveringInteractive
            ? 'w-12 h-12 bg-gradient-to-tr from-rose-500/25 via-purple-500/20 to-amber-500/25 border-2 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.7)] backdrop-blur-[2px]'
            : 'w-6 h-6 bg-rose-500/30 border border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
        } ${isClicking ? 'scale-75 bg-rose-500/60' : 'scale-100'}`}
      >
        {/* Center Precision Dot */}
        <div
          className={`rounded-full transition-all duration-200 ${
            isHoveringInteractive
              ? 'w-1 h-1 bg-amber-400 opacity-80 shadow-[0_0_6px_#fbbf24]'
              : 'w-1.5 h-1.5 bg-white opacity-100 shadow-[0_0_6px_#fff]'
          }`}
        />

        {/* Optional text badge inside cursor */}
        {hoverText && (
          <span className="absolute text-[8px] font-mono font-black uppercase tracking-wider text-white whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {hoverText}
          </span>
        )}
      </div>
    </div>
  );
}
