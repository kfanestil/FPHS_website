/* ====================================================================
   Homepage v3 behaviour.
   Ported from the Claude Design canvas component (DCLogic subclass) to
   plain JS on 2026-09-15. Scoped to the homepage; loaded after site.js.
   ==================================================================== */
(function () {
  'use strict';

  var FORMSPREE = 'https://formspree.io/f/meedqjka';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var root = document;

    /* ── Icons ──────────────────────────────────────────── */
    var icons = function () { if (window.lucide) window.lucide.createIcons(); };
    icons();
    var tries = 0;
    var poll = setInterval(function () {
      if (window.lucide || ++tries > 40) { icons(); clearInterval(poll); }
    }, 100);

    /* ── Footer year ────────────────────────────────────── */
    var y = root.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    /* ── Hero photo rotation with matching caption ──────── */
    var captions = [
      'Composite deck · Sanford',
      'Built-ins and TV mount · Longwood',
      'Vinyl privacy fence · Altamonte Springs',
      'Bathroom fixtures · Winter Park',
      'Backyard treehouse · Altamonte Springs'
    ];
    var slides = root.querySelectorAll('.fphs-slide');
    var cap = root.getElementById('fphs-caption');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (slides.length > 1 && !reduce) {
      var i = 0;
      setInterval(function () {
        slides[i].style.opacity = '0';
        i = (i + 1) % slides.length;
        slides[i].style.opacity = '1';
        if (cap && captions[i]) cap.textContent = captions[i];
      }, 5000);
    }

    /* ── Service filter ─────────────────────────────────── */
    var filterWrap = root.getElementById('svc-filter');
    var cards = root.querySelectorAll('.svc-card');
    if (filterWrap) {
      var btns = filterWrap.querySelectorAll('button');
      Array.prototype.forEach.call(btns, function (btn) {
        btn.addEventListener('click', function () {
          Array.prototype.forEach.call(btns, function (b) {
            b.style.background = '#F8F5F0';
            b.style.color = '#3A4754';
            b.style.borderColor = '#E4DFD4';
            b.setAttribute('aria-pressed', 'false');
          });
          btn.style.background = '#2C3E50';
          btn.style.color = '#F8F5F0';
          btn.style.borderColor = '#2C3E50';
          btn.setAttribute('aria-pressed', 'true');
          var f = btn.dataset.filter;
          Array.prototype.forEach.call(cards, function (c) {
            c.style.display = (f === 'all' || c.dataset.category === f) ? 'flex' : 'none';
          });
        });
      });
    }

    /* ── Booking picker ─────────────────────────────────── */
    var dayWrap = root.getElementById('book-days');
    var timeWrap = root.getElementById('book-times');
    var summary = root.getElementById('book-summary');
    var bookCta = root.getElementById('book-cta');
    var picked = { day: null, kind: null, saturday: false };
    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var restStyle = function (el) {
      el.style.background = '#fff';
      el.style.color = '#3A4754';
      el.style.borderColor = '#D6DAE0';
      el.setAttribute('aria-pressed', 'false');
    };
    var activeStyle = function (el) {
      el.style.background = '#2C3E50';
      el.style.color = '#F8F5F0';
      el.style.borderColor = '#2C3E50';
      el.setAttribute('aria-pressed', 'true');
    };

    /* Windows follow the posted hours: Mon to Fri 8 to 6, Saturday 9 to 3 */
    var ranges = {
      week: { Morning: '8 to 12', Afternoon: '12 to 5' },
      sat:  { Morning: '9 to 12', Afternoon: '12 to 3' }
    };

    var syncRanges = function () {
      if (!timeWrap) return;
      var set = picked.saturday ? ranges.sat : ranges.week;
      Array.prototype.forEach.call(timeWrap.querySelectorAll('button'), function (btn) {
        var span = btn.querySelector('.slot-range');
        if (span) span.textContent = set[btn.dataset.kind].toUpperCase();
      });
    };

    var requested = function () {
      if (!picked.day || !picked.kind) return '';
      var set = picked.saturday ? ranges.sat : ranges.week;
      return picked.day + ', ' + picked.kind.toLowerCase() + ' (' + set[picked.kind] + ')';
    };

    var updateSummary = function () {
      if (!summary) return;
      if (picked.day && picked.kind) {
        summary.textContent = requested() + '. Nothing is booked until we text you back to confirm.';
        summary.style.color = '#1B232C';
      } else if (picked.day) {
        summary.textContent = picked.day + '. Now pick a window.';
        summary.style.color = '#1B232C';
      } else {
        summary.textContent = 'Nothing is booked until we text you back to confirm.';
        summary.style.color = '#6A7785';
      }
    };

    if (dayWrap) {
      var today = new Date();
      var date = new Date(today.getTime());
      var added = 0;
      while (added < 6) {
        date.setDate(date.getDate() + 1);
        if (date.getDay() === 0) continue; /* closed Sundays */
        added++;
        (function (d) {
          var label = dayNames[d.getDay()];
          var isSat = d.getDay() === 6;
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'hv3-book-day';
          btn.setAttribute('aria-pressed', 'false');
          btn.innerHTML =
            '<span class="hv3-book-day-dow">' + label + '</span>' +
            '<span class="hv3-book-day-num">' + d.getDate() + '</span>' +
            '<span class="hv3-book-day-mon">' + monthNames[d.getMonth()] + '</span>';
          var human = label + ' ' + monthNames[d.getMonth()] + ' ' + d.getDate();
          btn.setAttribute('aria-label', 'Choose ' + human);
          btn.addEventListener('click', function () {
            Array.prototype.forEach.call(dayWrap.querySelectorAll('button'), restStyle);
            activeStyle(btn);
            picked.day = human;
            picked.saturday = isSat;
            syncRanges();
            updateSummary();
          });
          dayWrap.appendChild(btn);
        })(new Date(date.getTime()));
      }
    }

    if (timeWrap) {
      var tbtns = timeWrap.querySelectorAll('button');
      Array.prototype.forEach.call(tbtns, function (btn) {
        btn.addEventListener('click', function () {
          Array.prototype.forEach.call(tbtns, restStyle);
          activeStyle(btn);
          picked.kind = btn.dataset.kind;
          updateSummary();
        });
      });
    }
    updateSummary();

    /* ── Continue: carry the chosen window into the quote form ── */
    var timingField = root.getElementById('q-timing');
    var timingNote  = root.getElementById('q-timing-note');
    if (bookCta) {
      bookCta.addEventListener('click', function (ev) {
        ev.preventDefault();
        var req = requested();
        if (timingField) timingField.value = req;
        if (timingNote) {
          timingNote.textContent = 'Requested window: ' + req + '. Change it in the notes below if you need to.';
          timingNote.hidden = false;
        }
        var target = root.getElementById('quote');
        if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        var first = root.getElementById('q-name');
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, reduce ? 0 : 500);
      });
    }

    /* ── Quote form: real submission to Formspree ───────── */
    var form = root.getElementById('quote-form');
    var ok = root.getElementById('quote-ok');
    var err = root.getElementById('quote-err');
    if (form) {
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var label = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
        if (err) err.hidden = true;

        fetch(FORMSPREE, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.hidden = true;
          if (ok) { ok.hidden = false; icons(); ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
        }).catch(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = label; }
          if (err) { err.hidden = false; icons(); }
        });
      });
    }

    /* ── Sticky action bar on touch devices only ────────── */
    var bar = root.getElementById('action-bar');
    if (bar) {
      var syncBar = function () {
        var touch = window.matchMedia('(hover: none), (max-width: 860px)').matches;
        bar.style.display = touch ? 'grid' : 'none';
        document.body.style.paddingBottom = touch ? '60px' : '';
      };
      syncBar();
      window.addEventListener('resize', syncBar, { passive: true });
    }
  });
})();
