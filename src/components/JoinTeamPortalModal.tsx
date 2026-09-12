import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Search,
  Sparkles,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Compass,
  Route
} from 'lucide-react';
import {
  type PlannedTeam,
  getAllPlannedTeams,
  findTeamByCodeOrParam,
  joinTeam
} from '../services/teamService';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';

interface JoinTeamPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (team: PlannedTeam) => void;
  onCreateNewPlan?: () => void;
}

export const JoinTeamPortalModal: React.FC<JoinTeamPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectTeam,
  onCreateNewPlan
}) => {
  const { user } = useAuth();
  const { updateUserRoute } = useSocial();

  const [teamCodeInput, setTeamCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTeam, setSuccessTeam] = useState<PlannedTeam | null>(null);
  const [activeZoneFilter, setActiveZoneFilter] = useState<'all' | 'north' | 'central' | 'south'>('all');

  const allTeams = useMemo(() => getAllPlannedTeams(), [isOpen]);

  const filteredTeams = useMemo(() => {
    if (activeZoneFilter === 'all') return allTeams;
    return allTeams.filter(t => t.zone === activeZoneFilter);
  }, [allTeams, activeZoneFilter]);

  if (!isOpen) return null;

  // Handle Manual Code / Link Entry
  const handleJoinByCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const code = teamCodeInput.trim();
    if (!code) {
      setErrorMessage('Please enter a Team Code or paste an invite link');
      return;
    }

    const matched = findTeamByCodeOrParam(code);
    if (!matched) {
      setErrorMessage(`No team found matching "${code}". Check the code or explore active squads below.`);
      return;
    }

    // Join Team
    if (user) {
      const updated = joinTeam(matched.teamCode, user);
      if (updated) {
        updateUserRoute(updated.pandals, updated.pandals[0], updated.zone === 'all' ? 'south' : updated.zone);
        setSuccessTeam(updated);
        setTimeout(() => {
          onSelectTeam(updated);
        }, 900);
        return;
      }
    }

    setSuccessTeam(matched);
    setTimeout(() => {
      onSelectTeam(matched);
    }, 900);
  };

  // 1-Click Join Pre-listed Squad
  const handleJoinSquad = (team: PlannedTeam) => {
    if (user) {
      const updated = joinTeam(team.teamCode, user);
      if (updated) {
        updateUserRoute(updated.pandals, updated.pandals[0], updated.zone === 'all' ? 'south' : updated.zone);
        setSuccessTeam(updated);
        setTimeout(() => {
          onSelectTeam(updated);
        }, 700);
        return;
      }
    }
    setSuccessTeam(team);
    setTimeout(() => {
      onSelectTeam(team);
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
          className="relative w-full max-w-2xl rounded-3xl glass-panel border border-[#d4af37]/40 p-5 sm:p-6 shadow-2xl z-10 my-auto overflow-hidden text-left bg-[#0c0e15]/95 flex flex-col max-h-[92vh]"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/80 to-transparent" />
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Users size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase font-sans">
                  SHARODSHAV • SQUAD PORTAL
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Join a Planned Pujo Team
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto space-y-4 py-3.5 pr-1">
            
            {/* Success Animation Banner */}
            <AnimatePresence>
              {successTeam && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-1.5"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    <span>Joined Squad: {successTeam.teamName}!</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Loading itinerary and syncing live navigation with {successTeam.members.length} devotees...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Portal Input Card: Enter Code or Paste Link */}
            <form onSubmit={handleJoinByCode} className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#d4af37]" />
                  <span>Enter Team Code or Paste Custom Invite Link</span>
                </label>
                <span className="text-[10px] text-white/40">e.g. PUJO-SOUTH-99</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={teamCodeInput}
                    onChange={(e) => {
                      setTeamCodeInput(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Enter Team Code or paste invite link..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e6ca65] to-[#d4af37] hover:scale-102 text-black font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-amber-200"
                >
                  <span>Join Team</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium pt-0.5">
                  <AlertCircle size={13} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>

            {/* Zone Filter Tabs for Active Squads */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Compass size={14} className="text-[#d4af37]" />
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Active Planned Squads ({filteredTeams.length})
                </h4>
              </div>

              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {(['all', 'north', 'central', 'south'] as const).map(zone => (
                  <button
                    key={zone}
                    onClick={() => setActiveZoneFilter(zone)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                      activeZoneFilter === zone
                        ? 'bg-[#d4af37] text-black shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Active Teams */}
            <div className="space-y-3">
              {filteredTeams.map((team) => {
                const isUserInTeam = user && team.members.some(m => m.uid === user.uid);

                return (
                  <div
                    key={team.teamCode}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-3 group"
                  >
                    {/* Top Row: Squad Name & Zone */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm sm:text-base font-bold text-white group-hover:text-[#f4e5a9] transition-colors">
                            {team.teamName}
                          </h5>
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 uppercase">
                            {team.zone} Kolkata
                          </span>
                          {team.dayName && (
                            <span className="px-2 py-0.2 rounded text-[9px] font-medium bg-white/10 text-white/70">
                              {team.dayName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-white/60">
                          <span>Lead: <strong>{team.leaderName}</strong></span>
                          <span>•</span>
                          <span className="font-mono text-[#d4af37] font-bold">{team.teamCode}</span>
                        </div>
                      </div>

                      {/* Join Button */}
                      <button
                        onClick={() => handleJoinSquad(team)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md ${
                          isUserInTeam
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-[#d4af37] hover:bg-[#e6ca65] text-black'
                        }`}
                      >
                        {isUserInTeam ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Joined Squad</span>
                          </>
                        ) : (
                          <>
                            <Users size={13} />
                            <span>Join Squad</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Pandals Route Badges */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-white/50 uppercase font-semibold flex items-center gap-1">
                        <MapPin size={10} className="text-[#d4af37]" />
                        <span>Planned Route ({team.pandals.length} Pandals):</span>
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {team.pandals.map((pName, pIdx) => (
                          <span
                            key={`p-${pIdx}`}
                            className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-white/80 border border-white/10"
                          >
                            {pIdx + 1}. {pName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Members Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/50">
                      <div className="flex items-center -space-x-1.5">
                        {team.members.map((m, idx) => (
                          <img
                            key={m.uid || idx}
                            src={m.avatar}
                            alt={m.name}
                            title={m.name}
                            className="w-5 h-5 rounded-full border border-black object-cover"
                          />
                        ))}
                        <span className="pl-2 text-[10px] text-white/70 font-semibold">
                          {team.members.length} Devotee{team.members.length > 1 ? 's' : ''} in squad
                        </span>
                      </div>

                      <button
                        onClick={() => handleJoinSquad(team)}
                        className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Route size={11} />
                        <span>View Full Live Itinerary →</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Footer with Create New Plan option */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
            <button
              onClick={() => {
                onClose();
                onCreateNewPlan?.();
              }}
              className="text-[#d4af37] hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <PlusCircle size={13} />
              <span>Or Plan a New Custom Trip Instead</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
