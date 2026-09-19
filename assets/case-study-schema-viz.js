/* ============================================================
   case-study-schema-viz.js — the structured-markup before/after
   visualization: two exhibits (page source, then graph topology)
   plus a 3-floor isometric "house" takeaway.

   Drops into a case study the same way the funnel does: a section
   emits <div data-schema-viz="key"></div> (see case-study-render.js),
   and this file finds it and builds from window.CS_SCHEMA_VIZ[key]
   (see schema-viz-data-<key>.js for the shape). Load this script
   AFTER renderCaseStudy() runs, so the mount exists.

   Namespaced csx- throughout so it can't collide with case-study.css
   or case-study-funnel.css. Depends on tokens.css for the palette.

   Node SHAPE (not hue) carries "type" in the after-graph — the rest
   of this site keeps color single-accent (see case-study-funnel.css),
   so richness is shown by variety of form, and gold is reserved for
   "this is the improved state," not for distinguishing schema types.
   The house's 3 tiers use a single-hue depth ramp for the same reason
   (see HOUSE_TIERS below) — shade encodes "which floor," not category.
   ============================================================ */

(function () {
  'use strict';

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  /* ---------- full-bleed: measured, not guessed ----------
     Same technique as case-study-funnel.js's fitWide — both exhibits
     need real width to show before/after side by side "in one glance"
     instead of forcing a scroll, and .cs-sections caps normal prose
     at --measure (64ch). Measuring .cs-content (the grid's content
     track) rather than .u-wrap keeps this from bleeding into the
     sticky TOC rail's column. */
  function fitWide(el) {
    var col = el.closest('.cs-content');
    if (!col) return;
    el.style.width = '';
    el.style.marginLeft = '';
    for (var a = el; a && a !== col; a = a.parentElement) a.style.minWidth = '0px';
    var cr = col.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    if (cr.width <= er.width + 1) return;
    el.style.marginLeft = Math.round(cr.left - er.left) + 'px';
    el.style.width = Math.round(cr.width) + 'px';
  }

  /* ---------- Exhibit A: page source ---------- */

  function codeBefore(b) {
    var lines = b.html.map(function (l) {
      var cls = 'csx-code__line' + (l.kind === 'hit' ? ' csx-code__line--hit' : '');
      return '<span class="' + cls + '">' + esc(l.tag) + '</span>';
    }).join('\n');
    return '' +
      '<div class="csx-panel">' +
        '<div class="csx-panel__head"><span class="csx-panel__label">' + esc(b.label) + '</span>' +
          '<span class="csx-panel__caption">' + esc(b.caption) + '</span></div>' +
        '<pre class="csx-code"><code>' + lines + '</code></pre>' +
        '<p class="csx-hitnote">' + esc(b.hitLabel) + '</p>' +
      '</div>';
  }

  function codeAfter(a) {
    var lines = a.headJson.map(function (l) {
      return '<span class="csx-code__line csx-code__line--ld">' + esc(l) + '</span>';
    }).join('\n');
    return '' +
      '<div class="csx-panel csx-panel--after">' +
        '<div class="csx-panel__head"><span class="csx-panel__label">' + esc(a.label) + '</span>' +
          '<span class="csx-panel__caption">' + esc(a.caption) + '</span></div>' +
        '<div class="csx-tag">&lt;head&gt;</div>' +
        '<pre class="csx-code csx-code--ld"><code>' + lines + '</code></pre>' +
        '<p class="csx-hitnote">' + esc(a.bodyNote) + '</p>' +
      '</div>';
  }

  function exhibitA(d) {
    return '' +
      '<div class="csx-exhibit">' +
        '<p class="csx-eyebrow">' + esc(d.eyebrow) + '</p>' +
        '<p class="csx-intro">' + esc(d.intro) + '</p>' +
        '<div class="csx-pair csx-pair--code">' +
          codeBefore(d.before) + '<div class="csx-arrow" aria-hidden="true">&#8594;</div>' + codeAfter(d.after) +
        '</div>' +
      '</div>';
  }

  /* ---------- Exhibit B: graph topology ---------- */

  function shape(kind, x, y, r) {
    if (kind === 'sq') {
      return '<rect class="csx-node" x="' + (x - r) + '" y="' + (y - r) + '" width="' + (r * 2) + '" height="' + (r * 2) + '" rx="2"/>';
    }
    if (kind === 'tri') {
      return '<polygon class="csx-node" points="' + x + ',' + (y - r) + ' ' + (x + r) + ',' + (y + r) + ' ' + (x - r) + ',' + (y + r) + '"/>';
    }
    if (kind === 'di') {
      return '<polygon class="csx-node" points="' + x + ',' + (y - r) + ' ' + (x + r) + ',' + y + ' ' + x + ',' + (y + r) + ' ' + (x - r) + ',' + y + '"/>';
    }
    return '<circle class="csx-node" cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
  }

  function edge(x1, y1, x2, y2) {
    return '<line class="csx-edge" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
  }

  function topologyBefore() {
    var pairs = [
      [28, 28, 28, 62], [82, 18, 68, 52], [138, 34, 150, 66],
      [198, 14, 214, 44], [244, 58, 230, 88],
      [56, 118, 46, 152], [122, 128, 136, 160], [188, 114, 204, 148], [248, 138, 238, 172]
    ];
    var s = pairs.map(function (p) {
      return edge(p[0], p[1], p[2], p[3]) +
        shape('circ', p[0], p[1], 5) +
        shape('circ', p[2], p[3], 4);
    }).join('');
    return '<svg class="csx-svg csx-svg--before" viewBox="0 0 280 200" role="img" aria-label="Before: disconnected fragments with no shared structure">' + s + '</svg>';
  }

  /* A much richer, 4-level nested tree — the point is that density
     comes WITH structure, not instead of it: every one of ~25 nodes
     still traces a clean path back to one root, unlike the scattered
     "before". Two-pass tidy-tree layout: leaves get an x slot in
     left-to-right order (post-order), then every ancestor's x is the
     midpoint of its own children — no manual coordinates to hand-tune. */
  var AFTER_TREE = {
    shape: 'circ',
    children: [
      { shape: 'sq', children: [
        { shape: 'di' }, { shape: 'circ' },
        { shape: 'tri', children: [{ shape: 'di' }, { shape: 'circ' }] }
      ] },
      { shape: 'circ', children: [
        { shape: 'sq' }, { shape: 'di' }, { shape: 'tri' }, { shape: 'circ' }
      ] },
      { shape: 'tri', children: [
        { shape: 'circ', children: [{ shape: 'sq' }, { shape: 'di' }, { shape: 'circ' }] },
        { shape: 'sq' }
      ] },
      { shape: 'di', children: [
        { shape: 'tri' }, { shape: 'circ' }, { shape: 'sq' }
      ] },
      { shape: 'sq', children: [
        { shape: 'circ' }, { shape: 'tri' }
      ] }
    ]
  };

  function layoutTree(root, slot, levelGap, topY) {
    var leafI = 0;
    (function assignX(n, depth) {
      n._depth = depth;
      if (n.children && n.children.length) {
        n.children.forEach(function (c) { assignX(c, depth + 1); });
        n._x = (n.children[0]._x + n.children[n.children.length - 1]._x) / 2;
      } else {
        n._x = leafI * slot + slot / 2;
        leafI++;
      }
      n._y = topY + depth * levelGap;
    })(root, 0);

    var nodes = [], edges = [];
    (function collect(n) {
      nodes.push(n);
      (n.children || []).forEach(function (c) {
        edges.push([n._x, n._y, c._x, c._y]);
        collect(c);
      });
    })(root);
    return { nodes: nodes, edges: edges, width: leafI * slot };
  }

  function topologyAfter() {
    var R_BY_DEPTH = [9, 7.5, 6, 5];
    var laid = layoutTree(AFTER_TREE, 24, 46, 18);
    var s = laid.edges.map(function (e) { return edge(e[0], e[1], e[2], e[3]); }).join('');
    s += laid.nodes.map(function (n) {
      var out = shape(n.shape, n._x, n._y, R_BY_DEPTH[n._depth] || 5);
      return n._depth === 0 ? out.replace('class="csx-node"', 'class="csx-node csx-node--root"') : out;
    }).join('');
    var vw = laid.width + 16, vh = 18 + 3 * 46 + 20;
    return '<svg class="csx-svg csx-svg--after" viewBox="0 0 ' + vw + ' ' + vh +
      '" role="img" aria-label="After: one rooted, deeply nested, typed graph">' + s + '</svg>';
  }

  function realExample(r) {
    if (!r) return '';
    return '' +
      '<figure class="csx-real">' +
        '<img class="csx-real__img" src="' + esc(r.img) + '" alt="' + esc(r.alt) + '" loading="lazy">' +
        '<figcaption>' + esc(r.caption) + ' ' +
          '<a href="' + esc(r.sourceHref) + '" target="_blank" rel="noopener">' + esc(r.sourceLabel) + '</a>' +
        '</figcaption>' +
      '</figure>';
  }

  function exhibitB(d) {
    return '' +
      '<div class="csx-exhibit">' +
        '<p class="csx-eyebrow">' + esc(d.eyebrow) + '</p>' +
        '<p class="csx-intro">' + esc(d.intro) + '</p>' +
        '<div class="csx-pair csx-pair--topo">' +
          '<figure class="csx-figure"><figcaption>' + esc(d.before.label) + ' — ' + esc(d.before.caption) + '</figcaption>' + topologyBefore() + '</figure>' +
          '<div class="csx-arrow" aria-hidden="true">&#8594;</div>' +
          '<figure class="csx-figure"><figcaption>' + esc(d.after.label) + ' — ' + esc(d.after.caption) + '</figcaption>' + topologyAfter() + '</figure>' +
        '</div>' +
        realExample(d.realExample) +
      '</div>';
  }

  /* ---------- the house: 3 isometric floors + a hip roof ----------
     One solid, front + right faces per floor (light on front, darker
     on the receding side — same light-from-front-left convention as
     a typical isometric pyramid diagram), sliced apart by small gaps,
     each with a ribbon flag carrying that floor's point. Tone gets
     deeper toward the base, like sediment — richest/lightest idea up
     top, foundation at the bottom. */
  var HOUSE_TIERS = ['t1', 't2', 't3'];

  var HOUSE_ICON = {
    richness: '<circle cx="5" cy="17" r="2"/><circle cx="12" cy="6" r="3"/><circle cx="19" cy="15" r="2.4"/>',
    topology: '<circle cx="12" cy="4.5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/>' +
      '<path d="M12 6.7L5.6 16.8M12 6.7l6.4 10.1" stroke="currentColor" stroke-width="1.5" fill="none"/>',
    ease: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>'
  };
  function houseIcon(k) {
    return '<svg class="csx-hico" viewBox="0 0 24 24" aria-hidden="true">' + (HOUSE_ICON[k] || HOUSE_ICON.ease) + '</svg>';
  }

  function poly(pts) {
    return pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
  }

  /* front + right + top faces for one block (a floor, the roof cap,
     or the parapet ledge) — everything in this building is the same
     solid, just at different heights and tones. */
  function blockFaces(g, tier, dx, dy, extraCls) {
    var x2 = g.x + g.w, cls = tier + (extraCls || '');
    var s = '<rect class="csx-hf csx-hf--front csx-hf--' + cls + '" x="' + g.x + '" y="' + g.yTop +
      '" width="' + g.w + '" height="' + (g.yBot - g.yTop) + '"/>';
    s += '<polygon class="csx-hf csx-hf--side csx-hf--' + cls + '" points="' +
      poly([[x2, g.yTop], [x2, g.yBot], [x2 + dx, g.yBot + dy], [x2 + dx, g.yTop + dy]]) + '"/>';
    s += '<polygon class="csx-hf csx-hf--top csx-hf--' + cls + '" points="' +
      poly([[g.x, g.yTop], [x2, g.yTop], [x2 + dx, g.yTop + dy], [g.x + dx, g.yTop + dy]]) + '"/>';
    return s;
  }

  /* a row of windows across one floor's front face — a couple are
     "occupied" (a tiny head-and-shoulders silhouette) to read as a
     lived-in building rather than a diagram of a box. */
  var LIT_WINDOWS = { t1: [2], t2: [0], t3: [1, 3] };
  function windowsFor(g, tier) {
    var cols = 4, margin = 16, gap = 10;
    var w = (g.w - 2 * margin - (cols - 1) * gap) / cols;
    var h = (g.yBot - g.yTop) * 0.44;
    var y = g.yTop + ((g.yBot - g.yTop) - h) / 2;
    var lit = LIT_WINDOWS[tier] || [];
    var s = '';
    for (var c = 0; c < cols; c++) {
      var x = g.x + margin + c * (w + gap);
      s += '<rect class="csx-win" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.5"/>';
      if (lit.indexOf(c) !== -1) {
        var cx = x + w / 2, headR = w * 0.17, headY = y + h * 0.32;
        var tw = w * 0.34, bw = w * 0.56, shoulderY = y + h * 0.5;
        s += '<circle class="csx-win__person" cx="' + cx + '" cy="' + headY + '" r="' + headR + '"/>';
        s += '<polygon class="csx-win__person" points="' +
          poly([[cx - tw / 2, shoulderY], [cx + tw / 2, shoulderY], [cx + bw / 2, y + h], [cx - bw / 2, y + h]]) + '"/>';
      }
    }
    return s;
  }

  function house(d) {
    /* The 3D building is pure SVG (scales cleanly to any width). The
       ribbon text is plain HTML next to it, not inside a foreignObject
       — foreignObject content gets scaled by the SVG's own viewBox
       transform, which would shrink the text unreadably small once
       the building is squeezed onto a narrow phone screen. */
    var FX = 10, FW = 176;               /* front face x, width */
    var DX = 34, DY = -20;               /* isometric depth offset */
    var FH = 74, GAP = 10;               /* floor height, gap between floors */
    var CAP_H = 20, LEDGE_H = 8, LEDGE_INSET = 12;   /* flat roof + parapet */
    var baseY = 322;

    var floorsGeo = [];                  /* bottom to top for drawing order */
    var y = baseY;
    for (var i = 2; i >= 0; i--) {
      var yTop = y - FH;
      floorsGeo[i] = { yTop: yTop, yBot: y, x: FX, w: FW };
      y = yTop - GAP;
    }
    var capYBot = floorsGeo[0].yTop - GAP;
    var capGeo = { x: FX, yTop: capYBot - CAP_H, yBot: capYBot, w: FW };
    var ledgeGeo = { x: FX + LEDGE_INSET, yTop: capGeo.yTop - LEDGE_H, yBot: capGeo.yTop, w: FW - LEDGE_INSET * 2 };

    var shapesSvg = '';

    /* floors, bottom to top so higher floors paint over lower ones' depth face */
    for (var t = 2; t >= 0; t--) {
      var g = floorsGeo[t], tier = HOUSE_TIERS[t];
      shapesSvg += blockFaces(g, tier, DX, DY);
      shapesSvg += windowsFor(g, tier);
    }

    /* flat roof: a short cap block plus a slightly narrower parapet
       ledge on top — reads as a building rooftop, not a house gable.
       Drawn LAST so it paints over the top floor's depth face instead
       of being hidden behind it. */
    shapesSvg += blockFaces(capGeo, 'roof', DX, DY);
    shapesSvg += blockFaces(ledgeGeo, 'roof', DX, DY, ' csx-hf--ledge');

    var viewTop = ledgeGeo.yTop + DY - 8, viewRight = FX + FW + DX + 10, viewBottom = baseY + 14;
    var svg = '<svg class="csx-house-svg" viewBox="0 ' + viewTop + ' ' + viewRight + ' ' + (viewBottom - viewTop) +
      '" role="img" aria-label="A 3-story apartment building, one story per takeaway">' + shapesSvg + '</svg>';

    var ribbonsHtml = d.floors.map(function (f, i) {
      var tier = HOUSE_TIERS[i];
      return '<div class="csx-ribbon csx-ribbon--' + tier + '">' +
        '<span class="csx-ribbon__num">0' + (i + 1) + '</span>' +
        houseIcon(f.icon) +
        '<div class="csx-ribbon__text"><strong>' + esc(f.title) + '</strong><span>' + esc(f.body) + '</span></div>' +
      '</div>';
    }).join('');

    return '' +
      '<div class="csx-exhibit">' +
        '<p class="csx-eyebrow">' + esc(d.eyebrow) + '</p>' +
        '<p class="csx-intro">' + esc(d.intro) + '</p>' +
        '<div class="csx-house-row">' +
          '<div class="csx-house-fig">' + svg + '</div>' +
          '<div class="csx-ribbons">' + ribbonsHtml + '</div>' +
        '</div>' +
      '</div>';
  }

  function build(d) {
    return '<div class="csx">' + exhibitA(d.exhibitA) + exhibitB(d.exhibitB) + house(d.house) + '</div>';
  }

  function boot() {
    var mounts = document.querySelectorAll('[data-schema-viz]');
    Array.prototype.forEach.call(mounts, function (el) {
      var d = window.CS_SCHEMA_VIZ && window.CS_SCHEMA_VIZ[el.dataset.schemaViz];
      if (!d) return;
      el.innerHTML = build(d);
      el.classList.add('csx-mount');
      fitWide(el);
      var raf;
      window.addEventListener('resize', function () {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () { fitWide(el); });
      }, { passive: true });
    });
  }

  boot();
})();
