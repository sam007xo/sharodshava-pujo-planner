import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Copy,
  Check,
  Users,
  Send,
  Sparkles,
  MapPin,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import {
  type PlannedTeam,
  generateTeamInviteUrl
} from '../services/teamService';
import { useSocial } from '../context/SocialContext';

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: PlannedTeam | null;
}

export const InviteTeamModal: React.FC<InviteTeamModalProps> = ({
  isOpen,
  onClose,
  team
}) => {
  const { friends, sendJoinRequest } = useSocial();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [invitedFriendUids, setInvitedFriendUids] = useState<Set<string>>(new Set());
  const [customMsg, setCustomMsg] = useState('');

  if (!isOpen || !team) return null;

  const inviteUrl = generateTeamInviteUrl(team);

  // Copy full invite link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      /* fallback */
    }
  };

  // Copy team code only
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(team.teamCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2400);
    } catch {
      /* fallback */
    }
  };

  // Share via WhatsApp
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🎉 Join our Pujo Hopping Squad "${team.teamName}" on Sharodshav!\n\n` +
      `📍 Route (${team.pandals.length} Pandals):\n` +
      team.pandals.slice(0, 5).map((p, i) => `${i + 1}. ${p}`).join('\n') +
      (team.pandals.length > 5 ? `\n...and ${team.pandals.length - 5} more!` : '') +
      `\n\n🔑 Team Code: ${team.teamCode}\n` +
      `🔗 Click link to join squad live: ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Native Web Share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${team.teamName} - Sharodshav 2026`,
          text: `Join our Pujo squad on Sharodshav! Team Code: ${team.teamCode}`,
          url: inviteUrl
        });
        return;
      } catch {
        /* ignore */
      }
    }
    handleCopyLink();
  };

  // Invite friend from social list
  const handleInviteFriend = (friend: any) => {
    const message = customMsg || `Hey ${friend.name.split(' ')[0]}! Join our Pujo team "${team.teamName}" with code ${team.teamCode}!`;
    sendJoinRequest(friend, message);
    setInvitedFriendUids(prev => new Set(prev).add(friend.id));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
          className="relative w-full max-w-xl rounded-3xl glass-panel border border-[#d4af37]/40 p-5 sm:p-6 shadow-2xl z-10 my-auto overflow-hidden text-left bg-[#0c0e15]/95 flex flex-col max-h-[90vh]"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-white/10 shrink-0">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase flex items-center gap-1.5 font-sans">
                <Users size={12} />
                TEAM INVITE & SHARE
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Invite Friends to Your Squad
              </h3>
              <p className="text-xs text-white/60">
                Share your planned team link or code so friends can hop together with live sync!
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto space-y-4 py-3.5 pr-1">
            
            {/* Team Overview Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#f4e5a9]">{team.teamName}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 uppercase">
                  {team.zone} Kolkata
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/70">
                <MapPin size={12} className="text-[#d4af37]" />
                <span>{team.pandals.length} Planned Pandals:</span>
                <span className="text-white/90 font-medium truncate max-w-[280px]">
                  {team.pandals.slice(0, 3).join(' • ')} {team.pandals.length > 3 ? `+${team.pandals.length - 3} more` : ''}
                </span>
              </div>

              {/* Members Avatars */}
              <div className="flex items-center justify-between pt-1 text-xs text-white/50 border-t border-white/5">
                <span>Created by {team.leaderName}</span>
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
                  <span className="pl-2 text-[10px] text-white/70 font-semibold">{team.members.length} Devotee{team.members.length > 1 ? 's' : ''} in squad</span>
                </div>
              </div>
            </div>

            {/* Custom Link Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80 flex items-center justify-between">
                <span>Custom Team Invite Link</span>
                <span className="text-[10px] text-emerald-400 font-normal">Works instantly across any browser</span>
              </label>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white/80 font-mono truncate select-all">
                  {inviteUrl}
                </div>

                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    copiedLink
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:scale-102 text-black shadow-md'
                  }`}
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Team Code & Quick Share Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Team Code Card */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] text-white/50 uppercase font-semibold block">Team Code</span>
                  <span className="text-sm font-mono font-bold text-[#f4e5a9] tracking-wider truncate block">
                    {team.teamCode}
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all flex items-center gap-1 cursor-pointer shrink-0 border border-white/10"
                >
                  {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              {/* WhatsApp Share Button */}
              <button
                onClick={handleWhatsAppShare}
                className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition-all flex items-center justify-between cursor-pointer group shadow-md"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-200">
                      Share via WhatsApp
                    </h4>
                    <span className="text-[10px] text-emerald-400/80">Send to group or friend</span>
                  </div>
                </div>
                <ExternalLink size={14} className="opacity-70 group-hover:opacity-100" />
              </button>

            </div>

            {/* Direct In-App Friends Invitation */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#d4af37]" />
                  <span>1-Tap Invite Active Devotees ({friends.length})</span>
                </span>
                <span className="text-[10px] text-white/50">Google-verified devotees online</span>
              </div>

              {/* Optional Custom Message */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Custom invite note (e.g. Join our hopping route tonight!)..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {friends.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-1">
                  <p className="text-xs text-white/60">No other devotees online right now.</p>
                  <p className="text-[11px] text-white/40">
                    Share your custom invite link with friends on WhatsApp or Instagram so they can join!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {friends.map((friend) => {
                    const isInvited = invitedFriendUids.has(friend.id);
                    return (
                      <div
                        key={friend.id}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-8 h-8 rounded-xl object-cover border border-[#d4af37]/40 shrink-0"
                          />
                          <div className="min-w-0 space-y-0.5">
                            <h5 className="text-xs font-bold text-white truncate">{friend.name}</h5>
                            <p className="text-[10px] text-white/50 truncate">
                              {friend.zone.toUpperCase()} Kolkata • {friend.currentPandal || 'Active'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleInviteFriend(friend)}
                          disabled={isInvited}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                            isInvited
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                              : 'bg-white/10 hover:bg-[#d4af37] text-white hover:text-black border border-white/15'
                          }`}
                        >
                          {isInvited ? <Check size={11} /> : <Send size={11} />}
                          <span>{isInvited ? 'Invited' : 'Invite'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
            <button
              onClick={handleNativeShare}
              className="text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Share2 size={12} />
              <span>More Share Options</span>
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
