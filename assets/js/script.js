'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== PARALLAX =====
const gridOverlay = document.getElementById('gridOverlay');
const blobLayer = document.getElementById('blobLayer');
const avatarParallax = document.getElementById('avatarParallax');

if (!prefersReducedMotion && (gridOverlay || blobLayer || avatarParallax)) {
  let ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    if (gridOverlay) gridOverlay.style.transform = `translate3d(0,${y * .025}px,0)`;
    if (blobLayer) blobLayer.style.transform = `translate3d(0,${y * .06}px,0)`;
    if (avatarParallax) avatarParallax.style.transform = `translate3d(0,${y * -.035}px,0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });
}

// ===== NAVBAR SCROLL STATE =====
const navbar = document.querySelector('.nav-bar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyThemeIcon() {
  if (!themeIcon) return;
  const isLight = document.documentElement.classList.contains('theme-light');
  themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
applyThemeIcon();

themeToggle?.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('theme-light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  applyThemeIcon();
  themeToggle.classList.add('spin');
  setTimeout(() => themeToggle.classList.remove('spin'), 450);
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// ===== TYPEWRITER =====
const roles = ['Full-Stack Developer', 'Flutter Developer', 'Deployment & Hosting Specialist'];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
  if (!typewriterEl) return;
  const current = roles[roleIndex];
  if (!isDeleting) {
    typewriterEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1700);
      return;
    }
  } else {
    typewriterEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 34 : 72);
}
typeLoop();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===== SMOOTH CURSOR GLOW (lerp) =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
  const half = 250;
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let gx = cx, gy = cy;

  window.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; }, { passive: true });

  (function animateCursor() {
    gx += (cx - gx) * .09;
    gy += (cy - gy) * .09;
    cursorGlow.style.transform = `translate(${gx - half}px,${gy - half}px)`;
    requestAnimationFrame(animateCursor);
  })();
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}
