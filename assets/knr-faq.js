(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-knr-faq]').forEach((faqRoot) => {
      faqRoot.querySelectorAll('[data-knr-faq-trigger]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('[data-knr-faq-item]');
          const panel = item?.querySelector('[data-knr-faq-panel]');
          const isOpen = item?.classList.contains('knr-faq__item--open');

          if (!item || !panel) return;

          if (isOpen) {
            item.classList.remove('knr-faq__item--open');
            panel.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('knr-faq__item--open');
            panel.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
          }
        });

        trigger.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            trigger.click();
          }
        });
      });
    });
  });
})();
