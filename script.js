// Smooth-scroll offset adjustment and active link highlighting
(function(){
  const header = document.getElementById('header');
  const links = document.querySelectorAll('.nav__link');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const backToTop = document.getElementById('backToTop');
  const yearEl = document.getElementById('year');
  const cursor = document.getElementById('cursor');
  const themeToggle = document.getElementById('themeToggle');

  // Year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  if (navToggle && navMenu){
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close when clicking a link (mobile)
    navMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.classList.contains('nav__link')){
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scrolling for internal anchors with header offset
  function scrollWithOffset(hash){
    const el = document.querySelector(hash);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = (header?.offsetHeight || 0) + 8;
    const y = rect.top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    e.preventDefault();
    scrollWithOffset(href);
    history.pushState(null, '', href);
  });

  // Intersection Observer for on-scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting){
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Active link highlighting based on scroll position
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.6 });
  sections.forEach(s => sectionObserver.observe(s));

  // Back to top visibility
  const showTop = () => {
    if (!backToTop) return;
    const show = window.scrollY > 600;
    backToTop.style.opacity = show ? '1' : '0.0';
    backToTop.style.pointerEvents = show ? 'auto' : 'none';
  };
  showTop();
  window.addEventListener('scroll', showTop, { passive: true });

  // Simple typed text effect in hero
  const typedEl = document.getElementById('typedText');
  if (typedEl){
    const phrases = ['Full Stack Developer', 'Mobile App Developer', 'AI Engineer'];
    let idx = 0, char = 0, deleting = false;
    function tick(){
      const current = phrases[idx];
      char += deleting ? -1 : 1;
      typedEl.textContent = current.slice(0, char);
      if (!deleting && char === current.length){
        deleting = true; setTimeout(tick, 1100); return;
      }
      if (deleting && char === 0){
        deleting = false; idx = (idx + 1) % phrases.length;
      }
      const delay = deleting ? 50 : 90;
      setTimeout(tick, delay);
    }
    setTimeout(tick, 600);
  }

  // Contact form validation + mailto fallback
  // Contact form was removed; no JS needed here

  // Theme: load preference & toggle
  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
    }
    if (themeToggle){
      themeToggle.querySelector('.theme-toggle__icon').textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  };
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

  if (themeToggle){
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('theme-dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.querySelector('.theme-toggle__icon').textContent = isDark ? '☀️' : '🌙';
    });
  }

  // Custom cursor interactions
  if (cursor){
    let hideTimer;
    const move = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.classList.remove('is-hidden');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => cursor.classList.add('is-hidden'), 2000);
    };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', () => cursor.classList.add('is-press'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-press'));

    const hoverables = document.querySelectorAll('a, button, .btn, .card, .xp-card, input, textarea');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }
})();


