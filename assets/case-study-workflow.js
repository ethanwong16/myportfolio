/* ============================================================
   case-study-workflow.js — two workflow diagrams built from one
   data key:
     - `compare`  — INITIAL vs IMPROVED, Milestone 3's rapid-
       iteration workflow. The three tools that made it fast
       (Playground, ZSM Repo, Dispatcher) are click-to-expand —
       same convention as the funnel's "click any column" and the
       prose's <details> annotations elsewhere on this page.
     - `fullFlow` — the production guardrail loop, Milestone 2's
       eval system + SEO consultant agent.
   Either key can be omitted from a given data object — a single
   standalone stage-flow diagram (`fullFlow` alone, no `compare`)
   is a legitimate use, e.g. illustrating one system's mechanics
   rather than a before/after.

   Drops into a case study the same way the funnel/schema-viz do:
   a section emits <div data-workflow="key"></div> (see
   case-study-render.js), and this file finds it and builds from
   window.CS_WORKFLOWS[key] (see workflow-data-<key>.js). Load
   this script AFTER renderCaseStudy() runs, so the mount exists.

   Namespaced csw- throughout. Depends on tokens.css for the
   palette. The `home` flags are the one deliberate callback to
   the site's house motif (the staircase landing, the schema-viz
   house): the faster workflow's badge, and the guardrail loop's
   last stage, both get the small house glyph — arriving home
   faster, and the team returning to a quality-assured page.
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
    pm: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 12l2 2 4-4"/>',
    dev: '<path d="M9 8 4 12l5 4"/><path d="M15 8l5 4-5 4"/>',
    user: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-4.2 3.1-6.8 7-6.8s7 2.6 7 6.8"/>',
    bot: '<rect x="5" y="9" width="14" height="10" rx="3"/><circle cx="9.5" cy="14" r="1.2" fill="currentColor" stroke="none"/>' +
      '<circle cx="14.5" cy="14" r="1.2" fill="currentColor" stroke="none"/><path d="M12 9V6"/><circle cx="12" cy="4.5" r="1.3"/>',
    ai: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    repo: '<ellipse cx="12" cy="5" rx="7" ry="2.4"/><path d="M5 5v14c0 1.3 3.1 2.4 7 2.4s7-1.1 7-2.4V5"/><path d="M5 12c0 1.3 3.1 2.4 7 2.4s7-1.1 7-2.4"/>',
    dispatch: '<path d="M4 12l16-8-6 16-2.5-6.5L4 12z"/>',
    home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>'
  };
  function icon(key) {
    return '<svg class="csw-ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICON[key] || ICON.dev) + '</svg>';
  }
  function iconItem(it) {
    return '<div class="csw-iconitem">' + icon(it.icon) + '<span>' + esc(it.label) + '</span></div>';
  }

  /* ---------- compare: INITIAL vs IMPROVED ---------- */

  function stepNode(step) {
    var head = (step.icon ? '<span class="csw-step__icon">' + icon(step.icon) + '</span>' : '') +
      '<span class="csw-step__label">' + esc(step.label) + '</span>';
    if (step.highlight) {
      return '<li class="csw-step csw-step--highlight">' +
        '<details><summary>' + head + '</summary>' +
        '<div class="csw-step__detail">' + esc(step.detail) + '</div>' +
        '</details></li>';
    }
    return '<li class="csw-step">' + head + '</li>';
  }

  function column(col) {
    var segsHtml = col.segments.map(function (seg) {
      var stepsHtml = seg.steps.map(function (step, i) {
        return (i > 0 ? '<li class="csw-arrow" aria-hidden="true"></li>' : '') + stepNode(step);
      }).join('');
      return '<div class="csw-segment">' +
        '<div class="csw-segment__head"><span>' + esc(seg.label) + '</span>' +
          '<span class="csw-segment__time">' + esc(seg.time) + '</span></div>' +
        '<ol class="csw-steps">' + stepsHtml + '</ol>' +
        '</div>';
    }).join('<div class="csw-seg-arrow" aria-hidden="true"></div>');

    return '<div class="csw-col' + (col.home ? ' csw-col--improved' : '') + '">' +
      '<div class="csw-col__head">' +
        '<span class="csw-col__tag">' + esc(col.tag) + '</span>' +
        '<span class="csw-col__time">' + (col.home ? icon('home') : '') + esc(col.totalTime) + '</span>' +
      '</div>' +
      segsHtml +
      '</div>';
  }

  function compare(d) {
    return '<div class="csw-exhibit">' +
      '<p class="csw-eyebrow">' + esc(d.eyebrow) + '</p>' +
      '<p class="csw-intro">' + esc(d.intro) + '</p>' +
      '<p class="csw-hint">Tap a gold step for what it does.</p>' +
      '<div class="csw-compare">' + column(d.before) + column(d.after) + '</div>' +
      '</div>';
  }

  /* ---------- full flow ---------- */

  function stage(s) {
    return '<div class="csw-flow__stage' + (s.highlight ? ' csw-flow__stage--highlight' : '') + '">' +
      (s.icon ? '<span class="csw-flow__icon">' + icon(s.icon) + '</span>' : '') +
      '<h3 class="csw-flow__title">' + (s.home ? icon('home') : '') + esc(s.title) + '</h3>' +
      (s.sub ? '<p class="csw-flow__sub">' + esc(s.sub) + '</p>' : '') +
      (s.branch ? '<div class="csw-flow__branch"><span>' + esc(s.branch.label) + '</span>' +
        '<div class="csw-flow__icons">' + s.branch.icons.map(iconItem).join('') + '</div></div>' : '') +
      (s.icons ? '<div class="csw-flow__icons">' + s.icons.map(iconItem).join('') + '</div>' : '') +
      (s.pills ? '<ul class="csw-flow__pills">' + s.pills.map(function (p) {
        return '<li>' + esc(p) + '</li>';
      }).join('') + '</ul>' : '') +
      '</div>';
  }

  function fullFlow(d) {
    var stagesHtml = d.stages.map(function (s, i) {
      return (i > 0 ? '<span class="csw-flow__connector" aria-hidden="true">&#8594;</span>' : '') + stage(s);
    }).join('');
    return '<div class="csw-exhibit">' +
      '<p class="csw-eyebrow">' + esc(d.eyebrow) + '</p>' +
      '<p class="csw-intro">' + esc(d.intro) + '</p>' +
      '<p class="csw-scrollhint">&larr; scroll sideways to follow the flow &rarr;</p>' +
      '<div class="csw-flow">' + stagesHtml + '</div>' +
      '</div>';
  }

  /* ---------- full-bleed: measured, not guessed (same technique
     as case-study-funnel.js's fitWide / case-study-schema-viz.js's) ---------- */
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

  function build(d) {
    var parts = '';
    if (d.compare) parts += compare(d.compare);
    if (d.fullFlow) parts += fullFlow(d.fullFlow);
    return '<div class="csw">' + parts + '</div>';
  }

  function boot() {
    var mounts = document.querySelectorAll('[data-workflow]');
    Array.prototype.forEach.call(mounts, function (el) {
      var d = window.CS_WORKFLOWS && window.CS_WORKFLOWS[el.dataset.workflow];
      if (!d) return;
      el.innerHTML = build(d);
      el.classList.add('csw-mount');
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
