'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface RotatingWhatsAppStampProps {
  whatsappNumber?: string;
  whatsappDisplay?: string;
}

/**
 * Responsive Signature Rotating Contact Stamp Widget
 * Mobile: Ergonomic 56px floating action button on bottom-right (never overlaps content).
 * Desktop/Tablet: Expanding rotating circular text badge ("• ASESORÍA DIRECTA • URBAN SNEAKERS •").
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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 z-40 flex items-center justify-center group"
    >
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-interactive="true"
        className="relative block w-14 h-14 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 cursor-pointer"
        title={`Hablar con el vendedor (${whatsappDisplay})`}
      >
        {/* Ambient Halo Glow */}
        <div className="absolute inset-1 sm:inset-2 rounded-full bg-[#25D366]/25 blur-xl opacity-80 group-hover:opacity-100 group-hover:bg-[#25D366]/40 transition-all duration-500" />

        {/* Rotating Circular Text Ring (Shown on Tablet & Desktop) */}
        <div className="hidden sm:block absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite] group-hover:animate-[spin_10s_linear_infinite] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text
              fill="#34D399"
              className="text-[8.5px] font-mono font-bold tracking-[0.24em] uppercase opacity-90 group-hover:opacity-100 group-hover:fill-emerald-300 transition-colors"
            >
              <textPath xlinkHref="#circlePath" href="#circlePath">
                • ASESORIA DIRECTA • URBAN SNEAKERS • ATENCION EN VIVO 
              </textPath>
            </text>
          </svg>
        </div>

        {/* Center Glowing Action Circle (Touch-friendly 56px on mobile) */}
        <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.65)] group-hover:shadow-[0_6px_35px_rgba(37,211,102,0.9)] group-hover:scale-105 transition-all duration-300">
          <MessageCircle className="w-7 h-7 lg:w-8 lg:h-8 drop-shadow" />

          {/* Online status indicator dot */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#06060c] animate-ping" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#06060c]" />
        </div>
      </a>
    </aside>
  );
}
