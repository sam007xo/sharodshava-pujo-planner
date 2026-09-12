import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass } from 'lucide-react';

interface PickSiteButtonProps {
  onOpenSitePicker: () => void;
  selectedZoneName?: string;
  selectedDayName?: string;
}

export const PickSiteButton: React.FC<PickSiteButtonProps> = ({ 
  onOpenSitePicker, 
  selectedZoneName,
  selectedDayName
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center text-center pb-12 pt-3 px-4 z-20">
      
      {/* Prominent "Pick a site" Action Button */}
      <div className="mt-2">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={onOpenSitePicker}
          className="group relative px-8 py-4 rounded-2xl glass-button border border-white/15 hover:border-[#d4af37]/60 text-white flex items-center space-x-3.5 shadow-glass transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_4px_25px_rgba(212,175,55,0.18)] hover:shadow-[0_6px_32px_rgba(212,175,55,0.3)]"
        >
          {/* Subtle warm amber glow background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 via-[#d4af37]/25 to-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Diagonal glass reflection sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          />

          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
            <Compass size={18} className="text-[#d4af37] group-hover:rotate-45 transition-transform duration-500" />
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-[#f4e5a9] transition-colors flex items-center gap-1.5">
              <span>Pick a site</span>
              <MapPin size={15} className="text-[#d4af37] animate-pulse" />
            </span>
            <span className="text-[11px] text-white/60 tracking-normal font-light">
              {selectedZoneName || selectedDayName 
                ? `${selectedDayName ? selectedDayName + ' • ' : ''}${selectedZoneName || 'Explore Zones'}`
                : 'Typography Map • North, Central & South'}
            </span>
          </div>

          <div className="pl-2 border-l border-white/15">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 group-hover:bg-[#d4af37] group-hover:text-black transition-colors">
              Explore
            </span>
          </div>
        </motion.button>
      </div>

    </div>
  );
};
