// ── CURSOR ───────────────────────────────────────────────
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function loop() {
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .project-card, .service-card, .cap-card, .stat-box').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('expand'));
  el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
});

// ── SCROLL PROGRESS ──────────────────────────────────────
const bar = document.getElementById('progressBar');
function updateProgress() {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (scrolled / total * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ── NAV SCROLL STATE ─────────────────────────────────────
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── REVEAL ON SCROLL ─────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

// ── COUNT-UP NUMBERS ─────────────────────────────────────
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = +el.dataset.count;
    let current  = 0;
    const inc    = target / 40;
    const timer  = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = (current < target ? Math.floor(current) : target) + '+';
      if (current >= target) clearInterval(timer);
    }, 30);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// ── LANGUAGE TOGGLE ──────────────────────────────────────
let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;

  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (!val) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else if (el.tagName === 'OPTION') {
      el.textContent = val;
    } else {
      el.innerHTML = val;
    }
  });

  const ta = document.getElementById('projectTextarea');
  if (ta) {
    ta.placeholder = lang === 'pt'
      ? 'Descreva o seu negócio, o que precisa e o seu prazo...'
      : 'Describe your business, what you need, and your timeline...';
  }

  document.documentElement.lang = lang === 'pt' ? 'pt' : 'en';

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.title = lang === 'pt'
    ? 'Nabin — Soluções Web & Digitais'
    : 'Nabin — Web & Digital Solutions';
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});
