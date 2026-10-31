'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface RotatingWhatsAppStampProps {
  whatsappNumber?: string;
  whatsappDisplay?: string;
}

/**
 * Signature Unique Capital Rotating Contact Stamp Widget
 * Displays the spinning circular text badge on BOTH mobile and desktop!
 * - Mobile: 84px diameter with smooth spinning SVG text and 46px center button.
 * - Desktop: 120px diameter with 60px center button.
 */
export default function RotatingWhatsAppStamp({
  whatsappNumber = '584248057420',
  whatsappDisplay = '+58 424-8057420',
}: RotatingWhatsAppStampProps) {
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const chatUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
    'Hola, vengo de la tienda web y quisiera consultar sobre los zapatos y opciones de credito.'
  )}`;

  return (
    <aside
      aria-label="Atención al cliente por WhatsApp"
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 z-40 flex items-center justify-center group"
    >
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-interactive="true"
        data-cursor-text="CHAT"
        className="relative block w-[86px] h-[86px] sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 active:scale-95 cursor-pointer"
        title={`Hablar con el vendedor (${whatsappDisplay})`}
      >
        {/* Ambient Halo Glow */}
        <div className="absolute inset-1 sm:inset-2 rounded-full bg-[#25D366]/30 blur-xl opacity-80 group-hover:opacity-100 group-hover:bg-[#25D366]/45 transition-all duration-500" />

        {/* Rotating Circular Text Ring - Always visible and rotating on both mobile and desktop! */}
        <div className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite] group-hover:animate-[spin_9s_linear_infinite] pointer-events-none will-change-transform">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text
              fill="#34D399"
              className="text-[7.4px] sm:text-[8px] font-mono font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase opacity-95 group-hover:opacity-100 group-hover:fill-emerald-200 transition-colors"
            >
              <textPath xlinkHref="#circlePath" href="#circlePath">
                • ASESORIA DIRECTA • URBAN SNEAKERS • EN LINEA • 
              </textPath>
            </text>
          </svg>
        </div>

        {/* Center Glowing Action Circle */}
        <div className="relative w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.7)] group-hover:shadow-[0_6px_35px_rgba(37,211,102,0.95)] transition-all duration-300">
          <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 drop-shadow" />

          {/* Online status indicator dot */}
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-300 border-2 border-[#06060c] animate-ping" />
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-300 border-2 border-[#06060c]" />
        </div>
      </a>
    </aside>
  );
}
