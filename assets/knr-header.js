(function () {
  function initMobileMenu(header) {
    var toggle = header.querySelector('[data-knr-menu-toggle]');
    var mobileNav = header.querySelector('[data-knr-mobile-nav]');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });
  }

  function initSearchModal(header) {
    var openBtn = header.querySelector('[data-knr-search-open]');
    var modal = header.querySelector('[data-knr-search-modal]');
    if (!openBtn || !modal) return;

    var closeTriggers = modal.querySelectorAll('[data-knr-search-close]');
    var searchInput = modal.querySelector('[data-knr-search-input]');
    var lastFocused = null;

    function openModal() {
      lastFocused = document.activeElement;
      modal.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('knr-header-search-open');
      if (searchInput) {
        searchInput.focus();
      }
    }

    function closeModal() {
      modal.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('knr-header-search-open');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    openBtn.addEventListener('click', openModal);

    closeTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.knr-header[data-section-id]').forEach(function (header) {
      initMobileMenu(header);
      initSearchModal(header);
    });
  });
})();
