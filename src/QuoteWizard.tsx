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
  origin: AccessInfo;
  destination: AccessInfo;
  items: string[];
  specialItems: string[];
  services: string[];
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

const SIZES = [
  { id: 'studio', label: 'Studio', emoji: '🛏️', desc: 'Open plan, 1 room' },
  { id: '1br', label: '1 Bedroom', emoji: '🛏️', desc: '2–3 rooms' },
  { id: '2br', label: '2 Bedrooms', emoji: '🛏️🛏️', desc: '4–5 rooms' },
  { id: '3br', label: '3 Bedrooms', emoji: '🛏️🛏️🛏️', desc: '6–7 rooms' },
  { id: '4br', label: '4+ Bedrooms', emoji: '🏠✨', desc: '8+ rooms' },
] as const;

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
      { id: 'dresser', label: 'Dresser', emoji: '🗄️' },
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
      { id: 'dishwasher', label: 'Dishwasher', emoji: '🍽️' },
      { id: 'tv-large', label: 'Large TV (55"+)', emoji: '📺' },
    ],
  },
  {
    category: 'Specialty',
    items: [
      { id: 'piano', label: 'Piano', emoji: '🎹' },
      { id: 'pool-table', label: 'Pool Table', emoji: '🎱' },
      { id: 'safe', label: 'Safe / Cabinet', emoji: '🔒' },
      { id: 'patio', label: 'Patio Set / Grill', emoji: '🌿' },
      { id: 'gym', label: 'Gym Equipment', emoji: '🏋️' },
      { id: 'bike', label: 'Bicycles', emoji: '🚲' },
    ],
  },
  {
    category: 'Boxes & Bins',
    items: [
      { id: 'boxes-few', label: 'A few boxes', emoji: '📦' },
      { id: 'boxes-some', label: '10–20 boxes', emoji: '📦📦' },
      { id: 'boxes-many', label: '20+ boxes', emoji: '📦📦📦' },
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

  if (state.items.includes('piano')) base += 200;
  if (state.items.includes('pool-table')) base += 150;
  if (state.items.includes('safe')) base += 75;
  if (state.items.includes('gym')) base += 75;

  if (state.services.includes('packing')) base += 300;
  else if (state.services.includes('partial-pack')) base += 150;
  if (state.services.includes('unpacking')) base += 150;
  if (state.services.includes('storage')) base += 100;
  if (state.services.includes('insurance')) base += 75;

  if (state.specialItems.length > 0) base += state.specialItems.length * 30;

  return { low: Math.round(base * 0.9), high: Math.round(base * 1.2) };
}

const defaultAccess: AccessInfo = {
  area: '', customArea: '', address: '', zip: '', floor: 'Ground / 1st',
  elevator: null, parkingDistance: '', narrowHallways: false, coiRequired: false,
};

const defaultState: QuoteState = {
  propertyType: '', size: '',
  origin: { ...defaultAccess }, destination: { ...defaultAccess },
  items: [], specialItems: [], services: [],
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
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-center transition-all cursor-pointer select-none
        ${selected
          ? 'border-teal-500 bg-teal-50 shadow-md scale-[1.03]'
          : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50/30'}`}
    >
      {selected && (
        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
      <span className="text-3xl mb-2">{emoji}</span>
      <span className={`text-sm font-bold ${selected ? 'text-teal-700' : 'text-gray-800'}`}>{label}</span>
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
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition-all cursor-pointer select-none min-h-[80px]
        ${selected
          ? 'border-teal-500 bg-teal-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-teal-300'}`}
    >
      {selected && (
        <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
      <span className="text-2xl mb-1">{emoji}</span>
      <span className={`text-xs font-medium leading-tight ${selected ? 'text-teal-700' : 'text-gray-700'}`}>{label}</span>
    </button>
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
      className={`flex-1 rounded-xl border-2 py-2.5 px-3 text-sm font-semibold transition-all text-center
        ${selected
          ? 'border-teal-500 bg-teal-50 text-teal-700'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
    >
      {label}
    </button>
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
                  ? 'border-teal-500 bg-teal-50 shadow-md scale-[1.03]'
                  : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50/30'}`}
            >
              {selected && (
                <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <span className={`${s.emoji} mb-1`}>{t.emoji}</span>
              <span className={`${s.label} leading-tight ${selected ? 'text-teal-700' : 'text-gray-800'}`}>{t.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => onSelect('custom')}
          className={`col-span-2 sm:col-span-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-3 text-sm font-semibold transition-all
            ${value === 'custom'
              ? 'border-teal-500 bg-teal-50 text-teal-700'
              : 'border-gray-300 bg-white text-gray-500 hover:border-teal-300'}`}
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
          className="mt-2 w-full rounded-xl border-2 border-teal-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
      )}
    </div>
  );
}

/* ─── Access step ─── */
function AccessStep({
  title, emoji, access, onChange,
}: {
  title: string; emoji: string; access: AccessInfo; onChange: (a: AccessInfo) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-1">
        <span className="text-4xl">{emoji}</span>
        <h3 className="mt-2 text-lg font-bold text-gray-900">{title}</h3>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">Which area?</label>
        <TownPicker
          value={access.area}
          customValue={access.customArea}
          onSelect={area => onChange({ ...access, area })}
          onCustomChange={customArea => onChange({ ...access, customArea })}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Street Address <span className="font-normal text-gray-400">(optional)</span></label>
          <input
            type="text"
            value={access.address}
            onChange={e => onChange({ ...access, address: e.target.value })}
            placeholder="123 Main St, Austin TX"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">ZIP Code</label>
          <input
            type="text"
            value={access.zip}
            onChange={e => onChange({ ...access, zip: e.target.value })}
            placeholder="78701"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">What floor?</label>
        <div className="flex flex-wrap gap-2">
          {FLOORS.map(f => (
            <RadioTile
              key={f}
              label={f}
              selected={access.floor === f}
              onClick={() => onChange({ ...access, floor: f, elevator: f === 'Ground / 1st' ? null : access.elevator })}
            />
          ))}
        </div>
      </div>

      {access.floor !== 'Ground / 1st' && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">Is there an elevator?</label>
          <div className="flex gap-3">
            <button
              onClick={() => onChange({ ...access, elevator: true })}
              className={`flex-1 rounded-xl border-2 py-3 px-4 text-sm font-semibold transition-all
                ${access.elevator === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
            >
              ✅ Yes, elevator
            </button>
            <button
              onClick={() => onChange({ ...access, elevator: false })}
              className={`flex-1 rounded-xl border-2 py-3 px-4 text-sm font-semibold transition-all
                ${access.elevator === false
                  ? 'border-rose-400 bg-rose-50 text-rose-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
            >
              🚶 Stairs only
            </button>
          </div>
        </div>
      )}

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
          className="h-5 w-5 rounded accent-teal-600"
        />
        <span className="text-sm text-gray-700">Narrow hallways or tight corners to navigate</span>
      </label>

      <label className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-3 cursor-pointer hover:border-gray-300 transition-colors">
        <input
          type="checkbox"
          checked={access.coiRequired}
          onChange={e => onChange({ ...access, coiRequired: e.target.checked })}
          className="h-5 w-5 rounded accent-teal-600"
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
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Let's Plan Your Move</h1>
      <p className="text-gray-500 text-lg mb-2 max-w-md mx-auto">
        Answer a few quick questions and we'll put together a personalized quote — then give you a call to confirm everything.
      </p>
      <div className="flex items-center justify-center gap-1.5 text-sm text-teal-600 font-semibold mb-8">
        <Star className="h-4 w-4 fill-teal-500" />
        <span>100+ 5-star reviews · Austin's boutique moving team</span>
      </div>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-10 py-4 text-lg font-bold text-white shadow-lg hover:bg-teal-700 hover:scale-105 transition-all"
      >
        Build My Quote <ArrowRight className="h-5 w-5" />
      </button>
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
function SubmittedScreen({
  state, estimate, onReset,
}: {
  state: QuoteState; estimate: { low: number; high: number }; onReset: () => void;
}) {
  const propLabel = PROPERTY_TYPES.find(p => p.id === state.propertyType)?.label ?? '';
  const sizeLabel = SIZES.find(s => s.id === state.size)?.label ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-brand-50 flex items-center justify-center px-4 py-8">
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

        <div className="rounded-2xl border border-teal-100 bg-white shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-600 to-brand-600 px-5 py-4 text-white">
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
            {state.items.length > 0 && (
              <div className="flex gap-2">
                <span className="shrink-0">📦</span>
                <span>
                  <strong>{state.items.length} item{state.items.length !== 1 ? 's' : ''}</strong> selected
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
          <div className="bg-teal-50 border-t border-teal-100 px-5 py-4">
            <p className="text-xs text-teal-600 font-bold uppercase">Estimated Range</p>
            <p className="text-2xl font-bold text-teal-700">${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</p>
            <p className="text-xs text-teal-600 mt-1">We'll nail down the exact number on your call.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-5 w-5 text-teal-600" />
            <p className="font-bold text-gray-900">What happens next?</p>
          </div>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="font-bold text-teal-600">1.</span> We review your move details today</li>
            <li className="flex gap-2"><span className="font-bold text-teal-600">2.</span> You get a personal call from our team (usually within 2 hours during business hours)</li>
            <li className="flex gap-2"><span className="font-bold text-teal-600">3.</span> We answer your questions and confirm your quote</li>
            <li className="flex gap-2"><span className="font-bold text-teal-600">4.</span> Book your date — and we handle the rest!</li>
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="tel:5125555555"
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-bold text-white hover:bg-teal-700 transition-colors"
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

/* ─── Step labels ─── */
const STEP_LABELS = [
  'Property Type',
  'Home Size',
  'Moving From',
  'Moving To',
  'Your Items',
  'Extras & Services',
  'Dates & Contact',
];

/* ─── Main export ─── */
export default function QuoteWizard({ onBack, standalone }: { onBack?: () => void; standalone?: boolean }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<QuoteState>({ ...defaultState });
  const [submitted, setSubmitted] = useState(false);

  const toggleItem = (id: string, field: 'items' | 'specialItems' | 'services') => {
    setState(prev => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
    });
  };

  const canProceed = () => {
    if (step === 1) return !!state.propertyType;
    if (step === 2) return !!state.size;
    if (step === 3) return !!state.origin.area && !!state.origin.parkingDistance;
    if (step === 4) return !!state.destination.area && !!state.destination.parkingDistance;
    if (step === 7) return !!(state.firstName && state.phone);
    return true;
  };

  const estimate = estimateQuote(state);

  if (submitted) {
    return (
      <SubmittedScreen
        state={state}
        estimate={estimate}
        onReset={() => { setSubmitted(false); setStep(0); setState({ ...defaultState }); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-brand-50">
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
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700"
          >
            <Phone className="h-3 w-3" /> Call Us
          </a>
        </div>

        {step >= 1 && step <= 7 && (
          <div className="mx-auto max-w-2xl px-4 pb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400 font-medium">Step {step} of 7 — {STEP_LABELS[step - 1]}</span>
              <span className="text-xs text-teal-600 font-semibold">{Math.round((step / 7) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-brand-500 transition-all duration-500"
                style={{ width: `${(step / 7) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* ── Step 0: Welcome ── */}
        {step === 0 && <WelcomeStep onStart={() => setStep(1)} />}

        {/* ── Step 1: Property type ── */}
        {step === 1 && (
          <StepWrapper
            title="What type of property are you moving from?"
            subtitle="This helps us plan the right crew and equipment."
          >
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
          </StepWrapper>
        )}

        {/* ── Step 2: Size ── */}
        {step === 2 && (
          <StepWrapper
            title="How big is your current home?"
            subtitle="Give us your best estimate — we can adjust on the call."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SIZES.map(s => (
                <SelectTile
                  key={s.id}
                  emoji={s.emoji}
                  label={s.label}
                  desc={s.desc}
                  selected={state.size === s.id}
                  onClick={() => setState(prev => ({ ...prev, size: s.id as SizeType }))}
                />
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Step 3: Origin ── */}
        {step === 3 && (
          <StepWrapper
            title="Tell us about where you're moving from"
            subtitle="Access details help us plan crew size and time."
          >
            <AccessStep
              title="Your Current Location"
              emoji="🏠"
              access={state.origin}
              onChange={origin => setState(prev => ({ ...prev, origin }))}
            />
          </StepWrapper>
        )}

        {/* ── Step 4: Destination ── */}
        {step === 4 && (
          <StepWrapper
            title="And where are you moving to?"
            subtitle="Even an approximate area helps — we service all of Greater Austin."
          >
            <AccessStep
              title="Your Destination"
              emoji="📍"
              access={state.destination}
              onChange={destination => setState(prev => ({ ...prev, destination }))}
            />
          </StepWrapper>
        )}

        {/* ── Step 5: Items ── */}
        {step === 5 && (
          <StepWrapper
            title="What are you moving?"
            subtitle="Tap everything that applies — don't forget the stuff hiding in closets!"
          >
            {ITEMS_BY_CATEGORY.map(cat => (
              <div key={cat.category} className="mb-5">
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wide">{cat.category}</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {cat.items.map(item => (
                    <ItemTile
                      key={item.id}
                      emoji={item.emoji}
                      label={item.label}
                      selected={state.items.includes(item.id)}
                      onClick={() => toggleItem(item.id, 'items')}
                    />
                  ))}
                </div>
              </div>
            ))}
            {state.items.length > 0 && (
              <p className="text-xs text-teal-600 font-semibold text-center mt-2">
                {state.items.length} item{state.items.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </StepWrapper>
        )}

        {/* ── Step 6: Fragile items + services ── */}
        {step === 6 && (
          <StepWrapper
            title="Anything fragile or special? Any add-ons?"
            subtitle="We take extra care with the stuff that matters most."
          >
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-gray-400 mb-1 tracking-wide">Fragile / Special Items</h4>
              <p className="text-sm text-gray-500 mb-3">Tap anything that needs extra care or special handling.</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {SPECIAL_ITEMS.map(item => (
                  <ItemTile
                    key={item.id}
                    emoji={item.emoji}
                    label={item.label}
                    selected={state.specialItems.includes(item.id)}
                    onClick={() => toggleItem(item.id, 'specialItems')}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wide">Add-On Services</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {SERVICES.map(svc => (
                  <button
                    key={svc.id}
                    onClick={() => toggleItem(svc.id, 'services')}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all
                      ${state.services.includes(svc.id)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <span className="text-2xl shrink-0">{svc.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${state.services.includes(svc.id) ? 'text-teal-700' : 'text-gray-800'}`}>
                        {svc.label}
                      </p>
                      <p className="text-xs text-gray-500">{svc.desc}</p>
                    </div>
                    {state.services.includes(svc.id) && (
                      <Check className="h-4 w-4 text-teal-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </StepWrapper>
        )}

        {/* ── Step 7: Date + contact ── */}
        {step === 7 && (
          <StepWrapper
            title="Almost done — when and who?"
            subtitle="We'll personally reach out to confirm your quote and answer any questions."
          >
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={state.firstName}
                    onChange={e => setState(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Jane"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={state.lastName}
                    onChange={e => setState(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Smith"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={state.phone}
                    onChange={e => setState(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(512) 555-1234"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={state.email}
                    onChange={e => setState(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Target Move Date</label>
                  <input
                    type="date"
                    value={state.moveDate}
                    onChange={e => setState(prev => ({ ...prev, moveDate: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">How flexible?</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'exact', label: 'Exact' },
                      { id: 'week', label: '±1 Week' },
                      { id: 'month', label: '±1 Month' },
                    ].map(opt => (
                      <RadioTile
                        key={opt.id}
                        label={opt.label}
                        selected={state.flexibility === opt.id}
                        onClick={() => setState(prev => ({ ...prev, flexibility: opt.id as FlexibilityType }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Anything else we should know?</label>
                <textarea
                  value={state.notes}
                  onChange={e => setState(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Tight parking on the street, have a fragile grandfather clock, or just want to say hi — whatever's on your mind."
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none resize-none"
                />
              </div>

              {state.size && (
                <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-brand-50 border border-teal-100 p-4">
                  <p className="text-xs font-bold uppercase text-teal-600 mb-1">Your Estimated Range</p>
                  <p className="text-2xl font-bold text-gray-900">${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This is a ballpark based on your selections. The real quote comes from your personal call — where we confirm details and answer every question.
                  </p>
                </div>
              )}
            </div>
          </StepWrapper>
        )}

        {/* Navigation buttons */}
        {step >= 1 && step <= 7 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>

            {step < 7 ? (
              <button
                onClick={() => { if (canProceed()) setStep(s => s + 1); }}
                disabled={!canProceed()}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all
                  ${canProceed()
                    ? 'bg-teal-600 hover:bg-teal-700 shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!canProceed()) return;
                  saveQuote({
                    firstName: state.firstName, lastName: state.lastName,
                    phone: state.phone, email: state.email,
                    propertyType: state.propertyType, size: state.size,
                    origin: state.origin, destination: state.destination,
                    items: state.items, specialItems: state.specialItems,
                    services: state.services,
                    moveDate: state.moveDate, flexibility: state.flexibility,
                    notes: state.notes,
                    estimateLow: estimate.low, estimateHigh: estimate.high,
                  });
                  setSubmitted(true);
                }}
                disabled={!canProceed()}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all
                  ${canProceed()
                    ? 'bg-teal-600 hover:bg-teal-700 shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Send My Info <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Steps 1-6: skip-to-call nudge */}
        {step >= 1 && step <= 6 && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Prefer to just talk?{' '}
            <a href="tel:5125555555" className="text-teal-600 font-semibold underline">
              Call us directly →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
