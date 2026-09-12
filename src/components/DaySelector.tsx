import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Calendar, Route, Sparkles, Compass, ExternalLink } from 'lucide-react';

interface DaySelectorProps {
  onOpenModal: () => void;
  onOpenPlanTrip: () => void;
  selectedDayName?: string;
}

export const DaySelector: React.FC<DaySelectorProps> = ({ 
  onOpenModal, 
  onOpenPlanTrip,
  selectedDayName 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlanHovered, setIsPlanHovered] = useState(false);
  const [isCuratedHovered, setIsCuratedHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center text-center pb-4 sm:pb-8 pt-1 sm:pt-4 px-3 sm:px-4 z-20 w-full max-w-4xl mx-auto">
      
      {/* Title */}
      <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-white">
        Pick your day
      </h2>

      {/* Small Subtitle */}
      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-white/60 tracking-wide max-w-md mx-auto">
        Choose a day to explore your Pujo, plan your custom route, or explore curated trails
      </p>

      {/* Action Buttons: "Select Day ↓", "Plan your trip ✨", and "Explore curated trips 🧭" */}
      <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-lg sm:max-w-none mx-auto">
        
        {/* Button 1: Select Day */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={onOpenModal}
          className="group relative w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl glass-panel border border-white/15 hover:border-[#d4af37]/45 bg-black/55 hover:bg-black/70 backdrop-blur-2xl text-white flex items-center justify-center space-x-3 transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle warm glow background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Diagonal glass reflection sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />

          <Calendar size={16} className="text-[#d4af37] opacity-80 group-hover:opacity-100 transition-opacity" />

          <span className="text-xs sm:text-base font-medium tracking-tight text-white/95 group-hover:text-white">
            {selectedDayName ? `Selected: ${selectedDayName}` : 'Select Day'}
          </span>

          {/* Smooth animated downward arrow */}
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ArrowDown 
              size={16} 
              className="text-[#d4af37] group-hover:text-[#f4e5a9] transition-colors" 
            />
          </motion.div>
        </motion.button>

        {/* Button 2: Plan your trip */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onHoverStart={() => setIsPlanHovered(true)}
          onHoverEnd={() => setIsPlanHovered(false)}
          onClick={onOpenPlanTrip}
          className="group relative w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl glass-panel-gold border border-[#d4af37]/45 hover:border-[#d4af37] bg-black/55 hover:bg-black/70 backdrop-blur-2xl text-white flex items-center justify-center space-x-3 transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_35px_rgba(212,175,55,0.25)]"
        >
          {/* Subtle warm glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/15 via-[#d4af37]/25 to-[#d4af37]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Diagonal reflection */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={isPlanHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />

          <div className="w-6 h-6 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
            <Route size={14} />
          </div>

          <span className="text-xs sm:text-base font-semibold tracking-tight text-white group-hover:text-[#f4e5a9] transition-colors">
            Plan your trip
          </span>

          <Sparkles size={14} className="text-[#d4af37] group-hover:rotate-12 transition-transform" />
        </motion.button>

        {/* Button 3: Explore curated trips */}
        <motion.a
          href="https://sharodshava-curated.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onHoverStart={() => setIsCuratedHovered(true)}
          onHoverEnd={() => setIsCuratedHovered(false)}
          className="group relative w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl glass-panel border border-sky-400/40 hover:border-sky-400 bg-black/55 hover:bg-black/70 backdrop-blur-2xl text-white flex items-center justify-center space-x-3 transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_35px_rgba(56,189,248,0.25)]"
        >
          {/* Subtle sky/amber glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/15 via-sky-400/25 to-sky-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Diagonal reflection */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={isCuratedHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />

          <div className="w-6 h-6 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
            <Compass size={14} />
          </div>

          <span className="text-xs sm:text-base font-semibold tracking-tight text-white group-hover:text-sky-200 transition-colors">
            Explore curated trips
          </span>

          <ExternalLink size={13} className="text-sky-400/80 group-hover:text-sky-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.a>

      </div>

    </div>
  );
};
