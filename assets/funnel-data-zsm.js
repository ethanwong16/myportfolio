/* ============================================================
   funnel-data-zsm.js — Zillow structured markup / AI search.

   Two layers per thread:
     - terse labels, for the shapes in the funnel itself
     - `d`, the detail, kept in the SAME nested-bullet shape as the
       source doc. Wording is the author's; only typos and obvious
       grammar were corrected ("her an her partner", "Bots needs",
       "wont", "Often times"). Nothing was summarised or reworded.
   ============================================================ */

(function () {

var STAGES = [
  { key: 'user', label: 'User needs' },
  { key: 'bot',  label: 'Bot needs' },
  { key: 'cat',  label: 'Decision category' },
  { key: 'opt',  label: 'Options on the table' },
  { key: 'dec',  label: 'What shipped' }
];

var THREADS = [
  /* ---------------------------------------------------- SEMANTICS */
  {
    user: 'Hyper-specific, personal queries',
    userEg: '“2bd waterfront, pet-friendly, ≤30 min bike to work”',
    bots: [
      { t: 'Reliable access', s: 'Extract cleanly, every refresh' },
      { t: 'Depth & rich detail', s: 'A vocabulary that can say it' }
    ],
    cat: 'Semantics', catSub: 'schema + vocabulary',
    candidates: [
      { label: 'schema.org', won: true },
      { label: 'data-vocabulary.org' },
      { label: 'Dublin Core' },
      { label: 'One-size-fits-all types' }
    ],
    dec: 'schema.org', decSub: 'Specialized Place sub-types, payment spec blocks, floor-plan aggregation',

    d: {
      icon: 'home',
      userNeed: 'Highly personalized, complex queries with relevant answers',
      userQuote: 'The perfect home for Rachel, a 24 year old new graduate moving to Seattle would be a 2 bed 1 bath apartment for her and her partner that has waterfront views, has A/C, is pet-friendly, and is a 30 minute or less commute by biking from her office.',

      bots: [
        { name: 'Reliable access to site content and tooling', points: [
          'The answer provided to users is only as good as what search engines have access to!',
          'AI search engine bots need to be able to extract details from your site reliably and efficiently across frequent search index refreshes and model training iterations.',
          'Our site is just one of the billion others out there!'
        ]},
        { name: 'Highly detailed and rich content', points: [
          'In order to answer complex queries that are perfect for Rachel, AI search engines need sites to provide information at a depth much greater than before.',
          'They need a standard format and language that can express such details.',
          'And they need sites to utilize the format and language effectively to provide expertise and insights that are highly relevant to Rachel.'
        ]}
      ],

      catDef: 'the meaning conveyed from your markup',
      catSubs: [
        { k: 'Schema', v: 'the language used to convey meaning to bots (and thus users)' },
        { k: 'Vocabulary', v: 'how you leverage entities and attributes to express intent and frame your content to users' }
      ],
      catNeeds: [
        'Reliable access — needs a standard “language” to ground their data extraction in',
        'Highly detailed content — the “language” needs a powerful “vocabulary” that conveys semantic complexities'
      ],

      weighing: [
        { head: 'Schema must be universal, actively maintained, and have a large expressive vocabulary system', bullets: [
          'data-vocabulary.org — deprecated, no longer maintained',
          'DCMI (Dublin Core) — lightweight but tailored for archival / library systems, less end-user optimized'
        ]},
        { head: 'Vocabulary must be selected to accurately portray the nature of Zillow listing pages and unlock as much insight for users as possible', bullets: [
          '800+ schema types and 1500+ attributes. Which and how you select are just as important, and can build different images / messaging to bots across sites with the exact same content!'
        ]},
        { head: 'Philosophy vs schema manifestation', bullets: [
          'For each user, finding your “home” means something different (multifamily, condo, townhouse, rent, buy, etc.) → APPROACH = hyper-specialize on these use cases and dynamically generate content'
        ], sub: [
          { k: 'Property type variance', v: 'One size fits all approach (e.g. all be SingleFamilyResidence or House) → consistent, simpler, statically determined, but lacks personalization capabilities to each user case' },
          { k: 'Payment unit and frequency', v: 'Can include monetary amount on its own and currency only → requires bot to analyze money (100K vs 1000) and infer rent vs buy scenarios, more ambiguity' },
          { k: 'Seller entity nuance (conglomerate vs FSBO)', v: 'Can skip expression of seller entity → nuance of “new construction community” versus “single owner selling home” is lost, requires inferring about nature by analyzing rest of property content' }
        ]}
      ],

      decision: [
        { k: 'Schema', v: 'schema.org', proof: [
          '45M+ web domain usage',
          'Founded by major search engine builders',
          'Actively W3C open source maintenance',
          '15+ years as industry standard'
        ]},
        { k: 'Vocabulary utilization', items: [
          { t: 'Place sub-types', b: [
            'Hyper personalization to several different user personas',
            'Leverages much more diverse range of schema vocabulary'
          ]},
          { t: 'Payment specification attribute block', b: [
            'Clearly identifies payment frequency for listing blocks with both buy vs sell scenarios'
          ]},
          { t: 'Business schema expression & floor plan aggregations', b: [
            'Powerful build state expression',
            'E.g. “buildable floor plans” that don’t exist yet, optimize for home buyers looking for “new construction” properties'
          ]}
        ]}
      ]
    }
  },

  /* ---------------------------------------------------- RENDERING */
  {
    user: 'Miss nothing',
    userEg: '“Consider every listing in the borough”',
    bots: [
      { t: 'Full crawl coverage', s: 'No retries on failed renders' },
      { t: 'Fast, complete render', s: 'Fixed crawl budget per domain' }
    ],
    cat: 'Rendering', catSub: 'location · CSR/SSR · bot vs human',
    candidates: [
      { label: 'Top-level SSR', won: true },
      { label: 'Footer placement' },
      { label: 'Client-side render' },
      { label: 'One render for all' }
    ],
    dec: 'Top-level SSR', decSub: 'Rendered in &lt;head&gt;, bot-specialized delivery',

    d: {
      icon: 'scan',
      userNeed: 'Answers to consider as many sources, possibilities as possible',
      userQuote: 'Rachel wants to be extremely well-prepared and wants answers provided to her to be as informed and researched as possible. She wants the full rental listings landscape in Manhattan and surrounding boroughs to be considered. She doesn’t want to miss a single listing!',

      bots: [
        { name: 'Full coverage of a site’s content available for parsing', points: [
          'To cover all bases for Rachel, a bot needs to be able to crawl as much as possible of the full listing set in Manhattan.',
          'It can’t afford to continually retry failed rendering attempts when there are tons of other pages on the site waiting to be processed!'
        ]},
        { name: 'Performant, full rendering of site’s content', points: [
          'A bot can only afford to spend so long trying to extract content from a single web domain.',
          'Pages need to provide the most relevant, complete content to bots as quickly and consistently as possible.',
          'Oftentimes bots powering AI search engines will only allocate a fixed “budget” to spend crawling a single web domain before it moves on (even if it’s not done visiting everything!)'
        ]}
      ],

      catDef: 'how your markup is actually shown on your site to bots',
      catSubs: [
        { k: 'Location', v: 'where exactly in the page does your markup get inserted' },
        { k: 'Client vs Server Side', v: 'when in the website painting lifecycle do you create the markup' },
        { k: 'Bot vs Human', v: 'whether bots and humans are served the same experience' }
      ],
      catNeeds: [
        'Full coverage — needs a rendering technique to serve the full body of information',
        'Performant rendering — needs to access markup ASAP in the rendering life cycle'
      ],

      weighing: [
        { head: 'For location, we should consider the “crawl budget” for bots — how much effort and time they can spend analyzing a particular web page. We should also factor in priority of markup compared to other metadata (SEO tag blocks).', bullets: [
          'Footer section rendering = lowest risk to ranking stability because it is bottom of the page, lowest impact to human user experience because it can be lazy loaded, but takes more effort for a bot to analyze and discover'
        ]},
        { head: 'For client vs server side rendering, we should consider CWV (core web vitals) — how quickly and smoothly a site’s content is generated. We should also consider the capabilities of bot crawlers and post-processing mechanisms search engine systems utilize.', bullets: [
          'CSR approach = faster load times, correlated with better CWV, but requires search engine systems / bot crawlers to render markup themselves.',
          'Google’s search engine crawlers have been known to sometimes support Javascript rendering, or may result in a post-process step to render Javascript. This requires additional resources and is not always guaranteed.'
        ]},
        { head: 'We can leverage bot identification techniques to specialize rendering technique for bots vs human users.', bullets: [
          'Non-specialized, markup generation load time may unnecessarily degrade human user experience. Markup is not visible to humans on the UI — they don’t care or utilize it.'
        ]}
      ],

      decision: [
        { k: 'Location', v: 'Top Level Rendering', proof: [
          'In &lt;head&gt; or top of &lt;body&gt; layer rendering',
          'Places markup high in priority for parsing to boost discoverability by bot',
          'Gives additional context on structure of page layout, more efficient page processing / understanding',
          'Saves crawl budget — bots won’t waste time looking through entire page to find markup'
        ]},
        { k: 'CSR vs SSR', v: 'SSR', proof: [
          'Accommodates non-JS bots, broadens the scope at which search engines you can target and thus the scope of human users you can reach',
          'Eliminates need for post-process re-rendering',
          'Control the markup rendering internally, allows for caching should performance enhancements be needed'
        ]},
        { k: 'Bot vs User split', v: 'Specialized rendering', proof: [
          'Balances content discoverability for bots and a seamless user experience for humans',
          'Sets up a rendering framework for more segmented experimentation (target bots vs humans specifically) for our broader AI search strategy'
        ]}
      ]
    }
  },

  /* ----------------------------------------------------- TOPOLOGY */
  {
    user: 'Expert-level answers',
    userEg: '“Teach me the neighborhoods, not one listing”',
    bots: [ { t: 'Clean structure', s: 'Feeds a coherent knowledge graph' } ],
    cat: 'Topology', catSub: 'hierarchy · format · aggregation',
    candidates: [
      { label: 'Nested JSON-LD', won: true },
      { label: 'Flat markup' },
      { label: 'Microdata' },
      { label: 'No aggregation' }
    ],
    dec: 'Nested JSON-LD', decSub: 'Entity linkages + aggregation keys for repeat floor plans',

    d: {
      icon: 'graph',
      userNeed: 'Users need answers from knowledgeable experts with broad understanding, not just one-off specific details',
      userQuote: 'Rachel wants to learn about the different neighborhoods and build on top of her research session. She doesn’t want to have to keep formulating highly specific questions all the time.',

      bots: [
        { name: 'Bots need well structured site content to build and regularly refresh knowledge graphs powering knowledgeable, relevant context sessions with users', points: [
          'Even if a bot can extract content very easily, it means nothing if it is not understandable and contributes to the bot’s internal knowledge graph and answering mechanisms.'
        ]}
      ],

      catDef: 'how you structure your markup',
      catSubs: [
        { k: 'Hierarchy', v: 'how flat versus nested your schema topology is' },
        { k: 'Embedding Format', v: 'the tag format used to embed your markup within your website' },
        { k: 'Aggregation', v: 'the level of depth of information of a site that is represented by markup' }
      ],
      catNeeds: [
        'Well structured site content — clean structure powers clean knowledge graphs, and by extension contextful, accurate answers to end users'
      ],

      weighing: [
        { head: 'Hierarchy must take into consideration parseability of markup by bots and the represented structure of your page content. Typically this is determined by selecting a point on a spectrum from completely flat to completely nested markup.', bullets: [
          'Completely flat markup is individually very fast to parse',
          'but requires extensive and careful linkages to ensure bots pick up on their relationships',
          'When building knowledge graphs the represented model may end up with more nodes and more scattering',
          'Highly flexible from a developer standpoint because each schema entity is individually managed'
        ]},
        { head: 'Embedding format is pretty varied across different sites on the Internet. We want to select a format that considers:', bullets: [
          'Search engine recognition / ability to parse',
          'Ease of implementation in codebases',
          'Long term maintainability',
          'Extraction ability for QA + testing',
          'Dependency on UI data components'
        ], sub: [
          { k: 'Microdata', v: 'Requires no extra tag insertion into your page content, but results in scattered schema markup that needs to be attached via attributes to existing HTML tags. Typically used in &lt;body&gt; tags so has longer parse time for bots, and is harder to separate from user-facing UI because schema is embedded all throughout page structure. Supported by Google.' }
        ]},
        { head: 'With aggregation we want to consider the tradeoff between having large sized schema and the performance of the site to render it, VS the level of detail shown to users via bots.', bullets: [
          'No aggregation = can easily bloat your markup size when you have, for example, 100s of different rental listings available in an apartment complex where several of them are identical. You provide great detail but at not much additional value to the user, and have large payloads.'
        ]}
      ],

      decision: [
        { k: 'Hierarchy', v: 'Nested structure with correlated entity / page linkages', proof: [
          'Models the natural information architecture of listing pages (listing page contains several listing result cards which contain details about specific properties)',
          'Creates more structured, clustered graph representation nodes',
          'Centralizes markup from a developer standpoint',
          'Linkages still communicate cross-page relationships'
        ]},
        { k: 'Embedding format', v: 'JSON-LD', proof: [
          'Isolates structured markup oriented for bots from user-oriented page HTML',
          'Easier to validate + QA, separation of concerns, easier for bots to parse',
          'From a business / team org perspective, Traffic teams can focus and own markup separately',
          'Can be dynamically injected into the page’s content',
          'Also supported by and recommended by Google'
        ]},
        { k: 'Aggregation', v: 'Nesting with detailed aggregation key', proof: [
          'We opt to summarize large volume, repetitive data and only expose differing floor plans',
          'Users can still see the full set of an apartment complex’s floor plans, price ranges',
          'Page can load with acceptable rendering speed'
        ]}
      ]
    }
  },

  /* -------------------------------------------------- MAINTENANCE */
  {
    user: 'Search that keeps improving',
    userEg: '“Get better as I search”',
    bots: [ { t: 'Sites that evolve fast', s: 'Keep pace with ranking changes' } ],
    cat: 'Maintenance', catSub: 'workflow · testing · tooling',
    candidates: [
      { label: 'Centralized repo', won: true },
      { label: 'Per-team ownership' }
    ],
    dec: 'Centralized repo', decSub: 'One vocabulary, one test surface, build once & reuse',

    d: {
      icon: 'loop',
      userNeed: 'Users constantly provide feedback on what in their agentic search experience is effective for them; they want a search experience that adapts to their changing needs and feedback',
      userQuote: 'Rachel needs her agentic search engine to continually evolve to become more capable, to provide increasingly relevant, high-quality answers as she conducts her home search.',

      bots: [
        { name: 'Bots need to continue to evolve their ranking algorithms and answer formulating processes to adjust to user needs', points: [
          'This means they need sites to continue to adapt and improve on the format, depth, and quality of content.'
        ]}
      ],

      catDef: 'workflow and ease of developers to improve and develop markup',
      catSubs: [
        { k: 'Development workflow', v: 'how markup gets built and shipped' },
        { k: 'Testing procedures', v: 'how markup gets validated' },
        { k: 'Development tool kits', v: 'what tooling exists around it' }
      ],
      catNeeds: [
        'Highly adaptable, ever-evolving sites matching bot algorithm and personalization updates — sites need to rapidly experiment and update their content'
      ],

      weighing: [
        { head: 'Internally different teams take ownership of different pages / business lines across the company', bullets: [
          'Naturally each team has different codebases, and thus historically owns a page’s structured markup separately',
          'This allows for much faster deploy times and personalization of page content to specific user personas'
        ]},
        { head: 'However, from an AI search engine lens this allows for multiple risks', bullets: [], sub: [
          { k: 'Inconsistent structured markup + drift', v: 'Different pages have different markup, variances in topology and semantics will occur. Markup changes in one area are invisible to others, and can output confusing signals to bots.' },
          { k: 'Maintenance nightmare', v: 'Changes to markup must be tracked and cross-compared across several (frequently up-scaling) teams and codebases. Testing & QA systems will similarly reflect a scattered, inconsistent model.' }
        ]}
      ],

      decision: [
        { k: 'Centralized structured markup repository', v: '', proof: [
          'Clear ownership model',
          'Consistent markup vocabulary, quality across all Zillow surfaces',
          'Consistent / singular testing interface',
          'Build once, reuse at scale',
          'Developer tooling in one place',
          'More efficient workflows — optimize for rapid experimentation'
        ]}
      ]
    }
  }
];

/* register — case-study-funnel.js mounts any [data-funnel] by key */
window.CS_FUNNELS = window.CS_FUNNELS || {};
window.CS_FUNNELS.zsm = {
  label: 'Funnel from user needs through bot needs and decision categories to the structured markup requirements that shipped',
  stages: STAGES,
  threads: THREADS
};

})();
