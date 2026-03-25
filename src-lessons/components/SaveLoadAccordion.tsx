import { useState, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Clipboard,
  Terminal,
  HardDrive,
  Check,
  Upload,
} from 'lucide-react';
import type { UserConfig } from '../types/questionnaire';

interface SaveLoadAccordionProps {
  config: UserConfig;
  onLoad: (config: UserConfig) => void;
}

type SaveMethod = 'download' | 'clipboard' | 'claude-folder' | 'localstorage';

const LOCALSTORAGE_KEY = 'barton-lessons-config';

export default function SaveLoadAccordion({ config, onLoad }: SaveLoadAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedMethod, setCopiedMethod] = useState<SaveMethod | null>(null);
  const [showClaudePrompt, setShowClaudePrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const configJson = JSON.stringify(config, null, 2);

  const handleDownload = () => {
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'barton-config.json';
    a.click();
    URL.revokeObjectURL(url);
    flash('download');
  };

  const handleClipboard = async () => {
    await navigator.clipboard.writeText(configJson);
    flash('clipboard');
  };

  const handleLocalStorage = () => {
    localStorage.setItem(LOCALSTORAGE_KEY, configJson);
    flash('localstorage');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const loaded = JSON.parse(reader.result as string) as UserConfig;
        onLoad(loaded);
      } catch {
        alert('Could not read that file. Make sure it\'s a barton-config.json file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const flash = (method: SaveMethod) => {
    setCopiedMethod(method);
    setTimeout(() => setCopiedMethod(null), 2000);
  };

  const claudePrompt = `Save this configuration to my business-data/config/ folder as barton-config.json:\n\n\`\`\`json\n${configJson}\n\`\`\``;

  const methods: {
    id: SaveMethod;
    icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
    recommended?: boolean;
    action: () => void;
    buttonText: string;
  }[] = [
    {
      id: 'download',
      icon: Download,
      title: 'Download JSON file',
      description:
        'Saves barton-config.json to your Downloads folder. You can email it to yourself or keep it as a backup.',
      recommended: true,
      action: handleDownload,
      buttonText: 'Download',
    },
    {
      id: 'clipboard',
      icon: Clipboard,
      title: 'Copy to clipboard',
      description:
        'Copies the JSON text so you can paste it into any file, note, or message.',
      action: handleClipboard,
      buttonText: 'Copy',
    },
    {
      id: 'claude-folder',
      icon: Terminal,
      title: 'Save via Claude Code',
      description:
        'Shows you a prompt to paste into Claude Code. It will save the config into your business-data folder where Claude Code can find it later.',
      action: () => setShowClaudePrompt(!showClaudePrompt),
      buttonText: showClaudePrompt ? 'Hide prompt' : 'Show prompt',
    },
    {
      id: 'localstorage',
      icon: HardDrive,
      title: 'Auto-save in browser',
      description:
        'Silently saves in your browser so your answers are here next time you visit. Lost if you clear browser data.',
      action: handleLocalStorage,
      buttonText: 'Save now',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Save & Load Your Configuration
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Save your questionnaire answers so you can pick up where you left off
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Save options */}
          {methods.map((method) => {
            const Icon = method.icon;
            const isFlashed = copiedMethod === method.id;
            return (
              <div
                key={method.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50"
              >
                <Icon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{method.title}</span>
                    {method.recommended && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                  {method.id === 'claude-folder' && showClaudePrompt && (
                    <div className="mt-3 bg-gray-900 rounded-lg p-3 overflow-x-auto">
                      <pre className="text-xs text-gray-100 whitespace-pre-wrap font-mono">
                        {claudePrompt}
                      </pre>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={method.action}
                  className={`shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-all ${
                    isFlashed
                      ? 'bg-green-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {isFlashed ? (
                    <>
                      <Check className="w-4 h-4" />
                      Done!
                    </>
                  ) : (
                    method.buttonText
                  )}
                </button>
              </div>
            );
          })}

          {/* Load section */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Load a saved configuration
            </h4>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-400 text-gray-600 hover:text-amber-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload barton-config.json
              </button>
              <button
                type="button"
                onClick={() => {
                  const stored = localStorage.getItem(LOCALSTORAGE_KEY);
                  if (stored) {
                    try {
                      onLoad(JSON.parse(stored) as UserConfig);
                    } catch {
                      alert('Saved browser data appears corrupted. Try uploading a JSON file instead.');
                    }
                  } else {
                    alert('No saved configuration found in this browser.');
                  }
                }}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:border-amber-400 text-gray-600 hover:text-amber-700 transition-colors"
              >
                <HardDrive className="w-4 h-4" />
                Load from browser
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { LOCALSTORAGE_KEY };
