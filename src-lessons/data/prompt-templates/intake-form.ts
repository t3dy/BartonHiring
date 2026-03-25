import type { PromptTemplate } from '../../types/prompt-template';

export const buildIntakeFormPrompt: PromptTemplate = {
  id: 'build-intake-form',
  title: 'Build Job Application Intake Form',
  description: 'Generates a Claude Code prompt to create an HTML intake form for your website.',
  template: `Build me an HTML job application form for my moving company website. Here's what I need:

## Form Fields
{{selectedFields}}

## Availability Collection
Use {{availabilityType}} for the availability field.

{{referenceSection}}

{{workHistorySection}}

## Requirements
- Clean, mobile-friendly design that works on phones (most applicants will use their phone)
- Form should submit to {{submissionMethod}}
- Include a "Submit Application" button
- Add basic validation (required fields, valid email/phone format)
- Match my website's color scheme: {{colorScheme}}
- Show a confirmation message after submission

## Style
Keep it simple and professional. No fancy animations. It should load fast on a slow phone connection.`,
  variables: {
    selectedFields: 'Comma-separated list of fields to include',
    availabilityType: 'How availability is collected (checkboxes, dropdown, or text)',
    referenceSection: 'Reference fields section (if included)',
    workHistorySection: 'Work history fields section (if included)',
    submissionMethod: 'Where form data goes (email, Google Sheet, etc.)',
    colorScheme: 'Primary colors for the form',
  },
};

export const modifyIntakeFormPrompt: PromptTemplate = {
  id: 'modify-intake-form',
  title: 'Modify Intake Form',
  description: 'Prompt to modify an existing intake form.',
  template: `I have an existing job application form. I want to make these changes:

{{changes}}

Keep everything else the same. Don't break the existing validation or styling.`,
  variables: {
    changes: 'List of changes to make to the form',
  },
};

export const intakeFormPrompts = [buildIntakeFormPrompt, modifyIntakeFormPrompt];
