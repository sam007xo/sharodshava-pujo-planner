import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Sparkles, Clock, Navigation, ExternalLink, Users, Send, Check, Route } from 'lucide-react';
import type { FestivalDay, FestivalConfig, PandalPlace } from '../config/festivalConfig';
import { useLocation } from '../context/LocationContext';
import { useSocial } from '../context/SocialContext';

interface DayDetailsModalProps {
  day: FestivalDay | null;
  isOpen: boolean;
  onClose: () => void;
  festival: FestivalConfig;
  onOpenPlanTrip?: (pandals?: PandalPlace[]) => void;
  onOpenSocialHub?: () => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  day,
  isOpen,
  onClose,
  festival,
  onOpenPlanTrip,
  onOpenSocialHub
}) => {
  const { calculateDistance } = useLocation();
  const { friends, sendJoinRequest } = useSocial();
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!day) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Frosted Glass Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl glass-panel border border-white/15 p-6 sm:p-8 shadow-2xl z-10 my-auto overflow-hidden text-left"
          >
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 text-[11px] font-mono text-[#f4e5a9] uppercase tracking-wider">
                    {day.ordinalLabel}
                  </span>
                  <span className="text-xs text-white/40 font-mono">
                    {day.displayDate} {festival.year}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>{day.name}</span>
                  {day.bengaliName && (
                    <span className="text-lg font-serif text-white/40 font-normal">
                      • {day.bengaliName}
                    </span>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-[#f4e5a9]/85 mt-1 font-medium">
                  {day.significance}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Sections */}
            <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {/* Key Rituals */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-white/40 mb-3 flex items-center gap-2">
                  <Clock size={13} className="text-[#d4af37]" />
                  Sacred Rituals & Timings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {day.rituals.map((ritual, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs font-medium text-white/90"
                    >
                      {ritual}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-white/40 mb-3 flex items-center gap-2">
                  <Sparkles size={13} className="text-[#d4af37]" />
                  Day Highlights & Experiences
                </h4>
                <div className="space-y-2">
                  {day.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs sm:text-sm text-white/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Places / Pandals */}
              {day.places && day.places.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs uppercase tracking-wider font-mono text-white/40 flex items-center gap-2">
                      <MapPin size={13} className="text-[#d4af37]" />
                      Recommended Pandals & Zones
                    </h4>
                    <span className="text-[10px] font-mono text-[#f4e5a9]/70">
                      Calculated from your location
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {day.places.map((place, idx) => {
                      const dist = calculateDistance(place.lat, place.lng);
                      const distLabel = dist !== null 
                        ? (dist < 1 ? `${Math.round(dist * 1000)} m away` : `${dist} km away`) 
                        : null;
                      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/15 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-white">{place.name}</span>
                              <span className="text-[10px] text-white/40 font-mono px-2 py-0.5 rounded bg-white/5">
                                {place.zone}
                              </span>
                            </div>
                            <p className="text-xs text-[#f4e5a9]/70 mb-1.5">{place.vibe}</p>
                            <p className="text-[11px] text-white/40 mb-3">{place.address}</p>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs font-mono font-medium text-[#f4e5a9]">
                              {distLabel ? `📍 ${distLabel}` : '📍 Kolkata'}
                            </span>
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#d4af37]/25 text-[11px] font-medium text-white hover:text-[#f4e5a9] transition-all flex items-center gap-1 border border-white/10"
                            >
                              <Navigation size={10} className="text-[#d4af37]" />
                              <span>Directions</span>
                              <ExternalLink size={8} className="opacity-60" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Devotees & Friends Section */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#d4af37]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                      <Users size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Friends & Devotees ({friends.length})
                      </h4>
                      <p className="text-[10px] text-white/50">
                        Connect with friends planning for {day.name}
                      </p>
                    </div>
                  </div>

                  {onOpenSocialHub && (
                    <button
                      onClick={onOpenSocialHub}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-[#f4e5a9] font-medium transition-all cursor-pointer"
                    >
                      Social Hub →
                    </button>
                  )}
                </div>

                {friends.length === 0 ? (
                  <div className="py-4 text-center text-white/40 text-xs border border-dashed border-white/10 rounded-xl space-y-1">
                    <p className="font-semibold text-white/70">No friends on route yet</p>
                    <p className="text-[10px] text-white/40">Share this day's plan with your friends to coordinate hopping together!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-[#d4af37]/40 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-9 h-9 rounded-xl object-cover border border-[#d4af37]/40"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0b0d13]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate">{friend.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">
                                {friend.zone}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/50 truncate flex items-center gap-1">
                              <MapPin size={9} className="text-[#d4af37]" />
                              {friend.currentPandal}
                            </p>
                          </div>
                        </div>

                        {requestSuccess === friend.name ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/40 shrink-0">
                            <Check size={10} />
                            <span>Sent!</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              sendJoinRequest(friend, `Hey ${friend.name.split(' ')[0]}! Are you hopping for ${day.name}? Let's join routes!`);
                              setRequestSuccess(friend.name);
                              setTimeout(() => setRequestSuccess(null), 1800);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#d4af37] hover:bg-[#e6ca65] text-black text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-sm"
                          >
                            <Send size={10} />
                            <span>Invite</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
              {onOpenPlanTrip && day.places && day.places.length > 0 && (
                <button
                  onClick={() => onOpenPlanTrip(day.places)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#e6ca65] hover:to-[#d4af37] text-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Route size={14} />
                  <span>Plan {day.name} Route in Trip Planner →</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all ml-auto cursor-pointer"
              >
                Close
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
