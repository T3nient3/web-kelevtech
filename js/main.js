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
      return;
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

// ===== Contador animado: velocidad de carga =====
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

// ===== Carrusel Premium estilo Apple =====
(function () {
  try {
    var carousel   = document.getElementById('portfolioCarousel');
    var track      = document.getElementById('carouselTrack');
    var trackWrap  = track ? track.parentElement : null;
    var dotsWrap   = document.getElementById('carouselDots');
    var btnPrev    = document.getElementById('carouselPrev');
    var btnNext    = document.getElementById('carouselNext');
    if (!carousel || !track || !trackWrap) return;

    var slides     = Array.from(track.querySelectorAll('.carousel__slide'));
    var total      = slides.length;
    var current    = 0;
    var autoplayMs = 4000;
    var autoplayId = null;
    var isPaused   = false;
    var GAP        = 20;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Ir a diapositiva ' + (i + 1));
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.from(dotsWrap.querySelectorAll('.carousel__dot'));

    function calcOffset(activeIdx) {
      var wrapW     = trackWrap.clientWidth;
      var slideW    = slides[0].offsetWidth;
      var slideLeft = activeIdx * (slideW + GAP);
      var offset    = (wrapW / 2) - slideLeft - (slideW / 2);
      return offset;
    }

    function getState(idx, active) {
      var diff = idx - active;
      if (diff >  total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      if (diff === 0)  return 'active';
      if (diff === -1) return 'prev';
      if (diff ===  1) return 'next';
      if (diff === -2) return 'far-prev';
      if (diff ===  2) return 'far-next';
      return 'hidden';
    }

    function render(active) {
      var offset = calcOffset(active);
      track.style.transform = 'translateX(' + offset + 'px)';

      slides.forEach(function (slide, i) {
        slide.setAttribute('data-state', getState(i, active));
      });

      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-selected', i === active ? 'true' : 'false');
      });
    }

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      render(current);
      resetAutoplay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
      autoplayId = setInterval(function () {
        if (!isPaused) next();
      }, autoplayMs);
    }

    function resetAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
      startAutoplay();
    }

    btnPrev.addEventListener('click', function () { prev(); });
    btnNext.addEventListener('click', function () { next(); });

    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function () {
        if (slide.getAttribute('data-state') !== 'active') {
          goTo(i);
        }
      });
    });

    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { prev(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
    });

    carousel.addEventListener('mouseenter', function () { isPaused = true; });
    carousel.addEventListener('mouseleave', function () { isPaused = false; });
    carousel.addEventListener('focusin',    function () { isPaused = true; });
    carousel.addEventListener('focusout',   function () { isPaused = false; });

    var touchStartX = 0;
    var touchStartY = 0;

    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) next();
        else        prev();
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      render(current);
    }, { passive: true });

    render(0);
    startAutoplay();

  } catch (err) {
    console.error('Error en carrusel:', err);
  }
})();