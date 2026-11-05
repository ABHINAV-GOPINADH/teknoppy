/* ======================================================
   WANDERLY — Main JavaScript
   Mobile nav, sticky header, smooth scroll, reveal
   ====================================================== */

(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Sticky Header ────────────────────────────────── */
  const header = $('#header');
  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ── Active nav link on scroll ────────────────────── */
  const sections = $$('section[id], div[id]');
  const navLinks = $$('.nav__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isActive = href === `#${id}` || (id === 'home' && href === '#');
            link.classList.toggle('active', isActive);
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-70px 0px 0px 0px' }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ── Mobile nav toggle ────────────────────────────── */
  const hamburger = $('#hamburger');
  const nav = $('#nav');

  function closeNav() {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click
  $$('.nav__link').forEach((link) =>
    link.addEventListener('click', closeNav)
  );

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) closeNav();
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  /* ── Smooth scroll for anchor links ──────────────── */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Scroll-reveal ────────────────────────────────── */
  const revealEls = [
    ...$$('.card'),
    ...$$('.benefit-card'),
    ...$$('.testimonial-card'),
    ...$$('.section__header'),
    ...$$('.hero__content'),
    ...$$('.cta-section__inner'),
  ];

  revealEls.forEach((el) => el.classList.add('reveal'));

  // Stagger children in grids
  $$('.cards-grid, .why-us__grid, .testimonials__grid').forEach((grid) => {
    $$('.reveal', grid).forEach((child, i) => {
      child.classList.add(`reveal--delay-${(i % 3) + 1}`);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── Destination card — simple hover tilt ─────────── */
  $$('.destination-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Back to top on logo click ────────────────────── */
  $$('.logo').forEach((logo) => {
    logo.addEventListener('click', (e) => {
      if (logo.getAttribute('href') === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

})();
