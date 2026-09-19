/* ============================================================
   case-study-content.template.js — copy this, fill it in, done.

   HOW TO ADD A NEW CASE STUDY (3 steps, no template edits):

   1. Copy this file to assets/case-study-<slug>-content.js and
      fill in the placeholders below.
   2. Copy case-studies/sample-case-study.html to
      case-studies/<slug>.html, and change its one <script src="...">
      line to point at your new content file.
   3. Update the "Next case study" link in whichever case study
      should point at this one (see `footer.links` at the bottom).

   That's the whole process — case-study.css and case-study-render.js
   read whatever shape this object is, so nothing else needs to
   change per case study.

   FIELD REFERENCE

   Every section is optional except `id` and `title` — a section
   with none of body/personas/goals/phases/deepdive/metrics/stack
   just renders an empty heading, so only include the shape a given
   section actually needs. Sections render in array order and are
   auto-numbered (01, 02, ...) from that order.

   "body" blocks — used by the top-level section, and by the
   `deepdive` block — accept a mix of three shapes in one array:
     - a plain string                      → a paragraph
     - { quote: '...', cite: '...' }       → a pull-quote (cite optional)
     - { note: 'summary', body: '...' }    → an expandable annotation,
       rendered right after the block before it. This is where
       "why I made this call" reasoning goes — it's meant to be used
       liberally, wherever a decision needs more context than the
       main paragraph should carry.
   ============================================================ */

// TODO: add a redaction note or warning?

window.CASE_STUDY = {
  meta: {
    title: 'Optimizing For AI Search Agents - Structured Markup',           // case study title — also becomes the <title>
    // TODO: IMPROVE
    summary: 'A case study on structured markup product strategy & execution.  Unlocks rich semantic context for agentic search systems',         // 1-2 sentence hook, shown under the title
    tags: ['0→1', 'AI Search', 'SEO/GEO'],             // e.g. ['Strategy', '0→1', 'AI/ML'] — short, plural-free
    facts: [
      // any 2-6 label/value pairs; Role/Team/Timeframe/Company is
      // the default set but not required
      // { label: 'Role', value: '' },
      { label: 'Role', value: 'Product Owner & Engineering Lead' },
      { label: 'Team', value: '2 eng · 1 data' },
      { label: 'Timeframe', value: 'Q3 – Q4 2025' },
      { label: 'Company', value: 'Zillow' }
    ],
    links: [
      // optional external artifacts — omit entirely if none
      // { label: 'Prototype', href: '' },
      // TODO: link to Google search on Zillow's markup?
      // TODO; link to industry blogs / context on structured markup?
      // TODO: link to AI search strategy for more context?
    ]
  },

  sections: [
    // Reorder, remove, or add sections freely — the array order is
    // the page order and the TOC order. `id` must be unique and
    // URL-safe (used as the #anchor). `navLabel` is optional; falls
    // back to `title` if omitted — use it when the title is too
    // long to sit in the sidebar nav.

    {
      id: 'context',
      title: 'Context & problem space',
      body: [
        // '...',
        // { note: 'Why this problem, and not the others', body: '...' }
        {
          note: 'Structured markup unlocks easy Zillow data ingestion for AI search bots and has powerful semantic expression capabilities',
          body: 'At its core, search for Zillow is still about getting users to the right answers, listings, and tools that unlock the door to their home.  In AI search systems, we can do this by leveraging structured markup to represent data in a standardized way, provide direct answers to "what is" queries, and clarify page content entities / their relationships.'
        },
        'In agentic search systems, search mechanics become more nuanced and complex thanks to large language models and refined agents built on top of them.',
        'Users have supercharged means of expressing themselves, and it is up to AI search systems to translate context into the perfect answer.',
        'Now users can go multi-modal with images, voice recordings, past conversation context, your emails, you name it.  And agents have the means to extract out the subtleties of your preferences.',
        'But this is all limited by how deeply agentic search systems can dive into and leverage the rich set of listings, advice, subject matter experts, and tools that Zillow web surfaces display.',
        'Search bots need standardized, reliable ways of ingesting site data to build knowledge graphs for LLMs and map your particular content to longer-tail user queries.'
      ]
    },

    {
      id: 'personas',
      title: 'Who this is for',
      navLabel: 'Personas & scenarios',
      body: [ /* optional framing paragraph(s) before the persona cards */
      {
        note: 'Bot proxy "users" are central to the web search space!',
        body: 'The search engine space is especially fun and challenging because you have a proxy "user".  Both bots that crawl your site and the blackbox search engine it feeds are the "users" your site needs to optimize for in order to reach your actual end users.'
      },
     ],
     // TODO: flesh out more
      personas: [
        // { name: '', role: '', quote: '', needs: ['', ''] }
        // `quote` and `needs` are both optional
        {
          name: 'Claude the Chosen AI Search Agent',
          role: 'Returning demand-side user, high volume',
          quote: 'Placeholder quote capturing impatience with anything that slows down a repeat action.',
          needs: ['Placeholder need — speed over hand-holding', 'Placeholder need — bulk / repeat actions', 'Placeholder need — visibility into status at a glance']
        },
        {
          name: 'Beth the Buyer',
          role: 'New supply-side user, low trust',
          quote: 'Placeholder quote capturing this persona’s hesitation or point of friction in their own voice.',
          needs: ['Placeholder need — clarity on what happens next', 'Placeholder need — reassurance before committing', 'Placeholder need — a fast path to first value']
        },
        {
          name: 'Rachel the Renter',
          role: 'Returning demand-side user, high volume',
          quote: 'Placeholder quote capturing impatience with anything that slows down a repeat action.',
          needs: ['Placeholder need — speed over hand-holding', 'Placeholder need — bulk / repeat actions', 'Placeholder need — visibility into status at a glance']
        },
        {
          name: 'Sebastian the Seller',
          role: 'Returning demand-side user, high volume',
          quote: 'Placeholder quote capturing impatience with anything that slows down a repeat action.',
          needs: ['Placeholder need — speed over hand-holding', 'Placeholder need — bulk / repeat actions', 'Placeholder need — visibility into status at a glance']
        }
      ]
    },

    {
      id: 'goals',
      title: 'Goals',
      body: [ /* optional framing paragraph(s) */ ],
      goals: [
        // { label: '', detail: '' }  — `detail` optional
      ]
    },

    {
      id: 'funnel',
      title: 'From user needs to requirements',
      navLabel: 'Requirements funnel',
      body: [
        'Every requirement below traces back to something a person wanted. This maps that chain end to end: a user need creates a bot need, bot needs name the decision category, each category fans out into the options that were on the table, and exactly one of them ships.',
        'Click any column to open the full reasoning for that stage.'
      ],
      /* renders window.CS_FUNNELS.zsm — see assets/funnel-data-zsm.js.
         Needs case-study-funnel.css + .js loaded on the page. */
      funnel: 'zsm'
    },

    {
      id: 'strategy',
      title: 'Strategy & roadmap',
      body: [
        'Three phases, each one a step up from the last: ship the markup itself, then build the guardrails to trust it at scale, then invest in the tooling that collapses the whole authoring lifecycle from weeks to days.'
      ],
      phases: [
        {
          tag: 'Phase 1 — MVP',
          title: 'Enhanced structured markup, rolled out across core listing pages',
          icon: 'tag',
          highlights: ['Feature-flagged rollout', 'FS/FR coverage'],
          body: 'Target the highest-traffic pages first, based on traditional search hit patterns. Expose full property details on detail pages, and the key details overview on search results pages. Ship gated behind feature flags for a controlled rollout, covering FS/FR search results and listing detail pages.',
          bullets: [
            'Schema quality metrics + detail coverage metrics',
            'No traffic or performance degradation',
            'AI search sentiment + eval results'
          ]
        },
        {
          tag: 'Phase 2 — Guardrails & Quality Control',
          title: 'A test system to shepherd quality standards at scale',
          icon: 'shield',
          highlights: ['Model eval scorecard', 'Distributable consultant agent'],
          body: 'Stand up evaluations that check what a model can actually extract and answer about listing details, then compile those eval results plus SEO standards into a concrete scorecard. Bundle the evals, key issue debugs, and advisory knowledge into a distributable SEO consultant agent / plugin.',
          bullets: [
            'Model eval criteria: extracted / perceived model details, question-answerability on listing details',
            'Outcome: degradations and violations get caught, not missed'
          ]
        },
        {
          tag: 'Phase 3 — Rapid Iteration & Experimentation',
          title: 'Infrastructure for a faster SDLC, without losing the review gates',
          icon: 'loop',
          highlights: ['Centralized schema repo', 'Auto ingestion dispatcher'],
          body: 'Solve for the complexity of mapping user research into tangible technical schema requirements, and align that same schema across different teams’ codebases and templated page variants.',
          bullets: [
            'Centralized structured markup repo — one schema definition, shared tooling, build once / reuse anywhere',
            'Schema playground — PMs self-serve, playing with and visualizing schema with no engineering effort',
            'Schema build agents / skills — natural language in, structured markup schema out, for PMs and devs alike',
            'Auto schema dispatcher — once a schema is built, it auto-attempts ingestion into subscribed codebases; devs just review instead of filing 5+ manual change requests'
          ]
        }
      ],
      landing: 'Outcome: what used to take 4–5 weeks end to end now takes 4–8 days.'
    },

    {
      id: 'workflow',
      title: 'Workflow diagrams',
      navLabel: 'Workflow diagrams',
      body: [
        'Two views into how the phases above actually run day to day.'
      ],
      /* renders window.CS_WORKFLOWS.zsm — see assets/workflow-data-zsm.js.
         Needs case-study-workflow.css + .js loaded on the page. */
      workflow: 'zsm'
    },

    {
      id: 'deepdive',
      title: 'Deep dive: from scattered HTML to a typed graph',
      navLabel: 'Feature deep dive',
      body: [
        'Two ways to look at the same change. Zoomed in, it’s a page-source problem: the facts a bot needs are scattered across a dozen HTML tags, in whatever format each tag happens to use. Zoomed out, it’s a graph problem: that scattering has no shared structure at all, so a bot has to reconstruct one from nothing.',
        'Consolidating both into a single, typed JSON-LD tree in <head> fixes both problems with one move — and the three things that improve are the same three things bots and agentic search systems actually need: semantic richness, structured topology, and rendering ease.'
      ],
      schemaViz: 'zsm'
    },

    {
      id: 'technical',
      title: 'Technical approach',
      body: [ /* system design, constraints, AI/ML approach if applicable */ ],
      stackLabel: 'Stack',   // optional, defaults to "Stack"
      stack: [ /* 'Python', 'Postgres', ... — short strings, rendered as chips */ ]
    },

    {
      id: 'outcomes',
      title: 'Outcomes & impact',
      body: [ /* optional recap before the numbers */ ],
      metrics: [
        { value: '94%', label: 'Consolidation of ~67 → ~4 JSON-LD nodes on FS SRPs, with a clearer reflection of list structure' },
        { value: '8x', label: 'More list-card coverage on FR SRPs, with inclusion of building page data + relaxed results' },
        { value: '6x', label: 'More semantic differentiation of housing types across listings — condos, land, room-for-rent, multi-family' },
        { value: '35%', label: 'Better heuristic scoring on AI visibility, per GPT prompt analysis of Zillow Seattle FS SRP markup' }
      ]
    },

    {
      id: 'reflection',
      title: 'Reflection',
      navLabel: 'Reflection & what’s next',
      body: [ /* what you'd do differently, what it set up next */ ]
    }
  ],

  footer: {
    line: '',                       // CTA line above the mailto
    email: 'ewong0116@gmail.com',
    links: [
      { label: 'Back to work', href: '../index.html#work' },
      { label: 'Previous: AI Search Strategy', href: 'ai-search-strategy.html' }
    ]
  }
};
