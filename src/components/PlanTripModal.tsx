import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Navigation,
  Sparkles,
  ExternalLink,
  Check,
  Share2,
  Clock,
  Route,
  MapPin,
  RefreshCw,
  LocateFixed,
  ChevronDown,
  ChevronUp,
  Utensils,
  Users,
  Star,
  ArrowRight,
  Send,
  SlidersHorizontal,
  ArrowUpDown,
  IndianRupee,
  RotateCcw
} from 'lucide-react';
import type { PandalPlace } from '../config/festivalConfig';
import {
  KOLKATA_SECTORS_DATA
} from '../config/kolkataSectors';
import {
  findNearestStations,
  optimizeRoute,
  calculateRouteDistance,
  type NearestStationResult
} from '../config/kolkataTransit';
import {
  getRestaurantsForZone,
  type KolkataRestaurant
} from '../config/kolkataRestaurants';
import {
  type FriendProfile
} from '../config/friendsSocialData';
import { useLocation } from '../context/LocationContext';
import { useSocial } from '../context/SocialContext';
import { useAuth } from '../context/AuthContext';
import {
  createOrUpdatePlannedTeam,
  generateTeamCode,
  type PlannedTeam
} from '../services/teamService';
import { InviteTeamModal } from './InviteTeamModal';

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDayId?: string | null;
  initialPandals?: PandalPlace[];
  onOpenSocialHub?: () => void;
}

// Top recommended pandals based on iconic status / Google reviews
const RECOMMENDED_PANDAL_NAMES = [
  'Bagbazar Sarbojanin',
  'Kumartuli Park',
  'College Square',
  'Santosh Mitra Square (Lebutala)',
  'Maddox Square',
  'Ekdalia Evergreen',
  'Suruchi Sangha'
];

export const PlanTripModal: React.FC<PlanTripModalProps> = ({
  isOpen,
  onClose,
  defaultDayId: _defaultDayId,
  initialPandals,
  onOpenSocialHub
}) => {
  const { friends, sendJoinRequest, updateUserRoute } = useSocial();

  // Form Blocks Expanded States
  const [isTimeExpanded, setIsTimeExpanded] = useState(true);
  const [isPandalsExpanded, setIsPandalsExpanded] = useState(true);

  // Helper to get formatted current time HH:mm
  const getCurrentTimeFormatted = useCallback(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, []);

  const getDefaultEndTimeFormatted = useCallback(() => {
    const now = new Date();
    now.setHours(now.getHours() + 4);
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, []);

  // Time Duration State (Start time is automatic current time, End time is chosen by user)
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [endTime, setEndTime] = useState<string>(() => getDefaultEndTimeFormatted());

  // Keep live current time synced
  useEffect(() => {
    if (isOpen) {
      setCurrentTime(getCurrentTimeFormatted());
    }
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeFormatted());
    }, 20000);
    return () => clearInterval(timer);
  }, [isOpen, getCurrentTimeFormatted]);

  // Pandal Selections
  const [selectedPandals, setSelectedPandals] = useState<PandalPlace[]>([]);
  const [activeZoneFilter, setActiveZoneFilter] = useState<'all' | 'north' | 'central' | 'south'>('all');

  // Restaurant Filter & Selected Details
  const [restaurantFilter, setRestaurantFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [priceRangeLimit, setPriceRangeLimit] = useState<number>(2000);
  const [restaurantSort, setRestaurantSort] = useState<'rating' | 'price-asc' | 'price-desc' | 'distance'>('rating');
  const [isPriceSortExpanded, setIsPriceSortExpanded] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<KolkataRestaurant | null>(null);
  const [showRestaurantsModal, setShowRestaurantsModal] = useState(false);

  // Friends & Join Request
  const [selectedFriend, setSelectedFriend] = useState<FriendProfile | null>(null);
  const [joinRequestMessage, setJoinRequestMessage] = useState('');
  const [requestSentSuccess, setRequestSentSuccess] = useState<string | null>(null);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friendsModalTab, setFriendsModalTab] = useState<'route' | 'all'>('route');

  // General Notification
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);

  // Planned Team & Custom Link Invite State
  const [isInviteTeamModalOpen, setIsInviteTeamModalOpen] = useState(false);
  const [currentPlannedTeam, setCurrentPlannedTeam] = useState<PlannedTeam | null>(null);

  const {
    coordinates,
    calculateDistance,
    permissionState,
    locality,
    requestLocation
  } = useLocation();
  const { user } = useAuth();

  // Open Team Invite with custom shareable link
  const handleOpenTeamInvite = () => {
    if (selectedPandals.length === 0) return;
    const pandalNames = selectedPandals.map(p => p.name);
    const code = generateTeamCode(activeZoneFilter === 'all' ? 'KOL' : activeZoneFilter);
    const team = createOrUpdatePlannedTeam({
      id: `team-${Date.now()}`,
      teamCode: code,
      teamName: `Pujo Hopping Squad (${selectedPandals.length} Pandals)`,
      leaderName: user?.displayName || 'Pujo Devotee',
      leaderAvatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'devotee'}`,
      leaderUid: user?.uid || 'anon-devotee',
      zone: activeZoneFilter,
      pandals: pandalNames
    });
    setCurrentPlannedTeam(team);
    setIsInviteTeamModalOpen(true);
  };

  // Reset / sync when modal opens or initialPandals change
  useEffect(() => {
    if (isOpen) {
      setIsTimeExpanded(false);
      setIsPandalsExpanded(true);
      if (initialPandals && initialPandals.length > 0) {
        setSelectedPandals(initialPandals);
      }
    }
  }, [isOpen, initialPandals]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Refresh Location
  const handleRefreshLocation = useCallback(() => {
    setIsRefreshingLocation(true);
    requestLocation();
    setTimeout(() => setIsRefreshingLocation(false), 1200);
  }, [requestLocation]);

  // Calculate Total Duration from Current Time (Automatic Start) & Selected End Time
  const durationCalculation = useMemo(() => {
    const [startH, startM] = currentTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let startTotalMins = startH * 60 + startM;
    let endTotalMins = endH * 60 + endM;

    // Handle overnight hopping (e.g. 10 PM to 4 AM)
    if (endTotalMins < startTotalMins) {
      endTotalMins += 24 * 60;
    }

    const diffMins = Math.max(15, endTotalMins - startTotalMins);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    return {
      hours,
      mins,
      totalMinutes: diffMins,
      formatted: `${hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''} ` : ''}${mins > 0 || hours === 0 ? `${mins} min` : ''}`.trim()
    };
  }, [currentTime, endTime]);

  // All available pandals from sectors
  const allPandals = useMemo(() => {
    const list: PandalPlace[] = [];
    KOLKATA_SECTORS_DATA.forEach(zone => {
      zone.sectors.forEach(sec => {
        sec.pandals.forEach(p => {
          if (!list.some(item => item.name === p.name)) {
            list.push(p);
          }
        });
      });
    });
    return list;
  }, []);

  // Filtered available pandals based on zone filter
  const displayedPandals = useMemo(() => {
    if (activeZoneFilter === 'all') return allPandals;
    return allPandals.filter(p => {
      if (activeZoneFilter === 'north') return p.zone.includes('North');
      if (activeZoneFilter === 'central') return p.zone.includes('Central');
      if (activeZoneFilter === 'south') return p.zone.includes('South');
      return true;
    });
  }, [allPandals, activeZoneFilter]);

  // Auto-Select Recommended Pandals with 1 Tap
  const handleSelectRecommendedPandals = useCallback(() => {
    const recommended = allPandals.filter(p => RECOMMENDED_PANDAL_NAMES.includes(p.name));
    setSelectedPandals(recommended);
  }, [allPandals]);

  // Toggle single pandal
  const togglePandal = useCallback((pandal: PandalPlace) => {
    setSelectedPandals(prev =>
      prev.some(p => p.name === pandal.name)
        ? prev.filter(p => p.name !== pandal.name)
        : [...prev, pandal]
    );
  }, []);

  // Route Optimization Result
  const routeResult = useMemo(() => {
    if (selectedPandals.length === 0) return null;

    const startLat = coordinates?.latitude;
    const startLng = coordinates?.longitude;

    const order = optimizeRoute(selectedPandals, startLat, startLng);
    const orderedPandals = order.map(i => selectedPandals[i]);
    const totalDistanceKm = calculateRouteDistance(selectedPandals, order, startLat, startLng);

    const perPandalVisitMin = 35;
    const totalVisitMin = orderedPandals.length * perPandalVisitMin;

    const normalTravelMin = Math.round((totalDistanceKm / 15) * 60);
    const pujoTravelMin = Math.round((totalDistanceKm / 6) * 60);

    const normalEtaMinutes = totalVisitMin + normalTravelMin;
    const pujoEtaMinutes = totalVisitMin + pujoTravelMin;

    const transitInfo = new Map<string, NearestStationResult[]>();
    for (const p of orderedPandals) {
      const nearest = findNearestStations(p.lat, p.lng, 2);
      transitInfo.set(p.name, nearest);
    }

    // Google Maps Route URL
    let googleMapsUrl = '';
    if (orderedPandals.length === 1) {
      googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${orderedPandals[0].lat},${orderedPandals[0].lng}`;
    } else {
      const origin = coordinates
        ? `${coordinates.latitude},${coordinates.longitude}`
        : `${orderedPandals[0].lat},${orderedPandals[0].lng}`;
      const destination = `${orderedPandals[orderedPandals.length - 1].lat},${orderedPandals[orderedPandals.length - 1].lng}`;
      const waypoints = orderedPandals
        .slice(coordinates ? 0 : 1, -1)
        .map(p => `${p.lat},${p.lng}`)
        .join('|');
      googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
        waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''
      }`;
    }

    // Google Maps Embed URL for In-App Viewing
    const embedOrigin = coordinates
      ? `${coordinates.latitude},${coordinates.longitude}`
      : `${orderedPandals[0].lat},${orderedPandals[0].lng}`;
    const embedMapUrl = `https://maps.google.com/maps?q=${embedOrigin}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    return {
      orderedPandals,
      totalDistanceKm,
      normalEtaMinutes,
      pujoEtaMinutes,
      perPandalVisitMin,
      transitInfo,
      googleMapsUrl,
      embedMapUrl
    };
  }, [selectedPandals, coordinates]);

  // Nearby Restaurants for selected route filtered and sorted
  const nearbyRestaurants = useMemo(() => {
    let dominantZone: 'north' | 'central' | 'south' | 'all' = 'all';
    if (activeZoneFilter !== 'all') {
      dominantZone = activeZoneFilter;
    } else if (selectedPandals.length > 0) {
      const northCount = selectedPandals.filter(p => p.zone.includes('North')).length;
      const centralCount = selectedPandals.filter(p => p.zone.includes('Central')).length;
      const southCount = selectedPandals.filter(p => p.zone.includes('South')).length;
      if (northCount >= centralCount && northCount >= southCount) dominantZone = 'north';
      else if (centralCount >= northCount && centralCount >= southCount) dominantZone = 'central';
      else dominantZone = 'south';
    }
    let list = getRestaurantsForZone(dominantZone, restaurantFilter);

    // Filter by max price limit
    if (priceRangeLimit < 2000) {
      list = list.filter(r => r.priceForTwo <= priceRangeLimit);
    }

    // Sort
    const sorted = [...list].sort((a, b) => {
      if (restaurantSort === 'price-asc') {
        return a.priceForTwo - b.priceForTwo;
      }
      if (restaurantSort === 'price-desc') {
        return b.priceForTwo - a.priceForTwo;
      }
      if (restaurantSort === 'distance') {
        const distA = calculateDistance(a.lat, a.lng) ?? 9999;
        const distB = calculateDistance(b.lat, b.lng) ?? 9999;
        return distA - distB;
      }
      // default: 'rating'
      return b.rating - a.rating;
    });

    return sorted;
  }, [activeZoneFilter, selectedPandals, restaurantFilter, priceRangeLimit, restaurantSort, calculateDistance]);

  // Real-time synchronization: Broadcast active route to database / users
  useEffect(() => {
    if (selectedPandals.length > 0) {
      const pandalNames = selectedPandals.map(p => p.name);
      let dominantZone: 'north' | 'central' | 'south' = 'south';
      if (activeZoneFilter !== 'all') {
        dominantZone = activeZoneFilter;
      } else {
        const northCount = selectedPandals.filter(p => p.zone.includes('North')).length;
        const centralCount = selectedPandals.filter(p => p.zone.includes('Central')).length;
        const southCount = selectedPandals.filter(p => p.zone.includes('South')).length;
        if (northCount >= centralCount && northCount >= southCount) dominantZone = 'north';
        else if (centralCount >= northCount && centralCount >= southCount) dominantZone = 'central';
        else dominantZone = 'south';
      }
      updateUserRoute(pandalNames, selectedPandals[0]?.name, dominantZone);
    }
  }, [selectedPandals, activeZoneFilter, updateUserRoute]);

  const selectedPandalNames = useMemo(() => new Set(selectedPandals.map(p => p.name)), [selectedPandals]);

  // Real-time friends active on the same route or in the same zone
  const friendsInRoute = useMemo(() => {
    if (!friends || friends.length === 0) return [];

    return friends.map(friend => {
      const friendPandals = friend.activeRoute || [];
      const sharedPandals = friendPandals.filter(p => selectedPandalNames.has(p));
      const isSameZone = activeZoneFilter === 'all' 
        ? true 
        : friend.zone === activeZoneFilter;
      const isAtSelectedPandal = selectedPandalNames.has(friend.currentPandal);

      return {
        ...friend,
        sharedPandals,
        sharedCount: sharedPandals.length,
        isSameZone,
        isAtSelectedPandal
      };
    }).filter(f => {
      if (selectedPandals.length > 0) {
        return f.sharedCount > 0 || f.isAtSelectedPandal || f.isSameZone;
      }
      if (activeZoneFilter !== 'all') {
        return f.zone === activeZoneFilter;
      }
      return true;
    }).sort((a, b) => {
      if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
      if (b.isAtSelectedPandal && !a.isAtSelectedPandal) return 1;
      if (a.isAtSelectedPandal && !b.isAtSelectedPandal) return -1;
      return 0;
    });
  }, [friends, selectedPandalNames, selectedPandals.length, activeZoneFilter]);

  // Send Join Request Handler (connected to global Social Hub)
  const handleSendJoinRequest = (friend: FriendProfile) => {
    sendJoinRequest(friend, joinRequestMessage);
    setRequestSentSuccess(friend.name);
    setTimeout(() => {
      setRequestSentSuccess(null);
      setSelectedFriend(null);
      setJoinRequestMessage('');
    }, 1600);
  };

  // Share itinerary
  const handleShare = async () => {
    if (!routeResult) return;
    const text = `🎉 My Sharodshav Puja Itinerary (${durationCalculation.formatted}):\n` +
      routeResult.orderedPandals.map((p, idx) => `${idx + 1}. ${p.name} (${p.zone})`).join('\n') +
      `\n\n📏 Distance: ~${routeResult.totalDistanceKm} km` +
      `\n⏱ Pujo ETA: ~${Math.round(routeResult.pujoEtaMinutes / 60)} hrs` +
      `\n\n🗺 Route: ${routeResult.googleMapsUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Pujo Route', text, url: routeResult.googleMapsUrl });
        return;
      } catch { /* fallback */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2400);
    } catch { /* ignore */ }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-3xl glass-panel border border-white/20 p-4 sm:p-6 shadow-2xl z-10 my-auto overflow-hidden text-left max-h-[94vh] flex flex-col bg-[#0b0d13]/95"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
          <div className="absolute -top-28 -right-28 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner">
                <Route size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f4e5a9] via-[#d4af37] to-[#e6ca65] uppercase font-sans">
                    SHARODSHAV • ROUTE & TRIP PLANNER
                  </span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-white/60 text-xs font-serif">পরিক্রমা পরিকল্পনা</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Plan Your Pujo Hopping & Dining
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto space-y-4 py-3.5 pr-1">

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* CURRENT LOCATION STATUS CARD                                */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="rounded-2xl bg-gradient-to-r from-white/[0.06] via-white/[0.04] to-white/[0.02] border border-[#d4af37]/35 p-3.5 sm:p-4 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
                    <LocateFixed size={20} className={isRefreshingLocation ? 'animate-spin' : ''} />
                  </div>
                  {permissionState === 'granted' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0b0d13]" />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase">Starting Point</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-medium">
                      {permissionState === 'granted' ? 'Live GPS Active' : 'Default Kolkata Center'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">
                    {locality || (coordinates ? `${coordinates.latitude.toFixed(4)}°N, ${coordinates.longitude.toFixed(4)}°E` : 'Kolkata, West Bengal')}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRefreshLocation}
                disabled={isRefreshingLocation}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#d4af37]/20 border border-white/20 text-white text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <RefreshCw size={12} className={isRefreshingLocation ? 'animate-spin text-[#d4af37]' : ''} />
                <span>{permissionState === 'granted' ? 'Refresh GPS' : 'Detect GPS'}</span>
              </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* BLOCK 1: TRIP DURATION (AUTOMATIC START TIME + END TIME)    */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.03] overflow-hidden transition-all">
              {/* Block Header / Clickable Toggle */}
              <button
                type="button"
                onClick={() => setIsTimeExpanded(prev => !prev)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-white/[0.02] cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">Step 1</span>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Select Trip Duration</span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs font-semibold text-[#f4e5a9]">
                        {durationCalculation.formatted} total
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] text-white/80 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">{currentTime} (Now)</span>
                    <span className="text-white/40">→</span>
                    <span className="text-amber-300 font-bold">{endTime}</span>
                  </span>
                  {isTimeExpanded ? <ChevronUp size={18} className="text-white/60" /> : <ChevronDown size={18} className="text-white/60" />}
                </div>
              </button>

              {/* Expandable Clock Interface */}
              <AnimatePresence>
                {isTimeExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 pt-1 border-t border-white/10 space-y-4"
                  >
                    <p className="text-xs text-white/60">
                      Start time is automatically set to your <strong>current time</strong>. Simply choose your desired <strong>end time</strong> to plan your hopping itinerary.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Start Time: Automatic Live Current Time */}
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Start Time (বেরোনোর সময়)</span>
                          </label>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                            CURRENT TIME
                          </span>
                        </div>
                        <div className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-300 font-mono text-base font-bold flex items-center justify-between">
                          <span>{currentTime}</span>
                          <span className="text-xs text-white/40 font-normal">Live Clock</span>
                        </div>
                        <span className="text-[10px] text-white/50 block">Automatically updated with current time</span>
                      </div>

                      {/* End Time Selector */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-[#d4af37]/40 space-y-2 shadow-md">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-[#d4af37] uppercase flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>Select End Time (ফেরার সময়)</span>
                          </label>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#d4af37]/20 text-[#f4e5a9]">
                            CHOOSE
                          </span>
                        </div>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-base font-bold focus:outline-none focus:border-[#d4af37] cursor-pointer"
                        />
                        <span className="text-[10px] text-white/40 block">When you want to finish and return</span>
                      </div>
                    </div>

                    {/* Quick Duration Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Quick Duration Presets:</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { label: '+2 Hours', hours: 2 },
                          { label: '+3 Hours', hours: 3 },
                          { label: '+4 Hours (Popular)', hours: 4 },
                          { label: '+6 Hours', hours: 6 },
                          { label: 'Midnight (00:00)', fixedTime: '00:00' },
                          { label: 'Night Owl (04:00 AM)', fixedTime: '04:00' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (preset.fixedTime) {
                                setEndTime(preset.fixedTime);
                              } else if (preset.hours) {
                                const now = new Date();
                                now.setHours(now.getHours() + preset.hours);
                                setEndTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/40 text-white/70 hover:text-[#f4e5a9] text-xs font-medium transition-all cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calculated Duration Banner */}
                    <div className="p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-between">
                      <span className="text-xs text-white/80 font-medium">
                        Allocated Time Budget:
                      </span>
                      <span className="text-sm font-bold text-[#f4e5a9] font-mono">
                        {durationCalculation.formatted} ({Math.max(1, Math.round(durationCalculation.totalMinutes / 45))} pandals estimated feasible)
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* BLOCK 2: CHOOSE PANDALS & GOOGLE RECOMMENDATIONS            */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.03] overflow-hidden transition-all">
              {/* Block Header */}
              <button
                type="button"
                onClick={() => setIsPandalsExpanded(prev => !prev)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-white/[0.02] cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-sky-400 uppercase">Step 2</span>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Choose Your Pandals</span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs font-semibold text-[#f4e5a9]">
                        {selectedPandals.length} selected
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRecommendedPandals();
                    }}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-black text-xs font-bold shadow-md hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Automatically check all Google-ranked iconic pandals"
                  >
                    <Sparkles size={13} />
                    <span>Select Recommended</span>
                  </button>
                  {isPandalsExpanded ? <ChevronUp size={18} className="text-white/60" /> : <ChevronDown size={18} className="text-white/60" />}
                </div>
              </button>

              {/* Expandable Pandals Chooser */}
              <AnimatePresence>
                {isPandalsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3"
                  >
                    {/* Zone Tabs */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        {(['all', 'north', 'central', 'south'] as const).map(z => (
                          <button
                            key={z}
                            onClick={() => setActiveZoneFilter(z)}
                            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              activeZoneFilter === z
                                ? 'bg-white/20 text-white border border-white/30 font-bold'
                                : 'text-white/60 hover:text-white bg-white/5 border border-white/10'
                            }`}
                          >
                            {z === 'all' ? 'All Kolkata' : z === 'north' ? 'North' : z === 'central' ? 'Central' : 'South'}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => setSelectedPandals([...displayedPandals])}
                          className="text-[#d4af37] hover:underline cursor-pointer"
                        >
                          Select All ({displayedPandals.length})
                        </button>
                        <span className="text-white/30">•</span>
                        <button
                          onClick={() => setSelectedPandals([])}
                          className="text-white/50 hover:text-white cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Pandals Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                      {displayedPandals.map((place) => {
                        const isSelected = selectedPandals.some(p => p.name === place.name);
                        const isRecommended = RECOMMENDED_PANDAL_NAMES.includes(place.name);

                        return (
                          <div
                            key={place.name}
                            onClick={() => togglePandal(place)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                              isSelected
                                ? 'bg-[#d4af37]/15 border-[#d4af37]/50 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                                : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                            }`}
                          >
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-[#f4e5a9]' : 'text-white'}`}>
                                  {place.name}
                                </h4>
                                {isRecommended && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-0.5">
                                    <Star size={9} fill="currentColor" />
                                    Top Ranked
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-white/50 truncate italic">
                                {place.vibe}
                              </p>
                            </div>

                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0 ${
                              isSelected
                                ? 'bg-[#d4af37] border-[#d4af37] text-black'
                                : 'bg-transparent border-white/30'
                            }`}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* BLOCK 3: GENERATED BEST ROUTE & STATS                       */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {routeResult && (
              <div className="rounded-2xl border border-[#d4af37]/40 bg-white/[0.04] p-4 space-y-4 shadow-xl">
                
                {/* Route Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-[#d4af37] uppercase flex items-center gap-1">
                      <Sparkles size={12} />
                      Optimized Pujo Route
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Best Traveling Order ({routeResult.orderedPandals.length} Pandals)
                    </h3>
                  </div>

                  {/* Summary Badges */}
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono text-white">
                      ~{routeResult.totalDistanceKm} km
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                      Normal: ~{Math.round(routeResult.normalEtaMinutes / 60)}h {routeResult.normalEtaMinutes % 60}m
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold">
                      Pujo ETA: ~{Math.round(routeResult.pujoEtaMinutes / 60)}h {routeResult.pujoEtaMinutes % 60}m
                    </span>
                  </div>
                </div>

                {/* Ordered Pandals Sequence */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {routeResult.orderedPandals.map((p, idx) => (
                      <React.Fragment key={p.name}>
                        <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2 shrink-0">
                          <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-white whitespace-nowrap">{p.name}</span>
                        </div>
                        {idx < routeResult.orderedPandals.length - 1 && (
                          <ArrowRight size={14} className="text-[#d4af37] shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Embedded In-App Google Map */}
                <div className="rounded-2xl overflow-hidden border border-white/15 shadow-inner bg-black/60 relative">
                  <div className="p-2.5 bg-black/70 flex items-center justify-between text-xs text-white/80 border-b border-white/10">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <MapPin size={13} className="text-red-400" />
                      In-App Google Map Navigation
                    </span>
                    <a
                      href={routeResult.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Open in Google Maps App</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <iframe
                    title="Kolkata Pujo Route Map"
                    src={routeResult.embedMapUrl}
                    width="100%"
                    height="240"
                    className="border-0 w-full"
                    loading="lazy"
                  />
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* ACTION BUTTONS: RESTAURANTS & FRIENDS ON ROUTE          */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Button: View Nearby Restaurants */}
                  <button
                    onClick={() => setShowRestaurantsModal(true)}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-orange-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-amber-500/40 text-white transition-all flex items-center justify-between cursor-pointer group shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Utensils size={18} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#f4e5a9] transition-colors">
                          View Nearby Restaurants & Food
                        </h4>
                        <span className="text-[10px] text-white/50">
                          Veg / Non-Veg menus, ratings & prices
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-[#d4af37] group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Button: View Friends in Same Route */}
                  <button
                    onClick={() => setShowFriendsModal(true)}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/20 via-indigo-500/15 to-sky-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 border border-sky-400/40 text-white transition-all flex items-center justify-between cursor-pointer group shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Users size={18} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white group-hover:text-sky-200 transition-colors">
                          Friends on the Same Route
                        </h4>
                        <span className="text-[10px] text-white/50">
                          {friendsInRoute.length} active friends nearby • Send join request
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-sky-300 group-hover:translate-x-1 transition-transform" />
                  </button>

                </div>

                {/* Final Navigation Actions */}
                <div className="flex items-center gap-2.5 pt-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={handleOpenTeamInvite}
                    className="px-4 py-3 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    title="Invite friends to this planned trip via custom link"
                  >
                    <Users size={14} />
                    <span>Invite Friends via Link</span>
                  </button>

                  <a
                    href={routeResult.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#e6ca65] hover:to-[#d4af37] text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
                  >
                    <Navigation size={14} />
                    <span>Launch Google Maps Route</span>
                  </a>

                  <button
                    onClick={handleShare}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 size={14} />
                    <span>{copiedNotification ? '✓ Copied!' : 'Share'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#d4af37]" />
              <span>Real-time duration calculator, restaurant menus & friend sync</span>
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RESTAURANTS & FOOD MENU MODAL                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showRestaurantsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl glass-panel border border-amber-500/40 p-5 shadow-2xl bg-[#0b0d13]/95 text-left max-h-[88vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Utensils size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Nearby Restaurants Along Route</h3>
                    <span className="text-[10px] text-white/50">Real-time Kolkata dining recommendations & full menus</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowRestaurantsModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Veg / Non-Veg Filters & Sort / Price Bar */}
              <div className="pt-3 pb-2 shrink-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setRestaurantFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        restaurantFilter === 'all' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      All Options
                    </button>
                    <button
                      onClick={() => setRestaurantFilter('veg')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
                        restaurantFilter === 'veg' ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'text-emerald-400/60 hover:text-emerald-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Pure Veg / Veg
                    </button>
                    <button
                      onClick={() => setRestaurantFilter('non-veg')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
                        restaurantFilter === 'non-veg' ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40' : 'text-rose-400/60 hover:text-rose-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      Non-Veg
                    </button>
                  </div>
                  <span className="text-xs text-white/40">{nearbyRestaurants.length} places</span>
                </div>

                {/* Sort & Price Range Bar Toggle */}
                <div>
                  <button
                    onClick={() => setIsPriceSortExpanded(!isPriceSortExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-[#d4af37]/30 hover:border-[#d4af37]/60 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center gap-2 flex-wrap text-left">
                      <SlidersHorizontal size={13} className="text-[#d4af37] group-hover:scale-110 transition-transform" />
                      <span className="text-[#f4e5a9] font-bold">Sort & Price Filter</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f4e5a9] text-[10px] font-bold">
                        {priceRangeLimit >= 2000 ? 'Any Budget' : `≤ ₹${priceRangeLimit}`}
                      </span>
                      <span className="text-[10px] text-white/50">
                        • {restaurantSort === 'price-asc' ? '₹ Low to High' : restaurantSort === 'price-desc' ? '₹ High to Low' : restaurantSort === 'distance' ? '📍 Nearest' : '⭐ Top Rated'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60 shrink-0 ml-2">
                      {isPriceSortExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>

                  {/* Moving Price Slider & Sort Controls (Expandable) */}
                  <AnimatePresence>
                    {isPriceSortExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-3 rounded-xl bg-black/75 border border-[#d4af37]/30 space-y-3 backdrop-blur-xl">
                          {/* Moving Price Range Bar */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/90 font-medium flex items-center gap-1">
                                <IndianRupee size={12} className="text-[#d4af37]" />
                                <span>Max Budget for Two:</span>
                              </span>
                              <span className="font-bold text-[#f4e5a9] bg-[#d4af37]/20 px-2 py-0.5 rounded-md border border-[#d4af37]/35 font-mono">
                                {priceRangeLimit >= 2000 ? '₹2000+ (No Limit)' : `Up to ₹${priceRangeLimit}`}
                              </span>
                            </div>

                            {/* Interactive Moving Slider Bar */}
                            <div className="relative py-1">
                              <input
                                type="range"
                                min="150"
                                max="2000"
                                step="50"
                                value={priceRangeLimit}
                                onChange={(e) => setPriceRangeLimit(Number(e.target.value))}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                              />
                              <div className="flex justify-between text-[9px] text-white/45 mt-1 font-mono">
                                <span>₹150</span>
                                <span>₹500</span>
                                <span>₹1000</span>
                                <span>₹1500</span>
                                <span>₹2000+</span>
                              </div>
                            </div>

                            {/* Quick Budget Tiers */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {[
                                { label: 'All', val: 2000 },
                                { label: 'Under ₹350', val: 350 },
                                { label: 'Under ₹750', val: 750 },
                                { label: 'Under ₹1200', val: 1200 },
                              ].map((tier) => (
                                <button
                                  key={tier.label}
                                  onClick={() => setPriceRangeLimit(tier.val)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                                    priceRangeLimit === tier.val
                                      ? 'bg-[#d4af37] text-black font-bold shadow-sm'
                                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                                  }`}
                                >
                                  {tier.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sort Basis Options */}
                          <div className="space-y-1.5 pt-2 border-t border-white/10">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/90 font-medium flex items-center gap-1">
                                <ArrowUpDown size={12} className="text-emerald-400" />
                                <span>Sort Restaurants By:</span>
                              </span>
                              <span className="text-[10px] text-white/40">
                                {nearbyRestaurants.length} matching spots
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: 'price-asc', label: 'Price: Low to High', icon: '₹ ↑' },
                                { id: 'price-desc', label: 'Price: High to Low', icon: '₹ ↓' },
                                { id: 'rating', label: 'Top Rated', icon: '⭐' },
                                { id: 'distance', label: 'Nearest First', icon: '📍' },
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => setRestaurantSort(opt.id as any)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    restaurantSort === opt.id
                                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                      : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                                  }`}
                                >
                                  <span>{opt.icon}</span>
                                  <span className="truncate">{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Restaurants & Menus List */}
              <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
                {nearbyRestaurants.length === 0 ? (
                  <div className="text-center py-8 px-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <Utensils size={28} className="mx-auto text-white/30" />
                    <p className="text-xs text-white/60">
                      No restaurants found under ₹{priceRangeLimit} for this filter.
                    </p>
                    <button
                      onClick={() => {
                        setPriceRangeLimit(2000);
                        setRestaurantFilter('all');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Price & Filters</span>
                    </button>
                  </div>
                ) : (
                  nearbyRestaurants.map((restaurant) => {
                    const isExpanded = selectedRestaurant?.id === restaurant.id;
                    return (
                      <div
                        key={restaurant.id}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-2.5"
                      >
                        <div
                          onClick={() => setSelectedRestaurant(prev => prev?.id === restaurant.id ? null : restaurant)}
                          className="flex items-start justify-between gap-3 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white">{restaurant.name}</h4>
                              <span className={`px-2 py-0.2 rounded text-[10px] font-semibold ${
                                restaurant.isPureVeg ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}>
                                {restaurant.isPureVeg ? '🟢 Pure Veg' : '🔴 Non-Veg & Mughlai'}
                              </span>
                            </div>
                            <p className="text-xs text-white/70">{restaurant.cuisine} • ₹{restaurant.priceForTwo} for two</p>
                            <p className="text-[10px] text-white/40 flex items-center gap-1">
                              <MapPin size={10} className="text-[#d4af37]" />
                              {restaurant.address}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-500/30">
                              <Star size={11} fill="currentColor" />
                              {restaurant.rating}
                            </span>
                            <span className="text-[10px] text-[#d4af37] font-medium flex items-center gap-0.5">
                              {isExpanded ? 'Hide Menu' : 'View Menu'}
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Menu Items with Prices */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 border-t border-white/10 space-y-1.5"
                            >
                              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">
                                Popular Menu & Prices
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {restaurant.menu.map((item) => (
                                  <div
                                    key={item.name}
                                    className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-2"
                                  >
                                    <div className="min-w-0">
                                      <span className="text-xs font-semibold text-white truncate block">
                                        {item.isVeg ? '🟢' : '🔴'} {item.name}
                                      </span>
                                      {item.description && (
                                        <p className="text-[9px] text-white/40 truncate">{item.description}</p>
                                      )}
                                    </div>
                                    <span className="text-xs font-bold text-[#f4e5a9] font-mono shrink-0">
                                      ₹{item.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-end shrink-0">
                <button
                  onClick={() => setShowRestaurantsModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FRIENDS ON ROUTE & JOIN REQUEST MODAL                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFriendsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-3xl glass-panel border border-sky-500/40 p-5 shadow-2xl bg-[#0b0d13]/95 text-left max-h-[88vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Friends & Live Devotees</h3>
                    <span className="text-[10px] text-white/50">Send an instant Join Request or chat</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowFriendsModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs: Route Matches vs All Active Devotees */}
              <div className="flex items-center gap-2 pt-2.5 pb-1 shrink-0">
                <button
                  onClick={() => setFriendsModalTab('route')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    friendsModalTab === 'route'
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  <span>Route Matches</span>
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 font-bold">
                    {friendsInRoute.length}
                  </span>
                </button>

                <button
                  onClick={() => setFriendsModalTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    friendsModalTab === 'all'
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  <span>All Active Friends</span>
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-bold">
                    {friends.length}
                  </span>
                </button>
              </div>

              {/* Friends List or Live Sync Status */}
              <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                {/* Live Sync Status Banner */}
                <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                    <div>
                      <p className="font-semibold text-sky-200">
                        Live Route Broadcast Active
                      </p>
                      <p className="text-[10px] text-white/60">
                        {selectedPandals.length > 0
                          ? `Syncing ${selectedPandals.length} pandals with nearby devotees`
                          : 'Select pandals to match with friends on your route'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold shrink-0">
                    {friendsModalTab === 'route' ? `${friendsInRoute.length} On Route` : `${friends.length} Total`}
                  </span>
                </div>

                {/* Displayed Friends calculation */}
                {(() => {
                  const displayList = friendsModalTab === 'route' 
                    ? (friendsInRoute.length > 0 ? friendsInRoute : friends)
                    : friends;

                  if (displayList.length === 0) {
                    return (
                      <div className="py-10 px-4 text-center text-white/40 space-y-3 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto text-sky-400">
                          <Users size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white/80">No other devotees online yet</p>
                          <p className="text-xs text-white/40 max-w-sm mx-auto mt-1 leading-relaxed">
                            Your route is synced in real-time. When other Google-verified friends log in and pick pandals, they will appear here automatically with instant join requests!
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-center gap-2">
                          <button
                            onClick={handleShare}
                            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Share2 size={12} />
                            <span>{copiedNotification ? '✓ Route Copied!' : 'Share Route with Friends'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2.5">
                      {friendsModalTab === 'route' && friendsInRoute.length === 0 && friends.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-between">
                          <span>No exact pandal matches yet. Here are active devotees across Kolkata ready to join:</span>
                        </div>
                      )}

                      {displayList.map((friend) => (
                        <div
                          key={friend.id}
                          className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start space-x-3 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-[#d4af37]/40"
                              />
                              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0b0d13]" />
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-white truncate">{friend.name}</h4>
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                                  {friend.zone.toUpperCase()} KOLKATA
                                </span>
                              </div>

                              {friend.sharedCount && friend.sharedCount > 0 ? (
                                <div className="flex items-center gap-1.5 text-[11px] text-[#f4e5a9] font-medium">
                                  <Sparkles size={11} className="text-[#d4af37] shrink-0" />
                                  <span className="truncate">
                                    <strong>{friend.sharedCount} matching pandals</strong> ({friend.sharedPandals?.slice(0, 2).join(', ')})
                                  </span>
                                </div>
                              ) : (
                                <p className="text-xs text-sky-300 font-medium">{friend.routeTitle} • {friend.pandalCount} pandals</p>
                              )}

                              <p className="text-[10px] text-white/50 flex items-center gap-1">
                                <MapPin size={9} className="text-[#d4af37] shrink-0" />
                                <span>Currently at: <strong>{friend.currentPandal}</strong></span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {requestSentSuccess === friend.name ? (
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-500/40">
                                <Check size={12} />
                                <span>Request Sent!</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => setSelectedFriend(friend)}
                                className="px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e6ca65] text-black font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                              >
                                <Send size={12} />
                                <span>Join Request</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Join Request Message Popup */}
              {selectedFriend && (
                <div className="p-3 rounded-2xl bg-black/60 border border-[#d4af37]/40 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Invite {selectedFriend.name.split(' ')[0]} to join your route:
                    </span>
                    <button
                      onClick={() => setSelectedFriend(null)}
                      className="text-white/40 hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={joinRequestMessage}
                    onChange={(e) => setJoinRequestMessage(e.target.value)}
                    placeholder="E.g. Hey! We are at Maddox Square. Let’s hop together!"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedFriend(null)}
                      className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendJoinRequest(selectedFriend)}
                      className="px-4 py-1 rounded-lg bg-[#d4af37] text-black font-bold text-xs"
                    >
                      Send Request
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between items-center shrink-0 text-xs text-white/50">
                <button
                  onClick={() => {
                    setShowFriendsModal(false);
                    onClose();
                    onOpenSocialHub?.();
                  }}
                  className="text-[#f4e5a9] underline cursor-pointer"
                >
                  Open Full Social Hub & Chats →
                </button>
                <button
                  onClick={() => setShowFriendsModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Planned Team Custom Link & Invitation Modal */}
      <InviteTeamModal
        isOpen={isInviteTeamModalOpen}
        onClose={() => setIsInviteTeamModalOpen(false)}
        team={currentPlannedTeam}
      />

    </AnimatePresence>
  );
};
