/* ============================================================
   case-study-ai-search-strategy-content.js — the AI search
   strategy this ZSM case study executes on. Deliberately lighter
   than zsm's content file: a direct translation of the strategy
   notes into the page, not a full narrative — see the header
   comment in case-study-content.template.js for the section
   field reference this still follows.
   ============================================================ */

window.CASE_STUDY = {
  meta: {
    title: 'AI Search Strategy @ Zillow',
    summary: 'The strategy behind getting users to the right answers, properties, and tools, as search shifts from traditional ranked results to agentic, model-driven experiences.',
    tags: ['Strategy', 'AI Search', 'SEO/GEO'],
    facts: [
      { label: 'Role', value: 'Strategy Lead' },
      { label: 'Company', value: 'Zillow' }
    ]
  },

  sections: [
    {
      id: 'principle',
      title: 'Core principle',
      body: [
        { quote: 'Get users to the right answers, properties, and tools that unlock the door to their next stage — buying, renting, selling, taking loans, closing, etc.' }
      ]
    },

    {
      id: 'landscape',
      title: 'From traditional to AI search',
      body: [
        'Search engines have always acted as a black box.',
        'SEO is grounded in rapid experimentation to unlock best practices — the outcomes are higher ranking and boosted traffic.',
        'In an AI era, matching users to external sites becomes more specific and intentional. Users are looking to actually transact and take action, and Zillow’s expertise and authoritative data are unique — specific Zestimates, Zillow agent insights, ZHL officer advice, and economic experts working with Zillow.',
        'Outcomes become centered on AI search citations and referrals, and on the intent-level — plus conversion — of AI-forwarded traffic.'
      ]
    },

    {
      id: 'traditional-search',
      title: 'Model: traditional search',
      navLabel: 'Traditional search model',
      /* renders DIAGRAMS.traditional — a hand-laid-out replica of
         the traditional-search sketch, see
         assets/case-study-diagram.js. Needs case-study-diagram.css
         + .js loaded on the page. */
      diagram: 'traditional'
    },

    {
      id: 'agentic-search',
      title: 'Model: agentic search',
      navLabel: 'Agentic search model',
      /* renders DIAGRAMS.agentic — see assets/case-study-diagram.js. */
      diagram: 'agentic'
    },

    {
      id: 'goals',
      title: 'Goals',
      body: [
        'Five goals, each one the reason a strategy pillar below exists.'
      ],
      goals: [
        { label: 'Connect users to the best, right Zillow content' },
        { label: 'Maintain first-in-class, relevant, and Zillow-unique content' },
        { label: 'Translate the full depth of content to search engines' },
        { label: 'Enable rapid adaptation and experimentation for a changing search landscape' },
        { label: 'Maintain quality and consistency across all surfaces' }
      ]
    },

    {
      id: 'strategy',
      title: '5-pillar strategy',
      navLabel: 'Strategy',
      body: [
        'Five pillars, each tied to one of the goals above.'
      ],
      phases: [
        {
          tag: 'Pillar 1',
          title: 'Enhance Zillow’s provided agentic search experience',
          icon: 'tag',
          highlights: ['ChatGPT integration', 'Gemini integration'],
          body: 'Enhance Zillow’s provided agentic search experience through ChatGPT and Gemini integrations.'
        },
        {
          tag: 'Pillar 2',
          title: 'Content enhancements',
          icon: 'tag',
          highlights: ['Expert, trusted content', 'Topic coverage (E-E-A-T)'],
          body: 'Detailed, specific content from experts with trust and authority — blog, personal, natural-language content — and full topic coverage (E-E-A-T).'
        },
        {
          tag: 'Pillar 3',
          title: 'Agent content leverage',
          icon: 'shield',
          highlights: ['Structured markup (ZSM)', 'Security & bot crawlability'],
          body: 'SEO also helps bots a lot, though full nuance is needed via semantic analysis. Structured markup (ZSM) makes content graphical and standardized; security and bot-crawlability work identifies agent bots and filters malicious content.'
        },
        {
          tag: 'Pillar 4',
          title: 'Rapid experimentation & iteration',
          icon: 'loop',
          highlights: ['Self-serve sandbox surfaces', 'SEO lever & internal-linkage systems'],
          body: 'Self-serve sandbox surfaces and SEO lever systems — tags, headers, canonicals — plus internal linkage systems: BDP/CMS integration, auto internal links, and dynamic internal links.'
        },
        {
          tag: 'Pillar 5',
          title: 'Quality bar & enforcement',
          icon: 'shield',
          highlights: ['Shift-left SEO consultant', 'Experimentation guardrails'],
          body: 'Set standards for search engine excellence, with automated testing and guardrails for a fast-paced release environment and agent output — shifting left with an SEO consultant and test system, plus experimentation guardrails (a ZEXP feature for bots).'
        }
      ]
    }
  ],

  footer: {
    line: '',
    email: 'ewong0116@gmail.com',
    links: [
      { label: 'Back to work', href: '../index.html#work' },
      { label: 'Next case study', href: 'zsm.html' }
    ]
  }
};
