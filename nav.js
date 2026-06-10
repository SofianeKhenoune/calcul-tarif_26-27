(() => {
  const wrap = document.querySelector('.top-nav-wrap');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.top-nav');

  if (!wrap || !toggle || !nav) {
    return;
  }

  const SCROLL_TRIGGER = 30;

  const closeMenu = () => {
    wrap.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const updateState = () => {
    const isMobile = window.innerWidth <= 760;

    if (!isMobile) {
      document.body.classList.remove('nav-scrolled');
      closeMenu();
      return;
    }

    const hasScrolled = window.scrollY > SCROLL_TRIGGER;
    document.body.classList.toggle('nav-scrolled', hasScrolled);

    if (!hasScrolled) {
      closeMenu();
    }
  };

  toggle.addEventListener('click', () => {
    if (!document.body.classList.contains('nav-scrolled')) {
      return;
    }

    const nextState = !wrap.classList.contains('nav-open');
    wrap.classList.toggle('nav-open', nextState);
    toggle.setAttribute('aria-expanded', String(nextState));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('scroll', updateState, { passive: true });
  window.addEventListener('resize', updateState);
  updateState();
})();
