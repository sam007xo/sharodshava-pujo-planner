import type { PandalPlace } from './festivalConfig';

export interface SubSectorInfo {
  id: string;
  code: string; // e.g. "NW", "NC", "NE", "CW", "C", "CE", "SW", "SC", "SE"
  title: string; // e.g. "North West", "Central", "South Central"
  zone: 'north' | 'central' | 'south';
  areas: string[]; // e.g. ['Shyambazar', 'Bagbazar', 'Chitpur']
  vibe: string;
  accentColor: string;
  badgeBg: string;
  borderColor: string;
  pandals: PandalPlace[];
}

export interface ZoneSectorsGroup {
  zoneKey: 'north' | 'central' | 'south';
  zoneName: string;
  bengaliName: string;
  accentColor: string;
  badgeColor: string;
  borderColor: string;
  sectors: SubSectorInfo[];
}

export const KOLKATA_SECTORS_DATA: ZoneSectorsGroup[] = [
  {
    zoneKey: 'north',
    zoneName: 'North Kolkata',
    bengaliName: 'উত্তর কলকাতা',
    accentColor: 'text-sky-400',
    badgeColor: 'bg-sky-500/15 border-sky-400/30 text-sky-300',
    borderColor: 'border-sky-500/20',
    sectors: [
      {
        id: 'north-west',
        code: 'NW',
        title: 'North West',
        zone: 'north',
        areas: ['Shyambazar', 'Bagbazar', 'Chitpur'],
        vibe: 'Historic Bonedi aristocrat mansions, Kumartuli idol artisans & Sabeki Ekchala tradition',
        accentColor: 'text-sky-300',
        badgeBg: 'bg-sky-500/20',
        borderColor: 'border-sky-400/40',
        pandals: [
          {
            name: 'Bagbazar Sarbojanin',
            zone: 'North Kolkata (North West)',
            vibe: 'Centenary traditional heritage, Sabeki Ekchala Pratima & thunderous Dhaak',
            lat: 22.6035,
            lng: 88.3685,
            address: '7, Bagbazar St, Baghbazar, Kolkata'
          },
          {
            name: 'Kumartuli Park',
            zone: 'North Kolkata (North West)',
            vibe: 'Sculptors’ sacred heartland tribute & exquisite clay idol craftsmanship',
            lat: 22.5995,
            lng: 88.3653,
            address: '8/B, Abhay Mitra St, Kumartuli, Kolkata'
          },
          {
            name: 'Sovabazar Rajbari',
            zone: 'North Kolkata (North West)',
            vibe: 'Centuries-old royal heritage Bonedi Bari Puja dating back to 1757',
            lat: 22.5975,
            lng: 88.3662,
            address: '36, Raja Nabakrishna St, Sovabazar, Kolkata'
          },
          {
            name: 'Ahiritola Sarbojanin',
            zone: 'North Kolkata (North West)',
            vibe: 'Historic riverside community heritage & deeply moving thematic artistry',
            lat: 22.5928,
            lng: 88.3586,
            address: '133, B.K. Paul Ave, Ahiritola, Kolkata'
          }
        ]
      },
      {
        id: 'north-central',
        code: 'NC',
        title: 'North Central',
        zone: 'north',
        areas: ['Hatibagan', 'Maniktala', 'Belgachia'],
        vibe: 'Centenary market pujos, traditional Dhaak beats & luminous street canopies',
        accentColor: 'text-cyan-300',
        badgeBg: 'bg-cyan-500/20',
        borderColor: 'border-cyan-400/40',
        pandals: [
          {
            name: 'Hatibagan Sarbojanin',
            zone: 'North Kolkata (North Central)',
            vibe: 'Historic centenary tradition, authentic North ethos & cultural fervor',
            lat: 22.5950,
            lng: 88.3715,
            address: 'Hatibagan, Shyambazar, Kolkata'
          },
          {
            name: 'Maniktala Chaltabagan Lohapatty',
            zone: 'North Kolkata (North Central)',
            vibe: 'Famed Dhunuchi Naach, festive celebrity hub & magnificent glass craftsmanship',
            lat: 22.5878,
            lng: 88.3705,
            address: 'Raja Rammohan Roy Sarani, Maniktala, Kolkata'
          },
          {
            name: 'Belgachia Sadharon Durgotsav',
            zone: 'North Kolkata (North Central)',
            vibe: 'Vibrant neighborhood heritage & warm community hospitality',
            lat: 22.6022,
            lng: 88.3842,
            address: 'Belgachia Rd, Milk Colony, Kolkata'
          }
        ]
      },
      {
        id: 'north-east',
        code: 'NE',
        title: 'North East',
        zone: 'north',
        areas: ['Kankurgachi', 'Phoolbagan', 'Ultadanga'],
        vibe: 'Grand modern architectural thematic installations & massive light gates',
        accentColor: 'text-indigo-300',
        badgeBg: 'bg-indigo-500/20',
        borderColor: 'border-indigo-400/40',
        pandals: [
          {
            name: 'Tala Prattoy',
            zone: 'North Kolkata (North East / Tala)',
            vibe: 'World-renowned architectural avant-garde contemporary art installation',
            lat: 22.6074,
            lng: 88.3792,
            address: 'Tala, Shyambazar, Kolkata'
          },
          {
            name: 'Telengabagan Sarbojanin (Ultadanga)',
            zone: 'North Kolkata (North East)',
            vibe: 'Pioneering thematic storytelling & intricately carved natural materials',
            lat: 22.5912,
            lng: 88.3895,
            address: 'Ultadanga Main Rd, Kolkata'
          },
          {
            name: 'Kankurgachi Mitali Sangha',
            zone: 'North Kolkata (North East)',
            vibe: 'Innovative visual narratives & lively neighborhood festival spirit',
            lat: 22.5768,
            lng: 88.3912,
            address: 'Kankurgachi, Kolkata'
          }
        ]
      }
    ]
  },
  {
    zoneKey: 'central',
    zoneName: 'Central Kolkata',
    bengaliName: 'মধ্য কলকাতা',
    accentColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
    borderColor: 'border-emerald-500/20',
    sectors: [
      {
        id: 'central-west',
        code: 'CW',
        title: 'Central West',
        zone: 'central',
        areas: ['Esplanade', 'Dharmatala', 'Park Street'],
        vibe: 'Colonial heritage avenue, buzzing street food, iconic boulevard lighting & nightlife',
        accentColor: 'text-teal-300',
        badgeBg: 'bg-teal-500/20',
        borderColor: 'border-teal-400/40',
        pandals: [
          {
            name: 'Babu Ghat (Strand Road)',
            zone: 'Central Kolkata (Central West)',
            vibe: 'Historic Ganga riverfront immersion ghat & spiritual waterfront sunset view',
            lat: 22.5645,
            lng: 88.3398,
            address: 'Strand Rd, B.B.D. Bagh, Kolkata'
          },
          {
            name: 'Janbazar Sarbojanin (Dharmatala)',
            zone: 'Central Kolkata (Central West)',
            vibe: 'Rani Rashmoni heritage connection & bustling historic central gathering',
            lat: 22.5612,
            lng: 88.3541,
            address: 'SN Banerjee Rd, Dharmatala, Kolkata'
          },
          {
            name: 'Park Street Cultural Pujo',
            zone: 'Central Kolkata (Central West)',
            vibe: 'Cosmopolitan culinary capital buzz & festive illumination avenue',
            lat: 22.5518,
            lng: 88.3524,
            address: 'Park Street, Kolkata'
          }
        ]
      },
      {
        id: 'central-core',
        code: 'C',
        title: 'Central',
        zone: 'central',
        areas: ['Bowbazar', 'College Street', 'Sealdah'],
        vibe: 'Iconic water tank reflections, heritage boipara, gold merchants & mammoth illumination arches',
        accentColor: 'text-emerald-300',
        badgeBg: 'bg-emerald-500/20',
        borderColor: 'border-emerald-400/40',
        pandals: [
          {
            name: 'College Square',
            zone: 'Central Kolkata (Central)',
            vibe: 'Legendary luminous reflection glowing across the historic water tank',
            lat: 22.5739,
            lng: 88.3639,
            address: 'College St, Bowbazar, Kolkata'
          },
          {
            name: 'Santosh Mitra Square (Lebutala)',
            zone: 'Central Kolkata (Central)',
            vibe: 'Record-shattering grand architectural spectacles & awe-inspiring lighting',
            lat: 22.5684,
            lng: 88.3662,
            address: 'Lebutala, Bowbazar, Kolkata'
          },
          {
            name: 'Mohammad Ali Park',
            zone: 'Central Kolkata (Central)',
            vibe: 'Monumental classical architecture replica & dazzling light arches',
            lat: 22.5797,
            lng: 88.3615,
            address: 'Chittaranjan Ave, Bowbazar, Kolkata'
          },
          {
            name: 'Bowbazar Sarbojanin',
            zone: 'Central Kolkata (Central)',
            vibe: 'Centuries-old gold merchant quarter heritage & classic warm community puja',
            lat: 22.5699,
            lng: 88.3644,
            address: 'Bepin Behari Ganguly St, Bowbazar, Kolkata'
          }
        ]
      },
      {
        id: 'central-east',
        code: 'CE',
        title: 'Central East',
        zone: 'central',
        areas: ['Entally', 'Moulali', 'Tangra'],
        vibe: 'Cultural harmony, community spirit, Chinatown gastronomy & enthusiastic local celebrations',
        accentColor: 'text-green-300',
        badgeBg: 'bg-green-500/20',
        borderColor: 'border-green-400/40',
        pandals: [
          {
            name: 'Entally Young Boys Club',
            zone: 'Central Kolkata (Central East)',
            vibe: 'Community camaraderie, artistic light tunnels & energetic festive beats',
            lat: 22.5562,
            lng: 88.3712,
            address: 'Convent Rd, Entally, Kolkata'
          },
          {
            name: 'Moulali Youth Association',
            zone: 'Central Kolkata (Central East)',
            vibe: 'Historic secular community celebrations & neighborhood unity',
            lat: 22.5604,
            lng: 88.3688,
            address: 'AJC Bose Rd, Moulali, Kolkata'
          },
          {
            name: 'Tangra Cultural Sarbojanin',
            zone: 'Central Kolkata (Central East)',
            vibe: 'Unique fusion of Kolkata Chinatown harmony & vibrant Bengali festive spirit',
            lat: 22.5489,
            lng: 88.3892,
            address: 'Tangra, Kolkata'
          }
        ]
      }
    ]
  },
  {
    zoneKey: 'south',
    zoneName: 'South Kolkata',
    bengaliName: 'দক্ষিণ কলকাতা',
    accentColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
    borderColor: 'border-amber-500/20',
    sectors: [
      {
        id: 'south-west',
        code: 'SW',
        title: 'South West',
        zone: 'south',
        areas: ['Behala', 'New Alipore', 'Alipore'],
        vibe: 'Award-winning conceptual art installations, monumental themes & aristocratic tree-lined boulevards',
        accentColor: 'text-orange-300',
        badgeBg: 'bg-orange-500/20',
        borderColor: 'border-orange-400/40',
        pandals: [
          {
            name: 'Suruchi Sangha',
            zone: 'South Kolkata (South West)',
            vibe: 'Masterful cultural storytelling showcasing diverse Indian artisanal crafts',
            lat: 22.5115,
            lng: 88.3375,
            address: 'New Alipore, Kolkata'
          },
          {
            name: 'Behala Club Sarbojanin',
            zone: 'South Kolkata (South West)',
            vibe: 'Acclaimed experimental installations & thought-provoking modern themes',
            lat: 22.4982,
            lng: 88.3184,
            address: 'Banamali Naskar Rd, Behala, Kolkata'
          },
          {
            name: 'Barisha Club (Behala)',
            zone: 'South Kolkata (South West)',
            vibe: 'Socially conscious contemporary art & heart-touching thematic sculptures',
            lat: 22.4842,
            lng: 88.3128,
            address: 'Diamond Harbour Rd, Barisha, Kolkata'
          },
          {
            name: 'Alipore Sarbojanin',
            zone: 'South Kolkata (South West)',
            vibe: 'Green serene setting, royal heritage ambience & refined craftsmanship',
            lat: 22.5284,
            lng: 88.3298,
            address: 'Alipore Park Rd, Kolkata'
          }
        ]
      },
      {
        id: 'south-central',
        code: 'SC',
        title: 'South Central',
        zone: 'south',
        areas: ['Kalighat', 'Rashbihari', 'Ballygunge'],
        vibe: 'Pujo epicenter, legendary Maddox Square lawn adda, German chandeliers & massive crowd pullers',
        accentColor: 'text-amber-300',
        badgeBg: 'bg-amber-500/20',
        borderColor: 'border-amber-400/40',
        pandals: [
          {
            name: 'Maddox Square',
            zone: 'South Kolkata (South Central)',
            vibe: 'The iconic open adda green, bustling youth carnival, food & endless conversations',
            lat: 22.5312,
            lng: 88.3582,
            address: 'Pritam Mookerjee Rd, Ballygunge, Kolkata'
          },
          {
            name: 'Ballygunge Cultural Association',
            zone: 'South Kolkata (South Central)',
            vibe: 'Subtle artistic elegance, serene traditional vibes & breathtaking lighting displays',
            lat: 22.5234,
            lng: 88.3667,
            address: '57, Jatin Das Rd, Lake Terrace, Kolkata'
          },
          {
            name: 'Tridhara Sammilani',
            zone: 'South Kolkata (South Central)',
            vibe: 'Thought-provoking high-concept artistic design harmonizing sculpture & emotion',
            lat: 22.5204,
            lng: 88.3619,
            address: 'Manoher Pukur Rd, Dover Terrace, Kolkata'
          },
          {
            name: 'Deshapriya Park',
            zone: 'South Kolkata (South Central)',
            vibe: 'Record-breaking monumental scale, sprawling grounds & festive food stalls',
            lat: 22.5186,
            lng: 88.3532,
            address: 'Deshapriya Park, Rashbehari Ave, Kolkata'
          },
          {
            name: 'Kalighat Milan Sangha',
            zone: 'South Kolkata (South Central)',
            vibe: 'Sacred temple precinct aura, traditional fervor & authentic Kali temple heritage',
            lat: 22.5208,
            lng: 88.3435,
            address: 'Kalighat, Kolkata'
          }
        ]
      },
      {
        id: 'south-east',
        code: 'SE',
        title: 'South East',
        zone: 'south',
        areas: ['Gariahat', 'Jadavpur', 'Dhakuria'],
        vibe: 'Fabled Chandannagar light galleries, Lake Kalibari tranquility, shopping hubs & university fervor',
        accentColor: 'text-rose-300',
        badgeBg: 'bg-rose-500/20',
        borderColor: 'border-rose-400/40',
        pandals: [
          {
            name: 'Ekdalia Evergreen',
            zone: 'South Kolkata (South East)',
            vibe: 'Enchanting German chandeliers, classic golden Sabeki Pratima & royal illumination',
            lat: 22.5218,
            lng: 88.3670,
            address: '15, Ekdalia Rd, Gariahat, Kolkata'
          },
          {
            name: 'Singhi Park',
            zone: 'South Kolkata (South East)',
            vibe: 'Grand architectural replica palaces & glowing animated light canopies',
            lat: 22.5211,
            lng: 88.3654,
            address: 'Gariahat, Dover Terrace, Kolkata'
          },
          {
            name: 'Mudiali Club',
            zone: 'South Kolkata (South East / Dhakuria)',
            vibe: 'Eco-conscious artistic brilliance, organic materials & touching Bijoya traditions',
            lat: 22.5132,
            lng: 88.3491,
            address: 'Mudiali, Southern Ave, Kolkata'
          },
          {
            name: 'Babu Bagan Club (Dhakuria)',
            zone: 'South Kolkata (South East)',
            vibe: 'Heritage coin / stamp replicas, ornate classical structures & tranquil lake breeze',
            lat: 22.5065,
            lng: 88.3668,
            address: 'Dhakuria, Kolkata'
          },
          {
            name: 'Jadavpur Central Sarbojanin',
            zone: 'South Kolkata (South East)',
            vibe: 'Youthful intellectual adda, vibrant folk art & student community spirit',
            lat: 22.4988,
            lng: 88.3712,
            address: 'Jadavpur, Kolkata'
          }
        ]
      }
    ]
  }
];
