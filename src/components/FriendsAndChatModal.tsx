import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  MessageSquare, 
  Send, 
  Check, 
  UserPlus, 
  MapPin, 
  Share2, 
  Sparkles,
  Search
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

interface FriendsAndChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoutePandals?: string[];
}

export const FriendsAndChatModal: React.FC<FriendsAndChatModalProps> = ({
  isOpen,
  onClose,
  activeRoutePandals = []
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'chats'>('requests');
  const [requestSubTab, setRequestSubTab] = useState<'received' | 'sent'>('received');
  
  const { 
    friends, 
    requests, 
    chats, 
    pendingReceivedCount, 
    acceptRequest, 
    declineRequest, 
    sendMessage, 
    shareRouteWithFriend 
  } = useSocial();

  const [activeFriendId, setActiveFriendId] = useState<string>(friends[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(activeFriendId, messageInput.trim());
    setMessageInput('');
  };

  // Share active route to chat
  const handleShareRouteInChat = () => {
    shareRouteWithFriend(activeFriendId, activeRoutePandals);
  };

  const currentFriend = friends.find(f => f.id === activeFriendId) || friends[0] || null;

  const activeChatMessages = chats[activeFriendId] || [];
  const filteredRequests = requests.filter(r => r.type === requestSubTab);

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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-3xl glass-panel border border-white/20 p-5 sm:p-6 shadow-2xl z-10 my-auto overflow-hidden text-left max-h-[92vh] flex flex-col bg-[#0b0d13]/95"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Users size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest text-[#d4af37] uppercase font-sans">
                    SHARODSHAV SOCIAL
                  </span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-white/60 text-xs font-serif">পূজো আড্ডা ও বন্ধু</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Friend Requests & Live Pujo Chats
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

          {/* Top Tabs */}
          <div className="flex items-center justify-between gap-3 pt-3 pb-2 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              {/* Tab 1: Requests */}
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'requests'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <UserPlus size={14} />
                <span>Friend Requests</span>
                {pendingReceivedCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-bold">
                    {pendingReceivedCount}
                  </span>
                )}
              </button>

              {/* Tab 2: Chats */}
              <button
                onClick={() => setActiveTab('chats')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'chats'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <MessageSquare size={14} />
                <span>Live Chats</span>
              </button>
            </div>

            {/* Sub-tabs for Requests */}
            {activeTab === 'requests' && (
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setRequestSubTab('received')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    requestSubTab === 'received'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Received ({requests.filter(r => r.type === 'received').length})
                </button>
                <button
                  onClick={() => setRequestSubTab('sent')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    requestSubTab === 'sent'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Sent ({requests.filter(r => r.type === 'sent').length})
                </button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto py-4 min-h-[380px]">
            
            {/* ── REQUESTS TAB ──────────────────────────────────────── */}
            {activeTab === 'requests' && (
              <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                  <div className="py-16 text-center text-white/40 space-y-2 border border-dashed border-white/10 rounded-2xl">
                    <UserPlus size={32} className="mx-auto text-white/20" />
                    <p className="text-sm font-medium">No {requestSubTab} friend requests</p>
                    <p className="text-xs text-white/40">
                      {requestSubTab === 'received' 
                        ? 'When people invite you to join their pandal route, requests will appear here.'
                        : 'Requests you sent to friends on the route will appear here.'}
                    </p>
                  </div>
                ) : (
                  filteredRequests.map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start space-x-3.5 min-w-0">
                        <img
                          src={req.senderAvatar}
                          alt={req.senderName}
                          className="w-12 h-12 rounded-2xl object-cover border border-[#d4af37]/40 shrink-0"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-white">{req.senderName}</h4>
                            <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-[#d4af37]/15 text-[#f4e5a9] border border-[#d4af37]/30">
                              {req.zone}
                            </span>
                            <span className="text-[11px] text-white/40">{req.timestamp}</span>
                          </div>
                          
                          <p className="text-xs text-white/80 italic">
                            "{req.message}"
                          </p>

                          <div className="flex items-center gap-1.5 text-[11px] text-white/50 pt-0.5">
                            <MapPin size={11} className="text-[#d4af37]" />
                            <span>Currently at: <strong>{req.currentPandal}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {req.status === 'pending' ? (
                          <>
                            {req.type === 'received' ? (
                              <>
                                <button
                                  onClick={() => acceptRequest(req.id)}
                                  className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e6ca65] text-black font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                                >
                                  <Check size={14} />
                                  <span>Accept</span>
                                </button>
                                <button
                                  onClick={() => declineRequest(req.id)}
                                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-all cursor-pointer border border-white/10"
                                >
                                  Decline
                                </button>
                              </>
                            ) : (
                              <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                                Pending Response
                              </span>
                            )}
                          </>
                        ) : req.status === 'accepted' ? (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-1">
                              <Check size={12} />
                              <span>Accepted</span>
                            </span>
                            <button
                              onClick={() => {
                                const matched = friends.find(f => f.name === req.senderName);
                                if (matched) setActiveFriendId(matched.id);
                                setActiveTab('chats');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer"
                            >
                              Open Chat
                            </button>
                          </div>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-white/5 text-white/40 text-xs">
                            Declined
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* ── CHATS TAB ─────────────────────────────────────────── */}
            {activeTab === 'chats' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
                
                {/* Friends List Column */}
                <div className="md:col-span-4 flex flex-col space-y-2 border-r border-white/10 pr-2">
                  {friends.length > 0 && (
                    <div className="relative mb-1">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search friends..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 overflow-y-auto max-h-[340px] pr-1">
                    {friends.length === 0 ? (
                      <div className="py-12 text-center text-white/40 space-y-3 border border-dashed border-white/10 rounded-2xl px-4">
                        <Users size={32} className="mx-auto text-white/20" />
                        <p className="text-sm font-semibold text-white/60">No friends on route yet</p>
                        <p className="text-[11px] text-white/40 leading-relaxed">
                          When other users sign in with their Google account and join Pujo hopping, they'll appear here automatically.
                        </p>
                        <p className="text-[11px] text-[#d4af37]/70 font-medium">
                          🔗 Share this app with friends to connect!
                        </p>
                      </div>
                    ) : (
                      friends
                        .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((friend) => {
                          const isSelected = activeFriendId === friend.id;
                          return (
                            <div
                              key={friend.id}
                              onClick={() => setActiveFriendId(friend.id)}
                              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-3 ${
                                isSelected
                                  ? 'bg-[#d4af37]/15 border border-[#d4af37]/40 shadow-sm'
                                  : 'bg-white/[0.02] hover:bg-white/[0.06] border border-transparent'
                              }`}
                            >
                              <div className="relative">
                                <img
                                  src={friend.avatar}
                                  alt={friend.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                />
                                <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0b0d13] ${
                                  friend.status === 'at-pandal' ? 'bg-emerald-500' : 'bg-amber-400'
                                }`} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <h5 className={`text-xs font-bold truncate ${isSelected ? 'text-[#f4e5a9]' : 'text-white'}`}>
                                    {friend.name}
                                  </h5>
                                </div>
                                <p className="text-[10px] text-white/50 truncate flex items-center gap-1">
                                  <MapPin size={9} className="text-[#d4af37]" />
                                  {friend.currentPandal}
                                </p>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Chat Conversation Column */}
                <div className="md:col-span-8 flex flex-col justify-between h-[360px] pl-1">
                  
                  {!currentFriend ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-white/40 space-y-3 py-8">
                      <MessageSquare size={40} className="text-white/15" />
                      <p className="text-sm font-semibold text-white/50">No conversations yet</p>
                      <p className="text-[11px] text-white/35 max-w-[260px] leading-relaxed">
                        Once other Google-verified users join and you connect, your chats will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Chat Top Banner */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/10 shrink-0">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={currentFriend.avatar}
                            alt={currentFriend.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#d4af37]/40"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white">{currentFriend.name}</h4>
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {currentFriend.lastSeen}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={handleShareRouteInChat}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/10 hover:from-[#d4af37]/30 hover:to-[#d4af37]/20 border border-[#d4af37]/40 text-[#f4e5a9] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          title="Share your live Puja itinerary to this chat"
                        >
                          <Share2 size={12} />
                          <span>Share Route</span>
                        </button>
                      </div>

                      {/* Message Bubbles Scroll Area */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
                        {activeChatMessages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center text-white/40 space-y-2 py-8">
                            <MessageSquare size={32} className="text-white/20" />
                            <p className="text-xs font-semibold text-white/60">No messages yet with {currentFriend.name.split(' ')[0]}</p>
                            <p className="text-[11px] text-white/40 max-w-[220px]">
                              Start the conversation by typing a message or sharing your route!
                            </p>
                          </div>
                        ) : (
                          activeChatMessages.map((msg) => {
                            const isMe = msg.sender === 'me';
                            return (
                              <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                                  isMe
                                    ? 'bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-black font-medium rounded-tr-none shadow-md'
                                    : 'bg-white/10 border border-white/10 text-white rounded-tl-none'
                                }`}>
                                  <p className="whitespace-pre-line">{msg.text}</p>
                                  <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-black/60' : 'text-white/40'}`}>
                                    {msg.timestamp}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Chat Input Bar */}
                      <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-white/10 shrink-0">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder={`Type a message to ${currentFriend.name.split(' ')[0]}...`}
                          className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]"
                        />
                        <button
                          type="submit"
                          disabled={!messageInput.trim()}
                          className="p-2 rounded-xl bg-[#d4af37] text-black hover:bg-[#e6ca65] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shrink-0"
                        >
                          <Send size={15} />
                        </button>
                      </form>
                    </>
                  )}

                </div>

              </div>
            )}

          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40 shrink-0">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#d4af37]" />
              <span>Connect & coordinate with friends across Kolkata pandals in real-time</span>
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
