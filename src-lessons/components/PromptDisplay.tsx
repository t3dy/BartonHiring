import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import type { PromptTemplate } from '../types/prompt-template';

interface PromptDisplayProps {
  template: PromptTemplate;
  variables: Record<string, string>;
}

function fillTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    // If value exists in variables (even empty string), use it. Only show [key] for truly missing vars.
    result = result.replaceAll(`{{${key}}}`, value);
  }
  // Replace any remaining unfilled {{variables}} with [variable] placeholder
  result = result.replace(/\{\{(\w+)\}\}/g, '[$1]');
  // Remove blank lines left by empty variable substitutions, collapse extra newlines
  result = result
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
  return result;
}

export default function PromptDisplay({ template, variables }: PromptDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const filledPrompt = fillTemplate(template.template, variables);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(filledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-gray-300">{template.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="text-xs px-2 py-1 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
          >
            {showRaw ? 'Filled' : 'Raw template'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prompt body */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">
          {showRaw ? template.template : filledPrompt}
        </pre>
      </div>

      {/* Description */}
      <div className="px-4 py-3 bg-gray-800 border-t border-gray-700">
        <p className="text-xs text-gray-400">{template.description}</p>
      </div>
    </div>
  );
}

export { fillTemplate };
