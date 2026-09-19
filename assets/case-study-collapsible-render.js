/* ============================================================
   case-study-collapsible-render.js — turns a window.CASE_STUDY
   object (the infographic-first shape — see
   case-study-collapsible-content.template.js) into the DOM for a
   case study page. Same contract as case-study-render.js: one
   content object in, one full page out — new case studies in this
   shape are a new content file plus a copy of the shell HTML, no
   template edits required.

   The two renderers are siblings, not variants of each other — this
   one adds an always-visible infographic per section plus a
   collapsed-by-default <details> for supporting diagrams/text; the
   block-level helpers (prose/personas/goals/metrics/deepdive/stack/
   funnel/workflow/diagram/schemaViz) are intentionally identical
   to case-study-render.js's, since a section's *contents* work the
   same way in both shapes — only the outer wrapping differs. Kept
   duplicated rather than shared so each renderer stays a single
   self-contained file, matching this repo's existing convention.
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

  function deepdive(d) {
    return '<div class="cs-deepdive">' +
      (d.frameLabel ? '<div class="cs-deepdive__frame">' + esc(d.frameLabel) + '</div>' : '') +
      (d.body ? prose(d.body) : '') +
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

  /* mount points for the reusable data-driven diagrams — same
     contract as case-study-render.js: this emits only the mount
     div, the matching case-study-*.js (loaded separately, after
     this page renders) finds it by attribute and builds from its
     window.CS_* data. See case-study-content.template.js for the
     three-step setup each one needs. */
  function funnel(key) { return '<div data-funnel="' + esc(key) + '"></div>'; }
  function schemaViz(key) { return '<div data-schema-viz="' + esc(key) + '"></div>'; }
  function workflow(key) { return '<div data-workflow="' + esc(key) + '"></div>'; }
  function diagram(key) { return '<div data-diagram="' + esc(key) + '"></div>'; }

  /* ------------------------------------------------------------
     INFOGRAPHIC — always visible, independent of expand/collapse.
     `src` missing/empty renders the dashed placeholder frame so an
     unfinished section still shows where its image will go; once
     `src` is set the frame drops its dashed styling (data-filled).

     A section's infographic is usually one image: { src, alt, caption }.
     For a section whose "main graphic" is naturally a set of parallel
     images (e.g. one per phase) instead of a single picture, use the
     set form instead: { layout: 'card' | 'vertical', items: [...] }.
       - 'card'     — a responsive grid, several per row (default)
       - 'vertical' — one per row, each as wide as the column allows;
                       pick this when each image needs the width to
                       stay legible rather than sitting side by side
     `items` takes the same { src, alt, caption } shape as a single
     infographic, one per entry.
     ------------------------------------------------------------ */
  function infographicFrame(img, sectionTitle) {
    var filled = img.src && img.src.length;
    return '<div class="cs-infographic__frame"' + (filled ? ' data-filled="true"' : '') + '>' +
      (filled
        ? '<img src="' + esc(img.src) + '" alt="' + esc(img.alt || sectionTitle) + '">'
        : '<span class="cs-infographic__placeholder">Infographic — ' + esc(sectionTitle) +
          '<small>Set sections[].infographic.src to replace this placeholder</small></span>') +
      '</div>' +
      (img.caption ? '<figcaption class="cs-infographic__caption">' + esc(img.caption) + '</figcaption>' : '');
  }

  function infographic(fig, sectionTitle) {
    if (fig && fig.items) {
      var layout = fig.layout === 'vertical' ? 'vertical' : 'card';
      return '<figure class="cs-infographic cs-infographic--' + layout + '">' +
        '<div class="cs-infographic__grid">' + fig.items.map(function (img) {
          return '<div class="cs-infographic__item">' + infographicFrame(img, sectionTitle) + '</div>';
        }).join('') + '</div>' +
        '</figure>';
    }
    return '<figure class="cs-infographic">' + infographicFrame(fig, sectionTitle) + '</figure>';
  }

  /* ------------------------------------------------------------
     EXPAND — the collapsed-by-default <details> holding whichever
     block types this section's `expand` object sets. Same block
     vocabulary as the narrative renderer's section(), just nested
     one level deeper. Omit `expand` entirely (as the blank
     appendix does) to render no disclosure at all — just the
     heading + infographic.
     ------------------------------------------------------------ */
  function expandBlock(ex) {
    var inner = '';
    if (ex.body) inner += prose(ex.body);
    if (ex.personas) inner += personas(ex.personas);
    if (ex.goals) inner += goals(ex.goals);
    if (ex.funnel) inner += funnel(ex.funnel);
    if (ex.deepdive) inner += deepdive(ex.deepdive);
    if (ex.schemaViz) inner += schemaViz(ex.schemaViz);
    if (ex.workflow) inner += workflow(ex.workflow);
    if (ex.diagram) inner += diagram(ex.diagram);
    if (ex.metrics) inner += metrics(ex.metrics);
    if (ex.stack) inner += '<h3 class="cs-goal__label" style="margin-top:1.5rem">' +
      esc(ex.stackLabel || 'Stack') + '</h3>' + stack(ex.stack);

    if (!inner) return '';
    return '<details class="cs-expand">' +
      '<summary class="cs-expand__toggle">' +
        '<span class="cs-expand__icon" aria-hidden="true"></span>' +
        '<span>' + esc(ex.label || 'Show diagrams & write-up') + '</span>' +
      '</summary>' +
      '<div class="cs-expand__body">' + inner + '</div>' +
      '</details>';
  }

  function section(sec, i) {
    return '<section class="cs-section" id="' + esc(sec.id) + '">' +
      '<h2 class="cs-section__title"><span class="cs-section__num">' + num(i) + '</span>' +
        esc(sec.title) + '</h2>' +
      (sec.infographic ? infographic(sec.infographic, sec.title) : '') +
      (sec.expand ? expandBlock(sec.expand) : '') +
      '</section>';
  }

  function toc(sections) {
    var items = sections.map(function (s) {
      return '<li><a href="#' + esc(s.id) + '">' + esc(s.navLabel || s.title) + '</a></li>';
    }).join('');
    return {
      rail: '<nav class="cs-toc" aria-label="On this page">' +
        '<p class="cs-toc__label">On this page</p><ol>' + items + '</ol></nav>',
      mobile: '<details class="cs-toc-mobile"><summary>On this page</summary><ol>' + items + '</ol></details>'
    };
  }

  window.renderCollapsibleCaseStudy = function (mount) {
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
          '<div class="cs-expand-all"><button type="button" class="cs-expand-all__btn" data-expand-all aria-expanded="false">Expand all sections</button></div>' +
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
