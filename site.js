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

  // Active nav state based on the section in view.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  var setActiveLink = function (hash) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === hash);
    });
  };

  var updateActiveLink = function () {
    var scrollPosition = window.scrollY + 180;
    var activeHash = '#products';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPosition) {
        activeHash = '#' + section.id;
      }
    });

    setActiveLink(activeHash);
  };

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setActiveLink(link.getAttribute('href'));
    });
  });

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

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

  // Hero full-bleed rotating banner carousel — auto-advances with a
  // crossfade, pauses on hover, and supports clicking the dots.
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('.hero-fb-slide'));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll('.hero-fb-dot'));
  if (heroSlides.length > 1) {
    var heroIndex = Math.max(0, heroSlides.findIndex(function (s) { return s.classList.contains('is-active'); }));
    var heroTimer = null;
    var HERO_INTERVAL = 5000;

    var showHeroSlide = function (nextIndex) {
      heroSlides[heroIndex].classList.remove('is-active');
      if (heroDots[heroIndex]) {
        heroDots[heroIndex].classList.remove('is-active');
        heroDots[heroIndex].setAttribute('aria-selected', 'false');
      }
      heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
      heroSlides[heroIndex].classList.add('is-active');
      if (heroDots[heroIndex]) {
        heroDots[heroIndex].classList.add('is-active');
        heroDots[heroIndex].setAttribute('aria-selected', 'true');
      }
    };

    var startHeroTimer = function () {
      clearInterval(heroTimer);
      heroTimer = setInterval(function () {
        showHeroSlide(heroIndex + 1);
      }, HERO_INTERVAL);
    };

    heroDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showHeroSlide(i);
        startHeroTimer();
      });
    });

    var heroSection = document.querySelector('.hero-fullbleed');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', function () { clearInterval(heroTimer); });
      heroSection.addEventListener('mouseleave', startHeroTimer);
    }

    startHeroTimer();
  }
})();
