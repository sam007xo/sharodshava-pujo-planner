import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type FriendProfile,
  type FriendRequest,
  type ChatMessage
} from '../config/friendsSocialData';
import { useAuth } from './AuthContext';
import { useLocation } from './LocationContext';
import { 
  syncUserProfile, 
  subscribeToActiveUsers, 
  subscribeToFriendRequests, 
  sendFriendRequestToDb, 
  updateFriendRequestStatusInDb, 
  sendChatMessageToDb, 
  subscribeToChatMessages,
  getDeterministicChatId 
} from '../services/firebaseBackend';

interface SocialContextType {
  friends: FriendProfile[];
  requests: FriendRequest[];
  chats: Record<string, ChatMessage[]>;
  pendingReceivedCount: number;
  updateUserRoute: (activeRoute: string[], currentPandal?: string, zone?: 'north' | 'central' | 'south') => void;
  sendJoinRequest: (friend: FriendProfile, customMessage: string) => void;
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  sendMessage: (friendId: string, text: string) => void;
  shareRouteWithFriend: (friendId: string, pandals: string[]) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_REQUESTS = 'pujo_planner_requests';
const LOCAL_STORAGE_KEY_CHATS = 'pujo_planner_chats';

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { locality, coordinates } = useLocation();

  const [friends, setFriends] = useState<FriendProfile[]>([]);
  
  const DEMO_IDS = ['req-1', 'req-2', 'friend-1', 'friend-2', 'friend-3', 'friend-4', 'friend-5'];

  const [requests, setRequests] = useState<FriendRequest[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REQUESTS);
      if (saved) {
        const parsed: FriendRequest[] = JSON.parse(saved);
        return parsed.filter(r => !DEMO_IDS.includes(r.id));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS);
      if (saved) {
        const parsed: Record<string, ChatMessage[]> = JSON.parse(saved);
        // Strip out any legacy demo keys and messages
        const clean: Record<string, ChatMessage[]> = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (DEMO_IDS.includes(k)) continue; // Skip demo friend chat threads
          const valid = v.filter(m => !m.id.startsWith('msg-1') && !m.id.startsWith('msg-2') && !m.id.startsWith('msg-3'));
          if (valid.length > 0) clean[k] = valid;
        }
        return clean;
      }
      return {};
    } catch {
      return {};
    }
  });

  // 1. Sync User Profile in Database upon login or location change
  useEffect(() => {
    if (user) {
      syncUserProfile(user, {
        locality: locality || 'Kolkata',
        coordinates: coordinates ? { lat: coordinates.latitude, lng: coordinates.longitude } : undefined
      });
    }
  }, [user, locality, coordinates]);

  // 2. Real-time Subscription to Active Friends in Database
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToActiveUsers(user.uid, (activeUsers) => {
      // Only show real registered users from the database — no demo data
      setFriends(activeUsers);
    });
    return () => unsub();
  }, [user]);

  // 3. Real-time Subscription to Friend Requests in Database
  useEffect(() => {
    if (user?.uid) {
      const unsub = subscribeToFriendRequests(user.uid, (dbRequests) => {
        if (dbRequests) {
          setRequests(prev => {
            const map = new Map<string, FriendRequest>();
            prev.forEach(r => map.set(r.id, r));
            dbRequests.forEach(r => map.set(r.id, r));
            return Array.from(map.values());
          });
        }
      });
      return () => unsub();
    }
  }, [user]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    } catch { /* ignore */ }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(chats));
    } catch { /* ignore */ }
  }, [chats]);

  // 4. Real-time Chat Subscription for each friend
  useEffect(() => {
    if (!user?.uid || friends.length === 0) return;
    const unsubs: (() => void)[] = [];

    friends.forEach(friend => {
      const chatId = getDeterministicChatId(user.uid, friend.id);
      const unsub = subscribeToChatMessages(chatId, (messages) => {
        if (messages.length > 0) {
          setChats(prev => ({
            ...prev,
            [friend.id]: messages,
            [chatId]: messages
          }));
        }
      });
      unsubs.push(unsub);
    });

    return () => unsubs.forEach(u => u());
  }, [user, friends]);

  const pendingReceivedCount = requests.filter(r => r.type === 'received' && r.status === 'pending').length;

  // 0. Real-time Route & Location broadcast to database
  const updateUserRoute = useCallback((activeRoute: string[], currentPandal?: string, zone?: 'north' | 'central' | 'south') => {
    if (user) {
      syncUserProfile(user, {
        activeRoute,
        currentPandal: currentPandal || (activeRoute.length > 0 ? activeRoute[0] : undefined),
        zone: zone || 'south',
        locality: locality || 'Kolkata',
        coordinates: coordinates ? { lat: coordinates.latitude, lng: coordinates.longitude } : undefined
      });
    }
  }, [user, locality, coordinates]);

  // 1. Send Join Request to a Friend (Linked to Real Database)
  const sendJoinRequest = useCallback((friend: FriendProfile, customMessage: string) => {
    if (user) {
      sendFriendRequestToDb(user, friend, customMessage, friend.sector, friend.currentPandal);
    }

    const newReq: FriendRequest = {
      id: `sent-req-${Date.now()}`,
      senderName: friend.name,
      senderAvatar: friend.avatar,
      zone: friend.sector || `${friend.zone} Kolkata`,
      currentPandal: friend.currentPandal,
      message: customMessage || `Hey ${friend.name.split(' ')[0]}! Let's join routes for pandal hopping together!`,
      timestamp: 'Just now',
      status: 'pending',
      type: 'sent'
    };

    setRequests(prev => [newReq, ...prev.filter(r => r.id !== newReq.id)]);

    // Also create initial pending chat greeting
    const welcomeMsg: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      friendId: friend.id,
      sender: 'me',
      text: `👋 Sent a Join Request: "${newReq.message}"`,
      timestamp: 'Just now'
    };

    setChats(prev => ({
      ...prev,
      [friend.id]: [...(prev[friend.id] || []), welcomeMsg]
    }));
  }, [user]);

  // 2. Accept a Request (Sync to Database)
  const acceptRequest = useCallback((requestId: string) => {
    updateFriendRequestStatusInDb(requestId, 'accepted');

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        // Create initial chat with sender
        const matchedFriend = friends.find(f => f.name.toLowerCase() === req.senderName.toLowerCase()) || {
          id: `friend-${Date.now()}`,
          name: req.senderName,
          avatar: req.senderAvatar,
          zone: 'north' as const,
          sector: req.zone,
          currentPandal: req.currentPandal,
          routeTitle: 'Pujo Squad',
          pandalCount: 4,
          status: 'at-pandal' as const,
          lastSeen: 'Online',
          mutualFriends: 5
        };

        if (!friends.some(f => f.name === req.senderName)) {
          setFriends(fPrev => [matchedFriend, ...fPrev]);
        }

        const friendId = matchedFriend.id;
        const acceptMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          friendId,
          sender: 'friend',
          text: `🎉 Shubho Pujo! Thanks for accepting! Where are you hopping right now?`,
          timestamp: 'Just now'
        };

        setChats(cPrev => ({
          ...cPrev,
          [friendId]: [...(cPrev[friendId] || []), acceptMsg]
        }));

        return { ...req, status: 'accepted' };
      }
      return req;
    }));
  }, [friends]);

  // 3. Decline Request (Sync to Database)
  const declineRequest = useCallback((requestId: string) => {
    updateFriendRequestStatusInDb(requestId, 'declined');
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'declined' } : req));
  }, []);

  // 4. Send Message (Sync directly to Database)
  const sendMessage = useCallback((friendId: string, text: string) => {
    if (!text.trim()) return;

    const chatId = user?.uid ? getDeterministicChatId(user.uid, friendId) : friendId;
    if (user) {
      sendChatMessageToDb(chatId, friendId, user.uid, text.trim());
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      friendId,
      sender: 'me',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), newMsg],
      [chatId]: [...(prev[chatId] || []), newMsg]
    }));
  }, [user]);

  // 5. Share Route Card in Chat (Sync to Database)
  const shareRouteWithFriend = useCallback((friendId: string, pandals: string[]) => {
    const routeText = pandals.length > 0
      ? `🗺️ My Sharodshav Puja Route:\n${pandals.map((p, i) => `${i + 1}. ${p}`).join('\n')}\nLet's meet up along the way!`
      : `🗺️ Hey! Join our Pujo hopping route tonight!`;

    const chatId = user?.uid ? getDeterministicChatId(user.uid, friendId) : friendId;
    if (user) {
      sendChatMessageToDb(chatId, friendId, user.uid, routeText, pandals);
    }

    const routeMsg: ChatMessage = {
      id: `msg-route-${Date.now()}`,
      friendId,
      sender: 'me',
      text: routeText,
      timestamp: 'Just now',
      isRouteCard: true,
      routeData: {
        title: 'Sharodshav Itinerary',
        pandals: pandals.slice(0, 5),
        distanceKm: 8.5
      }
    };

    setChats(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), routeMsg],
      [chatId]: [...(prev[chatId] || []), routeMsg]
    }));
  }, [user]);

  return (
    <SocialContext.Provider
      value={{
        friends,
        requests,
        chats,
        pendingReceivedCount,
        updateUserRoute,
        sendJoinRequest,
        acceptRequest,
        declineRequest,
        sendMessage,
        shareRouteWithFriend
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
