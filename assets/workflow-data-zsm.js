/* ============================================================
   workflow-data-zsm.js — data for the two workflow diagrams:
   `compare` (Milestone 3: before/after the rapid-iteration
   tooling) and `fullFlow` (Milestone 2: the eval system + SEO
   consultant agent watching production).

   `detail` strings on the highlighted "compare" steps (Playground,
   ZSM Repo, Dispatcher) are intentionally short placeholders —
   fill in with the real specifics of how each one works.
   ============================================================ */

window.CS_WORKFLOWS = window.CS_WORKFLOWS || {};
window.CS_WORKFLOWS.zsm = {

  compare: {
    eyebrow: 'Milestone 3 — Rapid Iteration & Experimentation',
    intro: 'The same schema-change request, run through both workflows. The playground, the centralized repo, and the auto-dispatcher are what collapsed weeks into days.',
    before: {
      tag: 'INITIAL',
      totalTime: '≈ 3.5–4.5 weeks total',
      segments: [
        {
          label: 'Spec & review',
          time: '3–5 days',
          steps: [
            { icon: 'pm', label: 'PM drafts a requirements spec' },
            { icon: 'dev', label: 'Dev reviews, translates it into schema vocabulary' }
          ]
        },
        {
          label: 'Build & patch',
          time: '2–4 weeks',
          steps: [
            { label: 'Build schema variant — FS' },
            { label: 'Build schema variant — FR' },
            { label: 'Build schema variant — Off-market' },
            { icon: 'dev', label: 'Manually patched into FS / FR / OM page code' }
          ]
        }
      ]
    },
    after: {
      tag: 'IMPROVED',
      totalTime: '≈ 4–8 days total',
      home: true,
      segments: [
        {
          label: 'Draft',
          time: '1–3 days',
          steps: [
            { icon: 'pm', label: 'PM' },
            {
              icon: 'spark', label: 'Playground', highlight: true,
              detail: 'Placeholder — what the playground actually lets a PM do: pick a page/property type, preview the generated schema live, no engineering ticket required.'
            },
            { label: 'Proposed schema' }
          ]
        },
        {
          label: 'Ship',
          time: '3–5 days',
          steps: [
            {
              icon: 'repo', label: 'ZSM Repo', highlight: true,
              detail: 'Placeholder — what centralizing in one repo unlocked: a single schema vocabulary, one test surface, versioned, build once and reuse across FS, FR, and OM variants.'
            },
            {
              icon: 'dispatch', label: 'Dispatcher', highlight: true,
              detail: 'Placeholder — how auto-dispatch works: watches the repo, opens a review-ready change against each subscribed codebase, devs approve instead of hand-authoring.'
            },
            { icon: 'dev', label: 'Devs review FS / FR / OM page code' }
          ]
        }
      ]
    }
  },

  fullFlow: {
    eyebrow: 'Milestone 2 — Guardrails & Quality Control',
    intro: 'What actually watches the rendered page in production: an eval system feeding a SEO consultant AI agent that catches degradations before they compound.',
    stages: [
      {
        title: 'Codebases',
        sub: 'FS / FR / OM page code',
        icon: 'dev'
      },
      {
        title: 'Rendered page',
        sub: 'User-optimized render · bot-optimized SSR',
        branch: {
          label: 'Consumed by',
          icons: [
            { icon: 'user', label: 'Users' },
            { icon: 'bot', label: 'Bots' },
            { icon: 'ai', label: 'AI search engines' }
          ]
        }
      },
      {
        title: 'Eval test system',
        sub: 'Fed by an automated search-bot crawl of page content and content analysis',
        highlight: true,
        pills: [
          'Bot renderability',
          'Performance',
          'Structured markup semantic evals',
          'Traditional SEO health checks — metadata, canonical tags, headers, footer elements'
        ]
      },
      {
        title: 'SEO Consultant AI Agent',
        sub: 'Scores and debugs what the eval system surfaces',
        icon: 'ai',
        highlight: true,
        pills: ['Debugging', 'Quality scoring']
      },
      {
        title: 'Back to PM & Devs',
        icons: [{ icon: 'pm', label: 'PM' }, { icon: 'dev', label: 'Dev' }],
        home: true,
        pills: ['Alarms on degradations / failures', 'Self-serve SEO consultations']
      }
    ]
  }
};
