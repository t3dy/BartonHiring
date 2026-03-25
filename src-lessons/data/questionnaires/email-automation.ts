import type { QuestionnaireSchema } from '../../types/questionnaire';

export const emailAutomationQuestionnaire: QuestionnaireSchema = {
  id: 'email-automation-setup',
  title: 'Email Automation Configuration',
  description: 'Configure what Claude Code should look for in your Gmail each day.',
  promptTemplateId: 'setup-email-automation',
  fields: [
    {
      id: 'check-frequency',
      label: 'How often should Claude Code check your email?',
      type: 'select',
      options: [
        { value: 'daily-morning', label: 'Once each morning', description: 'Get a summary when you start your day' },
        { value: 'daily-evening', label: 'Once each evening', description: 'Review what you might have missed' },
        { value: 'twice-daily', label: 'Morning and evening', description: 'Stay on top of things' },
      ],
      default: 'daily-morning',
      templateVar: 'checkFrequency',
    },
    {
      id: 'lead-keywords',
      label: 'What words signal a new lead in your email?',
      helpText: 'Common words in subject lines or bodies of emails from potential customers.',
      type: 'multiselect',
      options: [
        { value: 'quote', label: 'Quote / estimate' },
        { value: 'moving', label: 'Moving / move' },
        { value: 'availability', label: 'Availability / available' },
        { value: 'price', label: 'Price / cost / rate' },
        { value: 'booking', label: 'Book / schedule / reserve' },
      ],
      default: ['quote', 'moving', 'booking'],
      templateVar: 'leadKeywords',
    },
    {
      id: 'alert-types',
      label: 'What should Claude Code alert you about?',
      type: 'multiselect',
      options: [
        { value: 'missed-leads', label: 'Leads you haven\'t replied to within 24 hours' },
        { value: 'follow-ups', label: 'Follow-ups due today' },
        { value: 'cancellations', label: 'Cancellation or complaint emails' },
        { value: 'reviews', label: 'Review requests or responses' },
        { value: 'payments', label: 'Payment-related emails' },
      ],
      default: ['missed-leads', 'follow-ups', 'cancellations'],
      templateVar: 'alertTypes',
    },
    {
      id: 'summary-format',
      label: 'How do you want the daily summary presented?',
      type: 'select',
      options: [
        { value: 'bullet-list', label: 'Simple bullet list', description: 'Quick scan' },
        { value: 'table', label: 'Table with columns', description: 'Organized by type' },
        { value: 'priorities', label: 'Ranked by urgency', description: 'Most urgent first' },
      ],
      default: 'priorities',
      templateVar: 'summaryFormat',
    },
    {
      id: 'ignore-senders',
      label: 'Any senders to always ignore?',
      helpText: 'E.g., newsletters, marketing emails. Enter email addresses or domains.',
      type: 'text',
      default: '',
      templateVar: 'ignoreSenders',
    },
  ],
};
