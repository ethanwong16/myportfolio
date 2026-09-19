/* ============================================================
   schema-viz-data-zsm.js — content for the "Deep dive" schema
   visualization on the ZSM case study: two before/after exhibits
   plus a 3-point takeaway stack.

   Copy this file (and case-study-schema-viz.js's mount) to add the
   same visualization to another case study — swap the key below
   and everything under it.

   NOTE ON CONTENT: exhibitA is a fabricated, representative example
   (not real Zillow markup) — chosen for readability over literalism.
   The real metrics from the source deck (94% node consolidation, 8x
   list-card coverage, etc.) live in the outcomes section's `metrics`
   in case-study-zsm-content.js, not here.
   ============================================================ */

window.CS_SCHEMA_VIZ = window.CS_SCHEMA_VIZ || {};

window.CS_SCHEMA_VIZ.zsm = {

  exhibitA: {
    eyebrow: 'Exhibit A — page source, zoomed in',
    intro: 'Same listing, same visible page. The difference is where the machine-readable facts live.',

    before: {
      label: 'Before',
      caption: 'Scattered across the body — it’s a scavenger hunt',
      html: [
        { tag: '<body>', kind: 'plain' },
        { tag: '  <header class="listing-hero">', kind: 'plain' },
        { tag: '    <h1>428 Maple Ridge Ct</h1>', kind: 'plain' },
        { tag: '    <span class="price-tag">$685,000</span>', kind: 'hit', hit: 'price' },
        { tag: '  </header>', kind: 'plain' },
        { tag: '  <div class="gallery">…</div>', kind: 'plain' },
        { tag: '  <ul class="quick-facts">', kind: 'plain' },
        { tag: '    <li class="beds">3 bd</li>', kind: 'hit', hit: 'facts' },
        { tag: '    <li class="baths">2 ba</li>', kind: 'hit', hit: 'facts' },
        { tag: '    <li class="sqft">1,840 sqft</li>', kind: 'hit', hit: 'facts' },
        { tag: '  </ul>', kind: 'plain' },
        { tag: '  <section class="description">…</section>', kind: 'plain' },
        { tag: '  <section class="agent-card">', kind: 'plain' },
        { tag: '    <p class="agent-name">Dana Whitfield</p>', kind: 'hit', hit: 'agent' },
        { tag: '    <p class="brokerage">Whitfield Realty</p>', kind: 'hit', hit: 'agent' },
        { tag: '  </section>', kind: 'plain' },
        { tag: '  <p class="status">Active · 4 days</p>', kind: 'hit', hit: 'status' },
        { tag: '</body>', kind: 'plain' }
      ],
      hitLabel: 'a bot needs 4 separate tags, in 4 different formats, to reconstruct one listing'
    },

    after: {
      label: 'After',
      caption: 'One block, in <head> — a clear treasure map',
      headJson: [
        '{',
        '  "@context": "https://schema.org",',
        '  "@type": "SingleFamilyResidence",',
        '  "name": "428 Maple Ridge Ct",',
        '  "offers": {',
        '    "@type": "Offer",',
        '    "price": 685000,',
        '    "priceCurrency": "USD"',
        '  },',
        '  "numberOfRooms": 3,',
        '  "numberOfBathroomsTotal": 2,',
        '  "floorSize": {',
        '    "@type": "QuantitativeValue",',
        '    "value": 1840,',
        '    "unitCode": "FTK"',
        '  },',
        '  "seller": {',
        '    "@type": "RealEstateAgent",',
        '    "name": "Dana Whitfield",',
        '    "worksFor": "Whitfield Realty Group"',
        '  }',
        '}'
      ],
      bodyNote: '<body> still renders the exact same HTML above, for humans — bots just don’t need it anymore.'
    }
  },

  exhibitB: {
    eyebrow: 'Exhibit B — markup topology, zoomed out',
    intro: 'Same audit, at the graph level. Before: disconnected fragments. After: one typed, navigable tree.',
    before: { label: 'Before', caption: 'Disconnected fragments, no shared structure' },
    after: { label: 'After', caption: 'One rooted, typed graph' },
    /* the diagram above trades density for legibility — this is the
       real, un-simplified graph it's standing in for */
    realExample: {
      img: '../assets/img/zsm-real-frsrp-graph.png',
      alt: 'A real, dense force-directed graph of an FR SRP schema — hundreds of nodes (SingleFamilyResidence, Offer, GeoCoordinates, PostalAddress, and more) densely interconnected',
      caption: 'The diagram above is simplified for legibility. This is the real, un-simplified graph it stands in for — an actual FR SRP schema, visualized via',
      sourceLabel: 'classyschema.org',
      sourceHref: 'https://classyschema.org'
    }
  },

  /* The house's content is exactly the 3 points this whole deep dive
     is building toward — kept as close to the original wording as
     possible, grammar/typos aside. No stats here (those live in the
     outcomes section's metrics now, see case-study-zsm-content.js). */
  house: {
    eyebrow: 'What the after-graph buys us',
    intro: 'Three stories, three compounding wins — each one sits on top of the last.',
    floors: [
      {
        icon: 'richness',
        title: 'Semantic Richness',
        body: 'Each node represents a different schema type. Even at a glance, we see a much more diverse and rich expression of specific home variants, property details, pricing units, and more!'
      },
      {
        icon: 'topology',
        title: 'Structured Topology',
        body: 'The after-graph shows clear aggregation and layering without sacrificing detail; structure and hierarchy are clearly shown, helping bots understand the order of data.'
      },
      {
        icon: 'ease',
        title: 'Rendering Ease',
        body: 'Bots now have quick, low-effort access via top-level SSR JSON-LD script tags — a gold mine of data to provide our users with the best answers.'
      }
    ]
  },

  /* Stretch goal, not built: a draggable force-directed version of
     Exhibit B's "after" graph, in the spirit of classyschema.org's
     visualizer. Revisit once the static version is validated. */
  stretchGoal: 'draggable-graph'
};
