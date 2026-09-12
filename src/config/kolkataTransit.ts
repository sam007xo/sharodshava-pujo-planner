/**
 * Kolkata Metro & Local Train Station Data
 * Used by the Plan Your Trip wizard to show nearest transit options for each pandal.
 *
 * Metro Line 1 (Blue Line): Dakshineswar ↔ New Garia (North–South corridor)
 * Metro Line 2 (Green Line, partial): Howrah Maidan ↔ Esplanade ↔ Sealdah ↔ Sector V
 * Local Train: Major stations near pandal-dense areas
 */

export interface TransitStation {
  name: string;
  bengaliName?: string;
  lat: number;
  lng: number;
  type: 'metro' | 'local-train';
  line: string;
  /** Pujo-period extended operating hours */
  pujoTimings: string;
  /** Normal operating hours */
  normalTimings: string;
  /** Approx headway in minutes during Pujo */
  pujoFrequencyMin: number;
  /** Approx headway in minutes normally */
  normalFrequencyMin: number;
}

export const KOLKATA_TRANSIT_STATIONS: TransitStation[] = [
  // ═══════════════════════════════════════════════════
  // METRO LINE 1 (Blue Line) — Dakshineswar ↔ New Garia
  // ═══════════════════════════════════════════════════
  {
    name: 'Dakshineswar',
    bengaliName: 'দক্ষিণেশ্বর',
    lat: 22.6545,
    lng: 88.3577,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Baranagar',
    bengaliName: 'বরানগর',
    lat: 22.6392,
    lng: 88.3688,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Noapara',
    bengaliName: 'নোয়াপাড়া',
    lat: 22.6310,
    lng: 88.3721,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Dum Dum',
    bengaliName: 'দমদম',
    lat: 22.6219,
    lng: 88.3800,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Belgachia',
    bengaliName: 'বেলগাছিয়া',
    lat: 22.6092,
    lng: 88.3815,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Shyambazar',
    bengaliName: 'শ্যামবাজার',
    lat: 22.5998,
    lng: 88.3735,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Sovabazar–Sutanuti',
    bengaliName: 'শোভাবাজার–সুতানুটি',
    lat: 22.5912,
    lng: 88.3635,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Girish Park',
    bengaliName: 'গিরীশ পার্ক',
    lat: 22.5832,
    lng: 88.3618,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Mahatma Gandhi Road (MG Road)',
    bengaliName: 'মহাত্মা গান্ধী রোড',
    lat: 22.5770,
    lng: 88.3612,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Central',
    bengaliName: 'সেন্ট্রাল',
    lat: 22.5669,
    lng: 88.3591,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Chandni Chowk',
    bengaliName: 'চাঁদনী চক',
    lat: 22.5614,
    lng: 88.3556,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Esplanade',
    bengaliName: 'এসপ্ল্যানেড',
    lat: 22.5555,
    lng: 88.3526,
    type: 'metro',
    line: 'Line 1 (Blue) / Line 2 (Green) Interchange',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 4,
    normalFrequencyMin: 7
  },
  {
    name: 'Park Street',
    bengaliName: 'পার্ক স্ট্রিট',
    lat: 22.5486,
    lng: 88.3525,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Maidan',
    bengaliName: 'ময়দান',
    lat: 22.5430,
    lng: 88.3470,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Rabindra Sadan',
    bengaliName: 'রবীন্দ্র সদন',
    lat: 22.5370,
    lng: 88.3447,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Netaji Bhavan',
    bengaliName: 'নেতাজি ভবন',
    lat: 22.5309,
    lng: 88.3420,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Jatin Das Park',
    bengaliName: 'যতীন দাস পার্ক',
    lat: 22.5241,
    lng: 88.3389,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Kalighat',
    bengaliName: 'কালীঘাট',
    lat: 22.5188,
    lng: 88.3405,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Rabindra Sarobar',
    bengaliName: 'রবীন্দ্র সরোবর',
    lat: 22.5100,
    lng: 88.3453,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'Masterda Surya Sen (Tollygunge)',
    bengaliName: 'মাস্টারদা সূর্যসেন (টালিগঞ্জ)',
    lat: 22.4985,
    lng: 88.3506,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },
  {
    name: 'New Garia',
    bengaliName: 'নিউ গড়িয়া',
    lat: 22.4594,
    lng: 88.3876,
    type: 'metro',
    line: 'Line 1 (Blue)',
    pujoTimings: '6:00 AM – 1:00 AM',
    normalTimings: '6:45 AM – 10:30 PM',
    pujoFrequencyMin: 5,
    normalFrequencyMin: 8
  },

  // ═══════════════════════════════════════════════════
  // METRO LINE 2 (Green Line) — Howrah Maidan ↔ Sector V (partial)
  // ═══════════════════════════════════════════════════
  {
    name: 'Howrah Maidan',
    bengaliName: 'হাওড়া ময়দান',
    lat: 22.5841,
    lng: 88.3425,
    type: 'metro',
    line: 'Line 2 (Green)',
    pujoTimings: '7:00 AM – 11:00 PM',
    normalTimings: '8:00 AM – 9:30 PM',
    pujoFrequencyMin: 8,
    normalFrequencyMin: 12
  },
  {
    name: 'Howrah',
    bengaliName: 'হাওড়া',
    lat: 22.5838,
    lng: 88.3460,
    type: 'metro',
    line: 'Line 2 (Green)',
    pujoTimings: '7:00 AM – 11:00 PM',
    normalTimings: '8:00 AM – 9:30 PM',
    pujoFrequencyMin: 8,
    normalFrequencyMin: 12
  },
  {
    name: 'Sealdah (Metro)',
    bengaliName: 'শিয়ালদহ (মেট্রো)',
    lat: 22.5665,
    lng: 88.3700,
    type: 'metro',
    line: 'Line 2 (Green)',
    pujoTimings: '7:00 AM – 11:00 PM',
    normalTimings: '8:00 AM – 9:30 PM',
    pujoFrequencyMin: 8,
    normalFrequencyMin: 12
  },

  // ═══════════════════════════════════════════════════
  // LOCAL TRAIN STATIONS (Major stations near pandal clusters)
  // ═══════════════════════════════════════════════════
  {
    name: 'Sealdah (Local)',
    bengaliName: 'শিয়ালদহ',
    lat: 22.5659,
    lng: 88.3705,
    type: 'local-train',
    line: 'Sealdah Division (All Sections)',
    pujoTimings: '5:00 AM – 1:30 AM (Extended)',
    normalTimings: '4:30 AM – 12:00 AM',
    pujoFrequencyMin: 10,
    normalFrequencyMin: 15
  },
  {
    name: 'Howrah (Local)',
    bengaliName: 'হাওড়া',
    lat: 22.5838,
    lng: 88.3425,
    type: 'local-train',
    line: 'Howrah Division (All Sections)',
    pujoTimings: '5:00 AM – 1:30 AM (Extended)',
    normalTimings: '4:30 AM – 12:00 AM',
    pujoFrequencyMin: 10,
    normalFrequencyMin: 15
  },
  {
    name: 'Dum Dum Junction (Local)',
    bengaliName: 'দমদম জংশন',
    lat: 22.6228,
    lng: 88.3852,
    type: 'local-train',
    line: 'Sealdah North Section',
    pujoTimings: '5:30 AM – 12:30 AM',
    normalTimings: '5:00 AM – 11:30 PM',
    pujoFrequencyMin: 12,
    normalFrequencyMin: 20
  },
  {
    name: 'Ballygunge Junction (Local)',
    bengaliName: 'বালিগঞ্জ জংশন',
    lat: 22.5267,
    lng: 88.3635,
    type: 'local-train',
    line: 'Sealdah South Section',
    pujoTimings: '5:30 AM – 12:30 AM',
    normalTimings: '5:00 AM – 11:30 PM',
    pujoFrequencyMin: 12,
    normalFrequencyMin: 20
  },
  {
    name: 'Jadavpur (Local)',
    bengaliName: 'যাদবপুর',
    lat: 22.4990,
    lng: 88.3716,
    type: 'local-train',
    line: 'Sealdah South Section',
    pujoTimings: '5:30 AM – 12:30 AM',
    normalTimings: '5:00 AM – 11:30 PM',
    pujoFrequencyMin: 12,
    normalFrequencyMin: 20
  },
  {
    name: 'Park Circus (Local)',
    bengaliName: 'পার্ক সার্কাস',
    lat: 22.5407,
    lng: 88.3680,
    type: 'local-train',
    line: 'Sealdah South Section',
    pujoTimings: '5:30 AM – 12:30 AM',
    normalTimings: '5:00 AM – 11:30 PM',
    pujoFrequencyMin: 12,
    normalFrequencyMin: 20
  },
  {
    name: 'Dhakuria (Local)',
    bengaliName: 'ধাকুরিয়া',
    lat: 22.5068,
    lng: 88.3595,
    type: 'local-train',
    line: 'Sealdah South Section',
    pujoTimings: '5:30 AM – 12:30 AM',
    normalTimings: '5:00 AM – 11:30 PM',
    pujoFrequencyMin: 15,
    normalFrequencyMin: 25
  },
  {
    name: 'Behala (Local / Budge Budge Line)',
    bengaliName: 'বেহালা',
    lat: 22.4950,
    lng: 88.3180,
    type: 'local-train',
    line: 'Budge Budge Branch (Sealdah)',
    pujoTimings: '5:30 AM – 12:00 AM',
    normalTimings: '5:00 AM – 11:00 PM',
    pujoFrequencyMin: 20,
    normalFrequencyMin: 30
  }
];

/**
 * Haversine distance in km between two geo-coordinates.
 */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface NearestStationResult {
  station: TransitStation;
  distanceKm: number;
  walkingMinutes: number; // at ~5 km/h
}

/**
 * Find the nearest metro OR local-train station for a given lat/lng.
 * Returns up to `limit` results, sorted by distance.
 */
export function findNearestStations(
  lat: number,
  lng: number,
  limit: number = 2,
  typeFilter?: 'metro' | 'local-train'
): NearestStationResult[] {
  const candidates = typeFilter
    ? KOLKATA_TRANSIT_STATIONS.filter(s => s.type === typeFilter)
    : KOLKATA_TRANSIT_STATIONS;

  return candidates
    .map(station => {
      const dist = haversineKm(lat, lng, station.lat, station.lng);
      return {
        station,
        distanceKm: Math.round(dist * 10) / 10,
        walkingMinutes: Math.round((dist / 5) * 60)
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/**
 * Optimizes a list of pandals into shortest-route order using nearest-neighbor TSP heuristic.
 * Starts from the user's GPS location (if provided) or from the first pandal.
 */
export function optimizeRoute(
  pandals: { lat: number; lng: number }[],
  startLat?: number,
  startLng?: number
): number[] {
  if (pandals.length <= 1) return pandals.map((_, i) => i);

  const visited = new Set<number>();
  const order: number[] = [];

  let currentLat = startLat ?? pandals[0].lat;
  let currentLng = startLng ?? pandals[0].lng;

  // If starting from GPS (not a pandal), don't mark any pandal as visited yet
  if (startLat !== undefined && startLng !== undefined) {
    // find closest unvisited pandal to GPS
  } else {
    // start from pandal[0]
    order.push(0);
    visited.add(0);
    currentLat = pandals[0].lat;
    currentLng = pandals[0].lng;
  }

  while (visited.size < pandals.length) {
    let bestIdx = -1;
    let bestDist = Infinity;

    for (let i = 0; i < pandals.length; i++) {
      if (visited.has(i)) continue;
      const d = haversineKm(currentLat, currentLng, pandals[i].lat, pandals[i].lng);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    if (bestIdx >= 0) {
      order.push(bestIdx);
      visited.add(bestIdx);
      currentLat = pandals[bestIdx].lat;
      currentLng = pandals[bestIdx].lng;
    }
  }

  return order;
}

/**
 * Calculate total route distance in km given ordered pandal indices.
 */
export function calculateRouteDistance(
  pandals: { lat: number; lng: number }[],
  order: number[],
  startLat?: number,
  startLng?: number
): number {
  if (order.length === 0) return 0;

  let total = 0;
  let prevLat = startLat ?? pandals[order[0]].lat;
  let prevLng = startLng ?? pandals[order[0]].lng;

  for (const idx of order) {
    total += haversineKm(prevLat, prevLng, pandals[idx].lat, pandals[idx].lng);
    prevLat = pandals[idx].lat;
    prevLng = pandals[idx].lng;
  }

  return Math.round(total * 10) / 10;
}
