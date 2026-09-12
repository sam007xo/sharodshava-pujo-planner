import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Sparkles, Volume2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { pujoAudio } from '../services/audioService';

interface VirtualPushpanjaliModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualPushpanjaliModal: React.FC<VirtualPushpanjaliModalProps> = ({ isOpen, onClose }) => {
  const [litLamps, setLitLamps] = useState<number>(1);
  const [pushpanjaliOffered, setPushpanjaliOffered] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'anjali' | 'pradeep'>('anjali');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Trigger celebratory floral pushpanjali confetti
  const handleOfferPushpanjali = () => {
    setPushpanjaliOffered(prev => prev + 1);
    pujoAudio.playConch();

    // Launch floral petal confetti: Crimson Hibiscus (জবা), Golden Marigold (গাঁদা), Sacred Lotus Pink, and Bael Leaf Green
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#dc2626', '#f59e0b', '#fb7185', '#15803d', '#d4af37'],
      shapes: ['circle'],
      scalar: 1.2,
      ticks: 200,
    });
  };

  // Light up Sandhi Puja pradeep
  const handleLightPradeep = (index: number) => {
    if (index >= litLamps) {
      setLitLamps(index + 1);
      pujoAudio.playTempleBell();
    }
  };

  const handleLightAllPradeeps = () => {
    setLitLamps(108);
    pujoAudio.playTempleBell();
    pujoAudio.playConch();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-3xl glass-panel border border-[#d4af37]/30 p-6 sm:p-8 shadow-2xl z-10 my-auto overflow-hidden text-left"
        >
          {/* Top golden edge */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#f4e5a9] inline-flex items-center gap-1.5 mb-1.5">
                <Sparkles size={11} className="text-[#d4af37]" />
                Cultural Rituals • ভক্তিবন্দনা
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Virtual Pushpanjali & Pradeep
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Participate in the sacred traditions of Durga Puja from anywhere in the world.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mt-5 p-1 rounded-xl bg-white/[0.04] border border-white/10 max-w-sm">
            <button
              onClick={() => setActiveTab('anjali')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'anjali'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🌸 Pushpanjali Offering</span>
            </button>
            <button
              onClick={() => setActiveTab('pradeep')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'pradeep'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🪔 108 Sandhi Pradeep</span>
            </button>
          </div>

          {/* TAB 1: Pushpanjali */}
          {activeTab === 'anjali' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-col items-center text-center"
            >
              {/* Devi Pratima Sacred Motif */}
              <div className="relative my-3 w-28 h-28 rounded-full bg-gradient-to-b from-[#d4af37]/20 to-[#8b1e2a]/30 border border-[#d4af37]/40 flex items-center justify-center shadow-glass">
                <span className="text-5xl select-none">🪷</span>
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-[#d4af37]/40"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                />
              </div>

              {/* Sacred Sanskrit Shloka */}
              <div className="max-w-lg mt-3 p-4 rounded-2xl bg-black/40 border border-white/10 font-serif text-center">
                <p className="text-sm sm:text-base text-[#f4e5a9] font-medium leading-relaxed">
                  "सर्वमङ्गलमङ्गल्ये शिवे सर्वार्थसाधिके ।<br />
                  शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥"
                </p>
                <p className="text-[11px] text-white/50 font-sans mt-2">
                  To the auspicious of all auspicious, the fulfiller of every desire, the shelter of the helpless — Mother Narayani, we bow to Thee.
                </p>
              </div>

              {/* Offer Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOfferPushpanjali}
                className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#dc2626] via-[#d4af37] to-[#dc2626] text-white font-bold text-sm tracking-wide shadow-2xl flex items-center gap-2 cursor-pointer"
              >
                <span>🌺 Offer Pushpanjali to Maa Durga</span>
                <Sparkles size={16} />
              </motion.button>

              <div className="mt-4 flex items-center gap-3 text-xs text-white/50 font-mono">
                <span>Total Offerings: <strong className="text-[#f4e5a9]">{pushpanjaliOffered}</strong></span>
                <span>•</span>
                <button
                  onClick={() => pujoAudio.playConch()}
                  className="hover:text-white flex items-center gap-1 text-[#d4af37]"
                >
                  <Volume2 size={12} />
                  <span>Resonate Shankha</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: 108 Sandhi Puja Pradeep */}
          {activeTab === 'pradeep' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div className="flex items-center justify-between mb-3 text-xs">
                <div>
                  <span className="font-semibold text-white">Sandhi Puja 108 Pradeep Offering</span>
                  <p className="text-[11px] text-white/50">Lamps Lit: <strong className="text-[#f4e5a9]">{litLamps} / 108</strong></p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLightAllPradeeps}
                    className="px-3 py-1 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/30 text-[#f4e5a9] font-medium text-[11px] transition-colors"
                  >
                    Light All 108
                  </button>
                  <button
                    onClick={() => setLitLamps(1)}
                    className="p-1 rounded-lg text-white/40 hover:text-white"
                    title="Reset"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>

              {/* 108 Lamps Interactive Grid */}
              <div className="grid grid-cols-12 gap-1.5 p-3 rounded-2xl bg-black/40 border border-white/10 max-h-[36vh] overflow-y-auto">
                {[...Array(108)].map((_, i) => {
                  const isLit = i < litLamps;
                  return (
                    <button
                      key={i}
                      onClick={() => handleLightPradeep(i)}
                      title={`Lamp #${i + 1}`}
                      className={`h-7 rounded-lg flex items-center justify-center transition-all ${
                        isLit
                          ? 'bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#fde047] shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                          : 'bg-white/[0.02] border border-white/[0.06] text-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      <Flame size={12} className={isLit ? 'animate-pulse text-[#fde047]' : ''} />
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-center text-xs text-[#f4e5a9]/80 italic">
                {litLamps === 108 
                  ? '✨ All 108 Pradeeps illuminated! May Devi Durga remove all darkness from your path.'
                  : 'Tap each earthen lamp to ignite your tribute for Maha Ashtami Sandhi Puja.'}
              </p>
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-mono">
            <span>শুভ শারদীয়া শুভেচ্ছা</span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Done
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
