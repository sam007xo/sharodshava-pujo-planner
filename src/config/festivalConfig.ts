export interface PandalPlace {
  name: string;
  zone: string;
  vibe: string;
  lat: number;
  lng: number;
  address: string;
}

export interface FestivalDay {
  id: string;
  name: string; // e.g., 'Shashti', 'Saptami', 'Ashtami', 'Nabami', 'Dashami'
  bengaliName?: string;
  date: string; // ISO format 'YYYY-MM-DD'
  displayDate: string; // e.g., '18 October'
  ordinal: number; // e.g., 6 for Shashti, 7 for Saptami, etc.
  ordinalLabel: string; // e.g., '6th day of Durga Puja'
  significance: string;
  highlights: string[];
  rituals: string[];
  suggestedActivities?: string[];
  places?: PandalPlace[];
  shaktiAspect?: string;
  weaponAspect?: string;
  shaktiMantra?: string;
}

export interface FestivalConfig {
  id: string;
  name: string;
  bengaliTitle?: string;
  year: number;
  tagline: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  description: string;
  days: FestivalDay[];
  creatorCredits: {
    title: string;
    creators: string[];
  };
}

export type FestivalStatusType = 'BEFORE' | 'DURING' | 'AFTER';

export interface FestivalStatus {
  status: FestivalStatusType;
  daysRemaining?: number;
  currentDay?: FestivalDay;
  nextDay?: FestivalDay;
}

/**
 * Centralized Festival Configuration
 * Durga Puja 2026 configured according to traditional calendar and prompt specifications.
 * Extensible for future festivals (Kali Puja, Diwali, Christmas, etc.)
 */
export const DURGA_PUJA_2026: FestivalConfig = {
  id: 'durga-puja-2026',
  name: 'Durga Puja',
  bengaliTitle: 'শারদোৎসব',
  year: 2026,
  tagline: 'Plan your festival. Experience every moment.',
  startDate: '2026-10-16', // Maha Shashthi
  endDate: '2026-10-21', // Vijaya Dashami
  description: 'The magnificent autumn carnival celebrating divine feminine energy, art, community, and togetherness.',
  creatorCredits: {
    title: 'Created by',
    creators: ['Soutrik Dutta', 'Samriddhi Ray', 'Satadru Addya']
  },
  days: [
    {
      id: 'shashti',
      name: 'Maha Shashthi',
      bengaliName: 'মহা ষষ্ঠী',
      date: '2026-10-16',
      displayDate: '16 October (Friday)',
      ordinal: 6,
      ordinalLabel: 'Friday • 16 October 2026',
      significance: 'Bodhon & Amontron (Awakening & Welcoming the Goddess)',
      highlights: [
        'Unveiling of the Goddess’ face (Bodhon)',
        'Resonance of the first ceremonial Dhaak beats',
        'Evening pandal hopping starts across the city'
      ],
      rituals: ['Devi Bodhon', 'Amontron & Adhibas', 'Prana Pratishtha'],
      shaktiAspect: 'Katyayani Shakti (Awakening & Bodhon)',
      weaponAspect: 'Shankha (Sacred Conch)',
      shaktiMantra: 'ॐ হ্রীং ক্লীং কালাত্যৈ নমঃ',
      places: [
        { 
          name: 'Bagbazar Sarbojanin', 
          zone: 'North Kolkata', 
          vibe: 'Traditional heritage, Sabeki Pratima & Dhaak',
          lat: 22.6035,
          lng: 88.3685,
          address: '7, Bagbazar St, Baghbazar, Kolkata'
        },
        { 
          name: 'Mohammad Ali Park', 
          zone: 'Central Kolkata', 
          vibe: 'Majestic classical architecture & grand lighting',
          lat: 22.5797,
          lng: 88.3615,
          address: 'Chittaranjan Ave, Bowbazar, Kolkata'
        },
        { 
          name: 'Ballygunge Cultural', 
          zone: 'South Kolkata', 
          vibe: 'Artistic elegance, serene ambience & illumination',
          lat: 22.5234,
          lng: 88.3667,
          address: '57, Jatin Das Rd, Lake Terrace, Kolkata'
        }
      ]
    },
    {
      id: 'saptami',
      name: 'Maha Saptami',
      bengaliName: 'মহা সপ্তমী',
      date: '2026-10-17',
      displayDate: '17 October (Saturday)',
      ordinal: 7,
      ordinalLabel: 'Saturday • 17 October 2026',
      significance: 'Kola Bou Snan (Sacred Nabapatrika Bathing)',
      highlights: [
        'Bathing of the Nabapatrika (Banana bride) at sunrise',
        'Traditional Anjali offering in crisp new ethnic attire',
        'Midnight street food crawls & luminous illumination trails'
      ],
      rituals: ['Nabapatrika Pravesh', 'Saptami Vihit Puja', 'Prasad Vitaran'],
      shaktiAspect: 'Kalaratri & Prana Shakti (9 Flora of Nabapatrika)',
      weaponAspect: 'Padma & Dhanush-Bana (Lotus & Bow)',
      shaktiMantra: 'ॐ কালরাত্র্যৈ নমঃ — নবপত্রিকাবাসিন্যৈ নমঃ',
      places: [
        { 
          name: 'Kumartuli Park', 
          zone: 'North Kolkata', 
          vibe: 'Sculptors’ sacred heartland tribute & artistry',
          lat: 22.5995,
          lng: 88.3653,
          address: '8/B, Abhay Mitra St, Kumartuli, Kolkata'
        },
        { 
          name: 'College Square', 
          zone: 'Central Kolkata', 
          vibe: 'Luminous water reflection on the historic lake',
          lat: 22.5739,
          lng: 88.3639,
          address: 'College St, Bowbazar, Kolkata'
        },
        { 
          name: 'Maddox Square', 
          zone: 'South Kolkata', 
          vibe: 'Epic open adda hub, vibrant youth culture & lawn gathering',
          lat: 22.5312,
          lng: 88.3582,
          address: 'Pritam Mookerjee Rd, Ballygunge, Kolkata'
        }
      ]
    },
    {
      id: 'ashtami',
      name: 'Maha Ashtami',
      bengaliName: 'মহা অষ্টমী',
      date: '2026-10-19',
      displayDate: '19 October (Monday)',
      ordinal: 8,
      ordinalLabel: 'Monday • 19 October 2026',
      significance: 'Pushpanjali & Sandhi Puja (Peak of Festivity)',
      highlights: [
        'Morning Pushpanjali clad in traditional red & white',
        '108 lotuses & 108 earthen lamps for Sandhi Puja',
        'Reverberating Dhunuchi Naach to the thunder of Dhaakis'
      ],
      rituals: ['Maha Ashtami Anjali', 'Sandhi Puja (108 Pradeep)', 'Kumari Puja'],
      shaktiAspect: 'Mahisasuramardini (Roudra Shakti & 108 Pradeep Sandhi Puja)',
      weaponAspect: 'Trishul & Khadga (Trident & Sword)',
      shaktiMantra: 'সর্বমঙ্গলামঙ্গল্যে শিবে সর্বার্থসাধিকে',
      places: [
        { 
          name: 'Hatibagan Sarbojanin', 
          zone: 'North Kolkata', 
          vibe: 'Historic centenary tradition & authentic North ethos',
          lat: 22.5950,
          lng: 88.3715,
          address: 'Hatibagan, Shyambazar, Kolkata'
        },
        { 
          name: 'Santosh Mitra Square', 
          zone: 'Central Kolkata', 
          vibe: 'Record-setting grand installations & awe-inspiring lighting',
          lat: 22.5684,
          lng: 88.3662,
          address: 'Lebutala, Bowbazar, Kolkata'
        },
        { 
          name: 'Ekdalia Evergreen', 
          zone: 'South Kolkata', 
          vibe: 'Classic idol & magnificent German chandeliers',
          lat: 22.5218,
          lng: 88.3670,
          address: '15, Ekdalia Rd, Gariahat, Kolkata'
        },
        { 
          name: 'Suruchi Sangha', 
          zone: 'South Kolkata', 
          vibe: 'Thematic visual storytelling & pan-Indian crafts',
          lat: 22.5115,
          lng: 88.3375,
          address: 'New Alipore, Kolkata'
        }
      ]
    },
    {
      id: 'nabami',
      name: 'Maha Navami',
      bengaliName: 'মহা নবমী',
      date: '2026-10-20',
      displayDate: '20 October (Tuesday)',
      ordinal: 9,
      ordinalLabel: 'Tuesday • 20 October 2026',
      significance: 'Maha Yajna & Celebratory Evening Carnival',
      highlights: [
        'Maha Yajna and final grand evening Aarti',
        'Savoring steaming Bhog prasad (Khichuri & Labra)',
        'All-night revelry and pandal hopping before farewell'
      ],
      rituals: ['Maha Navami Homam', 'Balidan & Aarti', 'Bhog Nibedan'],
      shaktiAspect: 'Siddhidatri (Fulfillment of Divine Grace & Maha Yajna)',
      weaponAspect: 'Sudarshana Chakra & Gada (Discus & Mace)',
      shaktiMantra: 'সিদ্ধিগন্ধর্বযক্ষাদ্যৈরসুরৈরমরৈরপি',
      places: [
        { 
          name: 'Tala Prattoy', 
          zone: 'North Kolkata', 
          vibe: 'Avant-garde contemporary art installation',
          lat: 22.6074,
          lng: 88.3792,
          address: 'Tala, Shyambazar, Kolkata'
        },
        { 
          name: 'Mohammad Ali Park', 
          zone: 'Central Kolkata', 
          vibe: 'Iconic Central landmark & vibrant night carnival',
          lat: 22.5797,
          lng: 88.3615,
          address: 'Chittaranjan Ave, Bowbazar, Kolkata'
        },
        { 
          name: 'Tridhara Sammilani', 
          zone: 'South Kolkata', 
          vibe: 'High-concept avant-garde design & artistic harmony',
          lat: 22.5204,
          lng: 88.3619,
          address: 'Manoher Pukur Rd, Dover Terrace, Kolkata'
        }
      ]
    },
    {
      id: 'dashami',
      name: 'Vijaya Dashami',
      bengaliName: 'বিজয়া দশমী',
      date: '2026-10-21',
      displayDate: '21 October (Wednesday)',
      ordinal: 10,
      ordinalLabel: 'Wednesday • 21 October 2026',
      significance: 'Sindoor Khela, Visarjan & Shubho Bijoya',
      highlights: [
        'Sindoor Khela — joyful vermilion celebrations',
        'Ghat Visarjan along the Hooghly river banks',
        'Shubho Bijoya greetings, warmth, and fresh sweets (sandesh)'
      ],
      rituals: ['Aparajita Puja', 'Devi Baran & Sindoor Khela', 'Maha Visarjan'],
      shaktiAspect: 'Aparajita (Unconquered Victory, Sindoor Khela & Farewell)',
      weaponAspect: 'Vajra & Parashu (Thunderbolt & Axe)',
      shaktiMantra: 'অপরাজিতা জয়ং দেহি শত্রুনাশং চ কুরু মে',
      places: [
        { 
          name: 'Sovabazar Rajbari', 
          zone: 'North Kolkata', 
          vibe: 'Centuries-old royal farewell & palanquin immersion procession',
          lat: 22.5975,
          lng: 88.3662,
          address: '36, Raja Nabakrishna St, Sovabazar, Kolkata'
        },
        { 
          name: 'Babu Ghat (Strand Road)', 
          zone: 'Central Kolkata', 
          vibe: 'Historic immersion spectacles on the sacred Ganga waterfront',
          lat: 22.5645,
          lng: 88.3398,
          address: 'Strand Rd, B.B.D. Bagh, Kolkata'
        },
        { 
          name: 'Mudiali Club', 
          zone: 'South Kolkata', 
          vibe: 'Eco-conscious artistry & touching Bijoya farewell rituals',
          lat: 22.5132,
          lng: 88.3491,
          address: 'Mudiali, Southern Ave, Kolkata'
        }
      ]
    }
  ]
};

/**
 * Calculates current festival state based on any given date.
 */
export function getFestivalStatus(currentDate: Date = new Date(), festival: FestivalConfig = DURGA_PUJA_2026): FestivalStatus {
  // Normalize date strings to midnight for clean comparison
  const nowYear = currentDate.getFullYear();
  const nowMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const nowDay = String(currentDate.getDate()).padStart(2, '0');
  const todayStr = `${nowYear}-${nowMonth}-${nowDay}`;

  const startDateStr = festival.startDate;
  const endDateStr = festival.endDate;

  // Compare date strings YYYY-MM-DD
  if (todayStr < startDateStr) {
    // Before festival begins
    const startMs = new Date(startDateStr + 'T00:00:00').getTime();
    const currentMs = new Date(todayStr + 'T00:00:00').getTime();
    const diffDays = Math.ceil((startMs - currentMs) / (1000 * 60 * 60 * 24));

    return {
      status: 'BEFORE',
      daysRemaining: diffDays > 0 ? diffDays : 1,
      nextDay: festival.days[0]
    };
  } else if (todayStr > endDateStr) {
    // After festival ends
    return {
      status: 'AFTER'
    };
  } else {
    // During festival: find matching day
    const matchingDay = festival.days.find(d => d.date === todayStr);
    
    // If exact match found, use it; otherwise fallback to first day or appropriate index
    const activeDay = matchingDay || festival.days[0];

    return {
      status: 'DURING',
      currentDay: activeDay
    };
  }
}

export interface KolkataZoneInfo {
  id: 'all' | 'north' | 'central' | 'south';
  name: string;
  bengaliName: string;
  tagline: string;
  color: string;
  accentBg: string;
  borderColor: string;
  glowColor: string;
  textColor: string;
  landmarks: string[];
}

export const KOLKATA_ZONES: KolkataZoneInfo[] = [
  {
    id: 'north',
    name: 'North Kolkata',
    bengaliName: 'উত্তর কলকাতা',
    tagline: 'Sabeki heritage, narrow alleys, tram tracks & centenary Bonedi Bari Pujos',
    color: '#38bdf8', // Sky Blue matching map
    accentBg: 'bg-sky-500/15',
    borderColor: 'border-sky-400',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    textColor: 'text-sky-300',
    landmarks: ['Bagbazar', 'Sovabazar', 'Kumartuli', 'Shyambazar', 'Hatibagan', 'Tala Prattoy', 'Ahiritola']
  },
  {
    id: 'central',
    name: 'Central Kolkata',
    bengaliName: 'মধ্য কলকাতা',
    tagline: 'Colonial grandeur, lake illumination reflection, College Street & iconic squares',
    color: '#4ade80', // Green matching map
    accentBg: 'bg-green-500/15',
    borderColor: 'border-green-400',
    glowColor: 'rgba(74, 222, 128, 0.4)',
    textColor: 'text-green-300',
    landmarks: ['College Square', 'Mohammad Ali Park', 'Santosh Mitra Square', 'Babu Ghat', 'Bowbazar']
  },
  {
    id: 'south',
    name: 'South Kolkata',
    bengaliName: 'দক্ষিণ কলকাতা',
    tagline: 'Avant-garde theme pandals, majestic chandeliers, adda parks & cosmopolitan festival energy',
    color: '#fb923c', // Warm Orange matching map
    accentBg: 'bg-orange-500/15',
    borderColor: 'border-orange-400',
    glowColor: 'rgba(251, 146, 60, 0.4)',
    textColor: 'text-orange-300',
    landmarks: ['Maddox Square', 'Ekdalia Evergreen', 'Ballygunge Cultural', 'Suruchi Sangha', 'Tridhara Sammilani', 'Mudiali Club']
  }
];

export const ZONE_ICONIC_PANDALS: Record<'north' | 'central' | 'south', PandalPlace[]> = {
  north: [
    {
      name: 'Bagbazar Sarbojanin',
      zone: 'North Kolkata',
      vibe: 'Centenary traditional heritage, Sabeki Ekchala Pratima & thunderous Dhaak',
      lat: 22.6035,
      lng: 88.3685,
      address: '7, Bagbazar St, Baghbazar, Kolkata'
    },
    {
      name: 'Kumartuli Park',
      zone: 'North Kolkata',
      vibe: 'Sculptors’ sacred heartland tribute & exquisite clay idol craftsmanship',
      lat: 22.5995,
      lng: 88.3653,
      address: '8/B, Abhay Mitra St, Kumartuli, Kolkata'
    },
    {
      name: 'Sovabazar Rajbari',
      zone: 'North Kolkata',
      vibe: 'Centuries-old royal heritage Bonedi Bari Puja dating back to 1757',
      lat: 22.5975,
      lng: 88.3662,
      address: '36, Raja Nabakrishna St, Sovabazar, Kolkata'
    },
    {
      name: 'Hatibagan Sarbojanin',
      zone: 'North Kolkata',
      vibe: 'Historic centenary tradition, authentic North ethos & cultural fervor',
      lat: 22.5950,
      lng: 88.3715,
      address: 'Hatibagan, Shyambazar, Kolkata'
    },
    {
      name: 'Tala Prattoy',
      zone: 'North Kolkata',
      vibe: 'World-renowned architectural avant-garde contemporary art installation',
      lat: 22.6074,
      lng: 88.3792,
      address: 'Tala, Shyambazar, Kolkata'
    },
    {
      name: 'Ahiritola Sarbojanin',
      zone: 'North Kolkata',
      vibe: 'Historic riverside community heritage & deeply moving thematic artistry',
      lat: 22.5928,
      lng: 88.3586,
      address: '133, B.K. Paul Ave, Ahiritola, Kolkata'
    }
  ],
  central: [
    {
      name: 'College Square',
      zone: 'Central Kolkata',
      vibe: 'Legendary luminous reflection glowing across the historic water tank',
      lat: 22.5739,
      lng: 88.3639,
      address: 'College St, Bowbazar, Kolkata'
    },
    {
      name: 'Mohammad Ali Park',
      zone: 'Central Kolkata',
      vibe: 'Monumental classical architecture replica & dazzling light arches',
      lat: 22.5797,
      lng: 88.3615,
      address: 'Chittaranjan Ave, Bowbazar, Kolkata'
    },
    {
      name: 'Santosh Mitra Square (Lebutala)',
      zone: 'Central Kolkata',
      vibe: 'Record-shattering grand architectural spectacles & awe-inspiring lighting',
      lat: 22.5684,
      lng: 88.3662,
      address: 'Lebutala, Bowbazar, Kolkata'
    },
    {
      name: 'Babu Ghat (Strand Road)',
      zone: 'Central Kolkata',
      vibe: 'Historic Ganga riverfront immersion ghat & spiritual waterfront sunset view',
      lat: 22.5645,
      lng: 88.3398,
      address: 'Strand Rd, B.B.D. Bagh, Kolkata'
    },
    {
      name: 'Bowbazar Sarbojanin',
      zone: 'Central Kolkata',
      vibe: 'Centuries-old gold merchant quarter heritage & classic warm community puja',
      lat: 22.5699,
      lng: 88.3644,
      address: 'Bepin Behari Ganguly St, Bowbazar, Kolkata'
    }
  ],
  south: [
    {
      name: 'Maddox Square',
      zone: 'South Kolkata',
      vibe: 'The iconic open adda green, bustling youth carnival, food & endless conversations',
      lat: 22.5312,
      lng: 88.3582,
      address: 'Pritam Mookerjee Rd, Ballygunge, Kolkata'
    },
    {
      name: 'Ekdalia Evergreen',
      zone: 'South Kolkata',
      vibe: 'Enchanting German chandeliers, classic golden Sabeki Pratima & royal illumination',
      lat: 22.5218,
      lng: 88.3670,
      address: '15, Ekdalia Rd, Gariahat, Kolkata'
    },
    {
      name: 'Ballygunge Cultural',
      zone: 'South Kolkata',
      vibe: 'Subtle artistic elegance, serene traditional vibes & breathtaking lighting displays',
      lat: 22.5234,
      lng: 88.3667,
      address: '57, Jatin Das Rd, Lake Terrace, Kolkata'
    },
    {
      name: 'Suruchi Sangha',
      zone: 'South Kolkata',
      vibe: 'Masterful cultural storytelling showcasing diverse Indian artisanal crafts',
      lat: 22.5115,
      lng: 88.3375,
      address: 'New Alipore, Kolkata'
    },
    {
      name: 'Tridhara Sammilani',
      zone: 'South Kolkata',
      vibe: 'Thought-provoking high-concept artistic design harmonizing sculpture & emotion',
      lat: 22.5204,
      lng: 88.3619,
      address: 'Manoher Pukur Rd, Dover Terrace, Kolkata'
    },
    {
      name: 'Mudiali Club',
      zone: 'South Kolkata',
      vibe: 'Eco-conscious artistic brilliance, organic materials & touching Bijoya traditions',
      lat: 22.5132,
      lng: 88.3491,
      address: 'Mudiali, Southern Ave, Kolkata'
    }
  ]
};

