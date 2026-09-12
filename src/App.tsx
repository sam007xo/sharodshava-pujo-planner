import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { SocialProvider } from './context/SocialContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { FestivalHero } from './components/FestivalHero';
import { DaySelector } from './components/DaySelector';
import { KolkataInteractiveMapModal } from './components/KolkataInteractiveMapModal';
import { PlanTripModal } from './components/PlanTripModal';
import { DaySelectorModal } from './components/DaySelectorModal';
import { DayDetailsModal } from './components/DayDetailsModal';
import { InfoModal } from './components/InfoModal';
import { NearbyPandalsModal } from './components/NearbyPandalsModal';
import { LocationBanner } from './components/LocationBanner';
import { FriendsAndChatModal } from './components/FriendsAndChatModal';
import { JoinTeamPortalModal } from './components/JoinTeamPortalModal';
import { PujoAiChatbot } from './components/PujoAiChatbot';
import { DURGA_PUJA_2026, getFestivalStatus, type FestivalDay, type PandalPlace } from './config/festivalConfig';
import { KOLKATA_SECTORS_DATA } from './config/kolkataSectors';
import { findTeamByCodeOrParam, type PlannedTeam } from './services/teamService';

const DashboardContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
  const [isNearbyModalOpen, setIsNearbyModalOpen] = useState(false);
  const [isSitePickerOpen, setIsSitePickerOpen] = useState(false);
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [isSocialHubOpen, setIsSocialHubOpen] = useState(false);
  const [isJoinTeamPortalOpen, setIsJoinTeamPortalOpen] = useState(false);
  const [planTripPandals, setPlanTripPandals] = useState<PandalPlace[] | undefined>(undefined);
  
  // Interactive Map URL state for direct shared links
  const [interactiveMapZone, setInteractiveMapZone] = useState<'north' | 'central' | 'south' | null>(null);
  const [interactiveMapPandals, setInteractiveMapPandals] = useState<string[] | undefined>(undefined);
  const [interactiveMapConfirmed, setInteractiveMapConfirmed] = useState<boolean>(false);
  const [interactiveMapTeam, setInteractiveMapTeam] = useState<PlannedTeam | null>(null);
  const [interactiveMapDayId, setInteractiveMapDayId] = useState<string | null>(null);

  // Simulated Date for testing festival stages (null means real-world time)
  const [simulatedDate, setSimulatedDate] = useState<string | null>(null);

  // Selected Day from the Day Selector
  const [selectedDay, setSelectedDay] = useState<FestivalDay | null>(null);

  // Auto-detect joinTeam URL query param on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('joinTeam');
    const dataParam = params.get('data');
    const zoneParam = params.get('zone');
    const dayParam = params.get('day');
    const pandalsParam = params.get('pandals');

    if (joinCode || dataParam || pandalsParam) {
      let team = findTeamByCodeOrParam(joinCode || dataParam || '', window.location.search);

      if (!team && pandalsParam) {
        const pandalList = decodeURIComponent(pandalsParam).split('||').map(s => s.trim()).filter(Boolean);
        team = {
          id: `team-url-${Date.now()}`,
          teamCode: joinCode || 'PUJO-SHARED',
          teamName: `${(zoneParam || 'south').toUpperCase()} Kolkata Squad`,
          leaderName: 'Pujo Devotee',
          leaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          leaderUid: 'url-user',
          zone: (zoneParam as any) || 'south',
          dayName: dayParam || 'Ashtami',
          pandals: pandalList,
          createdAt: Date.now(),
          members: []
        };
      }

      if (team) {
        let matchedDayId: string | null = null;
        if (team.dayName) {
          const matchedDay = DURGA_PUJA_2026.days.find(
            d => d.name.toLowerCase() === team?.dayName?.toLowerCase() || d.id.toLowerCase() === team?.dayName?.toLowerCase()
          );
          if (matchedDay) {
            setSelectedDay(matchedDay);
            matchedDayId = matchedDay.id;
          }
        }

        const zone = (team.zone as 'north' | 'central' | 'south') || (zoneParam as any) || 'south';
        setInteractiveMapZone(zone);
        setInteractiveMapPandals(team.pandals);
        setInteractiveMapConfirmed(true);
        setInteractiveMapTeam(team);
        if (matchedDayId) {
          setInteractiveMapDayId(matchedDayId);
        }
        setIsSitePickerOpen(true);
      }
    }
  }, []);

  // Handle Team Selected From Portal
  const handleSelectTeamFromPortal = (team: PlannedTeam) => {
    const matched: PandalPlace[] = [];
    KOLKATA_SECTORS_DATA.forEach(z => {
      z.sectors.forEach(s => {
        s.pandals.forEach(p => {
          if (team.pandals.some(tp => tp.toLowerCase() === p.name.toLowerCase()) && !matched.some(m => m.name === p.name)) {
            matched.push(p);
          }
        });
      });
    });
    setPlanTripPandals(matched.length > 0 ? matched : undefined);
    setIsJoinTeamPortalOpen(false);
    setIsPlanTripOpen(true);
  };

  // Calculate status based on simulated or real date
  const effectiveDate = simulatedDate ? new Date(simulatedDate + 'T12:00:00') : new Date();
  const festivalStatus = getFestivalStatus(effectiveDate, DURGA_PUJA_2026);

  const handleGoHome = () => {
    setSelectedDay(null);
    setIsDayModalOpen(false);
    setIsDayDetailsOpen(false);
    setIsNearbyModalOpen(false);
    setIsInfoOpen(false);
    setIsSitePickerOpen(false);
    setIsPlanTripOpen(false);
    setSimulatedDate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-[#d4af37]"
        >
          <div className="w-5 h-5 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
        </motion.div>
      </div>
    );
  }

  // First Screen: Google Login
  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
        >
          <LoginScreen />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Authenticated Main Dashboard
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen flex flex-col justify-between"
      >
        {/* Top Navbar */}
        <Navbar 
          onGoHome={handleGoHome}
          onOpenInfo={() => setIsInfoOpen(true)}
          onOpenNearby={() => setIsNearbyModalOpen(true)}
          onOpenSocialHub={() => setIsSocialHubOpen(true)}
          simulatedDate={simulatedDate}
          onSelectSimulatedDate={(date) => {
            setSimulatedDate(date);
            setSelectedDay(null);
          }}
        />

        {/* Location Status & Request Banner */}
        <LocationBanner onOpenNearbyModal={() => setIsNearbyModalOpen(true)} />

        {/* Hero Section (Center of Screen) */}
        <main className="flex-1 flex flex-col items-center justify-center pt-8 sm:pt-12 pb-8">
          <FestivalHero
            festival={DURGA_PUJA_2026}
            status={festivalStatus}
            selectedDay={selectedDay}
            onClearSelectedDay={() => setSelectedDay(null)}
            onOpenSitePicker={() => setIsSitePickerOpen(true)}
          />
        </main>

        {/* Date Selector (Bottom portion of the screen - only shown when on landing page with no day selected) */}
        {!selectedDay && (
          <footer className="w-full">
            <DaySelector
              onOpenModal={() => setIsDayModalOpen(true)}
              onOpenPlanTrip={() => setIsPlanTripOpen(true)}
            />
          </footer>
        )}

        {/* Plan Your Trip Modal */}
        <PlanTripModal
          isOpen={isPlanTripOpen}
          onClose={() => setIsPlanTripOpen(false)}
          defaultDayId={selectedDay?.id || null}
          initialPandals={planTripPandals}
          onOpenSocialHub={() => setIsSocialHubOpen(true)}
        />

        {/* Interactive Clickable Map of Kolkata Modal (Pick a site: North, Central, South) */}
        <KolkataInteractiveMapModal
          isOpen={isSitePickerOpen}
          onClose={() => {
            setIsSitePickerOpen(false);
            setInteractiveMapZone(null);
            setInteractiveMapPandals(undefined);
            setInteractiveMapConfirmed(false);
            setInteractiveMapTeam(null);
            setInteractiveMapDayId(null);
          }}
          initialDayId={interactiveMapDayId || selectedDay?.id || null}
          initialZone={interactiveMapZone}
          initialPandalNames={interactiveMapPandals}
          initialConfirmed={interactiveMapConfirmed}
          initialTeam={interactiveMapTeam}
          onSelectDay={(day) => {
            setSelectedDay(day);
          }}
          onOpenPlanTrip={(pandals) => {
            setPlanTripPandals(pandals);
            setIsSitePickerOpen(false);
            setIsPlanTripOpen(true);
          }}
        />

        {/* Day Selector Modal Window */}
        <DaySelectorModal
          isOpen={isDayModalOpen}
          onClose={() => setIsDayModalOpen(false)}
          festival={DURGA_PUJA_2026}
          selectedDayId={selectedDay?.id || null}
          onSelectDay={(day) => {
            setSelectedDay(day);
          }}
        />

        {/* Selected Day Details Modal */}
        <DayDetailsModal
          day={selectedDay}
          isOpen={isDayDetailsOpen}
          onClose={() => setIsDayDetailsOpen(false)}
          festival={DURGA_PUJA_2026}
          onOpenPlanTrip={(pandals) => {
            setPlanTripPandals(pandals);
            setIsDayDetailsOpen(false);
            setIsPlanTripOpen(true);
          }}
          onOpenSocialHub={() => {
            setIsDayDetailsOpen(false);
            setIsSocialHubOpen(true);
          }}
        />

        {/* Nearby Pandals & Live Location Modal */}
        <NearbyPandalsModal
          isOpen={isNearbyModalOpen}
          onClose={() => setIsNearbyModalOpen(false)}
        />

        {/* Friends & Live Pujo Chat Hub Modal */}
        <FriendsAndChatModal
          isOpen={isSocialHubOpen}
          onClose={() => setIsSocialHubOpen(false)}
        />

        {/* Join Planned Team Squad Portal Modal */}
        <JoinTeamPortalModal
          isOpen={isJoinTeamPortalOpen}
          onClose={() => setIsJoinTeamPortalOpen(false)}
          onSelectTeam={handleSelectTeamFromPortal}
          onCreateNewPlan={() => {
            setPlanTripPandals(undefined);
            setIsJoinTeamPortalOpen(false);
            setIsPlanTripOpen(true);
          }}
        />

        {/* Info Modal (Creator Credits) */}
        <InfoModal
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
        />

        {/* Site-Wide Pujo-Only Floating AI Assistant */}
        <PujoAiChatbot />
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <SocialProvider>
          <div className="relative min-h-screen text-white bg-[#07080c] font-sans antialiased selection:bg-[#d4af37]/30 selection:text-white">
            {/* Atmospheric animated background using Kolkata Durga Puja artwork */}
            <AnimatedBackground />

            {/* Main Application Container */}
            <DashboardContent />
          </div>
        </SocialProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
