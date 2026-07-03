(function () {
  const MOBILE_MQ = window.matchMedia('(max-width: 768px)');

  function updateProgress(swiper, progressEl) {
    if (!progressEl) return;

    const segments = progressEl.querySelectorAll('[data-knr-news-progress-segment]');
    segments.forEach((segment, index) => {
      const isActive = index === swiper.activeIndex;
      segment.classList.toggle('is-active', isActive);
      segment.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function bindProgressClicks(progressEl, getSwiper) {
    if (!progressEl || progressEl.dataset.knrNewsProgressBound === 'true') return;

    progressEl.dataset.knrNewsProgressBound = 'true';
    progressEl.addEventListener('click', (event) => {
      const segment = event.target.closest('[data-knr-news-progress-segment]');
      if (!segment) return;

      const swiper = getSwiper();
      if (!swiper) return;

      const index = Number(segment.dataset.slideIndex);
      if (Number.isNaN(index)) return;

      swiper.slideTo(index);
    });
  }

  function initSection(section) {
    const sliderEl = section.querySelector('[data-knr-news-swiper]');
    const progressEl = section.querySelector('[data-knr-news-progress]');
    if (!sliderEl || typeof Swiper === 'undefined') return;

    let swiper = null;

    bindProgressClicks(progressEl, () => swiper);

    function destroySwiper() {
      if (!swiper) return;
      swiper.destroy(true, true);
      swiper = null;
    }

    function createSwiper() {
      if (swiper) return;

      swiper = new Swiper(sliderEl, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        watchOverflow: true,
        on: {
          init: function () {
            updateProgress(this, progressEl);
          },
          slideChange: function () {
            updateProgress(this, progressEl);
          },
        },
      });
    }

    function syncMode() {
      if (MOBILE_MQ.matches) {
        createSwiper();
      } else {
        destroySwiper();
      }
    }

    syncMode();
    MOBILE_MQ.addEventListener('change', syncMode);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-knr-latest-news]').forEach(initSection);
  });
})();
