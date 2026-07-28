/* Step-by-step playbooks for every hiring action.
   Keyed by HiringAction.id — rendered as an expandable checklist inside each ActionCard. */

export interface PlaybookStep {
  title: string;
  detail: string;
  tip?: string;
}

export const playbooks: Record<string, PlaybookStep[]> = {
  /* ─── Stage 1: Plan & Budget ─── */
  'plan-1': [
    { title: 'Pull last season\'s job counts', detail: 'Get jobs-per-month from SmartMoving (or your calendar) for the past 12 months. You\'re looking for the real shape of your year, not a guess.' },
    { title: 'Convert jobs to crew-hours', detail: 'Multiply jobs by average crew size and hours (a typical job = 3 movers × 5 hours). This gives monthly labor demand in hours.' },
    { title: 'Apply the Austin seasonal multiplier', detail: 'May–September runs roughly 1.5× your winter volume. Adjust each month\'s demand accordingly.', tip: 'If you only have partial data, use 15-20 jobs/month as the baseline and scale from there.' },
    { title: 'Compare demand to roster capacity', detail: 'Each full-time mover gives ~130 usable field hours/month. Divide demand by that to get required headcount per month.' },
    { title: 'Set the hiring number and deadline', detail: 'The gap between required and current headcount is your hiring target. Work backwards 4-6 weeks for sourcing and training time.' },
  ],
  'plan-2': [
    { title: 'Search Indeed for "mover" in Austin', detail: 'Note the pay on the first 10 active listings. This is your live market — not last year\'s survey data.' },
    { title: 'Write down the band', detail: 'Currently ~$15-22/hr for movers, $18-28/hr for drivers and crew leads. Log where each competitor sits.' },
    { title: 'Position at or above the median', detail: 'Being $1/hr above median costs ~$170/month per mover and measurably improves applicant quality and retention.' },
    { title: 'Define the raise ladder now', detail: 'E.g. +$1/hr at 6 months, +$1 at 12 months. Publishing it up front is a hiring pitch and a retention tool at once.' },
    { title: 'Recheck quarterly', detail: 'Set a calendar reminder. Austin\'s labor market moves fast — a rate that was competitive in March can lag by July.', tip: 'Glassdoor and the Indeed Salary Tool are free cross-checks.' },
  ],
  'plan-3': [
    { title: 'List the three core roles', detail: 'Mover (carry/load), Driver/Crew Lead (drives truck, runs the job, talks to the customer), Office/Dispatch (phones, scheduling, coordination).' },
    { title: 'Write one page per role', detail: 'Duties, physical requirements, license requirements, pay band, and who they report to. Keep it to bullets — this feeds job posts later.' },
    { title: 'Define the promotion criteria between roles', detail: 'What does a mover need to demonstrate to become a lead? Write it down so promotion feels earned, not arbitrary.' },
    { title: 'Share with current crew', detail: 'Your existing team should recognize themselves in these docs. Their corrections make the docs real.' },
  ],
  'plan-4': [
    { title: 'List every cost line per hire', detail: 'Job ads ($50-200/mo), background check ($25-50), drug test ($30-60), uniforms ($50-100), training hours (16-24 hrs at their rate).' },
    { title: 'Multiply by planned hires', detail: 'For 8-12 hires/year, this lands around $3,000-6,000 annually.' },
    { title: 'Add a 15% buffer', detail: 'No-shows, failed background checks, and early quits mean you\'ll screen more people than you hire.' },
    { title: 'Track actual spend per hire', detail: 'One spreadsheet row per hire with source and cost. In six months you\'ll know which channel gives the cheapest good hires.', tip: 'Cost-per-hire by channel is the single most useful hiring number you can collect.' },
  ],
  'plan-5': [
    { title: 'Map your 12-month demand curve', detail: 'From plan action 1. Mark ramp-up (March-April), peak (May-September), and trough (November-February).' },
    { title: 'Pick your staffing mix', detail: 'Choose between temp agency surge labor, permanent hires with reduced winter hours, or a part-timer bench. Most small movers blend all three.' },
    { title: 'Build the bench list', detail: 'Former employees, reliable part-timers, and good temps who\'d pick up shifts. Keep names and numbers in one place.' },
    { title: 'Schedule hiring to lead the curve', detail: 'Start recruiting in February to be trained by May. Peak-season hiring in June means paying agency rates for strangers.', tip: 'Plan winter conversations in September — surprise layoffs in November destroy the trust you need for spring rehires.' },
  ],

  /* ─── Stage 2: Recruit & Source ─── */
  'recruit-1': [
    { title: 'Pick the title deliberately', detail: '"Mover" gets more searches; "Moving Technician" filters for people who read carefully. Test both.' },
    { title: 'Include the five essentials', detail: 'Pay range, physical requirements (lift 75+ lbs), schedule reality (weekends), growth path (mover → lead → foreman), and what makes you different.' },
    { title: 'Keep it under 400 words', detail: 'Blue-collar applicants scan on phones. Bullets beat paragraphs; the pay range in the first three lines beats everything.' },
    { title: 'End with a one-step apply', detail: 'A short form or "text APPLY to this number" — every extra step loses half the applicants.', tip: 'Rewrite the post every few months; boards deprioritize stale listings.' },
  ],
  'recruit-2': [
    { title: 'Post free on Indeed first', detail: 'Organic listings get real traction for mover roles. Set it up once with a clean description and application questions.' },
    { title: 'Add sponsorship when urgent', detail: '$5-15/day gets 3-5x the applicants. Turn it on when you need someone within 2-3 weeks, off when you don\'t.' },
    { title: 'Cross-post to Craigslist and Facebook Jobs the same day', detail: 'Craigslist Austin ($25) still performs for moving labor. Facebook Jobs is free and one-tap-apply.' },
    { title: 'Ask every applicant where they found you', detail: 'One question on the form. This builds your cost-per-hire-by-channel data automatically.' },
  ],
  'recruit-3': [
    { title: 'Pick one platform to lead with', detail: 'Instagram or TikTok — whichever Matt will actually post to. Repurpose to the other later; don\'t try to be native everywhere.' },
    { title: 'Shoot move-day footage weekly', detail: 'Time-lapses, wrap jobs, crew banter. Raw phone footage outperforms polished content for showing what the job actually is.' },
    { title: 'Share to Austin job groups', detail: 'ATX Jobs, Austin Blue Collar Work, and neighborhood Facebook groups. Group posts reach active local job seekers for free.' },
    { title: 'Put the apply link everywhere', detail: 'Bio link, QR code in video end-cards, pinned comment. The content is the hook; the link is the funnel.' },
  ],
  'recruit-4': [
    { title: 'Set the bonus and the milestone', detail: '$100-250 paid when the referred hire hits 90 days. The delay filters for referrals people actually vouch for.' },
    { title: 'Announce it in the group chat', detail: 'One message: the amount, the rule, who to tell. Re-announce every time you\'re hiring.' },
    { title: 'Track referrals visibly', detail: 'A shared sheet or the dashboard: who referred whom, hire date, 90-day date, paid Y/N.' },
    { title: 'Pay publicly and promptly', detail: 'Hand over the bonus in front of the crew. One visible payout recruits harder than any job post.', tip: 'Referral hires stay roughly 2x longer than cold applicants — this is your best channel per dollar.' },
  ],
  'recruit-5': [
    { title: 'Register with Workforce Solutions Capital Area', detail: 'The free government job service actively matches candidates to physical-labor employers. One call to set up.' },
    { title: 'List openings on WorkInTexas.com', detail: 'Free state job board that feeds the same pipeline.' },
    { title: 'Contact ACC career services', detail: 'Community college students want flexible physical work that fits class schedules — a good part-timer bench source.' },
    { title: 'Revisit quarterly', detail: 'These channels are slow but free; a 15-minute quarterly check keeps you in their referral rotation.' },
  ],
  'recruit-6': [
    { title: 'Find the next three events', detail: 'Search Austin job fairs, community hiring events, and ACC career days. Moving companies almost never attend — you stand out by showing up.' },
    { title: 'Prep a booth kit', detail: 'Banner or sign, business cards, and a QR code straight to the application. Total cost under $100, reusable forever.' },
    { title: 'Collect numbers on the spot', detail: 'Don\'t hand out flyers and hope. Get name + phone into your sheet while they\'re standing there.' },
    { title: 'Follow up within 48 hours', detail: 'A text beats an email: "Good meeting you at the fair — want to do a paid ride-along this week?"' },
  ],
  'recruit-7': [
    { title: 'Order truck magnets first', detail: '"Now Hiring Movers — $18/hr" with a phone number. Your trucks cross Austin daily; this is a moving billboard for $50-200 one-time.' },
    { title: 'Put a yard sign at the warehouse', detail: '"Walk-ins welcome" converts neighborhood foot traffic. $50-150 one-time.' },
    { title: 'Flyer the right venues', detail: 'Gyms, laundromats, community boards. Low hit-rate but nearly free and reaches the exact demographic.' },
    { title: 'Refresh quarterly', detail: 'Faded signs and stale flyers signal a stale company. Replace them when they weather.' },
  ],
  'recruit-8': [
    { title: 'Stay visible in the industry', detail: 'Austin\'s moving world is small. Show up where operators and crews cross paths; be known as the good employer.' },
    { title: 'Keep your offer objectively better', detail: 'Movers jump companies for $1-2/hr and better treatment. Your pay ladder and culture ARE the recruiting pitch.' },
    { title: 'Never bad-mouth competitors', detail: 'It gets back to everyone. "We\'d love to have you if things change" is the whole script.' },
    { title: 'Keep a warm list', detail: 'Good movers you\'ve met who weren\'t ready to jump. Check in every few months — timing is everything.' },
  ],
  'recruit-9': [
    { title: 'Open the account before peak season', detail: 'Set up PeopleReady (or Labor Finders) in March, not during a July crisis. Same-day labor only works with an existing account.' },
    { title: 'Set a pairing rule', detail: 'Never more than one temp per two experienced crew members. Temps haven\'t had your training; your regulars carry the standard.' },
    { title: 'Rate every temp', detail: 'Both apps let you request specific workers back. Build a shortlist of good ones — that\'s your surge bench.' },
    { title: 'Convert the best', detail: 'A temp who shows up on time twice is a pre-screened hire. Buy-out fees are usually cheaper than a bad cold hire.', tip: 'Use agencies as a bridge, never a foundation — customers notice untrained crews.' },
  ],

  /* ─── Stage 3: Screen Applicants ─── */
  'screen-1': [
    { title: 'Check the four knockouts first', detail: 'Reliable transportation, valid license (for drivers), weekend availability, and physical capability. Any hard no ends the review in 30 seconds.' },
    { title: 'Score what remains', detail: 'Moving/labor experience, proximity to warehouse, start date. Green = call now, yellow = phone screen, red = pass.' },
    { title: 'Review within 24 hours', detail: 'Good movers get hired fast. A same-day callback beats a better offer made three days later.' },
    { title: 'Call greens immediately', detail: 'Phone, not email. The goal of the call is to schedule the working interview.', tip: 'Track applicants in one sheet: name, source, score, status, notes. That IS your applicant tracking system until you outgrow it.' },
  ],
  'screen-2': [
    { title: 'Use a fixed 5-question script', detail: 'Available to start when? Reliable transportation? Can you lift 75 lbs repeatedly? Weekends OK? Why this job? Same questions every time makes comparison possible.' },
    { title: 'Cap it at 5 minutes', detail: 'This call filters for working interviews; it doesn\'t evaluate character. Don\'t let it sprawl.' },
    { title: 'Schedule the working interview on the call', detail: 'If they pass, book the paid ride-along before hanging up. Every callback loop loses candidates.' },
    { title: 'Log the answers', detail: 'Two lines in your tracker. You will not remember caller #4 by Friday.' },
  ],
  'screen-3': [
    { title: 'Get written consent', detail: 'FCRA requires signed authorization before running a background check. Checkr and GoodHire handle the consent flow for you.' },
    { title: 'Order the right depth', detail: 'County criminal + sex offender registry is the standard for household movers ($25-50). National databases alone miss county records.' },
    { title: 'Review findings consistently', detail: 'Decide your policy up front (what disqualifies, what doesn\'t, how far back) and apply it identically to everyone.' },
    { title: 'Document the decision', detail: 'If you reject based on findings, FCRA requires an adverse-action notice — the check services automate this.', tip: 'Customers ask "are your crews background-checked?" — being able to say yes is marketing, not just compliance.' },
  ],
  'screen-4': [
    { title: 'Pull the Texas DPS record', detail: '$6.50 online per driver. Takes minutes.' },
    { title: 'Screen for the deal-breakers', detail: 'DUIs, suspensions, and excessive violations. Your insurer likely has hard rules — know them before you promise anyone a driving role.' },
    { title: 'Share with your insurance agent', detail: 'Adding an unapproved driver to a claim situation is a catastrophic surprise. Clear drivers before they touch a truck.' },
    { title: 'Re-run annually', detail: 'Licenses get suspended mid-employment. A yearly re-check per driver is cheap insurance.' },
  ],
  'screen-5': [
    { title: 'Decide the policy scope', detail: 'DOT requires testing for CDL drivers. For non-CDL movers it\'s your call — many companies test pre-employment only.' },
    { title: 'Set up a lab account', detail: 'Quest or LabCorp, $30-60 per 5-panel test. An account means you just send candidates with a form.' },
    { title: 'Standardize the timing', detail: 'Same point in the process for everyone — typically after the offer, before day one. Consistency is the legal protection.' },
  ],
  'screen-6': [
    { title: 'Complete the I-9 within 3 days of hire', detail: 'Federal requirement, no exceptions. The new hire brings ID documents; you verify and record them in person.' },
    { title: 'Run E-Verify', detail: 'Free federal system, results in seconds. Voluntary in Texas but standard practice — penalties for I-9 violations run $252-2,507 each.' },
    { title: 'Store I-9s separately', detail: 'Keep them in their own folder (paper or digital), not in personnel files — that\'s what an auditor asks for first.', tip: 'Gusto handles I-9 collection digitally as part of onboarding.' },
  ],
  'screen-7': [
    { title: 'Call two previous employers', detail: 'Actual phone calls. Texts and emails get ignored; a 5-minute call gets the truth.' },
    { title: 'Ask the three questions', detail: 'Did they show up on time? Did they hustle or hide? Were they good with customers? Listen for hesitation as much as words.' },
    { title: 'Log the answers', detail: 'Two lines per call in the tracker. Patterns across references matter more than any single answer.' },
  ],

  /* ─── Stage 4: Interview ─── */
  'interview-1': [
    { title: 'Book them on a real move', detail: 'Half-day ride-along on an actual job, paid. This is the single best predictor you have — treat it as the real interview.' },
    { title: 'Pay them properly', detail: 'Working interview hours are paid hours. It\'s legally cleaner and it signals you\'re a legitimate operation.' },
    { title: 'Brief the crew lead', detail: 'Tell the lead what to watch: effort without being asked, care with items, how they take direction, customer interactions, heat tolerance.' },
    { title: 'Debrief the same day', detail: 'Five minutes with the crew lead while it\'s fresh. Hire/no-hire gut call plus specifics.', tip: 'If the crew says "we\'d work with them again," that\'s the whole signal.' },
  ],
  'interview-2': [
    { title: 'Pick three scenarios from the bank', detail: '"Customer says you scratched their table." "It\'s 105° with three rooms left." "Your lead says skip wrapping the furniture." Judgment shows fast.' },
    { title: 'Ask during ride-along downtime', detail: 'Truck cab between stops beats a conference room. Guard is down; answers are honest.' },
    { title: 'Score 1-5 against what good looks like', detail: 'Write the ideal answer for each scenario once, then score everyone against it. Gut feel becomes comparable data.' },
  ],
  'interview-3': [
    { title: 'State the physical bar up front', detail: '75+ lbs repeatedly, stairs with furniture, 8-10 hour days in Texas heat. Said clearly at the phone screen, it self-selects.' },
    { title: 'Watch the real test', detail: 'The working interview IS the fitness test: stair carries, dresser lifts, sustained pace. No gym assessment needed.' },
    { title: 'Note heat response specifically', detail: 'Summer washouts are dangerous and expensive. Watch hydration habits and pacing on a hot day before committing.' },
  ],
  'interview-4': [
    { title: 'Get the crew\'s read', detail: 'After the ride-along, ask the crew privately. They know within hours if someone fits.' },
    { title: 'Watch customer moments', detail: 'How they greet, whether they\'re careful in the home, how they react to being watched. Movers are your brand inside someone\'s house.' },
    { title: 'Apply the one-bad-apple rule', detail: 'A strong back with a bad attitude costs more than a weak back with a great one. Attitude ruins crews and reviews; strength can be trained.' },
  ],
  'interview-5': [
    { title: 'Call within 24 hours of the working interview', detail: 'Good candidates have other offers pending. Speed wins.' },
    { title: 'Put the terms in writing', detail: 'Rate, schedule expectations, weekend requirement, probation period (30-90 days), start date. A text or one-page letter is fine — verbal-only is how disputes start.' },
    { title: 'Be transparent about tips', detail: 'Austin movers average $20-50/day in tips. Saying so honestly sweetens the offer at zero cost.' },
    { title: 'Get acknowledgment', detail: 'A reply text saying "confirmed for Monday" closes the loop and cuts day-one no-shows.' },
  ],

  /* ─── Stage 5: Hire & Paperwork ─── */
  'paper-1': [
    { title: 'Send the packet before day one', detail: 'W-4, I-9 info, direct deposit, emergency contact, policy acknowledgment. Digital (Gusto or a form) beats paper that gets lost.' },
    { title: 'Verify I-9 documents in person', detail: 'The law requires physically examining their ID documents within 3 days of the start date.' },
    { title: 'Get the policy acknowledgment signed', detail: 'Damage protocol, no-show consequences, dress code, tip policy. Signed acknowledgment is what makes discipline enforceable later.' },
  ],
  'paper-2': [
    { title: 'Issue the kit', detail: 'Shirts, gloves, anything else you provide. Record sizes while you\'re at it.' },
    { title: 'Log what went out', detail: 'One line per item per person. Memory fails exactly when someone quits with two shirts.' },
    { title: 'State the return policy', detail: 'Deduct-from-final-check or return-on-exit — either way, say it at issue time, in the signed policy doc.' },
  ],
  'paper-3': [
    { title: 'Add to payroll before the first shift', detail: 'Rate, schedule, tax info, direct deposit in Gusto/Square/QuickBooks. Day-one pay problems are a terrible first impression.' },
    { title: 'Confirm W-2 classification', detail: 'Movers are employees, not 1099 contractors. Misclassification penalties are severe and the state actively looks for it in this industry.' },
    { title: 'Set the pay schedule expectation', detail: 'Tell them exactly when the first check lands. Uncertainty about the first paycheck is a top reason new hires ghost.' },
  ],
  'paper-4': [
    { title: 'Notify your workers\' comp carrier day one', detail: 'An uninsured injury on a new hire\'s first week is an existential event for a small mover. Same-day notification, every hire.' },
    { title: 'Add drivers to the auto policy before they drive', detail: 'Cross-check with the MVR results. Nobody drives a truck until the insurer confirms.' },
    { title: 'Calendar the renewals', detail: 'Certificates lapse quietly. One calendar reminder per policy renewal date.' },
  ],
  'paper-5': [
    { title: 'Add to all systems at once', detail: 'Scheduling app, time clock, group chat, any customer-facing tools. Do it in one sitting from a checklist so nothing\'s missed.' },
    { title: 'Send the day-one essentials text', detail: 'Warehouse address, start time, who to ask for, what to wear, what to bring. Kills 90% of first-day confusion.' },
  ],

  /* ─── Stage 6: Onboard & Train ─── */
  'onboard-1': [
    { title: 'Teach the core sequence in order', detail: 'Wrapping and padding → loading order (heavy low, fragile high) → weight distribution → two-person stair carries → disassembly/reassembly.' },
    { title: 'Demonstrate, then have them do it', detail: 'Watching a blanket wrap isn\'t knowing it. Each skill gets demonstrated once, then performed under supervision.' },
    { title: 'Sign off each skill on a checklist', detail: 'Crew lead initials per skill. "Trained" becomes a fact with a date instead of a feeling.', tip: 'Film your best mover doing each technique once — a phone video library becomes your permanent training material.' },
  ],
  'onboard-2': [
    { title: 'Teach the greeting script', detail: '"Hi, I\'m [name] with Barton Springs Moving." Rehearsed once out loud beats told-about twice.' },
    { title: 'Cover the hard conversations', detail: 'Communicating delays, responding to damage on-site, handling a frustrated customer. Give them the exact words.' },
    { title: 'Teach property protection', detail: 'Floor runners, door-frame padding, banister wrap. Visible care is what 5-star reviews actually describe.' },
    { title: 'Train the review ask', detail: 'End-of-job script: "If we did a good job today, a Google review with our names in it means a lot." Reviews that name movers feed the bonus system.' },
  ],
  'onboard-3': [
    { title: 'Run heat training first', detail: 'Hydration schedule, mandatory shade breaks, recognizing heat exhaustion vs heat stroke in yourself and teammates. In Austin this is the safety training that saves lives.' },
    { title: 'Teach lifting mechanics', detail: 'Legs not back, team lifts over hero lifts, when to use the dolly instead. One back injury costs more than every hour of this training.' },
    { title: 'Document everything', detail: 'Date, topics, attendee signatures. OSHA requires documented training, and documentation is your defense after any incident.' },
  ],
  'onboard-4': [
    { title: 'Write the one-page handbook', detail: 'Clock in/out, dispatch communication, tip handling, damage protocol, dress code. One page they\'ll read beats twenty they won\'t.' },
    { title: 'Walk it verbally on day one', detail: 'Five minutes over coffee. The handback is the reference; the conversation is the training.' },
    { title: 'Get a signature', detail: 'Same acknowledgment doc as the policy packet — it closes the "nobody told me" gap.' },
  ],
  'onboard-5': [
    { title: 'Day 1: observe', detail: 'Watch and assist only. No pressure, no point work. They\'re learning your rhythm.' },
    { title: 'Day 2: assist actively', detail: 'Hands on everything with guidance. Crew lead corrects in the moment.' },
    { title: 'Day 3: take point on simple tasks', detail: 'Let them lead boxes and light furniture. Lead watches capability, not just effort.' },
    { title: 'Crew lead reports readiness', detail: 'A one-line verdict: ready for regular crew work, needs another shadow day, or not a fit. Decide, don\'t drift.' },
  ],
  'onboard-6': [
    { title: 'Train ramp and equipment', detail: 'Loading ramp operation, dollies, hand trucks, straps, sliders. Twenty minutes at the warehouse before their first solo load.' },
    { title: 'Teach pre-trip inspection', detail: 'Tires, lights, ramp, straps — a 5-minute checklist per truck per day. Catches problems before they\'re roadside.' },
    { title: 'Cover truck driving separately', detail: 'For drivers only: box-truck handling, clearances, backing with a spotter, fuel card use. Confirmed against the MVR and insurance list.' },
  ],
  'onboard-7': [
    { title: 'Set the probation window', detail: '30-90 days stated in the offer. Everyone knows the checkpoint exists from day one.' },
    { title: 'Check in on a schedule', detail: 'Week 1: daily two-minute check. Weeks 2-4: weekly. Months 2-3: biweekly. Short and predictable beats long and random.' },
    { title: 'Measure against three goals', detail: 'On-time rate, zero preventable damage, positive crew/customer feedback. Concrete beats vibes.' },
    { title: 'Decide at the end — actually decide', detail: 'Keep, extend probation with specific fixes, or cut. The expensive failure mode is letting mediocrity drift into permanence.' },
  ],

  /* ─── Stage 7: Retain & Grow ─── */
  'retain-1': [
    { title: 'Check the market quarterly', detail: 'Ten minutes on Indeed: what are Austin movers being offered today? Log it.' },
    { title: 'Run the raise ladder automatically', detail: '+$1/hr at 6 months, +$1 at 12 — on schedule, without being asked. Raises that must be begged for build resentment instead of loyalty.' },
    { title: 'Communicate raises proactively', detail: '"You hit 6 months, your rate is now $19" — a message that costs nothing and lands better than the money itself.', tip: 'If a competitor posts $19/hr and you\'re at $16, you\'re not saving $3 — you\'re funding their recruiting.' },
  ],
  'retain-2': [
    { title: 'Define 3-4 bonus types', detail: 'Named in a 5-star review ($15-25), zero-damage month ($50), perfect attendance ($25), referral at 90 days ($100-250). Clear triggers, fixed amounts.' },
    { title: 'Track eligibility monthly', detail: 'From reviews, attendance records, and damage logs. The custom dashboard automates this; a spreadsheet works day one.' },
    { title: 'Pay visibly', detail: 'Announce bonuses in the group chat or at the crew meal. Recognition is half the value of the money.' },
  ],
  'retain-3': [
    { title: 'Publish the ladder', detail: 'Mover ($16-18) → Lead Mover ($18-20) → Crew Lead ($20-24) → Foreman ($24-28) → Ops Manager (salary). On the wall and in onboarding.' },
    { title: 'Attach criteria to each rung', detail: 'What specifically earns the promotion — skills signed off, months served, zero incidents, crew feedback. Earned, not granted.' },
    { title: 'Promote from within, loudly', detail: 'Every internal promotion is proof the ladder is real. That proof retains everyone else.' },
  ],
  'retain-4': [
    { title: 'Enable shift swaps', detail: 'Crew members trade shifts without calling you (Homebase does this). Flexibility they control is retention you don\'t pay for.' },
    { title: 'Honor stated availability', detail: 'School schedules, second jobs, family commitments — take them at hiring and actually respect them.' },
    { title: 'Offer 4-day weeks off-season', detail: 'November-February demand drop becomes a perk instead of a layoff.' },
  ],
  'retain-5': [
    { title: 'Feed the crew monthly', detail: 'Friday lunch or end-of-month barbecue. Cheapest culture investment there is.' },
    { title: 'Run Mover of the Month', detail: '$50 gift card plus real recognition, chosen on the metrics you already track.' },
    { title: 'Mark the personal stuff', detail: 'Birthdays and work anniversaries in the group chat. People stay where they\'re seen.' },
  ],
  'retain-6': [
    { title: 'Book monthly 15-minute 1-on-1s', detail: 'Per crew member, on the calendar, actually held. Consistency matters more than depth.' },
    { title: 'Ask the same four questions', detail: 'How\'s it going? Any crew issues? Equipment complaints? What would make this job better?' },
    { title: 'Act on one thing each round', detail: 'Fix one raised issue visibly and say where it came from. That\'s what makes people keep telling you the truth.', tip: 'These check-ins catch resignations 4-6 weeks before they happen — that\'s the window to save someone.' },
  ],
  'retain-7': [
    { title: 'Start with PTO after 90 days', detail: 'Even 3-5 paid days puts you ahead of most small movers in Austin.' },
    { title: 'Add cheap high-signal perks', detail: 'Boot/tool allowance ($100/yr), gas cards for drivers, gym discounts. Small dollars, outsized "they care" signal.' },
    { title: 'Price health insurance annually', detail: 'Out of reach now isn\'t out of reach forever — Gusto can quote group plans yearly as you grow.' },
  ],

  /* ─── Stage 8: Manage & Offboard ─── */
  'manage-1': [
    { title: 'Pick five metrics, no more', detail: 'Jobs completed, 5-star reviews by name, on-time rate, damage incidents, attendance. Five you\'ll actually maintain beat fifteen you won\'t.' },
    { title: 'Log weekly, review monthly', detail: 'Crew leads report incidents as they happen; you spend 20 minutes a month on the rollup.' },
    { title: 'Share scores with the crew', detail: 'People improve what they can see. The metrics also feed bonuses and promotions — one dataset, three uses.' },
  ],
  'manage-2': [
    { title: 'Follow the progression', detail: 'Verbal warning → written warning → suspension → termination. Skipping steps is how wrongful-termination claims get traction.' },
    { title: 'Document even verbal warnings', detail: 'Date, issue, what was said — two lines in the file. Undocumented warnings didn\'t happen, legally speaking.' },
    { title: 'Be specific and behavioral', detail: '"Late three times this month: 6/2, 6/9, 6/23" — not "bad attitude." Specifics can be fixed and defended.' },
  ],
  'manage-3': [
    { title: 'Build the backup list before you need it', detail: 'Part-timers, former employees, vetted temps — names and numbers ready. A no-show at 7am is not the time to start.' },
    { title: 'Set the morning protocol', detail: 'No-show at 15 minutes → group text goes out → first responder gets the shift. Practiced once, it runs itself.' },
    { title: 'Track no-show patterns', detail: 'Feed attendance into the discipline process. One is an accident; three is a decision.', tip: 'A single no-show on move day costs ~$1,800 in delayed jobs and a likely bad review.' },
  ],
  'manage-4': [
    { title: 'Plan in September', detail: 'Winter is predictable; surprise layoffs are a choice. Model November-February staffing before October.' },
    { title: 'Offer reduced hours first', detail: '2-3 days/week keeps your trained people attached and paid something. Most prefer it to a layoff.' },
    { title: 'Communicate early and honestly', detail: '"Here\'s what winter looks like, here\'s the plan, here\'s your spring guarantee." Trust in November is your April roster.' },
    { title: 'Keep the rehire list warm', detail: 'Anyone laid off gets first call in spring — and a check-in text in February.' },
  ],
  'manage-5': [
    { title: 'Know the final-check law', detail: 'Texas: involuntary termination → final pay within 6 calendar days; resignation → next regular payday.' },
    { title: 'Run the exit checklist', detail: 'Collect equipment, remove from scheduling/chat/payroll/systems, document the reason in the file.' },
    { title: 'Stay professional regardless', detail: 'Austin\'s moving industry is a small town. Today\'s terminated mover is tomorrow\'s competitor\'s crew lead telling stories about you.' },
  ],
  'manage-6': [
    { title: 'Send a 5-question form', detail: 'Why are you leaving? What would have kept you? How was the culture? Would you recommend working here? Anything else? Google Form, 10 minutes to build.' },
    { title: 'Offer a conversation too', detail: 'Some people will tell you the real reason out loud but never in writing.' },
    { title: 'Review for patterns quarterly', detail: 'One departure is noise. The same reason three times is a fixable leak in your retention.' },
  ],
};
