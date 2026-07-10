import type { Pool } from 'pg';

export interface Rates {
  twoPersonCrew: number;
  threePersonCrew: number;
  fourPersonCrew: number;
  additionalPersonRate: number;
}

export function defaultRates(): Rates {
  return {
    twoPersonCrew: 150,
    threePersonCrew: 220,
    fourPersonCrew: 285,
    additionalPersonRate: 65,
  };
}

export function normalizeRates(value: unknown): Rates | null {
  let v = value;
  if (typeof v === 'string') {
    try {
      v = JSON.parse(v);
    } catch {
      return null;
    }
  }
  if (!v || typeof v !== 'object') return null;
  const obj = v as Record<string, unknown>;
  const rates: Rates = {
    twoPersonCrew: Number(obj.twoPersonCrew ?? 0),
    threePersonCrew: Number(obj.threePersonCrew ?? 0),
    fourPersonCrew: Number(obj.fourPersonCrew ?? 0),
    additionalPersonRate: Number(obj.additionalPersonRate ?? 0),
  };
  if (Object.values(rates).some((r) => !(r > 0))) return null;
  return rates;
}

export async function activeRates(db: Pool): Promise<Rates> {
  try {
    const { rows } = await db.query('SELECT rates FROM rate_settings ORDER BY updated_at DESC LIMIT 1');
    return normalizeRates(rows[0]?.rates) ?? defaultRates();
  } catch (e) {
    console.error('Rate lookup error:', e);
    return defaultRates();
  }
}

export function calculateCrewSize(squareFootage: number): number {
  if (squareFootage <= 1300) return 2;
  if (squareFootage <= 2000) return 3;
  if (squareFootage <= 3000) return 4;
  return 6;
}

export function hourlyRate(crewSize: number, rates: Rates): number {
  if (crewSize === 2) return rates.twoPersonCrew;
  if (crewSize === 3) return rates.threePersonCrew;
  if (crewSize === 4) return rates.fourPersonCrew;
  return rates.fourPersonCrew + (crewSize - 4) * rates.additionalPersonRate;
}

function baseCostPerSqft(floors: number, parking: string, useMax: boolean): number {
  if (floors === 1 && parking === 'easy') return useMax ? 0.91 : 0.77;
  if (floors >= 2 && parking === 'easy') return useMax ? 0.98 : 0.84;
  if (floors === 1 && parking === 'difficult') return useMax ? 1.05 : 0.91;
  return useMax ? 1.26 : 0.98;
}

export interface QuoteForEstimate {
  square_footage: number;
  floors: number;
  parking_difficulty: string;
  property_type: string;
  has_elevator: boolean | null;
  is_internal_unit: boolean | null;
  distance_miles: number;
  packing_service: boolean;
  has_specialty_items: boolean;
  specialty_items_count: number;
  payment_method: string;
}

export function calculateEstimate(quote: QuoteForEstimate, rates: Rates, useMax: boolean): number {
  const sqft = Math.max(0, Math.trunc(quote.square_footage));
  if (sqft === 0) return 0;

  const crewSize = calculateCrewSize(sqft);
  const rate = hourlyRate(crewSize, rates);
  let costPerSqft = baseCostPerSqft(Math.trunc(quote.floors), quote.parking_difficulty, useMax);

  if (quote.property_type === 'apartment') {
    if (!quote.has_elevator && quote.floors > 1) costPerSqft += 0.14;
    if (quote.is_internal_unit) costPerSqft += 0.07;
  }

  let total = sqft * costPerSqft;
  const minimum = rate * 2.75;
  if (total < minimum) total = minimum;

  const distance = Math.max(0, quote.distance_miles);
  if (distance > 15) total += distance * 3.5;
  if (quote.packing_service) total *= 1.75;
  if (quote.has_specialty_items) total += quote.specialty_items_count * 300;
  if (quote.payment_method === 'card') total += total * 0.03;

  return Math.round(total);
}

export interface TrustedQuote extends QuoteForEstimate {
  name: string;
  phone: string;
  email: string;
  comments: string;
  start_address: string;
  end_address: string;
  marketing_opt_in: boolean;
  photo_count: number;
  video_count: number;
  move_date: string | null;
  crew_size: number;
  hourly_rate: number;
  estimated_cost: number;
}

function cleanString(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

function toBool(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1';
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function trustedQuote(body: Record<string, unknown>, db: Pool): Promise<TrustedQuote> {
  const propertyType = body.property_type === 'apartment' ? 'apartment' : 'house';
  const squareFootage = Math.min(Math.max(Math.trunc(Number(body.square_footage ?? 0)), 1), 20000);
  const floors = Math.min(Math.max(Math.trunc(Number(body.floors ?? 1)), 1), 100);
  const hasSpecialtyItems = toBool(body.has_specialty_items);

  const quote: TrustedQuote = {
    name: cleanString(body.name, 120),
    phone: cleanString(body.phone, 32),
    email: cleanString(body.email, 255).toLowerCase(),
    comments: cleanString(body.comments, 2000),
    property_type: propertyType,
    square_footage: squareFootage,
    floors,
    start_address: cleanString(body.start_address, 500),
    end_address: cleanString(body.end_address, 500),
    distance_miles: Math.min(Math.max(Number(body.distance_miles ?? 0), 0), 5000),
    parking_difficulty: body.parking_difficulty === 'difficult' ? 'difficult' : 'easy',
    packing_service: toBool(body.packing_service),
    payment_method: body.payment_method === 'card' ? 'card' : 'cash',
    has_specialty_items: hasSpecialtyItems,
    specialty_items_count: hasSpecialtyItems
      ? Math.min(Math.max(Math.trunc(Number(body.specialty_items_count ?? 0)), 0), 50)
      : 0,
    marketing_opt_in: toBool(body.marketing_opt_in),
    photo_count: Math.min(Math.max(Math.trunc(Number(body.photo_count ?? 0)), 0), 4),
    video_count: Math.min(Math.max(Math.trunc(Number(body.video_count ?? 0)), 0), 1),
    has_elevator: propertyType === 'apartment' ? toBool(body.has_elevator) : null,
    is_internal_unit: propertyType === 'apartment' ? toBool(body.is_internal_unit) : null,
    move_date: DATE_RE.test(String(body.move_date ?? '')) ? (body.move_date as string) : null,
    crew_size: 0,
    hourly_rate: 0,
    estimated_cost: 0,
  };

  if (!quote.name || !quote.phone || !quote.email || !quote.start_address || !quote.end_address) {
    throw new Error('Missing required quote fields');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.email)) {
    throw new Error('Invalid email address');
  }

  const rates = await activeRates(db);
  quote.crew_size = calculateCrewSize(quote.square_footage);
  quote.hourly_rate = hourlyRate(quote.crew_size, rates);
  const min = calculateEstimate(quote, rates, false);
  const max = calculateEstimate(quote, rates, true);
  quote.estimated_cost = Math.round((min + max) / 2);

  return quote;
}
