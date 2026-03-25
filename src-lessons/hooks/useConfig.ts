import { useState, useCallback, useEffect } from 'react';
import type { UserConfig, QuestionnaireAnswers } from '../types/questionnaire';
import { LOCALSTORAGE_KEY } from '../components/SaveLoadAccordion';

const EMPTY_CONFIG: UserConfig = {
  version: '1.0.0',
  savedAt: new Date().toISOString(),
  questionnaires: [],
};

export function useConfig() {
  const [config, setConfig] = useState<UserConfig>(() => {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as UserConfig;
      } catch {
        return EMPTY_CONFIG;
      }
    }
    return EMPTY_CONFIG;
  });

  // Auto-save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const getAnswers = useCallback(
    (questionnaireId: string): Record<string, string | string[] | boolean> => {
      const qa = config.questionnaires.find((q) => q.questionnaireId === questionnaireId);
      return qa?.answers ?? {};
    },
    [config],
  );

  const setAnswers = useCallback(
    (questionnaireId: string, fieldId: string, value: string | string[] | boolean) => {
      setConfig((prev) => {
        const existing = prev.questionnaires.find((q) => q.questionnaireId === questionnaireId);
        const updated: QuestionnaireAnswers = existing
          ? { ...existing, answers: { ...existing.answers, [fieldId]: value }, savedAt: new Date().toISOString() }
          : { questionnaireId, answers: { [fieldId]: value }, savedAt: new Date().toISOString() };

        return {
          ...prev,
          savedAt: new Date().toISOString(),
          questionnaires: existing
            ? prev.questionnaires.map((q) => (q.questionnaireId === questionnaireId ? updated : q))
            : [...prev.questionnaires, updated],
        };
      });
    },
    [],
  );

  const loadConfig = useCallback((loaded: UserConfig) => {
    setConfig(loaded);
  }, []);

  return { config, getAnswers, setAnswers, loadConfig };
}
