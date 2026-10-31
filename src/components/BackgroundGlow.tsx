'use client';

import React, { useEffect, useRef } from 'react';

/**
 * High-Performance Colorful Cyber-Fintech Background & Dynamic Spotlight
 * Combines vibrant street neon colors (Rose, Amber, Cyan, Purple) with
 * high-performance GPU-accelerated cursor illumination.
 * Optimized with requestAnimationFrame throttling for zero lag.
 */
export default function BackgroundGlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let targetX = 50;
    let targetY = 30;
    let currentX = 50;
    let currentY = 30;
    let rafId: number | null = null;
    let isMoving = false;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;

      if (!isMoving) {
        isMoving = true;
        rafId = requestAnimationFrame(updateSpotlight);
      }
    };

    const updateSpotlight = () => {
      const ease = 0.1;
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * ease;
      currentY += dy * ease;

      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spotlight-x', `${currentX.toFixed(2)}%`);
        spotlightRef.current.style.setProperty('--spotlight-y', `${currentY.toFixed(2)}%`);
      }

      // If still interpolating toward target, keep RAF going; otherwise pause to save 100% CPU/GPU
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        rafId = requestAnimationFrame(updateSpotlight);
      } else {
        isMoving = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#06060c]"
      style={{ willChange: 'transform' }}
    >
      {/* Dynamic Cursor Spotlight Layer with Multi-Color Neon Spectrum */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(950px circle at var(--spotlight-x, 50%) var(--spotlight-y, 30%), 
            rgba(244, 63, 94, 0.16) 0%, 
            rgba(168, 85, 247, 0.12) 25%, 
            rgba(6, 182, 212, 0.08) 50%, 
            transparent 80%)`,
        }}
      />

      {/* Cybernetic High-Tech Grid with Radial Mask */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 85% 65% at 50% 30%, #000 65%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 30%, #000 65%, transparent 100%)',
        }}
      />

      {/* Vibrant Ambient Colorful Nebulas (GPU accelerated, mobile optimized) */}
      {/* Top Left: Vivid Rose & Fuchsia */}
      <div className="absolute -top-[12%] -left-[8%] w-[60vw] h-[60vw] md:w-[50vw] md:h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-rose-600/25 via-pink-600/18 to-transparent blur-3xl md:blur-[120px] pointer-events-none" />

      {/* Top Right: Cyber Cyan & Electric Blue */}
      <div className="absolute top-[5%] -right-[10%] w-[55vw] h-[55vw] md:w-[45vw] md:h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-bl from-cyan-500/22 via-blue-600/16 to-transparent blur-3xl md:blur-[130px] pointer-events-none" />

      {/* Center Left: Electric Violet (Desktop & Tablet) */}
      <div className="hidden md:block absolute top-[45%] -left-[12%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-r from-purple-600/20 via-violet-600/14 to-transparent blur-[140px] pointer-events-none" />

      {/* Bottom Center: Warm Amber Gold (Desktop & Tablet) */}
      <div className="hidden md:block absolute -bottom-[15%] left-[25%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr from-amber-500/18 via-orange-600/14 to-transparent blur-[150px] pointer-events-none" />
    </div>
  );
}
