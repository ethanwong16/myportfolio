/* ============================================================
   case-study-collapsible-content.template.js — copy this, fill
   it in, done.

   This is the "infographic-first" case study shape: 4 major
   sections + a blank-for-now appendix, each collapsed by default
   to just its static infographic. Expanding a section (or hitting
   "Expand all sections" on the page) reveals supporting diagrams
   and write-up underneath. It's a sibling to
   case-study-content.template.js's long-form narrative shape, not
   a replacement — pick whichever fits the story; both share the
   same palette/tokens and most of the same block vocabulary below.

   HOW TO ADD A NEW CASE STUDY IN THIS SHAPE (3 steps, no template
   or renderer edits):

   1. Copy this file to assets/case-study-<slug>-content.js and
      fill in the placeholders below.
   2. Copy case-studies/case-study-skeleton.html to
      case-studies/<slug>.html, and change its one <script src="...">
      content-file line to point at your new content file.
   3. Update the "Next case study" link in whichever case study
      should point at this one (see `footer.links` at the bottom).

   That's the whole process — case-study-collapsible.css and
   case-study-collapsible-render.js read whatever shape this object
   is, so nothing else needs to change per case study.

   FIELD REFERENCE

   Each section has three parts, all optional:
     - `infographic` — the always-visible static image. Set `src`
       once you have one (build it yourself, or ask for help); leave
       it unset and a dashed placeholder frame renders instead, so
       an unfinished section still shows where the image will go.
       Omit the whole `infographic` key (as the appendix does below)
       to render no figure at all.
     - `expand` — the collapsed-by-default disclosure. Accepts the
       exact same block vocabulary as a top-level section in
       case-study-content.template.js: `body`, `personas`, `goals`,
       `metrics`, `stack`/`stackLabel`, `deepdive`, plus the
       data-driven `funnel`/`workflow`/`diagram`/`schemaViz` keys
       (see that file for the three-step setup each of those needs —
       same contract here, just mounted inside the expand instead of
       inline). Omit `expand` entirely (as the blank appendix does)
       to render no disclosure at all — just the heading + infographic.
     - `label` on `expand` overrides the toggle's default text
       ("Show diagrams & write-up") if a section wants something
       more specific, e.g. "Show the eval methodology".

   "body" blocks — used inside `expand`, and by its `deepdive`
   sub-block — accept a mix of three shapes in one array:
     - a plain string                      → a paragraph
     - { quote: '...', cite: '...' }       → a pull-quote (cite optional)
     - { note: 'summary', body: '...' }    → an expandable annotation,
       rendered right after the block before it.
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
    // The four major sections, in reading order, plus the appendix.
    // `id` must be unique and URL-safe (used as the #anchor).
    // `navLabel` is optional; falls back to `title` if omitted.

    {
      id: 'problem-space',
      title: 'Problem Space',
      infographic: {
        src: '',      // e.g. '../assets/img/<slug>-problem-space.png'
        alt: '',      // required once src is set — describe what the image shows
        caption: ''   // optional 1-line caption under the image
      },
      expand: {
        // label: 'Show diagrams & write-up',
        body: [
          // '...',
          // { note: 'Why this problem, and not the others', body: '...' }
        ]
        // deepdive: { frameLabel: '', body: [] }  // an extra supporting diagram
      }
    },

    {
      id: 'user-needs-goals',
      title: 'User Needs → Product Goals',
      navLabel: 'User Needs → Goals',
      infographic: {
        src: '',
        alt: '',
        caption: ''
      },
      expand: {
        body: [ /* optional framing connecting needs to goals */ ],
        personas: [
          // { name: '', role: '', quote: '', needs: ['', ''] }
          // `quote` and `needs` are both optional
        ],
        goals: [
          // { label: '', detail: '' }  — `detail` optional
        ]
      }
    },

    {
      id: 'solution-decisioning',
      title: 'Solution & Decisioning',
      // NOT FINAL — draft slides from the working deck, dropped in
      // just to preview the layout. 'vertical' stacks each image full
      // width (vs. 'card', a side-by-side grid) — see field reference
      // in case-study-collapsible-content.template.js.
      infographic: {
        layout: 'vertical',
        items: [
          {
            src: '../assets/img/zsm-2-solution-part1-schema-graphing.png',
            alt: 'Solutions Part 1 — Schema Graphing: hyper-specified content markup and structured graph layout unlock 6x semantic differentiation of house types',
            caption: 'Part 1 — Schema Graphing'
          },
          {
            src: '../assets/img/zsm-2-solution-part2-bot-accessibility.png',
            alt: 'Solutions Part 2 — Bot Accessibility: easy access via content extraction and rendering maximizes crawl budgets for AI search bots',
            caption: 'Part 2 — Bot Accessibility'
          },
          {
            src: '../assets/img/zsm-2-solution-part3-rapid-iteration.png',
            alt: 'Solutions Part 3 — Rapid Iteration and experimentation: AI tooling accelerates release workflows by 60%',
            caption: 'Part 3 — Rapid Iteration'
          }
        ]
      },
      expand: {
        body: [
          // '...',
          // { note: 'Options considered', body: '...' }
        ]
        // funnel: '<key>',   // an interactive decision funnel — see field
        // workflow: '<key>', // reference in case-study-content.template.js
        // diagram: '<key>',  // for the setup each of these needs
      }
    },

    {
      id: 'outcomes',
      title: 'Outcomes',
      infographic: {
        src: '',
        alt: '',
        caption: ''
      },
      expand: {
        body: [ /* optional recap before the numbers */ ],
        metrics: [
          // { value: '+00%', label: '' }
        ]
      }
    },

    {
      // Blank for now, by design — the appendix exists in the page
      // structure so the anchor/nav slot is reserved, but has
      // nothing to show yet. No `infographic` and no `expand` means
      // it renders as just a heading; add either key back once
      // there's real content.
      id: 'appendix',
      title: 'Appendix'
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
