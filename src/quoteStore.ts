/* ─── Types ─── */
export interface StoredAccessInfo {
  area?: string;
  customArea?: string;
  address: string;
  zip: string;
  floor: string;
  elevator: boolean | null;
  parkingDistance: string;
  narrowHallways: boolean;
  coiRequired: boolean;
}

export interface QuoteRecord {
  id: string;
  submittedAt: string; // ISO
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  internalNotes: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  propertyType: string;
  size: string;
  stories?: string;
  boxes?: string;
  crew?: number;
  promoCode?: string;
  origin: StoredAccessInfo;
  destination: StoredAccessInfo;
  items: Record<string, number>;
  specialItems: string[];
  services: string[];
  moveDate: string;
  flexibility: string;
  notes: string;
  estimateLow: number;
  estimateHigh: number;
}

/* ─── Lookup tables for display ─── */
export const AREA_LABELS: Record<string, string> = {
  'downtown-austin': '🌆 Downtown Austin', 'san-antonio': '🌉 San Antonio',
  'north-austin': '🏙️ North Austin', 'south-austin': '🎸 South Austin',
  'round-rock': '🍩 Round Rock', 'san-marcos': '🏄 San Marcos',
  'georgetown': '🏛️ Georgetown', 'cedar-park': '🌲 Cedar Park',
  'pflugerville': '🏘️ Pflugerville', 'new-braunfels': '🌊 New Braunfels',
};

export function areaDisplay(info: StoredAccessInfo): string {
  if (info.area === 'custom') return info.customArea ? `✏️ ${info.customArea}` : '✏️ Other area';
  return (info.area && AREA_LABELS[info.area]) || '';
}

export const PROPERTY_LABELS: Record<string, string> = {
  house: '🏠 House', apartment: '🏢 Apartment', condo: '🏙️ Condo',
  townhouse: '🏘️ Townhouse', storage: '📦 Storage Unit', office: '🏛️ Office/Commercial',
};

export const SIZE_LABELS: Record<string, string> = {
  studio: 'Studio', '1br': '1 Bedroom', '2br': '2 Bedrooms',
  '3br': '3 Bedrooms', '4br': '4+ Bedrooms',
};

export const ITEM_LABELS: Record<string, string> = {
  sofa: 'Sofa', sectional: 'Sectional', 'bed-king': 'King Bed', 'bed-queen': 'Queen/Full Bed',
  dresser: 'Dresser', 'dining-table': 'Dining Table', desk: 'Desk', bookshelf: 'Bookshelf',
  wardrobe: 'Wardrobe', 'coffee-table': 'Coffee Table',
  fridge: 'Refrigerator', washer: 'Washer', dryer: 'Dryer', stove: 'Stove/Range',
  dishwasher: 'Dishwasher', 'tv-large': 'Large TV (55"+)',
  piano: '🎹 Piano', 'pool-table': '🎱 Pool Table', safe: 'Safe/Cabinet',
  patio: 'Patio Set/Grill', gym: 'Gym Equipment', bike: 'Bicycles',
  'boxes-few': 'A few boxes', 'boxes-some': '10–20 boxes', 'boxes-many': '20+ boxes',
};

export const SPECIAL_LABELS: Record<string, string> = {
  antiques: 'Antiques/Heirlooms', china: 'Fine China/Crystal', wine: 'Wine Collection',
  mirrors: 'Large Mirrors', instruments: 'Musical Instruments', art: 'Artwork/Paintings',
  'electronics-fragile': 'Servers/Monitors', chandelier: 'Chandelier/Lighting',
  marble: 'Marble/Stone Tops', sculptures: 'Sculptures',
};

export const BOX_LABELS: Record<string, string> = {
  none: 'No boxes', few: '1–10 boxes', small: '10–15 boxes',
  medium: '15–30 boxes', large: '30–60 boxes', huge: '60–100 boxes',
};

export const SERVICE_LABELS: Record<string, string> = {
  packing: 'Full Packing', 'partial-pack': 'Partial Packing', unpacking: 'Unpacking',
  disassembly: 'Furniture Assembly', storage: 'Short-Term Storage',
  insurance: 'Full Value Protection', supplies: 'Packing Materials', junk: 'Junk Removal',
};

/* ─── Seed data ─── */
const SEED_QUOTES: QuoteRecord[] = [
  {
    id: 'seed-1',
    submittedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    status: 'new',
    internalNotes: '',
    firstName: 'Sarah', lastName: 'Martinez', phone: '(512) 867-5309', email: 'sarah.m@gmail.com',
    propertyType: 'apartment', size: '2br', boxes: 'medium', crew: 3, promoCode: 'ONTHELAKE5',
    origin: { area: 'downtown-austin', customArea: '', address: '1204 E 6th St', zip: '78702', floor: '3rd', elevator: true, parkingDistance: 'short', narrowHallways: false, coiRequired: true },
    destination: { area: 'south-austin', customArea: '', address: '2803 Manchaca Rd', zip: '78704', floor: 'Ground / 1st', elevator: null, parkingDistance: 'door', narrowHallways: false, coiRequired: false },
    items: { sofa: 1, 'bed-queen': 2, dresser: 2, 'dining-table': 1, fridge: 1, washer: 1, dryer: 1 },
    specialItems: ['mirrors', 'art'],
    services: ['packing', 'insurance'],
    moveDate: '2026-06-21', flexibility: 'week',
    notes: 'I have a lot of art prints, some framed and some rolled. Please handle carefully!',
    estimateLow: 1050, estimateHigh: 1260,
  },
  {
    id: 'seed-2',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'contacted',
    internalNotes: 'Called Tuesday 2pm. He answered — confirmed date, going to email him a formal quote today. Piano is upright, not baby grand.',
    firstName: 'James', lastName: 'Chen', phone: '(512) 555-0142', email: 'jchen@outlook.com',
    propertyType: 'house', size: '3br', stories: '2', boxes: 'large', crew: 4,
    origin: { area: 'north-austin', customArea: '', address: '4512 Bull Creek Rd', zip: '78731', floor: 'Ground / 1st', elevator: null, parkingDistance: 'door', narrowHallways: false, coiRequired: false },
    destination: { area: 'round-rock', customArea: '', address: '812 Sagebrush Trail', zip: '78681', floor: 'Ground / 1st', elevator: null, parkingDistance: 'door', narrowHallways: false, coiRequired: false },
    items: { sectional: 1, 'bed-king': 1, 'bed-queen': 2, dresser: 3, piano: 1, 'pool-table': 1, washer: 1, dryer: 1, fridge: 1 },
    specialItems: ['antiques', 'art'],
    services: ['disassembly', 'insurance'],
    moveDate: '2026-06-14', flexibility: 'exact',
    notes: 'We have a baby grand piano - is that a problem? Also the pool table has a slate top.',
    estimateLow: 1850, estimateHigh: 2220,
  },
  {
    id: 'seed-3',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    internalNotes: 'Scheduled Saturday June 8, 8am. 2-person crew (Marcus + Dre). Building requires COI — emailed certificate Thursday. She confirmed receipt.',
    firstName: 'Priya', lastName: 'Nair', phone: '(512) 444-7821', email: 'priya.nair@utexas.edu',
    propertyType: 'apartment', size: 'studio',
    origin: { area: 'downtown-austin', customArea: '', address: '111 Sandra Muraida Way', zip: '78703', floor: '5th+', elevator: true, parkingDistance: 'long', narrowHallways: false, coiRequired: true },
    destination: { area: 'downtown-austin', customArea: '', address: '2222 Rio Grande St', zip: '78705', floor: '2nd', elevator: false, parkingDistance: 'short', narrowHallways: true, coiRequired: false },
    items: { sofa: 1, 'bed-queen': 1, dresser: 1, bookshelf: 2 },
    specialItems: [],
    services: [],
    moveDate: '2026-06-08', flexibility: 'exact',
    notes: 'I have a narrow L-shaped hallway at destination. Not sure if the sofa will fit around the corner — can you check?',
    estimateLow: 495, estimateHigh: 595,
  },
  {
    id: 'seed-4',
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    internalNotes: 'Move done May 30. 3-person crew, 6 hours. Customer was thrilled — left 5-star Google review. Tipped the crew $80 total.',
    firstName: 'Mike', lastName: 'Sullivan', phone: '(512) 333-9100', email: 'msullivan@email.com',
    propertyType: 'house', size: '4br',
    origin: { area: 'south-austin', customArea: '', address: '9201 Brodie Ln', zip: '78748', floor: 'Ground / 1st', elevator: null, parkingDistance: 'door', narrowHallways: false, coiRequired: false },
    destination: { area: 'north-austin', customArea: '', address: '1400 Spicewood Springs Rd', zip: '78759', floor: 'Ground / 1st', elevator: null, parkingDistance: 'door', narrowHallways: false, coiRequired: false },
    items: { sofa: 1, sectional: 1, 'bed-king': 1, 'bed-queen': 2, dresser: 2, wardrobe: 1, 'dining-table': 1, fridge: 1, washer: 1, dryer: 1, stove: 1, gym: 1 },
    specialItems: ['wine', 'art'],
    services: ['packing', 'disassembly', 'insurance'],
    moveDate: '2026-05-30', flexibility: 'exact',
    notes: '',
    estimateLow: 1680, estimateHigh: 2020,
  },
];

/* ─── Storage key ─── */
const STORAGE_KEY = 'bsm_quotes';

/* Older saved quotes stored items as a string[]; normalize to a count map so
   the dashboard renders consistently regardless of when a quote was captured. */
function normalize(q: QuoteRecord): QuoteRecord {
  if (Array.isArray(q.items)) {
    const items: Record<string, number> = {};
    (q.items as unknown as string[]).forEach(id => { items[id] = (items[id] ?? 0) + 1; });
    return { ...q, items };
  }
  return q;
}

/* ─── Public API ─── */
export function getQuotes(): QuoteRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First run — seed with demo data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_QUOTES));
      return SEED_QUOTES;
    }
    return (JSON.parse(raw) as QuoteRecord[]).map(normalize);
  } catch {
    return [];
  }
}

export function saveQuote(q: Omit<QuoteRecord, 'id' | 'submittedAt' | 'status' | 'internalNotes'>): QuoteRecord {
  const record: QuoteRecord = {
    ...q,
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    submittedAt: new Date().toISOString(),
    status: 'new',
    internalNotes: '',
  };
  const all = getQuotes();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...all]));
  return record;
}

export function updateQuote(id: string, updates: Partial<QuoteRecord>): void {
  const all = getQuotes().map(q => q.id === id ? { ...q, ...updates } : q);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteQuote(id: string): void {
  const all = getQuotes().filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
