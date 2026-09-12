import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Hardware-accelerated Kolkata Durga Puja Background Image */}
      <div 
        className="absolute inset-0 w-full h-full transform-gpu"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      >
        {/* Mobile Background (Vertical Portrait Artwork) */}
        <img
          src="/durga_puja_bg_mobile.jpg"
          alt="Durga Puja Kolkata Street Pandal - Mobile"
          loading="eager"
          decoding="async"
          className="block sm:hidden w-full h-full object-cover object-center filter brightness-[0.52] contrast-[1.08] saturate-[1.1]"
        />

        {/* Laptop / Desktop Background (Wide Landscape Artwork) */}
        <img
          src="/durga_puja_bg.jpg"
          alt="Durga Puja Kolkata Street Pandal - Desktop"
          loading="eager"
          decoding="async"
          className="hidden sm:block w-full h-full object-cover object-center filter brightness-[0.58] contrast-[1.06] saturate-[1.08]"
        />
      </div>

      {/* Dimmed Atmospheric Dark Overlays for High Contrast & High Performance */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06070a]/90 via-[#06070a]/45 to-[#06070a]/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-[#06070a]/60 pointer-events-none" />
      
      {/* Lightweight GPU-composited Festive Radial Ambient Glows (Optimized CSS) */}
      <div
        className="absolute w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full opacity-[0.18] pointer-events-none animate-pulse-slow transform-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 75%)',
          bottom: '5%',
          right: '15%',
          filter: 'blur(80px)',
          transform: 'translateZ(0)',
        }}
      />

      <div
        className="absolute w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full opacity-[0.12] pointer-events-none animate-pulse-slow transform-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(153, 27, 27, 0.4) 0%, rgba(69, 10, 10, 0.1) 60%, transparent 80%)',
          top: '15%',
          left: '10%',
          filter: 'blur(75px)',
          transform: 'translateZ(0)',
          animationDelay: '3s',
        }}
      />

      {/* Subtle Lightweight Dot Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Hardware-accelerated Floating Golden Festive Embers (CSS Keyframe Driven) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#fde047] pointer-events-none animate-float-ember"
            style={{
              width: i % 2 === 0 ? '3px' : '2px',
              height: i % 2 === 0 ? '3px' : '2px',
              left: `${12 + (i * 11) % 76}%`,
              bottom: `${10 + (i * 9) % 40}%`,
              opacity: 0.4 + (i % 2) * 0.2,
              boxShadow: '0 0 6px 1.5px rgba(234, 179, 8, 0.6)',
              animationDuration: `${7 + (i % 3) * 2.5}s`,
              animationDelay: `${i * 0.8}s`,
              transform: 'translateZ(0)',
            }}
          />
        ))}
      </div>
    </div>
  );
};
