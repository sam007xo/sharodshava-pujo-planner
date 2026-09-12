export interface MenuItem {
  name: string;
  price: number;
  isVeg: boolean;
  bengaliName?: string;
  description?: string;
  isBestseller?: boolean;
}

export interface KolkataRestaurant {
  id: string;
  name: string;
  zone: 'north' | 'central' | 'south';
  sector: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceForTwo: number;
  lat: number;
  lng: number;
  address: string;
  timing: string;
  isPureVeg: boolean;
  hasVegOptions: boolean;
  famousDishes: string[];
  menu: MenuItem[];
}

export const KOLKATA_RESTAURANTS_DATA: KolkataRestaurant[] = [
  // ── North Kolkata ──────────────────────────────────────────
  {
    id: 'mitra-cafe',
    name: 'Mitra Cafe',
    zone: 'north',
    sector: 'Shyambazar / Bagbazar',
    cuisine: 'Bengali Heritage Snacks & Cutlets',
    rating: 4.6,
    reviewCount: 14200,
    priceForTwo: 350,
    lat: 22.5998,
    lng: 88.3735,
    address: '47, Jatindra Mohan Ave, Raja Nabakrishna St, Shyambazar, Kolkata',
    timing: '5:00 PM – 10:30 PM (Pujo special all-night counter)',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['Diamond Fish Fry', 'Mutton Brain Chop', 'Fish Kabiraji', 'Chicken Cutlet'],
    menu: [
      { name: 'Diamond Fish Fry (Bhetki)', price: 180, isVeg: false, isBestseller: true, description: 'Pure fresh Kolkata Bhetki fillet in crumbed batter' },
      { name: 'Special Fish Kabiraji', price: 210, isVeg: false, isBestseller: true, description: 'Crisp egg-netting wrapped over spiced fish fillet' },
      { name: 'Mutton Brain Chop', price: 130, isVeg: false, description: 'Legendary spiced delicacy served with kasundi' },
      { name: 'Chicken Cutlet', price: 140, isVeg: false, description: 'Crispy minced chicken cutlet with salad' },
      { name: 'Mochar Chop (Banana Blossom)', price: 60, isVeg: true, isBestseller: true, description: 'Traditional spiced plantain flower cutlet' },
      { name: 'Paneer Cutlet', price: 90, isVeg: true, description: 'Fresh spiced cottage cheese cutlet with mustard dip' }
    ]
  },
  {
    id: 'golbari',
    name: 'Golbari',
    zone: 'north',
    sector: 'Shyambazar',
    cuisine: 'Bengali Traditional Mutton & Paratha',
    rating: 4.4,
    reviewCount: 9800,
    priceForTwo: 500,
    lat: 22.6002,
    lng: 88.3738,
    address: 'Acharya Prafulla Chandra Rd, Shyambazar 5-Point, Kolkata',
    timing: '12:30 PM – 11:00 PM',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['Kosha Mangsho', 'Tandoori Roti', 'Mutton Liver Curry'],
    menu: [
      { name: 'Legendary Kosha Mangsho (4 pcs)', price: 340, isVeg: false, isBestseller: true, description: 'Slow-cooked dark, aromatic, rich mutton curry' },
      { name: 'Mutton Keema Curry', price: 280, isVeg: false, description: 'Minced spiced mutton with peas and whole garam masala' },
      { name: 'Triangle Layered Paratha', price: 25, isVeg: true, description: 'Flaky pan-toasted paratha, perfect with mutton' },
      { name: 'Kashmiri Alur Dum', price: 120, isVeg: true, isBestseller: true, description: 'Spicy slow-simmered baby potatoes with hing & ginger' }
    ]
  },
  {
    id: 'arssalan-shyambazar',
    name: 'Arsalan (Shyambazar)',
    zone: 'north',
    sector: 'Shyambazar / Hatibagan',
    cuisine: 'Mughlai & Kolkata Biryani',
    rating: 4.6,
    reviewCount: 21000,
    priceForTwo: 800,
    lat: 22.5992,
    lng: 88.3712,
    address: '138, Bidhan Sarani, Shyambazar, Kolkata',
    timing: '11:00 AM – 1:30 AM',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['Special Mutton Biryani', 'Chicken Chaap', 'Mutton Rezala', 'Firni'],
    menu: [
      { name: 'Special Mutton Biryani', price: 410, isVeg: false, isBestseller: true, description: 'Fragrant basmati rice with tender mutton, egg & golden potato' },
      { name: 'Royal Chicken Chaap', price: 280, isVeg: false, isBestseller: true, description: 'Slow-roasted chicken leg in rich poppy seed gravy' },
      { name: 'Mutton Rezala', price: 340, isVeg: false, description: 'Mutton pieces in fragrant white yogurt & cashew gravy' },
      { name: 'Shahi Firni in Matka', price: 85, isVeg: true, isBestseller: true, description: 'Chilled saffron rice pudding in earthen cup' }
    ]
  },
  {
    id: 'sweet-bengal-girish',
    name: 'Girish Chandra Dey & Nakur Chandra Nandy',
    zone: 'north',
    sector: 'Hatibagan / Hedua',
    cuisine: 'Iconic Heritage Sandesh & Sweets (Pure Veg)',
    rating: 4.8,
    reviewCount: 18500,
    priceForTwo: 200,
    lat: 22.5852,
    lng: 88.3695,
    address: '56, Ramdulal Sarkar St, Hedua, Kolkata',
    timing: '7:00 AM – 10:30 PM',
    isPureVeg: true,
    hasVegOptions: true,
    famousDishes: ['Jolbhora Sandesh', 'Chocolate Sandesh', 'Parijat', 'Kacha Golla'],
    menu: [
      { name: 'Classic Jolbhora Talsash Sandesh', price: 45, isVeg: true, isBestseller: true, description: 'Molten liquid nolen gur filled within soft chhana casing' },
      { name: 'Parijat Sandesh', price: 35, isVeg: true, isBestseller: true, description: 'Delicate floral flavored royal cottage cheese sweet' },
      { name: 'Chocolate Mousse Sandesh', price: 40, isVeg: true, description: 'Rich Dutch cocoa blended with pure Bengali chhana' },
      { name: 'Malai Chamcham (2 pcs)', price: 60, isVeg: true, description: 'Cream-topped traditional sweet soaked in saffron syrup' }
    ]
  },
  {
    id: 'haldirams-shyambazar',
    name: 'Haldiram’s (Shyambazar - Pure Veg)',
    zone: 'north',
    sector: 'Shyambazar Five Point',
    cuisine: 'Pure Vegetarian North & South Indian, Thalis & Chaats',
    rating: 4.5,
    reviewCount: 15400,
    priceForTwo: 380,
    lat: 22.6010,
    lng: 88.3745,
    address: '14, Bhupen Bose Ave, Shyambazar, Kolkata',
    timing: '8:00 AM – 10:30 PM',
    isPureVeg: true,
    hasVegOptions: true,
    famousDishes: ['Raj Kachori', 'Amritsari Chole Bhature', 'Special Veg Thali', 'Pav Bhaji'],
    menu: [
      { name: 'Signature Raj Kachori', price: 140, isVeg: true, isBestseller: true, description: 'Giant kachori filled with yogurt, sprouts & tangy chutneys' },
      { name: 'Amritsari Chole Bhature', price: 190, isVeg: true, isBestseller: true, description: 'Golden puffed bhaturas with rich spiced chickpea curry' },
      { name: 'Pujo Special Pure Veg Thali', price: 310, isVeg: true, isBestseller: true, description: 'Paneer butter masala, dal makhani, pulao, naan & sweet' },
      { name: 'Kaju Katli (250g box)', price: 280, isVeg: true, description: 'Diamond cut cashew fudge sweet' }
    ]
  },

  // ── Central Kolkata ────────────────────────────────────────
  {
    id: 'arsalan-park-circus',
    name: 'Arsalan',
    zone: 'central',
    sector: 'Park Circus / Moulali',
    cuisine: 'Mughlai & Kolkata Biryani',
    rating: 4.7,
    reviewCount: 38000,
    priceForTwo: 850,
    lat: 22.5432,
    lng: 88.3668,
    address: '191, Marina Arcade, Park Circus, Kolkata',
    timing: '11:00 AM – 2:00 AM (Pujo special 24h counters)',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['Arsalan Special Mutton Biryani', 'Chicken Chaap', 'Mutton Galawati Kebab', 'Firni'],
    menu: [
      { name: 'Special Mutton Biryani (2 pcs + Aloo + Egg)', price: 420, isVeg: false, isBestseller: true, description: 'Long-grain fragrant basmati rice, tender mutton & melt-in-mouth potato' },
      { name: 'Royal Chicken Chaap', price: 290, isVeg: false, isBestseller: true, description: 'Slow-roasted chicken in rich poppy seed & mace gravy' },
      { name: 'Mutton Galawati Kebab (4 pcs)', price: 360, isVeg: false, description: 'Lucknowi style melt-in-mouth smoked lamb patties' },
      { name: 'Paneer Tikka Butter Masala', price: 320, isVeg: true, isBestseller: true, description: 'Clay oven charred paneer cubes in velvety tomato makhani' },
      { name: 'Kolkata Shahi Firni', price: 85, isVeg: true, description: 'Chilled ground rice pudding served in earthen matka' }
    ]
  },
  {
    id: 'bhojohori-manna-esplanade',
    name: 'Bhojohori Manna',
    zone: 'central',
    sector: 'Esplanade / Bowbazar',
    cuisine: 'Authentic Traditional Bengali Feast',
    rating: 4.5,
    reviewCount: 16500,
    priceForTwo: 700,
    lat: 22.5654,
    lng: 88.3542,
    address: 'Esplanade Metro Arcade, Jawaharlal Nehru Rd, Kolkata',
    timing: '12:00 PM – 11:30 PM',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['Ilish Macher Paturi', 'Daab Chingri', 'Kolar Moca Ghonto', 'Mutton Dakbungalow'],
    menu: [
      { name: 'Ilish Bhapa / Paturi', price: 380, isVeg: false, isBestseller: true, description: 'Hilsa fish wrapped in banana leaf steamed with mustard & green chillies' },
      { name: 'Daab Chingri (Jumbo Prawns in Coconut)', price: 440, isVeg: false, isBestseller: true, description: 'Tender prawns cooked inside tender green coconut with mustard' },
      { name: 'Mutton Dakbungalow (2 pcs with egg)', price: 390, isVeg: false, isBestseller: true, description: 'Colonial style spicy mutton curry with whole boiled egg' },
      { name: 'Basanti Sweet Pulao with Kaju Raisins', price: 160, isVeg: true, isBestseller: true, description: 'Traditional golden yellow fragrant pulao' },
      { name: 'Chhanar Dalna (Cottage Cheese Curry)', price: 190, isVeg: true, description: 'Spongy chhana cakes simmered in ginger cumin gravy' }
    ]
  },
  {
    id: 'mocambo-park-street',
    name: 'Mocambo',
    zone: 'central',
    sector: 'Park Street',
    cuisine: 'Continental, Steaks & Seafood',
    rating: 4.7,
    reviewCount: 34000,
    priceForTwo: 1200,
    lat: 22.5518,
    lng: 88.3526,
    address: '25B, Park St, Taltala, Kolkata',
    timing: '11:30 AM – 11:30 PM',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['Devilled Crab', 'Chicken Tetrazzini', 'Fish Florentine', 'Chateaubriand Beef Steak'],
    menu: [
      { name: 'Devilled Crab in Shell', price: 490, isVeg: false, isBestseller: true, description: 'Baked crab meat in cheese and mustard sauce served in crab shell' },
      { name: 'Chicken Tetrazzini', price: 430, isVeg: false, isBestseller: true, description: 'Baked shredded chicken and spaghetti in rich bechamel cheese sauce' },
      { name: 'Fish Florentine (Baked Bhetki)', price: 460, isVeg: false, description: 'Kolkata Bhetki fillet on a bed of spinach topped with creamy cheese sauce' },
      { name: 'Vegetable Sizzler with Herb Rice', price: 380, isVeg: true, isBestseller: true, description: 'Sizzling cottage cheese steak, grilled corn, butter beans & pepper sauce' }
    ]
  },
  {
    id: 'haldirams-esplanade',
    name: 'Haldiram’s Prabhuji (Pure Veg)',
    zone: 'central',
    sector: 'Esplanade / Dharmatala',
    cuisine: 'North & South Indian Pure Vegetarian, Chaats & Sweets',
    rating: 4.6,
    reviewCount: 22000,
    priceForTwo: 400,
    lat: 22.5621,
    lng: 88.3518,
    address: '7, Chowringhee Rd, Esplanade, Kolkata',
    timing: '8:00 AM – 11:00 PM',
    isPureVeg: true,
    hasVegOptions: true,
    famousDishes: ['Signature Raj Kachori', 'Amritsari Chole Bhature', 'Special Masala Dosa', 'Pujo Pure Veg Thali'],
    menu: [
      { name: 'Signature Royal Raj Kachori', price: 145, isVeg: true, isBestseller: true, description: 'Crispy giant kachori stuffed with sprouts, yogurt, chutneys & sev' },
      { name: 'Amritsari Chole Bhature (2 pcs)', price: 195, isVeg: true, isBestseller: true, description: 'Puffed golden bhaturas with rich spiced chickpea curry' },
      { name: 'Special Butter Masala Dosa', price: 170, isVeg: true, description: 'Crispy fermented crepe with spiced potato filling, sambar & chutneys' },
      { name: 'Pujo Special Pure Veg Thali', price: 320, isVeg: true, isBestseller: true, description: 'Paneer butter masala, dal makhani, pulao, naan, raita, gulab jamun' },
      { name: 'Pani Puri / Puchka Platter (6 pcs)', price: 75, isVeg: true, description: 'Crispy semolina puris with tangy mint & tamarind water' }
    ]
  },
  {
    id: 'ganguram-central',
    name: 'Ganguram Sweets (Pure Veg)',
    zone: 'central',
    sector: 'Bowbazar / College St',
    cuisine: 'Legendary Bengali Sweets & Morning Radhaballavi (Pure Veg)',
    rating: 4.7,
    reviewCount: 19000,
    priceForTwo: 180,
    lat: 22.5695,
    lng: 88.3650,
    address: '158, Bepin Behari Ganguly St, Bowbazar, Kolkata',
    timing: '6:30 AM – 10:00 PM',
    isPureVeg: true,
    hasVegOptions: true,
    famousDishes: ['Mishti Doi', 'Radhaballavi with Aloo Dum', 'Nolen Gur Rosogolla', 'Langcha'],
    menu: [
      { name: 'Radhaballavi with Spiced Aloo Dum (2 pcs)', price: 60, isVeg: true, isBestseller: true, description: 'Lentil-stuffed puffed breads with thick hing aloo dum' },
      { name: 'Matka Mishti Doi (200g)', price: 55, isVeg: true, isBestseller: true, description: 'Authentic caramelized brown sweet yogurt in earthen pot' },
      { name: 'Warm Nolen Gurer Rosogolla (2 pcs)', price: 40, isVeg: true, isBestseller: true, description: 'Spongy cottage cheese balls soaked in palm jaggery syrup' },
      { name: 'Kaju Barfi Pack', price: 260, isVeg: true, description: 'Pure cashew diamond sweets' }
    ]
  },

  // ── South Kolkata ──────────────────────────────────────────
  {
    id: '6-ballygunge-place',
    name: '6 Ballygunge Place',
    zone: 'south',
    sector: 'Ballygunge / Maddox Square',
    cuisine: 'Fine Dining Aristocratic Bengali',
    rating: 4.8,
    reviewCount: 26000,
    priceForTwo: 1200,
    lat: 22.5278,
    lng: 88.3654,
    address: '6, Ballygunge Place, Ballygunge, Kolkata',
    timing: '12:00 PM – 11:30 PM (All-day buffet during Puja)',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['Chingri Malai Curry', 'Kosha Mangsho', 'Kacha Lanka Mangsho', 'Nolen Gurer Ice Cream'],
    menu: [
      { name: 'Golda Chingri Malai Curry', price: 460, isVeg: false, isBestseller: true, description: 'Giant river prawn in smooth spiced coconut cream gravy' },
      { name: 'Kacha Lanka Mangsho (Green Chilli Mutton)', price: 420, isVeg: false, isBestseller: true, description: 'Tender mutton stewed with fresh green chillies and coriander' },
      { name: 'Luchi (4 pcs) with Chholar Dal', price: 150, isVeg: true, isBestseller: true, description: 'Puffed golden white breads with sweet coconut dal' },
      { name: 'Enchorer Dalna (Green Jackfruit Curry)', price: 210, isVeg: true, description: 'Tender green jackfruit slow cooked like festive mutton' },
      { name: 'Artisanal Nolen Gurer Ice Cream', price: 120, isVeg: true, isBestseller: true, description: 'Creamy house-made date palm jaggery ice cream' }
    ]
  },
  {
    id: 'peter-cat',
    name: 'Peter Cat',
    zone: 'south',
    sector: 'Park Street / Camac St',
    cuisine: 'Continental, Sizzlers & Indo-Iranian',
    rating: 4.7,
    reviewCount: 42000,
    priceForTwo: 1100,
    lat: 22.5512,
    lng: 88.3532,
    address: '18A, Park St, Stephen Court, Kolkata',
    timing: '12:00 PM – 11:45 PM',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['The Legendary Cheelo Kebab', 'Chicken Stroganoff', 'Vegetable Sizzler', 'Irish Coffee'],
    menu: [
      { name: 'The Legendary Cheelo Kebab', price: 485, isVeg: false, isBestseller: true, description: 'Steamed butter rice topped with fried egg, mutton & chicken kebabs' },
      { name: 'Chicken Stroganoff with Buttered Rice', price: 420, isVeg: false, isBestseller: true, description: 'Juicy chicken strips in rich mushroom sour cream sauce' },
      { name: 'Vegetable Cheelo Platter', price: 360, isVeg: true, isBestseller: true, description: 'Butter rice with grilled vegetable patties, paneer skewers & tomato' },
      { name: 'Sizzling Vegetable Cottage Cheese Steak', price: 390, isVeg: true, description: 'Charred paneer steak with grilled veggies, fries & brown garlic sauce' }
    ]
  },
  {
    id: 'oudh-1590-deshapriya',
    name: 'Oudh 1590 (Deshapriya Park)',
    zone: 'south',
    sector: 'Deshapriya Park / Gariahat',
    cuisine: 'Period Dining Awadhi & Mughlai',
    rating: 4.7,
    reviewCount: 23000,
    priceForTwo: 950,
    lat: 22.5185,
    lng: 88.3565,
    address: '23/B, Deshapriya Park W, Manoharpukur, Kolkata',
    timing: '12:00 PM – 11:30 PM',
    isPureVeg: false,
    hasVegOptions: true,
    famousDishes: ['Awadhi Handi Biryani', 'Galawati Kebab', 'Murgh Pardah Biryani', 'Shahi Tukda'],
    menu: [
      { name: 'Awadhi Handi Mutton Biryani', price: 430, isVeg: false, isBestseller: true, description: 'Slow dum-cooked fragrant rice with tender bone-in mutton in clay handi' },
      { name: 'Galawati Kebab (4 pcs)', price: 370, isVeg: false, isBestseller: true, description: 'Melt-in-mouth smoked minced mutton patties with lucknowi spices' },
      { name: 'Murgh Irani Tangdi Kebab', price: 340, isVeg: false, description: 'Charcoal grilled marinated chicken drumsticks' },
      { name: 'Paneer Sugandhi', price: 310, isVeg: true, description: 'Cottage cheese cubes tossed in cardamom scented cashew gravy' }
    ]
  },
  {
    id: 'gupta-brothers-ballygunge',
    name: 'Gupta Brothers (Pure Veg)',
    zone: 'south',
    sector: 'Gariahat / Southern Ave',
    cuisine: 'Pure Vegetarian North Indian, South Indian & Chaats',
    rating: 4.6,
    reviewCount: 17000,
    priceForTwo: 450,
    lat: 22.5195,
    lng: 88.3621,
    address: '182, Sarat Bose Rd, Deshapriya Park, Kolkata',
    timing: '7:30 AM – 10:30 PM',
    isPureVeg: true,
    hasVegOptions: true,
    famousDishes: ['Morning Club Kachori', 'Special Pure Veg Thali', 'Paneer Lababdar', 'Kesar Kulfi Falooda'],
    menu: [
      { name: 'Morning Club Kachori with Hing Aloo Sabzi (4 pcs)', price: 95, isVeg: true, isBestseller: true, description: 'Mini crispy urad dal puris with spiced potato curry' },
      { name: 'Paneer Lababdar with Butter Naan', price: 290, isVeg: true, isBestseller: true, description: 'Grated and cubed paneer in rich onion tomato gravy' },
      { name: 'Dal Makhani Bukhara Style', price: 240, isVeg: true, description: 'Slow cooked black lentils simmered overnight with butter & cream' },
      { name: 'Kesar Pista Kulfi Falooda', price: 140, isVeg: true, isBestseller: true, description: 'Saffron pistachio dense ice cream with rose vermicelli' }
    ]
  },
  {
    id: 'balwant-singh-bhawanipur',
    name: 'Balwant Singh’s Eating House (Pure Veg)',
    zone: 'south',
    sector: 'Bhawanipur / Hazra',
    cuisine: 'Legendary Punjabi Dhaba & Tea (Pure Veg)',
    rating: 4.5,
    reviewCount: 31000,
    priceForTwo: 350,
    lat: 22.5320,
    lng: 88.3475,
    address: '10/10B, Harish Mukherjee Rd, Bhawanipur, Kolkata',
    timing: '24 Hours Open (Famous All-Night Pujo Hub)',
    isPureVeg: true,
    hasVegOptions: true,
    famousDishes: ['Legendary Doodh Cola', 'Aloo Paneer Paratha with Butter', 'Kesariya Chai in Kulhad', 'Chana Masala'],
    menu: [
      { name: 'The Original Doodh Cola (500ml Pitcher)', price: 130, isVeg: true, isBestseller: true, description: 'World-famous secret blend of chilled carbonated cola and sweet creamy milk' },
      { name: 'Giant Aloo Paneer Paratha with Makhan', price: 110, isVeg: true, isBestseller: true, description: 'Tandoor roasted hot stuffed paratha topped with fresh white butter' },
      { name: 'Kesariya Doodh Chai (Kulhad)', price: 40, isVeg: true, isBestseller: true, description: 'Thick saffron infused milk tea served in earthen cup' },
      { name: 'Pindi Chana with 2 Puffed Bhaturas', price: 160, isVeg: true, description: 'Rustic dark spiced chickpeas with pickled onions' }
    ]
  }
];

/**
 * Filter restaurants near a list of coordinates or by zone
 */
export function getRestaurantsForZone(zone: 'north' | 'central' | 'south' | 'all', filterVeg: 'all' | 'veg' | 'non-veg'): KolkataRestaurant[] {
  let list = zone === 'all' 
    ? KOLKATA_RESTAURANTS_DATA 
    : KOLKATA_RESTAURANTS_DATA.filter(r => r.zone === zone);

  if (filterVeg === 'veg') {
    list = list.filter(r => r.isPureVeg);
  } else if (filterVeg === 'non-veg') {
    list = list.filter(r => !r.isPureVeg);
  }

  return list;
}

