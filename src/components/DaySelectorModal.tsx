import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FestivalConfig, FestivalDay } from '../config/festivalConfig';
import { DayThemeDoodle } from './DurgaPujaDoodles';

interface DaySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  festival: FestivalConfig;
  selectedDayId: string | null;
  onSelectDay: (day: FestivalDay) => void;
}

export const DaySelectorModal: React.FC<DaySelectorModalProps> = ({
  isOpen,
  onClose,
  festival,
  selectedDayId,
  onSelectDay,
}) => {
  const [hoveredDayId, setHoveredDayId] = useState<string | null>(null);
  const [clickedDayId, setClickedDayId] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRowClick = (day: FestivalDay) => {
    setClickedDayId(day.id);
    
    // Subtle golden confetti spark
    try {
      confetti({
        particleCount: 28,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#f5e7a9', '#ffffff', '#8b1e2a'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }

    // Allow user to see selected state for a split moment before smooth close
    setTimeout(() => {
      onSelectDay(day);
      setClickedDayId(null);
      onClose();
    }, 280);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-md"
          />

          {/* Floating Glass Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl glass-panel border border-white/15 p-6 sm:p-8 shadow-2xl z-10 my-auto overflow-hidden"
          >
            {/* Specular highlights & light leak */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
                  Pick your day
                </h3>
                <p className="text-xs sm:text-sm text-white/50 mt-1">
                  Select a day to view its rituals, moments & pandals
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 sm:p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* List of Puja Days */}
            <div className="mt-5 space-y-2.5">
              {festival.days.map((day) => {
                const isSelected = selectedDayId === day.id || clickedDayId === day.id;
                const isHovered = hoveredDayId === day.id;

                return (
                  <motion.div
                    key={day.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onHoverStart={() => setHoveredDayId(day.id)}
                    onHoverEnd={() => setHoveredDayId(null)}
                    onClick={() => handleRowClick(day)}
                    className={`group relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border border-[#d4af37]/45 shadow-[0_0_25px_rgba(212,175,55,0.18)]'
                        : 'glass-row hover:border-white/20'
                    }`}
                  >
                    {/* Subtle specular sheen on hover */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-opacity duration-300 pointer-events-none ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`} 
                    />

                    {/* Left: Day Doodle Icon, Day Name & Bengali Script */}
                    <div className="flex items-center space-x-3.5 relative z-10">
                      <div className="relative shrink-0">
                        <DayThemeDoodle dayId={day.id} size="sm" animated={isHovered || isSelected} />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-base sm:text-lg font-semibold tracking-tight transition-colors ${
                            isSelected ? 'text-[#f4e5a9]' : 'text-white/95 group-hover:text-white'
                          }`}>
                            {day.name}
                          </span>
                          {day.bengaliName && (
                            <span className="text-xs text-white/40 font-serif">
                              • {day.bengaliName}
                            </span>
                          )}
                        </div>
                        {day.significance && (
                          <p className="text-[11px] text-white/50 truncate max-w-[200px] sm:max-w-[280px]">
                            {day.significance.split('(')[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Date Badge & Action */}
                    <div className="flex items-center space-x-3 relative z-10">
                      <span className={`text-xs sm:text-sm font-mono tracking-tight transition-colors ${
                        isSelected ? 'text-[#f4e5a9] font-medium' : 'text-white/60 group-hover:text-white/90'
                      }`}>
                        {day.displayDate}
                      </span>

                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#d4af37]/30 text-[#f4e5a9]' 
                          : 'text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5'
                      }`}>
                        {isSelected ? <Check size={14} strokeWidth={2.5} /> : <ChevronRight size={15} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom info tip */}
            <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-[#d4af37]" />
                Durga Puja {festival.year} Calendar
              </span>
              <span>Tap any day to focus</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
