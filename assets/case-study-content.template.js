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

window.CASE_STUDY = {
  meta: {
    title: '',           // case study title — also becomes the <title>
    summary: '',         // 1-2 sentence hook, shown under the title
    tags: [],             // e.g. ['Strategy', '0→1', 'AI/ML'] — short, plural-free
    facts: [
      // any 2-6 label/value pairs; Role/Team/Timeframe/Company is
      // the default set but not required
      // { label: 'Role', value: '' },
    ],
    links: [
      // optional external artifacts — omit entirely if none
      // { label: 'Prototype', href: '' },
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
      ]
    },

    {
      id: 'personas',
      title: 'Who this is for',
      navLabel: 'Personas & scenarios',
      body: [ /* optional framing paragraph(s) before the persona cards */ ],
      personas: [
        // { name: '', role: '', quote: '', needs: ['', ''] }
        // `quote` and `needs` are both optional
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
      id: 'strategy',
      title: 'Strategy & roadmap',
      // Renders as two pieces: an infographic road (icon + title +
      // a couple of short `highlights` per phase, each phase a house
      // along the route, ending at an optional `landing` destination
      // line at the bottom), followed by the full `body`/`bullets`
      // write-up per phase as plain flowing paragraphs underneath —
      // no card styling there, it reads as narrative.
      body: [ /* optional framing / the option not taken, as a note block */ ],
      phases: [
        // {
        //   tag: 'Phase 1 — Q1',        // optional; also doubles as the
        //                                // detail section's lead-in if set
        //   title: '',
        //   icon: 'tag',                 // 'tag' | 'shield' | 'loop' — pick
        //                                 // whichever reads closest to the phase
        //   highlights: ['', ''],        // optional — short phrases shown
        //                                 // on the infographic itself
        //   body: '',                    // plain string, not a block array
        //   bullets: ['', '']            // optional — full detail, shown below
        // }
      ],
      landing: '' // optional — the destination line shown at the end of the road
    },

    {
      id: 'deepdive',
      title: 'Deep dive: <feature name>',
      navLabel: 'Feature deep dive',
      body: [ /* paragraphs introducing what gets zoomed into, and why */ ],
      deepdive: {
        frameLabel: '',   // caption shown inside the placeholder image frame
        body: [ /* caption / walkthrough blocks — same block shapes as above */ ]
      }
    },

    // Two workflow diagrams from one data key: an INITIAL vs IMPROVED
    // before/after comparison (click-to-expand on any gold step), and
    // a full-flow guardrail pipeline. Good for showing a rapid-
    // iteration/tooling win and a production eval/monitoring loop.
    //
    // To use one:
    //   1. copy assets/workflow-data-zsm.js to assets/workflow-data-<key>.js
    //      and fill it in (its header + shape documents both diagrams)
    //   2. on the case study's .html, add
    //        <link rel="stylesheet" href="../assets/case-study-workflow.css">
    //        <script src="../assets/workflow-data-<key>.js"></script>
    //      and AFTER renderCaseStudy(),
    //        <script src="../assets/case-study-workflow.js"></script>
    //   3. set `workflow: '<key>'` on the section, as below
    //
    // {
    //   id: 'workflow',
    //   title: 'Workflow diagrams',
    //   body: [ /* optional framing */ ],
    //   workflow: '<key>'
    // },

    // An interactive decision funnel: user needs → bot/system needs →
    // decision categories → options weighed → what shipped. Click a
    // column to open that stage's full reasoning beside it.
    //
    // To use one:
    //   1. copy assets/funnel-data-zsm.js to assets/funnel-data-<key>.js
    //      and fill it in (its header documents the shape)
    //   2. on the case study's .html, add
    //        <link rel="stylesheet" href="../assets/case-study-funnel.css">
    //        <script src="../assets/funnel-data-<key>.js"></script>
    //      and AFTER renderCaseStudy(),
    //        <script src="../assets/case-study-funnel.js"></script>
    //   3. set `funnel: '<key>'` on the section, as below
    //
    // Best as its own section — it goes full-bleed and needs the width.
    // {
    //   id: 'funnel',
    //   title: 'From user needs to requirements',
    //   body: [ /* optional framing */ ],
    //   funnel: '<key>'
    // },

    // A bespoke, hand-laid-out node/arrow SVG diagram — use this
    // instead of `workflow` when the goal is replicating a specific
    // reference (a sketch, a whiteboard photo) as exactly as
    // possible, rather than building a reusable data-driven
    // visualization. There's no generic data shape for this one —
    // open assets/case-study-diagram.js, add a new entry to its
    // DIAGRAMS map keyed by <key>, and hand-place the SVG nodes/
    // arrows to match the reference.
    //
    // To use one:
    //   1. add the SVG builder to assets/case-study-diagram.js
    //   2. on the case study's .html, add
    //        <link rel="stylesheet" href="../assets/case-study-diagram.css">
    //      and AFTER renderCaseStudy(),
    //        <script src="../assets/case-study-diagram.js"></script>
    //   3. set `diagram: '<key>'` on the section, as below
    // {
    //   id: 'model',
    //   title: 'Model: <system name>',
    //   diagram: '<key>'
    // },

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
        // { value: '+00%', label: '' }
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
      // { label: 'Next case study', href: '<slug>.html' }
    ]
  }
};
