import { GoogleGenAI } from '@google/genai';
import { KOLKATA_SECTORS_DATA } from '../config/kolkataSectors';
import { findNearestStations } from '../config/kolkataTransit';
import { KOLKATA_RESTAURANTS_DATA } from '../config/kolkataRestaurants';

export interface LocationDataContext {
  latitude?: number;
  longitude?: number;
  locality?: string;
  activeRoutePandals?: string[];
}

const GEMINI_API_KEY = (import.meta as unknown as { env: Record<string, string> }).env.VITE_GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (err) {
    console.warn('[GeminiAi] Failed to initialize GoogleGenAI client:', err);
  }
}

// Distance helper
function haversineDist(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function buildGroundingKnowledge(location?: LocationDataContext): string {
  const lat = location?.latitude ?? 22.5726;
  const lng = location?.longitude ?? 88.3639;
  const locStr = location?.locality || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  
  // Real-time nearest metro stations
  const nearestMetros = findNearestStations(lat, lng, 3, 'metro')
    .map(r => `${r.station.name} (${r.station.line} - ~${r.distanceKm} km, ~${r.walkingMinutes} min walk)`)
    .join('; ');

  return [
    `USER CURRENT LOCATION: ${locStr}`,
    `NEAREST METRO STATIONS: ${nearestMetros}`,
    `ACTIVE ROUTE: ${location?.activeRoutePandals?.join(' -> ') || 'None selected'}`,
    'DURGA PUJA 2026 DATES: Maha Shashti (18 Oct), Saptami (19 Oct), Ashtami (20 Oct - Sandhi Puja 10:48 PM–11:36 PM), Navami (21 Oct), Dashami (22 Oct - Visarjan / Sindoor Khela).',
    'METRO SCHEDULE: Kolkata Metro Line 1 & Line 2 run extended night trains till 1:00 AM during Saptami–Navami.'
  ].join('\n');
}

export async function askGeminiPujoAi(
  userQuery: string,
  location?: LocationDataContext
): Promise<string> {
  const groundingContext = buildGroundingKnowledge(location);

  const systemInstruction = [
    'You are SHARODSHAV AI, a direct, concise Kolkata Durga Puja 2026 and real-time transit assistant.',
    'RULES:',
    '1. Be direct, natural, and helpful. Do NOT use canned marketing phrases like "Check the route planner".',
    '2. For nearest metro or transit queries, give the exact closest station name, line, and distance directly.',
    '3. Answer in 1 to 2 crisp sentences (max 40 words).',
    `4. Base answers strictly on the user location (${location?.locality || 'Kolkata'}) and grounding data.`
  ].join('\n');

  if (aiClient && GEMINI_API_KEY) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemInstruction}\n\nGROUNDING DATA:\n${groundingContext}\n\nUSER QUESTION:\n${userQuery}` }
            ]
          }
        ]
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('[GeminiAi] Gemini API call fallback:', err);
    }
  }

  return getDirectGroundedPujoResponse(userQuery, location);
}

/**
 * High-precision spatial query engine for direct, natural answers
 */
function getDirectGroundedPujoResponse(userQuery: string, location?: LocationDataContext): string {
  const q = userQuery.toLowerCase().trim();
  const lat = location?.latitude ?? 22.5726;
  const lng = location?.longitude ?? 88.3639;
  const userLoc = location?.locality || 'your location';

  // 1. Non-Pujo Filter
  const nonPujo = ['react', 'python', 'javascript', 'crypto', 'bitcoin', 'stock', 'election', 'coding', 'programming'];
  if (nonPujo.some(k => q.includes(k))) {
    return 'I can only assist with Kolkata Durga Puja 2026 pandals, rituals, transit routes, and food!';
  }

  // 2. Nearest Metro / Transit Stations
  if (q.includes('metro') || q.includes('station') || q.includes('train') || q.includes('transit')) {
    const metros = findNearestStations(lat, lng, 2, 'metro');
    if (metros.length > 0) {
      const first = metros[0];
      const second = metros[1];
      let res = `🚇 The nearest metro station to you (${userLoc}) is **${first.station.name}** (${first.station.line}, ~${first.distanceKm} km away, ~${first.walkingMinutes} min walk).`;
      if (second) {
        res += ` Next closest is **${second.station.name}** (~${second.distanceKm} km).`;
      }
      return res;
    }
    return `🚇 Nearest metro stations are located along Kolkata Metro Line 1 (Shyambazar to Kavi Subhash) and Green Line 2 (Sector V to Howrah).`;
  }

  // 3. Nearest Pandals to User Location
  if (q.includes('near') || q.includes('here') || q.includes('closest') || q.includes('around me') || q.includes('nearby')) {
    const allPandals: { name: string; zone: string; dist: number }[] = [];
    KOLKATA_SECTORS_DATA.forEach(zone => {
      zone.sectors.forEach(sec => {
        sec.pandals.forEach(p => {
          allPandals.push({
            name: p.name,
            zone: p.zone,
            dist: haversineDist(lat, lng, p.lat, p.lng)
          });
        });
      });
    });

    allPandals.sort((a, b) => a.dist - b.dist);
    const top3 = allPandals.slice(0, 3);
    if (top3.length > 0) {
      const listStr = top3.map(p => `**${p.name}** (~${p.dist} km, ${p.zone})`).join(', ');
      return `🏛️ The closest pandals to ${userLoc} are: ${listStr}.`;
    }
  }

  // 4. Food & Restaurants near location
  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('biryani') || q.includes('sweet')) {
    const sortedRest = [...KOLKATA_RESTAURANTS_DATA]
      .map(r => ({ ...r, dist: haversineDist(lat, lng, r.lat, r.lng) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);

    if (sortedRest.length > 0) {
      const restList = sortedRest.map(r => `**${r.name}** (~${r.dist} km - ${r.famousDishes.slice(0, 2).join(', ')})`).join('; ');
      return `🍽️ Top food spots closest to ${userLoc}: ${restList}.`;
    }
  }

  // 5. Zonal Icons
  if (q.includes('north')) {
    return '🏛️ Top North icons: Bagbazar Sarbojanin, Kumartuli Park, and Tala Prattoy (Metro: Shyambazar / Sovabazar).';
  }
  if (q.includes('south')) {
    return '✨ Top South icons: Ekdalia Evergreen, Maddox Square, and Suruchi Sangha (Metro: Kalighat / Rabindra Sarobar).';
  }
  if (q.includes('central')) {
    return '🏮 Top Central icons: College Square, Santosh Mitra Square, and Mohammad Ali Park (Metro: Central / MG Road).';
  }

  // 6. Ritual Timings
  if (q.includes('sandhi') || (q.includes('ashtami') && (q.includes('time') || q.includes('timing')))) {
    return '🪔 Maha Ashtami Sandhi Puja is on 20 October 2026 (10:48 PM – 11:36 PM) with the lighting of 108 earthen lamps.';
  }
  if (q.includes('pushpanjali') || q.includes('anjali')) {
    return '🌸 Pushpanjali is conducted every morning from Saptami to Navami between 8:30 AM and 11:30 AM at neighborhood and community pandals.';
  }
  if (q.includes('dashami') || q.includes('visarjan') || q.includes('sindoor')) {
    return '🌺 Vijaya Dashami is on 22 October 2026, with Sindoor Khela from 10:00 AM and Ganga immersions at Babu Ghat in the evening.';
  }
  if (q.includes('date') || q.includes('when') || q.includes('schedule')) {
    return '📅 Durga Puja 2026 is from 18 to 22 October: Shashti (18th), Saptami (19th), Ashtami (20th), Navami (21st), and Dashami (22nd).';
  }

  return `🪔 From ${userLoc}: The nearest iconic pandals are located along Metro Line 1 & Line 2. Let me know if you need specific route directions or food spots!`;
}