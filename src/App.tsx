import './index.css';
import {
  ArrowRight, ExternalLink, ChevronDown, ChevronUp,
  DollarSign, Clock, Search, MessageSquare,
  FileText, GraduationCap, Heart, BarChart3, Megaphone, Calculator,
  Star, TrendingUp, AlertTriangle, Zap, Monitor, Smartphone, Globe,
  Layers, BriefcaseBusiness, Truck
} from 'lucide-react';
import { useState } from 'react';
import QuoteWizard from './QuoteWizard';
import AdminDashboard from './AdminDashboard';

/* ─── Types ─── */
interface SoftwareSolution {
  name: string;
  cost: string;
  fit: 'free' | 'budget' | 'pro';
}

interface AdMethod {
  method: string;
  cost: string;
  effectiveness: 'high' | 'medium' | 'low';
}

interface HiringAction {
  id: string;
  action: string;
  description: string;
  currentMethod: string;
  softwareSolutions: SoftwareSolution[];
  advertisingMethods?: AdMethod[];
  customBuildOption?: string;
  timeToImplement: string;
  priority: 'must-have' | 'nice-to-have' | 'advanced';
}

interface PipelineStage {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  tagline: string;
  actions: HiringAction[];
}

/* ─── Data ─── */
const DEMO_URL = 'https://t3dy.github.io/BizSolutionsBarton/';
const CATALOG_URL = 'https://t3dy.github.io/BartonCatalog/';

const stages: PipelineStage[] = [
  {
    id: 'plan',
    name: 'Plan & Budget',
    icon: Calculator,
    color: 'from-blue-500 to-blue-600',
    tagline: 'Figure out how many people you need, what to pay them, and what hiring will cost.',
    actions: [
      {
        id: 'plan-1',
        action: 'Determine staffing needs',
        description: 'How many movers per crew? How many crews do you need for 15-20 jobs/month? During peak season (May-September in Austin), you might need 50% more hands. A 3-person crew doing 4 jobs/week means you need at minimum 9-12 movers on payroll.',
        currentMethod: 'Gut feeling and scrambling when someone quits',
        softwareSolutions: [
          { name: 'Google Sheets', cost: 'Free', fit: 'free' },
          { name: 'Jobber staffing reports', cost: '$49/mo', fit: 'budget' },
          { name: 'Homebase', cost: '$0-80/mo', fit: 'budget' },
        ],
        customBuildOption: 'A staffing calculator that takes your job volume and generates crew requirements by season.',
        timeToImplement: '1 hour to set up a spreadsheet',
        priority: 'must-have',
      },
      {
        id: 'plan-2',
        action: 'Set pay rates',
        description: 'Research Austin market rates: $15-22/hr for movers, $18-28/hr for drivers/leads. Factor in seasonal premiums during summer. Compare against competitors — if Bellhop pays $18/hr, you need to be at least competitive.',
        currentMethod: 'Asking around, checking Indeed listings',
        softwareSolutions: [
          { name: 'Indeed Salary Tool', cost: 'Free', fit: 'free' },
          { name: 'Bureau of Labor Statistics', cost: 'Free', fit: 'free' },
          { name: 'Glassdoor', cost: 'Free', fit: 'free' },
          { name: 'Payscale', cost: 'Free tier', fit: 'free' },
        ],
        timeToImplement: '2-3 hours of research',
        priority: 'must-have',
      },
      {
        id: 'plan-3',
        action: 'Define job roles',
        description: 'Mover (carries furniture, loads trucks), Driver/Lead (drives truck, manages crew on-site, handles customer interaction), Office/Dispatch (answers phones, schedules jobs, coordinates crews). Each role has different requirements and pay.',
        currentMethod: 'Everyone does everything, no clear roles',
        softwareSolutions: [
          { name: 'Google Docs', cost: 'Free', fit: 'free' },
          { name: 'Notion', cost: 'Free tier', fit: 'free' },
        ],
        customBuildOption: 'Job description templates with checklists for each role, tailored to your company.',
        timeToImplement: '2-3 hours to write up',
        priority: 'must-have',
      },
      {
        id: 'plan-4',
        action: 'Create a hiring budget',
        description: 'Cost per hire adds up: job ads ($50-200/mo), background checks ($25-50 each), drug tests ($30-60), uniforms ($50-100 per person), training time (16-24 hours at their pay rate). For a 2-3 crew operation hiring 8-12 people per year, budget $3,000-6,000 annually.',
        currentMethod: 'No budget — spending reactively when desperate',
        softwareSolutions: [
          { name: 'Google Sheets', cost: 'Free', fit: 'free' },
          { name: 'QuickBooks', cost: '$30/mo', fit: 'budget' },
        ],
        customBuildOption: 'A hiring cost calculator that tracks spend per hire and shows ROI of different recruiting channels.',
        timeToImplement: '1-2 hours',
        priority: 'nice-to-have',
      },
      {
        id: 'plan-5',
        action: 'Plan for seasonality',
        description: 'Austin peak = May-September. You need 50% more crew during summer. Options: hire temp workers through staffing agencies ($18-25/hr with markup), hire permanent and reduce hours in winter, or build a "bench" of part-timers who work other jobs. Most small movers use a mix.',
        currentMethod: 'Panic hiring in April, laying off in October',
        softwareSolutions: [
          { name: 'Homebase scheduling', cost: '$0-80/mo', fit: 'budget' },
          { name: 'PeopleReady (staffing)', cost: '$18-25/hr markup', fit: 'pro' },
        ],
        customBuildOption: 'A seasonal staffing model that predicts crew needs based on historical job volume.',
        timeToImplement: '3-4 hours to plan the year',
        priority: 'nice-to-have',
      },
    ],
  },
  {
    id: 'recruit',
    name: 'Recruit & Source',
    icon: Megaphone,
    color: 'from-emerald-500 to-emerald-600',
    tagline: 'Get the word out and bring in applicants — online, offline, and through your own people.',
    actions: [
      {
        id: 'recruit-1',
        action: 'Write job descriptions',
        description: '"Mover" vs "Moving Technician" vs "Relocation Specialist" — the title matters for attracting the right people. Include: physical requirements (lift 75+ lbs), schedule (weekends required), pay range ($16-22/hr), growth path (mover → lead → foreman), and what makes your company different.',
        currentMethod: 'Copy-pasting from other listings or winging it',
        softwareSolutions: [
          { name: 'ChatGPT/Claude', cost: 'Free tier', fit: 'free' },
          { name: 'Indeed job templates', cost: 'Free', fit: 'free' },
          { name: 'JazzHR templates', cost: '$49/mo', fit: 'budget' },
        ],
        customBuildOption: 'A job description generator with moving-industry templates and A/B testing for which titles get more applicants.',
        timeToImplement: '1-2 hours per description',
        priority: 'must-have',
      },
      {
        id: 'recruit-2',
        action: 'Post to job boards',
        description: 'Indeed is #1 for blue-collar hiring — free organic posts get some traction, sponsored posts ($5-15/day) get 3-5x more applicants. Craigslist Austin ($25/post) still works well for movers. Facebook Jobs is free. ZipRecruiter ($16/day) auto-distributes to 100+ boards.',
        currentMethod: 'Craigslist only, maybe Indeed sometimes',
        softwareSolutions: [
          { name: 'Indeed (organic)', cost: 'Free', fit: 'free' },
          { name: 'Facebook Jobs', cost: 'Free', fit: 'free' },
          { name: 'Indeed (sponsored)', cost: '$5-15/day', fit: 'budget' },
          { name: 'ZipRecruiter', cost: '$16/day', fit: 'pro' },
        ],
        advertisingMethods: [
          { method: 'Indeed Sponsored Posts', cost: '$5-15/day', effectiveness: 'high' },
          { method: 'Craigslist Austin', cost: '$25/post', effectiveness: 'medium' },
          { method: 'Facebook Jobs (organic)', cost: 'Free', effectiveness: 'medium' },
          { method: 'ZipRecruiter', cost: '$16/day', effectiveness: 'high' },
        ],
        timeToImplement: '30 min per platform',
        priority: 'must-have',
      },
      {
        id: 'recruit-3',
        action: 'Post on social media',
        description: 'Instagram/TikTok behind-the-scenes of move days shows the job is real and the crew is cool. Facebook community groups (Austin Jobs, ATX Blue Collar Work) reach local candidates. Nextdoor for hyper-local. Consistency matters more than perfection.',
        currentMethod: 'Rarely post, no recruitment-focused content',
        softwareSolutions: [
          { name: 'Canva', cost: 'Free/Pro', fit: 'free' },
          { name: 'Buffer/Later', cost: '$6-15/mo', fit: 'budget' },
        ],
        advertisingMethods: [
          { method: 'Instagram/TikTok content', cost: 'Free (time only)', effectiveness: 'medium' },
          { method: 'Facebook community groups', cost: 'Free', effectiveness: 'high' },
          { method: 'Nextdoor', cost: 'Free', effectiveness: 'medium' },
          { method: 'Facebook/Instagram Ads', cost: '$5-20/day', effectiveness: 'high' },
        ],
        timeToImplement: '2-3 hours/week for consistency',
        priority: 'nice-to-have',
      },
      {
        id: 'recruit-4',
        action: 'Employee referral program',
        description: '$100-250 bonus per hired referral who stays 90 days. Your best movers know other good movers. Track who referred whom. Referral hires typically stay 2x longer and perform better because they come pre-vetted by someone with skin in the game.',
        currentMethod: 'Informal — "know anyone looking for work?"',
        softwareSolutions: [
          { name: 'Google Sheets tracker', cost: 'Free', fit: 'free' },
          { name: 'Homebase', cost: '$0/mo', fit: 'free' },
        ],
        customBuildOption: 'A referral tracking system that auto-pays bonuses after 90-day retention milestones.',
        timeToImplement: '1 hour to set up',
        priority: 'must-have',
      },
      {
        id: 'recruit-5',
        action: 'Partner with local organizations',
        description: 'Workforce Solutions Capital Area (free government job service), Austin Community College career center, Goodwill job programs, veteran transition programs, Second Chance employers network. These organizations actively help people find physical labor jobs.',
        currentMethod: 'Never explored these channels',
        softwareSolutions: [
          { name: 'Workforce Solutions portal', cost: 'Free', fit: 'free' },
          { name: 'WorkInTexas.com', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: '2-3 hours to establish contacts',
        priority: 'nice-to-have',
      },
      {
        id: 'recruit-6',
        action: 'Attend job fairs',
        description: 'Austin-area job fairs, community hiring events, college career days at ACC. Bring a sign, business cards, and a QR code linking to your application. Moving companies rarely show up to these — you stand out among the Amazon and Uber booths.',
        currentMethod: 'Never attended',
        softwareSolutions: [
          { name: 'QR code generator', cost: 'Free', fit: 'free' },
          { name: 'Canva for signage', cost: 'Free', fit: 'free' },
        ],
        advertisingMethods: [
          { method: 'Job fair booth', cost: '$0-200 per event', effectiveness: 'medium' },
        ],
        timeToImplement: '4-6 hours per event',
        priority: 'nice-to-have',
      },
      {
        id: 'recruit-7',
        action: 'Walk-in / drive-by recruiting',
        description: 'Yard signs at your warehouse ("Now Hiring Movers — $18/hr — Walk In"), "Now Hiring" magnets on your trucks (they drive all over Austin daily), flyers at gyms, community boards, laundromats. Low-tech but effective for the target demographic.',
        currentMethod: 'No signage anywhere',
        softwareSolutions: [
          { name: 'Canva for flyer design', cost: 'Free', fit: 'free' },
        ],
        advertisingMethods: [
          { method: 'Yard signs', cost: '$50-150 one-time', effectiveness: 'medium' },
          { method: 'Truck magnets/decals', cost: '$50-200 one-time', effectiveness: 'high' },
          { method: 'Flyers at gyms/boards', cost: '$20-50', effectiveness: 'low' },
        ],
        timeToImplement: '1-2 hours + ordering time',
        priority: 'nice-to-have',
      },
      {
        id: 'recruit-8',
        action: 'Recruit from competitors',
        description: 'Network at industry events, watch who is leaving other companies. Moving industry has high turnover — good movers often jump between companies for better pay or culture. Be the company people want to jump TO.',
        currentMethod: 'Happens informally',
        softwareSolutions: [
          { name: 'LinkedIn', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: 'Ongoing relationship building',
        priority: 'advanced',
      },
      {
        id: 'recruit-9',
        action: 'Use staffing agencies',
        description: 'PeopleReady, Labor Finders, and local Austin temp agencies provide day laborers at $18-25/hr (with their markup built in). Great for surge demand during peak season. Expensive long-term but instant staffing when you are desperate.',
        currentMethod: 'Used occasionally in emergencies',
        softwareSolutions: [
          { name: 'PeopleReady app', cost: '$18-25/hr markup', fit: 'pro' },
          { name: 'Labor Finders', cost: '$18-25/hr markup', fit: 'pro' },
        ],
        timeToImplement: 'Same-day once account is set up',
        priority: 'nice-to-have',
      },
    ],
  },
  {
    id: 'screen',
    name: 'Screen Applicants',
    icon: Search,
    color: 'from-amber-500 to-amber-600',
    tagline: 'Filter out the no-shows and bad fits before investing time in interviews.',
    actions: [
      {
        id: 'screen-1',
        action: 'Review applications',
        description: 'Check work history (any moving or physical labor experience?), reliable transportation (can they get to your warehouse by 7 AM?), valid driver\'s license (clean record for truck drivers), and availability (weekends required in moving).',
        currentMethod: 'Skim a text or voicemail, call them back',
        softwareSolutions: [
          { name: 'Google Forms', cost: 'Free', fit: 'free' },
          { name: 'JazzHR', cost: '$49/mo', fit: 'budget' },
          { name: 'Workable', cost: '$149/mo', fit: 'pro' },
        ],
        customBuildOption: 'An application form that auto-scores candidates based on your criteria and flags top applicants.',
        timeToImplement: '30 min to review each batch',
        priority: 'must-have',
      },
      {
        id: 'screen-2',
        action: 'Phone screen (5 minutes)',
        description: 'Quick call to check: Are they available to start soon? Do they have reliable transportation? Are they physically able (lift 75+ lbs)? Why do they want the job? Can they work weekends? This 5-minute call saves you from wasting a half-day working interview.',
        currentMethod: 'Skip straight to ride-along, waste time on bad fits',
        softwareSolutions: [
          { name: 'Phone + notes', cost: 'Free', fit: 'free' },
          { name: 'Google Forms scorecard', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: '5 min per candidate',
        priority: 'must-have',
      },
      {
        id: 'screen-3',
        action: 'Background check',
        description: 'Criminal history and sex offender registry check — required when your employees enter customer homes. Most moving companies do county-level checks ($15-25) or national ($30-50). Some customers specifically ask if crews are background-checked.',
        currentMethod: 'Sometimes skip it, sometimes use a free online search',
        softwareSolutions: [
          { name: 'Checkr', cost: '$29-85/check', fit: 'budget' },
          { name: 'GoodHire', cost: '$30-80/check', fit: 'budget' },
          { name: 'Sterling', cost: '$30+/check', fit: 'pro' },
        ],
        timeToImplement: '5 min to submit, 1-3 days for results',
        priority: 'must-have',
      },
      {
        id: 'screen-4',
        action: 'Driving record check (MVR)',
        description: 'For anyone driving your trucks. Texas DPS Motor Vehicle Record costs $6.50 online. Check for DUIs, suspended licenses, excessive tickets. Your insurance company may require this — and your rates depend on it.',
        currentMethod: 'Ask them if their license is clean, trust the answer',
        softwareSolutions: [
          { name: 'Texas DPS online', cost: '$6.50/check', fit: 'free' },
          { name: 'Checkr (bundled)', cost: 'Included', fit: 'budget' },
        ],
        timeToImplement: '10 min per driver',
        priority: 'must-have',
      },
      {
        id: 'screen-5',
        action: 'Drug screening',
        description: 'DOT-required for CDL drivers (box trucks over 26,001 lbs). Many moving companies do pre-employment testing for all movers. Standard 5-panel urine test runs $30-60 at Quest/LabCorp. Some companies skip for non-CDL positions — your call.',
        currentMethod: 'Inconsistent — sometimes yes, sometimes no',
        softwareSolutions: [
          { name: 'Quest Diagnostics', cost: '$30-60/test', fit: 'budget' },
          { name: 'LabCorp', cost: '$30-60/test', fit: 'budget' },
        ],
        timeToImplement: '30 min for the appointment',
        priority: 'nice-to-have',
      },
      {
        id: 'screen-6',
        action: 'Verify work authorization',
        description: 'I-9 form is legally required for every hire — verifies identity and work eligibility. E-Verify (free federal system) checks documents electronically. Not optional — penalties for non-compliance are $252-$2,507 per violation.',
        currentMethod: 'Sometimes forget the paperwork',
        softwareSolutions: [
          { name: 'E-Verify', cost: 'Free', fit: 'free' },
          { name: 'Gusto (auto-handles I-9)', cost: '$40+/mo', fit: 'budget' },
        ],
        timeToImplement: '15 min per hire',
        priority: 'must-have',
      },
      {
        id: 'screen-7',
        action: 'Check references',
        description: 'Call previous employers — specifically ask about reliability (did they show up on time?), work ethic (did they hustle or hide?), and attitude (were they good with customers?). Two calls, 5 minutes each. This catches the smooth talkers.',
        currentMethod: 'Skip this step entirely',
        softwareSolutions: [
          { name: 'Phone + Google Sheets', cost: 'Free', fit: 'free' },
          { name: 'Checkr (bundled)', cost: 'Included', fit: 'budget' },
        ],
        timeToImplement: '10-15 min per candidate',
        priority: 'nice-to-have',
      },
    ],
  },
  {
    id: 'interview',
    name: 'Interview',
    icon: MessageSquare,
    color: 'from-violet-500 to-violet-600',
    tagline: 'See them work before you commit — the moving industry working interview is your best filter.',
    actions: [
      {
        id: 'interview-1',
        action: 'Conduct a working interview',
        description: 'Pay them for a half-day ride-along on an actual move. This is the gold standard in moving. You see their work ethic, teamwork, physical ability, attitude with customers, and whether they can handle the Texas heat. Worth way more than any sit-down interview.',
        currentMethod: 'Already doing this, but inconsistently',
        softwareSolutions: [
          { name: 'Google Calendar', cost: 'Free', fit: 'free' },
          { name: 'Homebase', cost: '$0/mo', fit: 'free' },
        ],
        timeToImplement: '4-6 hours (half-day move)',
        priority: 'must-have',
      },
      {
        id: 'interview-2',
        action: 'Ask scenario questions',
        description: '"Customer says you scratched their table — what do you do?" "It\'s 105\u00B0F and you have 3 more rooms — how do you stay safe?" "Your crew lead tells you to skip wrapping the furniture — what do you do?" These reveal character and judgment.',
        currentMethod: 'Casual conversation, no structured questions',
        softwareSolutions: [
          { name: 'Google Docs (question bank)', cost: 'Free', fit: 'free' },
          { name: 'Notion template', cost: 'Free', fit: 'free' },
        ],
        customBuildOption: 'A structured interview scorecard app with moving-industry scenario questions and rating rubrics.',
        timeToImplement: '15-20 min per candidate',
        priority: 'nice-to-have',
      },
      {
        id: 'interview-3',
        action: 'Assess physical fitness',
        description: 'Can they lift 75+ lbs repeatedly? Climb stairs with heavy items? Work 8-10 hours in Texas summer heat? The working interview tests this naturally, but set clear expectations upfront. Some companies do a basic fitness assessment: carry a dresser up stairs, load a truck section.',
        currentMethod: 'Find out on day one if they can handle it',
        softwareSolutions: [
          { name: 'Checklist', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: 'Part of working interview',
        priority: 'must-have',
      },
      {
        id: 'interview-4',
        action: 'Evaluate cultural fit',
        description: 'Do they get along with the crew? Are they customer-facing material? Moving requires teamwork and patience under pressure. Attitude matters as much as strength — one bad apple ruins the crew dynamic and generates bad reviews.',
        currentMethod: 'Gut feeling during ride-along',
        softwareSolutions: [
          { name: 'Feedback form for crew leads', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: 'Observed during working interview',
        priority: 'must-have',
      },
      {
        id: 'interview-5',
        action: 'Make offer & negotiate',
        description: 'Start date, pay rate ($16-22/hr for movers), schedule expectations (weekends required), probationary period (30-90 days at most companies). Be transparent about tips (movers in Austin average $20-50/day in tips). Put it in writing.',
        currentMethod: 'Verbal agreement, handshake',
        softwareSolutions: [
          { name: 'Google Docs offer letter', cost: 'Free', fit: 'free' },
          { name: 'Gusto (offer letters built in)', cost: '$40+/mo', fit: 'budget' },
        ],
        timeToImplement: '15-30 min',
        priority: 'must-have',
      },
    ],
  },
  {
    id: 'paperwork',
    name: 'Hire & Paperwork',
    icon: FileText,
    color: 'from-rose-500 to-rose-600',
    tagline: 'Get the legal stuff right — payroll, insurance, and equipment — before their first real day.',
    actions: [
      {
        id: 'paper-1',
        action: 'Employment paperwork',
        description: 'W-4 (tax withholding), I-9 (work authorization), direct deposit form, emergency contacts, company policy acknowledgment (damage protocol, dress code, tip policy, no-show consequences). Digital is better than paper — lost forms are a compliance risk.',
        currentMethod: 'Paper forms in a filing cabinet, sometimes lost',
        softwareSolutions: [
          { name: 'Gusto', cost: '$40+$6/person/mo', fit: 'budget' },
          { name: 'Square Payroll', cost: '$35+$6/person/mo', fit: 'budget' },
          { name: 'Google Forms + Drive', cost: 'Free', fit: 'free' },
        ],
        customBuildOption: 'A digital onboarding packet with e-signatures and automatic filing.',
        timeToImplement: '30-45 min per hire',
        priority: 'must-have',
      },
      {
        id: 'paper-2',
        action: 'Issue equipment',
        description: 'Company shirt/uniform ($15-30), moving gloves, back brace (optional), company ID badge if you use one. Track what you issue — deduct from final paycheck if not returned. Some companies provide tool belts, furniture pads for training.',
        currentMethod: 'Hand them a shirt, hope they return it',
        softwareSolutions: [
          { name: 'Google Sheets inventory', cost: 'Free', fit: 'free' },
          { name: 'Homebase', cost: '$0/mo', fit: 'free' },
        ],
        timeToImplement: '15 min',
        priority: 'nice-to-have',
      },
      {
        id: 'paper-3',
        action: 'Set up payroll',
        description: 'Add them to your payroll system — pay rate, schedule, tax info, direct deposit. Texas has no state income tax (one less form). Movers are W-2 employees, not 1099 — misclassification penalties are severe ($50/form + back taxes).',
        currentMethod: 'QuickBooks or manual checks, sometimes delayed',
        softwareSolutions: [
          { name: 'Gusto', cost: '$40+$6/person/mo', fit: 'budget' },
          { name: 'Square Payroll', cost: '$35+$6/person/mo', fit: 'budget' },
          { name: 'QuickBooks Payroll', cost: '$45+$6/person/mo', fit: 'budget' },
        ],
        timeToImplement: '15 min per employee',
        priority: 'must-have',
      },
      {
        id: 'paper-4',
        action: 'Insurance enrollment',
        description: 'Workers\' comp is required in Texas for movers (physical labor = high risk). Add new employees to your policy ASAP — an uninsured injury on day one is catastrophic. If you offer health insurance, enroll them. Vehicle insurance for anyone driving trucks.',
        currentMethod: 'Call the insurance agent eventually',
        softwareSolutions: [
          { name: 'Your insurance broker', cost: 'Varies', fit: 'pro' },
          { name: 'Gusto (handles workers comp)', cost: 'Included', fit: 'budget' },
        ],
        timeToImplement: '15-30 min',
        priority: 'must-have',
      },
      {
        id: 'paper-5',
        action: 'Grant system access',
        description: 'Add them to the scheduling system, group chat (GroupMe/Slack/text thread), time tracking app, and any customer-facing systems. They need to know where to show up tomorrow and how to clock in.',
        currentMethod: 'Add them to the group text',
        softwareSolutions: [
          { name: 'GroupMe', cost: 'Free', fit: 'free' },
          { name: 'Slack', cost: 'Free tier', fit: 'free' },
          { name: 'Homebase', cost: '$0/mo', fit: 'free' },
          { name: 'Google Workspace', cost: '$6/user/mo', fit: 'budget' },
        ],
        timeToImplement: '10 min',
        priority: 'must-have',
      },
    ],
  },
  {
    id: 'onboard',
    name: 'Onboard & Train',
    icon: GraduationCap,
    color: 'from-teal-500 to-teal-600',
    tagline: 'Teach them to move furniture, deal with customers, and stay safe in the Texas heat.',
    actions: [
      {
        id: 'onboard-1',
        action: 'Moving fundamentals training',
        description: 'Wrapping and padding techniques, loading/unloading order (heavy on bottom, fragile on top), weight distribution in truck, two-person stair carries, furniture disassembly/reassembly (IKEA, cribs, bed frames), blanket wrapping, shrink wrapping.',
        currentMethod: 'Learn on the job from the crew lead',
        softwareSolutions: [
          { name: 'Google Docs/Drive (SOPs)', cost: 'Free', fit: 'free' },
          { name: 'Loom video tutorials', cost: '$12.50/mo', fit: 'budget' },
          { name: 'Trainual', cost: '$99/mo', fit: 'pro' },
        ],
        customBuildOption: 'Video training library with checklist sign-offs, hosted on your own site.',
        timeToImplement: '2-3 days of ride-alongs',
        priority: 'must-have',
      },
      {
        id: 'onboard-2',
        action: 'Customer service training',
        description: 'How to greet customers ("Hi, I\'m [name] with Barton Springs Moving"), handle complaints on-site, communicate delays ("We\'re running 20 minutes behind, here\'s why"), protect property (floor runners, door frame protectors), ask for reviews at the end.',
        currentMethod: 'Watch how the lead does it',
        softwareSolutions: [
          { name: 'Script cards/cheat sheets', cost: 'Free', fit: 'free' },
          { name: 'Loom', cost: '$12.50/mo', fit: 'budget' },
        ],
        timeToImplement: '1-2 hours of training',
        priority: 'must-have',
      },
      {
        id: 'onboard-3',
        action: 'Safety training',
        description: 'Heat safety is critical in Austin (100\u00B0F+ summers) — hydration schedules, heat illness signs, mandatory breaks. Proper lifting technique (legs, not back). PPE requirements. Vehicle safety. Injury reporting procedures. OSHA requires documented training.',
        currentMethod: '"Be careful out there" on day one',
        softwareSolutions: [
          { name: 'OSHA training materials', cost: 'Free', fit: 'free' },
          { name: 'SafetyCulture (iAuditor)', cost: '$0-19/user/mo', fit: 'budget' },
        ],
        timeToImplement: '2-3 hours initial, refreshers quarterly',
        priority: 'must-have',
      },
      {
        id: 'onboard-4',
        action: 'Company procedures',
        description: 'How to clock in/out (Homebase, time card), report issues to dispatch, communicate with the office, handle tips (split evenly or individual?), damage protocol (report immediately, photograph, fill out claim form), dress code.',
        currentMethod: 'Verbal instructions, inconsistent',
        softwareSolutions: [
          { name: 'Google Docs handbook', cost: 'Free', fit: 'free' },
          { name: 'Notion wiki', cost: 'Free', fit: 'free' },
          { name: 'Trainual', cost: '$99/mo', fit: 'pro' },
        ],
        customBuildOption: 'A digital employee handbook with acknowledgment tracking.',
        timeToImplement: '4-6 hours to create, 1 hour per hire to train',
        priority: 'nice-to-have',
      },
      {
        id: 'onboard-5',
        action: 'Ride-along shifts',
        description: 'First 2-3 days shadowing an experienced crew. New mover watches and assists, doesn\'t lead. Day 1: observe. Day 2: actively help with guidance. Day 3: take point on simple tasks. Crew lead reports back on readiness.',
        currentMethod: 'Already doing some version of this',
        softwareSolutions: [
          { name: 'Training checklist', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: '2-3 full work days',
        priority: 'must-have',
      },
      {
        id: 'onboard-6',
        action: 'Truck & equipment training',
        description: 'Driving the box truck (if they\'ll drive), loading ramp operation, how to use dollies/hand trucks/straps/furniture sliders, GPS/routing apps, pre-trip truck inspection (tires, lights, ramp), fuel card usage.',
        currentMethod: 'Figure it out on the first day',
        softwareSolutions: [
          { name: 'Training checklist', cost: 'Free', fit: 'free' },
          { name: 'Loom videos', cost: '$12.50/mo', fit: 'budget' },
        ],
        timeToImplement: '2-4 hours per driver',
        priority: 'must-have',
      },
      {
        id: 'onboard-7',
        action: 'Probationary period management',
        description: '30-90 day probationary period with structured check-ins. Week 1: daily check-in. Week 2-4: weekly. Month 2-3: biweekly. Clear performance goals (show up on time, zero damage incidents, positive customer feedback). Decision to keep or cut at end of probation.',
        currentMethod: 'No formal probation — just hope they work out',
        softwareSolutions: [
          { name: 'Google Forms check-in', cost: 'Free', fit: 'free' },
          { name: '15Five', cost: '$4/user/mo', fit: 'budget' },
        ],
        customBuildOption: 'A probation tracker with automated check-in reminders and performance scoring.',
        timeToImplement: '15 min per check-in',
        priority: 'nice-to-have',
      },
    ],
  },
  {
    id: 'retain',
    name: 'Retain & Grow',
    icon: Heart,
    color: 'from-pink-500 to-pink-600',
    tagline: 'Keep your best people — replacing a mover costs $2,000-4,000 when you factor in everything.',
    actions: [
      {
        id: 'retain-1',
        action: 'Competitive pay reviews',
        description: 'Check Austin market rates quarterly. If Indeed listings for "mover Austin TX" show $19/hr and you\'re paying $16/hr, you\'re going to lose people. Raise schedule: $1/hr at 6 months, another at 12 months. Loyalty should be rewarded visibly.',
        currentMethod: 'Raise pay when someone threatens to leave',
        softwareSolutions: [
          { name: 'Indeed Salary Tool', cost: 'Free', fit: 'free' },
          { name: 'Glassdoor', cost: 'Free', fit: 'free' },
          { name: 'Gusto (comp benchmarking)', cost: 'Included', fit: 'budget' },
        ],
        timeToImplement: '1-2 hours quarterly',
        priority: 'must-have',
      },
      {
        id: 'retain-2',
        action: 'Performance bonuses',
        description: 'Per-move bonuses ($10-20 for jobs completed on time), 5-star review bonuses ($10-25 when a customer names them), zero-damage bonuses ($50/month for clean record), referral bonuses ($100-250 per hire). Make good performance financially visible.',
        currentMethod: 'Occasional cash bonuses, no system',
        softwareSolutions: [
          { name: 'Google Sheets tracker', cost: 'Free', fit: 'free' },
          { name: 'Bonusly', cost: '$3/user/mo', fit: 'budget' },
          { name: 'Gusto (bonus payroll)', cost: 'Included', fit: 'budget' },
        ],
        customBuildOption: 'A bonus dashboard that auto-tracks eligible bonuses from job completion and review data.',
        timeToImplement: '2 hours to set up tracking',
        priority: 'must-have',
      },
      {
        id: 'retain-3',
        action: 'Career path creation',
        description: 'Mover ($16-18/hr) \u2192 Lead Mover ($18-20/hr) \u2192 Crew Lead ($20-24/hr) \u2192 Foreman ($24-28/hr) \u2192 Operations Manager (salary). Clear criteria for each promotion. People stay when they see a ladder, not a ceiling.',
        currentMethod: 'No visible career path — just "keep working"',
        softwareSolutions: [
          { name: 'Google Docs', cost: 'Free', fit: 'free' },
          { name: 'Notion', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: '2-3 hours to define levels',
        priority: 'nice-to-have',
      },
      {
        id: 'retain-4',
        action: 'Schedule flexibility',
        description: 'Accommodate school schedules, second jobs, family commitments. Let people swap shifts. Offer 4-day weeks in slow season. Flexible scheduling is the #1 reason movers choose one company over another (after pay).',
        currentMethod: 'Rigid scheduling, limited flexibility',
        softwareSolutions: [
          { name: 'Homebase (shift swap)', cost: '$0-80/mo', fit: 'budget' },
          { name: 'When I Work', cost: '$2.50/user/mo', fit: 'budget' },
        ],
        timeToImplement: 'Ongoing management',
        priority: 'nice-to-have',
      },
      {
        id: 'retain-5',
        action: 'Team culture building',
        description: 'Crew lunches on Fridays, end-of-summer BBQ, birthday recognition in the group chat, "Mover of the Month" with a small prize ($50 gift card + recognition). People don\'t quit jobs — they quit bosses and bad culture.',
        currentMethod: 'Occasional pizza, nothing structured',
        softwareSolutions: [
          { name: 'GroupMe/Slack', cost: 'Free', fit: 'free' },
          { name: 'Bonusly', cost: '$3/user/mo', fit: 'budget' },
        ],
        timeToImplement: '1-2 hours/month',
        priority: 'nice-to-have',
      },
      {
        id: 'retain-6',
        action: 'Regular check-ins',
        description: 'Monthly 1-on-1 with each crew member (15 min): How\'s it going? Any issues with the crew? Equipment complaints? What could be better? These catch problems before they become resignations.',
        currentMethod: 'Only talk when there\'s a problem',
        softwareSolutions: [
          { name: '15Five', cost: '$4/user/mo', fit: 'budget' },
          { name: 'Google Forms pulse survey', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: '15 min per person per month',
        priority: 'nice-to-have',
      },
      {
        id: 'retain-7',
        action: 'Benefits & perks',
        description: 'PTO after 90 days (even 3-5 days matters). Gas cards for drivers. Gym membership discounts. Tool/boot allowance ($100/year). Company events. Health insurance if you can afford it. Even small perks show you care about them as people.',
        currentMethod: 'No benefits beyond base pay and tips',
        softwareSolutions: [
          { name: 'Gusto (benefits admin)', cost: 'Included', fit: 'budget' },
          { name: 'Justworks', cost: '$59/employee/mo', fit: 'pro' },
        ],
        timeToImplement: '4-6 hours to set up, then ongoing',
        priority: 'advanced',
      },
    ],
  },
  {
    id: 'manage',
    name: 'Manage & Offboard',
    icon: BarChart3,
    color: 'from-slate-500 to-slate-600',
    tagline: 'Track performance, handle problems professionally, and learn from departures.',
    actions: [
      {
        id: 'manage-1',
        action: 'Track performance metrics',
        description: 'Jobs completed per week, customer ratings (5-star reviews mentioning their name), on-time percentage, damage incidents, attendance/punctuality. You can\'t manage what you don\'t measure — and your best movers deserve to see their impact.',
        currentMethod: 'Anecdotal — "he\'s a good worker" or "she\'s always late"',
        softwareSolutions: [
          { name: 'Google Sheets', cost: 'Free', fit: 'free' },
          { name: 'Homebase', cost: '$0-80/mo', fit: 'budget' },
        ],
        customBuildOption: 'A mover performance dashboard pulling data from job completions, reviews, and time tracking.',
        timeToImplement: '2 hours to set up tracking',
        priority: 'nice-to-have',
      },
      {
        id: 'manage-2',
        action: 'Handle disciplinary issues',
        description: 'Progressive discipline: verbal warning \u2192 written warning \u2192 suspension \u2192 termination. Document EVERYTHING in writing (even verbal warnings get noted). Common issues: no-shows, chronic lateness, customer complaints, damage from carelessness, attitude problems.',
        currentMethod: 'Informal talks, then sudden firing',
        softwareSolutions: [
          { name: 'Google Docs documentation', cost: 'Free', fit: 'free' },
          { name: 'Gusto (HR documentation)', cost: 'Included', fit: 'budget' },
          { name: 'BambooHR', cost: '$6/employee/mo', fit: 'pro' },
        ],
        timeToImplement: '15-30 min per incident',
        priority: 'must-have',
      },
      {
        id: 'manage-3',
        action: 'Manage no-shows & callouts',
        description: 'Build a backup crew list — part-timers, former employees willing to pick up shifts, staffing agency on speed dial. A mover no-show on move day costs you ~$1,800 (the lost/delayed job) plus a bad review. Have a plan for this.',
        currentMethod: 'Scramble and call everyone you know',
        softwareSolutions: [
          { name: 'Homebase (shift coverage)', cost: '$0-80/mo', fit: 'budget' },
          { name: 'PeopleReady (same-day)', cost: '$18-25/hr', fit: 'pro' },
        ],
        customBuildOption: 'An on-call availability tracker with one-tap shift notifications.',
        timeToImplement: '1-2 hours to build the list',
        priority: 'must-have',
      },
      {
        id: 'manage-4',
        action: 'Seasonal layoff management',
        description: 'November-February is slow in Austin. Options: reduce hours to 2-3 days/week (keep them on payroll), formal layoff with rehire priority in spring, offer paid training during slow days, cross-train for office/sales tasks. Communicate early — surprise layoffs kill trust.',
        currentMethod: 'People drift away in winter, scramble to rehire in spring',
        softwareSolutions: [
          { name: 'Homebase scheduling', cost: '$0-80/mo', fit: 'budget' },
          { name: 'Gusto (layoff/rehire)', cost: 'Included', fit: 'budget' },
        ],
        timeToImplement: 'Plan in September for November',
        priority: 'nice-to-have',
      },
      {
        id: 'manage-5',
        action: 'Termination process',
        description: 'Final paycheck (Texas law: next regular payday, or within 6 calendar days if involuntary termination). Collect equipment (uniforms, keys, ID). Remove from all systems (scheduling, group chat, payroll). Document the reason. Be professional — the moving world in Austin is small.',
        currentMethod: 'Awkward conversation and hope they return the shirt',
        softwareSolutions: [
          { name: 'Gusto (off-boarding)', cost: 'Included', fit: 'budget' },
          { name: 'Termination checklist', cost: 'Free', fit: 'free' },
        ],
        timeToImplement: '30 min per termination',
        priority: 'must-have',
      },
      {
        id: 'manage-6',
        action: 'Exit interview',
        description: 'Why are they leaving? What would make them stay? How was the culture? Would they recommend working here? This data is gold for reducing future turnover. Even a 5-question Google Form captures useful patterns over time.',
        currentMethod: 'Never done — they just stop showing up',
        softwareSolutions: [
          { name: 'Google Forms', cost: 'Free', fit: 'free' },
          { name: '15Five', cost: '$4/user/mo', fit: 'budget' },
        ],
        customBuildOption: 'Exit survey with trend analysis — see if the same reasons keep coming up.',
        timeToImplement: '10 min per departure',
        priority: 'nice-to-have',
      },
    ],
  },
];

/* ─── Helper functions ─── */
const priorityLabel = (p: string) => {
  switch (p) {
    case 'must-have': return 'Must-Have';
    case 'nice-to-have': return 'Nice-to-Have';
    case 'advanced': return 'Advanced';
    default: return '';
  }
};
const priorityColor = (p: string) => {
  switch (p) {
    case 'must-have': return 'text-rose-700 bg-rose-50 border-rose-200';
    case 'nice-to-have': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'advanced': return 'text-violet-700 bg-violet-50 border-violet-200';
    default: return '';
  }
};
const fitColor = (f: string) => {
  switch (f) {
    case 'free': return 'bg-emerald-50 text-emerald-700';
    case 'budget': return 'bg-blue-50 text-blue-700';
    case 'pro': return 'bg-violet-50 text-violet-700';
    default: return '';
  }
};
const effectivenessIcon = (e: string) => {
  switch (e) {
    case 'high': return '🟢';
    case 'medium': return '🟡';
    case 'low': return '🔴';
    default: return '';
  }
};

/* ─── Software & Ad summaries ─── */
interface ToolInfo {
  name: string;
  desc: string;
  details: string;
  url?: string;
  stages: string;
  buildTime?: string;
  buildCost?: string;
  monthlyCost?: string;
  techStack?: string;
}

interface SoftwareTier {
  name: string;
  color: string;
  icon: React.FC<{ className?: string }>;
  tools: ToolInfo[];
}

const softwareTiers: SoftwareTier[] = [
  {
    name: 'Free Tools',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    icon: Globe,
    tools: [
      {
        name: 'Google Sheets / Forms / Docs',
        desc: 'Track applicants, create application forms, write job descriptions, build checklists. The Swiss army knife of small business hiring.',
        details: 'Sheets can serve as a basic applicant tracking system \u2014 columns for name, phone, source, status, notes, and hire date. Forms can be your application \u2014 embed it on your website or text the link to walk-ins. Docs handles job descriptions, offer letters, and SOPs. The limitation: no automation, no notifications, no conflict detection. You have to manually check and update everything. Works fine for 1-3 hires at a time but gets chaotic during peak season when you\'re screening 20+ applicants.',
        url: 'https://workspace.google.com/',
        stages: 'Plan, Recruit, Screen, Onboard, Manage',
      },
      {
        name: 'Indeed (organic listings)',
        desc: '#1 job board for blue-collar hiring. Free posts get visibility but sponsored posts get 3-5x more applicants.',
        details: 'Indeed dominates the blue-collar job market \u2014 it\'s where movers, drivers, and laborers go to find work. Your free listing appears in search results but gets buried fast (new posts every hour). The platform includes a built-in messaging system, resume database search, and basic applicant tracking. Indeed also offers skills assessments you can attach to your listing (e.g., "reliability" or "physical fitness" quizzes). The Indeed Employer app lets you review and message candidates from your phone. For Austin specifically, Indeed consistently outperforms other job boards for moving and labor positions.',
        url: 'https://employers.indeed.com/',
        stages: 'Recruit',
      },
      {
        name: 'Facebook Jobs',
        desc: 'Free job postings on Facebook. Reaches people where they already spend time. Good for local Austin recruiting.',
        details: 'Post a job directly from your Facebook business page \u2014 it shows up in the Jobs tab and can appear in News Feed. Candidates apply with one tap using their Facebook profile info, which lowers the friction compared to a formal application. You can also share the job post to Austin community groups (ATX Jobs, Austin Blue Collar Workers, etc.) for extra reach. Facebook\'s targeting means your post naturally reaches people in your area who fit the demographic. The downside: no applicant tracking beyond the basic Facebook inbox, and you\'ll get some low-quality applications since it\'s so easy to apply.',
        url: 'https://www.facebook.com/jobs/',
        stages: 'Recruit',
      },
      {
        name: 'E-Verify',
        desc: 'Free federal system to verify employment authorization electronically. Legally required I-9 compliance.',
        details: 'E-Verify is the federal government\'s electronic system for verifying that new employees are authorized to work in the United States. After completing the I-9 form (which you\'re legally required to do within 3 days of hire), you enter the information into E-Verify and get a result \u2014 usually within seconds. It cross-references Social Security Administration and Department of Homeland Security databases. While E-Verify itself is voluntary in Texas (unlike some states that mandate it), many moving companies use it as a best practice. It\'s completely free and protects you from unknowingly hiring unauthorized workers, which carries penalties of $252-$2,507 per I-9 violation.',
        url: 'https://www.e-verify.gov/',
        stages: 'Screen, Paperwork',
      },
      {
        name: 'Homebase (free tier)',
        desc: 'Free scheduling, time tracking, and basic team communication. Great starting point for small crews.',
        details: 'Homebase\'s free plan covers one location with unlimited employees \u2014 perfect for a single-warehouse moving company. You get: a weekly schedule builder where you assign crew members to shifts, a mobile time clock where movers clock in/out from their phone (with GPS verification so you know they\'re at the job site), team messaging, and basic hiring tools (job posting, applicant tracking). The free tier doesn\'t include shift trading, labor cost forecasting, or advanced HR features \u2014 those start at $20/mo. But for a 2-3 crew operation, the free plan covers 80% of what you need. The mobile app is solid and movers actually use it.',
        url: 'https://joinhomebase.com/',
        stages: 'Plan, Recruit, Paperwork, Onboard, Retain, Manage',
      },
    ],
  },
  {
    name: 'Budget Tools ($5-50/mo)',
    color: 'bg-brand-50 border-brand-200 text-brand-700',
    icon: Monitor,
    tools: [
      {
        name: 'Gusto ($40+$6/person/mo)',
        desc: 'All-in-one payroll, benefits, HR, and onboarding. Handles W-4s, I-9s, workers comp, and direct deposit. Best value for small teams.',
        details: 'Gusto replaces your accountant for payroll and your filing cabinet for HR paperwork. New hires get a self-service onboarding link where they fill out W-4, I-9, direct deposit, and emergency contacts electronically \u2014 no paper forms to lose. Payroll runs automatically on your schedule (weekly or biweekly), calculating taxes, deductions, and direct deposits. Gusto handles Texas state compliance, workers\' comp integration (they can even broker your policy), and year-end tax forms (W-2s). The platform also tracks PTO, manages benefits enrollment if you offer health insurance, and stores all employee documents. For a 2-3 crew operation with 9-15 employees, you\'re looking at $94-130/month \u2014 less than one hour of an accountant\'s time. The mobile app lets you run payroll from your phone.',
        url: 'https://gusto.com/',
        stages: 'Paperwork, Retain, Manage',
      },
      {
        name: 'Homebase Pro ($20-80/mo)',
        desc: 'Advanced scheduling, shift swaps, labor cost tracking, hiring tools, and performance tracking.',
        details: 'The paid tiers add the features that matter during peak season. The Essentials plan ($20/mo) adds shift trading (crew members can swap shifts without calling you), early access to schedules, and basic labor cost tracking so you can see what each crew costs per job. The Plus plan ($48/mo) adds labor cost controls with real-time alerts (get notified when overtime is approaching), manager permissions for crew leads, and PTO tracking. The All-in-One plan ($80/mo) adds the hiring module (post to Indeed, ZipRecruiter, and other boards from one place), new hire onboarding packets, performance reviews, and document storage. The hiring module alone can save $50-100/mo compared to a standalone ATS like JazzHR.',
        url: 'https://joinhomebase.com/pricing/',
        stages: 'Plan, Recruit, Screen, Onboard, Retain, Manage',
      },
      {
        name: 'JazzHR ($49/mo)',
        desc: 'Applicant tracking system with job posting syndication, candidate pipeline, and interview scheduling.',
        details: 'JazzHR is a dedicated applicant tracking system (ATS) \u2014 it does one thing well: manage the flow of candidates from application to hire. You write a job description once and it syndicates to Indeed, ZipRecruiter, Glassdoor, and other boards simultaneously. Every applicant flows into a visual pipeline (New \u2192 Phone Screen \u2192 Working Interview \u2192 Offer \u2192 Hired) so you can see where everyone stands at a glance. It includes customizable application forms, automated email responses ("Thanks for applying, we\'ll be in touch"), interview scheduling with calendar integration, collaborative hiring notes (crew lead can rate the working interview), and offer letter templates. For a company hiring 8-12 people per year, JazzHR replaces the scattered texts, emails, and sticky notes with one organized system. The $49/mo Hero plan supports up to 3 open jobs at a time.',
        url: 'https://www.jazzhr.com/',
        stages: 'Recruit, Screen, Interview',
      },
      {
        name: 'Checkr ($29-85/check)',
        desc: 'Background checks, MVR reports, drug screening coordination. Fast results (1-3 days) and candidate-friendly.',
        details: 'Checkr is the modern background check service that most startups and growing companies use. You send the candidate a link, they consent and enter their info, and Checkr runs the checks \u2014 no SSN collection on your end. The Basic package ($29) covers Social Security trace, national criminal database, and sex offender registry. The Standard package ($54) adds county criminal court records (more thorough than the national database alone). The Pro package ($85) adds federal criminal search, education verification, and employment verification. Motor Vehicle Record (MVR) checks for truck drivers are $5-15 extra. Results typically come back in 1-3 business days \u2014 faster than the old-school services that take a week. Checkr is also compliant with FCRA (Fair Credit Reporting Act) requirements, which protects you legally. They handle the adverse action process if you need to reject someone based on findings.',
        url: 'https://checkr.com/',
        stages: 'Screen',
      },
    ],
  },
  {
    name: 'Pro Tools ($50-200+/mo)',
    color: 'bg-violet-50 border-violet-200 text-violet-700',
    icon: Smartphone,
    tools: [
      {
        name: 'Workable ($149/mo)',
        desc: 'Full applicant tracking with AI screening, video interviews, and 200+ job board integrations.',
        details: 'Workable is the enterprise-grade ATS that does everything JazzHR does and more, but at a higher price point. The standout feature is AI-powered candidate screening \u2014 it reads resumes and surfaces the best matches based on your criteria. It includes one-way video interviews (candidate records answers to your questions on their own time \u2014 great for phone screen replacement), built-in reference checking, offer management, and e-signatures. It posts to 200+ job boards including niche sites. Workable also has a mobile app so you can review candidates between jobs. For a 2-3 crew operation, this is probably overkill \u2014 JazzHR or even Homebase\'s hiring module covers what you need at a fraction of the price. But if you\'re scaling to 5+ crews and hiring 30+ people per year, Workable\'s automation starts paying for itself.',
        url: 'https://www.workable.com/',
        stages: 'Recruit, Screen, Interview',
      },
      {
        name: 'Trainual ($99/mo)',
        desc: 'Digital training manuals with progress tracking. Build SOPs once, assign to every new hire automatically.',
        details: 'Trainual turns your tribal knowledge into a structured training system. You create "subjects" (Moving Fundamentals, Customer Service, Safety, Company Policies) with steps that include text, images, videos, and screen recordings. When a new hire starts, you assign them the "New Mover" training track and they work through it at their own pace \u2014 from their phone during downtime or at home. Each step has a completion checkbox, and some can include quizzes ("What do you do if a customer reports damage?"). You can see exactly where each new hire is in their training: Day 3 and they haven\'t started Safety training? Flag it. The real value is consistency \u2014 every new mover gets the same training regardless of which crew lead they shadow. You build it once and it runs forever. $99/mo covers up to 50 employees. The ROI calculation: if standardized training prevents even one damage claim ($500-2,000) per quarter, it pays for itself.',
        url: 'https://trainual.com/',
        stages: 'Onboard',
      },
      {
        name: 'Staffing Agencies ($18-25/hr)',
        desc: 'PeopleReady, Labor Finders. Instant crew members for surge demand. Expensive long-term but invaluable in emergencies.',
        details: 'Staffing agencies are the emergency room of hiring \u2014 expensive, but they save you when you\'re in crisis. PeopleReady (formerly Labor Ready) has an app where you can request workers for the next day. Labor Finders is another major player in Austin. You pay a marked-up hourly rate ($18-25/hr when the worker might earn $14-16) \u2014 the agency handles payroll, workers\' comp, and taxes for those workers. The workers are not vetted to your standards (they may never have moved furniture before), so pair them with experienced crew members. Best use cases: a mover no-shows on a 3-bedroom move, peak summer demand exceeds your crew capacity, or you\'re testing whether you need a permanent hire. Bad use case: relying on temp workers as your regular crew. The quality is inconsistent, they don\'t know your procedures, and customers notice the difference. Think of staffing agencies as a bridge, not a foundation.',
        url: 'https://www.peopleready.com/',
        stages: 'Recruit, Manage',
      },
    ],
  },
  {
    name: 'Custom-Built Solutions',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    icon: Zap,
    tools: [
      {
        name: 'Hiring Pipeline Dashboard',
        desc: 'Track every applicant from first contact to 90-day review. See where candidates drop off and which sources produce the best hires.',
        details: 'A custom applicant tracking board built specifically for your hiring process \u2014 not a generic HR tool with features you\'ll never use. The dashboard shows every candidate as a card moving through your pipeline: Applied \u2192 Phone Screen \u2192 Working Interview \u2192 Background Check \u2192 Offer \u2192 Hired \u2192 90-Day Review. Each card shows their name, phone, source (Indeed, referral, walk-in), date applied, and crew lead notes. You can filter by status, sort by date, and search by name. The magic is in the analytics: which recruiting source produces the most hires? What\'s your average time-to-hire? Where do candidates drop off? If 60% of your Indeed applicants ghost after the phone screen, you know to improve that step. Unlike JazzHR ($49/mo), you own it forever and it\'s designed exactly for how a moving company hires.',
        buildTime: '2-3 days',
        buildCost: '$600',
        monthlyCost: '$0-10/mo',
        techStack: 'React, Supabase, Vercel',
        stages: 'Recruit, Screen, Interview, Paperwork',
      },
      {
        name: 'Application Auto-Scorer',
        desc: 'Score incoming applications automatically based on your criteria. Flag top candidates instantly.',
        details: 'When someone fills out your application form, this system automatically scores them based on weighted criteria you define: Has moving experience? (+20 points) Has valid driver\'s license? (+15) Lives within 30 minutes of warehouse? (+10) Available weekends? (+15) Has reliable transportation? (+10) Has references? (+5) Prior no-shows at previous jobs? (-30). Each application gets a score out of 100 and a color: green (70+, call immediately), yellow (40-69, worth a phone screen), red (below 40, probably skip). You get an email or text notification for every green candidate so you can call them within hours \u2014 before a competitor does. The scoring weights are adjustable: if you care more about weekend availability than experience, bump that weight up. This replaces the 30 minutes you spend reading each application and making a gut call. Built as a Google Apps Script integration (runs inside your existing Google Forms) or as a standalone form. No monthly fees \u2014 it runs on Google\'s infrastructure.',
        buildTime: '1-2 days',
        buildCost: '$300-400',
        monthlyCost: '$0',
        techStack: 'Google Apps Script or React + Supabase',
        stages: 'Screen',
      },
      {
        name: 'Training Progress Tracker',
        desc: 'Checklist-based onboarding with video modules and sign-off tracking. Know exactly where each new hire is in training.',
        details: 'A digital training checklist that replaces the "shadow someone for 3 days and hope they learn" approach. Each new hire gets a profile with training modules organized by category: Moving Fundamentals (12 items: blanket wrapping, stair carries, truck loading, furniture disassembly...), Customer Service (6 items: greeting script, damage reporting, complaint handling...), Safety (8 items: heat protocol, lifting technique, PPE, injury reporting...), Company Procedures (5 items: clock-in, dispatch communication, tip policy...). Each item can have: a description of what to learn, a link to a training video (filmed on your phone, hosted on YouTube unlisted), a checkbox for the trainee to mark complete, and a sign-off field for the crew lead to confirm they witnessed it. The dashboard shows all active trainees with progress bars \u2014 "Marcus: 67% complete, missing Safety module." Crew leads can sign off from their phones between jobs. Replaces Trainual ($99/mo = $1,188/year) with a one-time investment.',
        buildTime: '2-3 days',
        buildCost: '$500',
        monthlyCost: '$0-10/mo',
        techStack: 'React, Supabase, YouTube (unlisted)',
        stages: 'Onboard',
      },
      {
        name: 'Mover Performance Dashboard',
        desc: 'Track mover metrics (jobs, ratings, attendance, damage) and tie them to bonuses automatically.',
        details: 'A scoreboard for your crew that turns gut feelings ("he\'s a hard worker") into measurable data. Each mover has a profile showing: jobs completed this month/quarter/year, customer ratings (from your review system \u2014 5-star reviews that mention their name), on-time percentage (clocked in within 10 minutes of scheduled start), damage incidents (logged by crew leads), attendance record (no-shows, callouts, late arrivals), and a calculated performance score. The bonus engine runs automatically: zero damage incidents this month = $50 bonus, named in a 5-star review = $15 bonus, perfect attendance = $25 bonus, referral hire who stays 90 days = $200 bonus. Movers can see their own dashboard on their phone \u2014 gamification drives behavior. Top performers see their name on a leaderboard. This is the most complex custom build but has the highest ROI: it directly reduces turnover (people stay where they feel recognized) and reduces damage (people are more careful when it\'s tracked). Pulls data from Homebase (time tracking), Google Reviews, and crew lead reports.',
        buildTime: '3-5 days',
        buildCost: '$800',
        monthlyCost: '$10/mo',
        techStack: 'React, Supabase, Recharts, API integrations',
        stages: 'Retain, Manage',
      },
      {
        name: 'Seasonal Staffing Predictor',
        desc: 'Forecast crew needs by month based on historical job volume, with temp vs permanent hire recommendations.',
        details: 'This tool takes your historical job data (or estimates if you don\'t have data yet) and predicts how many crew members you need each month. Input: average jobs per month by season (January: 8, June: 25, etc.), crew size per job type (studio: 2, 3BR: 3, commercial: 4-5), your current roster, and maximum capacity per crew. Output: a month-by-month staffing plan showing required headcount, current gap, and recommendations \u2014 "March: 3 crews needed, you have 2.5 crews, hire 2 movers by March 1 or book 1 temp per week." It also models the financial impact: "Hiring 2 permanent movers in March costs $X but saves $Y in staffing agency markup through September." The seasonal model for Austin is well-documented: slow Nov-Feb, ramp-up March-April, peak May-September, wind-down October. This is a glorified spreadsheet with a nice UI \u2014 but it forces you to plan instead of react.',
        buildTime: '1-2 days',
        buildCost: '$400',
        monthlyCost: '$0',
        techStack: 'React, local calculations (no backend needed)',
        stages: 'Plan',
      },
      {
        name: 'Referral & Bonus Tracker',
        desc: 'Track employee referrals, calculate earned bonuses, and show movers their rewards in real time.',
        details: 'A simple system that makes your referral program actually work. When a mover refers someone, they log it in the app (or you log it for them). The system tracks: who referred whom, the referral\'s hire date, their 30/60/90-day milestones, and the referral bonus status (pending \u2192 eligible \u2192 paid). The referring mover sees their dashboard: "You referred Marcus (hired 3/1) \u2014 90-day bonus of $200 unlocks June 1." This also extends to performance bonuses: the system aggregates data from reviews, attendance, and damage reports to calculate monthly bonuses and shows each mover what they\'ve earned, what\'s pending, and what they need to hit their next bonus. Transparency drives participation \u2014 when movers see that referrals actually pay out, they recruit harder. Integrates with your payroll (Gusto) to flag bonus payments.',
        buildTime: '1-2 days',
        buildCost: '$400',
        monthlyCost: '$0',
        techStack: 'React, Supabase',
        stages: 'Recruit, Retain',
      },
    ],
  },
];

const adCategories = [
  {
    name: 'Free Channels',
    icon: Star,
    color: 'bg-emerald-50 border-emerald-200',
    methods: [
      { method: 'Facebook Jobs', cost: 'Free', effectiveness: 'medium', notes: 'Post directly on your Facebook page. Reaches followers and local job seekers.' },
      { method: 'Instagram/TikTok content', cost: 'Free (time only)', effectiveness: 'medium', notes: 'Behind-the-scenes move day content shows the job and culture. Builds employer brand.' },
      { method: 'Employee referrals', cost: '$100-250/hire', effectiveness: 'high', notes: 'Your best movers know other good movers. Referral hires stay 2x longer on average.' },
      { method: 'Nextdoor', cost: 'Free', effectiveness: 'medium', notes: 'Hyper-local neighborhood app. Good for finding people who live near your service area.' },
      { method: 'Workforce Solutions', cost: 'Free', effectiveness: 'medium', notes: 'Government job service that actively connects job seekers with employers.' },
    ],
  },
  {
    name: 'Paid — Low Budget ($5-25/day)',
    icon: TrendingUp,
    color: 'bg-brand-50 border-brand-200',
    methods: [
      { method: 'Indeed Sponsored', cost: '$5-15/day', effectiveness: 'high', notes: 'Boosted visibility for your listing. 3-5x more applicants than organic. Best ROI for moving jobs.' },
      { method: 'Facebook/Instagram Ads', cost: '$5-20/day', effectiveness: 'high', notes: 'Target Austin-area 18-35 year olds interested in physical jobs. Great visual format.' },
      { method: 'Craigslist Austin', cost: '$25/post', effectiveness: 'medium', notes: 'Still widely used for blue-collar hiring in Austin. Simple, no frills, it works.' },
    ],
  },
  {
    name: 'Paid — Medium Budget ($25-100/day)',
    icon: Megaphone,
    color: 'bg-violet-50 border-violet-200',
    methods: [
      { method: 'Google Ads', cost: '$10-30/day', effectiveness: 'medium', notes: 'Target "movers wanted Austin TX" searches. Higher cost but captures high-intent job seekers.' },
      { method: 'ZipRecruiter', cost: '$16/day', effectiveness: 'high', notes: 'Auto-distributes to 100+ job boards. Good reach, easy to use, strong for trade jobs.' },
    ],
  },
  {
    name: 'One-Time / Physical',
    icon: Truck,
    color: 'bg-amber-50 border-amber-200',
    methods: [
      { method: 'Truck "Now Hiring" magnets', cost: '$50-200', effectiveness: 'high', notes: 'Your trucks drive all over Austin daily. Every stop is a billboard. High visibility, one-time cost.' },
      { method: 'Yard signs at warehouse', cost: '$50-150', effectiveness: 'medium', notes: '"Now Hiring Movers — $18/hr — Walk In." Works for foot traffic near your location.' },
      { method: 'Community board flyers', cost: '$20-50', effectiveness: 'low', notes: 'Gyms, laundromats, community centers. Low hit rate but reaches the right demographic.' },
      { method: 'Job fair booths', cost: '$0-200/event', effectiveness: 'medium', notes: 'Stand out from the Amazon and Uber booths. Moving companies rarely show up to job fairs.' },
    ],
  },
];

/* ─── Tool Card Component (for software summary) ─── */
function ToolCard({ tool, isCustom }: { tool: ToolInfo; isCustom?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-white/80 overflow-hidden border border-white/50">
      <div className="p-4">
        <p className="font-semibold text-gray-900">{tool.name}</p>
        <p className="mt-1 text-sm text-gray-600">{tool.desc}</p>
        {isCustom && tool.buildCost && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              <DollarSign className="h-3 w-3" /> {tool.buildCost}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              <Clock className="h-3 w-3" /> {tool.buildTime}
            </span>
            {tool.monthlyCost && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                {tool.monthlyCost === '$0' ? 'No monthly cost' : `${tool.monthlyCost} ongoing`}
              </span>
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-center gap-1 border-t border-gray-100 py-2 text-xs font-medium text-brand-600 hover:bg-brand-50/50 transition-colors"
      >
        {expanded ? <>Less detail <ChevronUp className="h-3 w-3" /></> : <>More detail <ChevronDown className="h-3 w-3" /></>}
      </button>
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-3 bg-white/60">
          <p className="text-sm text-gray-700 leading-relaxed">{tool.details}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span><span className="font-semibold text-gray-600">Used in:</span> {tool.stages}</span>
            {tool.url && (
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-600 hover:underline">
                Website <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          {isCustom && tool.techStack && (
            <div className="rounded-lg bg-brand-50 border border-brand-100 p-3">
              <p className="text-xs font-semibold text-brand-700 mb-1">How I&apos;d build it</p>
              <p className="text-xs text-gray-600"><span className="font-semibold">Tech stack:</span> {tool.techStack}</p>
              {tool.buildCost && <p className="text-xs text-gray-600 mt-1"><span className="font-semibold">One-time cost:</span> {tool.buildCost} &middot; <span className="font-semibold">Build time:</span> {tool.buildTime} &middot; <span className="font-semibold">Monthly:</span> {tool.monthlyCost}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Action Card Component ─── */
function ActionCard({ a }: { a: HiringAction }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="text-base font-bold text-gray-900">{a.action}</h4>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityColor(a.priority)}`}>
                {priorityLabel(a.priority)}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              <Clock className="h-3 w-3" /> {a.timeToImplement}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-center gap-1 border-t border-gray-100 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50/50 transition-colors"
      >
        {expanded ? <>Less detail <ChevronUp className="h-4 w-4" /></> : <>More detail <ChevronDown className="h-4 w-4" /></>}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {/* Full description */}
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Full Details</p>
            <p className="text-sm text-gray-700">{a.description}</p>
          </div>

          {/* Current method */}
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1">
              <AlertTriangle className="h-3.5 w-3.5" /> How you probably do it now
            </p>
            <p className="text-sm text-amber-800">{a.currentMethod}</p>
          </div>

          {/* Software solutions */}
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Software Solutions</p>
            <div className="flex flex-wrap gap-2">
              {a.softwareSolutions.map(s => (
                <span key={s.name} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${fitColor(s.fit)}`}>
                  <DollarSign className="h-3 w-3" /> {s.name} — {s.cost}
                </span>
              ))}
            </div>
          </div>

          {/* Advertising methods */}
          {a.advertisingMethods && a.advertisingMethods.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Advertising Methods</p>
              <div className="space-y-1.5">
                {a.advertisingMethods.map(ad => (
                  <div key={ad.method} className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{effectivenessIcon(ad.effectiveness)}</span>
                    <span className="font-medium">{ad.method}</span>
                    <span className="text-gray-400">—</span>
                    <span className="text-gray-500">{ad.cost}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom build option */}
          {a.customBuildOption && (
            <div className="rounded-lg bg-brand-50 border border-brand-100 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 mb-1">
                <Zap className="h-3.5 w-3.5" /> Custom Build Option
              </p>
              <p className="text-sm text-gray-700">{a.customBuildOption}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Stage Section Component ─── */
function StageSection({ stage, index }: { stage: PipelineStage; index: number }) {
  const Icon = stage.icon;
  const mustHaveCount = stage.actions.filter(a => a.priority === 'must-have').length;

  return (
    <section id={stage.id} className="scroll-mt-16">
      <div className="flex items-start gap-4 mb-6">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stage.color} text-white shadow-md`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400">Stage {index + 1}</span>
            <h3 className="text-xl font-bold text-gray-900">{stage.name}</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {stage.actions.length} actions &middot; {mustHaveCount} must-have
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{stage.tagline}</p>
        </div>
      </div>

      <div className="space-y-3 ml-0 sm:ml-[4.5rem]">
        {stage.actions.map(a => (
          <ActionCard key={a.id} a={a} />
        ))}
      </div>
    </section>
  );
}

/* ─── Cost Calculator ─── */
function CostCalculator() {
  const [hires, setHires] = useState(4);
  const [useIndeed, setUseIndeed] = useState(true);
  const [useFacebook, setUseFacebook] = useState(true);
  const [useBgCheck, setUseBgCheck] = useState(true);
  const [useDrugTest, setUseDrugTest] = useState(false);
  const [useStaffing, setUseStaffing] = useState(false);

  const indeedCost = useIndeed ? hires * 150 : 0; // ~$10/day for 15 days avg
  const facebookCost = useFacebook ? hires * 75 : 0; // ~$5/day for 15 days
  const bgCheckCost = useBgCheck ? hires * 1.5 * 45 : 0; // Check 1.5x candidates per hire
  const drugTestCost = useDrugTest ? hires * 1.5 * 45 : 0;
  const staffingCost = useStaffing ? hires * 200 : 0; // agency markup estimate
  const uniformCost = hires * 75;
  const trainingCost = hires * 20 * 18; // 20 hours at $18/hr avg
  const totalCost = indeedCost + facebookCost + bgCheckCost + drugTestCost + staffingCost + uniformCost + trainingCost;
  const costPerHire = Math.round(totalCost / hires);

  return (
    <section id="calculator" className="border-t border-gray-200 bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-brand-500" />
          <h2 className="text-2xl font-bold text-gray-900">Hiring Cost Calculator</h2>
        </div>
        <p className="mb-8 text-gray-500">Estimate what it costs to hire movers based on your recruiting methods.</p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of hires needed: <span className="text-brand-600">{hires}</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={hires}
                onChange={e => setHires(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1</span><span>6</span><span>12</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Recruiting channels:</p>
              {[
                { label: 'Indeed Sponsored ($10/day avg)', checked: useIndeed, set: setUseIndeed },
                { label: 'Facebook/Instagram Ads ($5/day avg)', checked: useFacebook, set: setUseFacebook },
                { label: 'Background checks ($45/check)', checked: useBgCheck, set: setUseBgCheck },
                { label: 'Drug screening ($45/test)', checked: useDrugTest, set: setUseDrugTest },
                { label: 'Staffing agency supplement', checked: useStaffing, set: setUseStaffing },
              ].map(item => (
                <label key={item.label} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={item.checked} onChange={() => item.set(!item.checked)} className="accent-brand-600 rounded" />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Estimated Cost Breakdown</h4>
            <div className="space-y-2 text-sm">
              {useIndeed && <div className="flex justify-between"><span className="text-gray-600">Indeed Sponsored</span><span className="font-medium">${indeedCost.toLocaleString()}</span></div>}
              {useFacebook && <div className="flex justify-between"><span className="text-gray-600">Facebook/Instagram Ads</span><span className="font-medium">${facebookCost.toLocaleString()}</span></div>}
              {useBgCheck && <div className="flex justify-between"><span className="text-gray-600">Background checks</span><span className="font-medium">${bgCheckCost.toLocaleString()}</span></div>}
              {useDrugTest && <div className="flex justify-between"><span className="text-gray-600">Drug screening</span><span className="font-medium">${drugTestCost.toLocaleString()}</span></div>}
              {useStaffing && <div className="flex justify-between"><span className="text-gray-600">Staffing agency</span><span className="font-medium">${staffingCost.toLocaleString()}</span></div>}
              <div className="flex justify-between"><span className="text-gray-600">Uniforms & equipment</span><span className="font-medium">${uniformCost.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Training time (20 hrs @ $18/hr)</span><span className="font-medium">${trainingCost.toLocaleString()}</span></div>
              <div className="border-t border-brand-200 pt-2 mt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span><span>${totalCost.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-white/70 p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-semibold">Cost per hire</p>
              <p className="text-3xl font-bold text-brand-700">${costPerHire.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">For {hires} hire{hires > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [view, setView] = useState<'hiring' | 'quote' | 'admin'>('hiring');
  const totalActions = stages.reduce((sum, s) => sum + s.actions.length, 0);

  if (view === 'quote') return <QuoteWizard onBack={() => setView('hiring')} />;
  if (view === 'admin') return <AdminDashboard onBack={() => setView('hiring')} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Sticky Nav ─── */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-gray-900">Hiring Guide</span>
          <div className="flex gap-3 text-sm items-center">
            <a href="#pipeline" className="hidden sm:inline text-gray-500 hover:text-brand-600">Pipeline</a>
            <a href="#actions" className="text-gray-500 hover:text-brand-600">Actions</a>
            <a href="#software" className="hidden sm:inline text-gray-500 hover:text-brand-600">Software</a>
            <a href="#advertising" className="hidden sm:inline text-gray-500 hover:text-brand-600">Advertising</a>
            <a href="#calculator" className="hidden sm:inline text-gray-500 hover:text-brand-600">Calculator</a>
            <a href={CATALOG_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 text-brand-600 font-medium">
              Catalog <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={() => setView('quote')}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors"
            >
              🚚 Quote
            </button>
            <button
              onClick={() => setView('admin')}
              className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-700 transition-colors"
            >
              📋 Inbox
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <header className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 px-4 py-20 text-white text-center">
        <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-200">
          For Barton Springs Moving
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Your Complete Guide to{' '}
          <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">Hiring Movers</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-200">
          {totalActions} actions mapped across {stages.length} stages of the hiring pipeline — each paired with software tools, advertising methods, and cost estimates.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href="#pipeline" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-semibold text-brand-700 shadow-lg hover:scale-105 transition-transform">
            Browse the pipeline <ArrowRight className="h-4 w-4" />
          </a>
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors">
            See the software demo <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* ─── Legend ─── */}
      <section className="border-b border-gray-200 bg-white px-4 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-rose-200 border border-rose-300" />
            <span className="text-gray-600">Must-Have</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-amber-200 border border-amber-300" />
            <span className="text-gray-600">Nice-to-Have</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-violet-200 border border-violet-300" />
            <span className="text-gray-600">Advanced</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🟢</span><span className="text-gray-600">High</span>
            <span>🟡</span><span className="text-gray-600">Medium</span>
            <span>🔴</span><span className="text-gray-600">Low effectiveness</span>
          </div>
        </div>
      </section>

      {/* ─── Pipeline Overview ─── */}
      <section id="pipeline" className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-2 flex items-center gap-2">
          <Layers className="h-6 w-6 text-brand-500" />
          <h2 className="text-2xl font-bold text-gray-900">The Hiring Pipeline</h2>
        </div>
        <p className="mb-8 text-gray-500">{stages.length} stages, {totalActions} total actions. Click any stage below to jump to its details.</p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <a
                key={stage.id}
                href={`#${stage.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-brand-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stage.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Stage {i + 1}</p>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600">{stage.name}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stage.actions.length} actions</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* ─── All Stage Sections ─── */}
      <section id="actions" className="mx-auto max-w-5xl px-4 pb-16 space-y-16">
        {stages.map((stage, i) => (
          <StageSection key={stage.id} stage={stage} index={i} />
        ))}
      </section>

      {/* ─── Software Summary ─── */}
      <section id="software" className="border-t border-gray-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 flex items-center gap-2">
            <BriefcaseBusiness className="h-6 w-6 text-brand-500" />
            <h2 className="text-2xl font-bold text-gray-900">Software Solutions Summary</h2>
          </div>
          <p className="mb-10 text-gray-500">Every tool mentioned above, organized by price tier.</p>

          <div className="space-y-8">
            {softwareTiers.map(tier => {
              const Icon = tier.icon;
              return (
                <div key={tier.name} className={`rounded-2xl border p-6 ${tier.color}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6" />
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {tier.tools.map(tool => (
                      <ToolCard key={tool.name} tool={tool} isCustom={tier.name === 'Custom-Built Solutions'} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Advertising Summary ─── */}
      <section id="advertising" className="border-t border-gray-200 bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-brand-500" />
            <h2 className="text-2xl font-bold text-gray-900">Recruitment Advertising Guide</h2>
          </div>
          <p className="mb-10 text-gray-500">Where to post, what it costs, and how well it works for hiring movers in Austin.</p>

          <div className="space-y-8">
            {adCategories.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.name} className={`rounded-2xl border p-6 ${cat.color}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6 text-gray-700" />
                    <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                  </div>
                  <div className="space-y-3">
                    {cat.methods.map(m => (
                      <div key={m.method} className="rounded-xl bg-white/80 p-4">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span>{effectivenessIcon(m.effectiveness)}</span>
                          <span className="font-semibold text-gray-900">{m.method}</span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{m.cost}</span>
                        </div>
                        <p className="text-sm text-gray-600">{m.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Cost Calculator ─── */}
      <CostCalculator />

      {/* ─── CTA ─── */}
      <section className="bg-brand-700 px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to solve your hiring problem?</h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-200">
          Check out the solutions catalog for software tools I can build for your business, or explore the interactive demo to see them in action.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-semibold text-brand-700 shadow-lg hover:scale-105 transition-transform"
          >
            Solutions Catalog <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Interactive Demo <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-400">
        <p>Hiring Guide — Built for Barton Springs Moving</p>
        <p className="mt-1">Custom software solutions by a developer who uses AI tools to build faster and cheaper.</p>
      </footer>
    </div>
  );
}
