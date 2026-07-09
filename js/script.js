// ===== Año dinámico en el footer =====
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Header: se contrae al hacer scroll =====
const header = document.querySelector('.header');
window.addEventListener('scroll', function () {
  header.classList.toggle('header--scrolled', window.scrollY > 20);
}, { passive: true });

// ===== Revelado progresivo al hacer scroll =====
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(function (el) { el.classList.add('is-visible'); });
} else {
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) { revealObserver.observe(el); });
}

// ===== Contador animado: "Carga en 1 segundo" =====
const speedMetric = document.getElementById('speed-metric');

if (speedMetric) {
  const target = parseFloat(speedMetric.dataset.target);
  const suffix = speedMetric.querySelector('span');
  const suffixHTML = suffix ? suffix.outerHTML : '';

  function renderValue(value) {
    speedMetric.innerHTML = value.toFixed(2) + suffixHTML;
  }

  function animateCounter() {
    if (prefersReducedMotion) {
      renderValue(target);
      return;
    }
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      renderValue(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(speedMetric);
  } else {
    animateCounter();
  }
}

// ===== Formulario de contacto → redirige a WhatsApp con los datos =====
const WHATSAPP_NUMBER = '56948850047'; // TODO: reemplazar por el número real, formato 569XXXXXXXX

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const negocio = document.getElementById('negocio').value.trim();

  if (!nombre || !telefono || !negocio) {
    statusEl.textContent = 'Completa todos los campos para continuar.';
    return;
  }

  const mensaje =
    `Hola, soy ${nombre}.%0A` +
    `Teléfono: ${telefono}%0A` +
    `Mi negocio: ${negocio}%0A%0A` +
    `Quiero cotizar mi página web.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

  statusEl.textContent = 'Abriendo WhatsApp…';
  window.open(url, '_blank', 'noopener');
  form.reset();
});