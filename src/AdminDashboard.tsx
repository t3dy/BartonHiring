import { useState, useEffect } from 'react';
import {
  Phone, Mail, ChevronLeft, ChevronDown, ChevronUp,
  Check, MapPin, Package, Star, Trash2,
  Bell, AlertCircle, Zap, ExternalLink,
} from 'lucide-react';
import {
  getQuotes, updateQuote, deleteQuote, areaDisplay,
  type QuoteRecord, PROPERTY_LABELS, SIZE_LABELS,
  ITEM_LABELS, SPECIAL_LABELS, SERVICE_LABELS, BOX_LABELS,
} from './quoteStore';

/* ─── Helpers ─── */
const STATUS_CONFIG: Record<QuoteRecord['status'], { label: string; color: string; dot: string }> = {
  new:       { label: 'New',       color: 'bg-rose-100 text-rose-700 border-rose-200',       dot: 'bg-rose-500' },
  contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-700 border-amber-200',     dot: 'bg-amber-500' },
  scheduled: { label: 'Scheduled', color: 'bg-teal-100 text-teal-700 border-teal-200',        dot: 'bg-teal-500' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500 border-gray-200',        dot: 'bg-gray-400' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function itemTotal(items: Record<string, number>): number {
  return Object.values(items ?? {}).reduce((a, b) => a + b, 0);
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: QuoteRecord['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─── Quote card (list view) ─── */
function QuoteCard({ quote, onClick }: { quote: QuoteRecord; onClick: () => void }) {
  const name = [quote.firstName, quote.lastName].filter(Boolean).join(' ') || 'Unknown';
  const prop = PROPERTY_LABELS[quote.propertyType] ?? quote.propertyType;
  const size = SIZE_LABELS[quote.size] ?? quote.size;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900">{name}</span>
            <StatusBadge status={quote.status} />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{timeAgo(quote.submittedAt)}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-teal-700">${quote.estimateLow.toLocaleString()}–${quote.estimateHigh.toLocaleString()}</p>
          {quote.moveDate && (
            <p className="text-xs text-gray-400 mt-0.5">📅 {formatDate(quote.moveDate)}</p>
          )}
        </div>
      </div>

      {(areaDisplay(quote.origin) || areaDisplay(quote.destination)) && (
        <p className="text-sm font-semibold text-gray-700 mb-1.5">
          {areaDisplay(quote.origin) || '?'} <span className="text-gray-400">→</span> {areaDisplay(quote.destination) || '?'}
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 mb-3">
        <span>{prop}</span>
        {size && <><span>·</span><span>{size}</span></>}
        {itemTotal(quote.items) > 0 && <><span>·</span><span>{itemTotal(quote.items)} items</span></>}
        {quote.services.length > 0 && <><span>·</span><span>{quote.services.map(s => SERVICE_LABELS[s]).join(', ')}</span></>}
      </div>

      <div className="flex items-center justify-between">
        <a
          href={`tel:${quote.phone}`}
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors"
        >
          <Phone className="h-3 w-3" /> {quote.phone || 'No phone'}
        </a>
        {quote.internalNotes && (
          <span className="text-xs text-amber-600 font-medium">📝 Has notes</span>
        )}
      </div>
    </button>
  );
}

/* ─── Detail section wrapper ─── */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        {icon}
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ─── Access info display ─── */
function AccessDetail({ label, info }: { label: string; info: QuoteRecord['origin'] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">{label}</p>
      {areaDisplay(info) && (
        <p className="text-sm font-bold text-gray-900">{areaDisplay(info)}</p>
      )}
      <p className="text-sm font-medium text-gray-700">
        {info.address || 'Street address not provided'}{info.zip ? `, ${info.zip}` : ''}
      </p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
        <span>Floor: {info.floor}</span>
        {info.floor !== 'Ground / 1st' && (
          <span>{info.elevator ? '✅ Elevator' : '🚶 Stairs only'}</span>
        )}
        <span>{info.parkingDistance === 'door' ? '🚪 Parking at door' : info.parkingDistance === 'short' ? '🚶 Short walk to door' : info.parkingDistance === 'long' ? '🏃 Long walk to door' : ''}</span>
        {info.narrowHallways && <span>⚠️ Narrow hallways</span>}
        {info.coiRequired && <span>📄 COI required</span>}
      </div>
    </div>
  );
}

/* ─── Email setup banner ─── */
function EmailSetupBanner() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-bold text-amber-800">Get email alerts for new quotes</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-amber-600" /> : <ChevronDown className="h-4 w-4 text-amber-600" />}
      </button>
      {expanded && (
        <div className="border-t border-amber-200 px-4 py-4 space-y-4 text-sm text-amber-900">
          <p>Right now quotes are stored locally in this browser. To get email alerts and persist data across devices, connect to <strong>Formspree</strong> (free, 50 submissions/month).</p>

          <div className="space-y-2">
            <div className="flex gap-2"><span className="font-bold text-amber-700 shrink-0">1.</span><span>Go to <strong>formspree.io</strong> and create a free account</span></div>
            <div className="flex gap-2"><span className="font-bold text-amber-700 shrink-0">2.</span><span>Create a new form — Formspree gives you an endpoint like <code className="bg-amber-100 px-1 rounded">https://formspree.io/f/xyzabc</code></span></div>
            <div className="flex gap-2"><span className="font-bold text-amber-700 shrink-0">3.</span><span>In <code className="bg-amber-100 px-1 rounded">QuoteWizard.tsx</code>, update the <code className="bg-amber-100 px-1 rounded">saveQuote()</code> call to also POST to that endpoint</span></div>
            <div className="flex gap-2"><span className="font-bold text-amber-700 shrink-0">4.</span><span>Every submission sends you an email with the full quote details</span></div>
          </div>

          <div className="rounded-xl bg-white border border-amber-200 p-3">
            <p className="text-xs font-bold text-amber-700 mb-1">Want full persistence across devices?</p>
            <p className="text-xs text-amber-800">Upgrade to <strong>Supabase</strong> (free tier) — a real database that stores every quote permanently. Takes about 2 hours to set up. Then this dashboard reads live from the database instead of localStorage.</p>
          </div>

          <a
            href="https://formspree.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
          >
            Open Formspree <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Quote detail view ─── */
function QuoteDetail({
  quote, onBack, onUpdate,
}: {
  quote: QuoteRecord;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<QuoteRecord>) => void;
}) {
  const [notes, setNotes] = useState(quote.internalNotes);
  const [notesSaved, setNotesSaved] = useState(false);
  const name = [quote.firstName, quote.lastName].filter(Boolean).join(' ') || 'Unknown';

  const handleSaveNotes = () => {
    onUpdate(quote.id, { internalNotes: notes });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleStatus = (status: QuoteRecord['status']) => {
    onUpdate(quote.id, { status });
  };

  return (
    <div>
      {/* Back + name header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4" /> All Quotes
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <p className="text-xs text-gray-400">{timeAgo(quote.submittedAt)} · {new Date(quote.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
        </div>
        <StatusBadge status={quote.status} />
      </div>

      {/* Quick contact actions */}
      <div className="flex gap-2 mb-5">
        <a
          href={`tel:${quote.phone}`}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-bold text-sm text-white hover:bg-teal-700 transition-colors"
        >
          <Phone className="h-4 w-4" /> {quote.phone || 'No phone'}
        </a>
        {quote.email && (
          <a
            href={`mailto:${quote.email}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 font-bold text-sm text-gray-700 hover:border-gray-300 transition-colors"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
        )}
      </div>

      <div className="space-y-3">
        {/* Status management */}
        <Section title="Status" icon={<Check className="h-4 w-4 text-gray-500" />}>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STATUS_CONFIG) as QuoteRecord['status'][]).map(s => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                className={`rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition-all
                  ${quote.status === s
                    ? STATUS_CONFIG[s].color + ' border-current'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </Section>

        {/* Estimate */}
        <div className="rounded-xl bg-gradient-to-r from-teal-50 to-brand-50 border border-teal-100 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-teal-600">Estimated Range</p>
            <p className="text-2xl font-bold text-gray-900">${quote.estimateLow.toLocaleString()} – ${quote.estimateHigh.toLocaleString()}</p>
          </div>
          {quote.moveDate && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Move date</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(quote.moveDate)}</p>
              <p className="text-xs text-gray-400">{quote.flexibility === 'exact' ? 'Exact date' : quote.flexibility === 'week' ? '±1 week' : '±1 month'}</p>
            </div>
          )}
        </div>

        {/* Move info */}
        <Section title="Move Details" icon={<MapPin className="h-4 w-4 text-gray-500" />}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 mt-0.5">A</div>
              <AccessDetail label="Moving From" info={quote.origin} />
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 mt-0.5">B</div>
              <AccessDetail label="Moving To" info={quote.destination} />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600 font-medium">
              {PROPERTY_LABELS[quote.propertyType] ?? quote.propertyType}
            </span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600 font-medium">
              {SIZE_LABELS[quote.size] ?? quote.size}
            </span>
            {quote.stories && (
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600 font-medium">
                {quote.stories} {quote.stories === '1' ? 'story' : 'stories'}
              </span>
            )}
            {quote.boxes && BOX_LABELS[quote.boxes] && (
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600 font-medium">
                📦 {BOX_LABELS[quote.boxes]}
              </span>
            )}
            {!!quote.crew && (
              <span className="rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs text-teal-700 font-medium">
                🦎 Crew of {quote.crew}
              </span>
            )}
            {quote.promoCode && (
              <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700 font-medium">
                🎟️ {quote.promoCode}
              </span>
            )}
          </div>
        </Section>

        {/* Items */}
        {(itemTotal(quote.items) > 0 || quote.specialItems.length > 0) && (
          <Section title="Items" icon={<Package className="h-4 w-4 text-gray-500" />}>
            {itemTotal(quote.items) > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 font-semibold mb-1.5">Standard Items</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(quote.items).map(([id, qty]) => (
                    <span key={id} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-700 font-medium">
                      {ITEM_LABELS[id] ?? id}{qty > 1 ? ` ×${qty}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {quote.specialItems.length > 0 && (
              <div>
                <p className="text-xs text-amber-600 font-semibold mb-1.5">⚠️ Fragile / Special Handling</p>
                <div className="flex flex-wrap gap-1.5">
                  {quote.specialItems.map(id => (
                    <span key={id} className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs text-amber-800 font-medium">
                      {SPECIAL_LABELS[id] ?? id}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Services */}
        {quote.services.length > 0 && (
          <Section title="Add-On Services" icon={<Star className="h-4 w-4 text-gray-500" />}>
            <div className="flex flex-wrap gap-1.5">
              {quote.services.map(id => (
                <span key={id} className="rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs text-teal-800 font-medium">
                  {SERVICE_LABELS[id] ?? id}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Customer notes */}
        {quote.notes && (
          <Section title="Customer Notes" icon={<AlertCircle className="h-4 w-4 text-gray-500" />}>
            <p className="text-sm text-gray-700 italic">"{quote.notes}"</p>
          </Section>
        )}

        {/* Internal notes */}
        <Section title="Your Notes" icon={<Zap className="h-4 w-4 text-gray-500" />}>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add notes after you call — confirmed date, special instructions, crew assigned, etc."
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none resize-none mb-2"
          />
          <button
            onClick={handleSaveNotes}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all
              ${notesSaved
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-teal-600 text-white hover:bg-teal-700'}`}
          >
            {notesSaved ? <><Check className="h-3 w-3" /> Saved</> : 'Save Notes'}
          </button>
        </Section>

        {/* Delete */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (window.confirm(`Remove quote from ${name}?`)) {
                deleteQuote(quote.id);
                onBack();
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="h-3 w-3" /> Remove this quote
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main admin dashboard ─── */
type Tab = 'all' | 'new' | 'contacted' | 'scheduled' | 'completed';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'completed', label: 'Completed' },
];

export default function AdminDashboard({ onBack }: { onBack?: () => void }) {
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setQuotes(getQuotes());
  }, []);

  const refresh = () => setQuotes(getQuotes());

  const handleUpdate = (id: string, updates: Partial<QuoteRecord>) => {
    updateQuote(id, updates);
    refresh();
  };

  const filtered = quotes.filter(q => activeTab === 'all' || q.status === activeTab);
  const newCount = quotes.filter(q => q.status === 'new').length;
  const selected = quotes.find(q => q.id === selectedId);

  // Revenue metrics
  const completedRevenue = quotes
    .filter(q => q.status === 'completed')
    .reduce((sum, q) => sum + Math.round((q.estimateLow + q.estimateHigh) / 2), 0);
  const pipelineRevenue = quotes
    .filter(q => q.status === 'new' || q.status === 'contacted' || q.status === 'scheduled')
    .reduce((sum, q) => sum + Math.round((q.estimateLow + q.estimateHigh) / 2), 0);

  if (selected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Quote Detail</span>
            <span className="text-xs text-gray-400">Barton Springs Moving</span>
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-4 py-6">
          <QuoteDetail
            quote={selected}
            onBack={() => { setSelectedId(null); refresh(); }}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          {onBack ? (
            <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft className="h-4 w-4" /> Hiring Guide
            </button>
          ) : (
            <span className="text-sm text-gray-400">bartonspringsmoving.com</span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">Quote Inbox</span>
            {newCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                {newCount}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">{quotes.length} total</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {/* Email setup banner */}
        <EmailSetupBanner />

        {/* Revenue snapshot */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase">Pipeline</p>
            <p className="text-xl font-bold text-gray-900 mt-1">${pipelineRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">{quotes.filter(q => ['new','contacted','scheduled'].includes(q.status)).length} open quotes</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs text-emerald-600 font-semibold uppercase">Completed</p>
            <p className="text-xl font-bold text-emerald-800 mt-1">${completedRevenue.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 mt-0.5">{quotes.filter(q => q.status === 'completed').length} moves done</p>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(tab => {
            const count = tab.id === 'all' ? quotes.length : quotes.filter(q => q.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all
                  ${activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold
                    ${activeTab === tab.id ? 'bg-white/20 text-white' : tab.id === 'new' && count > 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quote list */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">No {activeTab === 'all' ? '' : activeTab} quotes yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered
              .slice()
              .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
              .map(q => (
                <QuoteCard key={q.id} quote={q} onClick={() => setSelectedId(q.id)} />
              ))}
          </div>
        )}

        {/* Footer legend */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-400 pt-2">
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" /> New request</div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Called customer</div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal-400" /> Move booked</div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Move done</div>
        </div>

        {/* Last updated */}
        <p className="text-center text-xs text-gray-300">
          Data stored locally in this browser · <button onClick={() => { localStorage.removeItem('bsm_quotes'); refresh(); }} className="underline hover:text-gray-400">Reset demo data</button>
        </p>
      </div>
    </div>
  );
}
