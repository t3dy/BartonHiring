import { useState, useMemo } from 'react';
import { Truck, ArrowLeft, BookOpen } from 'lucide-react';
import SectionNav from './components/SectionNav';
import type { SectionId } from './components/SectionNav';
import Questionnaire from './components/Questionnaire';
import PromptDisplay from './components/PromptDisplay';
import LessonRenderer from './components/LessonRenderer';
import SaveLoadAccordion from './components/SaveLoadAccordion';
import { useConfig } from './hooks/useConfig';

// Data imports
import { intakeFormQuestionnaires } from './data/questionnaires/intake-form';
import { businessDataQuestionnaire } from './data/questionnaires/business-data';
import { emailAutomationQuestionnaire } from './data/questionnaires/email-automation';
import { buildIntakeFormPrompt } from './data/prompt-templates/intake-form';
import { setupBusinessDataPrompt } from './data/prompt-templates/business-data';
import { setupEmailAutomationPrompt } from './data/prompt-templates/email-automation';
import { intakeFormLessons } from './data/lesson-content/intake-form';
import { businessDataLessons } from './data/lesson-content/business-data';
import { emailAutomationLessons } from './data/lesson-content/email-automation';

import type { QuestionnaireSchema } from './types/questionnaire';
import type { PromptTemplate } from './types/prompt-template';
import type { Lesson } from './types/lesson';

interface SectionConfig {
  questionnaires: QuestionnaireSchema[];
  promptTemplate: PromptTemplate;
  lessons: Lesson[];
}

const sectionConfigs: Record<SectionId, SectionConfig> = {
  'intake-form': {
    questionnaires: intakeFormQuestionnaires,
    promptTemplate: buildIntakeFormPrompt,
    lessons: intakeFormLessons,
  },
  'business-data': {
    questionnaires: [businessDataQuestionnaire],
    promptTemplate: setupBusinessDataPrompt,
    lessons: businessDataLessons,
  },
  'email-automation': {
    questionnaires: [emailAutomationQuestionnaire],
    promptTemplate: setupEmailAutomationPrompt,
    lessons: emailAutomationLessons,
  },
};

/** Map of checkbox templateVar → human-readable field name for intake forms */
const INTAKE_FIELD_LABELS: Record<string, string> = {
  includeName: 'Full name',
  includePhone: 'Phone number',
  includeEmail: 'Email address',
  includeExperience: 'Years of moving experience',
  includeVehicle: 'Has own vehicle (yes/no)',
  includeLicense: "Driver's license type",
  includeReferences: 'References',
  includeBackgroundConsent: 'Background check consent checkbox',
  includeWorkHistory: 'Previous employment history',
  includeCertifications: 'Certifications (CDL, forklift, etc.)',
  includePhysicalAck: 'Physical requirements acknowledgment',
};

function buildTemplateVars(
  questionnaires: QuestionnaireSchema[],
  getAnswers: (id: string) => Record<string, string | string[] | boolean>,
): Record<string, string> {
  const vars: Record<string, string> = {};
  const selectedFields: string[] = [];
  let hasReferences = false;
  let referenceCount = '2';
  let hasWorkHistory = false;
  let workHistoryCount = '2';

  for (const schema of questionnaires) {
    const answers = getAnswers(schema.id);
    for (const field of schema.fields) {
      const val = answers[field.id] ?? field.default;

      // Collect intake form checkbox fields into a combined list
      if (field.type === 'checkbox' && INTAKE_FIELD_LABELS[field.templateVar]) {
        if (val === true || val === undefined && field.default === true) {
          selectedFields.push(INTAKE_FIELD_LABELS[field.templateVar]);
        }
        if (field.templateVar === 'includeReferences') hasReferences = !!(val ?? field.default);
        if (field.templateVar === 'includeWorkHistory') hasWorkHistory = !!(val ?? field.default);
        continue;
      }

      // Track reference/work-history counts
      if (field.templateVar === 'referenceCount') {
        referenceCount = String(val ?? field.default ?? '2');
        continue;
      }
      if (field.templateVar === 'workHistoryCount') {
        workHistoryCount = String(val ?? field.default ?? '2');
        continue;
      }

      if (Array.isArray(val)) {
        vars[field.templateVar] = val.join(', ');
      } else if (typeof val === 'boolean') {
        vars[field.templateVar] = val ? 'Yes' : 'No';
      } else {
        vars[field.templateVar] = String(val ?? '');
      }
    }
  }

  // Build aggregated intake form variables
  if (selectedFields.length > 0) {
    vars['selectedFields'] = selectedFields.map((f) => `- ${f}`).join('\n');
  }
  vars['referenceSection'] = hasReferences
    ? `## References\nAsk for ${referenceCount} professional references (name, phone, relationship).`
    : '';
  vars['workHistorySection'] = hasWorkHistory
    ? `## Work History\nCollect the last ${workHistoryCount} jobs (company, role, dates, reason for leaving).`
    : '';

  return vars;
}

function IntakeFormTierSelector({
  selectedTier,
  onSelect,
}: {
  selectedTier: number;
  onSelect: (i: number) => void;
}) {
  const tiers = [
    { label: 'Basic', description: 'Name, phone, email, availability', color: 'green' },
    { label: 'Standard', description: '+ experience, vehicle, license, references', color: 'yellow' },
    { label: 'Comprehensive', description: '+ background check, work history, certifications', color: 'red' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose your form tier</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {tiers.map((tier, i) => (
          <button
            key={tier.label}
            type="button"
            onClick={() => onSelect(i)}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              selectedTier === i
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-semibold text-gray-900">{tier.label}</span>
            <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionContent({ sectionId }: { sectionId: SectionId }) {
  const { config, getAnswers, setAnswers, loadConfig } = useConfig();
  const [intakeTier, setIntakeTier] = useState(0);

  const sectionConfig = sectionConfigs[sectionId];

  const activeQuestionnaires = useMemo(() => {
    if (sectionId === 'intake-form') {
      return [sectionConfig.questionnaires[intakeTier]];
    }
    return sectionConfig.questionnaires;
  }, [sectionId, intakeTier, sectionConfig.questionnaires]);

  const templateVars = useMemo(
    () => buildTemplateVars(activeQuestionnaires, getAnswers),
    [activeQuestionnaires, getAnswers],
  );

  return (
    <div className="space-y-6">
      {/* Tier selector for intake form */}
      {sectionId === 'intake-form' && (
        <IntakeFormTierSelector selectedTier={intakeTier} onSelect={setIntakeTier} />
      )}

      {/* Questionnaires */}
      {activeQuestionnaires.map((schema) => (
        <Questionnaire
          key={schema.id}
          schema={schema}
          answers={getAnswers(schema.id)}
          onChange={(fieldId, value) => setAnswers(schema.id, fieldId, value)}
        />
      ))}

      {/* Generated prompt */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Your customized prompt
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          This prompt updates as you change your answers above. Copy it and paste it into Claude Code.
        </p>
        <PromptDisplay template={sectionConfig.promptTemplate} variables={templateVars} />
      </div>

      {/* Save/Load accordion */}
      <SaveLoadAccordion config={config} onLoad={loadConfig} />

      {/* Lessons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-step lessons</h3>
        <div className="space-y-8">
          {sectionConfig.lessons.map((lesson) => (
            <LessonRenderer key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-700 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Claude Code Lessons</h1>
          </div>
          <p className="text-amber-100">
            Barton Springs Moving — Automate your business, one step at a time
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Intro text */}
        {!activeSection && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              What do you want to build?
            </h2>
            <p className="text-gray-600">
              Pick a section below. Each one walks you through building something useful
              for your business using Claude Code. Fill out the questionnaire to customize
              it, then follow the step-by-step lessons.
            </p>
          </div>
        )}

        {/* Back button */}
        {activeSection && (
          <button
            type="button"
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all sections
          </button>
        )}

        {/* Section navigation */}
        {!activeSection && (
          <SectionNav active={activeSection} onSelect={setActiveSection} />
        )}

        {/* Active section content */}
        {activeSection && <SectionContent sectionId={activeSection} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>
            Built for Barton Springs Moving with{' '}
            <a
              href="https://claude.ai/claude-code"
              className="text-amber-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Claude Code
            </a>
          </p>
          <p className="mt-1">
            <a
              href="./index.html"
              className="text-amber-600 hover:underline"
            >
              Hiring Action Map
            </a>
            {' | '}
            <a
              href="https://t3dy.github.io/BartonCatalog/"
              className="text-amber-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Solutions Catalog
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
