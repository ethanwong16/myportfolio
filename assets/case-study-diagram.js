/* ============================================================
   case-study-diagram.js — bespoke, hand-laid-out node/arrow SVG
   diagrams. Unlike the funnel/schema-viz/workflow visualizations,
   these aren't driven by a reusable data shape: each entry in
   DIAGRAMS is a hand-placed replica of one specific reference
   (here, the two search-model sketches from the AI search
   strategy notes), coordinate by coordinate.

   Drops into a case study the same way the others do: a section
   emits <div data-diagram="key"></div> (see case-study-render.js),
   and this file finds it and injects DIAGRAMS[key]. Load this
   script AFTER renderCaseStudy() runs, so the mount exists.

   All color/stroke values are inline presentation attributes
   referencing tokens.css variables, so the SVG has no separate
   stylesheet dependency beyond the exhibit chrome in
   case-study-diagram.css.
   ============================================================ */

(function () {
  'use strict';

  var INK2 = 'var(--ink-2)';
  var INK3 = 'var(--ink-3)';
  var INK = 'var(--ink)';
  var GOLD = 'var(--gold)';
  var GOLD_SOFT = 'var(--gold-soft)';
  var GOLD_WASH = 'var(--gold-wash)';
  var LINE = 'var(--line)';
  var PAPER = 'var(--paper)';

  /* ---------- shared icon glyphs, drawn at final size directly
     around a given center (cx, cy) rather than scaled from a unit
     viewBox — simpler to eyeball-place against hand-drawn nodes ---------- */

  function iconUser(cx, cy) {
    return '<circle cx="' + cx + '" cy="' + (cy - 7) + '" r="7" fill="none" stroke="' + INK2 + '" stroke-width="2"/>' +
      '<path d="M' + (cx - 15) + ',' + (cy + 17) + ' Q' + cx + ',' + (cy - 6) + ' ' + (cx + 15) + ',' + (cy + 17) + '" fill="none" stroke="' + INK2 + '" stroke-width="2" stroke-linecap="round"/>';
  }

  function iconMagnifier(cx, cy) {
    return '<circle cx="' + (cx - 3) + '" cy="' + (cy - 3) + '" r="8" fill="none" stroke="' + INK2 + '" stroke-width="2"/>' +
      '<line x1="' + (cx + 2.5) + '" y1="' + (cy + 2.5) + '" x2="' + (cx + 10) + '" y2="' + (cy + 10) + '" stroke="' + INK2 + '" stroke-width="2" stroke-linecap="round"/>';
  }

  function iconLink(cx, cy) {
    return '<rect x="' + (cx - 16) + '" y="' + (cy - 3) + '" width="17" height="10" rx="5" transform="rotate(-40 ' + (cx - 7.5) + ' ' + cy + ')" fill="none" stroke="' + INK2 + '" stroke-width="2"/>' +
      '<rect x="' + (cx - 1) + '" y="' + (cy - 7) + '" width="17" height="10" rx="5" transform="rotate(-40 ' + (cx + 7.5) + ' ' + (cy - 4) + ')" fill="none" stroke="' + INK2 + '" stroke-width="2"/>';
  }

  function iconSpark(cx, cy, r) {
    r = r || 11;
    var o = r, ir = r * .4;
    return '<path d="M' + cx + ' ' + (cy - o) +
      'L' + (cx + ir) + ' ' + (cy - ir) +
      'L' + (cx + o) + ' ' + cy +
      'L' + (cx + ir) + ' ' + (cy + ir) +
      'L' + cx + ' ' + (cy + o) +
      'L' + (cx - ir) + ' ' + (cy + ir) +
      'L' + (cx - o) + ' ' + cy +
      'L' + (cx - ir) + ' ' + (cy - ir) + 'Z" fill="' + GOLD + '"/>';
  }

  function iconChip(cx, cy) {
    var s = '<rect x="' + (cx - 12) + '" y="' + (cy - 12) + '" width="24" height="24" rx="4" fill="none" stroke="' + INK2 + '" stroke-width="2"/>';
    [-7, 0, 7].forEach(function (o) {
      s += '<line x1="' + (cx - 12) + '" y1="' + (cy + o) + '" x2="' + (cx - 17) + '" y2="' + (cy + o) + '" stroke="' + INK2 + '" stroke-width="2"/>';
      s += '<line x1="' + (cx + 12) + '" y1="' + (cy + o) + '" x2="' + (cx + 17) + '" y2="' + (cy + o) + '" stroke="' + INK2 + '" stroke-width="2"/>';
    });
    return s;
  }

  function iconCursor(cx, cy) {
    return '<path d="M' + (cx - 8) + ',' + (cy - 10) + ' L' + (cx - 8) + ',' + (cy + 11) + ' L' + (cx - 2) + ',' + (cy + 5) + ' L' + (cx + 3) + ',' + (cy + 12) + ' L' + (cx + 6) + ',' + (cy + 9) + ' L' + (cx + 1) + ',' + (cy + 2) + ' L' + (cx + 9) + ',' + (cy + 2) + ' Z" fill="' + INK2 + '"/>';
  }

  function iconSpider(cx, cy) {
    var s = '<ellipse cx="' + cx + '" cy="' + (cy + 2) + '" rx="7" ry="5.5" fill="none" stroke="' + INK2 + '" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + (cy - 6) + '" r="3.4" fill="none" stroke="' + INK2 + '" stroke-width="2"/>';
    var legAngles = [-55, -25, 25, 55];
    legAngles.forEach(function (deg) {
      var rad = deg * Math.PI / 180;
      var x1 = cx + Math.sin(rad) * 8, y1 = cy + 2 - Math.cos(rad) * 2;
      var x2 = cx + Math.sin(rad) * 20, y2 = cy + 2 + Math.abs(Math.sin(rad)) * 10;
      s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + INK2 + '" stroke-width="1.8" stroke-linecap="round"/>';
      var x2b = cx - Math.sin(rad) * 20;
      s += '<line x1="' + (cx - Math.sin(rad) * 8) + '" y1="' + y1 + '" x2="' + x2b + '" y2="' + y2 + '" stroke="' + INK2 + '" stroke-width="1.8" stroke-linecap="round"/>';
    });
    return s;
  }

  /* ---------- generic node/arrow/text helpers ---------- */

  function arrow(x1, y1, x2, y2) {
    return '<path d="M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2 + '" fill="none" stroke="' + GOLD + '" stroke-width="2" marker-end="url(#csd-arrow)"/>';
  }

  function curve(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
    return '<path d="M' + x1 + ',' + y1 + ' C' + c1x + ',' + c1y + ' ' + c2x + ',' + c2y + ' ' + x2 + ',' + y2 +
      '" fill="none" stroke="' + LINE + '" stroke-width="1.75" marker-end="url(#csd-arrow-soft)"/>';
  }

  function circleNode(cx, cy, r, opts) {
    opts = opts || {};
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (opts.fill || PAPER) + '" stroke="' + (opts.stroke || LINE) + '" stroke-width="2"/>';
  }

  function rectNode(x, y, w, h, opts) {
    opts = opts || {};
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (opts.rx || 16) + '" fill="' + (opts.fill || PAPER) + '" stroke="' + (opts.stroke || LINE) + '" stroke-width="2"/>';
  }

  function text(x, y, str, opts) {
    opts = opts || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (opts.anchor || 'middle') + '" font-size="' + (opts.size || 13) +
      '" font-weight="' + (opts.weight || 400) + '" font-style="' + (opts.italic ? 'italic' : 'normal') + '" fill="' + (opts.fill || INK2) + '">' + str + '</text>';
  }

  function pill(cx, cy, w, str) {
    var h = 28;
    return '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + PAPER + '" stroke="' + LINE + '" stroke-width="1.5"/>' +
      text(cx, cy + 4.5, str, { size: 12.5 });
  }

  function tagPill(cx, cy, w, str) {
    var h = 24;
    return '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + GOLD_WASH + '" stroke="' + GOLD_SOFT + '" stroke-width="1.5"/>' +
      text(cx, cy + 4, str, { size: 11, fill: '#5E3B08', weight: 600 });
  }

  var DEFS = '<defs>' +
    '<marker id="csd-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="' + GOLD + '"/></marker>' +
    '<marker id="csd-arrow-soft" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="' + LINE + '"/></marker>' +
    '</defs>';

  /* ---------- diagram: traditional search ---------- */

  function traditionalSearch() {
    var y = 160;
    var s = '<svg viewBox="0 0 980 260" role="img" aria-label="Diagram: a user query is keyword-identified, ranked by a vector search algorithm against site authority, performance, and sponsorships, and returned as links.">';
    s += DEFS;

    /* user */
    s += circleNode(60, y, 32);
    s += iconUser(60, y - 6);
    s += text(60, y + 55, 'User', { weight: 600 });

    s += arrow(95, y, 162, y);

    /* query box */
    s += rectNode(170, 105, 230, 110);
    s += text(285, 135, '“homes in Seattle, WA”', { size: 14.5, fill: INK });
    s += text(285, 158, '“3 bed · 1 bath”', { size: 14.5, fill: INK });
    s += text(285, 181, '“&lt; $200,000”', { size: 14.5, fill: INK });
    s += text(285, 232, 'Keyword identification', { size: 12, italic: true, fill: INK3 });

    s += arrow(400, y, 462, y);

    /* algorithm node (highlighted) */
    s += circleNode(495, y, 32, { fill: GOLD_WASH, stroke: GOLD });
    s += iconMagnifier(489, y - 7);
    s += text(495, y + 50, 'Vector search', { weight: 600, fill: INK });
    s += text(495, y + 66, 'algorithm', { weight: 600, fill: INK });

    /* fan-out to ranking factors */
    s += curve(523, 146, 548, 118, 552, 58, 573, 55);
    s += curve(523, 152, 548, 135, 552, 92, 573, 90);
    s += curve(523, 158, 540, 150, 552, 126, 573, 125);
    s += pill(650, 55, 150, 'Site authority');
    s += pill(650, 90, 150, 'Performance');
    s += pill(650, 125, 150, 'Sponsorships');

    /* main flow continues under the fan */
    s += arrow(527, y, 866, y);

    /* links node */
    s += circleNode(900, y, 32);
    s += iconLink(900, y - 3);
    s += text(900, y + 55, 'Links', { weight: 600 });

    s += '</svg>';
    return s;
  }

  /* ---------- diagram: agentic search ---------- */

  function agenticSearch() {
    var y = 172;
    var s = '<svg viewBox="0 0 1300 330" role="img" aria-label="Diagram: a natural-language user query is reasoned over by a model, run through a pretrained model, and centralizes lookup across the search index and live site interaction into a running query.">';
    s += DEFS;

    /* user */
    s += circleNode(60, y, 32);
    s += iconUser(60, y - 6);
    s += text(60, y + 55, 'User', { weight: 600 });

    s += arrow(95, y, 162, y);

    /* query box + annotation tags */
    s += rectNode(170, 110, 250, 120);
    s += tagPill(230, 65, 132, 'Expanded modality');
    s += tagPill(400, 65, 132, 'Picture + context');
    s += '<line x1="230" y1="78" x2="230" y2="110" stroke="' + LINE + '" stroke-width="1.5"/>';
    s += '<line x1="400" y1="78" x2="400" y2="110" stroke="' + LINE + '" stroke-width="1.5"/>';
    s += text(295, 156, '“I’m looking for a warm,', { size: 14, fill: INK });
    s += text(295, 179, 'summery neighborhood”', { size: 14, fill: INK });
    s += text(295, 252, 'Natural language, long-tail query', { size: 12, italic: true, fill: INK3 });

    s += arrow(420, y, 482, y);

    /* AI reasoning box (highlighted) */
    s += rectNode(490, 85, 230, 170, { fill: GOLD_WASH, stroke: GOLD, rx: 18 });
    s += iconSpark(605, 112, 12);
    s += text(605, 143, 'Agentic search', { weight: 700, size: 14.5, fill: INK });
    s += text(515, 166, '• Model knowledge of the internet', { anchor: 'start', size: 12.5 });
    s += text(515, 188, '• General thinking', { anchor: 'start', size: 12.5 });
    s += text(515, 210, '• Nuanced semantics & natural language', { anchor: 'start', size: 12.5 });

    s += arrow(720, y, 752, y);

    /* pretrained model node */
    s += rectNode(760, 132, 160, 80, { rx: 14, stroke: GOLD_SOFT });
    s += iconChip(795, y);
    s += text(848, y + 5, 'Opus 9.8', { weight: 700, size: 14, fill: INK });
    s += text(840, 228, 'Pretrained model', { size: 12, italic: true, fill: INK3 });

    /* branch to search index / live site */
    s += curve(920, y - 12, 960, 140, 1000, 105, 1010, 100);
    s += curve(920, y + 12, 960, 205, 1000, 240, 1010, 245);

    s += circleNode(1040, 100, 30);
    s += iconMagnifier(1034, 93);
    s += text(1040, 145, 'Search index', { weight: 600 });

    s += circleNode(1040, 245, 30);
    s += iconCursor(1040, 245);
    s += text(1040, 290, 'Live site search', { weight: 600 });
    s += text(1040, 306, '& interaction', { weight: 600 });

    /* merge into query running */
    s += curve(1070, 100, 1140, 100, 1160, 140, 1188, 160);
    s += curve(1070, 245, 1140, 245, 1160, 205, 1188, 185);

    s += circleNode(1225, y, 34);
    s += iconSpider(1225, y);
    s += text(1225, y + 58, 'Query running', { weight: 600 });

    s += '</svg>';
    return s;
  }

  var DIAGRAMS = {
    traditional: {
      eyebrow: 'Model — traditional search',
      intro: 'Traditional search engines use a crawler to analyze sites, then act as a ranked referrer.',
      svg: traditionalSearch
    },
    agentic: {
      eyebrow: 'Model — agentic search',
      intro: 'Agentic search experiences leverage models and agents to centralize info lookup and tasks within the search platform. More nuanced, complex search semantics are unlocked as well.',
      svg: agenticSearch
    }
  };

  function build(d) {
    return '<div class="csd-exhibit">' +
      '<p class="csd-eyebrow">' + d.eyebrow + '</p>' +
      '<p class="csd-intro">' + d.intro + '</p>' +
      '<p class="csd-scrollhint">&larr; scroll sideways if it doesn’t fit &rarr;</p>' +
      '<div class="csd-frame">' + d.svg() + '</div>' +
      '</div>';
  }

  /* prevents a flex/grid ancestor's default min-width:auto from
     blowing the whole page wider to fit the SVG's min-width — same
     technique as case-study-workflow.js's fitWide (which cites
     case-study-funnel.js / case-study-schema-viz.js as the
     originals). Without this, overflow-x:auto on .csd-frame never
     gets a chance to clip/scroll, because its ancestors grow to
     accommodate the content instead of constraining it. */
  function clearMinWidth(el) {
    var col = el.closest('.cs-content');
    if (!col) return;
    for (var a = el; a && a !== col; a = a.parentElement) a.style.minWidth = '0px';
  }

  function boot() {
    var mounts = document.querySelectorAll('[data-diagram]');
    Array.prototype.forEach.call(mounts, function (el) {
      var d = DIAGRAMS[el.dataset.diagram];
      if (!d) return;
      el.innerHTML = build(d);
      el.classList.add('csd-mount');
      clearMinWidth(el);
    });
  }

  boot();
})();
