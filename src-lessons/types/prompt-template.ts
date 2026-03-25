export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  /** Template string with {{variable}} placeholders */
  template: string;
  /** Map of variable names to descriptions */
  variables: Record<string, string>;
}
