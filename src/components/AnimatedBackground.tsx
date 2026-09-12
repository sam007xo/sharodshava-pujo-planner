import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Responsive Illustrated Kolkata Durga Puja Background (Portrait for Mobile, Landscape for Laptop) */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.02 }}
        animate={{ scale: [1.02, 1.05, 1.02] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Mobile Background (Vertical Portrait Artwork) */}
        <img
          src="/durga_puja_bg_mobile.jpg"
          alt="Durga Puja Kolkata Street Pandal - Mobile"
          className="block sm:hidden w-full h-full object-cover object-center filter brightness-[0.52] contrast-[1.12] saturate-[1.15]"
        />

        {/* Laptop / Desktop Background (Wide Landscape Artwork) */}
        <img
          src="/durga_puja_bg.jpg"
          alt="Durga Puja Kolkata Street Pandal - Desktop"
          className="hidden sm:block w-full h-full object-cover object-center filter brightness-[0.58] contrast-[1.08] saturate-[1.1]"
        />
      </motion.div>

      {/* Dimmed Atmospheric Dark Overlays for High Contrast & Frosted Glass Look */}
      <div className="absolute inset-0 bg-black/50 sm:bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06070a]/90 via-[#06070a]/40 to-[#06070a]/92 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-[#06070a]/60 pointer-events-none" />
      
      {/* Warm festive radial glow behind central hero */}
      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full blur-[140px] opacity-[0.25] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, #b45309 45%, transparent 75%)',
          bottom: '10%',
          right: '20%',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.32, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle crimson aura representing Devi Durga's sindoor & pandal tapestry */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.16] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #991b1b 0%, #450a0a 55%, transparent 80%)',
          top: '20%',
          left: '15%',
        }}
        animate={{
          scale: [0.95, 1.1, 0.95],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Procedural Micro-Noise Texture for photorealistic frosted glass backdrop */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating golden festival embers (incense/pradeep sparks) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#fde047] pointer-events-none"
            style={{
              width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '4px',
              height: i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '4px',
              left: `${8 + (i * 6.8) % 86}%`,
              top: `${50 + (i * 8) % 45}%`,
              opacity: 0.3 + (i % 3) * 0.15,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 8px 2px rgba(234, 179, 8, 0.55)',
            }}
            animate={{
              y: [0, -160 - (i % 5) * 30],
              x: [0, (i % 2 === 0 ? 25 : -25)],
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 0.6],
            }}
            transition={{
              duration: 6 + (i % 4) * 2.2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};
