export interface LessonStep {
  id: string;
  title: string;
  /** Action mapping style: what you're doing and why */
  action: string;
  explanation: string;
  /** Claude Code prompt the user can copy-paste */
  promptSuggestion?: string;
  /** Tips for modifying this step */
  modificationHints?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  section: 'intake-form' | 'business-data' | 'email-automation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  prerequisites?: string[];
  steps: LessonStep[];
  /** Questionnaire to show before/during this lesson */
  questionnaireId?: string;
}
