# Claude Code Lessons — Project Authority

This file defines conventions and rules for the lessons subsite within barton-hiring.
Claude Code sessions should read this file to understand how to work with the project.

## Project Purpose

Teach a moving company owner (complete beginner) to use Claude Code for:
1. Building a job application intake form for his website
2. Recording business data (leads, notes, outcomes) using markdown files
3. Automating daily email checks via Gmail MCP connector

## Architecture

- **Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS 4
- **Entry point:** `lessons/index.html` → `src-lessons/main.tsx`
- **No backend.** All state is client-side. Config exports as downloadable JSON.
- **Deploys** alongside the hiring guide at `/BartonHiring/lessons/`

## Directory Conventions

```
src-lessons/
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
├── index.css                    # Tailwind import
├── components/                  # Reusable UI components
│   ├── Questionnaire.tsx        # Renders any QuestionnaireSchema
│   ├── PromptDisplay.tsx        # Shows generated prompts with copy button
│   ├── LessonRenderer.tsx       # Renders a Lesson with step-by-step actions
│   ├── SaveLoadAccordion.tsx    # Config save/load options accordion
│   └── SectionNav.tsx           # Top-level section navigation
├── data/
│   ├── questionnaires/          # QuestionnaireSchema JSON files
│   │   ├── intake-form.ts       # Form field selection questionnaire
│   │   ├── business-data.ts     # Note-taking preferences questionnaire
│   │   └── email-automation.ts  # Email check configuration questionnaire
│   ├── prompt-templates/        # PromptTemplate definitions
│   │   ├── intake-form.ts       # Prompt templates for building forms
│   │   ├── business-data.ts     # Prompt templates for folder/markdown setup
│   │   └── email-automation.ts  # Prompt templates for Gmail MCP automation
│   └── lesson-content/          # Lesson definitions
│       ├── intake-form.ts       # Lessons for form building
│       ├── business-data.ts     # Lessons for markdown data system
│       └── email-automation.ts  # Lessons for email automation
├── hooks/                       # Custom React hooks
│   └── useConfig.ts             # Config state, save/load/export logic
└── types/                       # TypeScript type definitions
    ├── questionnaire.ts         # QuestionnaireSchema, QuestionnaireAnswers, UserConfig
    ├── lesson.ts                # Lesson, LessonStep
    └── prompt-template.ts       # PromptTemplate
```

## Data Flow

1. User navigates to a lesson section (intake form, business data, email)
2. A **questionnaire** collects preferences (dropdowns, checkboxes)
3. Answers fill **prompt template** variables → rendered as copyable Claude Code prompts
4. Lesson steps walk through using those prompts with action-mapping explanations
5. User can **save config** (download JSON, copy to clipboard, localStorage, or save-to-folder prompt)

## Questionnaire → Prompt Template Contract

- Every `QuestionnaireField.templateVar` must match a key in the linked `PromptTemplate.variables`
- The `QuestionnaireSchema.promptTemplateId` references a `PromptTemplate.id`
- Missing answers use the field's `default` value
- Template rendering replaces `{{varName}}` with the answer string

## Intake Form Tiers

The intake form offers three tiers the user can choose from (or mix):

| Tier | Fields |
|------|--------|
| **Basic** | Name, phone, email, availability |
| **Standard** | + years experience, has vehicle, driver's license, references |
| **Comprehensive** | + background check consent, work history, certifications, physical requirements acknowledgment |

Each tier has its own prompt template. The questionnaire lets users select a tier and then sub-customize individual fields.

## Save/Load Options (Accordion)

Present four save methods in an expandable accordion:
1. **Download JSON** — exports `barton-config.json` to Downloads
2. **Copy to clipboard** — JSON text for pasting into a file
3. **Save to Claude Code folder** — shows a prompt to save config to `business-data/config/`
4. **Browser localStorage** — auto-saves silently as backup

Recommend Download JSON + localStorage combo as default.

## Tone & Audience

- Complete beginner. No jargon without immediate explanation.
- Action-mapping style: each step says WHAT to do, WHY, and WHAT IT LOOKS LIKE when done.
- Assume the user has Claude Code installed and a terminal open but has never used it.
- Reluctant note-taker: minimize friction, automate everything possible.

## Tool Integration Context

The business owner already pays for a **moving-company-specific CRM** (e.g., SmartMoving, Yembo, MoveitPro, CRM for Movers). Lessons must:
- Acknowledge the CRM exists and explain how Claude Code complements (not replaces) it
- Show how markdown files can serve as a lightweight layer ALONGSIDE the CRM
- Discuss exporting CRM data and letting Claude Code analyze it
- Compare: when to log in the CRM vs. when to log in markdown

The business data section should also cover **note-taking apps** as alternatives or supplements:
- **Obsidian** — local markdown vault, syncs with Claude Code folder natively (both read .md files)
- **Notion** — cloud-based, Claude Code can interact via Notion MCP connector
- For each tool: brief explanation, how to integrate with Claude Code, pros/cons for a reluctant note-taker

## Gmail Integration

- Uses Claude Code's Gmail MCP connector
- Lessons walk through: installing the connector, authorizing, writing prompts for daily email checks
- Automated checks surface: missed leads, unanswered inquiries, follow-up reminders
- All prompt templates assume the MCP connector is the interface (not raw API calls)
