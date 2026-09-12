import React from 'react';
import { motion } from 'framer-motion';

export type PujaDayKey = 'shashti' | 'saptami' | 'ashtami' | 'navami' | 'dashami' | 'mahalaya' | string;

interface DayDoodleProps {
  dayId?: PujaDayKey;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SHASHTI DOODLE: Sacred Shankha (Conch), Bilva Leaves (Bel Pata) & Dhaak
// ─────────────────────────────────────────────────────────────────────────────
export const ShashtiDoodle: React.FC<{ size?: number; animated?: boolean }> = ({ size = 96, animated = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)]"
      initial={animated ? { rotate: -4, scale: 0.95 } : undefined}
      animate={animated ? { rotate: [ -4, 4, -4 ], scale: [ 0.95, 1.02, 0.95 ] } : undefined}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <radialGradient id="shashti-gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="70%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8b6508" />
        </radialGradient>
        <linearGradient id="shashti-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="100%" stopColor="#8b0000" />
        </linearGradient>
        <linearGradient id="shashti-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>

      {/* Decorative Aura Rays */}
      <circle cx="60" cy="60" r="48" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="60" cy="60" r="42" stroke="#ff4d4d" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />

      {/* 1. Bel Leaf Sprig (Bilva Patra - Bodhon) */}
      <g transform="translate(15, 20) rotate(-15)">
        {/* Center Leaf */}
        <path d="M 25 15 C 18 5, 32 5, 25 28 C 18 15, 32 15, 25 15" fill="url(#shashti-leaf)" stroke="#86efac" strokeWidth="1" />
        <path d="M 25 15 L 25 28" stroke="#14532d" strokeWidth="1" />
        {/* Left Leaf */}
        <path d="M 16 26 C 6 22, 12 34, 25 28 C 12 28, 12 36, 16 26" fill="url(#shashti-leaf)" stroke="#86efac" strokeWidth="0.8" />
        {/* Right Leaf */}
        <path d="M 34 26 C 44 22, 38 34, 25 28 C 38 28, 38 36, 34 26" fill="url(#shashti-leaf)" stroke="#86efac" strokeWidth="0.8" />
        {/* Stem */}
        <path d="M 25 28 Q 24 38 22 44" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 2. Sacred Shankha (Conch Shell) */}
      <g transform="translate(42, 32)">
        {/* Conch Body */}
        <path
          d="M 18 48 C 6 42, 4 22, 16 12 C 28 2, 44 8, 48 20 C 52 32, 40 45, 28 50 C 24 52, 20 50, 18 48 Z"
          fill="#fffdfa"
          stroke="url(#shashti-gold)"
          strokeWidth="2.5"
        />
        {/* Conch Spiral Lines */}
        <path d="M 20 18 C 28 12, 38 18, 38 28 C 38 38, 28 42, 22 40" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M 26 22 C 30 18, 36 22, 34 28 C 32 34, 26 34, 24 32" stroke="#e6ca65" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 12 18 C 15 14, 20 12, 25 12" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Conch Tip Spiral */}
        <ellipse cx="40" cy="14" rx="4" ry="3" fill="url(#shashti-gold)" />
      </g>

      {/* 3. Dhaak Drum on bottom left */}
      <g transform="translate(18, 56) rotate(10)">
        {/* Drum Barrel */}
        <path d="M 8 12 C 16 8, 24 8, 32 12 L 28 36 C 20 38, 12 38, 4 36 Z" fill="url(#shashti-red)" stroke="#ffd700" strokeWidth="1.5" />
        {/* Drum Straps & Belts */}
        <path d="M 8 12 L 28 36 M 32 12 L 4 36 M 18 10 L 16 38" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
        {/* Drum Faces */}
        <ellipse cx="20" cy="10" rx="12" ry="4" fill="#fef3c7" stroke="#d4af37" strokeWidth="1.5" />
        <ellipse cx="16" cy="37" rx="12" ry="4" fill="#fef3c7" stroke="#d4af37" strokeWidth="1.5" />
        {/* Feather plumes (Kasher thoka / palok) */}
        <path d="M 30 10 Q 42 2 46 -4 M 32 12 Q 45 8 50 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <path d="M 31 11 Q 40 6 44 2" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Sound Waves & Sparkles */}
      <motion.circle cx="95" cy="40" r="2.5" fill="#ffd700" animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="85" cy="25" r="1.5" fill="#ffffff" animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }} />
      <motion.path d="M 86 52 Q 94 48 98 40" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
      <motion.path d="M 90 58 Q 100 54 105 44" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SAPTAMI DOODLE: Nabapatrika (Kola Bou) & Sacred Mangal Ghat
// ─────────────────────────────────────────────────────────────────────────────
export const SaptamiDoodle: React.FC<{ size?: number; animated?: boolean }> = ({ size = 96, animated = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_20px_rgba(245,158,11,0.4)]"
      initial={animated ? { rotate: 3, scale: 0.96 } : undefined}
      animate={animated ? { rotate: [ 3, -3, 3 ], scale: [ 0.96, 1.03, 0.96 ] } : undefined}
      transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="saptami-saree" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="85%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="saptami-pot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <linearGradient id="saptami-red-border" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>

      {/* Sun / River Ghat Morning Aura */}
      <circle cx="60" cy="60" r="48" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

      {/* 1. Nabapatrika (Kola Bou in Lal-Paar Sari) */}
      <g transform="translate(18, 15)">
        {/* Banana Plant Leaf Top (Maatha) */}
        <path d="M 22 18 C 16 6, 28 2, 22 0 C 14 6, 18 14, 22 18 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
        <path d="M 22 0 L 22 18" stroke="#166534" strokeWidth="1" />
        
        {/* Veiled Saree Head (Ghomta) */}
        <path d="M 12 18 C 16 12, 28 12, 32 18 L 38 65 C 28 70, 16 70, 6 65 Z" fill="url(#saptami-saree)" stroke="#ca8a04" strokeWidth="1.5" />
        {/* Red Border (Lal Paar) */}
        <path d="M 12 18 C 16 12, 28 12, 32 18" stroke="url(#saptami-red-border)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 6 65 C 16 70, 28 70, 38 65" stroke="url(#saptami-red-border)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 14 20 L 8 64" stroke="url(#saptami-red-border)" strokeWidth="2" strokeLinecap="round" fill="none" />
        
        {/* Vermillion Sindoor Bindi inside Ghomta */}
        <circle cx="22" cy="24" r="2.5" fill="#dc2626" />
        <circle cx="22" cy="24" r="4" stroke="#fde047" strokeWidth="0.8" fill="none" />
      </g>

      {/* 2. Mangal Ghat (Terracotta Sacred Pot) */}
      <g transform="translate(60, 38)">
        {/* Mango Leaves (Aamra Pallav) */}
        <path d="M 24 16 C 14 6, 22 -2, 24 16" fill="#16a34a" stroke="#15803d" strokeWidth="0.8" />
        <path d="M 24 16 C 34 6, 26 -2, 24 16" fill="#16a34a" stroke="#15803d" strokeWidth="0.8" />
        <path d="M 24 16 C 24 2, 24 -4, 24 16" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />

        {/* Green Coconut (Daab) with Red Sindoor Tilak */}
        <ellipse cx="24" cy="12" rx="7" ry="8" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.2" />
        <circle cx="24" cy="11" r="2" fill="#dc2626" />

        {/* Pot Rim & Body */}
        <ellipse cx="24" cy="20" rx="11" ry="3" fill="#fdba74" stroke="#c2410c" strokeWidth="1.5" />
        <path
          d="M 14 20 C 10 26, 4 36, 12 46 C 18 52, 30 52, 36 46 C 44 36, 38 26, 34 20 Z"
          fill="url(#saptami-pot)"
          stroke="#7c2d12"
          strokeWidth="1.8"
        />

        {/* Auspicious Swastika / Floral Pattern on Pot */}
        <path d="M 24 28 L 24 40 M 18 34 L 30 34" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
        <circle cx="21" cy="31" r="1" fill="#fde047" />
        <circle cx="27" cy="31" r="1" fill="#fde047" />
        <circle cx="21" cy="37" r="1" fill="#fde047" />
        <circle cx="27" cy="37" r="1" fill="#fde047" />

        {/* Pot Base */}
        <ellipse cx="24" cy="48" rx="8" ry="2" fill="#7c2d12" />
      </g>

      {/* Floating Ganga Water Ripple / Flowers */}
      <path d="M 20 95 Q 60 90 100 95" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M 30 101 Q 60 98 90 101" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <motion.circle cx="95" cy="30" r="3" fill="#f59e0b" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. ASHTAMI DOODLE: Divine Third Eye (Trinayani), Trishul & 108 Lotuses
// ─────────────────────────────────────────────────────────────────────────────
export const AshtamiDoodle: React.FC<{ size?: number; animated?: boolean }> = ({ size = 96, animated = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_24px_rgba(220,38,38,0.5)]"
      initial={animated ? { scale: 0.96 } : undefined}
      animate={animated ? { scale: [ 0.96, 1.04, 0.96 ] } : undefined}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="ashtami-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="40%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <radialGradient id="ashtami-fire" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
        <linearGradient id="ashtami-lotus" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>

      {/* Divine Radiant Shakti Halo */}
      <circle cx="60" cy="60" r="50" stroke="#fde047" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="60" cy="60" r="44" stroke="#ef4444" strokeWidth="0.8" opacity="0.4" />

      {/* 1. Golden Trishul (Trident) at Center */}
      <g transform="translate(60, 20)">
        {/* Center Prong */}
        <path d="M 0 0 L 3 14 L 0 24 L -3 14 Z" fill="url(#ashtami-gold)" stroke="#b45309" strokeWidth="0.8" />
        {/* Left Prong Curve */}
        <path d="M -2 16 C -14 10, -18 2, -18 0 C -18 12, -8 24, -2 24 Z" fill="url(#ashtami-gold)" stroke="#b45309" strokeWidth="0.8" />
        {/* Right Prong Curve */}
        <path d="M 2 16 C 14 10, 18 2, 18 0 C 18 12, 8 24, 2 24 Z" fill="url(#ashtami-gold)" stroke="#b45309" strokeWidth="0.8" />
        {/* Trident Base & Shaft */}
        <path d="M -4 24 L 4 24 L 2 54 L -2 54 Z" fill="url(#ashtami-gold)" stroke="#b45309" strokeWidth="0.8" />
      </g>

      {/* 2. Maa Durga Divine Eyes (Trinayani) */}
      <g transform="translate(18, 40)">
        {/* Left Divine Eye */}
        <path d="M 12 16 C 22 8, 34 8, 42 16 C 34 24, 22 24, 12 16 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />
        <circle cx="27" cy="16" r="4.5" fill="#000000" />
        <circle cx="28.5" cy="14.5" r="1.5" fill="#ffffff" />
        {/* Upper Eye Contour & Eyelash */}
        <path d="M 8 16 C 22 4, 34 4, 46 16" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Right Divine Eye */}
        <path d="M 46 16 C 56 8, 68 8, 76 16 C 68 24, 56 24, 46 16 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />
        <circle cx="61" cy="16" r="4.5" fill="#000000" />
        <circle cx="62.5" cy="14.5" r="1.5" fill="#ffffff" />
        {/* Upper Eye Contour & Eyelash */}
        <path d="M 42 16 C 56 4, 68 4, 80 16" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Third Eye (Trinayan) on Forehead with Chandrabindu */}
        <path d="M 44 2 C 41 -6, 47 -6, 44 -14 C 47 -6, 41 -6, 44 2 Z" fill="#dc2626" stroke="#ffd700" strokeWidth="1" />
        <circle cx="44" cy="-6" r="2" fill="#ffd700" />
        {/* Golden Nose Ring (Nath) */}
        <circle cx="44" cy="30" r="6" stroke="#ffd700" strokeWidth="1.5" fill="none" />
        <circle cx="39" cy="30" r="1.5" fill="#dc2626" />
      </g>

      {/* 3. 108 Sacred Lotus Flowers (Padma) at Bottom */}
      <g transform="translate(38, 78)">
        {/* Center Petal */}
        <path d="M 22 0 C 14 -12, 30 -12, 22 0" fill="url(#ashtami-lotus)" stroke="#be185d" strokeWidth="1" />
        {/* Inner Left & Right Petals */}
        <path d="M 20 6 C 8 -4, 18 -10, 22 0" fill="url(#ashtami-lotus)" stroke="#be185d" strokeWidth="0.8" />
        <path d="M 24 6 C 36 -4, 26 -10, 22 0" fill="url(#ashtami-lotus)" stroke="#be185d" strokeWidth="0.8" />
        {/* Outer Flaring Petals */}
        <path d="M 18 10 C 2 -2, 10 -6, 20 6" fill="url(#ashtami-lotus)" stroke="#be185d" strokeWidth="0.8" />
        <path d="M 26 10 C 42 -2, 34 -6, 24 6" fill="url(#ashtami-lotus)" stroke="#be185d" strokeWidth="0.8" />
        {/* Lotus Calyx & Pradeep Flame */}
        <path d="M 16 12 C 22 18, 26 18, 28 12 Z" fill="#ca8a04" stroke="#ffd700" strokeWidth="1" />
        {/* Sacred Diya Flame */}
        <path d="M 22 14 C 20 18, 24 18, 22 14" fill="url(#ashtami-fire)" />
      </g>

      {/* Floating 108 Diya Flames on sides */}
      <g transform="translate(12, 86)">
        <ellipse cx="6" cy="6" rx="6" ry="3" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
        <path d="M 6 4 C 4 0, 8 0, 6 4" fill="url(#ashtami-fire)" />
      </g>
      <g transform="translate(96, 86)">
        <ellipse cx="6" cy="6" rx="6" ry="3" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
        <path d="M 6 4 C 4 0, 8 0, 6 4" fill="url(#ashtami-fire)" />
      </g>
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. NAVAMI DOODLE: Maha Aarti Dhunuchi, Aromatic Smoke & Fire Embers
// ─────────────────────────────────────────────────────────────────────────────
export const NavamiDoodle: React.FC<{ size?: number; animated?: boolean }> = ({ size = 96, animated = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_22px_rgba(249,115,22,0.45)]"
      initial={animated ? { rotate: -3, scale: 0.96 } : undefined}
      animate={animated ? { rotate: [ -3, 3, -3 ], scale: [ 0.96, 1.03, 0.96 ] } : undefined}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="navami-dhunuchi" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <radialGradient id="navami-flame" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
      </defs>

      {/* Aarti Aura Ring */}
      <circle cx="60" cy="60" r="48" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

      {/* Swirling Holy Dhuno Smoke Spirals */}
      <motion.path
        d="M 50 35 C 40 25, 45 15, 55 10 C 65 5, 75 12, 70 20 C 65 28, 55 24, 60 35"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
        animate={{ opacity: [0.6, 0.9, 0.6], pathLength: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.path
        d="M 68 32 C 78 22, 85 18, 90 12"
        stroke="#fef08a"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <motion.path
        d="M 42 32 C 32 24, 28 16, 35 8"
        stroke="#fed7aa"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* Glowing Embers & Flying Sparks */}
      <motion.circle cx="52" cy="18" r="2" fill="#fdba74" animate={{ y: [-2, -8, -2], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <motion.circle cx="75" cy="14" r="1.5" fill="#fef08a" animate={{ y: [-1, -6, -1], opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }} />
      <motion.circle cx="62" cy="6" r="2.5" fill="#f97316" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />

      {/* Dancing Fire Flames Inside Dhunuchi */}
      <path d="M 52 48 C 46 36, 56 30, 52 24 C 60 30, 64 36, 58 48 Z" fill="url(#navami-flame)" />
      <path d="M 62 48 C 58 38, 68 32, 66 26 C 72 32, 74 38, 68 48 Z" fill="url(#navami-flame)" />
      <path d="M 57 48 C 55 40, 62 36, 60 30 C 65 36, 66 42, 61 48 Z" fill="#fef08a" />

      {/* The Clay Dhunuchi Bowl & Handle */}
      <g transform="translate(30, 48)">
        {/* Bowl Rim */}
        <ellipse cx="30" cy="6" rx="28" ry="7" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.8" />
        <ellipse cx="30" cy="6" rx="24" ry="5" fill="#7c2d12" />

        {/* Bowl Body */}
        <path
          d="M 4 6 C 8 20, 18 28, 24 32 L 36 32 C 42 28, 52 20, 56 6 Z"
          fill="url(#navami-dhunuchi)"
          stroke="#541c09"
          strokeWidth="2"
        />

        {/* Terracotta Engraved Bands */}
        <path d="M 12 16 Q 30 22 48 16" stroke="#fdba74" strokeWidth="1.5" fill="none" />
        <path d="M 18 24 Q 30 28 42 24" stroke="#fdba74" strokeWidth="1.5" fill="none" />

        {/* Handle Stem */}
        <path d="M 24 32 L 24 48 C 24 52, 36 52, 36 48 L 36 32 Z" fill="url(#navami-dhunuchi)" stroke="#541c09" strokeWidth="1.5" />

        {/* Handle Grip Base (Flared Stand) */}
        <path d="M 20 48 C 24 54, 36 54, 40 48 L 46 54 C 36 58, 24 58, 14 54 Z" fill="#9a3412" stroke="#541c09" strokeWidth="1.5" />
      </g>

      {/* Crossed Dhaak Kathi (Sticks) on Bottom Right */}
      <path d="M 85 75 L 105 105" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 105 75 L 85 105" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. DASHAMI DOODLE: Sindoor Khela Pot, Paan Leaf, Sandesh & Shuvo Bijoya Alpana
// ─────────────────────────────────────────────────────────────────────────────
export const DashamiDoodle: React.FC<{ size?: number; animated?: boolean }> = ({ size = 96, animated = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_22px_rgba(225,29,72,0.45)]"
      initial={animated ? { rotate: 2, scale: 0.95 } : undefined}
      animate={animated ? { rotate: [ 2, -2, 2 ], scale: [ 0.95, 1.03, 0.95 ] } : undefined}
      transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="dashami-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id="dashami-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="dashami-paan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>

      {/* Auspicious Sindoor Aura */}
      <circle cx="60" cy="60" r="48" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />

      {/* 1. Auspicious Paan Leaf (Betel Leaf) with Sindoor */}
      <g transform="translate(18, 22) rotate(-15)">
        {/* Heart shaped Paan Leaf */}
        <path
          d="M 26 6 C 10 -4, 0 16, 26 44 C 52 16, 42 -4, 26 6 Z"
          fill="url(#dashami-paan)"
          stroke="#166534"
          strokeWidth="1.5"
        />
        {/* Leaf Veins */}
        <path d="M 26 6 L 26 40" stroke="#86efac" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 26 16 Q 16 12 10 18 M 26 16 Q 36 12 42 18" stroke="#86efac" strokeWidth="0.8" />
        <path d="M 26 26 Q 18 24 14 30 M 26 26 Q 34 24 38 30" stroke="#86efac" strokeWidth="0.8" />
        {/* Sindoor (Vermillion) Dollop on Paan */}
        <circle cx="26" cy="22" r="5" fill="#dc2626" />
        <circle cx="26" cy="22" r="2" fill="#fee2e2" />
      </g>

      {/* 2. Traditional Brass Sindoor Kouto (Vermillion Casket) */}
      <g transform="translate(56, 32)">
        {/* Casket Dome Lid Top */}
        <path d="M 22 4 L 20 0 L 24 0 Z" fill="url(#dashami-gold)" />
        <circle cx="22" cy="5" r="2.5" fill="#e11d48" />

        {/* Casket Dome Lid */}
        <path
          d="M 10 18 C 12 8, 32 8, 34 18 Z"
          fill="url(#dashami-gold)"
          stroke="#78350f"
          strokeWidth="1.2"
        />
        <path d="M 12 16 Q 22 12 32 16" stroke="#fde047" strokeWidth="1" fill="none" />

        {/* Casket Body with Vermillion Inside */}
        <ellipse cx="22" cy="20" rx="14" ry="4" fill="url(#dashami-red)" stroke="#78350f" strokeWidth="1" />
        <path
          d="M 8 20 C 8 32, 14 42, 22 42 C 30 42, 36 32, 36 20 Z"
          fill="url(#dashami-gold)"
          stroke="#78350f"
          strokeWidth="1.5"
        />

        {/* Auspicious Red Ribbon & Engravings */}
        <path d="M 10 26 Q 22 30 34 26" stroke="#e11d48" strokeWidth="2.5" fill="none" />
        <circle cx="22" cy="34" r="2" fill="#e11d48" />
      </g>

      {/* 3. Plate of Bengali Mishti (Conch-shaped Sandesh / Rosogolla) */}
      <g transform="translate(32, 75)">
        {/* Brass Plate (Kansa Thali) */}
        <ellipse cx="28" cy="18" rx="26" ry="7" fill="url(#dashami-gold)" stroke="#78350f" strokeWidth="1.2" />
        <ellipse cx="28" cy="17" rx="22" ry="5" fill="#fef08a" opacity="0.6" />

        {/* Sandesh 1 (Conch Shankha Sandesh) */}
        <ellipse cx="20" cy="15" rx="5" ry="3.5" fill="#fffdfa" stroke="#d4af37" strokeWidth="0.8" />
        <circle cx="20" cy="15" r="1" fill="#ea580c" />

        {/* Sandesh 2 (Round Rosogolla) */}
        <circle cx="28" cy="14" r="4" fill="#ffffff" stroke="#fde047" strokeWidth="0.8" />
        <circle cx="28" cy="13" r="1" fill="#dc2626" />

        {/* Sandesh 3 */}
        <ellipse cx="36" cy="15" rx="5" ry="3.5" fill="#fffdfa" stroke="#d4af37" strokeWidth="0.8" />
        <circle cx="36" cy="15" r="1" fill="#ea580c" />
      </g>

      {/* Sindoor Khela Flying Red Powder (Abir / Sindoor) Specks */}
      <motion.circle cx="25" cy="15" r="2" fill="#f43f5e" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="95" cy="28" r="2.5" fill="#f43f5e" animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity, delay: 0.2 }} />
      <motion.circle cx="98" cy="55" r="1.5" fill="#e11d48" animate={{ y: [-2, 2, -2] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <motion.circle cx="16" cy="70" r="2" fill="#fb7185" animate={{ scale: [0.8, 1.3, 0.8] }} transition={{ duration: 2.1, repeat: Infinity }} />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAHALAYA / GENERAL PUJO DOODLE: Kaash Phool & Divine Chokkhudan Eyes
// ─────────────────────────────────────────────────────────────────────────────
export const MahalayaDoodle: React.FC<{ size?: number; animated?: boolean }> = ({ size = 96, animated = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)]"
      initial={animated ? { scale: 0.95 } : undefined}
      animate={animated ? { scale: [ 0.95, 1.03, 0.95 ] } : undefined}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="mah-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      {/* Autumn Dawn Sky Halo */}
      <circle cx="60" cy="60" r="48" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

      {/* Kaash Phool (White Autumn Feather Grass) */}
      <g transform="translate(15, 25)">
        <path d="M 8 70 Q 14 35 24 15" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 24 15 Q 18 10 14 6 M 24 15 Q 30 8 34 4 M 22 18 Q 14 14 10 10 M 26 18 Q 32 12 36 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <path d="M 23 24 Q 15 20 12 16 M 25 24 Q 33 18 37 14" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g transform="translate(75, 30)">
        <path d="M 30 65 Q 24 35 14 18" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 14 18 Q 20 12 24 8 M 14 18 Q 8 10 4 6 M 16 22 Q 24 16 28 12 M 12 22 Q 6 16 2 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Maa Durga Divine Eyes (Chokkhudan) */}
      <g transform="translate(26, 45)">
        {/* Left Eye */}
        <path d="M 4 14 C 12 6, 24 6, 30 14 C 24 20, 12 20, 4 14 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
        <circle cx="17" cy="14" r="3.5" fill="#000000" />
        <circle cx="18" cy="13" r="1" fill="#ffffff" />
        <path d="M 2 13 C 12 4, 22 4, 32 13" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Right Eye */}
        <path d="M 38 14 C 46 6, 58 6, 64 14 C 58 20, 46 20, 38 14 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
        <circle cx="51" cy="14" r="3.5" fill="#000000" />
        <circle cx="52" cy="13" r="1" fill="#ffffff" />
        <path d="M 36 13 C 46 4, 56 4, 66 13" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Third Eye & Chandrabindu */}
        <path d="M 34 2 C 32 -4, 36 -4, 34 -10 C 36 -4, 32 -4, 34 2 Z" fill="#dc2626" stroke="#ffd700" strokeWidth="0.8" />
        <circle cx="34" cy="-4" r="1.5" fill="#ffd700" />
      </g>

      {/* Floating Autumn Stars */}
      <motion.circle cx="60" cy="18" r="2.5" fill="#ffd700" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Master Unified Day Theme Doodle Component
// ─────────────────────────────────────────────────────────────────────────────
export const DayThemeDoodle: React.FC<DayDoodleProps> = ({
  dayId,
  className = '',
  size = 'md',
  animated = true
}) => {
  const pixelSize = {
    xs: 32,
    sm: 48,
    md: 84,
    lg: 110,
    xl: 140
  }[size];

  const normalized = (dayId || '').toLowerCase().trim();

  if (normalized.includes('shashti') || normalized.includes('sashti') || normalized === '6') {
    return <div className={"inline-flex items-center justify-center " + className}><ShashtiDoodle size={pixelSize} animated={animated} /></div>;
  }
  if (normalized.includes('saptami') || normalized === '7') {
    return <div className={"inline-flex items-center justify-center " + className}><SaptamiDoodle size={pixelSize} animated={animated} /></div>;
  }
  if (normalized.includes('ashtami') || normalized === '8') {
    return <div className={"inline-flex items-center justify-center " + className}><AshtamiDoodle size={pixelSize} animated={animated} /></div>;
  }
  if (normalized.includes('navami') || normalized.includes('nabami') || normalized === '9') {
    return <div className={"inline-flex items-center justify-center " + className}><NavamiDoodle size={pixelSize} animated={animated} /></div>;
  }
  if (normalized.includes('dashami') || normalized.includes('dasami') || normalized.includes('bijoya') || normalized === '10') {
    return <div className={"inline-flex items-center justify-center " + className}><DashamiDoodle size={pixelSize} animated={animated} /></div>;
  }
  
  // Default: Mahalaya / Devi Trinayani
  return <div className={"inline-flex items-center justify-center " + className}><MahalayaDoodle size={pixelSize} animated={animated} /></div>;
};
