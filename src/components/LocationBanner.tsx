import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

interface LocationBannerProps {
  onOpenNearbyModal: () => void;
}

export const LocationBanner: React.FC<LocationBannerProps> = ({ onOpenNearbyModal }) => {
  const { permissionState, locality, closestPandal, requestLocation } = useLocation();

  if (permissionState === 'granted') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto px-3 sm:px-4 mt-16 sm:mt-20 mb-1 sm:mb-2"
      >
        <div className="p-2 sm:px-4 sm:py-2 rounded-2xl bg-black/40 hover:bg-black/50 border border-white/15 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-2 text-xs transition-all shadow-glass-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-white/70 text-[11px] sm:text-xs">
              Your Location: <strong className="text-white font-medium">{locality || 'Detected'}</strong>
            </span>
            {closestPandal && closestPandal.distanceKm !== null && (
              <span className="hidden sm:inline text-[#f4e5a9] font-mono">
                • Nearest Pandal: {closestPandal.name} ({closestPandal.formattedDistance})
              </span>
            )}
          </div>

          <button
            onClick={onOpenNearbyModal}
            className="px-2.5 py-1 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-[#f4e5a9] font-medium text-[11px] flex items-center gap-1 transition-all"
          >
            <Compass size={12} />
            <span>View All Nearby Pandals</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full max-w-4xl mx-auto px-3 sm:px-4 mt-16 sm:mt-20 mb-1 sm:mb-2"
      >
        <div className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl backdrop-blur-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs transition-all ${
          permissionState === 'denied'
            ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
            : 'bg-black/45 border-[#d4af37]/35 text-[#f4e5a9]'
        }`}>
          <div className="flex items-center gap-2.5">
            {permissionState === 'denied' ? (
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
            ) : (
              <MapPin size={16} className="text-[#d4af37] animate-bounce shrink-0" />
            )}
            <div>
              <span className="font-semibold text-white">
                {permissionState === 'denied' ? 'Location Access Blocked' : 'Always Take Location Permission'}
              </span>
              <p className="text-[11px] text-white/70">
                {permissionState === 'denied'
                  ? 'Enable location in your browser address bar to view nearest pandals and real-time routes.'
                  : 'Allow location access to automatically find pandals near you and calculate distance.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={requestLocation}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-glass-sm"
            >
              <Navigation size={12} className={permissionState === 'requesting' ? 'animate-spin' : ''} />
              <span>{permissionState === 'denied' ? 'Retry Permission' : 'Allow Location'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
