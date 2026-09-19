/* ============================================================
   case-study-render.js — turns a window.CASE_STUDY object into
   the DOM for a case study page. One content object in, one
   full page out — new case studies are a new content file plus
   a copy of the shell HTML, no template edits required.
   ============================================================ */

(function () {
  'use strict';

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  function num(i) { return String(i + 1).padStart(2, '0'); }

  /* a block is either a paragraph string or an annotation object
     { note: 'summary text', body: 'expanded text' } rendered right
     after the paragraph before it */
  function prose(blocks) {
    return '<div class="cs-prose">' + blocks.map(function (b) {
      if (typeof b === 'string') return '<p>' + esc(b) + '</p>';
      if (b.quote) {
        return '<blockquote class="cs-quote">' + esc(b.quote) +
          (b.cite ? '<cite>' + esc(b.cite) + '</cite>' : '') + '</blockquote>';
      }
      if (b.note) {
        return '<details class="cs-note"><summary>' + esc(b.note) + '</summary>' +
          '<div class="cs-note__body">' + esc(b.body) + '</div></details>';
      }
      return '';
    }).join('') + '</div>';
  }

  function personas(list) {
    return '<div class="cs-personas">' + list.map(function (p) {
      return '<article class="cs-persona">' +
        '<h3 class="cs-persona__name">' + esc(p.name) + '</h3>' +
        '<p class="cs-persona__role">' + esc(p.role) + '</p>' +
        (p.quote ? '<p class="cs-persona__quote">“' + esc(p.quote) + '”</p>' : '') +
        (p.needs ? '<ul class="cs-persona__needs">' + p.needs.map(function (n) {
          return '<li>' + esc(n) + '</li>';
        }).join('') + '</ul>' : '') +
        '</article>';
    }).join('') + '</div>';
  }

  function goals(list) {
    return '<div class="cs-goals">' + list.map(function (g, i) {
      return '<div class="cs-goal">' +
        '<span class="cs-goal__mark">' + (i + 1) + '</span>' +
        '<div><p class="cs-goal__label">' + esc(g.label) + '</p>' +
          (g.detail ? '<p class="cs-goal__detail">' + esc(g.detail) + '</p>' : '') +
        '</div></div>';
    }).join('') + '</div>';
  }

  /* Illustrated houses along the road, drawn isometrically the same
     way case-study-schema-viz.js's building is: a front face + a
     receding side face + (for walls) a top face, each a flat fill
     with no stroke — the tone contrast between faces is what reads
     as 3D, not an outline. `poly` mirrors schema-viz's own helper.

     Scenes grow from one bare house (phase 1) to a house with a
     fence (phase 2) to a small neighborhood of houses (phase 3),
     cycling by index if there are more than three phases — so the
     picture itself carries "this got bigger" without a per-phase
     icon field. The finish scene is a bigger, gold house with a
     spark over the roof for the destination. */
  function poly(pts) {
    return pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
  }

  /* one house, in local ground-plane coordinates: (x, groundY) is the
     bottom-left of the wall before the depth offset. dx/dy is the
     same isometric depth offset schema-viz uses (receding up-right). */
  function houseUnit(x, groundY, scale, tier, withWindows) {
    var w = 60 * scale, wallH = 34 * scale, roofH = 26 * scale;
    var dx = 14 * scale, dy = -10 * scale, overhang = 6 * scale;
    var x2 = x + w, yTop = groundY - wallH;
    var apex = [x + w / 2, yTop - roofH];
    var apexBack = [apex[0] + dx, apex[1] + dy];
    var cls = 'cs-house--' + tier;
    var s = '';
    s += '<polygon class="cs-house__f cs-house__f--wall-side ' + cls + '" points="' +
      poly([[x2, yTop], [x2, groundY], [x2 + dx, groundY + dy], [x2 + dx, yTop + dy]]) + '"/>';
    s += '<rect class="cs-house__f cs-house__f--wall-front ' + cls + '" x="' + x + '" y="' + yTop + '" width="' + w + '" height="' + wallH + '"/>';
    s += '<polygon class="cs-house__f cs-house__f--roof-side ' + cls + '" points="' +
      poly([[x2 + overhang, yTop], apex, apexBack, [x2 + overhang + dx, yTop + dy]]) + '"/>';
    s += '<polygon class="cs-house__f cs-house__f--roof-front ' + cls + '" points="' +
      poly([[x - overhang, yTop], [x2 + overhang, yTop], apex]) + '"/>';
    var doorW = w * 0.28, doorH = wallH * 0.6;
    s += '<rect class="cs-house__f cs-house__f--door ' + cls + '" x="' + (x + w / 2 - doorW / 2) + '" y="' + (groundY - doorH) + '" width="' + doorW + '" height="' + doorH + '"/>';
    if (withWindows) {
      var win = w * 0.16;
      s += '<rect class="cs-house__f cs-house__f--win ' + cls + '" x="' + (x + w * 0.14) + '" y="' + (yTop + wallH * 0.22) + '" width="' + win + '" height="' + win + '"/>';
      s += '<rect class="cs-house__f cs-house__f--win ' + cls + '" x="' + (x + w * 0.7) + '" y="' + (yTop + wallH * 0.22) + '" width="' + win + '" height="' + win + '"/>';
    }
    return s;
  }

  function fence(x, groundY, w) {
    var pickets = 5, s = '<line class="cs-house__fence" x1="' + x + '" y1="' + (groundY - 9) + '" x2="' + (x + w) + '" y2="' + (groundY - 9) + '"/>';
    for (var k = 0; k < pickets; k++) {
      var px = x + (w / (pickets - 1)) * k;
      s += '<line class="cs-house__fence" x1="' + px + '" y1="' + (groundY - 13) + '" x2="' + px + '" y2="' + groundY + '"/>';
    }
    return s;
  }

  /* a symmetric 4-point star (outer radius r, inner radius .38r) —
     computed as absolute points, not chained relative deltas, so
     the shape can't come out lopsided or unclosed */
  function sparkAt(cx, cy, r) {
    var o = r, ir = r * .38;
    return '<path class="cs-road-scene__spark" d="' +
      'M' + cx + ' ' + (cy - o) +
      'L' + (cx + ir) + ' ' + (cy - ir) +
      'L' + (cx + o) + ' ' + cy +
      'L' + (cx + ir) + ' ' + (cy + ir) +
      'L' + cx + ' ' + (cy + o) +
      'L' + (cx - ir) + ' ' + (cy + ir) +
      'L' + (cx - o) + ' ' + cy +
      'L' + (cx - ir) + ' ' + (cy - ir) + 'Z"/>';
  }

  var ROAD_SCENES = [
    /* phase 1 — one bare house, nothing extra */
    function () {
      return '<svg viewBox="0 0 100 90" class="cs-road-scene__svg" aria-hidden="true">' +
        houseUnit(14, 76, 1, 't1', false) +
        '</svg>';
    },
    /* phase 2 — the same house, now with windows and a fence */
    function () {
      return '<svg viewBox="0 0 160 90" class="cs-road-scene__svg" aria-hidden="true">' +
        fence(2, 76, 30) + fence(126, 76, 30) +
        houseUnit(40, 76, 1, 't1', true) +
        '</svg>';
    },
    /* phase 3 — a small neighborhood: three houses in a row */
    function () {
      return '<svg viewBox="0 0 210 96" class="cs-road-scene__svg" aria-hidden="true">' +
        houseUnit(4, 80, 0.72, 't2', true) +
        houseUnit(76, 86, 0.82, 't1', true) +
        houseUnit(150, 80, 0.7, 't3', true) +
        '</svg>';
    }
  ];
  function houseScene(i) {
    return ROAD_SCENES[i % ROAD_SCENES.length]();
  }
  function finishScene() {
    var ox = 20, groundY = 92, scale = 1.5;
    var apexX = ox + (60 * scale) / 2, apexY = groundY - 34 * scale - 26 * scale;
    return '<svg viewBox="0 -34 170 174" class="cs-road-scene__svg cs-road-scene__svg--finish" aria-hidden="true">' +
      sparkAt(apexX, apexY - 16, 11) +
      houseUnit(ox, groundY, scale, 'gold', true) +
      '</svg>';
  }

  /* the stretch of road between two houses: a thick grey base with
     a dashed gold lane line, spanning the full width so it can loop
     toward whichever side the next house sits on. One canonical
     path (leaving top-right) is mirrored with CSS scaleX(-1) for
     the opposite direction — see .cs-road-stop__link--mirror in
     case-study.css. It leaves the top-right corner, loops all the
     way around (the
     large-arc-flag forces the long way, not the short way, between
     the two points) and finishes on a dead-vertical line straight
     down into the next house — the "curve around, then lunge
     straight down" the reference asked for. */
  var ROAD_LINK_D = 'M92,4 A48,38 0 1 1 16,52 L16,90';
  function roadLink(targetAlign) {
    return '<span class="cs-road-stop__link' + (targetAlign === 'right' ? ' cs-road-stop__link--mirror' : '') + '" aria-hidden="true">' +
      '<svg viewBox="0 0 106 90" preserveAspectRatio="none">' +
        '<path class="cs-road-stop__link-base" d="' + ROAD_LINK_D + '"/>' +
        '<path class="cs-road-stop__link-lane" d="' + ROAD_LINK_D + '"/>' +
      '</svg></span>';
  }

  /* Renders `phases` as two pieces:
       1. an infographic road — a house scene per phase, title, and
          a couple of short highlights, alternating left/right of the
          road to form an S-curve, ending at an optional destination
          `landing` at the bottom;
       2. the full detail (body + bullets) as plain paragraphs that
          flow into each other underneath, no card styling. */
  function roadAlign(i) { return i % 2 === 0 ? 'right' : 'left'; }

  function roadmap(sec) {
    var stops = sec.phases.map(function (ph, i) {
      var a = roadAlign(i);
      return '<li class="cs-road-stop cs-road-stop--' + a + '">' +
        (i === 0 ? '<span class="cs-road-start">Start</span>' : roadLink(a)) +
        '<div class="cs-road-stop__scene">' +
          '<span class="cs-road-stop__house" aria-hidden="true">' + houseScene(i) + '</span>' +
          '<div class="cs-road-stop__label">' +
            (ph.tag ? '<span class="cs-road-stop__tag">' + esc(ph.tag) + '</span>' : '') +
            '<h3 class="cs-road-stop__title">' + esc(ph.title) + '</h3>' +
            (ph.highlights ? '<ul class="cs-road-stop__highlights">' + ph.highlights.map(function (h) {
              return '<li>' + esc(h) + '</li>';
            }).join('') + '</ul>' : '') +
          '</div>' +
        '</div>' +
        '</li>';
    }).join('');

    var finishAlign = roadAlign(sec.phases.length);
    var infographic = '<div class="cs-road">' +
      '<ol class="cs-road-list">' + stops + '</ol>' +
      (sec.landing ? '<div class="cs-road-finish cs-road-finish--' + finishAlign + '">' + roadLink(finishAlign) +
        '<div class="cs-road-finish__scene">' +
          '<span class="cs-road-finish__house" aria-hidden="true">' + finishScene() + '</span>' +
          '<div class="cs-road-finish__label">' +
            '<span class="cs-road-finish__tag">Finish</span>' +
            '<p class="cs-road-finish__copy">' + esc(sec.landing) + '</p>' +
          '</div>' +
        '</div></div>' : '') +
      '</div>';

    var detail = '<div class="cs-road-detail">' + sec.phases.map(function (ph) {
      return (ph.body ? '<p><strong>' + esc(ph.tag || ph.title) + '.</strong> ' + esc(ph.body) + '</p>' : '') +
        (ph.bullets ? '<ul class="cs-road-detail__bullets">' + ph.bullets.map(function (b) {
          return '<li>' + esc(b) + '</li>';
        }).join('') + '</ul>' : '');
    }).join('') + '</div>';

    return infographic + detail;
  }

  function deepdive(d) {
    return '<div class="cs-deepdive">' +
      (d.frameLabel ? '<div class="cs-deepdive__frame">' + esc(d.frameLabel) + '</div>' : '') +
      prose(d.body) +
      '</div>';
  }

  function stack(items) {
    return '<div class="cs-stack">' + items.map(function (s) {
      return '<span class="cs-chip">' + esc(s) + '</span>';
    }).join('') + '</div>';
  }

  function metrics(list) {
    return '<div class="cs-metrics">' + list.map(function (m) {
      return '<div class="cs-metric">' +
        '<div class="cs-metric__value">' + esc(m.value) + '</div>' +
        '<div class="cs-metric__label">' + esc(m.label) + '</div>' +
        '</div>';
    }).join('') + '</div>';
  }

  /* An interactive decision funnel. Emits only a mount point —
     case-study-funnel.js finds it by [data-funnel] and builds the
     diagram from window.CS_FUNNELS[key]. Load that script and the
     matching data file on any page that uses one. */
  function funnel(key) {
    return '<div data-funnel="' + esc(key) + '"></div>';
  }

  /* A before/after structured-markup visualization. Emits only a
     mount point — case-study-schema-viz.js finds it by
     [data-schema-viz] and builds from window.CS_SCHEMA_VIZ[key].
     Load that script and the matching data file on any page that
     uses one. */
  function schemaViz(key) {
    return '<div data-schema-viz="' + esc(key) + '"></div>';
  }

  /* The INITIAL/IMPROVED + full-flow workflow diagrams. Emits only a
     mount point — case-study-workflow.js finds it by [data-workflow]
     and builds from window.CS_WORKFLOWS[key]. Load that script and
     the matching data file on any page that uses one. */
  function workflow(key) {
    return '<div data-workflow="' + esc(key) + '"></div>';
  }

  /* A bespoke, hand-laid-out node/arrow SVG diagram — for a
     one-off illustration that needs to closely replicate a
     specific reference (a sketch, a whiteboard photo), rather
     than a reusable data-driven visualization. Emits only a
     mount point — case-study-diagram.js finds it by [data-diagram]
     and builds the fixed SVG registered under that key. Load that
     script and case-study-diagram.css on any page that uses one. */
  function diagram(key) {
    return '<div data-diagram="' + esc(key) + '"></div>';
  }

  function section(sec, i) {
    var inner = '';
    if (sec.body) inner += prose(sec.body);
    if (sec.personas) inner += personas(sec.personas);
    if (sec.goals) inner += goals(sec.goals);
    if (sec.phases) inner += roadmap(sec);
    if (sec.funnel) inner += funnel(sec.funnel);
    if (sec.deepdive) inner += deepdive(sec.deepdive);
    if (sec.schemaViz) inner += schemaViz(sec.schemaViz);
    if (sec.workflow) inner += workflow(sec.workflow);
    if (sec.diagram) inner += diagram(sec.diagram);
    if (sec.metrics) inner += metrics(sec.metrics);
    if (sec.stack) inner += '<h3 class="cs-goal__label" style="margin-top:1.5rem">' +
      esc(sec.stackLabel || 'Stack') + '</h3>' + stack(sec.stack);

    return '<section class="cs-section" id="' + esc(sec.id) + '">' +
      '<h2 class="cs-section__title"><span class="cs-section__num">' + num(i) + '</span>' +
        esc(sec.title) + '</h2>' +
      inner +
      '</section>';
  }

  function toc(sections) {
    var items = sections.map(function (s, i) {
      return '<li><a href="#' + esc(s.id) + '">' + esc(s.navLabel || s.title) + '</a></li>';
    }).join('');
    return {
      rail: '<nav class="cs-toc" aria-label="On this page">' +
        '<p class="cs-toc__label">On this page</p><ol>' + items + '</ol></nav>',
      mobile: '<details class="cs-toc-mobile"><summary>On this page</summary><ol>' + items + '</ol></details>'
    };
  }

  window.renderCaseStudy = function (mount) {
    var C = window.CASE_STUDY;
    var t = toc(C.sections);

    document.title = C.meta.title + ' — Ethan Wong';

    mount.innerHTML = '' +
      '<header class="cs-hero">' +
        '<div class="u-wrap">' +
          '<div class="cs-tags">' + C.meta.tags.map(function (tag) {
            return '<span class="cs-tag">' + esc(tag) + '</span>';
          }).join('') + '</div>' +
          '<h1 class="cs-hero__title">' + esc(C.meta.title) + '</h1>' +
          '<p class="cs-hero__summary">' + esc(C.meta.summary) + '</p>' +
          '<dl class="cs-facts">' + C.meta.facts.map(function (f) {
            return '<div class="cs-fact"><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>';
          }).join('') + '</dl>' +
          (C.meta.links && C.meta.links.length ? '<div class="cs-hero__links">' + C.meta.links.map(function (l) {
            return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) +
              '<span aria-hidden="true">&#8599;</span></a>';
          }).join('') + '</div>' : '') +
        '</div>' +
      '</header>' +

      '<div class="u-wrap cs-body">' +
        t.rail +
        '<div class="cs-content">' +
          t.mobile +
          '<div class="cs-sections">' + C.sections.map(section).join('') + '</div>' +
        '</div>' +
      '</div>' +

      '<footer class="cs-foot"><div class="u-wrap">' +
        '<div>' +
          '<p class="cs-foot__cta">' + esc(C.footer.line) + '</p>' +
          '<a class="cs-foot__mail" href="mailto:' + esc(C.footer.email) + '">' + esc(C.footer.email) + '</a>' +
        '</div>' +
        '<nav class="cs-foot__nav" aria-label="More">' +
          C.footer.links.map(function (l) {
            return '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>';
          }).join('') +
        '</nav>' +
      '</div></footer>';
  };
})();
