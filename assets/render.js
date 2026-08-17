/* ============================================================
   render.js — turns window.CONTENT (content.js) into the DOM
   for everything below the hero, plus the archive toggle and
   scroll-reveal behaviour that go with it.
   ============================================================ */

(function () {
  'use strict';

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  function bullets(list) {
    return '<ul class="card__bullets">' +
      list.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') +
      '</ul>';
  }

  function workCard(item, i) {
    var links = item.links.map(function (l) {
      return '<a class="card__link" href="' + esc(l.href) + '" target="_blank" rel="noopener">' +
        esc(l.label) + '<span aria-hidden="true">&#8599;</span></a>';
    }).join('');

    /* an entry either has flat bullets, or nested roles at one employer */
    var body = item.roles
      ? '<div class="card__roles">' + item.roles.map(function (r) {
          return '<div class="role">' +
            '<div class="role__head">' +
              '<h4 class="role__title">' + esc(r.title) + '</h4>' +
              '<span class="role__period">' + esc(r.period) + '</span>' +
            '</div>' +
            bullets(r.bullets) +
          '</div>';
        }).join('') + '</div>'
      : bullets(item.bullets);

    return '' +
      '<article class="card" data-reveal style="--i:' + i + '">' +
        '<header class="card__head">' +
          '<span class="tag">' + esc(item.tag) + '</span>' +
          (item.period ? '<span class="card__period">' + esc(item.period) + '</span>' : '') +
        '</header>' +
        '<h3 class="card__title">' + esc(item.title) + '</h3>' +
        '<p class="card__org">' + esc(item.org) + '</p>' +
        body +
        (item.stack ? '<p class="card__stack">' + esc(item.stack) + '</p>' : '') +
        (links ? '<div class="card__links">' + links + '</div>' : '') +
      '</article>';
  }

  window.renderPage = function (mount) {
    var C = window.CONTENT;

    /* tells the stylesheet it is safe to hide things pending reveal */
    document.documentElement.classList.add('js');

    mount.innerHTML = '' +
      /* ---- blurb ---- */
      '<section class="band band--intro" id="intro">' +
        '<div class="u-wrap">' +
          '<p class="lede" data-reveal>' + esc(C.blurb) + '</p>' +
        '</div>' +
      '</section>' +

      /* ---- work ---- */
      '<section class="band" id="work">' +
        '<div class="u-wrap">' +
          '<h2 class="band__title" data-reveal><span class="band__num">01</span>Work</h2>' +
          '<div class="cards">' + C.work.map(workCard).join('') + '</div>' +

          '<div class="archive" data-reveal>' +
            '<button class="archive__toggle" type="button" aria-expanded="false" aria-controls="archive-list">' +
              '<span class="archive__mark" aria-hidden="true"></span>' +
              '<span class="archive__label">' + esc(C.archiveLabel) + '</span>' +
              '<span class="archive__count">' + C.archive.length + '</span>' +
            '</button>' +
            '<div class="archive__list" id="archive-list" inert>' +
              '<div class="cards">' + C.archive.map(workCard).join('') + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---- about ---- */
      '<section class="band" id="about">' +
        '<div class="u-wrap">' +
          '<h2 class="band__title" data-reveal><span class="band__num">02</span>About</h2>' +
          '<div class="about">' +
            '<div>' +
              '<p class="about__text" data-reveal>' + esc(C.about) + '</p>' +
              '<div class="edu" data-reveal>' +
                '<h3 class="edu__school">' + esc(C.education.school) + '</h3>' +
                '<p class="edu__degree">' + esc(C.education.degree) + '</p>' +
                '<p class="edu__detail">' + esc(C.education.detail) + '</p>' +
                '<p class="edu__extra">' + esc(C.education.extra) + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="skills">' +
              C.skills.map(function (s, i) {
                return '<div class="skills__col" data-reveal style="--i:' + i + '">' +
                  '<h3 class="skills__group">' + esc(s.group) + '</h3>' +
                  '<ul>' + s.items.map(function (it) {
                    return '<li>' + esc(it) + '</li>';
                  }).join('') + '</ul>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---- contact ---- */
      '<section class="band band--contact" id="contact">' +
        '<div class="u-wrap">' +
          '<h2 class="band__title" data-reveal><span class="band__num">03</span>Contact</h2>' +
          '<p class="contact__line" data-reveal>' + esc(C.contact.line) + '</p>' +
          '<a class="contact__mail" data-reveal href="mailto:' + esc(C.contact.email) + '">' +
            esc(C.contact.email) + '</a>' +
          '<p class="contact__loc" data-reveal>' + esc(C.contact.location) + '</p>' +
          '<ul class="contact__links" data-reveal>' +
            C.contact.links.map(function (l) {
              return '<li><a href="' + esc(l.href) + '" target="_blank" rel="noopener">' +
                esc(l.label) + '<span aria-hidden="true">&#8599;</span></a></li>';
            }).join('') +
          '</ul>' +
        '</div>' +
      '</section>' +

      '<footer class="foot"><div class="u-wrap">' +
        '<span>Designed &amp; built by Ethan Wong</span>' +
        '<span class="foot__mark" aria-hidden="true">&#9670;</span>' +
      '</div></footer>';

    /* --- archive toggle ---
       Animating max-height needs a real measurement, so read it at
       open time rather than caching — the cards inside reflow with
       the viewport. `inert` keeps the collapsed cards out of the tab
       order, which overflow:hidden alone does not do. */
    var toggle = mount.querySelector('.archive__toggle');
    var list = mount.querySelector('.archive__list');

    if (toggle && list) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';

        if (open) {
          list.style.maxHeight = list.scrollHeight + 'px';
          void list.offsetHeight;
          list.style.maxHeight = '0px';
          list.setAttribute('inert', '');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          list.removeAttribute('inert');
          toggle.setAttribute('aria-expanded', 'true');
          list.style.maxHeight = list.scrollHeight + 'px';
        }
      });

      /* once open, drop the cap so the panel can grow with the text
         if the window is resized */
      list.addEventListener('transitionend', function (e) {
        if (e.propertyName !== 'max-height') return;
        if (toggle.getAttribute('aria-expanded') === 'true') list.style.maxHeight = 'none';
      });

      /* Deep-linking into collapsed content otherwise lands the visitor
         on a panel that stays shut. Open it if the hash points inside. */
      var openIfTargeted = function () {
        var id = location.hash.slice(1);
        if (!id) return;
        var target = list.id === id ? list : list.querySelector('#' + CSS.escape(id));
        if (!target) return;
        list.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
        list.style.maxHeight = 'none';
      };
      openIfTargeted();
      window.addEventListener('hashchange', openIfTargeted);
    }

    /* scroll reveal — cheap, one observer, unobserves as it goes */
    var observerAlive = false;

    var io = new IntersectionObserver(function (entries) {
      /* the observer delivers an initial callback for everything it is
         given, so this proves it is working even when nothing is on
         screen yet */
      observerAlive = true;
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    mount.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

    /* Safety net for the observer never delivering at all, which would
       leave the page permanently blank. Scoped to that case only —
       dropping the class unconditionally would disable scroll reveals
       for the whole page a few seconds after load. */
    setTimeout(function () {
      if (!observerAlive) document.documentElement.classList.remove('js');
    }, 3000);

    /* Every section below the hero is injected here, which means the
       browser already tried and failed to resolve the URL hash before
       any of it existed. Without this, an external link to /#work just
       dumps the visitor at the top of the page. */
    if (location.hash) {
      var deep = document.getElementById(location.hash.slice(1));
      if (deep) {
        deep.scrollIntoView();
        requestAnimationFrame(function () { deep.scrollIntoView(); });
      }
    }
  };
})();
