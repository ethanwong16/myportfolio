/* ============================================================
   content.js — Ethan's copy, as data only. No rendering logic
   lives here; see render.js for how this becomes HTML.

   Sourced from Ethan_Wong_Resume_2026.pdf. Entries the résumé no
   longer carries live in `archive` and sit behind a toggle.
   ============================================================ */

window.CONTENT = {
  name: 'Ethan Wong',
  taglineLead: 'bringing products to',
  taglineWord: 'life',

  blurb:
    'Product builder who ships end-to-end and builds with AI natively — ' +
    '3 years turning ambiguous problems into launched products, from ' +
    'student-facing resources to agentic tooling adopted across large orgs.',

  actions: [
    { label: 'Résumé',       href: 'Ethan_Wong_Resume_2026.pdf', kind: 'primary' },
    { label: 'Work',         href: '#work',          kind: 'ghost' },
    { label: 'Case Studies', href: '#case-studies',  kind: 'ghost' },
    { label: 'About',        href: '#about',         kind: 'ghost' },
    { label: 'Contact',      href: '#contact',       kind: 'ghost' }
  ],

  /* ---- current work ---- */
  work: [
    {
      tag: 'Full-time',
      title: 'Zillow Group',
      org: 'Growth Platform & AI Search · Remote',
      period: 'Aug 2023 — Present',
      /* two levels at one company: the promotion is the point, so they
         share a card rather than competing as two separate entries */
      roles: [
        {
          title: 'Software Development Engineer (P3), Growth Platform & AI Search',
          period: 'Nov 2024 — Present',
          bullets: [
            'Built and shipped AI agent tooling adopted org-wide: an SEO consulting agent used by PMs, analysts and engineers, and a multi-agent ops-reporting product used by directors',
            'Pitched and built an agentic onboarding workflow collapsing ~1 developer-week of manual setup into an automated LLM pipeline, recruiting marketing and senior engineering to build it with me',
            'Launched a no-code experimentation platform resulting in 95% faster A/B test launches, letting PMs run experiments on page content and metadata without engineering'
          ]
        },
        {
          title: 'Software Development Engineer (P2), Shopping & Growth',
          period: 'Aug 2023 — Nov 2024',
          bullets: [
            'Built a production-grade commute-time filter used by millions of buyers, balancing search accuracy against performance across polygon precision, compute limits and early user data',
            'Shipped a CMS integration letting PMs run self-serve A/B experiments and control page metadata directly, cutting campaign release effort from 1 week to 1 hour'
          ]
        }
      ],
      links: []
    },
    {
      tag: 'Product',
      title: 'AntAlmanac',
      org: 'Product Manager · Student course catalog and degree planner · Irvine, CA',
      period: 'Sep 2022 — Jun 2023',
      bullets: [
        'Owned the course catalog and degree planner, scaling to 4K+ students with analytics-driven iteration',
        'Ran usability tests and focus groups with students, turning feedback into prioritized design changes',
        'Redesigned the information architecture and core user flows, lifting user engagement by 30%',
        'Set the north-star strategy and multi-year roadmap that has anchored 8+ major releases since'
      ],
      links: []
    },
    {
      tag: 'Internship',
      title: 'Federal Student Aid',
      org: 'Product Manager, Intern · U.S. Department of Education · Remote',
      period: 'Sep 2020 — May 2021',
      bullets: [
        'Redesigned the loan scam resource site, reducing heavy cognitive load into clear, digestible guidance',
        'Led scam pattern research with investigators, pinpointing lending risk signals to feed into the redesign',
        'Built a centralized toolkit consolidating scam-identification and loan resources, scoping data features for a scam-detection ML model'
      ],
      links: []
    }
  ],

  /* ---- case studies ---- */
  caseStudies: [
    {
      title: 'Optimizing For AI Search Agents – Structured Markup',
      summary: 'A case study on structured markup product strategy & execution. Unlocks rich semantic context for agentic search systems.',
      tags: ['0→1', 'AI Search', 'SEO/GEO'],
      href: 'case-studies/zsm-2.html'
    }
  ],

  /* ---- earlier work, behind a toggle ---- */
  archiveLabel: 'Earlier work',
  archive: [
    {
      tag: 'Internship',
      title: 'Software Engineering Intern',
      org: 'Medtronic',
      period: 'Jun 2021 — Aug 2021',
      bullets: [
        'Implemented APIs for key features of a diabetes patient analytics dashboard',
        'Performed data filtering and analysis on over 14K records using Python, Pandas and NumPy',
        'Deployed the API into AWS serverless compute and configured connections to S3 buckets'
      ],
      links: []
    },
    {
      tag: 'Project',
      title: 'ZotRides',
      org: 'Full-stack car rental web application',
      period: '',
      bullets: [
        'Designed the relational schema and stored procedures, using XML parsing with insertion optimizations to generate a MySQL database of 120K+ rental records',
        'Deployed with load balancers and master–slave servers across AWS EC2 and Google Compute Engine',
        'Built full-text search, autocomplete and session cookies to sharpen usability'
      ],
      stack: 'React.js · jQuery · Tomcat · Java · MySQL',
      links: [{ label: 'GitHub repo', href: 'https://github.com/ethanwong16/ZotRides' }]
    },
    {
      tag: 'Case study',
      title: 'Project TakeTheStage',
      org: 'Operational research + CSR marketing campaign',
      period: '',
      bullets: [
        'Developed and pitched a corporate social responsibility and marketing campaign for a local theater',
        'Ran a research study on operations, public perception, community impact and target market'
      ],
      stack: 'Excel · Adobe Suite · Hootsuite',
      links: [{ label: 'Proposal PDF', href: 'https://drive.google.com/file/d/1tY7sdmoFYS0dzQQQ1jbVA4jrUlRYS7Nh/view?usp=sharing' }]
    },
    {
      tag: 'Case study',
      title: 'xPlora',
      org: 'Interactive prototype — design industry exploration tool',
      period: '',
      bullets: [
        'Designed a high-fidelity prototype helping prospective designers explore career paths, news and tools for success in the design industry'
      ],
      stack: 'Adobe XD · Adobe Illustrator',
      links: [{ label: 'Interactive prototype', href: 'https://xd.adobe.com/view/8eb4e990-8a0b-4e0c-b55e-046b39641113-dbe7/' }]
    },
    {
      tag: 'Internship',
      title: 'Technology Analyst Intern',
      org: 'MENTOR Global Consultants',
      period: 'Jul 2019 — Oct 2019',
      bullets: [
        'Researched applications of blockchain in simplifying bond distribution processes',
        'Created a white paper, brochures and deck to attract investors for a micro municipal bond issuance platform'
      ],
      links: []
    }
  ],

  about:
    'I studied Computer Science at UC Irvine — B.S., summa cum laude, with a ' +
    'business minor — and I have spent the last three years shipping product at ' +
    'Zillow, most recently on Growth Platform & AI Search. I sit happiest at the ' +
    'seam between engineering and design: close enough to the code to know what ' +
    "is expensive, close enough to the user to know what is worth it.",

  education: {
    school: 'University of California, Irvine',
    degree: 'B.S. Computer Science, Minor in Business',
    detail: '3.99 GPA · summa cum laude',
    extra: 'Student Council Tech Lead · Outstanding Research Award · ICS Scholarship'
  },

  skills: [
    { group: 'Product', items: ['User research', 'Usability testing', 'A/B testing', 'Experiment design', 'PRDs', 'Roadmapping', 'OKRs / KPIs'] },
    { group: 'AI',      items: ['LLM agent architecture', 'Agentic workflow design', 'Claude Code', 'Evals', 'Prompt design'] },
    { group: 'Design',  items: ['Figma', 'Rapid prototyping', 'User flows', 'Information architecture'] },
    { group: 'Data & technical', items: ['SQL', 'Python', 'TypeScript', 'Databricks', 'Google Analytics', 'AWS', 'CI/CD'] }
  ],

  contact: {
    line: 'Building something, hiring, or just want to talk shop?',
    email: 'ewong0116@gmail.com',
    location: 'San Francisco Bay Area, CA',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ethanawong/' },
      { label: 'GitHub',   href: 'https://github.com/ethanwong16' }
    ]
  }
};
