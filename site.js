// BrickBloom shared site behavior: scroll-reveal animations + sticky header state.
// Vanilla JS so it works on both the AngularJS homepage and the static product pages.
(function () {
  'use strict';

  // Scroll-reveal: automatically animate common content blocks into view.
  var revealSelectors = [
    '.section-heading',
    '.product-grid',
    '.card-grid .card',
    '.feature-card',
    '.product-card',
    '.contact-panel',
    '.contact-section .contact-copy',
    '.contact-section .contact-form',
    '.brand-banner-inner'
  ].join(', ');

  var revealEls = document.querySelectorAll(revealSelectors);

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

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
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Sticky header state on scroll.
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        topbar.classList.add('is-scrolled');
      } else {
        topbar.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Close the mobile nav overlay automatically after a link is tapped.
  var navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.checked = false;
      });
    });
  }
})();
