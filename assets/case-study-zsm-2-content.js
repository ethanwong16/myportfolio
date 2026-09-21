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
        src: '../assets/img/zsm-2-problem-space.png',
        alt: 'Problem space: AI search engines like Claude and Gemini sit between users and rich-data platforms like Zillow, but lack a shared language to extract the expertise those platforms hold',
        caption: 'The gap between what AI search engines can access and the expertise rich-data platforms hold'
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
        src: '../assets/img/zsm-2-user-needs-goals.png',
        alt: 'Matrix mapping user needs to bot needs to goals (semantics, topology, rendering, be agile) to concrete requirements like standardized language, structured data, full coverage inclusion, and accelerated workflows',
        caption: 'From user needs to bot needs to product requirements'
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
      // 'vertical' stacks each image full width (vs. 'card', a
      // side-by-side grid) — see field reference in
      // case-study-collapsible-content.template.js.
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
        src: '../assets/img/zsm-2-outcomes.png',
        alt: 'Outcomes: 94% consolidation from ~67 to ~4 uniquely different nodes on for-sale listing results pages, 8x boosted coverage of listings with full building page data, 26% competitive advantage in schema coverage and richness at time of release',
        caption: '94% consolidation, 8x boosted coverage, 26% competitive advantage'
      },
      expand: {
        body: [ /* optional recap before the numbers */ ],
        metrics: [
          // { value: '+00%', label: '' }
        ]
      }
    },

    {
      id: 'appendix',
      title: 'Appendix',
      infographic: {
        html: `<div style="background:var(--paper);font-family:var(--font-body);color:var(--ink);">
  <div style="max-width:1080px;margin:0 auto;padding:1.5rem 0 0.5rem;">

    <div style="margin-bottom:2rem;">
      <h1 style="font-family:var(--font-display);font-size:var(--step-2);font-weight:700;letter-spacing:var(--tracking-tight);margin:0 0 .6rem;">Decision matrix</h1>
      <p style="font-size:var(--step--1);line-height:1.65;color:var(--ink-2);margin:0;max-width:60ch;">Four requirement tracks run left to right at every stage, narrowing top to bottom: a user need names a bot need, the bot need names a decision category, the category sets goals to achieve, alternatives get weighed against those goals, and one of them ships.</p>
    </div>

    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;padding:.9rem 1rem;border:1px solid var(--line);border-radius:var(--radius-md);background:color-mix(in srgb, var(--paper-2) 45%, transparent);margin-bottom:3rem;">
      <span style="font-size:.72rem;font-weight:600;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--ink-2);">User need</span>
      <span style="color:var(--gold);font-size:.75rem;">&#8594;</span>
      <span style="font-size:.72rem;font-weight:600;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--ink-2);">Bot need</span>
      <span style="color:var(--gold);font-size:.75rem;">&#8594;</span>
      <span style="font-size:.72rem;font-weight:600;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--ink-2);">Category</span>
      <span style="color:var(--gold);font-size:.75rem;">&#8594;</span>
      <span style="font-size:.72rem;font-weight:600;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--ink-2);">Goals to achieve</span>
      <span style="color:var(--gold);font-size:.75rem;">&#8594;</span>
      <span style="font-size:.72rem;font-weight:600;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--ink-2);">Alternatives</span>
      <span style="color:var(--gold);font-size:.75rem;">&#8594;</span>
      <span style="font-size:.72rem;font-weight:700;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--gold);">Decision</span>
    </div>

<div style="position:relative;">
    <div style="margin-bottom:.15rem;">
    <div style="font-size:10.5px;font-weight:700;letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;text-align:center;">01 &middot; User need</div>
    <div style="max-width:100%;margin-inline:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.65rem;"><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="font-family:var(--font-display);font-size:.88rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);margin-bottom:.4rem;line-height:1.3;">Hyper-specific, personal queries</div>
    <p style="margin:0;padding-left:.6rem;border-left:2px solid var(--gold-soft);font-size:.72rem;line-height:1.5;color:var(--ink-2);font-style:italic;">&ldquo;2bd waterfront, pet-friendly, &le;30 min bike to work&rdquo;</p>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="font-family:var(--font-display);font-size:.88rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);margin-bottom:.4rem;line-height:1.3;">Miss nothing</div>
    <p style="margin:0;padding-left:.6rem;border-left:2px solid var(--gold-soft);font-size:.72rem;line-height:1.5;color:var(--ink-2);font-style:italic;">&ldquo;Consider every listing in the borough&rdquo;</p>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="font-family:var(--font-display);font-size:.88rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);margin-bottom:.4rem;line-height:1.3;">Expert-level answers</div>
    <p style="margin:0;padding-left:.6rem;border-left:2px solid var(--gold-soft);font-size:.72rem;line-height:1.5;color:var(--ink-2);font-style:italic;">&ldquo;Teach me the neighborhoods, not one listing&rdquo;</p>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="font-family:var(--font-display);font-size:.88rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);margin-bottom:.4rem;line-height:1.3;">Search that keeps improving</div>
    <p style="margin:0;padding-left:.6rem;border-left:2px solid var(--gold-soft);font-size:.72rem;line-height:1.5;color:var(--ink-2);font-style:italic;">&ldquo;Get better as I search&rdquo;</p>
  </div></div>
  </div>
    <div style="position:relative;height:2.4rem;"><div style="position:absolute;inset:0;clip-path:polygon(0.60% 0%,24.40% 0%,25.90% 100%,3.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(25.60% 0%,49.40% 0%,49.40% 100%,27.10% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(50.60% 0%,74.40% 0%,72.90% 100%,50.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(75.60% 0%,99.40% 0%,96.40% 100%,74.10% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div></div>
    <div style="margin-bottom:.15rem;">
    <div style="font-size:10.5px;font-weight:700;letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;text-align:center;">02 &middot; Bot need</div>
    <div style="max-width:94%;margin-inline:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.65rem;"><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="display:grid;gap:.5rem;"><div><div style="font-size:.78rem;font-weight:600;color:var(--ink);line-height:1.3;">Reliable access</div><div style="font-size:.7rem;color:var(--ink-2);margin-top:.1rem;line-height:1.4;">Extract cleanly, every refresh</div></div><div><div style="font-size:.78rem;font-weight:600;color:var(--ink);line-height:1.3;">Depth &amp; rich detail</div><div style="font-size:.7rem;color:var(--ink-2);margin-top:.1rem;line-height:1.4;">A vocabulary that can say it</div></div></div>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="display:grid;gap:.5rem;"><div><div style="font-size:.78rem;font-weight:600;color:var(--ink);line-height:1.3;">Full crawl coverage</div><div style="font-size:.7rem;color:var(--ink-2);margin-top:.1rem;line-height:1.4;">No retries on failed renders</div></div><div><div style="font-size:.78rem;font-weight:600;color:var(--ink);line-height:1.3;">Fast, complete render</div><div style="font-size:.7rem;color:var(--ink-2);margin-top:.1rem;line-height:1.4;">Fixed crawl budget per domain</div></div></div>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="display:grid;gap:.5rem;"><div><div style="font-size:.78rem;font-weight:600;color:var(--ink);line-height:1.3;">Clean structure</div><div style="font-size:.7rem;color:var(--ink-2);margin-top:.1rem;line-height:1.4;">Feeds a coherent knowledge graph</div></div></div>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="display:grid;gap:.5rem;"><div><div style="font-size:.78rem;font-weight:600;color:var(--ink);line-height:1.3;">Sites that evolve fast</div><div style="font-size:.7rem;color:var(--ink-2);margin-top:.1rem;line-height:1.4;">Keep pace with ranking changes</div></div></div>
  </div></div>
  </div>
    <div style="position:relative;height:2.4rem;"><div style="position:absolute;inset:0;clip-path:polygon(3.60% 0%,25.90% 0%,27.40% 100%,6.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(27.10% 0%,49.40% 0%,49.40% 100%,28.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(50.60% 0%,72.90% 0%,71.40% 100%,50.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(74.10% 0%,96.40% 0%,93.40% 100%,72.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div></div>
    <div style="margin-bottom:.15rem;">
    <div style="font-size:10.5px;font-weight:700;letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;text-align:center;">03 &middot; Decision category</div>
    <div style="max-width:88%;margin-inline:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.65rem;"><div style="text-align:center;padding-bottom:.5rem;border-bottom:2px solid var(--gold-soft);">
    <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);">Semantics</div>
    <div style="font-size:.7rem;color:var(--ink-3);margin-top:.2rem;line-height:1.4;">schema + vocabulary</div>
  </div><div style="text-align:center;padding-bottom:.5rem;border-bottom:2px solid var(--gold-soft);">
    <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);">Rendering</div>
    <div style="font-size:.7rem;color:var(--ink-3);margin-top:.2rem;line-height:1.4;">location &middot; CSR/SSR &middot; bot vs human</div>
  </div><div style="text-align:center;padding-bottom:.5rem;border-bottom:2px solid var(--gold-soft);">
    <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);">Topology</div>
    <div style="font-size:.7rem;color:var(--ink-3);margin-top:.2rem;line-height:1.4;">hierarchy &middot; format &middot; aggregation</div>
  </div><div style="text-align:center;padding-bottom:.5rem;border-bottom:2px solid var(--gold-soft);">
    <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);">Maintenance</div>
    <div style="font-size:.7rem;color:var(--ink-3);margin-top:.2rem;line-height:1.4;">workflow &middot; testing &middot; tooling</div>
  </div></div>
  </div>
    <div style="position:relative;height:2.4rem;"><div style="position:absolute;inset:0;clip-path:polygon(6.60% 0%,27.40% 0%,28.90% 100%,9.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(28.60% 0%,49.40% 0%,49.40% 100%,30.10% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(50.60% 0%,71.40% 0%,69.90% 100%,50.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(72.60% 0%,93.40% 0%,90.40% 100%,71.10% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div></div>
    <div style="margin-bottom:.15rem;">
    <div style="font-size:10.5px;font-weight:700;letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;text-align:center;">04 &middot; Goals to achieve</div>
    <div style="max-width:82%;margin-inline:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.65rem;"><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <ul style="display:grid;gap:.35rem;margin:0;padding:0;list-style:none;"><li style="position:relative;padding-left:.9rem;font-size:.72rem;line-height:1.5;color:var(--ink-2);"><span style="position:absolute;left:0;top:.55em;width:.35rem;height:1px;background:var(--ink-3);"></span>needs a standard &ldquo;language&rdquo; to ground their data extraction in</li><li style="position:relative;padding-left:.9rem;font-size:.72rem;line-height:1.5;color:var(--ink-2);"><span style="position:absolute;left:0;top:.55em;width:.35rem;height:1px;background:var(--ink-3);"></span>needs a powerful &ldquo;vocabulary&rdquo; that conveys semantic complexities</li></ul>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <ul style="display:grid;gap:.35rem;margin:0;padding:0;list-style:none;"><li style="position:relative;padding-left:.9rem;font-size:.72rem;line-height:1.5;color:var(--ink-2);"><span style="position:absolute;left:0;top:.55em;width:.35rem;height:1px;background:var(--ink-3);"></span>needs a rendering technique to serve the full body of information</li><li style="position:relative;padding-left:.9rem;font-size:.72rem;line-height:1.5;color:var(--ink-2);"><span style="position:absolute;left:0;top:.55em;width:.35rem;height:1px;background:var(--ink-3);"></span>needs to access markup ASAP in the rendering life cycle</li></ul>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <ul style="display:grid;gap:.35rem;margin:0;padding:0;list-style:none;"><li style="position:relative;padding-left:.9rem;font-size:.72rem;line-height:1.5;color:var(--ink-2);"><span style="position:absolute;left:0;top:.55em;width:.35rem;height:1px;background:var(--ink-3);"></span>clean structure powers clean knowledge graphs, and contextful, accurate answers</li></ul>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <ul style="display:grid;gap:.35rem;margin:0;padding:0;list-style:none;"><li style="position:relative;padding-left:.9rem;font-size:.72rem;line-height:1.5;color:var(--ink-2);"><span style="position:absolute;left:0;top:.55em;width:.35rem;height:1px;background:var(--ink-3);"></span>sites need to rapidly experiment and update their content</li></ul>
  </div></div>
  </div>
    <div style="position:relative;height:2.4rem;"><div style="position:absolute;inset:0;clip-path:polygon(9.60% 0%,28.90% 0%,30.40% 100%,12.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(30.10% 0%,49.40% 0%,49.40% 100%,31.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(50.60% 0%,69.90% 0%,68.40% 100%,50.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(71.10% 0%,90.40% 0%,87.40% 100%,69.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-wash) 55%, transparent),color-mix(in srgb, var(--gold-wash) 18%, transparent));"></div></div>
    <div style="margin-bottom:.15rem;">
    <div style="font-size:10.5px;font-weight:700;letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;text-align:center;">05 &middot; Alternatives weighed</div>
    <div style="max-width:76%;margin-inline:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.65rem;"><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="display:flex;flex-direction:column;gap:.3rem;"><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--gold);background:var(--gold-wash);color:var(--ink);font-weight:600;">&#10003; schema.org</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">data-vocabulary.org</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">Dublin Core</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">One-size-fits-all types</span></div>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="display:flex;flex-direction:column;gap:.3rem;"><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--gold);background:var(--gold-wash);color:var(--ink);font-weight:600;">&#10003; Top-level SSR</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">Footer placement</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">Client-side render</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">One render for all</span></div>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="display:flex;flex-direction:column;gap:.3rem;"><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--gold);background:var(--gold-wash);color:var(--ink);font-weight:600;">&#10003; Nested JSON-LD</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">Flat markup</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">Microdata</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">No aggregation</span></div>
  </div><div style="border:1px solid var(--line);background:var(--paper);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="display:flex;flex-direction:column;gap:.3rem;"><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--gold);background:var(--gold-wash);color:var(--ink);font-weight:600;">&#10003; Centralized repo</span><span style="font-size:.72rem;padding:.3em .6em;border-radius:var(--radius-pill);border:1px solid var(--line);color:var(--ink-3);">Per-team ownership</span></div>
  </div></div>
  </div>
    <div style="position:relative;height:2.4rem;"><div style="position:absolute;inset:0;clip-path:polygon(12.60% 0%,30.40% 0%,31.90% 100%,15.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-soft) 60%, transparent),color-mix(in srgb, var(--gold-wash) 25%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(31.60% 0%,49.40% 0%,49.40% 100%,33.10% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-soft) 60%, transparent),color-mix(in srgb, var(--gold-wash) 25%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(50.60% 0%,68.40% 0%,66.90% 100%,50.60% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-soft) 60%, transparent),color-mix(in srgb, var(--gold-wash) 25%, transparent));"></div><div style="position:absolute;inset:0;clip-path:polygon(69.60% 0%,87.40% 0%,84.40% 100%,68.10% 100%);background:linear-gradient(180deg,color-mix(in srgb, var(--gold-soft) 60%, transparent),color-mix(in srgb, var(--gold-wash) 25%, transparent));"></div></div>
    <div style="margin-bottom:.15rem;">
    <div style="font-size:10.5px;font-weight:700;letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;text-align:center;">06 &middot; Decision</div>
    <div style="max-width:70%;margin-inline:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.65rem;"><div style="border:1px solid var(--gold);background:var(--gold-wash);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="font-family:var(--font-display);font-size:.95rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);">schema.org</div>
    <div style="font-size:.72rem;color:var(--ink-2);margin:.25rem 0 .5rem;line-height:1.45;">Specialized Place sub-types, payment spec blocks, floor-plan aggregation</div>
    <ul style="display:grid;gap:.25rem;margin:0;padding:0;list-style:none;"><li style="position:relative;padding-left:1rem;font-size:.68rem;line-height:1.45;color:var(--ink-2);"><span style="position:absolute;left:0;top:-.05em;color:var(--gold);font-size:.68rem;font-weight:700;">&#10003;</span>45M+ web domain usage</li><li style="position:relative;padding-left:1rem;font-size:.68rem;line-height:1.45;color:var(--ink-2);"><span style="position:absolute;left:0;top:-.05em;color:var(--gold);font-size:.68rem;font-weight:700;">&#10003;</span>15+ years as industry standard</li></ul>
  </div><div style="border:1px solid var(--gold);background:var(--gold-wash);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="font-family:var(--font-display);font-size:.95rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);">Top-level SSR</div>
    <div style="font-size:.72rem;color:var(--ink-2);margin:.25rem 0 .5rem;line-height:1.45;">Rendered in &lt;head&gt;, bot-specialized delivery</div>
    <ul style="display:grid;gap:.25rem;margin:0;padding:0;list-style:none;"><li style="position:relative;padding-left:1rem;font-size:.68rem;line-height:1.45;color:var(--ink-2);"><span style="position:absolute;left:0;top:-.05em;color:var(--gold);font-size:.68rem;font-weight:700;">&#10003;</span>Boosts discoverability by bot</li><li style="position:relative;padding-left:1rem;font-size:.68rem;line-height:1.45;color:var(--ink-2);"><span style="position:absolute;left:0;top:-.05em;color:var(--gold);font-size:.68rem;font-weight:700;">&#10003;</span>Saves crawl budget</li></ul>
  </div><div style="border:1px solid var(--gold);background:var(--gold-wash);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="font-family:var(--font-display);font-size:.95rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);">Nested JSON-LD</div>
    <div style="font-size:.72rem;color:var(--ink-2);margin:.25rem 0 .5rem;line-height:1.45;">Entity linkages + aggregation keys for repeat floor plans</div>
    <ul style="display:grid;gap:.25rem;margin:0;padding:0;list-style:none;"><li style="position:relative;padding-left:1rem;font-size:.68rem;line-height:1.45;color:var(--ink-2);"><span style="position:absolute;left:0;top:-.05em;color:var(--gold);font-size:.68rem;font-weight:700;">&#10003;</span>Models real listing-page structure</li><li style="position:relative;padding-left:1rem;font-size:.68rem;line-height:1.45;color:var(--ink-2);"><span style="position:absolute;left:0;top:-.05em;color:var(--gold);font-size:.68rem;font-weight:700;">&#10003;</span>Centralizes markup for developers</li></ul>
  </div><div style="border:1px solid var(--gold);background:var(--gold-wash);border-radius:var(--radius-md);padding:.7rem .8rem;min-width:0;">
    <div style="font-family:var(--font-display);font-size:.95rem;font-weight:700;letter-spacing:var(--tracking-tight);color:var(--ink);">Centralized repo</div>
    <div style="font-size:.72rem;color:var(--ink-2);margin:.25rem 0 .5rem;line-height:1.45;">One vocabulary, one test surface, build once &amp; reuse</div>
    <ul style="display:grid;gap:.25rem;margin:0;padding:0;list-style:none;"><li style="position:relative;padding-left:1rem;font-size:.68rem;line-height:1.45;color:var(--ink-2);"><span style="position:absolute;left:0;top:-.05em;color:var(--gold);font-size:.68rem;font-weight:700;">&#10003;</span>Clear ownership model</li><li style="position:relative;padding-left:1rem;font-size:.68rem;line-height:1.45;color:var(--ink-2);"><span style="position:absolute;left:0;top:-.05em;color:var(--gold);font-size:.68rem;font-weight:700;">&#10003;</span>Build once, reuse at scale</li></ul>
  </div></div>
  </div>
  </div>

  </div>`
      }
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
