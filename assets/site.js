/* Fanny Pack Home Services — shared site behavior (v2, 2026-09-06) */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* Icons */
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    /* Copyright year */
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    /* Mobile nav */
    var toggle = document.getElementById('nav-toggle');
    var mobileNav = document.getElementById('nav-mobile');
    if (toggle && mobileNav) {
      var icon = toggle.querySelector('i');
      toggle.addEventListener('click', function () {
        var open = mobileNav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        mobileNav.setAttribute('aria-hidden', String(!open));
        if (icon) {
          icon.setAttribute('data-lucide', open ? 'x' : 'menu');
          if (window.lucide) window.lucide.createIcons();
        }
      });
      document.querySelectorAll('.mobile-link').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileNav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          mobileNav.setAttribute('aria-hidden', 'true');
          if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            if (window.lucide) window.lucide.createIcons();
          }
        });
      });
    }

    /* Nav goes solid + blurred once scrolled */
    var nav = document.getElementById('site-nav');
    if (nav) {
      var onScrollNav = function () {
        nav.classList.toggle('scrolled', window.scrollY > 24);
      };
      onScrollNav();
      window.addEventListener('scroll', onScrollNav, { passive: true });
    }

    if (!('IntersectionObserver' in window)) return;

    /* Scroll-triggered reveals.
       Several pages ship their own IntersectionObserver pass inline.
       This runs on load, after those, and only claims elements nobody
       else picked up, so an element never receives two delay classes. */
    window.addEventListener('load', function () {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !e.target.classList.contains('animated')) {
            e.target.classList.add('animated');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

      var claimed = 0;
      document.querySelectorAll('.inc-card, .service-card, .step, .t-card, .gallery-item, .ba-card')
        .forEach(function (el) {
          if (el.classList.contains('fade-in-up')) return;
          el.classList.add('fade-in-up', 'delay-' + ((claimed % 4) + 1));
          claimed++;
          io.observe(el);
        });
    });

    /* Hairline rules draw in */
    var ruleIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ruleIO.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.rule-draw').forEach(function (el) { ruleIO.observe(el); });

    if (reduced) return;

    /* Parallax — rAF throttled, translate only */
    var par = document.querySelectorAll('.parallax');
    if (par.length) {
      var ticking = false;
      var updatePar = function () {
        var vh = window.innerHeight;
        par.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          var depth = parseFloat(el.getAttribute('data-par')) || 0.06;
          var mid = r.top + r.height / 2 - vh / 2;
          el.style.setProperty('--par', (-mid * depth).toFixed(1) + 'px');
        });
        ticking = false;
      };
      var onScrollPar = function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(updatePar); }
      };
      updatePar();
      window.addEventListener('scroll', onScrollPar, { passive: true });
      window.addEventListener('resize', onScrollPar, { passive: true });
    }

    /* Pointer tilt on cards — fine pointers only */
    if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.querySelectorAll('.tilt').forEach(function (card) {
        var raf = null;
        card.addEventListener('mousemove', function (ev) {
          if (raf) return;
          raf = window.requestAnimationFrame(function () {
            var r = card.getBoundingClientRect();
            var px = (ev.clientX - r.left) / r.width - 0.5;
            var py = (ev.clientY - r.top) / r.height - 0.5;
            card.style.setProperty('--ry', (px * 5).toFixed(2) + 'deg');
            card.style.setProperty('--rx', (-py * 5).toFixed(2) + 'deg');
            raf = null;
          });
        });
        card.addEventListener('mouseleave', function () {
          card.style.setProperty('--ry', '0deg');
          card.style.setProperty('--rx', '0deg');
        });
      });
    }
  });
})();
