'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface RotatingWhatsAppStampProps {
  whatsappNumber?: string;
  whatsappDisplay?: string;
}

/**
 * Signature Unique Capital Rotating Contact Stamp Widget
 * Features a circular rotating text path stamp ("★ ASESORÍA PERSONALIZADA ★ URBAN SNEAKERS ★")
 * and an elevated pulsing WhatsApp action button in the center.
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
      className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-40 flex items-center justify-center group"
    >
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-interactive="true"
        data-cursor-text="CHAT"
        className="relative block w-28 h-28 lg:w-32 lg:h-32 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        title={`Hablar con el vendedor (${whatsappDisplay})`}
      >
        {/* Ambient Halo Glow */}
        <div className="absolute inset-2 rounded-full bg-[#25D366]/20 blur-xl opacity-75 group-hover:opacity-100 group-hover:bg-[#D1C4FF]/30 transition-all duration-500" />

        {/* Rotating Circular Text Ring (Unique Capital Signature Effect) */}
        <div className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite] group-hover:animate-[spin_10s_linear_infinite] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text
              fill="#D1C4FF"
              className="text-[8.5px] font-mono font-bold tracking-[0.24em] uppercase opacity-85 group-hover:opacity-100 group-hover:fill-white transition-colors"
            >
              <textPath xlinkHref="#circlePath" href="#circlePath">
                • ASESORIA DIRECTA • URBAN SNEAKERS • ATENCION EN VIVO 
              </textPath>
            </text>
          </svg>
        </div>

        {/* Center Glowing Action Circle */}
        <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.5)] group-hover:shadow-[0_6px_35px_rgba(209,196,255,0.7)] group-hover:from-[#9333EA] group-hover:to-[#D1C4FF] transition-all duration-300">
          <MessageCircle className="w-7 h-7 lg:w-8 lg:h-8 drop-shadow" />
          
          {/* Online status indicator dot */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#06060c] animate-ping" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#06060c]" />
        </div>
      </a>
    </aside>
  );
}
