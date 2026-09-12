/**
 * SHARODSHAV 2026 - Planned Team & Squad Service
 * Handles custom invite link generation, team code resolution, and joining planned teams.
 */

export interface TeamMember {
  uid: string;
  name: string;
  avatar: string;
  joinedAt: number;
}

export interface PlannedTeam {
  id: string;
  teamCode: string;
  teamName: string;
  leaderName: string;
  leaderAvatar: string;
  leaderUid: string;
  zone: 'north' | 'central' | 'south' | 'all';
  dayName?: string;
  pandals: string[];
  createdAt: number;
  members: TeamMember[];
}

const STORAGE_KEY_TEAMS = 'pujo_db_teams';

// Pre-seeded Kolkata Community Squads for instant exploration
const DEFAULT_COMMUNITY_TEAMS: PlannedTeam[] = [
  {
    id: 'team-south-iconic',
    teamCode: 'PUJO-SOUTH-99',
    teamName: 'South Kolkata Grand Theme Squad',
    leaderName: 'Ananya Sengupta',
    leaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    leaderUid: 'seed-ananya',
    zone: 'south',
    dayName: 'Ashtami',
    pandals: ['Ekdalia Evergreen', 'Maddox Square', 'Singhi Park', 'Suruchi Sangha', 'Chetla Agrani'],
    createdAt: Date.now() - 3600000 * 3,
    members: [
      { uid: 'seed-ananya', name: 'Ananya Sengupta', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', joinedAt: Date.now() - 3600000 * 3 },
      { uid: 'seed-sourav', name: 'Sourav Ganguly', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', joinedAt: Date.now() - 3600000 * 2 }
    ]
  },
  {
    id: 'team-north-heritage',
    teamCode: 'PUJO-NORTH-77',
    teamName: 'North Heritage & Bonedi Bari Walkers',
    leaderName: 'Debanjan Mukherjee',
    leaderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    leaderUid: 'seed-debanjan',
    zone: 'north',
    dayName: 'Saptami',
    pandals: ['Bagbazar Sarbojanin', 'Kumartuli Park', 'Ahiritola Sarbojanin', 'Sovabazar Rajbari', 'Hatibagan Sarbojanin'],
    createdAt: Date.now() - 3600000 * 6,
    members: [
      { uid: 'seed-debanjan', name: 'Debanjan Mukherjee', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', joinedAt: Date.now() - 3600000 * 6 },
      { uid: 'seed-rohit', name: 'Rohit Bose', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', joinedAt: Date.now() - 3600000 * 5 }
    ]
  },
  {
    id: 'team-central-trail',
    teamCode: 'PUJO-CENTRAL-44',
    teamName: 'Central Kolkata Food & Illumination Trail',
    leaderName: 'Priyanka Das',
    leaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    leaderUid: 'seed-priyanka',
    zone: 'central',
    dayName: 'Nabami',
    pandals: ['College Square', 'Santosh Mitra Square (Lebutala)', 'Bowbazar Sarbojanin', 'Mohammad Ali Park'],
    createdAt: Date.now() - 3600000 * 1,
    members: [
      { uid: 'seed-priyanka', name: 'Priyanka Das', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', joinedAt: Date.now() - 3600000 * 1 }
    ]
  }
];

// Helper: Generate Random Team Code
export function generateTeamCode(zone: string = 'KOL'): string {
  const prefix = zone.toUpperCase().slice(0, 3);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PUJO-${prefix}-${randomNum}`;
}

// Get all teams from storage or default
export function getAllPlannedTeams(): PlannedTeam[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
    if (saved) {
      const parsed: PlannedTeam[] = JSON.parse(saved);
      // Merge with default community squads if not present
      const map = new Map<string, PlannedTeam>();
      DEFAULT_COMMUNITY_TEAMS.forEach(t => map.set(t.teamCode, t));
      parsed.forEach(t => map.set(t.teamCode, t));
      return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
    }
  } catch (e) {
    console.warn('Error reading teams from storage', e);
  }
  return DEFAULT_COMMUNITY_TEAMS;
}

// Save or Update a Planned Team
export function createOrUpdatePlannedTeam(team: Omit<PlannedTeam, 'createdAt' | 'members'> & { leaderUid: string; leaderName: string; leaderAvatar: string }): PlannedTeam {
  const all = getAllPlannedTeams();
  const existingIdx = all.findIndex(t => t.teamCode === team.teamCode || t.id === team.id);

  let fullTeam: PlannedTeam;

  if (existingIdx >= 0) {
    fullTeam = {
      ...all[existingIdx],
      ...team,
      members: all[existingIdx].members
    };
    all[existingIdx] = fullTeam;
  } else {
    fullTeam = {
      ...team,
      createdAt: Date.now(),
      members: [
        {
          uid: team.leaderUid,
          name: team.leaderName,
          avatar: team.leaderAvatar,
          joinedAt: Date.now()
        }
      ]
    };
    all.unshift(fullTeam);
  }

  try {
    localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(all));
  } catch (e) {
    console.warn('Error saving team to localStorage', e);
  }

  return fullTeam;
}

// Find team by Code, ID, or URL String
export function findTeamByCodeOrParam(codeOrInput: string, rawQueryString?: string): PlannedTeam | null {
  if (!codeOrInput && !rawQueryString) return null;

  const clean = (codeOrInput || '').trim();
  const searchSource = rawQueryString || (typeof window !== 'undefined' ? window.location.search : '') || clean;
  
  // 1. Check if input or searchSource contains encoded base64 payload
  const b64Match = (clean + '&' + searchSource).match(/data=(?:DATA_)?([A-Za-z0-9+/=]+)/) || clean.match(/^DATA_([A-Za-z0-9+/=]+)/);
  if (b64Match && b64Match[1]) {
    try {
      const rawB64 = b64Match[1];
      const jsonStr = decodeURIComponent(escape(atob(rawB64)));
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.pandals && Array.isArray(parsed.pandals)) {
        return {
          id: `team-shared-${Date.now()}`,
          teamCode: parsed.teamCode || 'PUJO-SHARED',
          teamName: parsed.teamName || `${parsed.zone ? parsed.zone.toUpperCase() : 'Kolkata'} Squad`,
          leaderName: parsed.leaderName || 'Pujo Devotee',
          leaderAvatar: parsed.leaderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          leaderUid: parsed.leaderUid || 'shared-user',
          zone: (parsed.zone as any) || 'south',
          dayName: parsed.dayName || 'Ashtami',
          pandals: parsed.pandals,
          createdAt: Date.now(),
          members: [
            { uid: 'shared-user', name: parsed.leaderName || 'Pujo Devotee', avatar: parsed.leaderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', joinedAt: Date.now() }
          ]
        };
      }
    } catch (e) {
      console.warn('Could not decode base64 team payload', e);
    }
  }

  // 2. Check if input is a full URL or contains joinTeam parameter
  let searchCode = clean;
  if (clean.includes('joinTeam=')) {
    try {
      const url = new URL(clean, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      searchCode = url.searchParams.get('joinTeam') || clean;
    } catch {
      const match = clean.match(/joinTeam=([^&]+)/);
      if (match) searchCode = decodeURIComponent(match[1]);
    }
  }

  const all = getAllPlannedTeams();
  const normalizedSearch = searchCode.trim().toUpperCase();

  // Match by exact code or ID in storage
  const directMatch = all.find(t => 
    t.teamCode.toUpperCase() === normalizedSearch || 
    t.id.toUpperCase() === normalizedSearch ||
    t.teamCode.replace(/[^A-Z0-9]/gi, '').toUpperCase() === normalizedSearch.replace(/[^A-Z0-9]/gi, '')
  );

  if (directMatch) return directMatch;

  // 3. Fallback: Parse URL params directly if pandals are present in query string
  try {
    const params = new URLSearchParams(searchSource.startsWith('?') ? searchSource : (clean.includes('?') ? clean.split('?')[1] : clean));
    const pandalsParam = params.get('pandals');
    if (pandalsParam) {
      const pandals = decodeURIComponent(pandalsParam).split('||').map(s => s.trim()).filter(Boolean);
      if (pandals.length > 0) {
        const zone = params.get('zone') || 'south';
        const day = params.get('day') || 'Ashtami';
        return {
          id: `team-url-${Date.now()}`,
          teamCode: searchCode || 'PUJO-SHARED',
          teamName: `${zone.toUpperCase()} Kolkata Squad`,
          leaderName: 'Pujo Devotee',
          leaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          leaderUid: 'url-user',
          zone: zone as any,
          dayName: day,
          pandals,
          createdAt: Date.now(),
          members: []
        };
      }
    }
  } catch (e) {
    console.warn('Could not parse query params fallback', e);
  }

  return null;
}

// Generate Custom Shareable Link for Team
export function generateTeamInviteUrl(team: PlannedTeam): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  // Pack compact payload so even on another device/browser without shared localStorage, the link loads the exact pandals
  const compactPayload = {
    teamCode: team.teamCode,
    teamName: team.teamName,
    leaderName: team.leaderName,
    leaderAvatar: team.leaderAvatar,
    zone: team.zone,
    dayName: team.dayName,
    pandals: team.pandals
  };

  let b64 = '';
  try {
    b64 = btoa(unescape(encodeURIComponent(JSON.stringify(compactPayload))));
  } catch { /* ignore */ }

  const encodedPandals = encodeURIComponent(team.pandals.join('||'));
  const zoneParam = encodeURIComponent(team.zone || 'south');
  const dayParam = team.dayName ? encodeURIComponent(team.dayName) : '';

  return `${origin}${pathname}?joinTeam=${encodeURIComponent(team.teamCode)}&zone=${zoneParam}&day=${dayParam}&pandals=${encodedPandals}${b64 ? `&data=DATA_${b64}` : ''}`;
}

// Join a Team
export function joinTeam(teamCode: string, user: { uid: string; displayName?: string | null; photoURL?: string | null }): PlannedTeam | null {
  const team = findTeamByCodeOrParam(teamCode);
  if (!team) return null;

  const memberName = user.displayName || 'Devotee';
  const memberAvatar = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;

  const all = getAllPlannedTeams();
  const idx = all.findIndex(t => t.teamCode === team.teamCode || t.id === team.id);

  if (idx >= 0) {
    const existingMembers = all[idx].members || [];
    if (!existingMembers.some(m => m.uid === user.uid)) {
      all[idx].members = [
        ...existingMembers,
        {
          uid: user.uid,
          name: memberName,
          avatar: memberAvatar,
          joinedAt: Date.now()
        }
      ];
      try {
        localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(all));
      } catch (e) {
        console.warn('Error joining team', e);
      }
    }
    return all[idx];
  }

  return team;
}
