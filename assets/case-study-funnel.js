/* ============================================================
   case-study-funnel.js — the decision-funnel component.

   USAGE
     1. Load tokens.css + case-study-funnel.css.
     2. Load a data file that registers itself, e.g.
        assets/funnel-data-zsm.js  ->  window.CS_FUNNELS.zsm
     3. Give a case-study section `funnel: 'zsm'`, or drop
        <div data-funnel="zsm"></div> anywhere in the page.
     4. Load this file. It mounts every [data-funnel] it finds.

   DATA SHAPE — see funnel-data-zsm.js for a worked example.
     { stages: [{key,label} x5],
       threads: [{ user, userEg, bots:[{t,s}], cat, catSub,
                   candidates:[{label,won}], dec, decSub,
                   d: { icon, userNeed, userQuote,
                        bots:[{name,points[]}],
                        catDef, catSubs:[{k,v}], catNeeds[],
                        weighing:[{head,bullets[],sub:[{k,v}]}],
                        decision:[{k,v,proof[],items:[{t,b[]}]}] } }] }

   The five stages are fixed by design — this is a funnel, not a
   generic flow chart. Thread count is free.
   ============================================================ */

(function () {
  'use strict';

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  /* inline so nothing is fetched at runtime */
  var ICON = {
    home:  '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    scan:  '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>',
    graph: '<circle cx="12" cy="4.5" r="2"/><circle cx="4.5" cy="16" r="2"/><circle cx="19.5" cy="16" r="2"/><path d="M12 6.5L5.6 14.3M12 6.5l6.4 7.8M6.5 16h11"/>',
    loop:  '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    code:  '<path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/>',
    box:   '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'
  };
  var icon = function (k) {
    return '<svg class="csf-ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICON[k] || ICON.check) + '</svg>';
  };
  var DEC_ICON = ['layers', 'code', 'graph', 'box'];

  /* ---------- geometry ---------- */
  var W = 1424, H = 880, COL_W = 216;
  var COL_X = [20, 312, 604, 896, 1188];
  var CY = 470, BASE_GAP = 190;
  /* the funnel itself: rows pull toward the centreline stage by stage */
  var SPREAD = [1.0, 0.90, 0.80, 0.72, 0.62];

  function ribbon(x1, y1, t1, x2, y2, t2) {
    var c = (x2 - x1) * 0.5;
    return 'M' + x1 + ',' + (y1 - t1/2) +
      ' C' + (x1+c) + ',' + (y1-t1/2) + ' ' + (x2-c) + ',' + (y2-t2/2) + ' ' + x2 + ',' + (y2-t2/2) +
      ' L' + x2 + ',' + (y2+t2/2) +
      ' C' + (x2-c) + ',' + (y2+t2/2) + ' ' + (x1+c) + ',' + (y1+t1/2) + ' ' + x1 + ',' + (y1+t1/2) + ' Z';
  }

  /* 2px of slack + integer coords: foreignObject clips at its bounds,
     and fractional y values put the bottom border on a half pixel */
  function fo(x, y, w, h, cls, html, attrs) {
    var P = 2;
    return '<foreignObject ' + (attrs || '') +
      ' x="' + (Math.round(x) - P) + '" y="' + (Math.round(y - h/2) - P) + '"' +
      ' width="' + (w + P*2) + '" height="' + (h + P*2) + '">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" class="csf-pad">' +
      '<div class="' + cls + '">' + html + '</div></div></foreignObject>';
  }

  /* ---------- per-stage detail renderers ---------- */
  function detail(si, T) {
    var out, cls = si === 2 ? ' csf-body--pillars' : '';

    if (si === 0) {                                  /* persona, no categories */
      out = T.map(function (th, i) {
        return '<article class="csf-item csf-user" data-node="0-' + i + '-">' +
          '<div class="csf-user__ico">' + icon(th.d.icon) + '</div><div>' +
          '<div class="csf-user__need">' + esc(th.d.userNeed) + '</div>' +
          '<blockquote class="csf-user__quote">' + esc(th.d.userQuote) +
          (th.d.userWho ? '<span class="csf-user__who">' + esc(th.d.userWho) + '</span>' : '') +
          '</blockquote></div></article>';
      }).join('');

    } else if (si === 1) {                           /* spec sheet + pipeline */
      var pipe = ['crawl', 'render', 'parse', 'index', 'answer'].map(function (s) {
        return '<span class="csf-pipe__step">' + s + '</span>';
      }).join('<span class="csf-pipe__arrow">&rarr;</span>');
      out = '<div class="csf-pipe">' + pipe + '</div>';
      T.forEach(function (th, i) {
        th.d.bots.forEach(function (b, j) {
          out += '<article class="csf-item csf-bot" data-node="1-' + i + '-' + j + '">' +
            '<div class="csf-bot__name">' + esc(b.name) + '</div>' +
            '<ul class="csf-bot__pts">' + b.points.map(function (p) {
              return '<li>' + esc(p) + '</li>';
            }).join('') + '</ul></article>';
        });
      });

    } else if (si === 2) {                           /* pillars + coverage */
      out = T.map(function (th, i) {
        return '<article class="csf-item csf-pillar" data-node="2-' + i + '-">' +
          '<div class="csf-pillar__bar"></div><div class="csf-pillar__in">' +
          '<div class="csf-pillar__name">' + esc(th.cat) + '</div>' +
          '<div class="csf-pillar__def">= ' + esc(th.d.catDef) + '</div>' +
          '<div class="csf-pillar__subs">' + th.d.catSubs.map(function (s) {
            return '<div class="csf-pillar__sub"><span class="csf-pillar__k">' + esc(s.k) +
              '</span><span class="csf-pillar__v">' + esc(s.v) + '</span></div>';
          }).join('') + '</div>' +
          '<div class="csf-pillar__cov"><div class="csf-pillar__covlab">Bot needs this pillar covers</div>' +
          '<ul>' + th.d.catNeeds.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') +
          '</ul></div></div></article>';
      }).join('');

    } else if (si === 3) {                           /* options, as bullets */
      out = T.map(function (th, i) {
        return '<article class="csf-item csf-opt" data-node="3-' + i + '-">' +
          '<div class="csf-opt__thread">' + esc(th.cat) + '</div>' +
          th.d.weighing.map(function (g) {
            return '<div class="csf-og"><div class="csf-og__head">' + g.head + '</div>' +
              (g.bullets && g.bullets.length ? '<ul class="csf-og__b">' + g.bullets.map(function (b) {
                return '<li>' + b + '</li>'; }).join('') + '</ul>' : '') +
              (g.sub ? '<div class="csf-og__sub">' + g.sub.map(function (s) {
                return '<div class="csf-og__subrow"><span class="csf-og__subk">' + s.k +
                  '</span><span class="csf-og__subv">' + s.v + '</span></div>';
              }).join('') + '</div>' : '') + '</div>';
          }).join('') +
          '<div class="csf-opt__pills">' + th.candidates.map(function (c) {
            return '<span class="csf-opt__pill' + (c.won ? ' won' : '') + '">' +
              esc(c.label) + (c.won ? ' ✓' : '') + '</span>';
          }).join('') + '</div></article>';
      }).join('');

    } else {                                         /* the payoff */
      out = T.map(function (th, i) {
        return '<article class="csf-item csf-dec" data-node="4-' + i + '-">' +
          '<div class="csf-dec__top"><span class="csf-dec__ico">' + icon(DEC_ICON[i % DEC_ICON.length]) + '</span>' +
          '<span class="csf-dec__name">' + th.dec + '</span>' +
          '<span class="csf-dec__thread">' + esc(th.cat) + '</span></div>' +
          '<div class="csf-dec__in">' + th.d.decision.map(function (g) {
            return '<div class="csf-dg"><div class="csf-dg__head"><span class="csf-dg__k">' + g.k + '</span>' +
              (g.v ? '<span class="csf-dg__v">' + g.v + '</span>' : '') + '</div>' +
              (g.proof ? '<ul class="csf-dg__proof">' + g.proof.map(function (p) {
                return '<li>' + p + '</li>'; }).join('') + '</ul>' : '') +
              (g.items ? g.items.map(function (it) {
                return '<div class="csf-di"><div class="csf-di__t">' + it.t + '</div><ul class="csf-di__b">' +
                  it.b.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul></div>';
              }).join('') : '') + '</div>';
          }).join('') + '</div></article>';
      }).join('');
    }

    return '<div class="csf-body' + cls + '">' + out + '</div>';
  }

  /* ---------- full-bleed: measured, not guessed ----------
     The funnel lives inside a reading column capped at --measure, next
     to the sticky TOC rail, so it has to be sized against the actual
     content column (case-study-render.js's .cs-content — the grid's
     second track, which already excludes the rail) rather than a
     hard-coded negative margin. Measuring .u-wrap instead is the bug
     this replaced: .u-wrap is the *outer* grid box spanning rail + gap
     + content, so sizing against it pulled the funnel's left edge out
     past the content column and on top of the TOC. */
  function fitWide(el) {
    var col = el.closest('.cs-content');
    if (!col) return;
    el.style.width = '';
    el.style.marginLeft = '';

    /* Grid/flex items default to min-width:auto, which honours the 1180px
       min-width of .csf-stagewrap deep inside. Any such ancestor blows out
       past the reading column and scrolls the whole page sideways instead
       of letting the funnel scroll internally. Neutralise them up to the
       column so the funnel is free to be sized here. */
    for (var a = el; a && a !== col; a = a.parentElement) a.style.minWidth = '0px';

    var cr = col.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    if (cr.width <= er.width + 1) return;           /* already full width */
    el.style.marginLeft = Math.round(cr.left - er.left) + 'px';
    el.style.width = Math.round(cr.width) + 'px';
  }

  /* ---------- mount ---------- */
  function mount(el) {
    var key = el.getAttribute('data-funnel');
    var data = (window.CS_FUNNELS || {})[key];
    if (!data) { el.innerHTML = '<p style="color:var(--ink-3);font-size:.85rem">' +
      'Funnel data “' + esc(key) + '” not loaded.</p>'; return; }

    var STAGES = data.stages, T = data.threads;
    var rowY = function (st, i) { return CY + (i - (T.length - 1) / 2) * BASE_GAP * SPREAD[st]; };

    var ribbons = '', G = [[], [], [], [], []];

    T.forEach(function (th, i) {
      var n = th.bots.length;
      var y0 = rowY(0,i), y1 = rowY(1,i), y2 = rowY(2,i), y3 = rowY(3,i), y4 = rowY(4,i);
      var botY = function (j) { return n === 1 ? y1 : y1 + (j === 0 ? -44 : 44); };

      th.bots.forEach(function (b, j) {
        var src = n === 1 ? y0 : y0 + (j === 0 ? -13 : 13);
        ribbons += '<path fill="var(--s1)" fill-opacity=".40" d="' +
          ribbon(COL_X[0] + COL_W, src, n === 1 ? 52 : 26, COL_X[1], botY(j), 34) + '"/>';
      });
      th.bots.forEach(function (b, j) {
        var tgt = n === 1 ? y2 : y2 + (j === 0 ? -9 : 9);
        ribbons += '<path fill="var(--s2)" fill-opacity=".44" d="' +
          ribbon(COL_X[1] + COL_W, botY(j), 32, COL_X[2], tgt, n === 1 ? 36 : 18) + '"/>';
      });

      var m = th.candidates.length, CH = 26, CG = 6;
      var top = y3 - (m * CH + (m - 1) * CG) / 2;
      var candY = function (k) { return top + CH/2 + k * (CH + CG); };

      th.candidates.forEach(function (c, k) {
        ribbons += '<path fill="' + (c.won ? 'var(--s3)' : 'var(--ink-3)') + '" fill-opacity="' +
          (c.won ? '.5' : '.22') + '" d="' +
          ribbon(COL_X[2] + COL_W, y2 + (k - (m-1)/2) * 13, 11, COL_X[3], candY(k), 14) + '"/>';
        /* losing options stop at the chip — nothing reaches column 5,
           which is what makes the surviving gold ribbon legible */
        if (c.won) ribbons += '<path fill="var(--s4)" fill-opacity=".55" d="' +
          ribbon(COL_X[3] + COL_W, candY(k), 22, COL_X[4], y4, 30) + '"/>';
      });

      G[0].push(fo(COL_X[0], y0, COL_W, 132, 'csf-node',
        '<div class="t">' + esc(th.user) + '</div><div class="s"><em>' + esc(th.userEg) + '</em></div>',
        'data-node="0-' + i + '-0"'));
      th.bots.forEach(function (b, j) {
        G[1].push(fo(COL_X[1], botY(j), COL_W, 62, 'csf-node',
          '<div class="t">' + esc(b.t) + '</div><div class="s">' + esc(b.s) + '</div>',
          'data-node="1-' + i + '-' + j + '"'));
      });
      G[2].push(fo(COL_X[2], y2, COL_W, 76, 'csf-node csf-node--cat',
        '<div class="t">' + esc(th.cat) + '</div><div class="s">' + esc(th.catSub) + '</div>',
        'data-node="2-' + i + '-0"'));
      th.candidates.forEach(function (c, k) {
        G[3].push(fo(COL_X[3], candY(k), COL_W, CH, 'csf-chip' + (c.won ? ' csf-chip--won' : ''),
          esc(c.label) + (c.won ? ' ✓' : ''), 'data-node="3-' + i + '-' + k + '"'));
      });
      G[4].push(fo(COL_X[4], y4, COL_W, 76, 'csf-node csf-node--dec',
        '<div class="t">' + th.dec + '</div><div class="s">' + th.decSub + '</div>',
        'data-node="4-' + i + '-0"'));
    });

    var groups = G.map(function (nodes, i) {
      return '<g class="csf-stage" data-stage="' + i + '">' +
        fo(COL_X[i], 52, COL_W, 26, 'csf-sthead', '<i>0' + (i+1) + '</i>' + esc(STAGES[i].label)) +
        nodes.join('') + '</g>';
    }).join('');

    var lanes = COL_X.map(function (x) { return { x: x - 14, w: COL_W + 28 }; });
    var rects = function (cls) {
      return lanes.map(function (l, i) {
        return '<rect class="' + cls + '" data-stage="' + i + '" x="' + l.x +
          '" y="34" width="' + l.w + '" height="' + (H - 50) + '" rx="14"/>';
      }).join('');
    };

    el.classList.add('csf');
    el.innerHTML =
      '<div class="csf-ctl"></div>' +
      '<p class="csf-scrollhint">&larr; scroll sideways to follow the funnel &rarr;</p>' +
      '<div class="csf-scroll"><div class="csf-stagewrap">' +
        '<svg class="csf-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' +
          esc(data.label || 'Decision funnel from user needs to shipped requirements') + '">' +
          '<g>' + rects('csf-lane') + '</g>' +
          '<g class="csf-ribbons">' + ribbons + '</g>' + groups +
          '<g>' + rects('csf-hit') + '</g>' +
        '</svg>' +
      '</div></div>' +
      '<div class="csf-all"></div>';

    wire(el, STAGES, T, lanes);

    fitWide(el);
    var raf;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { fitWide(el); });
    }, { passive: true });
  }

  /* ---------- interaction ---------- */
  function wire(root, STAGES, T, lanes) {
    var svgEl = root.querySelector('.csf-svg');
    var host = root.querySelector('.csf-stagewrap');
    var ctlEl = root.querySelector('.csf-ctl');
    var allEl = root.querySelector('.csf-all');
    var active = null;                              /* null | 0..4 | 'all' */

    function unlit() {
      svgEl.querySelectorAll('foreignObject.is-lit').forEach(function (n) { n.classList.remove('is-lit'); });
    }
    function close() {
      var p = host.querySelector('.csf-panel');
      if (p) p.remove();
      unlit();
    }

    /* the panel opens into the space the OTHER columns occupy: right for
       the first three stages, left for the last two, so it never runs off
       the canvas and never covers the column it describes */
    function open(si) {
      var lane = lanes[si], M = 34, EDGE = 20;
      var left = si <= 2 ? lane.x + lane.w + M : EDGE;
      var right = si <= 2 ? W - EDGE : lane.x - M;
      var pct = function (v) { return (v / W * 100) + '%'; };

      var el = document.createElement('div');
      el.className = 'csf-panel';
      el.style.left = pct(left);
      el.style.width = pct(right - left);
      el.style.top = (88 / H * 100) + '%';
      el.style.maxHeight = ((H - 88 - EDGE) / H * 100) + '%';
      el.innerHTML =
        '<header class="csf-panel__head"><span class="csf-panel__num">0' + (si+1) + '</span>' +
        '<span class="csf-panel__title">' + esc(STAGES[si].label) + '</span>' +
        '<button class="csf-panel__x" type="button" data-x>Close</button></header>' + detail(si, T);

      /* hovering a detail card lights the shape it came from */
      el.addEventListener('mouseover', function (e) {
        var c = e.target.closest('[data-node]');
        unlit();
        if (!c) return;
        svgEl.querySelectorAll('foreignObject[data-node^="' + c.getAttribute('data-node') + '"]')
          .forEach(function (n) { n.classList.add('is-lit'); });
      });
      el.addEventListener('mouseleave', unlit);
      el.addEventListener('click', function (e) {
        if (e.target.closest('[data-x]')) { active = null; paint(); }
      });
      host.appendChild(el);
    }

    function paint() {
      close();
      if (active === null) {
        svgEl.removeAttribute('data-focus');
        allEl.innerHTML = '';
      } else if (active === 'all') {
        svgEl.removeAttribute('data-focus');
        allEl.innerHTML = STAGES.map(function (s, i) {
          return '<section class="csf-allpanel"><header class="csf-allpanel__head">' +
            '<span class="csf-allpanel__num">0' + (i+1) + '</span>' +
            '<h3 class="csf-allpanel__title">' + esc(s.label) + '</h3></header>' + detail(i, T) + '</section>';
        }).join('');
      } else {
        svgEl.setAttribute('data-focus', String(active));
        allEl.innerHTML = '';
        open(active);
      }
      ctlEl.querySelectorAll('[data-stage]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(active !== 'all' && Number(b.dataset.stage) === active));
      });
      ctlEl.querySelector('[data-all]').setAttribute('aria-pressed', String(active === 'all'));
    }

    ctlEl.innerHTML = STAGES.map(function (s, i) {
      return '<button class="csf-btn" type="button" data-stage="' + i + '" aria-pressed="false">0' +
        (i+1) + ' ' + esc(s.label) + '</button>';
    }).join('') +
      '<button class="csf-btn" type="button" data-all aria-pressed="false">Show all</button>' +
      '<span class="csf-hint">or click any column</span>';

    ctlEl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-all')) active = active === 'all' ? null : 'all';
      else { var i = Number(b.dataset.stage); active = active === i ? null : i; }
      paint();
    });
    svgEl.addEventListener('click', function (e) {
      var h = e.target.closest('.csf-hit');
      if (!h) return;
      var i = Number(h.dataset.stage);
      active = active === i ? null : i;
      paint();
    });
    svgEl.addEventListener('mouseover', function (e) {
      var h = e.target.closest('.csf-hit');
      if (h) svgEl.dataset.hover = h.dataset.stage;
      else delete svgEl.dataset.hover;
    });
    svgEl.addEventListener('mouseleave', function () { delete svgEl.dataset.hover; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && active !== null) { active = null; paint(); }
    });

    paint();
  }

  window.mountCaseStudyFunnels = function (scope) {
    (scope || document).querySelectorAll('[data-funnel]').forEach(mount);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.mountCaseStudyFunnels(); });
  } else {
    window.mountCaseStudyFunnels();
  }
})();
