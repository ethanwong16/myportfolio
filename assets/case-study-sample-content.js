/* ============================================================
   case-study-sample-content.js — dummy content, structured the
   way a real case study will be. Swap the strings, keep the
   shape, and case-study-render.js does the rest.
   ============================================================ */

window.CASE_STUDY = {
  meta: {
    title: 'Rebuilding onboarding for a two-sided marketplace',
    summary: 'Placeholder summary — a one- or two-sentence framing of the problem, the bet, and the outcome, written for someone skimming the work feed before they click in.',
    tags: ['Strategy', '0→1', 'AI/ML'],
    facts: [
      { label: 'Role', value: 'Product Manager' },
      { label: 'Team', value: '2 eng · 1 design · 1 data' },
      { label: 'Timeframe', value: 'Q1 – Q3 2025' },
      { label: 'Company', value: 'Placeholder Co.' }
    ],
    links: [
      { label: 'Prototype', href: '#' },
      { label: 'PRD (excerpt)', href: '#' }
    ]
  },

  sections: [
    {
      id: 'context',
      title: 'Context & problem space',
      body: [
        'Placeholder paragraph describing the state of the product before this work started — what existed, who used it, and why it mattered enough to invest in. Two or three sentences of scene-setting, written plainly.',
        'Placeholder paragraph naming the actual problem: a metric that was underperforming, a workflow that was breaking down, or a gap between what users needed and what the product offered. This is the "why now."',
        {
          note: 'Why this problem, and not the others on the roadmap',
          body: 'Placeholder reasoning for prioritization — the tradeoff considered against other candidates, and the signal (data, qualitative feedback, a strategic bet) that tipped it to the top.'
        }
      ]
    },
    {
      id: 'personas',
      title: 'Who this is for',
      navLabel: 'Personas & scenarios',
      body: [
        'Placeholder framing sentence introducing the two or three user types this work needed to serve, and how their needs pulled in different directions.'
      ],
      personas: [
        {
          name: 'The First-Timer',
          role: 'New supply-side user, low trust',
          quote: 'Placeholder quote capturing this persona’s hesitation or point of friction in their own voice.',
          needs: ['Placeholder need — clarity on what happens next', 'Placeholder need — reassurance before committing', 'Placeholder need — a fast path to first value']
        },
        {
          name: 'The Power User',
          role: 'Returning demand-side user, high volume',
          quote: 'Placeholder quote capturing impatience with anything that slows down a repeat action.',
          needs: ['Placeholder need — speed over hand-holding', 'Placeholder need — bulk / repeat actions', 'Placeholder need — visibility into status at a glance']
        }
      ]
    },
    {
      id: 'goals',
      title: 'Goals',
      body: [
        'Placeholder sentence connecting the goals below back to a company or team-level objective, so they read as derived rather than arbitrary.'
      ],
      goals: [
        { label: 'Placeholder goal — reduce drop-off in the first session', detail: 'Placeholder detail on how this was measured and the target threshold.' },
        { label: 'Placeholder goal — shorten time-to-first-value', detail: 'Placeholder detail on the baseline and the target.' },
        { label: 'Placeholder goal — hold the line on trust & safety', detail: 'Placeholder detail on the guardrail metric that could not regress.' }
      ]
    },
    {
      id: 'strategy',
      title: 'Strategy & roadmap',
      body: [
        'Placeholder paragraph on the overall approach chosen — e.g., ship a thin end-to-end version first, validate with a subset of users, then widen. Explains the shape of the roadmap below, not just its contents.',
        {
          note: 'The option we didn’t take',
          body: 'Placeholder explanation of an alternate approach that was seriously considered and rejected, and why — the kind of context that usually only lives in a Slack thread.'
        }
      ],
      phases: [
        {
          tag: 'Phase 1 — Q1',
          title: 'Placeholder: prove the core loop',
          body: 'Placeholder description of the narrow slice shipped first and the hypothesis it was testing.',
          bullets: ['Placeholder scope item', 'Placeholder scope item', 'Placeholder success metric for the phase']
        },
        {
          tag: 'Phase 2 — Q2',
          title: 'Placeholder: widen to the full funnel',
          body: 'Placeholder description of what got added once the core loop was validated.',
          bullets: ['Placeholder scope item', 'Placeholder scope item']
        },
        {
          tag: 'Phase 3 — Q3',
          title: 'Placeholder: personalize & automate',
          body: 'Placeholder description of the AI/ML-driven layer added once the manual version was working.',
          bullets: ['Placeholder scope item', 'Placeholder scope item']
        }
      ]
    },
    {
      id: 'deepdive',
      title: 'Deep dive: the recommendation step',
      navLabel: 'Feature deep dive',
      body: [
        'Placeholder paragraph zooming into one specific feature from the roadmap above — the one worth walking through in detail because of its complexity or its impact.',
        'Placeholder paragraph on the UX decisions made for this feature specifically: what was shown, what was deferred, what was deliberately left out.'
      ],
      deepdive: {
        frameLabel: 'Screenshot / prototype frame placeholder',
        body: [
          'Placeholder caption-style paragraph describing what the image above would show and why that moment in the flow was chosen to highlight.',
          {
            note: 'Behind the interaction design',
            body: 'Placeholder reasoning for a specific UI decision — e.g., why a suggestion was inline instead of a modal, and the usability tradeoff that drove it.'
          }
        ]
      }
    },
    {
      id: 'technical',
      title: 'Technical approach',
      body: [
        'Placeholder paragraph on the system design: how data moved, what was built vs. bought, and any constraints (latency, cost, existing infra) that shaped the approach.',
        'Placeholder paragraph on the AI/ML component specifically — what model or technique was used, what data trained or grounded it, and how its output was evaluated before shipping.',
        {
          note: 'A constraint that changed the design',
          body: 'Placeholder note on a technical or org constraint discovered mid-build that forced a redesign, and how the team adapted.'
        }
      ],
      stackLabel: 'Stack',
      stack: ['Placeholder: Python', 'Placeholder: LLM API', 'Placeholder: Postgres', 'Placeholder: Feature flag service', 'Placeholder: A/B test framework']
    },
    {
      id: 'outcomes',
      title: 'Outcomes & impact',
      body: [
        'Placeholder paragraph on what shipped, when, and to whom — a short recap before the numbers.'
      ],
      metrics: [
        { value: '+00%', label: 'Placeholder metric — e.g., first-session activation' },
        { value: '-00%', label: 'Placeholder metric — e.g., time to first value' },
        { value: '00K', label: 'Placeholder metric — e.g., users reached at rollout' },
        { value: '00%', label: 'Placeholder metric — e.g., adoption of the new step' }
      ]
    },
    {
      id: 'reflection',
      title: 'Reflection',
      navLabel: 'Reflection & what’s next',
      body: [
        'Placeholder paragraph on what the team would do differently with hindsight — a real reflection, not a victory lap.',
        {
          note: 'What I’d change if I ran this again',
          body: 'Placeholder personal reflection distinct from the team-level retro above — the individual judgment call you’d revisit.'
        },
        'Placeholder paragraph on what this work set up for the next phase of the roadmap.'
      ]
    }
  ],

  footer: {
    line: 'Placeholder line inviting the reader to see more of the work, or reach out directly.',
    email: 'ewong0116@gmail.com',
    links: [
      { label: 'Back to work', href: '../index.html#work' },
      { label: 'Next case study', href: '#' }
    ]
  }
};
