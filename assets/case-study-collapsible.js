/* ============================================================
   case-study-collapsible.js — progressive-enhancement layer for
   the infographic-first case study shape (case-study-collapsible.css).

   Every .cs-expand is a native <details> — it works with zero JS.
   This file adds one convenience (an "expand/collapse all" button)
   and one correctness fix: any data-driven diagram mounted inside
   a section (funnel/workflow/schema-viz — see
   case-study-content.template.js) measures its own width via
   getBoundingClientRect() and only recomputes on window `resize`.
   Inside a closed <details> that width is 0, so opening a section
   fires a synthetic resize to make those diagrams re-lay-out
   against their now-visible width. No-op if none are present.
   ============================================================ */

(function () {
  'use strict';

  function init() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('.cs-expand'));
    if (!sections.length) return;

    sections.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        requestAnimationFrame(function () {
          window.dispatchEvent(new Event('resize'));
        });
      });
    });

    var btn = document.querySelector('[data-expand-all]');
    if (!btn) return;

    function allOpen() { return sections.every(function (d) { return d.open; }); }
    function sync() {
      var open = allOpen();
      btn.textContent = open ? 'Collapse all sections' : 'Expand all sections';
      btn.setAttribute('aria-expanded', String(open));
    }
    btn.addEventListener('click', function () {
      var nextOpen = !allOpen();
      sections.forEach(function (d) { d.open = nextOpen; });
      sync();
    });
    sections.forEach(function (d) { d.addEventListener('toggle', sync); });
    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
