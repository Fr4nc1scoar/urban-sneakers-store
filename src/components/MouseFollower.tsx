'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * High-End Custom Mouse Follower inspired by Unique Capital & Iqxion (.mf-cursor)
 * Features smooth Lerp trailing physics, scale expansion on interactive elements,
 * and a luxury lilac/lavender glow aesthetic. Automatically disables on touch screens.
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
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    const checkPointer = () => {
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      setIsDesktop(isFinePointer && window.innerWidth >= 1024);
    };

    checkPointer();
    window.addEventListener('resize', checkPointer);

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

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

    // Smooth Lerp physics render loop
    const render = () => {
      const ease = 0.18; // smooth trailing ease
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

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
      {/* Outer Follower Ring */}
      <div
        className={`relative -top-1/2 -left-1/2 flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          isHoveringInteractive
            ? 'w-12 h-12 bg-[#D1C4FF]/15 border border-[#D1C4FF] shadow-[0_0_20px_rgba(209,196,255,0.4)] backdrop-blur-[2px]'
            : 'w-6 h-6 bg-[#D1C4FF]/25 border border-[#D1C4FF]/70 shadow-[0_0_10px_rgba(209,196,255,0.3)]'
        } ${isClicking ? 'scale-75 bg-[#D1C4FF]/40' : 'scale-100'}`}
      >
        {/* Center Precision Dot */}
        <div
          className={`rounded-full bg-white transition-all duration-200 ${
            isHoveringInteractive ? 'w-1 h-1 opacity-60' : 'w-1.5 h-1.5 opacity-100 shadow-[0_0_6px_#fff]'
          }`}
        />

        {/* Optional text badge inside cursor */}
        {hoverText && (
          <span className="absolute text-[8px] font-mono font-black uppercase tracking-wider text-white whitespace-nowrap drop-shadow">
            {hoverText}
          </span>
        )}
      </div>
    </div>
  );
}
