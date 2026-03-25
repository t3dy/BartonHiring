import type { PromptTemplate } from '../../types/prompt-template';

export const setupBusinessDataPrompt: PromptTemplate = {
  id: 'setup-business-data',
  title: 'Set Up Business Data Tracking',
  description: 'Generates a Claude Code prompt to create your markdown-based lead tracking system.',
  template: `Set up a business data tracking system for my moving company using markdown files. Here's my setup:

## Tracking Detail Level
{{trackingStyle}}

## Folder Structure
Organize files using the {{folderStructure}} approach.

## Quick-Entry Templates
Create templates I can quickly fill out for these situations:
{{noteTriggers}}

Each template should be a markdown file with frontmatter (date, status, source) and a body section.
Pre-fill as much as possible so I just need to fill in the blanks.

## Outcome Types to Track
{{outcomeTypes}}

## Integration Notes
{{integrationNotes}}

## Requirements
- Keep it dead simple — I don't want to spend more than 30 seconds logging a lead
- Use markdown files so Claude Code can read and search them later
- Create a README in the root folder explaining the system
- Include an example filled-out lead file so I can see what it looks like`,
  variables: {
    trackingStyle: 'Level of detail (minimal, standard, detailed)',
    folderStructure: 'How files are organized (flat, by-month, by-status)',
    noteTriggers: 'Situations that need quick-entry templates',
    outcomeTypes: 'List of outcome statuses to track',
    integrationNotes: 'Notes about CRM, Obsidian, Notion, or other tool integration',
  },
};

export const quickLogPrompt: PromptTemplate = {
  id: 'quick-log-lead',
  title: 'Quick-Log a Lead',
  description: 'Minimal prompt to log a new lead fast.',
  template: `Log a new lead:
- Name: {{name}}
- Source: {{source}}
- Move date: {{moveDate}}
- Notes: {{notes}}

Save to my leads folder using the format we set up.`,
  variables: {
    name: 'Customer name',
    source: 'Where the lead came from',
    moveDate: 'When they want to move',
    notes: 'Any quick notes',
  },
};

export const businessDataPrompts = [setupBusinessDataPrompt, quickLogPrompt];
