/* ============================================================
   shards.js — the drifting-shard field and the ripple.

   Cold: loose colourless pieces drift and rotate, unresolved.
   Ripple: a wave leaves the word "life" and travels outward. As it
   reaches each piece, that piece fades from cold grey to its warm
   colour — position, drift and rotation are untouched throughout;
   only colour is ever animated by the wave.

   The wave radius is published to CSS as --r on the hero, so the
   clipped warm overlay and the canvas share one clock exactly.

   Classic script, no modules — these files open fine over file://.
   ============================================================ */

(function (global) {
  'use strict';

  var TAU = Math.PI * 2;

  /* ---------- small maths ---------- */
  var lerp       = function (a, b, t) { return a + (b - a) * t; };
  var clamp01    = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var easeOutQnt = function (t) { return 1 - Math.pow(1 - t, 5); };
  var easeInOut  = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  /* Deterministic RNG so a given mockup looks the same every reload —
     makes design feedback about the design, not about a lucky shuffle. */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  /* ============================================================
     Shape generators.
     Each returns an array of polygons — the *pieces* a solid is
     made of. Coordinates are normalised to roughly -1..1 and the
     pieces tile the form with no gaps, so when they land it reads
     as one object rather than a pile.
     ============================================================ */

  var SHAPES = {

    /* isometric cube — three rhombi */
    cube: function () {
      return [
        [[0, -1], [1, -0.5], [0, 0], [-1, -0.5]],       // top face
        [[-1, -0.5], [0, 0], [0, 1], [-1, 0.5]],        // left face
        [[1, -0.5], [1, 0.5], [0, 1], [0, 0]]           // right face
      ];
    },

    /* round-topped arch — real voussoirs plus two legs */
    arch: function (n) {
      n = n || 5;
      var ro = 1, ri = 0.52, out = [], i, a1, a2;
      for (i = 0; i < n; i++) {
        a1 = Math.PI - (Math.PI * i) / n;
        a2 = Math.PI - (Math.PI * (i + 1)) / n;
        out.push([
          [Math.cos(a1) * ro, -Math.sin(a1) * ro],
          [Math.cos(a2) * ro, -Math.sin(a2) * ro],
          [Math.cos(a2) * ri, -Math.sin(a2) * ri],
          [Math.cos(a1) * ri, -Math.sin(a1) * ri]
        ]);
      }
      out.push([[-ro, 0], [-ri, 0], [-ri, 1], [-ro, 1]]);   // left leg
      out.push([[ri, 0], [ro, 0], [ro, 1], [ri, 1]]);       // right leg
      return out;
    },

    /* stair-step stack — the "building things" one */
    stairs: function (n) {
      n = n || 4;
      var out = [], w = 2 / n, i, x, y;
      for (i = 0; i < n; i++) {
        x = -1 + i * w;
        y = 1 - (i + 1) * (2 / n);
        out.push([[x, 1], [x + w, 1], [x + w, y], [x, y]]);
      }
      return out;
    },

    /* triangle subdivided into four */
    tri: function () {
      var A = [0, -1], B = [1, 0.8], C = [-1, 0.8];
      var m = function (p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; };
      var ab = m(A, B), bc = m(B, C), ca = m(C, A);
      return [[A, ab, ca], [ab, B, bc], [ca, bc, C], [ab, bc, ca]];
    },

    /* bars of differing height — a chart, a skyline, a roadmap */
    bars: function (n) {
      n = n || 5;
      var out = [], w = 2 / n, hs = [0.45, 1.0, 0.7, 1.35, 0.9], i, x, h;
      for (i = 0; i < n; i++) {
        x = -1 + i * w;
        h = hs[i % hs.length];
        out.push([[x, 1], [x + w, 1], [x + w, 1 - h], [x, 1 - h]]);
      }
      return out;
    },

    /* a slab split by a diagonal — quiet, architectural */
    slab: function () {
      return [
        [[-1, -0.55], [1, -0.55], [1, 0], [-1, 0]],
        [[-1, 0], [1, 0], [1, 0.55], [-1, 0.55]]
      ];
    }
  };

  /* ---------- rounded polygon path ("less blocky, more soft edges") ---------- */
  function tracePoly(ctx, pts, r) {
    var n = pts.length, i, cur, next, prev, mid1, mid2;

    if (!r) {
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      return;
    }

    /* clamp the radius so it can never exceed half of the shortest edge */
    var minEdge = Infinity;
    for (i = 0; i < n; i++) {
      cur = pts[i]; next = pts[(i + 1) % n];
      minEdge = Math.min(minEdge, Math.hypot(next[0] - cur[0], next[1] - cur[1]));
    }
    r = Math.min(r, minEdge * 0.45);

    prev = pts[n - 1];
    mid1 = [(prev[0] + pts[0][0]) / 2, (prev[1] + pts[0][1]) / 2];
    ctx.moveTo(mid1[0], mid1[1]);

    for (i = 0; i < n; i++) {
      cur = pts[i];
      next = pts[(i + 1) % n];
      mid2 = [(cur[0] + next[0]) / 2, (cur[1] + next[1]) / 2];
      ctx.arcTo(cur[0], cur[1], mid2[0], mid2[1], r);
      ctx.lineTo(mid2[0], mid2[1]);
    }
    ctx.closePath();
  }

  function polyCentroid(pts) {
    var x = 0, y = 0, i;
    for (i = 0; i < pts.length; i++) { x += pts[i][0]; y += pts[i][1]; }
    return [x / pts.length, y / pts.length];
  }

  /* ============================================================
     ShardField
     ============================================================ */

  function ShardField(canvas, cfg) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cfg = cfg;
    this.rand = rng(cfg.seed || 7);
    this.shards = [];
    this.t0 = performance.now();
    this.wave = { on: false, t: 0, r: 0, max: 0, ox: 0, oy: 0 };
    this.scrollY = 0;
    this.w = 0; this.h = 0;
    this.running = false;
  }

  /* Lay out the pieces of each shape across the hero box, scattered
     around where that shape would have sat, then explode every piece
     outward to its floating start. Pieces never assemble — the ripple
     only brings their colour in, so they keep drifting exactly as
     they were laid out here for as long as the hero is on screen. */
  ShardField.prototype.layout = function (w, h) {
    var cfg = this.cfg, R = this.rand, self = this;
    this.w = w; this.h = h;
    this.shards = [];

    var small = Math.min(w, h);

    /* On a phone the hero is a narrow column of text with no margins to
       spare, so most shapes would land on top of it — and because `small`
       collapses to the width, the survivors would read as specks. Cull to
       the ones flagged for narrow, and scale those up to compensate. */
    var narrow = w < cfg.narrowAt;
    var list = narrow
      ? cfg.shapes.filter(function (s) { return s.narrow !== false; })
      : cfg.shapes;

    list.forEach(function (spec, gi) {
      var polys = SHAPES[spec.shape](spec.n);
      /* polys span -1..1, so halve: spec.size is the full width of the
         finished shape as a fraction of the smaller viewport axis */
      var size  = small * spec.size * 0.5 * (narrow ? cfg.narrowScale : 1);
      var cx    = w * spec.x;
      var cy    = h * spec.y;

      polys.forEach(function (poly, pi) {
        var c = polyCentroid(poly);

        /* anchor each piece near where its shape would have sat */
        var tx = cx + c[0] * size;
        var ty = cy + c[1] * size;

        /* recentre the polygon on its own centroid so rotation/scale
           happen about the piece, not about the shape's origin */
        var local = poly.map(function (p) { return [p[0] - c[0], p[1] - c[1]]; });

        /* scattered start — pushed outward from the anchor, spun, shrunk */
        var ang  = R() * TAU;
        var dist = small * (cfg.scatter[0] + R() * (cfg.scatter[1] - cfg.scatter[0]));

        self.shards.push({
          poly:  local,
          size:  size,

          sx: tx + Math.cos(ang) * dist,
          sy: ty + Math.sin(ang) * dist,
          srot: (R() - 0.5) * cfg.spin,
          sscale: cfg.startScale[0] + R() * (cfg.startScale[1] - cfg.startScale[0]),

          driftAmp:   small * (0.012 + R() * 0.022) * cfg.drift,
          driftSpd:   0.10 + R() * 0.16,
          driftPhase: R() * TAU,
          rotSpd:     (R() - 0.5) * 0.10 * cfg.drift,

          fill: cfg.palette[(gi + pi) % cfg.palette.length],

          /* set when the wave arrives, to time the colour fade-in */
          started: false, startAt: 0
        });
      });
    });
  };

  ShardField.prototype.resize = function () {
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var rect = this.canvas.parentNode.getBoundingClientRect();
    this.canvas.width  = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.canvas.style.width  = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.layout(rect.width, rect.height);
  };

  /* current on-screen position of a shard while it is still loose */
  ShardField.prototype.loosePos = function (s, time) {
    var a = time * s.driftSpd + s.driftPhase;
    return {
      x: s.sx + Math.cos(a) * s.driftAmp,
      y: s.sy + Math.sin(a * 0.8) * s.driftAmp,
      rot: s.srot + time * s.rotSpd,
      scale: s.sscale
    };
  };

  ShardField.prototype.trigger = function (ox, oy, maxR) {
    if (this.wave.on) return;
    this.wave.on = true;
    this.wave.ox = ox;
    this.wave.oy = oy;
    this.wave.max = maxR;
    this.wave.startedAt = performance.now();
  };

  ShardField.prototype.settleInstantly = function () {
    this.wave.on = true;
    this.wave.t = 1;
    this.wave.r = this.wave.max = Math.hypot(this.w, this.h);
    this.shards.forEach(function (s) { s.started = true; });
  };

  ShardField.prototype.draw = function (now) {
    var ctx = this.ctx, cfg = this.cfg, w = this.w, h = this.h;
    var time = (now - this.t0) / 1000;
    var wave = this.wave;

    ctx.clearRect(0, 0, w, h);

    /* --- advance the wave, publish radius to CSS --- */
    if (wave.on && wave.t < 1) {
      wave.t = clamp01((now - wave.startedAt) / cfg.waveMs);
      wave.r = easeOutQnt(wave.t) * wave.max;
      if (this.onWave) this.onWave(wave.r, wave.t);
    }

    var i, s, p, tt, x, y, rot, sc, alpha, d;

    for (i = 0; i < this.shards.length; i++) {
      s = this.shards[i];

      /* has the wavefront reached this piece yet? once it has, the
         piece only gains colour — it keeps drifting exactly as before,
         never assembling into its shape's home position */
      if (wave.on && !s.started) {
        d = Math.hypot(s.sx - wave.ox, s.sy - wave.oy);
        if (wave.r >= d) {
          s.started = true;
          s.startAt = now;
        }
      }

      p = this.loosePos(s, time);
      x = p.x; y = p.y; rot = p.rot; sc = p.scale;
      tt = s.started ? clamp01((now - s.startAt) / cfg.fadeMs) : 0;

      ctx.save();
      ctx.translate(x, y + this.scrollY * cfg.parallax);
      ctx.rotate(rot);
      ctx.scale(sc * s.size, sc * s.size);

      ctx.beginPath();
      tracePoly(ctx, s.poly, cfg.corner);

      /* colour arrives with the piece */
      alpha = easeInOut(tt);
      if (alpha > 0.001) {
        ctx.globalAlpha = alpha * cfg.fillAlpha;
        ctx.fillStyle = s.fill;
        ctx.fill();
      }

      ctx.globalAlpha = lerp(cfg.strokeAlpha, cfg.strokeAlphaWarm, alpha);
      ctx.strokeStyle = alpha > 0.5 ? cfg.strokeWarm : cfg.stroke;
      ctx.lineWidth = cfg.lineWidth / (sc * s.size);
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };

  ShardField.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    var self = this;
    (function frame(now) {
      if (!self.running) return;
      self.draw(now || performance.now());
      self.raf = requestAnimationFrame(frame);
    })(performance.now());
  };

  ShardField.prototype.stop = function () {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  };

  /* ============================================================
     initHero — wires the field, the warm overlays, the click,
     the keyboard, the 3s auto-fire and reduced motion.
     ============================================================ */

  global.initHero = function (userCfg) {
    var cfg = Object.assign({
      seed: 7,
      shapes: [],
      palette: ['#B8841F'],
      scatter: [0.25, 0.62],
      startScale: [0.55, 1.0],
      spin: 2.4,
      drift: 1,
      corner: 0.07,
      lineWidth: 1.1,
      stroke: '#B6B0A4',
      strokeWarm: '#A9832F',
      strokeAlpha: 0.55,
      strokeAlphaWarm: 0.35,
      fillAlpha: 1,
      waveMs: 1150,
      fadeMs: 950,
      litMs: 1300,
      parallax: 0,
      autoFireMs: 3000,
      narrowAt: 640,
      narrowScale: 1.5
    }, userCfg || {});

    /* ?cold or #cold holds the pre-ripple state open indefinitely, so the
       cold and warm designs can be looked at side by side. */
    if (/cold/.test(location.search + location.hash)) cfg.autoFireMs = Infinity;

    var hero   = document.querySelector('.hero');
    var inner  = hero.querySelector('.hero-inner');
    var lifeEl = hero.querySelector('.life');
    var canvas = hero.querySelector('.shards');
    var root   = document.documentElement;

    /* --- warm layers: background wash, and a clone of the hero
           text styled warm. Both clipped by the same expanding
           circle centred on the word "life". --- */
    var warmBg = document.createElement('div');
    warmBg.className = 'warm warm--bg';

    var warmText = document.createElement('div');
    warmText.className = 'warm warm--text';
    var clone = inner.cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
    /* nothing inside a decorative clone should be reachable */
    clone.querySelectorAll('a, button, input').forEach(function (el) {
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-hidden', 'true');
    });
    warmText.appendChild(clone);

    hero.insertBefore(warmBg, canvas);
    hero.appendChild(warmText);

    var field = new ShardField(canvas, cfg);
    field.onWave = function (r, t) {
      hero.style.setProperty('--r', r + 'px');
      hero.style.setProperty('--rt', t);
    };

    /* --- ripple origin: the measured centre of the word "life" --- */
    var origin = { x: 0, y: 0, max: 0 };
    function measure() {
      var hr = hero.getBoundingClientRect();
      var lr = lifeEl.getBoundingClientRect();
      origin.x = lr.left + lr.width / 2 - hr.left;
      origin.y = lr.top + lr.height / 2 - hr.top;
      origin.max = Math.max(
        Math.hypot(origin.x, origin.y),
        Math.hypot(hr.width - origin.x, origin.y),
        Math.hypot(origin.x, hr.height - origin.y),
        Math.hypot(hr.width - origin.x, hr.height - origin.y)
      ) * 1.02;
      hero.style.setProperty('--ox', origin.x + 'px');
      hero.style.setProperty('--oy', origin.y + 'px');
    }

    var reduced = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fired = false;
    var booted = false;
    var pending = false;
    var autoTimer;

    var cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      warmBg.remove();
      warmText.remove();
      hero.classList.add('is-done');
    }

    function finish() {
      root.classList.add('is-warm');
      /* force a paint of the now-warm real content *before* pulling the
         overlay, so the swap is invisible rather than a flash */
      void document.body.offsetHeight;
      requestAnimationFrame(cleanup);
      /* rAF never fires in a background tab, which would strand a
         full-screen clone of the hero on top of the page. Guarantee it. */
      setTimeout(cleanup, 120);
    }

    function fire() {
      if (fired) return;
      /* An impatient click can land before the webfonts resolve, i.e.
         before the field has been laid out and the word "life" has a
         stable box to measure. Hold the intent and honour it at boot
         rather than rippling from a position that is about to move. */
      if (!booted) { pending = true; return; }
      fired = true;
      clearTimeout(autoTimer);
      hero.classList.add('is-rippling');
      if (trigger) trigger.remove();

      if (reduced) {
        field.settleInstantly();
        /* no rAF loop is running in this mode, so paint the settled
           field explicitly — otherwise the canvas keeps its last cold frame */
        field.draw(performance.now());
        hero.style.setProperty('--r', '200vmax');
        setTimeout(finish, 420);
        return;
      }

      /* "life" gets its colour first and holds there a beat, on its
         own fast transition, before the wave actually spreads —
         a beat of anticipation so the moment reads as deliberate,
         not just a click that happens to cause a color change. */
      lifeEl.classList.add('is-lit');
      setTimeout(function () {
        measure();
        field.trigger(origin.x, origin.y, origin.max);
      }, cfg.litMs);
      setTimeout(finish, cfg.litMs + cfg.waveMs + cfg.fadeMs + 120);
    }

    /* --- input ---
       The whole hero is clickable for the mouse, but the accessible
       control is a real <button> rather than a role="button" wrapper
       around live links. Keyboard and screen readers get it for free,
       and the 3s auto-fire means nobody is gated on finding it. */
    var trigger = hero.querySelector('.hero__trigger');

    hero.addEventListener('click', fire);
    if (trigger) {
      trigger.addEventListener('click', function (e) { e.stopPropagation(); fire(); });
    }
    /* let the résumé / nav links inside the hero do their own job */
    inner.querySelectorAll('a, button:not(.hero__trigger)').forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); });
    });

    /* --- boot --- */
    function boot() {
      if (booted) return;
      booted = true;
      measure();
      field.resize();
      if (reduced) {
        field.draw(performance.now());
      } else {
        field.start();
      }
      if (pending) { fire(); return; }
      /* ?cold holds the pre-ripple state open so it can be reviewed
         side by side with the warm one instead of raced against */
      if (isFinite(cfg.autoFireMs)) autoTimer = setTimeout(fire, cfg.autoFireMs);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(boot);
      /* fonts.ready can hang on a flaky network; never let that strand the page */
      setTimeout(boot, 2500);
    } else {
      boot();
    }

    /* --- resize: relayout, but never revert an already-warm field back to cold --- */
    var rt;
    global.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        var wasDone = fired;
        field.resize();
        measure();
        if (wasDone) field.settleInstantly();
        if (!field.running && !reduced) field.start();
        if (reduced || !field.running) field.draw(performance.now());
      }, 150);
    });

    /* --- stop drawing once the hero is off screen --- */
    if ('IntersectionObserver' in global) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (reduced) return;
          if (e.isIntersecting) field.start(); else field.stop();
        });
      }, { threshold: 0 }).observe(hero);
    }

    if (cfg.parallax) {
      global.addEventListener('scroll', function () {
        field.scrollY = global.scrollY;
      }, { passive: true });
    }

    return field;
  };

  global.ShardField = ShardField;
  global.SHARD_SHAPES = SHAPES;

})(window);
