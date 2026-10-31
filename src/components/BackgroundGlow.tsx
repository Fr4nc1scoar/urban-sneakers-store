'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Modern High-Tech Background Glow & Cyber Grid
 * Replaces outdated canvas dots with Eduardo / Unique Capital / Iqxion luxury fintech aesthetic:
 * - Dynamic mouse spotlight following the cursor across the viewport
 * - Fine cybernetic precision grid with soft radial mask
 * - Organic ambient blurred color auras (Lavender / Lilac #D1C4FF, Cyber Cyan, Deep Violet)
 */
export default function BackgroundGlow() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 50, y: 30 }); // percentages
  const currentPos = useRef({ x: 50, y: 30 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      targetPos.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      const ease = 0.08; // smooth liquid tracking
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spotlight-x', `${currentPos.current.x.toFixed(2)}%`);
        spotlightRef.current.style.setProperty('--spotlight-y', `${currentPos.current.y.toFixed(2)}%`);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#06060c]">
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(850px circle at var(--spotlight-x, 50%) var(--spotlight-y, 30%), rgba(209, 196, 255, 0.09) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 80%)`,
        }}
      />

      {/* Cybernetic High-Tech Grid with Radial Mask (Linear & Unique Capital style) */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 25%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 25%, #000 60%, transparent 100%)',
        }}
      />

      {/* Ambient Cosmic Auras (Soft Blurred Orbs) */}
      <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#D1C4FF]/10 via-[#9333EA]/10 to-transparent blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#00F0FF]/08 via-[#6366F1]/08 to-transparent blur-[160px] animate-pulse" style={{ animationDuration: '11s' }} />
      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#EC4899]/06 via-[#8B5CF6]/08 to-transparent blur-[180px]" />

      {/* Subtle Noise Texture for Cinematic Depth */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
