import type { Lesson } from '../../types/lesson';

export const emailAutomationLessons: Lesson[] = [
  {
    id: 'email-setup',
    title: 'Set Up Gmail Automation with Claude Code',
    description:
      'Connect Claude Code to your Gmail so it can check for missed leads, surface urgent emails, and give you a daily briefing. Read-only — it never sends or deletes anything.',
    section: 'email-automation',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    questionnaireId: 'email-automation-setup',
    steps: [
      {
        id: 'ea-1',
        title: 'Understand what this does (and doesn\'t do)',
        action: 'Know exactly what Claude Code will and won\'t do with your email',
        explanation:
          'Claude Code connects to your Gmail in READ-ONLY mode. It can search your inbox, read emails, and tell you what it finds. It CANNOT send emails, delete emails, or make changes. Think of it as a smart assistant that reads your email and gives you a summary — like having someone screen your mail for you.',
        modificationHints: [
          'If you\'re not comfortable with email access: start with the "manual export" approach instead',
          'You can revoke access at any time from your Google account settings',
          'Claude Code only checks when you ask it to (or when your scheduled task runs)',
        ],
      },
      {
        id: 'ea-2',
        title: 'Install the Gmail MCP connector',
        action: 'Add the Gmail connector to your Claude Code setup',
        explanation:
          'MCP connectors are plugins that give Claude Code access to external services. The Gmail connector lets Claude Code read your email. You\'ll install it once, authorize it with your Google account, and then it\'s available in every Claude Code session.',
        promptSuggestion:
          'Help me install and set up the Gmail MCP connector. Walk me through each step and explain what\'s happening. I\'ve never installed an MCP connector before.',
        modificationHints: [
          'If you have multiple Gmail accounts: "I want to connect my business Gmail, not my personal one"',
          'If authorization fails: "The Google authorization step isn\'t working — help me troubleshoot"',
          'To verify it works: "Check if the Gmail connector is working by reading my most recent email subject line"',
        ],
      },
      {
        id: 'ea-3',
        title: 'Test with a simple email check',
        action: 'Verify the connection works by checking your recent emails',
        explanation:
          'Before setting up any automation, let\'s make sure the connection works. Ask Claude Code to read your most recent emails and summarize them. This confirms everything is connected properly.',
        promptSuggestion:
          'Check my Gmail and show me the 5 most recent emails — just the sender, subject line, and date. Don\'t show me the full email body.',
        modificationHints: [
          'If no emails show up: "Can you see any emails at all? Try checking the spam folder too"',
          'For a specific search: "Show me emails from the last 3 days with the word quote in them"',
          'Privacy check: "What information can you see about my emails? I want to understand the access level"',
        ],
      },
      {
        id: 'ea-4',
        title: 'Configure your lead detection keywords',
        action: 'Tell Claude Code what a new lead looks like in your inbox',
        explanation:
          'Use the questionnaire above to pick keywords that signal a new lead — words like "quote," "moving," "available." Claude Code will search for emails containing these words that you haven\'t replied to yet. That\'s how it finds missed leads.',
        promptSuggestion:
          'Search my Gmail for emails from the last 48 hours that contain any of these words: quote, moving, estimate, book, schedule. Show me any that I haven\'t replied to yet. Format as a table: sender, subject, date received, replied (yes/no).',
        modificationHints: [
          'Add industry terms: "Also search for \'load\', \'haul\', \'pack\', and \'storage\'"',
          'Exclude known senders: "Ignore emails from my regular suppliers and employees"',
          'Narrow the search: "Only check emails that come from my website contact form"',
        ],
      },
      {
        id: 'ea-5',
        title: 'Set up your daily email briefing',
        action: 'Create an automated daily check that runs every morning',
        explanation:
          'This is the big one. You\'ll create a scheduled task that runs every morning (or whatever time you chose). Claude Code will check your email, look for missed leads and urgent items, and save a summary as a markdown file in your business-data folder. When you open Claude Code each morning, you\'ll see the briefing.',
        promptSuggestion:
          'Create a scheduled task called "daily-email-check" that runs every morning at 7am. It should:\n1. Check my Gmail for new leads (keywords: quote, moving, estimate, book)\n2. Find any emails I haven\'t replied to in 24+ hours\n3. Look for cancellation or complaint emails\n4. Save a summary to business-data/email-briefings/ as a dated markdown file\n5. If there are missed leads, put them at the top marked URGENT',
        modificationHints: [
          'Change the time: "Run at 6am instead" or "Run twice — morning and evening"',
          'Add more checks: "Also flag emails from my CRM with the word \'overdue\'"',
          'Different format: "Put the summary in a table instead of bullet points"',
          'Notify me: "Also show me the summary when I first open Claude Code"',
        ],
      },
      {
        id: 'ea-6',
        title: 'Review and adjust',
        action: 'Check your first few briefings and fine-tune',
        explanation:
          'After the first few daily briefings, review them. Is it flagging too many emails? Not enough? Are the keyword filters right? Adjust by telling Claude Code what to change. This is normal — it takes a few days to dial in the right filters for your business.',
        promptSuggestion:
          'Show me the last 3 daily email briefings from my business-data/email-briefings/ folder. Are there any false positives (emails flagged as leads that aren\'t really leads)? Suggest better keyword filters based on what you see.',
        modificationHints: [
          'Too many results: "Add these senders to the ignore list: [emails]"',
          'Missing leads: "Also search for emails that mention \'apartment\' or \'office move\'"',
          'Better summaries: "Include a one-line summary of what each email is about"',
        ],
      },
    ],
  },
  {
    id: 'email-advanced',
    title: 'Advanced Email Insights',
    description:
      'Go beyond daily checks — analyze response times, track lead sources from email, and set up follow-up reminders.',
    section: 'email-automation',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    prerequisites: ['email-setup'],
    steps: [
      {
        id: 'eaa-1',
        title: 'Analyze your response times',
        action: 'Find out how fast you\'re replying to leads',
        explanation:
          'Speed matters in the moving business — the first company to respond often gets the job. Claude Code can analyze your email timestamps to show your average response time and flag where you\'re slow.',
        promptSuggestion:
          'Analyze my Gmail for the last 30 days. For emails that look like new leads (containing: quote, moving, estimate), calculate:\n- Average time to first reply\n- Fastest reply\n- Slowest reply\n- How many I never replied to\n\nBreak it down by day of the week — am I slower on certain days?',
        modificationHints: [
          'Compare to industry standards: "Is my response time good for a moving company?"',
          'Set a goal: "Flag any lead I took more than 2 hours to reply to"',
          'Track improvement: "Compare this month to last month"',
        ],
      },
      {
        id: 'eaa-2',
        title: 'Set up follow-up reminders',
        action: 'Get reminded to follow up with leads who went quiet',
        explanation:
          'Some leads email once and then go silent. A follow-up 2-3 days later can win the job. Claude Code can scan for conversations that stopped and remind you to follow up.',
        promptSuggestion:
          'Check my Gmail for email threads where:\n- I sent a quote or estimate\n- The customer hasn\'t replied in 3+ days\n- I haven\'t sent a follow-up yet\n\nList them with the customer name, what I quoted, and how many days since my last email. Add these to my daily briefing under "Follow-ups Due."',
        modificationHints: [
          'Change the window: "Use 2 days instead of 3 for follow-up reminders"',
          'Draft the follow-up: "Also write a short follow-up email I can copy and send"',
          'Track which follow-ups work: "Log when a follow-up converts to a booking"',
        ],
      },
    ],
  },
];
