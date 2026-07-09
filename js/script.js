// ===== Año dinámico en el footer =====
(function () {
  try {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (err) {
    console.error('Error en año dinámico:', err);
  }
})();

// ===== Header: se contrae al hacer scroll =====
(function () {
  try {
    var header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    }, { passive: true });
  } catch (err) {
    console.error('Error en header scroll:', err);
  }
})();

// ===== Revelado progresivo al hacer scroll =====
(function () {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  try {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      return; // se quedan visibles por defecto, sin animación
    }

    document.documentElement.classList.add('js-enabled');

    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } catch (err) {
    console.error('Error en scroll reveal:', err);
    document.documentElement.classList.remove('js-enabled');
  }
})();

// ===== Contador animado: "Carga en 1 segundo" =====
(function () {
  try {
    var speedMetric = document.getElementById('speed-metric');
    if (!speedMetric) return;

    var target = parseFloat(speedMetric.dataset.target);
    var suffix = speedMetric.querySelector('span');
    var suffixHTML = suffix ? suffix.outerHTML : '';
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderValue(value) {
      speedMetric.innerHTML = value.toFixed(2) + suffixHTML;
    }

    function animateCounter() {
      if (prefersReducedMotion) {
        renderValue(target);
        return;
      }
      var duration = 900;
      var start = performance.now();

      function tick(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        renderValue(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
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
  } catch (err) {
    console.error('Error en contador de velocidad:', err);
  }
})();

// ===== Formulario de contacto → redirige a WhatsApp con los datos =====
(function () {
  try {
    var WHATSAPP_NUMBER = '56948850047';
    var form = document.getElementById('contact-form');
    var statusEl = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre = document.getElementById('nombre').value.trim();
      var telefono = document.getElementById('telefono').value.trim();
      var negocio = document.getElementById('negocio').value.trim();

      if (!nombre || !telefono || !negocio) {
        if (statusEl) statusEl.textContent = 'Completa todos los campos para continuar.';
        return;
      }

      var mensaje =
        'Hola, soy ' + nombre + '.%0A' +
        'Teléfono: ' + telefono + '%0A' +
        'Mi negocio: ' + negocio + '%0A%0A' +
        'Quiero cotizar mi página web.';

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + mensaje;

      if (statusEl) statusEl.textContent = 'Abriendo WhatsApp…';
      window.open(url, '_blank', 'noopener');
      form.reset();
    });
  } catch (err) {
    console.error('Error en formulario de contacto:', err);
  }
})();