(function () {
  const DESKTOP_MQ = window.matchMedia('(min-width: 769px)');

  function syncMenuPanels(section) {
    section.querySelectorAll('[data-knr-footer-menu]').forEach((menuCol) => {
      const panel = menuCol.querySelector('[data-knr-footer-panel]');
      const trigger = menuCol.querySelector('[data-knr-footer-toggle]');
      if (!panel || !trigger) return;

      if (DESKTOP_MQ.matches) {
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        menuCol.classList.remove('knr-footer__menu-col--open');
      } else if (!menuCol.classList.contains('knr-footer__menu-col--open')) {
        panel.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initSection(section) {
    section.querySelectorAll('[data-knr-footer-toggle]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        if (DESKTOP_MQ.matches) return;

        const menuCol = trigger.closest('[data-knr-footer-menu]');
        const panel = menuCol?.querySelector('[data-knr-footer-panel]');
        if (!menuCol || !panel) return;

        const isOpen = menuCol.classList.contains('knr-footer__menu-col--open');

        if (isOpen) {
          menuCol.classList.remove('knr-footer__menu-col--open');
          panel.hidden = true;
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          menuCol.classList.add('knr-footer__menu-col--open');
          panel.hidden = false;
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    syncMenuPanels(section);
    DESKTOP_MQ.addEventListener('change', () => syncMenuPanels(section));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-knr-footer]').forEach(initSection);

    // #region agent log
    document.querySelectorAll('[data-knr-footer]').forEach((section) => {
      const localization = section.querySelector('.knr-footer__localization');
      const countryCount = Number(localization?.dataset.knrCountries || 0);
      const languageCount = Number(localization?.dataset.knrLanguages || 0);
      const triggers = section.querySelectorAll('.knr-footer__locale-trigger');
      const staticLocales = section.querySelectorAll('.knr-footer__locale--static');

      fetch('http://127.0.0.1:7780/ingest/6fc1480c-03ce-451d-9a0b-1d7ba0f9292d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '88cc25' },
        body: JSON.stringify({
          sessionId: '88cc25',
          runId: 'locale-v2',
          hypothesisId: 'H6-H7',
          location: 'knr-footer.js:locale-counts',
          message: 'Footer localization availability',
          data: {
            countryCount,
            languageCount,
            currentCountry: localization?.dataset.knrCountry || '',
            currentLanguage: localization?.dataset.knrLanguage || '',
            triggerCount: triggers.length,
            staticLocaleCount: staticLocales.length,
            labels: [...triggers, ...staticLocales].map((el) =>
              el.querySelector('.knr-footer__locale-label')?.textContent?.trim()
            ),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});

      triggers.forEach((trigger, index) => {
        const icon = trigger.querySelector('.icon-caret');
        const iconStyles = icon ? getComputedStyle(icon) : null;

        fetch('http://127.0.0.1:7780/ingest/6fc1480c-03ce-451d-9a0b-1d7ba0f9292d', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '88cc25' },
          body: JSON.stringify({
            sessionId: '88cc25',
            runId: 'locale-v2',
            hypothesisId: 'H1-H4',
            location: 'knr-footer.js:locale-debug',
            message: 'Footer locale trigger computed styles',
            data: {
              index,
              labelText: trigger.querySelector('.knr-footer__locale-label')?.textContent?.trim() || '',
              icon: iconStyles
                ? { width: iconStyles.width, height: iconStyles.height, position: iconStyles.position }
                : null,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      });
    });
    // #endregion
  });
})();
