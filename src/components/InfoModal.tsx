import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { DURGA_PUJA_2026 } from '../config/festivalConfig';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Frosted Glass Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden glass-panel border border-white/15 p-7 shadow-2xl z-10"
          >
            {/* Subtle diagonal glass reflection sheen */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Content Header */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#d4af37]/35 bg-black/50 flex items-center justify-center p-0.5">
                <img 
                  src="/sharodshav_logo.png" 
                  alt="Sharodshav Logo" 
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-wider text-[#f4e5a9] flex items-center gap-1.5 font-sans">
                  SHARODSHAV
                </h3>
                <span className="text-[10px] text-white/50 tracking-wider uppercase">
                  Optimal Pandal Navigation • 2026
                </span>
              </div>
            </div>

            {/* Creator Credits Section */}
            <div className="pt-2 pb-4">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-medium">
                {DURGA_PUJA_2026.creatorCredits.title}
              </p>
              
              <div className="space-y-2">
                {DURGA_PUJA_2026.creatorCredits.creators.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all"
                  >
                    <span className="text-sm font-medium text-white/90">
                      {name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/70" />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-white/40">
              <span>Crafted with devotion & glass</span>
              <Heart size={12} className="text-[#8b1e2a]" fill="currentColor" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
