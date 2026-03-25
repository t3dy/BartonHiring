import { FileText, Database, Mail } from 'lucide-react';

export type SectionId = 'intake-form' | 'business-data' | 'email-automation';

interface SectionNavProps {
  active: SectionId | null;
  onSelect: (id: SectionId) => void;
}

const sections: { id: SectionId; label: string; icon: React.FC<{ className?: string }>; tagline: string }[] = [
  {
    id: 'intake-form',
    label: 'Job Application Form',
    icon: FileText,
    tagline: 'Build a form applicants can fill out on your website',
  },
  {
    id: 'business-data',
    label: 'Business Data & Notes',
    icon: Database,
    tagline: 'Track leads, log outcomes, take notes with zero friction',
  },
  {
    id: 'email-automation',
    label: 'Email Automation',
    icon: Mail,
    tagline: 'Never miss a lead — Claude Code checks your Gmail daily',
  },
];

export default function SectionNav({ active, onSelect }: SectionNavProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={`text-left p-5 rounded-xl border-2 transition-all ${
              isActive
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <Icon
              className={`w-8 h-8 mb-3 ${isActive ? 'text-amber-600' : 'text-gray-400'}`}
            />
            <h3 className={`font-semibold ${isActive ? 'text-amber-900' : 'text-gray-900'}`}>
              {section.label}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{section.tagline}</p>
          </button>
        );
      })}
    </div>
  );
}

export { sections };
