import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Check, Phone, ArrowRight, Star, MessageSquare,
} from 'lucide-react';
import { saveQuote } from './quoteStore';

/* ─── Types ─── */
type PropertyType = 'house' | 'apartment' | 'condo' | 'townhouse' | 'storage' | 'office' | '';
type SizeType = 'studio' | '1br' | '2br' | '3br' | '4br' | '';
type ParkingType = 'door' | 'short' | 'long' | '';
type FlexibilityType = 'exact' | 'week' | 'month' | '';

interface AccessInfo {
  area: string;
  customArea: string;
  address: string;
  zip: string;
  floor: string;
  elevator: boolean | null;
  parkingDistance: ParkingType;
  narrowHallways: boolean;
  coiRequired: boolean;
}

interface QuoteState {
  propertyType: PropertyType;
  size: SizeType;
  stories: string;
  origin: AccessInfo;
  destination: AccessInfo;
  items: Record<string, number>;
  specialItems: string[];
  services: string[];
  boxes: string;
  crew: number;
  promoCode: string;
  moveDate: string;
  flexibility: FlexibilityType;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
}

/* ─── Data ─── */
const PROPERTY_TYPES = [
  { id: 'house', label: 'House', emoji: '🏠', desc: 'Single-family home' },
  { id: 'apartment', label: 'Apartment', emoji: '🏢', desc: 'Rental unit in a building' },
  { id: 'condo', label: 'Condo', emoji: '🏙️', desc: 'Owner-occupied unit' },
  { id: 'townhouse', label: 'Townhouse', emoji: '🏘️', desc: 'Multi-story attached home' },
  { id: 'storage', label: 'Storage Unit', emoji: '📦', desc: 'Moving from/to storage' },
  { id: 'office', label: 'Office / Commercial', emoji: '🏛️', desc: 'Business or commercial space' },
] as const;

/* Room count doubles as the square-footage estimate — customers know their
   rooms even when they don't know their sq ft. */
const SIZES = [
  { id: 'studio', label: 'Studio', emoji: '🛏️', desc: 'Open plan, 1 room', sqft: '≈ 500 sq ft' },
  { id: '1br', label: '1 Bedroom', emoji: '🛏️', desc: '2–3 rooms', sqft: '≈ 750 sq ft' },
  { id: '2br', label: '2 Bedrooms', emoji: '🛏️🛏️', desc: '4–5 rooms', sqft: '≈ 1,100 sq ft' },
  { id: '3br', label: '3 Bedrooms', emoji: '🛏️🛏️🛏️', desc: '6–7 rooms', sqft: '≈ 1,600 sq ft' },
  { id: '4br', label: '4+ Bedrooms', emoji: '🏠✨', desc: '8+ rooms', sqft: '≈ 2,500+ sq ft' },
] as const;

const STORY_OPTIONS = [
  { id: '1', label: '🏡 One story' },
  { id: '2', label: '🏠 Two stories' },
  { id: '3+', label: '🏯 Three or more' },
];

const BOX_STACKS = [
  { id: 'none', emoji: '🙅', label: 'No boxes', desc: 'Furniture only', cost: 0 },
  { id: 'few', emoji: '📦', label: 'Just a few', desc: '1–10 boxes', cost: 30 },
  { id: 'small', emoji: '📦📦', label: 'Small stack', desc: '10–15 boxes', cost: 60 },
  { id: 'medium', emoji: '📦📦📦', label: 'Medium stack', desc: '15–30 boxes', cost: 110 },
  { id: 'large', emoji: '📦📦📦📦', label: 'Big stack', desc: '30–60 boxes', cost: 200 },
  { id: 'huge', emoji: '📦🏔️', label: 'Box mountain', desc: '60–100 boxes', cost: 320 },
];

/* Partner apartment complexes — codes plug a discount into the estimate */
const PROMOS: Record<string, { label: string; kind: 'pct' | 'flat'; value: number }> = {
  ONTHELAKE5: { label: 'Windsor on the Lake — 5% off', kind: 'pct', value: 5 },
  BARTON50: { label: 'Partner building — $50 off', kind: 'flat', value: 50 },
};

/* Crew size the job actually needs — Matthew's "salamanders" */
function recommendedCrew(state: QuoteState): number {
  const bySize: Record<string, number> = { studio: 2, '1br': 2, '2br': 3, '3br': 3, '4br': 4 };
  let crew = bySize[state.size] ?? 2;
  if ((state.items['piano'] ?? 0) > 0 || (state.items['pool-table'] ?? 0) > 0) crew += 1;
  const hardStairs = (a: AccessInfo) => a.elevator === false && FLOORS.indexOf(a.floor) >= 2;
  if (hardStairs(state.origin) || hardStairs(state.destination) || state.stories === '3+') crew += 1;
  return Math.min(5, Math.max(2, crew));
}

const FLOORS = ['Ground / 1st', '2nd', '3rd', '4th', '5th+'];

/* Towns: tier controls tile size (metro > city > town). Coordinates are rough
   map positions in miles from downtown Austin, used for the distance surcharge. */
export const TOWNS = [
  { id: 'downtown-austin', label: 'Downtown Austin', emoji: '🌆', tier: 'metro', x: 0, y: 0 },
  { id: 'san-antonio', label: 'San Antonio', emoji: '🌉', tier: 'metro', x: -50, y: -75 },
  { id: 'north-austin', label: 'North Austin', emoji: '🏙️', tier: 'city', x: 0, y: 8 },
  { id: 'south-austin', label: 'South Austin', emoji: '🎸', tier: 'city', x: 0, y: -6 },
  { id: 'round-rock', label: 'Round Rock', emoji: '🍩', tier: 'city', x: 2, y: 18 },
  { id: 'san-marcos', label: 'San Marcos', emoji: '🏄', tier: 'city', x: -15, y: -28 },
  { id: 'georgetown', label: 'Georgetown', emoji: '🏛️', tier: 'town', x: 2, y: 26 },
  { id: 'cedar-park', label: 'Cedar Park', emoji: '🌲', tier: 'town', x: -8, y: 16 },
  { id: 'pflugerville', label: 'Pflugerville', emoji: '🏘️', tier: 'town', x: 4, y: 14 },
  { id: 'new-braunfels', label: 'New Braunfels', emoji: '🌊', tier: 'town', x: -25, y: -45 },
] as const;

const CUSTOM_AREA = 'custom';

export function areaLabel(access: { area: string; customArea: string }): string {
  if (access.area === CUSTOM_AREA) return access.customArea || 'Other area';
  return TOWNS.find(t => t.id === access.area)?.label ?? '';
}

const ITEMS_BY_CATEGORY = [
  {
    category: 'Furniture',
    items: [
      { id: 'sofa', label: 'Sofa', emoji: '🛋️' },
      { id: 'sectional', label: 'Sectional', emoji: '🛋️' },
      { id: 'bed-king', label: 'King Bed', emoji: '🛏️' },
      { id: 'bed-queen', label: 'Queen/Full Bed', emoji: '🛏️' },
      { id: 'dresser', label: 'Dresser / Safe / Cabinet', emoji: '🗄️' },
      { id: 'dining-table', label: 'Dining Table', emoji: '🍽️' },
      { id: 'desk', label: 'Desk', emoji: '🖥️' },
      { id: 'bookshelf', label: 'Bookshelf', emoji: '📚' },
      { id: 'wardrobe', label: 'Wardrobe', emoji: '🚪' },
      { id: 'coffee-table', label: 'Coffee Table', emoji: '☕' },
    ],
  },
  {
    category: 'Appliances',
    items: [
      { id: 'fridge', label: 'Refrigerator', emoji: '🧊' },
      { id: 'washer', label: 'Washer', emoji: '🫧' },
      { id: 'dryer', label: 'Dryer', emoji: '💨' },
      { id: 'stove', label: 'Stove / Range', emoji: '🍳' },
      { id: 'tv-large', label: 'Large TV (55"+)', emoji: '📺' },
    ],
  },
  {
    category: 'Specialty',
    items: [
      { id: 'piano', label: 'Piano', emoji: '🎹' },
      { id: 'pool-table', label: 'Pool Table', emoji: '🎱' },
      { id: 'patio', label: 'Patio Set / Grill', emoji: '🌿' },
      { id: 'gym', label: 'Gym Equipment', emoji: '🏋️' },
      { id: 'bike', label: 'Bicycles', emoji: '🚲' },
    ],
  },
];

const SPECIAL_ITEMS = [
  { id: 'antiques', label: 'Antiques / Heirlooms', emoji: '🏺' },
  { id: 'china', label: 'Fine China / Crystal', emoji: '🫖' },
  { id: 'wine', label: 'Wine Collection', emoji: '🍷' },
  { id: 'mirrors', label: 'Large Mirrors', emoji: '🪞' },
  { id: 'instruments', label: 'Musical Instruments', emoji: '🎸' },
  { id: 'art', label: 'Artwork / Paintings', emoji: '🖼️' },
  { id: 'electronics-fragile', label: 'Servers / Monitors', emoji: '💻' },
  { id: 'chandelier', label: 'Chandelier / Lighting', emoji: '💡' },
  { id: 'marble', label: 'Marble / Stone Tops', emoji: '🪨' },
  { id: 'sculptures', label: 'Sculptures', emoji: '🗿' },
];

const SERVICES = [
  { id: 'packing', label: 'Full Packing', emoji: '📦', desc: 'We pack every room for you' },
  { id: 'partial-pack', label: 'Partial Packing', emoji: '🗂️', desc: 'We pack specific items only' },
  { id: 'unpacking', label: 'Unpacking', emoji: '🏡', desc: 'We unpack and place at destination' },
  { id: 'disassembly', label: 'Furniture Assembly', emoji: '🔧', desc: 'Disassemble & reassemble furniture' },
  { id: 'storage', label: 'Short-Term Storage', emoji: '🏪', desc: 'Store items between move dates' },
  { id: 'insurance', label: 'Full Value Protection', emoji: '🛡️', desc: 'Premium coverage for high-value items' },
  { id: 'supplies', label: 'Packing Materials', emoji: '🎁', desc: 'Boxes, tape, and bubble wrap delivered' },
  { id: 'junk', label: 'Junk Removal', emoji: '🗑️', desc: 'Haul away items you don\'t need' },
];

/* ─── Helpers ─── */
function estimateQuote(state: QuoteState): { low: number; high: number } {
  const baseBySize: Record<string, number> = {
    studio: 400, '1br': 550, '2br': 750, '3br': 950, '4br': 1250,
  };
  let base = baseBySize[state.size] || 650;

  // Distance surcharge between areas (~$3/mile as the crow flies)
  const from = TOWNS.find(t => t.id === state.origin.area);
  const to = TOWNS.find(t => t.id === state.destination.area);
  if (from && to && from.id !== to.id) {
    base += Math.round(Math.hypot(from.x - to.x, from.y - to.y) * 3);
  } else if (state.origin.area === 'custom' || state.destination.area === 'custom') {
    base += 75; // unknown area — modest placeholder, confirmed on the call
  }

  const originFloorNum = FLOORS.indexOf(state.origin.floor) + 1;
  const destFloorNum = FLOORS.indexOf(state.destination.floor) + 1;
  if (!state.origin.elevator && originFloorNum > 1) base += (originFloorNum - 1) * 50;
  if (!state.destination.elevator && destFloorNum > 1) base += (destFloorNum - 1) * 50;
  if (state.origin.parkingDistance === 'long') base += 75;
  if (state.destination.parkingDistance === 'long') base += 75;

  const qty = (id: string) => state.items[id] ?? 0;
  base += 200 * qty('piano');
  base += 150 * qty('pool-table');
  base += 75 * qty('gym');

  if (state.services.includes('packing')) base += 300;
  else if (state.services.includes('partial-pack')) base += 150;
  if (state.services.includes('unpacking')) base += 150;
  if (state.services.includes('storage')) base += 100;
  if (state.services.includes('insurance')) base += 75;

  if (state.specialItems.length > 0) base += state.specialItems.length * 30;

  base += BOX_STACKS.find(b => b.id === state.boxes)?.cost ?? 0;
  if (state.stories === '2') base += 50;
  if (state.stories === '3+') base += 100;

  // Extra salamanders beyond the recommended crew cost more (but finish faster)
  const rec = recommendedCrew(state);
  if (state.crew > rec) base += (state.crew - rec) * 80;

  let low = base * 0.9;
  let high = base * 1.2;

  const promo = PROMOS[state.promoCode.trim().toUpperCase()];
  if (promo) {
    if (promo.kind === 'pct') { low *= 1 - promo.value / 100; high *= 1 - promo.value / 100; }
    else { low = Math.max(0, low - promo.value); high = Math.max(0, high - promo.value); }
  }

  return { low: Math.round(low), high: Math.round(high) };
}

const defaultAccess: AccessInfo = {
  area: '', customArea: '', address: '', zip: '', floor: 'Ground / 1st',
  elevator: null, parkingDistance: '', narrowHallways: false, coiRequired: false,
};

const defaultState: QuoteState = {
  propertyType: '', size: '', stories: '',
  origin: { ...defaultAccess }, destination: { ...defaultAccess },
  items: {}, specialItems: [], services: [],
  boxes: '', crew: 0, promoCode: '',
  moveDate: '', flexibility: '',
  firstName: '', lastName: '', phone: '', email: '', notes: '',
};

/* ─── Small UI components ─── */
function SelectTile({
  emoji, label, desc, selected, onClick,
}: {
  emoji: string; label: string; desc?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-center transition-all cursor-pointer select-none touch-manipulation active:scale-95
        ${selected
          ? 'border-brand-500 bg-brand-50 shadow-md scale-[1.03]'
          : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50/30'}`}
    >
      {selected && (
        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
      <span className="text-3xl mb-2">{emoji}</span>
      <span className={`text-sm font-bold ${selected ? 'text-brand-700' : 'text-gray-800'}`}>{label}</span>
      {desc && <span className="mt-0.5 text-xs text-gray-500">{desc}</span>}
    </button>
  );
}

function ItemTile({
  emoji, label, selected, onClick,
}: {
  emoji: string; label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex h-24 flex-col items-center justify-center rounded-xl border-2 px-1 text-center transition-all cursor-pointer select-none touch-manipulation active:scale-95
        ${selected
          ? 'border-brand-500 bg-brand-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-brand-300'}`}
    >
      {selected && (
        <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
      <span className="text-2xl mb-1">{emoji}</span>
      <span className={`text-xs font-medium leading-tight ${selected ? 'text-brand-700' : 'text-gray-700'}`}>{label}</span>
    </button>
  );
}

/* Fixed-height item tile so rows stay even (no gaps when a neighbor is
   selected). Tap the tile to add one — tap 3× for 3 couches. Once selected,
   a ×N badge shows the count and a corner − removes one. */
function QtyItemTile({
  emoji, label, qty, onAdd, onRemove,
}: {
  emoji: string; label: string; qty: number; onAdd: () => void; onRemove: () => void;
}) {
  const selected = qty > 0;
  return (
    <div
      className={`relative h-24 rounded-xl border-2 transition-colors select-none touch-manipulation
        ${selected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white'}`}
    >
      <button
        onClick={onAdd}
        aria-label={`Add ${label}`}
        className="flex h-full w-full flex-col items-center justify-center gap-1 px-1 active:scale-95 transition-transform"
      >
        <span className="text-3xl leading-none">{emoji}</span>
        <span className={`text-[11px] font-semibold leading-tight text-center ${selected ? 'text-brand-700' : 'text-gray-700'}`}>{label}</span>
      </button>
      {selected && (
        <span className="absolute top-1 right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
          ×{qty}
        </span>
      )}
      {selected && (
        <button
          onClick={onRemove}
          aria-label={`Remove one ${label}`}
          className="absolute top-1 left-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-300 bg-white text-xl leading-none font-bold text-brand-700 hover:bg-brand-100 active:scale-90"
        >−</button>
      )}
    </div>
  );
}

function RadioTile({
  label, selected, onClick,
}: {
  label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[88px] rounded-xl border-2 py-3 px-3 text-sm font-semibold transition-all text-center touch-manipulation active:scale-95
        ${selected
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
    >
      {label}
    </button>
  );
}

/* ─── Voice item entry ─── */
const VOICE_KEYWORDS: [RegExp, string][] = [
  [/pool table/, 'pool-table'],
  [/coffee table/, 'coffee-table'],
  [/dining table|kitchen table/, 'dining-table'],
  [/king (size )?bed/, 'bed-king'],
  [/bed/, 'bed-queen'],
  [/sectional/, 'sectional'],
  [/sofa|couch|loveseat/, 'sofa'],
  [/dresser|chest of drawers|drawers|safe|gun cabinet|cabinet/, 'dresser'],
  [/desk/, 'desk'],
  [/bookshelf|bookcase|book shelf/, 'bookshelf'],
  [/wardrobe|armoire/, 'wardrobe'],
  [/fridge|refrigerator/, 'fridge'],
  [/washer|washing machine/, 'washer'],
  [/dryer/, 'dryer'],
  [/stove|oven|range/, 'stove'],
  [/tv|television/, 'tv-large'],
  [/piano/, 'piano'],
  [/grill|patio/, 'patio'],
  [/gym|weights|treadmill|peloton/, 'gym'],
  [/bike|bicycle/, 'bike'],
];

function matchSpokenItems(text: string): string[] {
  const found: string[] = [];
  for (const [re, id] of VOICE_KEYWORDS) {
    if (re.test(text) && !found.includes(id)) found.push(id);
  }
  return found;
}

function VoiceItemsButton({ onMatches }: { onMatches: (ids: string[]) => void }) {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [matchCount, setMatchCount] = useState<number | null>(null);

  const SR = (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    || (window as unknown as Record<string, unknown>).SpeechRecognition;
  if (!SR) return null;

  const start = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SR as any)();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.continuous = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const text: string = e.results[0][0].transcript.toLowerCase();
      const ids = matchSpokenItems(text);
      setHeard(text);
      setMatchCount(ids.length);
      onMatches(ids);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <div className="mb-4 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-3 text-center">
      <button
        onClick={start}
        disabled={listening}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all
          ${listening
            ? 'bg-rose-100 text-rose-600 animate-pulse'
            : 'bg-brand-600 text-white hover:bg-brand-700'}`}
      >
        {listening ? '🎙️ Listening… say your items!' : '🎤 Or just say what you have'}
      </button>
      {heard && (
        <p className="mt-2 text-xs text-gray-500">
          Heard: “{heard}” — {matchCount} item{matchCount !== 1 ? 's' : ''} added below ✨
        </p>
      )}
    </div>
  );
}

/* ─── Town picker ─── */
function TownPicker({
  value, customValue, onSelect, onCustomChange,
}: {
  value: string;
  customValue: string;
  onSelect: (id: string) => void;
  onCustomChange: (text: string) => void;
}) {
  const tierStyles: Record<string, { tile: string; emoji: string; label: string }> = {
    metro: { tile: 'col-span-2 p-4', emoji: 'text-4xl', label: 'text-sm font-bold' },
    city:  { tile: 'col-span-1 p-3', emoji: 'text-3xl', label: 'text-xs font-bold' },
    town:  { tile: 'col-span-1 p-2.5', emoji: 'text-2xl', label: 'text-xs font-semibold' },
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TOWNS.map(t => {
          const s = tierStyles[t.tier];
          const selected = value === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 text-center transition-all cursor-pointer select-none ${s.tile}
                ${selected
                  ? 'border-brand-500 bg-brand-50 shadow-md scale-[1.03]'
                  : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50/30'}`}
            >
              {selected && (
                <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <span className={`${s.emoji} mb-1`}>{t.emoji}</span>
              <span className={`${s.label} leading-tight ${selected ? 'text-brand-700' : 'text-gray-800'}`}>{t.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => onSelect('custom')}
          className={`col-span-2 sm:col-span-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-3 text-sm font-semibold transition-all
            ${value === 'custom'
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-gray-300 bg-white text-gray-500 hover:border-brand-300'}`}
        >
          ✏️ Somewhere else
        </button>
      </div>
      {value === 'custom' && (
        <input
          type="text"
          value={customValue}
          onChange={e => onCustomChange(e.target.value)}
          placeholder="Wimberley, Dripping Springs, Bastrop…"
          autoFocus
          className="mt-2 w-full rounded-xl border-2 border-brand-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        />
      )}
    </div>
  );
}

/* ─── Access sub-steps (each its own single-focus page) ─── */
function ElevatorButtons({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange(true)}
        className={`flex-1 rounded-2xl border-2 py-6 px-4 text-base font-bold transition-all
          ${value === true ? 'border-green-500 bg-green-50 text-green-700 shadow-md' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
      >
        <span className="block text-3xl mb-1">🛗</span>
        Yes, elevator
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex-1 rounded-2xl border-2 py-6 px-4 text-base font-bold transition-all
          ${value === false ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-md' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
      >
        <span className="block text-3xl mb-1">🚶</span>
        Stairs only
      </button>
    </div>
  );
}

function OptionalAddress({ access, onChange }: { access: AccessInfo; onChange: (a: AccessInfo) => void }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="sm:col-span-2">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Street Address <span className="font-normal text-gray-400">(optional)</span></label>
        <input
          type="text"
          value={access.address}
          onChange={e => onChange({ ...access, address: e.target.value })}
          placeholder="123 Main St, Austin TX"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">ZIP <span className="font-normal text-gray-400">(optional)</span></label>
        <input
          type="text"
          value={access.zip}
          onChange={e => onChange({ ...access, zip: e.target.value })}
          placeholder="78701"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function AccessBundle({ access, onChange }: { access: AccessInfo; onChange: (a: AccessInfo) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">How far is parking from the entrance?</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'door', label: '🚪 Right at the door' },
            { id: 'short', label: '🚶 Short walk (~50 ft)' },
            { id: 'long', label: '🏃 Long walk (100+ ft)' },
          ].map(opt => (
            <RadioTile
              key={opt.id}
              label={opt.label}
              selected={access.parkingDistance === opt.id}
              onClick={() => onChange({ ...access, parkingDistance: opt.id as ParkingType })}
            />
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-3 cursor-pointer hover:border-gray-300 transition-colors">
        <input
          type="checkbox"
          checked={access.narrowHallways}
          onChange={e => onChange({ ...access, narrowHallways: e.target.checked })}
          className="h-5 w-5 rounded accent-brand-600"
        />
        <span className="text-sm text-gray-700">Narrow hallways or tight corners to navigate</span>
      </label>

      <label className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-3 cursor-pointer hover:border-gray-300 transition-colors">
        <input
          type="checkbox"
          checked={access.coiRequired}
          onChange={e => onChange({ ...access, coiRequired: e.target.checked })}
          className="h-5 w-5 rounded accent-brand-600"
        />
        <div>
          <span className="text-sm text-gray-700">Building requires a Certificate of Insurance (COI)</span>
          <span className="ml-1 text-xs text-gray-400">(common in Austin high-rises)</span>
        </div>
      </label>
    </div>
  );
}

/* ─── Step wrapper ─── */
function StepWrapper({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

/* ─── Welcome screen ─── */
function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🚚</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3 font-heading">Let's Plan Your Move</h1>
      <p className="text-gray-500 text-lg mb-2 max-w-md mx-auto">
        Answer a few quick questions and we'll put together a personalized quote — then give you a call to confirm everything.
      </p>
      <div className="flex items-center justify-center gap-1.5 text-sm text-brand-600 font-semibold mb-8">
        <Star className="h-4 w-4 fill-brand-500" />
        <span>100+ 5-star reviews · Austin's boutique moving team</span>
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-10 py-4 text-lg font-bold text-white shadow-lg hover:bg-brand-700 hover:scale-105 transition-all font-heading"
        >
          Build My Quote <ArrowRight className="h-5 w-5" />
        </button>
        <a
          href="tel:5125555555"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-300 bg-white px-8 py-4 text-lg font-bold text-brand-600 hover:border-brand-500 hover:bg-brand-50 transition-all font-heading"
        >
          <Phone className="h-5 w-5" /> …or just give us a call
        </a>
      </div>
      <p className="mt-4 text-xs text-gray-400">Takes about 3 minutes · No spam · A real person calls you</p>
      <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto text-center">
        <div>
          <div className="text-2xl mb-1">⏱️</div>
          <div className="text-xs text-gray-500">~3 minutes</div>
        </div>
        <div>
          <div className="text-2xl mb-1">📞</div>
          <div className="text-xs text-gray-500">We call you</div>
        </div>
        <div>
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xs text-gray-500">Custom quote</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Submitted / confirmation screen ─── */
const ITEM_EMOJI: Record<string, string> = Object.fromEntries(
  ITEMS_BY_CATEGORY.flatMap(c => c.items.map(i => [i.id, i.emoji])),
);

function SubmittedScreen({
  state, estimate, onReset,
}: {
  state: QuoteState; estimate: { low: number; high: number }; onReset: () => void;
}) {
  const propLabel = PROPERTY_TYPES.find(p => p.id === state.propertyType)?.label ?? '';
  const sizeLabel = SIZES.find(s => s.id === state.size)?.label ?? '';
  const propEmoji = PROPERTY_TYPES.find(p => p.id === state.propertyType)?.emoji ?? '🏠';
  const boxEmoji = BOX_STACKS.find(b => b.id === state.boxes)?.emoji ?? '';
  const moveEmojis = Object.entries(state.items)
    .flatMap(([id, qty]) => Array(qty).fill(ITEM_EMOJI[id]))
    .filter(Boolean)
    .slice(0, 15);
  const itemCount = Object.values(state.items).reduce((a, b) => a + b, 0);
  const promo = PROMOS[state.promoCode.trim().toUpperCase()];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">
            You're all set{state.firstName ? `, ${state.firstName}` : ''}!
          </h1>
          <p className="mt-2 text-gray-500">
            We've received your move details and will call you personally
            {state.phone ? <> at <strong>{state.phone}</strong></> : ''} to confirm your quote.
          </p>
        </div>

        {/* Cartoon move strip — your stuff rolling to your new place */}
        {(moveEmojis.length > 0 || state.crew > 0) && (
          <div className="rounded-2xl border border-brand-100 bg-white shadow-sm p-4 mb-4 text-center overflow-hidden">
            <p className="text-xs font-bold uppercase text-gray-400 mb-2">Your move at a glance</p>
            <p className="text-2xl leading-relaxed break-words">
              🚚💨 {moveEmojis.join(' ')} {boxEmoji && boxEmoji !== '🙅' ? boxEmoji : ''} ➡️ {propEmoji}
            </p>
            {state.crew > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                Carried by your {state.crew} salamanders: {'🦎'.repeat(state.crew)}
              </p>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-brand-100 bg-white shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-brand-600 to-brand-600 px-5 py-4 text-white">
            <p className="text-xs font-bold uppercase opacity-75">Your Move Summary</p>
            <p className="text-xl font-bold mt-1">
              {propLabel}{sizeLabel ? ` · ${sizeLabel}` : ''}
            </p>
          </div>
          <div className="p-5 space-y-3 text-sm">
            {(state.origin.area || state.origin.address) && (
              <div className="flex gap-2">
                <span className="shrink-0">📍</span>
                <span><strong>From:</strong> {[areaLabel(state.origin), state.origin.address].filter(Boolean).join(' — ')}{state.origin.zip ? `, ${state.origin.zip}` : ''} · Floor: {state.origin.floor}</span>
              </div>
            )}
            {(state.destination.area || state.destination.address) && (
              <div className="flex gap-2">
                <span className="shrink-0">🏁</span>
                <span><strong>To:</strong> {[areaLabel(state.destination), state.destination.address].filter(Boolean).join(' — ')}{state.destination.zip ? `, ${state.destination.zip}` : ''} · Floor: {state.destination.floor}</span>
              </div>
            )}
            {state.moveDate && (
              <div className="flex gap-2">
                <span className="shrink-0">📅</span>
                <span><strong>Target date:</strong> {new Date(state.moveDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
            {itemCount > 0 && (
              <div className="flex gap-2">
                <span className="shrink-0">📦</span>
                <span>
                  <strong>{itemCount} item{itemCount !== 1 ? 's' : ''}</strong> selected
                  {state.specialItems.length > 0 ? ` · ${state.specialItems.length} fragile/specialty` : ''}
                </span>
              </div>
            )}
            {state.services.length > 0 && (
              <div className="flex gap-2">
                <span className="shrink-0">✨</span>
                <span>
                  <strong>Add-ons:</strong>{' '}
                  {state.services.map(id => SERVICES.find(s => s.id === id)?.label).filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
          <div className="bg-brand-50 border-t border-brand-100 px-5 py-4">
            <p className="text-xs text-brand-600 font-bold uppercase">Estimated Range</p>
            <p className="text-2xl font-bold text-brand-700">${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</p>
            {promo && (
              <p className="text-xs font-bold text-emerald-600 mt-0.5">🎟️ {promo.label} included</p>
            )}
            <p className="text-xs text-brand-600 mt-1">We'll nail down the exact number on your call.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-5 w-5 text-brand-600" />
            <p className="font-bold text-gray-900">What happens next?</p>
          </div>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="font-bold text-brand-600">1.</span> We review your move details today</li>
            <li className="flex gap-2"><span className="font-bold text-brand-600">2.</span> You get a personal call from our team (usually within 2 hours during business hours)</li>
            <li className="flex gap-2"><span className="font-bold text-brand-600">3.</span> We answer your questions and confirm your quote</li>
            <li className="flex gap-2"><span className="font-bold text-brand-600">4.</span> Book your date — and we handle the rest!</li>
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="tel:5125555555"
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-3.5 font-bold text-white hover:bg-brand-700 transition-colors font-heading"
          >
            <Phone className="h-4 w-4" /> Call Us Now: (512) 555-5555
          </a>
          <button
            onClick={onReset}
            className="rounded-xl border border-gray-300 py-3 text-sm text-gray-500 hover:border-gray-400"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Dynamic step sequence ─── */
type StepId =
  | 'propertyType' | 'size' | 'originElevator' | 'originLocation' | 'originAccess'
  | 'destLocation' | 'destFloor' | 'destElevator' | 'destAccess'
  | 'items' | 'special' | 'boxes' | 'crew' | 'services'
  | 'date' | 'flexibility' | 'contact';

const FLOORED_TYPES = ['apartment', 'condo', 'office'];
const isHouseType = (p: string) => p === 'house' || p === 'townhouse';

/* Only the steps that apply to this move, in order. Conditional pages
   (elevator) appear only when relevant, so most people see fewer screens. */
function buildSteps(state: QuoteState): { id: StepId; label: string }[] {
  const out: { id: StepId; label: string }[] = [];
  out.push({ id: 'propertyType', label: 'Property' });
  if (FLOORED_TYPES.includes(state.propertyType) && state.origin.floor !== 'Ground / 1st')
    out.push({ id: 'originElevator', label: 'Elevator' });
  out.push({ id: 'size', label: 'Size' });
  out.push({ id: 'originLocation', label: 'From' });
  out.push({ id: 'originAccess', label: 'From access' });
  out.push({ id: 'destLocation', label: 'To' });
  out.push({ id: 'destFloor', label: 'To floor' });
  if (state.destination.floor !== 'Ground / 1st')
    out.push({ id: 'destElevator', label: 'To elevator' });
  out.push({ id: 'destAccess', label: 'To access' });
  out.push({ id: 'items', label: 'Items' });
  out.push({ id: 'special', label: 'Fragile' });
  out.push({ id: 'boxes', label: 'Boxes' });
  out.push({ id: 'crew', label: 'Crew' });
  out.push({ id: 'services', label: 'Services' });
  out.push({ id: 'date', label: 'Date' });
  out.push({ id: 'flexibility', label: 'Timing' });
  out.push({ id: 'contact', label: 'Contact' });
  return out;
}

/* ─── Main export ─── */
export default function QuoteWizard({ onBack, standalone }: { onBack?: () => void; standalone?: boolean }) {
  const [stepId, setStepId] = useState<'welcome' | StepId>('welcome');
  const [state, setState] = useState<QuoteState>({ ...defaultState });
  const [submitted, setSubmitted] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);

  const steps = buildSteps(state);
  const idx = steps.findIndex(s => s.id === stepId);
  const onWelcome = stepId === 'welcome';
  const current = idx >= 0 ? steps[idx] : null;
  const total = steps.length;
  const isLast = idx === total - 1;
  // Every intermediate page is skippable — leave it blank and move on. The only
  // gate is the final submit: we need at least a phone or email to follow up.
  const reachable = !!state.phone.trim() || !!state.email.trim();
  const canAdvance = !current ? true : (isLast ? reachable : true);
  const estimate = estimateQuote(state);

  const setOrigin = (patch: Partial<AccessInfo>) => setState(p => ({ ...p, origin: { ...p.origin, ...patch } }));
  const setDest = (patch: Partial<AccessInfo>) => setState(p => ({ ...p, destination: { ...p.destination, ...patch } }));

  const addItem = (id: string) => setState(p => ({ ...p, items: { ...p.items, [id]: (p.items[id] ?? 0) + 1 } }));
  const removeItem = (id: string) => setState(p => {
    const next = (p.items[id] ?? 0) - 1;
    const items = { ...p.items };
    if (next <= 0) delete items[id]; else items[id] = next;
    return { ...p, items };
  });
  const toggleSet = (id: string, field: 'specialItems' | 'services') => setState(p => {
    const arr = p[field];
    return { ...p, [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
  });

  const itemCount = Object.values(state.items).reduce((a, b) => a + b, 0);

  const submit = () => {
    saveQuote({
      firstName: state.firstName, lastName: state.lastName,
      phone: state.phone, email: state.email,
      propertyType: state.propertyType, size: state.size,
      stories: state.stories,
      origin: state.origin, destination: state.destination,
      items: state.items, specialItems: state.specialItems,
      services: state.services,
      boxes: state.boxes, crew: state.crew, promoCode: state.promoCode,
      moveDate: state.moveDate, flexibility: state.flexibility,
      notes: state.notes,
      estimateLow: estimate.low, estimateHigh: estimate.high,
    });
    setSubmitted(true);
  };

  const goNext = () => {
    if (!canAdvance) return;
    if (isLast) { submit(); return; }
    setStepId(steps[idx + 1].id);
    window.scrollTo({ top: 0 });
  };
  const goPrev = () => {
    if (idx <= 0) setStepId('welcome');
    else setStepId(steps[idx - 1].id);
    window.scrollTo({ top: 0 });
  };

  if (submitted) {
    return (
      <SubmittedScreen
        state={state}
        estimate={estimate}
        onReset={() => { setSubmitted(false); setStepId('welcome'); setState({ ...defaultState }); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          {standalone ? (
            <span className="text-sm text-gray-400 font-medium">bartonspringsmoving.com</span>
          ) : (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-4 w-4" /> Hiring Guide
            </button>
          )}
          <span className="text-sm font-bold text-gray-900">Barton Springs Moving</span>
          <a
            href="tel:5125555555"
            className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700 font-heading"
          >
            <Phone className="h-3 w-3" /> Call Us
          </a>
        </div>

        {current && (
          <div className="mx-auto max-w-2xl px-4 pb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400 font-medium">Step {idx + 1} of {total} — {current.label}</span>
              <span className="text-xs text-brand-600 font-semibold">{Math.round(((idx + 1) / total) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                style={{ width: `${((idx + 1) / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        {onWelcome && <WelcomeStep onStart={() => setStepId(steps[0].id)} />}

        {/* ── Property type + floor/stories (same page) ── */}
        {stepId === 'propertyType' && (
          <StepWrapper title="What are you moving out of?" subtitle="Pick your place — and which floor it's on.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROPERTY_TYPES.map(pt => (
                <SelectTile
                  key={pt.id}
                  emoji={pt.emoji}
                  label={pt.label}
                  desc={pt.desc}
                  selected={state.propertyType === pt.id}
                  onClick={() => setState(prev => ({ ...prev, propertyType: pt.id as PropertyType }))}
                />
              ))}
            </div>

            {state.propertyType && state.propertyType !== 'storage' && (
              <div className="mt-6">
                {isHouseType(state.propertyType) ? (
                  <>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">How many stories is it?</label>
                    <div className="flex flex-wrap gap-2">
                      {STORY_OPTIONS.map(opt => (
                        <RadioTile
                          key={opt.id}
                          label={opt.label}
                          selected={state.stories === opt.id}
                          onClick={() => setState(prev => ({ ...prev, stories: opt.id }))}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Which floor is your place on?</label>
                    <div className="flex flex-wrap gap-2">
                      {FLOORS.map(f => (
                        <RadioTile
                          key={f}
                          label={f}
                          selected={state.origin.floor === f}
                          onClick={() => setOrigin({ floor: f, elevator: f === 'Ground / 1st' ? null : state.origin.elevator })}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </StepWrapper>
        )}

        {/* ── Size (rooms → sq ft) ── */}
        {stepId === 'size' && (
          <StepWrapper title="How many bedrooms?" subtitle="Count your rooms — we'll estimate the square footage from that, no measuring needed.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SIZES.map(s => {
                const mcMansion = s.id === '4br' && isHouseType(state.propertyType);
                return (
                  <SelectTile
                    key={s.id}
                    emoji={mcMansion ? '🏰' : s.emoji}
                    label={mcMansion ? 'McMansion (4+ BR)' : s.label}
                    desc={`${s.desc} · ${s.sqft}`}
                    selected={state.size === s.id}
                    onClick={() => setState(prev => ({ ...prev, size: s.id as SizeType }))}
                  />
                );
              })}
            </div>
          </StepWrapper>
        )}

        {/* ── Origin elevator ── */}
        {stepId === 'originElevator' && (
          <StepWrapper title="Is there an elevator?" subtitle="At your current place — this changes the carry time a lot.">
            <ElevatorButtons value={state.origin.elevator} onChange={v => setOrigin({ elevator: v })} />
          </StepWrapper>
        )}

        {/* ── Origin location ── */}
        {stepId === 'originLocation' && (
          <StepWrapper title="Where are you moving from?" subtitle="Pick your area. Street address is optional — we confirm it on the call.">
            <TownPicker
              value={state.origin.area}
              customValue={state.origin.customArea}
              onSelect={area => setOrigin({ area })}
              onCustomChange={customArea => setOrigin({ customArea })}
            />
            <OptionalAddress access={state.origin} onChange={o => setState(p => ({ ...p, origin: o }))} />
          </StepWrapper>
        )}

        {/* ── Origin access ── */}
        {stepId === 'originAccess' && (
          <StepWrapper title="A few access details" subtitle="At your current place — these help us send the right crew.">
            <AccessBundle access={state.origin} onChange={o => setState(p => ({ ...p, origin: o }))} />
          </StepWrapper>
        )}

        {/* ── Destination location ── */}
        {stepId === 'destLocation' && (
          <StepWrapper title="Where are you moving to?" subtitle="Even an approximate area helps — we service all of Greater Austin.">
            <TownPicker
              value={state.destination.area}
              customValue={state.destination.customArea}
              onSelect={area => setDest({ area })}
              onCustomChange={customArea => setDest({ customArea })}
            />
            <OptionalAddress access={state.destination} onChange={d => setState(p => ({ ...p, destination: d }))} />
          </StepWrapper>
        )}

        {/* ── Destination floor ── */}
        {stepId === 'destFloor' && (
          <StepWrapper title="What floor is your new place on?" subtitle="Pick the ground floor if it's a house or single-level.">
            <div className="grid grid-cols-1 gap-2">
              {FLOORS.map(f => (
                <RadioTile
                  key={f}
                  label={f}
                  selected={state.destination.floor === f}
                  onClick={() => setDest({ floor: f, elevator: f === 'Ground / 1st' ? null : state.destination.elevator })}
                />
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Destination elevator ── */}
        {stepId === 'destElevator' && (
          <StepWrapper title="Is there an elevator at your new place?" subtitle="Stairs-only on an upper floor adds carry time.">
            <ElevatorButtons value={state.destination.elevator} onChange={v => setDest({ elevator: v })} />
          </StepWrapper>
        )}

        {/* ── Destination access ── */}
        {stepId === 'destAccess' && (
          <StepWrapper title="A few access details" subtitle="At your new place.">
            <AccessBundle access={state.destination} onChange={d => setState(p => ({ ...p, destination: d }))} />
          </StepWrapper>
        )}

        {/* ── Items (the one multi-pick page) ── */}
        {stepId === 'items' && (
          <StepWrapper title="What are you moving?" subtitle="Tap an item to add it — tap again to add more (3 taps = 3 couches). Use −/＋ to fix the count.">
            <VoiceItemsButton
              onMatches={ids => setState(prev => {
                const items = { ...prev.items };
                ids.forEach(id => { if (!items[id]) items[id] = 1; });
                return { ...prev, items };
              })}
            />
            {ITEMS_BY_CATEGORY.map(cat => (
              <div key={cat.category} className="mb-5">
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wide">{cat.category}</h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {cat.items.map(item => (
                    <QtyItemTile
                      key={item.id}
                      emoji={item.emoji}
                      label={item.label}
                      qty={state.items[item.id] ?? 0}
                      onAdd={() => addItem(item.id)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {itemCount > 0 && (
              <p className="text-xs text-brand-600 font-semibold text-center mt-2">
                {itemCount} item{itemCount !== 1 ? 's' : ''} on the truck 🚚
              </p>
            )}
          </StepWrapper>
        )}

        {/* ── Special / fragile ── */}
        {stepId === 'special' && (
          <StepWrapper title="Anything fragile or special?" subtitle="Tap anything that needs extra care or special handling. Skip if nothing applies.">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SPECIAL_ITEMS.map(item => (
                <ItemTile
                  key={item.id}
                  emoji={item.emoji}
                  label={item.label}
                  selected={state.specialItems.includes(item.id)}
                  onClick={() => toggleSet(item.id, 'specialItems')}
                />
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Boxes ── */}
        {stepId === 'boxes' && (
          <StepWrapper title="Roughly how many boxes?" subtitle="A ballpark is fine — pick the stack that looks closest.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BOX_STACKS.map(b => (
                <SelectTile
                  key={b.id}
                  emoji={b.emoji}
                  label={b.label}
                  desc={b.desc}
                  selected={state.boxes === b.id}
                  onClick={() => setState(prev => ({ ...prev, boxes: b.id }))}
                />
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Crew (salamanders) ── */}
        {stepId === 'crew' && (
          <StepWrapper title="Pick your salamanders 🦎" subtitle={`Our movers. For a move like yours we recommend ${recommendedCrew(state)}.`}>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setState(prev => ({ ...prev, crew: n }))}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all
                    ${state.crew === n ? 'border-brand-500 bg-brand-50 shadow-md scale-[1.03]' : 'border-gray-200 bg-white hover:border-brand-300'}`}
                >
                  <span className="text-lg leading-tight">{'🦎'.repeat(n > 3 ? 3 : n)}{n > 3 ? <span className="block">{'🦎'.repeat(n - 3)}</span> : null}</span>
                  <span className={`mt-1 text-sm font-bold ${state.crew === n ? 'text-brand-700' : 'text-gray-800'}`}>{n}</span>
                </button>
              ))}
            </div>

            {state.crew > 0 && state.crew < recommendedCrew(state) && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  🦎💦 Whoa — with only {state.crew} salamander{state.crew > 1 ? 's' : ''}, this move could take a <em>really</em> long time
                  {(state.items['piano'] ?? 0) > 0 ? ' (and someone has to carry that piano!)' : ''}.
                  We recommend <strong>{recommendedCrew(state)}</strong> for a move like yours.
                </p>
                <button
                  onClick={() => setState(prev => ({ ...prev, crew: recommendedCrew(prev) }))}
                  className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                >
                  Use {recommendedCrew(state)} salamanders
                </button>
              </div>
            )}
            {state.crew > recommendedCrew(state) && (
              <p className="mt-4 text-xs text-brand-600 font-medium">
                ⚡ Extra hands finish faster — adds a little to the estimate, saves you hours on move day.
              </p>
            )}
          </StepWrapper>
        )}

        {/* ── Services ── */}
        {stepId === 'services' && (
          <StepWrapper title="Want any add-on services?" subtitle="Tap any that interest you — skip if you just need the move itself.">
            <div className="grid gap-2 sm:grid-cols-2">
              {SERVICES.map(svc => (
                <button
                  key={svc.id}
                  onClick={() => toggleSet(svc.id, 'services')}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all
                    ${state.services.includes(svc.id) ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <span className="text-2xl shrink-0">{svc.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${state.services.includes(svc.id) ? 'text-brand-700' : 'text-gray-800'}`}>{svc.label}</p>
                    <p className="text-xs text-gray-500">{svc.desc}</p>
                  </div>
                  {state.services.includes(svc.id) && <Check className="h-4 w-4 text-brand-500 shrink-0" />}
                </button>
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Move date ── */}
        {stepId === 'date' && (
          <StepWrapper title="When do you want to move?" subtitle="Pick a target date, or skip if you're still deciding.">
            <input
              type="date"
              value={state.moveDate}
              onChange={e => setState(prev => ({ ...prev, moveDate: e.target.value }))}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:border-brand-500 focus:outline-none"
            />
          </StepWrapper>
        )}

        {/* ── Flexibility ── */}
        {stepId === 'flexibility' && (
          <StepWrapper title="How flexible is that date?" subtitle="Flexibility can unlock better pricing on slower days.">
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'exact', label: '📌 It has to be exact' },
                { id: 'week', label: '📅 Give or take a week' },
                { id: 'month', label: '🗓️ Anytime that month' },
              ].map(opt => (
                <RadioTile
                  key={opt.id}
                  label={opt.label}
                  selected={state.flexibility === opt.id}
                  onClick={() => setState(prev => ({ ...prev, flexibility: opt.id as FlexibilityType }))}
                />
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Contact (grouped typed fields) ── */}
        {stepId === 'contact' && (
          <StepWrapper title="Last step — how do we reach you?" subtitle="We'll call you personally to confirm your quote and answer any questions.">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>
                  <input
                    type="text"
                    value={state.firstName}
                    onChange={e => setState(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Jane"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={state.lastName}
                    onChange={e => setState(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Smith"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={state.phone}
                    onChange={e => setState(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(512) 555-1234"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={state.email}
                    onChange={e => setState(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              {!reachable && (
                <p className="text-xs text-amber-600">📞 Add a phone number or email so we can reach you with your quote.</p>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Anything else we should know? <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea
                  value={state.notes}
                  onChange={e => setState(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Tight street parking, a fragile grandfather clock, or just say hi — whatever's on your mind."
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                {!promoOpen && !state.promoCode ? (
                  <button onClick={() => setPromoOpen(true)} className="text-xs font-semibold text-brand-600 underline">
                    🎟️ Live in a partner building? Enter your code
                  </button>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Partner Code</label>
                    <input
                      type="text"
                      value={state.promoCode}
                      onChange={e => setState(prev => ({ ...prev, promoCode: e.target.value.toUpperCase() }))}
                      placeholder="ONTHELAKE5"
                      className="w-full sm:w-64 rounded-xl border border-gray-300 px-4 py-2.5 text-sm uppercase tracking-wide focus:border-brand-500 focus:outline-none"
                    />
                    {PROMOS[state.promoCode.trim().toUpperCase()] && (
                      <p className="mt-1.5 text-xs font-bold text-emerald-600">
                        ✓ {PROMOS[state.promoCode.trim().toUpperCase()].label} — applied to your estimate!
                      </p>
                    )}
                    {state.promoCode.trim().length >= 4 && !PROMOS[state.promoCode.trim().toUpperCase()] && (
                      <p className="mt-1.5 text-xs text-gray-400">Code not recognized — we'll double-check it on your call.</p>
                    )}
                  </div>
                )}
              </div>

              {state.size && (
                <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-50 border border-brand-100 p-4">
                  <p className="text-xs font-bold uppercase text-brand-600 mb-1">Your Estimated Range</p>
                  <p className="text-2xl font-bold text-gray-900">${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This is a ballpark based on your selections. The real quote comes from your personal call.
                  </p>
                </div>
              )}
            </div>
          </StepWrapper>
        )}

        {/* Navigation buttons */}
        {current && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={goPrev}
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>

            <button
              onClick={goNext}
              disabled={!canAdvance}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-all font-heading
                ${canAdvance ? 'bg-brand-500 hover:bg-brand-700 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {isLast ? <>Send My Info <ArrowRight className="h-4 w-4" /></> : <>Continue <ChevronRight className="h-4 w-4" /></>}
            </button>
          </div>
        )}

        {/* Skip-to-call nudge (every step but the last) */}
        {current && !isLast && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Prefer to just talk?{' '}
            <a href="tel:5125555555" className="text-brand-600 font-semibold underline">
              Call us directly →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
