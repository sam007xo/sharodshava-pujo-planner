import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, LogOut, SlidersHorizontal, MapPin, Home, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

interface NavbarProps {
  onGoHome: () => void;
  onOpenInfo: () => void;
  onOpenNearby: () => void;
  onOpenSocialHub?: () => void;
  simulatedDate: string | null;
  onSelectSimulatedDate: (dateStr: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onGoHome,
  onOpenInfo, 
  onOpenNearby,
  onOpenSocialHub,
  simulatedDate, 
  onSelectSimulatedDate 
}) => {
  const { user, logout } = useAuth();
  const { permissionState, locality, closestPandal, requestLocation } = useLocation();
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Dynamic automatic date and time ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const effectiveDate = simulatedDate ? new Date(simulatedDate + 'T' + currentDateTime.toTimeString().split(' ')[0]) : currentDateTime;

  const formattedDate = effectiveDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = effectiveDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-3 sm:px-8 py-2.5 sm:py-3.5 bg-black/40 backdrop-blur-2xl border-b border-white/10 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo & Title */}
        <div 
          onClick={onGoHome}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group shrink-0"
          title="Sharodshav — Return to Home"
        >
          <motion.div 
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#d4af37]/40 bg-black/60 backdrop-blur-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] group-hover:border-[#d4af37] transition-all p-0.5 shrink-0"
          >
            <img 
              src="/sharodshav_logo.png" 
              alt="Sharodshav Logo" 
              className="w-full h-full object-contain object-center"
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f4e5a9] via-[#d4af37] to-[#e6ca65] flex items-center gap-1.5 font-sans">
              SHARODSHAV
            </span>
            <span className="text-[9px] tracking-wider text-white/50 uppercase font-medium hidden sm:inline-block">
              Optimal Pandal Navigation
            </span>
          </div>
        </div>

        {/* Center: Dynamic Date & Live Time (Shown on medium and large screens to prevent mobile collision) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col items-center pointer-events-none">
          <div className="px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-2xl shadow-glass-sm flex items-center space-x-2 sm:space-x-3 pointer-events-auto">
            <span className="text-xs sm:text-sm font-medium tracking-tight text-white/90">
              {formattedDate}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#d4af37]/80 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#f4e5a9] font-mono">
              {formattedTime}
            </span>
          </div>

          {simulatedDate && (
            <span className="text-[9px] text-[#d4af37]/75 font-mono mt-0.5 tracking-wider uppercase">
              Preview Mode Active
            </span>
          )}
        </div>

        {/* Right: Actions (Home, Location, Simulator, Info, User) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          
          {/* Home Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoHome}
            title="Go to Home Dashboard"
            className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#d4af37]/40 text-white/90 hover:text-[#f4e5a9] backdrop-blur-xl transition-all flex items-center gap-1.5 text-xs shadow-glass-sm cursor-pointer"
          >
            <Home size={14} className="text-[#d4af37]" />
            <span className="text-[11px] font-medium">Home</span>
          </motion.button>

          {/* Location status pill */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              if (permissionState === 'granted') {
                onOpenNearby();
              } else {
                requestLocation();
              }
            }}
            title={permissionState === 'granted' ? `Location: ${locality || 'Detected'} (Click to view nearby pandals)` : 'Click to allow current location'}
            className={`px-2.5 py-1.5 rounded-full border backdrop-blur-xl transition-all flex items-center gap-1.5 text-xs ${
              permissionState === 'granted'
                ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-[#d4af37]/30 text-white/90'
                : permissionState === 'denied'
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300'
                  : 'bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border-[#d4af37]/30 text-[#f4e5a9] animate-pulse'
            }`}
          >
            <MapPin size={13} className={permissionState === 'granted' ? 'text-emerald-400' : 'text-[#d4af37]'} />
            <span className="text-[11px] font-medium max-w-[90px] sm:max-w-[120px] truncate">
              {permissionState === 'granted' 
                ? (locality ? locality.split(',')[0] : 'Kolkata')
                : permissionState === 'denied' 
                  ? 'Location Blocked' 
                  : 'Allow Location'}
            </span>
            {permissionState === 'granted' && closestPandal && closestPandal.distanceKm !== null && (
              <span className="hidden xl:inline text-[10px] text-[#f4e5a9] font-mono pl-1 border-l border-white/10">
                {closestPandal.formattedDistance}
              </span>
            )}
          </motion.button>

          {/* Simulator pill to preview all states */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSimMenu(!showSimMenu)}
              title="Test Festival Dates (Before, During, After)"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 backdrop-blur-xl transition-all flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
            >
              <SlidersHorizontal size={14} className="text-[#d4af37]" />
              <span className="hidden md:inline text-[11px] font-medium">Test Dates</span>
            </motion.button>

            {showSimMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 p-2 rounded-2xl glass-panel border border-white/15 shadow-2xl z-50 text-xs"
                onClick={() => setShowSimMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-white/40 border-b border-white/10 mb-1">
                  Timeline Simulator
                </div>
                <button
                  onClick={() => onSelectSimulatedDate(null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${!simulatedDate ? 'bg-[#d4af37]/20 text-[#f4e5a9] font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Live Today (Countdown)</span>
                  {!simulatedDate && <span className="text-[10px]">●</span>}
                </button>
                <button
                  onClick={() => onSelectSimulatedDate('2026-10-18')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${simulatedDate === '2026-10-18' ? 'bg-[#d4af37]/20 text-[#f4e5a9] font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Maha Shashti (Day 6)</span>
                  {simulatedDate === '2026-10-18' && <span className="text-[10px]">●</span>}
                </button>
                <button
                  onClick={() => onSelectSimulatedDate('2026-10-19')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${simulatedDate === '2026-10-19' ? 'bg-[#d4af37]/20 text-[#f4e5a9] font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Maha Saptami (Day 7)</span>
                  {simulatedDate === '2026-10-19' && <span className="text-[10px]">●</span>}
                </button>
                <button
                  onClick={() => onSelectSimulatedDate('2026-10-20')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${simulatedDate === '2026-10-20' ? 'bg-[#d4af37]/20 text-[#f4e5a9] font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Maha Ashtami (Day 8)</span>
                  {simulatedDate === '2026-10-20' && <span className="text-[10px]">●</span>}
                </button>
                <button
                  onClick={() => onSelectSimulatedDate('2026-10-21')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${simulatedDate === '2026-10-21' ? 'bg-[#d4af37]/20 text-[#f4e5a9] font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Maha Nabami (Day 9)</span>
                  {simulatedDate === '2026-10-21' && <span className="text-[10px]">●</span>}
                </button>
                <button
                  onClick={() => onSelectSimulatedDate('2026-10-22')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${simulatedDate === '2026-10-22' ? 'bg-[#d4af37]/20 text-[#f4e5a9] font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Vijaya Dashami (Day 10)</span>
                  {simulatedDate === '2026-10-22' && <span className="text-[10px]">●</span>}
                </button>
                <button
                  onClick={() => onSelectSimulatedDate('2026-10-25')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${simulatedDate === '2026-10-25' ? 'bg-[#d4af37]/20 text-[#f4e5a9] font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <span>Post-Pujo (Ended)</span>
                  {simulatedDate === '2026-10-25' && <span className="text-[10px]">●</span>}
                </button>
              </div>
            )}
          </div>

          {/* Friends & Chat Hub Button (Social Hub) */}
          {onOpenSocialHub && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenSocialHub}
              aria-label="Friends & Live Pujo Chats"
              title="Friend Requests & Live Pujo Chats"
              className="relative w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-sky-400/40 backdrop-blur-xl flex items-center justify-center text-white/75 hover:text-sky-300 shadow-glass-sm transition-all duration-200 cursor-pointer"
            >
              <Users size={16} />
              {/* Notification Badge */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-[#0b0d13]" />
              </span>
            </motion.button>
          )}

          {/* Info Icon (ⓘ) - Circular with glass background and hover animation */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 8 }}
            whileTap={{ scale: 0.94 }}
            onClick={onOpenInfo}
            aria-label="Application Information"
            className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#d4af37]/30 backdrop-blur-xl flex items-center justify-center text-white/75 hover:text-[#f4e5a9] shadow-glass-sm transition-all duration-200 cursor-pointer"
          >
            <Info size={16} />
          </motion.button>

          {/* User profile with dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full overflow-hidden border border-white/20 hover:border-[#d4af37]/50 transition-all p-0.5"
                title={user.displayName || 'User Profile'}
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-[#d4af37]/20 flex items-center justify-center text-xs font-semibold text-[#f4e5a9]">
                    {user.displayName ? user.displayName.charAt(0) : 'U'}
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-52 p-3 rounded-2xl glass-panel border border-white/15 shadow-2xl z-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="mb-2.5 pb-2 border-b border-white/10">
                    <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                    <p className="text-[11px] text-white/40 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-2 text-xs text-red-400/90 hover:text-red-300 py-1.5 px-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
