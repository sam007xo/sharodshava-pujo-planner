import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Volume2, Flame, Award } from 'lucide-react';
import { pujoAudio } from '../services/audioService';

interface WeaponInfo {
  id: string;
  name: string;
  bengaliName: string;
  sanskritName: string;
  icon: string;
  bestowedBy: string;
  shaktiDomain: string;
  symbolism: string;
  blessing: string;
  mantra: string;
}

export const DASA_PRAHARAN: WeaponInfo[] = [
  {
    id: 'trishul',
    name: 'Trishul (Trident)',
    bengaliName: 'ত্রিশূল',
    sanskritName: 'त्रिशूलम्',
    icon: '🔱',
    bestowedBy: 'Lord Shiva',
    shaktiDomain: 'Conquest of Tri-Guna (Sattva, Rajas, Tamas)',
    symbolism: 'The sharp three prongs represent the elimination of physical, mental, and spiritual afflictions, bestowing unshakeable inner courage.',
    blessing: 'May you possess the resolute clarity to conquer hesitation and doubt in every pursuit.',
    mantra: 'ॐ ह्रीं दुं दुर्गायै नमः'
  },
  {
    id: 'chakra',
    name: 'Sudarshana Chakra (Divine Discus)',
    bengaliName: 'সুদর্শন চক্র',
    sanskritName: 'सुदर्शन चक्रम्',
    icon: '☸️',
    bestowedBy: 'Lord Vishnu',
    shaktiDomain: 'Dharma & Relentless Momentum',
    symbolism: 'Revolving at the center of existence, it represents cosmic order, unstoppable righteousness, and time that destroys darkness.',
    blessing: 'May your actions remain anchored in truth and propel you with unstoppable momentum.',
    mantra: 'सुदर्शनाय विद्महे महाज्वालाय धीमहि'
  },
  {
    id: 'shankha',
    name: 'Shankha (Sacred Conch)',
    bengaliName: 'শঙ্খ',
    sanskritName: 'शङ्खः',
    icon: '🐚',
    bestowedBy: 'Varuna (Lord of Waters)',
    shaktiDomain: 'Auspicious Awakening & Pure Vibration',
    symbolism: 'The primal sound of creation (Pranava OM). Its resonating echo dispels malevolent forces and purifies thoughts.',
    blessing: 'May the sacred sound awaken pristine focus and inner harmony in your daily life.',
    mantra: 'त्वं वैष्णवी शक्तिरनन्तवीर्या'
  },
  {
    id: 'dhanush',
    name: 'Dhanush & Bana (Bow & Arrows)',
    bengaliName: 'ধনুর্বাণ',
    sanskritName: 'धनुर्बाणौ',
    icon: '🏹',
    bestowedBy: 'Vayu (Wind) & Surya (Sun)',
    shaktiDomain: 'Focused Willpower & Swift Aim',
    symbolism: 'The bow represents potential spiritual energy, while the arrows denote focused kinetic execution striking the target without wavering.',
    blessing: 'May your focus remain sharp as an arrow, hitting your highest aspirations.',
    mantra: 'शरणागतदीनार्तपरित्राणपरायणे'
  },
  {
    id: 'padma',
    name: 'Padma (Lotus)',
    bengaliName: 'পদ্ম',
    sanskritName: 'पद्मम्',
    icon: '🪷',
    bestowedBy: 'Lord Brahma',
    shaktiDomain: 'Spiritual Purity & Untainted Wisdom',
    symbolism: 'Blossoming untouched above murky waters, the lotus symbolizes unconditional beauty, detached wisdom, and spiritual rebirth.',
    blessing: 'May you rise above distractions and bloom with graceful wisdom and kindness.',
    mantra: 'सर्वमङ्गलमङ्गल्ये शिवे सर्वार्थसाधिकে'
  },
  {
    id: 'khadga',
    name: 'Khadga & Dhal (Sword & Shield)',
    bengaliName: 'খড়্গ ও ঢাল',
    sanskritName: 'खड्ग-फलके',
    icon: '⚔️',
    bestowedBy: 'Kala (Lord of Time)',
    shaktiDomain: 'Discernment & Impenetrable Defense',
    symbolism: 'The razor-sharp blade severs delusion and ignorance, while the shield guards against negative emotions and harmful influences.',
    blessing: 'May you cut through confusion with intellect and remain shielded from all hostility.',
    mantra: 'खड्गिनी शूलिनी घोरा गदिनी चक्रिणी तथा'
  },
  {
    id: 'vajra',
    name: 'Vajra (Thunderbolt)',
    bengaliName: 'বজ্র',
    sanskritName: 'वज्रम्',
    icon: '⚡',
    bestowedBy: 'Indra (King of Devas)',
    shaktiDomain: 'Indomitable Resilience & Power',
    symbolism: 'Crafted from the bones of sage Dadhichi, the thunderbolt embodies resilience that breaks every obstacle while remaining unbroken itself.',
    blessing: 'May your spirit remain diamond-strong in the face of any adversity.',
    mantra: 'शङ्खिनी चापिनी बाणभुशुण्डीपरिघायुधा'
  },
  {
    id: 'ghanta',
    name: 'Ghanta (Sacred Bell)',
    bengaliName: 'ঘণ্টা',
    sanskritName: 'घण्टा',
    icon: '🔔',
    bestowedBy: 'Airavata',
    shaktiDomain: 'Dispelling Darkness & Reverberation',
    symbolism: 'The continuous ringing bells of the Devi instill fear in deceitful minds and bring bliss and sanctuary to devotees.',
    blessing: 'May every step you take resonate with joy, positivity, and clarity of purpose.',
    mantra: 'प्रसीद विश्वेश्वरि पाहि विश्वं'
  },
  {
    id: 'parashu',
    name: 'Parashu (Battle Axe)',
    bengaliName: 'কুঠার / পরশু',
    sanskritName: 'परशुः',
    icon: '🪓',
    bestowedBy: 'Vishwakarma (Divine Architect)',
    shaktiDomain: 'Craftsmanship & Shattering Bondage',
    symbolism: 'The tool of divine artisans, severing ties of helplessness and crafting new pathways through sheer perseverance.',
    blessing: 'May you possess the creative skill to build solutions and carve your own destiny.',
    mantra: 'त्वं स्वाहा त्वं स्वधा त्वं हि वषट्कारः'
  },
  {
    id: 'gada',
    name: 'Gada (Mace / Kaumodaki)',
    bengaliName: 'গদা',
    sanskritName: 'गदा',
    icon: '🛡️',
    bestowedBy: 'Yama / Kubera',
    shaktiDomain: 'Loyalty, Self-Mastery & Inner Strength',
    symbolism: 'Represents mental and moral discipline, crushing ego and arrogance to elevate humble, principled strength.',
    blessing: 'May humility and self-mastery be your greatest enduring strength.',
    mantra: 'नमो देव्यै महादेव्यै शिवायै सततं नमः'
  }
];

interface ShaktiWeaponsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShaktiWeaponsModal: React.FC<ShaktiWeaponsModalProps> = ({ isOpen, onClose }) => {
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponInfo>(DASA_PRAHARAN[0]);
  const [receivedBlessing, setReceivedBlessing] = useState<boolean>(false);

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

  const handleSelectWeapon = (weapon: WeaponInfo) => {
    setSelectedWeapon(weapon);
    setReceivedBlessing(false);
    pujoAudio.playTempleBell();
  };

  const handleClaimBlessing = () => {
    setReceivedBlessing(true);
    pujoAudio.playConch();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Dark ethereal backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-lg"
        />

        {/* Modal Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-3xl glass-panel border border-[#d4af37]/25 p-5 sm:p-8 shadow-2xl z-10 my-auto overflow-hidden text-left"
        >
          {/* Top golden border specular line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          
          {/* Subtle background aura */}
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-[#8b1e2a]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#f4e5a9] flex items-center gap-1">
                  <Sparkles size={11} className="text-[#d4af37]" />
                  Dasa Praharan • দশপ্রহরণধারিণী
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                The 10 Weapons & Shaktis of Maa Durga
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
                Bestowed by the divine pantheon, each weapon in Devi Durga’s ten hands symbolizes an invincible cosmic power to overcome darkness.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Grid: Left Selector (10 weapons) + Right Detail & Blessing View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
            
            {/* Left 10 Weapons list */}
            <div className="md:col-span-5 space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-white/40 mb-2 px-1">
                Select a Divine Weapon
              </div>
              {DASA_PRAHARAN.map((weapon) => {
                const isSelected = selectedWeapon.id === weapon.id;
                return (
                  <button
                    key={weapon.id}
                    onClick={() => handleSelectWeapon(weapon)}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all flex items-center justify-between gap-2 border ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border-[#d4af37]/40 shadow-glass text-white'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{weapon.icon}</span>
                      <div className="truncate">
                        <p className="text-xs font-semibold truncate flex items-center gap-1.5">
                          <span>{weapon.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-[#f4e5a9]/75 font-serif font-normal">{weapon.bengaliName}</span>
                        </p>
                        <p className="text-[10px] text-white/40 font-mono truncate">{weapon.bestowedBy}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Showcase */}
            <div className="md:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
              {/* Corner Watermark */}
              <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 pointer-events-none select-none">
                {selectedWeapon.icon}
              </div>

              <div>
                {/* Weapon Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-2xl shadow-glass">
                      {selectedWeapon.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#f4e5a9]/80">
                        Gift of {selectedWeapon.bestowedBy}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span>{selectedWeapon.name}</span>
                        <span className="text-sm font-serif text-[#d4af37] font-normal">• {selectedWeapon.bengaliName}</span>
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => pujoAudio.playTempleBell()}
                    title="Chime Sacred Bell"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#f4e5a9] border border-white/10 transition-colors"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>

                {/* Shakti Domain Pill */}
                <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8b1e2a]/25 border border-[#8b1e2a]/40 text-xs text-[#fca5a5]">
                  <Flame size={12} className="text-[#f87171]" />
                  <span>{selectedWeapon.shaktiDomain}</span>
                </div>

                {/* Spiritual Symbolism */}
                <div className="space-y-3 text-xs sm:text-sm text-white/80 leading-relaxed">
                  <p>{selectedWeapon.symbolism}</p>
                </div>

                {/* Sanskrit Mantra Snippet */}
                <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 font-serif text-center text-xs sm:text-sm text-[#f4e5a9] tracking-widest shadow-inner">
                  {selectedWeapon.mantra}
                </div>
              </div>

              {/* Bottom: Claim Personal Shakti Blessing */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <AnimatePresence mode="wait">
                  {!receivedBlessing ? (
                    <motion.button
                      key="ask-blessing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClaimBlessing}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/30 to-[#8b1e2a]/30 hover:from-[#d4af37]/30 hover:to-[#8b1e2a]/40 border border-[#d4af37]/40 text-xs sm:text-sm font-semibold text-[#f4e5a9] flex items-center justify-center gap-2 transition-all shadow-glass cursor-pointer"
                    >
                      <Award size={15} className="text-[#d4af37]" />
                      <span>Invoke Blessing of {selectedWeapon.name.split(' ')[0]}</span>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="blessing-received"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-center"
                    >
                      <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-[#d4af37] uppercase tracking-wider mb-1">
                        <Sparkles size={11} />
                        <span>Divine Shakti Granted</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white italic">
                        "{selectedWeapon.blessing}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-mono">
            <span>যা দেবী সর্বভূতেষু শক্তিরূপেণ সংস্থিতা</span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
