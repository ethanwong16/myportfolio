/* ============================================================
   case-study-collapsible-sample-content.js — dummy content,
   structured the way a real case study in this shape will be.
   Swap the strings, keep the shape, and
   case-study-collapsible-render.js does the rest.
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
      { label: 'Prototype', href: '#' }
    ]
  },

  sections: [
    {
      id: 'problem-space',
      title: 'Problem Space',
      infographic: {
        // no src yet — renders the dashed placeholder frame
        caption: 'Placeholder caption — one line naming what this infographic maps (e.g. drop-off by funnel step).'
      },
      expand: {
        body: [
          'Placeholder paragraph describing the state of the product before this work started — what existed, who used it, and why it mattered enough to invest in.',
          'Placeholder paragraph naming the actual problem: a metric that was underperforming, a workflow breaking down, or a gap between what users needed and what the product offered.',
          {
            note: 'Why this problem, and not the others on the roadmap',
            body: 'Placeholder reasoning for prioritization — the tradeoff considered against other candidates, and the signal that tipped it to the top.'
          }
        ]
      }
    },
    {
      id: 'user-needs-goals',
      title: 'User Needs → Product Goals',
      navLabel: 'User Needs → Goals',
      infographic: {
        caption: 'Placeholder caption — the needs-to-goals map this infographic traces.'
      },
      expand: {
        body: [
          'Placeholder framing sentence introducing the user types this work needed to serve, and how their needs pulled in different directions.'
        ],
        personas: [
          {
            name: 'The First-Timer',
            role: 'New supply-side user, low trust',
            quote: 'Placeholder quote capturing this persona’s hesitation in their own voice.',
            needs: ['Placeholder need — clarity on what happens next', 'Placeholder need — a fast path to first value']
          },
          {
            name: 'The Power User',
            role: 'Returning demand-side user, high volume',
            quote: 'Placeholder quote capturing impatience with anything that slows down a repeat action.',
            needs: ['Placeholder need — speed over hand-holding', 'Placeholder need — visibility into status at a glance']
          }
        ],
        goals: [
          { label: 'Placeholder goal — reduce drop-off in the first session', detail: 'Placeholder detail on how this was measured and the target threshold.' },
          { label: 'Placeholder goal — shorten time-to-first-value', detail: 'Placeholder detail on the baseline and the target.' }
        ]
      }
    },
    {
      id: 'solution-decisioning',
      title: 'Solution & Decisioning',
      infographic: {
        caption: 'Placeholder caption — the decision path this infographic visualizes.'
      },
      expand: {
        body: [
          'Placeholder paragraph on what was decided and why, in plain terms.',
          {
            note: 'Options considered',
            body: 'Placeholder explanation of an alternate approach seriously considered and rejected, and why.'
          }
        ]
      }
    },
    {
      id: 'outcomes',
      title: 'Outcomes',
      infographic: {
        caption: 'Placeholder caption — the result this infographic highlights.'
      },
      expand: {
        body: [
          'Placeholder paragraph on what shipped, when, and to whom — a short recap before the numbers.'
        ],
        metrics: [
          { value: '+00%', label: 'Placeholder metric — e.g., first-session activation' },
          { value: '-00%', label: 'Placeholder metric — e.g., time to first value' },
          { value: '00K', label: 'Placeholder metric — e.g., users reached at rollout' }
        ]
      }
    },
    {
      // blank for now, by design
      id: 'appendix',
      title: 'Appendix'
    }
  ],

  footer: {
    line: 'Placeholder line inviting the reader to see more of the work, or reach out directly.',
    email: 'ewong0116@gmail.com',
    links: [
      { label: 'Back to work', href: '../index.html#work' }
    ]
  }
};
