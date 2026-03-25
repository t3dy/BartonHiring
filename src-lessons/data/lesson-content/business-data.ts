import type { Lesson } from '../../types/lesson';

export const businessDataLessons: Lesson[] = [
  {
    id: 'biz-data-setup',
    title: 'Set Up Your Business Data System',
    description:
      'Create a simple folder-and-file system for tracking leads, logging outcomes, and taking notes. Designed so you spend 30 seconds or less per entry.',
    section: 'business-data',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    questionnaireId: 'business-data-setup',
    steps: [
      {
        id: 'bd-1',
        title: 'Understand the approach',
        action: 'Why markdown files instead of (or alongside) your CRM',
        explanation:
          'You already have a CRM for your moving company — keep using it for estimates, dispatch, and invoicing. The markdown system fills a different gap: quick notes you\'d otherwise forget, lead tracking that\'s faster than opening your CRM, and a format Claude Code can read and analyze. Think of it as your scratchpad that\'s also searchable and analyzable.',
        modificationHints: [
          'If your CRM handles everything: use markdown only for notes your CRM can\'t capture',
          'If you hate your CRM: the markdown system can handle basic lead tracking too',
          'You can export CRM data as CSV and have Claude Code analyze it alongside your notes',
        ],
      },
      {
        id: 'bd-2',
        title: 'Create your folder structure',
        action: 'Set up the folders where your data will live',
        explanation:
          'Claude Code will create a folder structure based on your questionnaire answers. Whether you organize by month, by status, or keep everything flat — the prompt below handles it. You\'ll also get a README file explaining where everything goes.',
        promptSuggestion:
          'Create a business-data folder in my home directory with this structure:\n- leads/ (organized by month: 2026-03/, 2026-04/, etc.)\n- notes/ (for general business notes)\n- templates/ (quick-entry templates)\n- config/ (saved configuration)\n\nAdd a README.md explaining what goes where. Keep it short — bullet points only.',
        modificationHints: [
          'Change "home directory" to wherever you want: "Put it in my Documents folder"',
          'Add more folders: "Also create a folder for job-completion-notes"',
          'Different organization: "Organize by status instead of by month"',
        ],
      },
      {
        id: 'bd-3',
        title: 'Create quick-entry templates',
        action: 'Build fill-in-the-blank templates for common situations',
        explanation:
          'Templates are pre-written markdown files with blanks you fill in. When a new lead calls, you open the template, fill in 3-4 fields, and save. It takes 30 seconds instead of 5 minutes because most of the file is already written.',
        promptSuggestion:
          'Create quick-entry markdown templates in my business-data/templates/ folder for:\n1. New lead (fields: name, phone, source, move date, notes)\n2. After a phone call (fields: who, summary, next step, follow-up date)\n3. After completing a job (fields: customer, crew, issues, customer satisfaction)\n\nUse YAML frontmatter for the structured fields and a free-text section below for notes. Pre-fill dates with today\'s date.',
        modificationHints: [
          'Add templates for other situations: "Also make one for when a customer cancels"',
          'Simpler templates: "Remove the YAML frontmatter, just use plain text with blanks"',
          'Include your CRM fields: "Add a field for the CRM job number so I can cross-reference"',
        ],
      },
      {
        id: 'bd-4',
        title: 'Learn the quick-log command',
        action: 'The fastest way to log a lead from your terminal',
        explanation:
          'Instead of opening a file and filling in blanks, you can just tell Claude Code in plain English. It creates the file for you. This is the lowest-friction option — just type what happened and Claude Code organizes it.',
        promptSuggestion:
          'New lead: John Smith, called about a 2BR move from East Austin to Round Rock on April 15. Found us on Google. Wants an estimate. Call back tomorrow.',
        modificationHints: [
          'Claude Code figures out the fields from your plain English — you don\'t need to format anything',
          'Add "urgent" or "high priority" and Claude Code can flag it in the file',
          'Say "same as last time but for [name]" if the details are similar to a recent lead',
        ],
      },
      {
        id: 'bd-5',
        title: 'Compare: CRM vs Markdown vs Note Apps',
        action: 'Understand when to use which tool',
        explanation:
          'Here\'s the simple rule: Use your CRM for anything customer-facing (estimates, scheduling, invoicing). Use markdown files for everything else (quick notes, internal tracking, data Claude Code should analyze). If you want something prettier than plain text files, Obsidian and Notion are good options — see the comparison below.',
        modificationHints: [
          'Obsidian: free, works offline, reads the same markdown files Claude Code creates — zero extra setup',
          'Notion: cloud-synced, prettier, Claude Code connects via Notion MCP — requires internet and a Notion account',
          'Plain markdown: simplest, no extra app to learn, Claude Code reads files directly',
          'You can switch between these later without losing data — they all use or import markdown',
        ],
      },
      {
        id: 'bd-6',
        title: 'Set up Obsidian or Notion (optional)',
        action: 'Connect a note-taking app to your markdown files',
        explanation:
          'If you chose Obsidian: just point Obsidian at your business-data folder as a vault. Done — it reads the same files Claude Code creates. If you chose Notion: Claude Code can connect via the Notion MCP connector to read and write your Notion pages directly. If you chose plain markdown: skip this step — you\'re already set up.',
        promptSuggestion:
          'Help me set up Obsidian to use my business-data folder as a vault. Show me how to open it and explain what I\'ll see.',
        modificationHints: [
          'For Notion instead: "Help me connect the Notion MCP connector to Claude Code so I can read and write my Notion workspace"',
          'For mobile access with Obsidian: "How do I sync my Obsidian vault to my phone?"',
          'For Notion templates: "Create a Notion database for my leads that matches my markdown template structure"',
        ],
      },
    ],
  },
  {
    id: 'biz-data-analyze',
    title: 'Analyze Your Business Data',
    description:
      'Once you\'ve logged some leads and outcomes, ask Claude Code to find patterns, summarize your month, or answer questions about your business.',
    section: 'business-data',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    prerequisites: ['biz-data-setup'],
    steps: [
      {
        id: 'bda-1',
        title: 'Ask Claude Code to summarize your leads',
        action: 'Get a quick snapshot of your lead pipeline',
        explanation:
          'Once you have a few weeks of lead files, Claude Code can read them all and give you a summary. How many leads this month? How many booked? Where are they coming from? This is where the markdown system pays off — Claude Code can read and analyze your files instantly.',
        promptSuggestion:
          'Read all the lead files in my business-data/leads/ folder and give me a summary:\n- Total leads this month\n- How many booked vs lost vs no response\n- Top sources (where are leads coming from?)\n- Any leads I haven\'t followed up on',
        modificationHints: [
          'Add "compare to last month" for trend analysis',
          'Ask "which day of the week do I get the most leads?"',
          'Request a specific format: "Put it in a table"',
        ],
      },
      {
        id: 'bda-2',
        title: 'Analyze CRM exports',
        action: 'Have Claude Code read data you export from your CRM',
        explanation:
          'Most CRMs let you export data as CSV or Excel files. Download a report from your CRM, drop it in your business-data folder, and ask Claude Code to analyze it. This gives you insights your CRM\'s built-in reports might not offer.',
        promptSuggestion:
          'I exported a CSV from my CRM — it\'s at business-data/exports/leads-march.csv. Analyze it and tell me:\n- My booking rate (leads that became jobs)\n- Average revenue per job\n- Which lead sources convert best\n- Any patterns I should know about',
        modificationHints: [
          'Cross-reference with your markdown notes: "Compare the CRM data with my lead notes"',
          'Specific questions: "Why did I lose so many leads in the second week of March?"',
          'Visualize it: "Create a simple chart showing leads by source"',
        ],
      },
    ],
  },
];
