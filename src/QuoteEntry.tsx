import { useState } from 'react';
import { ArrowRight, Zap, ClipboardList, Phone } from 'lucide-react';
import salamandarImg from './assets/salamandar.png';

interface QuoteEntryProps {
  onSelect: (mode: 'interactive' | 'classic') => void;
}

export default function QuoteEntry({ onSelect }: QuoteEntryProps) {
  const [hoveredMode, setHoveredMode] = useState<'interactive' | 'classic' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={salamandarImg} alt="Barton Springs" className="h-12 w-12" />
            <div>
              <h1 className="font-bold text-xl text-gray-900">Barton Springs Moving</h1>
              <p className="text-sm text-gray-600">Get Your Free Quote</p>
            </div>
          </div>
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            ← Back to Site
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How would you like to get a quote?
            </h2>
            <p className="text-lg text-gray-600">
              Choose the experience that works best for you
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Interactive Mode */}
            <button
              onClick={() => onSelect('interactive')}
              onMouseEnter={() => setHoveredMode('interactive')}
              onMouseLeave={() => setHoveredMode(null)}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
                hoveredMode === 'interactive'
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white shadow-md hover:border-blue-300'
              }`}
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Interactive Quote
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                    Fun & Fast
                  </span>
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Try our gamified quote experience! Pick your Austin neighborhood on an interactive map, select your furniture, and get a personalized estimate with our crew recommendations.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Interactive map of Austin neighborhoods
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Visual item selector with emojis
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Crew size recommendations
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  ~5 minutes to complete
                </li>
              </ul>
              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                Start Interactive Quote <ArrowRight className="w-5 h-5" />
              </div>
            </button>

            {/* Classic Mode */}
            <button
              onClick={() => onSelect('classic')}
              onMouseEnter={() => setHoveredMode('classic')}
              onMouseLeave={() => setHoveredMode(null)}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
                hoveredMode === 'classic'
                  ? 'border-slate-500 bg-slate-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white shadow-md hover:border-slate-300'
              }`}
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-white mb-4">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Simple Quote Form
                  <span className="ml-2 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
                    Classic
                  </span>
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Prefer a straightforward form? Fill out your move details in a traditional format and get an instant estimate.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  Simple form-based input
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  Clear, straightforward questions
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  Instant price calculation
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  ~3 minutes to complete
                </li>
              </ul>
              <div className="flex items-center gap-2 text-slate-600 font-semibold group-hover:gap-3 transition-all">
                Start Simple Quote <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Or Call Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-gray-900">Prefer to talk to someone?</p>
            </div>
            <p className="text-gray-600 mb-4">
              Give us a call for a quick estimate over the phone
            </p>
            <a
              href="tel:+15126410949"
              className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              (512) 641-0949
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
