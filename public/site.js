// BrickBloom shared site behavior: scroll-reveal animations + sticky header state.
// Vanilla JS — works on both the AngularJS homepage and static product pages.
(function () {
  'use strict';

  // Scroll-reveal: ONLY applied to elements that are clearly BELOW the fold.
  // Intentionally excludes .section-heading, .product-grid, .product-card
  // because those can appear near the top of product pages and cause a
  // "white screen" if the IntersectionObserver hasn't fired yet.
  var revealSelectors = [
    '.feature-card',
    '.brand-banner-inner',
    '.contact-panel',
    '.contact-section .contact-copy',
    '.contact-section .contact-form',
    '.card-grid .card',
    '.footer-brand'
  ].join(', ');

  var revealEls = document.querySelectorAll(revealSelectors);

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

  var makeAllVisible = function () {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  };

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    makeAllVisible();
  }

  // Hard failsafe: ensure nothing stays hidden after 1.2 seconds.
  // Covers edge cases where IntersectionObserver fires too slowly on mobile.
  setTimeout(makeAllVisible, 1200);

  // Sticky header shrinks slightly on scroll.
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Auto-close mobile nav when a link is tapped.
  var navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.checked = false;
      });
    });
  }
})();
