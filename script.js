const revealItems = document.querySelectorAll('[data-reveal]');
const tiltItems = document.querySelectorAll('[data-tilt]');
const navLinks = document.querySelectorAll('.nav-link');
const sections = [
  document.getElementById('home'),
  document.getElementById('projects'),
  document.getElementById('contact')
].filter(Boolean);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('active', isActive);
  });
}

function initReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function initSectionTracking() {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    {
      threshold: 0.42
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function initTilt() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  tiltItems.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 12;
      const rotateX = ((y / rect.height) - 0.5) * -12;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function initSoftParallax() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const heroOrbital = document.querySelector('.hero-orbital');
  if (!heroOrbital) {
    return;
  }

  let rafId = null;
  document.addEventListener('pointermove', (event) => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
      const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;
      heroOrbital.style.transform = `translate3d(${xRatio * 8}px, ${yRatio * 8}px, 0)`;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSectionTracking();
  initTilt();
  initSoftParallax();
  setActiveNav('home');
});