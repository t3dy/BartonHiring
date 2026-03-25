import type { QuestionnaireSchema } from '../../types/questionnaire';

export const intakeFormBasic: QuestionnaireSchema = {
  id: 'intake-form-basic',
  title: 'Basic Application Form',
  description: 'Minimal fields — just enough to follow up with an applicant.',
  promptTemplateId: 'build-intake-form',
  fields: [
    {
      id: 'include-name',
      label: 'Full name field',
      type: 'checkbox',
      default: true,
      required: true,
      templateVar: 'includeName',
    },
    {
      id: 'include-phone',
      label: 'Phone number',
      type: 'checkbox',
      default: true,
      templateVar: 'includePhone',
    },
    {
      id: 'include-email',
      label: 'Email address',
      type: 'checkbox',
      default: true,
      templateVar: 'includeEmail',
    },
    {
      id: 'submission-method',
      label: 'Where should form submissions go?',
      helpText: 'What happens when someone clicks Submit.',
      type: 'select',
      options: [
        { value: 'email (send each submission to my business email)', label: 'Email me', description: 'Each submission arrives as an email' },
        { value: 'a Google Sheet (add each submission as a new row)', label: 'Google Sheet', description: 'Builds a spreadsheet of all applicants' },
        { value: 'email AND a Google Sheet', label: 'Both email and Google Sheet', description: 'Best of both worlds' },
      ],
      default: 'email (send each submission to my business email)',
      templateVar: 'submissionMethod',
    },
    {
      id: 'color-scheme',
      label: 'What colors match your website?',
      helpText: 'Used to style the form so it fits your brand.',
      type: 'select',
      options: [
        { value: 'dark green and white', label: 'Green & white', description: 'Professional, nature-themed' },
        { value: 'dark blue and white', label: 'Blue & white', description: 'Clean, corporate' },
        { value: 'black and gold', label: 'Black & gold', description: 'Bold, premium feel' },
        { value: 'match my existing website (I\'ll provide the URL)', label: 'Match my website', description: 'Claude Code will look at your site' },
      ],
      default: 'dark green and white',
      templateVar: 'colorScheme',
    },
    {
      id: 'availability-type',
      label: 'How should availability be collected?',
      helpText: 'Choose how applicants tell you when they can work.',
      type: 'select',
      options: [
        { value: 'days-checkboxes', label: 'Checkboxes for each day', description: 'Mon, Tue, Wed...' },
        { value: 'dropdown', label: 'Dropdown (Full-time / Part-time / Weekends)', description: 'Simple categories' },
        { value: 'text', label: 'Free text field', description: 'Let them describe in their own words' },
      ],
      default: 'days-checkboxes',
      templateVar: 'availabilityType',
    },
  ],
};

export const intakeFormStandard: QuestionnaireSchema = {
  id: 'intake-form-standard',
  title: 'Standard Application Form',
  description: 'Enough info to screen before a phone call.',
  promptTemplateId: 'build-intake-form',
  fields: [
    ...intakeFormBasic.fields,
    {
      id: 'include-experience',
      label: 'Years of moving experience',
      type: 'checkbox',
      default: true,
      templateVar: 'includeExperience',
    },
    {
      id: 'include-vehicle',
      label: 'Has own vehicle?',
      type: 'checkbox',
      default: true,
      templateVar: 'includeVehicle',
    },
    {
      id: 'include-license',
      label: "Driver's license type",
      type: 'checkbox',
      default: true,
      templateVar: 'includeLicense',
    },
    {
      id: 'include-references',
      label: 'References',
      type: 'checkbox',
      default: false,
      templateVar: 'includeReferences',
    },
    {
      id: 'reference-count',
      label: 'How many references?',
      type: 'select',
      options: [
        { value: '1', label: '1 reference' },
        { value: '2', label: '2 references' },
        { value: '3', label: '3 references' },
      ],
      default: '2',
      templateVar: 'referenceCount',
    },
  ],
};

export const intakeFormComprehensive: QuestionnaireSchema = {
  id: 'intake-form-comprehensive',
  title: 'Comprehensive Application Form',
  description: 'Full application replacing paper forms.',
  promptTemplateId: 'build-intake-form',
  fields: [
    ...intakeFormStandard.fields,
    {
      id: 'include-background-consent',
      label: 'Background check consent checkbox',
      type: 'checkbox',
      default: true,
      templateVar: 'includeBackgroundConsent',
    },
    {
      id: 'include-work-history',
      label: 'Previous employment history',
      type: 'checkbox',
      default: true,
      templateVar: 'includeWorkHistory',
    },
    {
      id: 'work-history-count',
      label: 'How many previous jobs?',
      type: 'select',
      options: [
        { value: '1', label: 'Most recent job only' },
        { value: '2', label: 'Last 2 jobs' },
        { value: '3', label: 'Last 3 jobs' },
      ],
      default: '2',
      templateVar: 'workHistoryCount',
    },
    {
      id: 'include-certifications',
      label: 'Certifications (CDL, forklift, etc.)',
      type: 'checkbox',
      default: false,
      templateVar: 'includeCertifications',
    },
    {
      id: 'include-physical-ack',
      label: 'Physical requirements acknowledgment',
      helpText: 'Applicant confirms they can lift 75+ lbs, work in heat, etc.',
      type: 'checkbox',
      default: true,
      templateVar: 'includePhysicalAck',
    },
  ],
};

export const intakeFormQuestionnaires = [
  intakeFormBasic,
  intakeFormStandard,
  intakeFormComprehensive,
];
