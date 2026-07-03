(function () {
  function setComparisonPosition(comparison, percent) {
    const stage = comparison.querySelector('.knr-ba-comparison__stage');
    const handle = comparison.querySelector('[data-knr-ba-handle]');
    if (!stage || !handle) return;

    const clamped = Math.max(0, Math.min(100, percent));
    comparison.style.setProperty('--knr-ba-position', clamped + '%');
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));

    if (stage.offsetWidth) {
      comparison.style.setProperty('--knr-ba-stage-width', stage.offsetWidth + 'px');
    }
  }

  function initComparison(comparison) {
    const stage = comparison.querySelector('.knr-ba-comparison__stage');
    const handle = comparison.querySelector('[data-knr-ba-handle]');
    if (!stage || !handle) return;

    let dragging = false;

    function syncStageWidth() {
      if (stage.offsetWidth) {
        comparison.style.setProperty('--knr-ba-stage-width', stage.offsetWidth + 'px');
      }
    }

    function positionFromClientX(clientX) {
      const rect = stage.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setComparisonPosition(comparison, percent);
    }

    function startDrag() {
      dragging = true;
      handle.setAttribute('aria-grabbed', 'true');
    }

    function stopDrag() {
      dragging = false;
      handle.setAttribute('aria-grabbed', 'false');
    }

    setComparisonPosition(comparison, 50);
    syncStageWidth();

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: true });

    window.addEventListener('mousemove', (event) => {
      if (!dragging) return;
      event.preventDefault();
      positionFromClientX(event.clientX);
    });

    window.addEventListener(
      'touchmove',
      (event) => {
        if (!dragging || !event.touches[0]) return;
        positionFromClientX(event.touches[0].clientX);
      },
      { passive: true }
    );

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    function getCurrentPosition() {
      const val = getComputedStyle(comparison).getPropertyValue('--knr-ba-position').trim();
      return parseFloat(val) || 50;
    }

    handle.addEventListener('keydown', (event) => {
      const current = getCurrentPosition();
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setComparisonPosition(comparison, current - 5);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setComparisonPosition(comparison, current + 5);
      }
    });

    stage.addEventListener('click', (event) => {
      if (event.target.closest('[data-knr-ba-handle]')) return;
      positionFromClientX(event.clientX);
    });

    window.addEventListener('resize', syncStageWidth);
  }

  function initTestimonials(section) {
    const root = section.querySelector('[data-knr-ba-testimonials]');
    const swiperEl = section.querySelector('[data-knr-ba-testimonials-swiper]');
    const prevBtn = section.querySelector('[data-knr-ba-testimonials-prev]');
    const nextBtn = section.querySelector('[data-knr-ba-testimonials-next]');

    if (!root || !swiperEl || typeof Swiper === 'undefined') return;

    const slideCount = swiperEl.querySelectorAll('.swiper-slide').length;
    const enableLoop = slideCount > 1;

    const swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: enableLoop,
      watchOverflow: false,
      navigation: {
        prevEl: prevBtn,
        nextEl: nextBtn,
      },
    });

    root._knrBaSwiper = swiper;
  }

  function initSection(section) {
    section.querySelectorAll('[data-knr-ba-comparison]').forEach(initComparison);
    initTestimonials(section);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-knr-before-after]').forEach(initSection);
  });
})();
