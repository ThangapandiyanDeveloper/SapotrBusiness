/* ═══════════════════════════════════════════════════════════
   SAPOTR Business — page behaviour (vanilla JS, no libraries)
   One file for index.html and about.html; every block returns
   early when its markup is not on the page.
    1 Helpers             7 Testimonials
    2 Header + nav        8 Hire steps
    3 Reveals + split     9 Accordions (industries, FAQ)
    4 Scroll FX          10 Count-up numbers
    5 Carousel engine    11 Store links + back to top
    6 Hero               12 Micro-interactions
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ───── 1 · Helpers ───── */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  function debounce(fn, wait) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, wait); };
  }

  /** Run cb once, the first time el enters the viewport. */
  function once(el, cb, opts) {
    if (!el) return;
    if (!('IntersectionObserver' in window) || reduced) { cb(el); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        cb(e.target);
        io.unobserve(e.target);
      });
    }, opts || { threshold: 0.25 });
    io.observe(el);
  }

  /* rAF-coalesced scroll subscribers — one listener for the whole page. */
  var onScroll = (function () {
    var subs = [], queued = false;
    function run() { queued = false; var y = window.scrollY; subs.forEach(function (f) { f(y); }); }
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(run);
    }, { passive: true });
    window.addEventListener('resize', run);
    return function (f) { subs.push(f); f(window.scrollY); };
  })();

  /* ───── 2 · Header + nav ───── */
  var header = $('.site-header');
  var heroEl = $('[data-hero]');          /* the home carousel, or the About page's banner */
  var burger = $('#burger');
  var mnav = $('#mobile-nav');
  var NAV_BP = 1100;                      /* keep in step with the burger breakpoint in styles.css */

  function syncHeader(y) {
    var overHero = heroEl && (y === undefined ? window.scrollY : y) < heroEl.offsetHeight - 90;
    header.dataset.mode = (overHero && mnav.hidden) ? 'over' : 'solid';
  }
  onScroll(syncHeader);

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.hidden = !open;
    syncHeader();
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
    if (!mnav.hidden) { var first = $('a, button', mnav); if (first) first.focus(); }
  });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); burger.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!mnav.hidden && !header.contains(e.target)) setMenu(false);
  });
  window.addEventListener('resize', debounce(function () {
    if (!mnav.hidden && window.innerWidth > NAV_BP) setMenu(false);
  }, 150));

  /* About Us dropdown: the link opens the page, the chevron (or hovering) opens
     the four sections; Escape, focus leaving or a click outside closes it */
  $$('.has-drop').forEach(function (li) {
    var btn = $('.drop-btn', li), menu = $('.drop', li);
    if (!btn || !menu) return;
    var t = null, byHover = false;
    function set(open) {
      clearTimeout(t);
      btn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      if (!open) byHover = false;
    }
    btn.addEventListener('click', function () {
      if (!menu.hidden && byHover) { byHover = false; return; }   /* hover opened it: the click keeps it open */
      set(menu.hidden);
    });
    if (fine) {
      li.addEventListener('mouseenter', function () { clearTimeout(t); if (menu.hidden) { set(true); byHover = true; } });
      li.addEventListener('mouseleave', function () { if (byHover) t = setTimeout(function () { set(false); }, 180); });
    }
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); }
    });
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', function (e) { if (!menu.hidden && !li.contains(e.target)) set(false); });
  });

  /* the nav link for the section in view stays lit */
  (function scrollSpy() {
    var links = $$('.nav-list > li > a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.dataset.spy || a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = map[e.target.id];
        if (a && !e.isIntersecting && a.getAttribute('aria-current')) a.removeAttribute('aria-current');
      });
      /* side-by-side sections (Mission + Vision) arrive together: the first one leads */
      var lead = es.filter(function (e) { return e.isIntersecting && map[e.target.id]; })[0];
      if (lead) {
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        map[lead.target.id].setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  })();

  /* ───── 3 · Reveals + headline word split ───── */
  /* Wrap each word so it can rise out of its own overflow box. */
  function splitInto(host, text) {
    text.split(/(\s+)/).forEach(function (chunk) {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) { host.appendChild(document.createTextNode(' ')); return; }
      var w = document.createElement('span');
      w.className = 'w';
      var i = document.createElement('i');
      i.textContent = chunk;
      w.appendChild(i);
      host.appendChild(w);
    });
  }
  /* elements (line spans, highlights) are kept and split inside, at any depth */
  function splitNode(node, host) {
    Array.prototype.slice.call(node.childNodes).forEach(function (c) {
      if (c.nodeType === 3) splitInto(host, c.textContent);
      else if (c.nodeType === 1) { var h = c.cloneNode(false); splitNode(c, h); host.appendChild(h); }
    });
  }
  $$('[data-split]').forEach(function (el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var frag = document.createDocumentFragment();
    splitNode(el, frag);
    el.textContent = '';
    el.appendChild(frag);
    el.setAttribute('aria-label', label);   /* read as one phrase, not word by word */
    $$('.w i', el).forEach(function (i, n) { i.style.transitionDelay = (n * 55) + 'ms'; });
  });

  (function reveals() {
    var items = $$('[data-r], [data-split]');
    if (!('IntersectionObserver' in window) || reduced) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.filter(function (e) { return e.isIntersecting; })
        .forEach(function (e, i) {
          if (e.target.hasAttribute('data-r')) {
            e.target.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
            /* the delay is for the entrance only — hover must stay instant */
            setTimeout(function () { e.target.style.transitionDelay = ''; }, 1200);
          }
          e.target.classList.add('in');
          io.unobserve(e.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ───── 4 · Scroll FX: progress bar, cursor glow ───── */
  (function scrollFx() {
    var bar = $('#scroll-bar span');
    onScroll(function (y) {
      if (!bar) return;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    });

    var glow = $('#cursor-glow');
    if (glow && fine && !reduced) {
      var gx = 0, gy = 0, cx = 0, cy = 0, on = false, running = false;
      var loop = function () {
        cx += (gx - cx) * 0.08;
        cy += (gy - cy) * 0.08;
        glow.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0) translate(-50%,-50%)';
        /* settle, then stop asking for frames */
        if (Math.abs(gx - cx) + Math.abs(gy - cy) > 0.5) requestAnimationFrame(loop); else running = false;
      };
      window.addEventListener('pointermove', function (e) {
        gx = e.clientX; gy = e.clientY;
        if (!on) { on = true; glow.style.opacity = '1'; }
        if (!running) { running = true; requestAnimationFrame(loop); }
      }, { passive: true });
    }
  })();

  /* ───── 5 · Carousel engine — the hero's, shared with the testimonials ─────
     Two numbers describe everything on screen — `index` (the slide
     showing) and `leaving` (the one fading out, or -1) — and paint()
     derives every class from them, so nothing can accumulate.
     Navigation during a cross-fade is coalesced into one pending
     request, so an arrow, a swipe or the clock always moves exactly
     one slide. Every reason to wait (keyboard focus, a drag, hovering
     the controls, off screen, hidden tab) is tracked separately, and
     the dwell resumes from where it stopped. */
  function carousel(o) {
    var stage = o.stage, slides = o.slides;
    if (!stage || !slides || slides.length < 2) return null;
    var n = slides.length;
    var SWIPE_MIN = 40;     /* px of sideways travel that counts as a swipe */
    var SWIPE_LOCK = 8;     /* px before deciding whether it is a swipe or a scroll */
    var FLICK = 0.35;       /* px/ms: a quick short flick also counts */
    var dwellFor = function (i) { return typeof o.dwell === 'number' ? o.dwell : o.dwell[i % o.dwell.length]; };

    var index = 0, leaving = -1, busy = false, queued = null;
    var timer = null, fadeTimer = null, startedAt = 0, remaining = dwellFor(0), fresh = true;
    var holds = { focus: false, drag: false, hover: false, off: false, hidden: false };

    slides.forEach(function (s) { s.removeAttribute('hidden'); });

    function paused() { for (var k in holds) { if (holds[k]) return true; } return false; }

    function paint() {
      slides.forEach(function (s, i) {
        var on = i === index;
        s.classList.toggle('is-active', on);
        s.classList.toggle('is-out', i === leaving);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        if ('inert' in s) s.inert = !on;           /* nothing focusable in a slide you cannot see */
      });
      if (o.onPaint) o.onPaint(index, slides[index]);
    }

    function syncClasses() {
      o.root.classList.toggle('is-auto', !reduced);
      o.root.classList.toggle('is-paused', paused() || busy);
    }

    function schedule() {
      clearTimeout(timer); timer = null;
      syncClasses();
      if (reduced || busy || paused()) return;
      if (fresh) { fresh = false; if (o.onClock) o.onClock(remaining); }
      startedAt = Date.now();
      timer = setTimeout(function () { go(index + 1, false); }, remaining);
    }
    /* stop the clock but remember how much of the dwell is left */
    function freeze() {
      if (timer) {
        clearTimeout(timer); timer = null;
        remaining = Math.max(700, remaining - (Date.now() - startedAt));
      }
      syncClasses();
    }
    function hold(reason, on) {
      if (holds[reason] === on) return;
      holds[reason] = on;
      if (paused()) freeze(); else schedule();
    }

    function endFade() {
      busy = false;
      leaving = -1;
      paint();
      if (queued !== null) {
        var q = queued; queued = null;
        if (q !== index) { go(q, true); return; }
      }
      schedule();
    }

    /* the one way the carousel ever moves */
    function go(i, manual) {
      var target = ((i % n) + n) % n;
      if (busy) { queued = target; return; }
      if (target === index) return;
      /* announce a slide the reader asked for; stay quiet while it turns by itself */
      if (o.live) o.live.setAttribute('aria-live', manual ? 'polite' : 'off');
      leaving = index;
      index = target;
      busy = true;
      clearTimeout(timer); timer = null;
      remaining = manual ? o.manualDwell : dwellFor(index);
      fresh = true;
      if (o.onReset) o.onReset();
      paint();
      syncClasses();
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(endFade, reduced ? 20 : o.xfade);
    }

    /* keyboard focus inside the slides holds them, so nobody is moved on mid-sentence */
    stage.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) hold('focus', true); });
    stage.addEventListener('focusout', function () { hold('focus', false); });
    /* the small arrows: one slide per click; a manual move resets the clock */
    if (o.prev) o.prev.addEventListener('click', function () { go(index - 1, true); });
    if (o.next) o.next.addEventListener('click', function () { go(index + 1, true); });

    /* hovering a button or an arrow means a click is coming */
    if (fine && o.hoverEls) {
      o.hoverEls.forEach(function (el) {
        if (!el) return;
        el.addEventListener('mouseenter', function () { hold('hover', true); });
        el.addEventListener('mouseleave', function () { hold('hover', false); });
      });
    }
    document.addEventListener('visibilitychange', function () { hold('hidden', document.visibilityState === 'hidden'); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { hold('off', !e.isIntersecting); });
      }, { threshold: 0.2 }).observe(stage);
    }

    stage.addEventListener('keydown', function (e) {
      if (e.target.closest('input, textarea')) return;
      var k = e.key;
      if (k === 'ArrowLeft') go(index - 1, true);
      else if (k === 'ArrowRight') go(index + 1, true);
      else if (k === 'Home') go(0, true);
      else if (k === 'End') go(n - 1, true);
      else return;
      e.preventDefault();
    });

    /* ---- gestures ----
       One code path for touch, pen and mouse. The first few pixels decide
       the gesture: mostly sideways means a swipe, mostly vertical means it
       belongs to the page and we let go at once, so scrolling over the
       carousel is never blocked (touch-action: pan-y does the rest).
       A swipe is accepted at any moment, even mid cross-fade (go() queues
       it), and it resets the autoplay clock. */
    (function gestures() {
      var down = false, decided = false, mine = false, moved = false;
      var x0 = 0, y0 = 0, dx = 0, t0 = 0, pid = null;

      function begin(x, y, id) {
        down = true; decided = false; mine = false; moved = false;
        x0 = x; y0 = y; dx = 0; t0 = Date.now(); pid = id;
      }
      /* true once the gesture is ours, so the caller may stop the page scrolling */
      function track(x, y) {
        if (!down) return false;
        dx = x - x0;
        var dy = y - y0;
        if (!decided) {
          if (Math.abs(dx) < SWIPE_LOCK && Math.abs(dy) < SWIPE_LOCK) return false;
          decided = true;
          mine = Math.abs(dx) > Math.abs(dy);
          if (!mine) { down = false; return false; }      /* a vertical scroll: hands off */
          stage.classList.add('is-dragging');
          hold('drag', true);
        }
        moved = true;
        slides[index].style.setProperty('--hdx', (dx * (o.dragFollow || 0.34)).toFixed(1) + 'px');
        return true;
      }
      function finish(x) {
        if (!down) return;
        down = false;
        if (typeof x === 'number') dx = x - x0;
        slides[index].style.removeProperty('--hdx');
        stage.classList.remove('is-dragging');
        if (!mine) return;
        mine = false;
        hold('drag', false);
        var speed = Math.abs(dx) / Math.max(1, Date.now() - t0);
        if (Math.abs(dx) > SWIPE_MIN || (Math.abs(dx) > 20 && speed > FLICK)) {
          go(index + (dx < 0 ? 1 : -1), true);           /* left: next, right: previous */
        }
      }

      if (window.PointerEvent) {
        stage.addEventListener('pointerdown', function (e) {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          if (e.target.closest('.c-arrow, .dots')) return;     /* an arrow is a click, never a drag */
          begin(e.clientX, e.clientY, e.pointerId);
        });
        stage.addEventListener('pointermove', function (e) {
          if (e.pointerId !== pid) return;
          var was = mine;
          if (track(e.clientX, e.clientY) && !was && e.pointerType === 'mouse') {
            try { stage.setPointerCapture(pid); } catch (err) { /* fine without */ }
          }
        });
        stage.addEventListener('pointerup', function (e) { if (e.pointerId === pid) finish(e.clientX); });
        stage.addEventListener('pointercancel', function (e) { if (e.pointerId === pid) finish(); });
      } else {
        /* older mobile browsers without Pointer Events */
        stage.addEventListener('touchstart', function (e) {
          var t = e.changedTouches[0]; begin(t.clientX, t.clientY, t.identifier);
        }, { passive: true });
        stage.addEventListener('touchmove', function (e) {
          var t = e.changedTouches[0];
          if (track(t.clientX, t.clientY) && e.cancelable) e.preventDefault();
        }, { passive: false });
        stage.addEventListener('touchend', function (e) { finish(e.changedTouches[0].clientX); });
        stage.addEventListener('touchcancel', function () { finish(); });
      }
      /* a drag must not also count as a click on whatever it started over */
      stage.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
      stage.addEventListener('dragstart', function (e) { e.preventDefault(); });

      /* a sideways two-finger swipe on a trackpad moves one slide */
      var acc = 0, lock = 0;
      stage.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        if (Date.now() < lock) return;
        acc += e.deltaX;
        if (Math.abs(acc) > 60) {
          go(index + (acc > 0 ? 1 : -1), true);
          acc = 0;
          lock = Date.now() + 900;
        }
      }, { passive: false });
    })();

    /* boot: the first slide arrives like any other, then the clock starts */
    busy = true;
    paint();
    syncClasses();
    fadeTimer = setTimeout(endFade, reduced ? 20 : o.xfade);

    return {
      go: go,
      current: function () { return index; },
      slides: slides,
      state: function () { return { armed: !!timer, index: index, busy: busy, queued: queued, holds: JSON.parse(JSON.stringify(holds)), remaining: remaining }; }
    };
  }

  /* ───── 6 · Hero — six banners ───── */
  var hero = (function () {
    var root = $('#hero');
    if (!root) return null;
    var now = $('#hero-now'), prog = $('#hero-prog');
    return carousel({
      root: root,
      stage: $('#hero-stage'),
      slides: $$('#hero-slides > .hs'),
      dwell: [7200, 6200, 7600, 7000, 7600, 8000],   /* the busier banners hold a touch longer */
      manualDwell: 11000,                              /* after a manual move, give the reader time */
      xfade: 950,                                      /* keep in step with the .hs transitions */
      prev: $('#hero-prev'),
      next: $('#hero-next'),
      live: $('#hero-slides'),
      hoverEls: $$('#hero .hs-cta, #hero .hero-ui-in'),
      onPaint: function (i, s) {
        var tone = s.dataset.tone || 'dark';
        root.dataset.tone = tone;
        header.dataset.tone = tone;
        if (now) now.textContent = pad2(i + 1);
      },
      onReset: function () { if (prog) prog.classList.remove('run'); },
      onClock: function (ms) {
        if (!prog) return;
        root.style.setProperty('--dwell', ms + 'ms');
        prog.classList.remove('run');
        void prog.offsetWidth;                         /* restart the dwell bar from empty */
        prog.classList.add('run');
      }
    });
  })();

  /* ───── 7 · Testimonials — one per view ───── */
  var reviews = (function () {
    var stage = $('#tm-stage');
    if (!stage) return null;
    var slides = $$('#tm-slides > .tm-slide');
    var now = $('#tm-now'), dotsBox = $('#tm-dots'), dots = [];
    var api = null;
    if (dotsBox) {
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.tabIndex = -1;
        b.setAttribute('aria-label', 'Show testimonial ' + (i + 1) + ' of ' + slides.length);
        b.addEventListener('click', function () { if (api) api.go(i, true); });
        dotsBox.appendChild(b);
        dots.push(b);
      });
    }
    api = carousel({
      root: $('#reviews'),
      stage: stage,
      slides: slides,
      dwell: 8000,
      manualDwell: 14000,
      xfade: 650,
      dragFollow: 0.5,
      prev: $('#tm-prev'),
      next: $('#tm-next'),
      live: $('#tm-slides'),
      hoverEls: [stage],                               /* reading a quote holds it */
      onPaint: function (i) {
        if (now) now.textContent = pad2(i + 1);
        dots.forEach(function (d, k) { d.setAttribute('aria-selected', String(k === i)); });
      }
    });
    return api;
  })();
  window.SAPOTR = { hero: hero, reviews: reviews };

  /* ───── 8 · Hire steps — the phone shows the step in focus ─────
     Every step's text is always visible; the phone beside it plays
     the matching screen. It moves on by itself while the section is
     on screen, and a click (or keyboard) picks a step and holds it. */
  (function hireSteps() {
    var list = $('#hsteps');
    if (!list) return;
    var items = $$('.hstep', list);
    var views = $$('.hp-view');
    var STEP = 5600, HOLD = 12000, TICK = 100;
    var at = 0, elapsed = 0, holdUntil = 0, onScreen = false, hovering = false, ticker = null;

    function bar(i, p) {
      var b = $('.hstep-bar i', items[i]);
      if (b) b.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    }
    function set(i) {
      at = i; elapsed = 0;
      items.forEach(function (li, k) {
        li.classList.toggle('is-on', k === i);
        $('button', li).setAttribute('aria-pressed', String(k === i));
        bar(k, 0);
      });
      views.forEach(function (v, k) { v.classList.toggle('is-on', k === i); });
    }
    items.forEach(function (li, k) {
      $('button', li).addEventListener('click', function () { holdUntil = Date.now() + HOLD; set(k); });
    });
    if (fine) {
      list.addEventListener('mouseenter', function () { hovering = true; });
      list.addEventListener('mouseleave', function () { hovering = false; });
    }
    if (reduced) return;
    function tick() {
      if (hovering || document.hidden || Date.now() < holdUntil) return;
      elapsed += TICK;
      bar(at, Math.min(1, elapsed / STEP));
      if (elapsed >= STEP) set((at + 1) % items.length);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        onScreen = es[0].isIntersecting;
        clearInterval(ticker); ticker = null;
        if (onScreen) ticker = setInterval(tick, TICK);
      }, { threshold: 0.35 }).observe(list);
    }
  })();

  /* ───── 9 · Accordions — industries (any number open) and FAQ (one at a time) ───── */
  function accordion(root, btnSel, single) {
    if (!root) return;
    var btns = $$(btnSel, root);
    function setItem(btn, open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.closest('[data-acc-item]').classList.toggle('is-open', open);
    }
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        if (single && open) btns.forEach(function (o) { if (o !== btn) setItem(o, false); });
        setItem(btn, open);
      });
    });
  }
  accordion($('#ind-grid'), '.ind-q', false);
  accordion($('#acc'), '.acc-q', true);

  /* ───── 10 · Count-up numbers + section cues ───── */
  $$('[data-count]').forEach(function (el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    if (reduced || !('IntersectionObserver' in window)) { el.textContent = String(target); return; }
    el.textContent = '0';
    once(el, function () {
      var start = null;
      (function frame(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 1800, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(frame);
      })(performance.now());
    }, { threshold: 0.6 });
  });
  once($('#trust-panel'), function (el) { el.classList.add('in'); }, { threshold: 0.4 });

  /* ───── 11 · Store links + back to top ─────
     Paste the live listings here once the apps are published; every
     store badge and "Download the App" button picks them up. Until
     then they stay placeholders that simply do nothing. */
  var APP_LINKS = { ios: '', android: '' };
  (function storeLinks() {
    var ua = navigator.userAgent;
    var mine = /iPhone|iPad|iPod/.test(ua) ? 'ios' : (/Android/.test(ua) ? 'android' : '');
    $$('[data-store]').forEach(function (a) {
      var key = a.dataset.store === 'auto' ? mine : a.dataset.store;
      var url = APP_LINKS[key] || (a.dataset.store === 'auto' ? (APP_LINKS.ios || APP_LINKS.android) : '');
      if (!url) return;
      a.href = url;
      a.removeAttribute('data-placeholder');
      a.target = '_blank';
      a.rel = 'noopener';
    });
  })();

  /* Logo, footer link and Home all point at #top: one delegated listener
     scrolls there smoothly and leaves the URL alone. Links marked
     data-placeholder (stores, socials awaiting their live URLs) do nothing. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#top"], a[data-placeholder]');
    if (!a) return;
    e.preventDefault();
    if (a.hasAttribute('data-placeholder')) return;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });

  /* ───── 12 · Micro-interactions: spotlight + magnet ───── */
  if (fine && !reduced) {
    $$('[data-spot]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    /* buttons drift a few pixels toward the cursor */
    $$('.magnet').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + 'px,' +
                                            ((e.clientY - r.top - r.height / 2) * 0.18).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ───── Misc ───── */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
