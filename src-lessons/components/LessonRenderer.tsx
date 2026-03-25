import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  Lightbulb,
  Copy,
  Check,
} from 'lucide-react';
import type { Lesson, LessonStep } from '../types/lesson';

interface LessonRendererProps {
  lesson: Lesson;
}

function DifficultyBadge({ level }: { level: Lesson['difficulty'] }) {
  const styles = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[level]}`}>
      {level}
    </span>
  );
}

function StepCard({
  step,
  index,
  completed,
  onToggle,
}: {
  step: LessonStep;
  index: number;
  completed: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    if (step.promptSuggestion) {
      await navigator.clipboard.writeText(step.promptSuggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-xl border-2 transition-all ${
        completed ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-white'
      }`}
    >
      {/* Step header */}
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          onClick={onToggle}
          className="mt-0.5 shrink-0"
          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 hover:text-amber-400 transition-colors" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                Step {index + 1}
              </span>
              <span
                className={`font-semibold ${completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}
              >
                {step.title}
              </span>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <ArrowRight className="w-3.5 h-3.5 inline mr-1" />
              {step.action}
            </p>
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 ml-9 space-y-4">
          {/* Explanation */}
          <div className="text-sm text-gray-700 leading-relaxed">{step.explanation}</div>

          {/* Prompt suggestion */}
          {step.promptSuggestion && (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800">
                <span className="text-xs text-amber-400 font-medium">
                  Paste this into Claude Code
                </span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-all ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-sm text-gray-100 whitespace-pre-wrap font-mono">
                {step.promptSuggestion}
              </pre>
            </div>
          )}

          {/* Modification hints */}
          {step.modificationHints && step.modificationHints.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-amber-700 mb-2">
                <Lightbulb className="w-4 h-4" />
                Ways to customize this
              </div>
              <ul className="text-sm text-amber-900 space-y-1.5">
                {step.modificationHints.map((hint, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">-</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LessonRenderer({ lesson }: LessonRendererProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const progress = lesson.steps.length > 0 ? completedSteps.size / lesson.steps.length : 0;

  return (
    <div className="space-y-4">
      {/* Lesson header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
          <DifficultyBadge level={lesson.difficulty} />
        </div>
        <p className="text-gray-600">{lesson.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <span>~{lesson.estimatedMinutes} min</span>
          <span>{lesson.steps.length} steps</span>
          {progress > 0 && (
            <span className="text-green-600 font-medium">
              {Math.round(progress * 100)}% complete
            </span>
          )}
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {lesson.steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            completed={completedSteps.has(step.id)}
            onToggle={() => toggleStep(step.id)}
          />
        ))}
      </div>
    </div>
  );
}
