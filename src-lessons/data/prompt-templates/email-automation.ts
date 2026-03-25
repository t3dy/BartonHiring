import type { PromptTemplate } from '../../types/prompt-template';

export const setupEmailAutomationPrompt: PromptTemplate = {
  id: 'setup-email-automation',
  title: 'Set Up Daily Email Check',
  description: 'Generates a Claude Code prompt to configure automated Gmail checking via MCP.',
  template: `Set up an automated daily email check for my moving company Gmail using the Gmail MCP connector.

## Check Schedule
{{checkFrequency}}

## What to Look For

### New Leads
Search for emails containing these keywords: {{leadKeywords}}
Flag any that I haven't replied to within 24 hours.

### Alerts
Watch for these types of emails:
{{alertTypes}}

### Ignore List
Skip emails from: {{ignoreSenders}}

## Summary Format
Present the daily summary as: {{summaryFormat}}

## Requirements
- Connect to my Gmail using the MCP connector (I'll authorize it when prompted)
- Don't move or delete any emails — read-only
- Group results by priority: urgent first, then informational
- If there's nothing important, just say "All clear — no missed leads or urgent items"
- Save the summary to my business-data folder as a dated markdown file`,
  variables: {
    checkFrequency: 'How often to check (daily-morning, daily-evening, twice-daily)',
    leadKeywords: 'Keywords that signal a potential customer',
    alertTypes: 'Types of emails to flag',
    ignoreSenders: 'Senders or domains to skip',
    summaryFormat: 'How to format the summary (bullet-list, table, priorities)',
  },
};

export const emailCheckNowPrompt: PromptTemplate = {
  id: 'check-email-now',
  title: 'Check Email Right Now',
  description: 'One-off prompt to check email immediately.',
  template: `Check my Gmail right now using the MCP connector.

Look for:
- Any new leads I haven't replied to
- Anything urgent from existing customers
- {{additionalChecks}}

Give me a quick summary — just the important stuff.`,
  variables: {
    additionalChecks: 'Any specific things to look for right now',
  },
};

export const emailAutomationPrompts = [setupEmailAutomationPrompt, emailCheckNowPrompt];
