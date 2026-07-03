(function () {
  function updateRitualNav(swiper, prevBtn, nextBtn) {
    if (prevBtn) {
      prevBtn.hidden = swiper.isBeginning;
      prevBtn.disabled = swiper.isBeginning;
    }
    if (nextBtn) {
      nextBtn.hidden = swiper.isEnd;
      nextBtn.disabled = swiper.isEnd;
    }
  }

  function initRitualSwiper(container) {
    const root = container.querySelector('[data-knr-product-ritual]');
    if (!root || typeof Swiper === 'undefined') return;

    const swiperEl = root.querySelector('.knr-product-ritual__swiper');
    const prevBtn = root.querySelector('[data-knr-ritual-prev]');
    const nextBtn = root.querySelector('[data-knr-ritual-next]');
    if (!swiperEl) return;

    const swiper = new Swiper(swiperEl, {
      slidesPerView: 2.35,
      spaceBetween: 12,
      watchOverflow: true,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      breakpoints: {
        990: {
          slidesPerView: 2.5,
          spaceBetween: 16,
        },
      },
      on: {
        init: function () {
          updateRitualNav(this, prevBtn, nextBtn);
        },
        slideChange: function () {
          updateRitualNav(this, prevBtn, nextBtn);
        },
        resize: function () {
          updateRitualNav(this, prevBtn, nextBtn);
        },
        reachBeginning: function () {
          updateRitualNav(this, prevBtn, nextBtn);
        },
        reachEnd: function () {
          updateRitualNav(this, prevBtn, nextBtn);
        },
        fromEdge: function () {
          updateRitualNav(this, prevBtn, nextBtn);
        },
      },
    });

    root._knrRitualSwiper = swiper;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.knr-product-main[data-section-id]').forEach(initRitualSwiper);
  });
})();
