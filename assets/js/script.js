// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// Typewriter rotating roles
const roles = ['Full-Stack Developer', 'Flutter Developer', 'Frontend Developer'];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  if (!typewriterEl) return;
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Cursor glow (desktop only)
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.transform = `translate(${e.clientX - 190}px, ${e.clientY - 190}px)`;
  });
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}
