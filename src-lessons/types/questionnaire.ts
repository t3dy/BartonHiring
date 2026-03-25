export type FieldType = 'select' | 'multiselect' | 'checkbox' | 'text';

export interface QuestionnaireField {
  id: string;
  label: string;
  helpText?: string;
  type: FieldType;
  options?: { value: string; label: string; description?: string }[];
  default?: string | string[] | boolean;
  required?: boolean;
  /** Which prompt template variable this field fills */
  templateVar: string;
}

export interface QuestionnaireSchema {
  id: string;
  title: string;
  description: string;
  fields: QuestionnaireField[];
  /** Which prompt template to use with answers from this questionnaire */
  promptTemplateId: string;
}

export interface QuestionnaireAnswers {
  questionnaireId: string;
  answers: Record<string, string | string[] | boolean>;
  savedAt: string;
}

export interface UserConfig {
  version: string;
  savedAt: string;
  questionnaires: QuestionnaireAnswers[];
}
