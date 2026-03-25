import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import type { QuestionnaireSchema, QuestionnaireField } from '../types/questionnaire';

interface QuestionnaireProps {
  schema: QuestionnaireSchema;
  answers: Record<string, string | string[] | boolean>;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
}

function FieldHelp({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-amber-600 transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4 inline" />
      </button>
      {open && (
        <span className="absolute left-6 top-0 z-10 w-64 p-2 text-sm bg-amber-50 border border-amber-200 rounded-lg shadow-lg text-gray-700">
          {text}
        </span>
      )}
    </span>
  );
}

function SelectField({
  field,
  value,
  onChange,
}: {
  field: QuestionnaireField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {field.options?.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
            value === opt.value
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <input
            type="radio"
            name={field.id}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mt-0.5 accent-amber-600"
          />
          <div>
            <span className="font-medium text-gray-900">{opt.label}</span>
            {opt.description && (
              <span className="block text-sm text-gray-500 mt-0.5">{opt.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

function MultiselectField({
  field,
  value,
  onChange,
}: {
  field: QuestionnaireField;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  return (
    <div className="space-y-2">
      {field.options?.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
            value.includes(opt.value)
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            className="mt-0.5 accent-amber-600"
          />
          <div>
            <span className="font-medium text-gray-900">{opt.label}</span>
            {opt.description && (
              <span className="block text-sm text-gray-500 mt-0.5">{opt.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

function CheckboxField({
  value,
  onChange,
}: {
  field: QuestionnaireField;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
        value
          ? 'border-amber-500 bg-amber-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
        className="accent-amber-600"
      />
      <span className="font-medium text-gray-900">Include this field</span>
    </label>
  );
}

function TextField({
  field,
  value,
  onChange,
}: {
  field: QuestionnaireField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.helpText ?? 'Type here...'}
      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none bg-white text-gray-900"
    />
  );
}

function QuestionnaireFieldRenderer({
  field,
  value,
  onChange,
}: {
  field: QuestionnaireField;
  value: string | string[] | boolean;
  onChange: (v: string | string[] | boolean) => void;
}) {
  switch (field.type) {
    case 'select':
      return <SelectField field={field} value={value as string} onChange={onChange} />;
    case 'multiselect':
      return <MultiselectField field={field} value={value as string[]} onChange={onChange} />;
    case 'checkbox':
      return <CheckboxField field={field} value={value as boolean} onChange={onChange} />;
    case 'text':
      return <TextField field={field} value={value as string} onChange={onChange} />;
  }
}

export default function Questionnaire({ schema, answers, onChange }: QuestionnaireProps) {
  const [expanded, setExpanded] = useState(true);

  const getDefault = (field: QuestionnaireField): string | string[] | boolean => {
    if (field.type === 'checkbox') return field.default ?? false;
    if (field.type === 'multiselect') return (field.default as string[]) ?? [];
    return (field.default as string) ?? '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{schema.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{schema.description}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-6">
          {schema.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
                {field.helpText && <FieldHelp text={field.helpText} />}
              </label>
              <QuestionnaireFieldRenderer
                field={field}
                value={answers[field.id] ?? getDefault(field)}
                onChange={(v) => onChange(field.id, v)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
