import { useState } from 'react';
import { ChevronLeft, Phone, CheckCircle2 } from 'lucide-react';
import salamandarImg from './assets/salamandar.png';
import { saveQuote } from './quoteStore';

type Step = 'details' | 'contact' | 'summary';

interface FormData {
  moveType: 'local' | 'long-distance' | '';
  propertyType: 'studio' | '1br' | '2br' | '3br' | '4br' | 'other' | '';
  moveDistance: 'same-city' | '1-2hr' | '2-4hr' | '4+hr' | '';
  boxes: number;
  stairs: boolean;
  elevator: boolean | null;
  serviceType: 'full-service' | 'loading-only' | '';
  promoCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const PRICING_BASE = {
  studio: 800,
  '1br': 1200,
  '2br': 1600,
  '3br': 2200,
  '4br': 2800,
  other: 1500,
};

const DISTANCE_MULTIPLIER = {
  'same-city': 1,
  '1-2hr': 1.25,
  '2-4hr': 1.5,
  '4+hr': 2,
};

const SERVICE_MARKUP = {
  'full-service': 0.4,
  'loading-only': 0.15,
};

const PROMOS: Record<string, { type: 'pct' | 'flat'; value: number }> = {
  ONTHELAKE5: { type: 'pct', value: 5 },
  BARTON50: { type: 'flat', value: 50 },
};

export default function SimpleCalculator({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState<FormData>({
    moveType: '',
    propertyType: '',
    moveDistance: '',
    boxes: 0,
    stairs: false,
    elevator: null,
    serviceType: '',
    promoCode: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const calculateEstimate = (): number => {
    if (!form.propertyType || !form.moveDistance || !form.serviceType) return 0;

    let base = PRICING_BASE[form.propertyType] || 1500;
    base *= DISTANCE_MULTIPLIER[form.moveDistance] || 1;
    base += form.boxes * 15;

    const serviceMarkup = SERVICE_MARKUP[form.serviceType] || 0;
    let total = base * (1 + serviceMarkup);

    if (form.stairs) total += 200;
    if (form.elevator === true) total -= 100;

    if (form.promoCode) {
      const promo = PROMOS[form.promoCode.toUpperCase()];
      if (promo) {
        if (promo.type === 'pct') {
          total *= 1 - promo.value / 100;
        } else {
          total -= promo.value;
        }
      }
    }

    return Math.max(total, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone || !form.email) {
      alert('Please fill in all contact fields');
      return;
    }

    const estimate = calculateEstimate();
    try {
      await saveQuote({
      propertyType: form.propertyType as any,
      size: form.propertyType as any,
      stories: '',
      origin: {
        area: 'Austin',
        customArea: '',
        address: '',
        zip: '',
        floor: '',
        elevator: null,
        parkingDistance: '',
        narrowHallways: false,
        coiRequired: false,
      },
      destination: {
        area: '',
        customArea: '',
        address: '',
        zip: '',
        floor: '',
        elevator: null,
        parkingDistance: '',
        narrowHallways: false,
        coiRequired: false,
      },
      items: {},
      specialItems: [],
      services: [form.serviceType],
      boxes: String(form.boxes),
      crew: 2,
      promoCode: form.promoCode,
      moveDate: '',
      flexibility: 'week',
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      notes: `Simple Quote: ${form.moveType} move, ${form.propertyType} property, ${form.moveDistance} distance. Stairs: ${form.stairs}, Elevator: ${form.elevator}`,
      estimateLow: Math.round(estimate * 0.9),
      estimateHigh: Math.round(estimate * 1.1),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quote:', error);
      alert('There was an error submitting your quote. Please try again or call us at (512) 641-0949');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <div className="bg-white border-b border-gray-200 py-4 px-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={salamandarImg} alt="Barton Springs" className="h-12 w-12" />
              <div>
                <h1 className="font-bold text-xl text-gray-900">Barton Springs Moving</h1>
                <p className="text-sm text-gray-600">Quote Confirmation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Received!</h2>
            <p className="text-gray-600 mb-6">
              Thanks for using our quote calculator, {form.firstName}! We've sent a confirmation to <strong>{form.email}</strong>
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Your Estimated Cost</p>
              <p className="text-3xl font-bold text-blue-600">
                ${calculateEstimate().toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-8">
              A Barton Springs Moving expert will contact you within 24 hours to confirm details and schedule your move.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+15126410949"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Us Now: (512) 641-0949
              </a>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Back to Site
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={salamandarImg} alt="Barton Springs" className="h-12 w-12" />
            <div>
              <h1 className="font-bold text-xl text-gray-900">Barton Springs Moving</h1>
              <p className="text-sm text-gray-600">Simple Quote Form</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <form onSubmit={handleSubmit}>
            {step === 'details' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Move Details</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Type of Move
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['local', 'long-distance'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, moveType: type as 'local' | 'long-distance' })}
                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                          form.moveType === type
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        {type === 'local' ? '📍 Local' : '🚚 Long Distance'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Property Type
                  </label>
                  <select
                    value={form.propertyType}
                    onChange={(e) => setForm({ ...form, propertyType: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                  >
                    <option value="">Select property type...</option>
                    <option value="studio">Studio</option>
                    <option value="1br">1 Bedroom</option>
                    <option value="2br">2 Bedroom</option>
                    <option value="3br">3 Bedroom</option>
                    <option value="4br">4+ Bedroom</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Move Distance
                  </label>
                  <select
                    value={form.moveDistance}
                    onChange={(e) => setForm({ ...form, moveDistance: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                  >
                    <option value="">Select distance...</option>
                    <option value="same-city">Same City (Austin)</option>
                    <option value="1-2hr">1-2 Hours Away</option>
                    <option value="2-4hr">2-4 Hours Away</option>
                    <option value="4+hr">4+ Hours Away</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Number of Boxes: <strong>{form.boxes}</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.boxes}
                    onChange={(e) => setForm({ ...form, boxes: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-2">Includes packing supplies (+$15 per box)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Service Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'full-service', label: '🎯 Full Service', desc: 'Packing + Loading + Unloading' },
                      { id: 'loading-only', label: '📦 Loading Only', desc: 'Just load & transport' },
                    ].map(({ id, label, desc }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setForm({ ...form, serviceType: id as any })}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          form.serviceType === id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{label}</div>
                        <div className="text-xs text-gray-600">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.stairs}
                      onChange={(e) => setForm({ ...form, stairs: e.target.checked })}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-gray-700 font-medium">Stairs or multiple floors? (+$200)</span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, elevator: true })}
                      className={`flex-1 p-2 rounded-lg border-2 font-medium text-sm transition-all ${
                        form.elevator === true
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      ✓ Has Elevator
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, elevator: false })}
                      className={`flex-1 p-2 rounded-lg border-2 font-medium text-sm transition-all ${
                        form.elevator === false
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      ✗ No Elevator
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Promo Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter code..."
                    value={form.promoCode}
                    onChange={(e) => setForm({ ...form, promoCode: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg font-medium text-gray-700 placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g., ONTHELAKE5, BARTON50</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-6">
                  <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                  <p className="text-4xl font-bold text-blue-600">
                    ${calculateEstimate().toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">*Exact price may vary based on final assessment</p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('contact')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Next: Contact Info
                </button>
              </div>
            )}

            {step === 'contact' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                    placeholder="(512) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-sm text-amber-800">
                    💡 We'll use this info to send you a quote confirmation and contact you about your move.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Get My Quote
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
