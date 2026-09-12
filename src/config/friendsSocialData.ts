export interface FriendProfile {
  id: string;
  name: string;
  avatar: string;
  zone: 'north' | 'central' | 'south';
  sector: string;
  currentPandal: string;
  routeTitle: string;
  pandalCount: number;
  status: 'active' | 'moving' | 'at-pandal';
  lastSeen: string;
  mutualFriends: number;
  phoneOrHandle?: string;
  activeRoute?: string[];
  coordinates?: { lat: number; lng: number };
  locality?: string;
  sharedPandals?: string[];
  sharedCount?: number;
}

export interface FriendRequest {
  id: string;
  senderName: string;
  senderAvatar: string;
  zone: string;
  currentPandal: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  type: 'received' | 'sent';
}

export interface ChatMessage {
  id: string;
  friendId: string;
  sender: 'me' | 'friend';
  text: string;
  timestamp: string;
  isRouteCard?: boolean;
  routeData?: {
    title: string;
    pandals: string[];
    distanceKm: number;
  };
}

export const INITIAL_FRIENDS_ON_ROUTE: FriendProfile[] = [];

export const INITIAL_REQUESTS: FriendRequest[] = [];

export const INITIAL_CHATS: Record<string, ChatMessage[]> = {};

