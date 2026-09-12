import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Navigation, 
  Compass, 
  Sparkles, 
  Calendar, 
  ExternalLink,
  Map as MapIcon
} from 'lucide-react';
import { 
  DURGA_PUJA_2026, 
  KOLKATA_ZONES, 
  type FestivalDay, 
  type PandalPlace
} from '../config/festivalConfig';
import { useLocation } from '../context/LocationContext';

interface KolkataTypographyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDayId?: string | null;
  onSelectDay?: (day: FestivalDay) => void;
}

type ZoneId = 'all' | 'north' | 'central' | 'south';

export const KolkataTypographyMapModal: React.FC<KolkataTypographyMapModalProps> = ({
  isOpen,
  onClose,
  initialDayId,
  onSelectDay
}) => {
  const [selectedZone, setSelectedZone] = useState<ZoneId>('all');
  const [selectedDayId, setSelectedDayId] = useState<string | 'all'>('all');
  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);

  const { calculateDistance } = useLocation();

  // Sync initial day when opened
  useEffect(() => {
    if (initialDayId) {
      setSelectedDayId(initialDayId);
    } else {
      setSelectedDayId('all');
    }
  }, [initialDayId, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // All pandals across days or filtered by selected day
  const filteredPlaces = useMemo(() => {
    interface EnrichedPlace extends PandalPlace {
      dayName: string;
      dayBengaliName?: string;
      dayId: string;
      distanceKm: number | null;
      formattedDistance: string;
      directionsUrl: string;
    }

    const places: EnrichedPlace[] = [];
    const daysToScan = selectedDayId === 'all' 
      ? DURGA_PUJA_2026.days 
      : DURGA_PUJA_2026.days.filter(d => d.id === selectedDayId);

    daysToScan.forEach(day => {
      day.places?.forEach(place => {
        // Zone filtering
        if (selectedZone !== 'all') {
          const zoneKey = selectedZone.toLowerCase();
          if (!place.zone.toLowerCase().includes(zoneKey)) {
            return;
          }
        }

        const dist = calculateDistance(place.lat, place.lng);
        const formattedDistance = dist !== null 
          ? (dist < 1 ? `${Math.round(dist * 1000)} m away` : `${dist} km away`) 
          : 'Live distance ready';

        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

        places.push({
          ...place,
          dayName: day.name,
          dayBengaliName: day.bengaliName,
          dayId: day.id,
          distanceKm: dist,
          formattedDistance,
          directionsUrl
        });
      });
    });

    // Sort by distance if available
    return places.sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });
  }, [selectedZone, selectedDayId, calculateDistance]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Main Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl rounded-3xl glass-panel border border-white/15 p-5 sm:p-7 shadow-2xl z-10 my-auto overflow-hidden text-left max-h-[92vh] flex flex-col"
        >
          {/* Top aesthetic accent line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <MapIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold tracking-widest text-[#d4af37] uppercase">
                    Kolkata Site Picker
                  </span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-white/60 text-xs font-serif">কলকাতা দর্শন</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Typography Map of Kolkata
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Date Selector Filter Bar */}
          <div className="py-3 shrink-0 border-b border-white/10">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                <Calendar size={13} className="text-[#d4af37]" />
                <span>Select Festival Date:</span>
              </div>
              {selectedDayId !== 'all' && (
                <button
                  onClick={() => setSelectedDayId('all')}
                  className="text-[11px] text-[#d4af37] hover:underline cursor-pointer"
                >
                  Show all dates
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedDayId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedDayId === 'all'
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-black font-semibold shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                }`}
              >
                All Days
              </button>

              {DURGA_PUJA_2026.days.map((day) => {
                const isSelected = selectedDayId === day.id;
                return (
                  <button
                    key={day.id}
                    onClick={() => {
                      setSelectedDayId(day.id);
                      if (onSelectDay) onSelectDay(day);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-black font-semibold shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                    }`}
                  >
                    <span>{day.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-black/70' : 'text-white/40'}`}>
                      {day.displayDate.split(' ')[0]} Oct
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Body: Split view (Typography Map on Left/Top + Sites listing on Right/Bottom) */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 py-4 pr-1">
            
            {/* Left Col: Interactive Typography Map */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-white/80 uppercase flex items-center gap-1.5">
                  <Compass size={14} className="text-[#d4af37]" />
                  <span>Interactive Typography Map</span>
                </span>
                <span className="text-[11px] text-white/50">
                  Tap any zone to explore
                </span>
              </div>

              {/* The Typography Map Visual Board */}
              <div className="relative w-full rounded-2xl bg-black/40 border border-white/15 p-4 overflow-hidden select-none">
                
                {/* Background Grid & Kolkata Watermark */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-[0.06] text-6xl sm:text-7xl font-extrabold tracking-widest text-white rotate-90 pointer-events-none font-serif">
                  KOLKATA
                </div>

                {/* Hooghly River Flow (Left Vertical Strip Typography) */}
                <div className="absolute left-1 top-2 bottom-2 w-7 sm:w-8 flex flex-col items-center justify-between border-r border-cyan-500/20 bg-cyan-950/20 rounded-l-xl py-2 overflow-hidden pointer-events-none">
                  <div className="text-[8px] sm:text-[9px] font-mono tracking-widest text-cyan-400/70 [writing-mode:vertical-rl] rotate-180 uppercase flex items-center gap-2">
                    <span>~ ~ ~ HOOGHLY RIVER • গঙ্গা নদী • HOWRAH BRIDGE • BABU GHAT • VIDYASAGAR SETU ~ ~ ~</span>
                  </div>
                </div>

                {/* Main Typography Map Body (North, Central, South) */}
                <div className="pl-8 sm:pl-9 space-y-3">
                  
                  {/* ZONE 1: NORTH KOLKATA */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedZone(selectedZone === 'north' ? 'all' : 'north')}
                    onHoverStart={() => setHoveredZone('north')}
                    onHoverEnd={() => setHoveredZone(null)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      selectedZone === 'north'
                        ? 'bg-amber-500/15 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : hoveredZone === 'north'
                        ? 'bg-amber-500/10 border-amber-400/30'
                        : 'bg-white/[0.03] border-white/10 hover:border-amber-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                        <h3 className="text-base sm:text-lg font-bold tracking-tight text-amber-200">
                          NORTH KOLKATA
                        </h3>
                        <span className="text-xs font-serif text-amber-300/80">
                          উত্তর কলকাতা
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${
                        selectedZone === 'north'
                          ? 'bg-amber-400 text-black border-amber-400 font-bold'
                          : 'text-amber-300 border-amber-400/30 bg-amber-500/10'
                      }`}>
                        {selectedZone === 'north' ? 'Selected' : 'Select'}
                      </span>
                    </div>

                    {/* North Kolkata Word Cloud / Typography Form */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] sm:text-xs font-medium leading-relaxed">
                      <span className="text-amber-100 font-semibold">BAGBAZAR</span>
                      <span className="text-white/40">•</span>
                      <span className="text-amber-300">KUMARTULI</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/90">SOVABAZAR RAJBARI</span>
                      <span className="text-white/40">•</span>
                      <span className="text-amber-200/80">SHYAMBAZAR</span>
                      <span className="text-white/40">•</span>
                      <span className="text-amber-400">TALA PRATTOY</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/70">HATIBAGAN</span>
                      <span className="text-white/40">•</span>
                      <span className="text-amber-300/90">BONEDI BARI</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/60">HERITAGE TRAMWAYS</span>
                      <span className="text-white/40">•</span>
                      <span className="text-amber-200">SABEKI PRATIMA</span>
                    </div>
                  </motion.div>

                  {/* ZONE 2: CENTRAL KOLKATA */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedZone(selectedZone === 'central' ? 'all' : 'central')}
                    onHoverStart={() => setHoveredZone('central')}
                    onHoverEnd={() => setHoveredZone(null)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      selectedZone === 'central'
                        ? 'bg-pink-500/15 border-pink-400/60 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
                        : hoveredZone === 'central'
                        ? 'bg-pink-500/10 border-pink-400/30'
                        : 'bg-white/[0.03] border-white/10 hover:border-pink-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_8px_#ec4899]" />
                        <h3 className="text-base sm:text-lg font-bold tracking-tight text-pink-200">
                          CENTRAL KOLKATA
                        </h3>
                        <span className="text-xs font-serif text-pink-300/80">
                          মধ্য কলকাতা
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${
                        selectedZone === 'central'
                          ? 'bg-pink-400 text-black border-pink-400 font-bold'
                          : 'text-pink-300 border-pink-400/30 bg-pink-500/10'
                      }`}>
                        {selectedZone === 'central' ? 'Selected' : 'Select'}
                      </span>
                    </div>

                    {/* Central Kolkata Word Cloud / Typography Form */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] sm:text-xs font-medium leading-relaxed">
                      <span className="text-pink-100 font-semibold">COLLEGE SQUARE</span>
                      <span className="text-white/40">•</span>
                      <span className="text-pink-300">MOHAMMAD ALI PARK</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/90">SANTOSH MITRA SQ</span>
                      <span className="text-white/40">•</span>
                      <span className="text-pink-200/80">ESPLANADE</span>
                      <span className="text-white/40">•</span>
                      <span className="text-pink-400">BABU GHAT</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/70">BOWBAZAR</span>
                      <span className="text-white/40">•</span>
                      <span className="text-pink-300/90">B.B.D. BAGH</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/60">CHANDNI CHOWK</span>
                      <span className="text-white/40">•</span>
                      <span className="text-pink-200">WATER ILLUMINATION</span>
                    </div>
                  </motion.div>

                  {/* ZONE 3: SOUTH KOLKATA */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedZone(selectedZone === 'south' ? 'all' : 'south')}
                    onHoverStart={() => setHoveredZone('south')}
                    onHoverEnd={() => setHoveredZone(null)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      selectedZone === 'south'
                        ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        : hoveredZone === 'south'
                        ? 'bg-cyan-500/10 border-cyan-400/30'
                        : 'bg-white/[0.03] border-white/10 hover:border-cyan-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                        <h3 className="text-base sm:text-lg font-bold tracking-tight text-cyan-200">
                          SOUTH KOLKATA
                        </h3>
                        <span className="text-xs font-serif text-cyan-300/80">
                          দক্ষিণ কলকাতা
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${
                        selectedZone === 'south'
                          ? 'bg-cyan-400 text-black border-cyan-400 font-bold'
                          : 'text-cyan-300 border-cyan-400/30 bg-cyan-500/10'
                      }`}>
                        {selectedZone === 'south' ? 'Selected' : 'Select'}
                      </span>
                    </div>

                    {/* South Kolkata Word Cloud / Typography Form */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] sm:text-xs font-medium leading-relaxed">
                      <span className="text-cyan-100 font-semibold">MADDOX SQUARE</span>
                      <span className="text-white/40">•</span>
                      <span className="text-cyan-300">EKDALIA EVERGREEN</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/90">BALLYGUNGE CULTURAL</span>
                      <span className="text-white/40">•</span>
                      <span className="text-cyan-200/80">SURUCHI SANGHA</span>
                      <span className="text-white/40">•</span>
                      <span className="text-cyan-400">TRIDHARA SAMMILANI</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/70">MUDIALI CLUB</span>
                      <span className="text-white/40">•</span>
                      <span className="text-cyan-300/90">GARIAHAT</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/60">NEW ALIPORE</span>
                      <span className="text-white/40">•</span>
                      <span className="text-cyan-200">GRAND CHANDELIERS</span>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* Zone Filter Quick Pills */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-white/50 font-medium">Filter Zone:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setSelectedZone('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedZone === 'all'
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    All Kolkata
                  </button>
                  {KOLKATA_ZONES.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id as ZoneId)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedZone === zone.id
                          ? `${zone.accentBg} text-white border ${zone.borderColor}`
                          : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                      }`}
                    >
                      {zone.name.replace(' Kolkata', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Pandals & Sites for the selected part of Kolkata */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                    Iconic Sites & Pandals
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/80 font-mono">
                    {filteredPlaces.length}
                  </span>
                </div>
                <div className="text-[11px] text-white/50">
                  {selectedZone === 'all' ? 'All parts of Kolkata' : `${selectedZone.toUpperCase()} Kolkata`}
                  {selectedDayId !== 'all' ? ` • ${selectedDayId}` : ''}
                </div>
              </div>

              {/* Pandals List Container */}
              <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
                {filteredPlaces.length === 0 ? (
                  <div className="py-12 text-center text-white/50 space-y-2">
                    <Compass className="mx-auto text-white/30" size={32} />
                    <p className="text-sm">No pandals matching this zone and day combination.</p>
                    <button
                      onClick={() => { setSelectedZone('all'); setSelectedDayId('all'); }}
                      className="text-xs text-[#d4af37] underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  filteredPlaces.map((place, idx) => {
                    const isNorth = place.zone.toLowerCase().includes('north');
                    const isCentral = place.zone.toLowerCase().includes('central');
                    const badgeBg = isNorth 
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                      : isCentral 
                      ? 'bg-pink-500/15 text-pink-300 border-pink-500/30' 
                      : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';

                    return (
                      <motion.div
                        key={`${place.name}-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="group relative rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#d4af37]/40 p-4 transition-all duration-300 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-semibold text-white group-hover:text-[#f4e5a9] transition-colors">
                                {place.name}
                              </h4>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badgeBg}`}>
                                {place.zone}
                              </span>
                              {place.dayBengaliName && (
                                <span className="text-[10px] text-white/50 font-serif">
                                  {place.dayBengaliName}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-white/70 italic flex items-center gap-1.5">
                              <Sparkles size={11} className="text-[#d4af37]" />
                              <span>{place.vibe}</span>
                            </p>

                            <p className="text-[11px] text-white/40 flex items-center gap-1">
                              <MapPin size={10} className="shrink-0" />
                              <span className="truncate max-w-[280px] sm:max-w-[340px]">{place.address}</span>
                            </p>
                          </div>

                          {/* Distance & Action */}
                          <div className="flex flex-col items-end shrink-0 space-y-2">
                            <span className="text-xs font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-lg border border-[#d4af37]/20 whitespace-nowrap">
                              {place.formattedDistance}
                            </span>

                            <a
                              href={place.directionsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#d4af37] text-white hover:text-black text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Navigation size={12} />
                              <span>Directions</span>
                              <ExternalLink size={10} className="opacity-70" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
            <span className="flex items-center gap-1.5">
              <Compass size={13} className="text-[#d4af37]" />
              <span>Explore Kolkata by part: North, Central & South</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
