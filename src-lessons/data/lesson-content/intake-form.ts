import type { Lesson } from '../../types/lesson';

export const intakeFormLessons: Lesson[] = [
  {
    id: 'intake-form-intro',
    title: 'Build Your Job Application Form',
    description:
      'Walk through building an online job application that prospective movers can fill out on your website. Pick your fields, customize the look, and get a working form you can embed.',
    section: 'intake-form',
    difficulty: 'beginner',
    estimatedMinutes: 20,
    questionnaireId: 'intake-form-basic',
    steps: [
      {
        id: 'if-1',
        title: 'Choose your form tier',
        action: 'Decide how much info you want from applicants',
        explanation:
          'Use the questionnaire above to pick Basic, Standard, or Comprehensive. Basic gets you a name and phone number fast. Standard adds experience and references so you can screen before calling. Comprehensive replaces paper applications entirely. You can always start basic and add fields later.',
        modificationHints: [
          'Start with Basic if you just want to collect leads quickly',
          'Add the "references" field later if too many unqualified applicants apply',
          'The Comprehensive tier works best if you\'re currently using paper forms',
        ],
      },
      {
        id: 'if-2',
        title: 'Open Claude Code and create the form',
        action: 'Copy the generated prompt and paste it into Claude Code',
        explanation:
          'After filling out the questionnaire, a prompt will appear below with your exact specifications. Open your terminal, type "claude" to start Claude Code, then paste the prompt. Claude Code will generate the HTML file for your form.',
        promptSuggestion:
          'Create a new folder called "application-form" and build me a mobile-friendly HTML job application form for my moving company. Include these fields: [your selected fields will appear here]. Make it simple, professional, and fast-loading on phones.',
        modificationHints: [
          'Tell Claude Code what colors to use: "Use dark green and white to match my website"',
          'Ask for Spanish language support: "Add a Spanish language toggle"',
          'Request a specific submission method: "Send form results to my email"',
        ],
      },
      {
        id: 'if-3',
        title: 'Test the form on your phone',
        action: 'Open the generated HTML file and try filling it out',
        explanation:
          'Claude Code will create an HTML file. Open it in your browser. Then send the link to your phone and try filling it out there — that\'s how most applicants will use it. Check that all the fields make sense and the Submit button works.',
        promptSuggestion:
          'Start a local server so I can preview the application form in my browser. Show me the URL to open.',
        modificationHints: [
          'If text is too small on mobile: "Make the font bigger on phone screens"',
          'If the form is too long: "Split the form into two pages"',
          'To add your logo: "Add my company logo at the top — the file is logo.png"',
        ],
      },
      {
        id: 'if-4',
        title: 'Set up where form submissions go',
        action: 'Decide what happens when someone clicks Submit',
        explanation:
          'The form needs somewhere to send the data. The simplest option is email — each submission sends you an email. If you want something fancier, Claude Code can set it up to save to a Google Sheet or your CRM. Start with email unless you have a reason not to.',
        promptSuggestion:
          'Set up the form to email submissions to my business email address. Format the email so it\'s easy to read on my phone — put the applicant\'s name in the subject line.',
        modificationHints: [
          'For Google Sheets: "Send form submissions to a Google Sheet instead of email"',
          'For both: "Email me AND save to a Google Sheet"',
          'To integrate with your CRM: "Format submissions so I can paste them into [your CRM name]"',
        ],
      },
      {
        id: 'if-5',
        title: 'Add the form to your website',
        action: 'Embed the form on your actual website',
        explanation:
          'Now put the form where applicants can find it. You have three options: (1) Link to it as a separate page, (2) Embed it inside an existing page using an iframe, or (3) Copy the HTML directly into your website. If you use Squarespace, Wix, or WordPress, option 2 (iframe) is usually easiest.',
        promptSuggestion:
          'Give me the HTML embed code to put this form on my Squarespace website using an iframe. Make it responsive so it looks good at any screen size.',
        modificationHints: [
          'For WordPress: "Give me a WordPress shortcode or plugin approach instead"',
          'For a standalone page: "Create a complete webpage with my branding that I can host separately"',
          'To add a link: "Give me a simple button I can add to my website that says Apply Now"',
        ],
      },
    ],
  },
  {
    id: 'intake-form-customize',
    title: 'Customize and Modify Your Form',
    description:
      'Learn how to ask Claude Code to change your form — add fields, restyle it, change the submission method, or add validation rules.',
    section: 'intake-form',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    prerequisites: ['intake-form-intro'],
    steps: [
      {
        id: 'ifc-1',
        title: 'Add a new field',
        action: 'Learn the pattern for adding any field to your form',
        explanation:
          'You can add any field by describing it in plain English. Just tell Claude Code what the field is for, what type it should be (text box, dropdown, checkboxes), and where to put it. Claude Code remembers your form and makes the change.',
        promptSuggestion:
          'Add a dropdown field to my application form that asks "How did you hear about us?" with these options: Indeed, Craigslist, Friend/Referral, Social Media, Other. Put it right before the Submit button.',
        modificationHints: [
          'For a required field: add "Make it required" to the prompt',
          'For conditional fields: "Only show the CDL field if they check the Driver box"',
          'To reorder: "Move the phone number field above the email field"',
        ],
      },
      {
        id: 'ifc-2',
        title: 'Change the look and feel',
        action: 'Ask Claude Code to restyle your form',
        explanation:
          'Describe what you want it to look like. You can reference colors, your existing website, or just say what feels wrong. Claude Code will update the styling.',
        promptSuggestion:
          'Make my application form match my website\'s color scheme — dark green header, white background, and a green Submit button. Also make the font a bit bigger.',
        modificationHints: [
          'To match your site exactly: "Look at my website at [URL] and match the style"',
          'For a specific font: "Use the same font as my website"',
          'For dark mode: "Add a dark mode version of the form"',
        ],
      },
      {
        id: 'ifc-3',
        title: 'Add validation rules',
        action: 'Prevent bad submissions',
        explanation:
          'Validation stops people from submitting forms with missing or invalid information. Phone numbers should look like phone numbers, emails should have an @ sign, and required fields should not be empty.',
        promptSuggestion:
          'Add validation to my form: require name, phone, and email. Make sure the phone number has 10 digits and the email has an @ sign. Show a red error message under any field that\'s wrong.',
        modificationHints: [
          'To allow international phones: "Accept phone numbers with country codes"',
          'To block spam: "Add a simple math question like 2+3=? to prevent bots"',
          'Custom rules: "Only accept applications from people 18 or older"',
        ],
      },
    ],
  },
];
