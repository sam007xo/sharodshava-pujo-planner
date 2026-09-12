import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, MapPin, Compass, ExternalLink, RefreshCw } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

interface NearbyPandalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NearbyPandalsModal: React.FC<NearbyPandalsModalProps> = ({ isOpen, onClose }) => {
  const { 
    coordinates, 
    locality, 
    permissionState, 
    requestLocation, 
    nearestPandals, 
    errorMessage 
  } = useLocation();

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-3xl glass-panel border border-white/15 p-6 sm:p-8 shadow-2xl z-10 my-auto overflow-hidden text-left"
        >
          {/* Top highlight & glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="p-1 rounded-lg bg-[#d4af37]/15 text-[#f4e5a9]">
                  <Compass size={16} />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#f4e5a9] font-medium">
                  Location & Proximity Guide
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Durga Puja Pandals Near You
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Real-time distances and navigation routes from your current position.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Location Status Card */}
          <div className="my-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                permissionState === 'granted' 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                  : permissionState === 'denied' 
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse'
              }`}>
                <MapPin size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    {permissionState === 'granted' ? 'Your Current Location' : 'Location Permission Needed'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    permissionState === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : permissionState === 'denied'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {permissionState.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">
                  {permissionState === 'granted' 
                    ? (locality || `${coordinates?.latitude.toFixed(4)}°N, ${coordinates?.longitude.toFixed(4)}°E`) 
                    : (errorMessage || 'Please allow location permission to view distances.')}
                </p>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={requestLocation}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white flex items-center gap-1.5 transition-all self-stretch sm:self-auto justify-center"
            >
              <RefreshCw size={12} className={permissionState === 'requesting' ? 'animate-spin' : ''} />
              <span>{permissionState === 'granted' ? 'Update Location' : 'Allow Location'}</span>
            </button>
          </div>

          {/* List of Pandals sorted by distance */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {nearestPandals.map((pandal, idx) => (
              <div
                key={pandal.name}
                className={`p-4 rounded-2xl transition-all border ${
                  idx === 0 && permissionState === 'granted'
                    ? 'bg-[#d4af37]/10 border-[#d4af37]/30 shadow-glass-sm'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.08]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-white">
                        {pandal.name}
                      </span>
                      {idx === 0 && permissionState === 'granted' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#d4af37] text-black font-semibold text-[10px] uppercase tracking-wider">
                          Nearest Pandal
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 font-mono">
                        {pandal.zone}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f4e5a9] font-mono">
                        {pandal.dayName}
                      </span>
                    </div>

                    <p className="text-xs text-[#f4e5a9]/80 mb-1.5">
                      {pandal.vibe}
                    </p>
                    <p className="text-[11px] text-white/40 flex items-center gap-1">
                      <MapPin size={11} className="text-white/30" />
                      {pandal.address}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-semibold font-mono text-[#f4e5a9]">
                        {pandal.distanceKm !== null ? pandal.formattedDistance : '—'}
                      </span>
                    </div>

                    <a
                      href={pandal.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#d4af37]/30 border border-white/15 hover:border-[#d4af37]/40 text-[11px] font-medium text-white hover:text-[#f4e5a9] transition-all flex items-center gap-1"
                    >
                      <Navigation size={11} className="text-[#d4af37]" />
                      <span>Directions</span>
                      <ExternalLink size={9} className="opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/40 font-mono">
              Auto-calibrated with GPS coordinates
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
