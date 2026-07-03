(function () {
  function getMainPicker() {
    return document.querySelector('.knr-product-main[data-knr-variant-picker]');
  }

  function getProductFromMain() {
    const main = getMainPicker();
    const jsonEl = main?.querySelector('[data-knr-product-json]');
    if (!jsonEl) return null;
    return JSON.parse(jsonEl.textContent);
  }

  function findMediaSrc(product, variant) {
    if (!product?.media?.length) return null;
    if (variant.featured_media_id) {
      const match = product.media.find((m) => m.id === variant.featured_media_id);
      if (match) return match.src;
    }
    return product.media[0]?.src || null;
  }

  function updateQuickAddBar(bar, variant, product) {
    if (!bar || !variant) return;

    const idInput = bar.querySelector('[data-knr-editorial-variant-id]');
    if (idInput) {
      idInput.value = variant.id;
      idInput.disabled = !variant.available;
    }

    const submitBtn = bar.querySelector('[data-knr-editorial-submit]');
    if (submitBtn) {
      submitBtn.disabled = !variant.available;
      submitBtn.textContent = variant.available
        ? submitBtn.dataset.labelAvailable || 'Add to cart'
        : submitBtn.dataset.labelSoldOut || 'Sold out';
    }

    const priceEl = bar.querySelector('[data-knr-current-price]');
    if (priceEl) {
      priceEl.textContent = variant.price_formatted || '';
    }

    const compareWrap = bar.querySelector('[data-knr-compare-wrap]');
    const compareEl = bar.querySelector('[data-knr-compare-at]');
    const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;

    if (compareEl && compareWrap) {
      if (onSale) {
        compareEl.textContent = variant.compare_at_price_formatted || '';
        compareWrap.hidden = false;
        compareWrap.classList.remove('knr-price__compare--hidden');
      } else {
        compareWrap.hidden = true;
        compareWrap.classList.add('knr-price__compare--hidden');
      }
    }

    const priceRoot = bar.querySelector('[data-knr-price]');
    if (priceRoot) {
      priceRoot.classList.toggle('knr-price--on-sale', onSale);
      priceRoot.classList.toggle('knr-price--sold-out', !variant.available);
    }

    bar.querySelectorAll('[data-knr-editorial-option]').forEach((btn) => {
      const isActive = variant.options[Number(btn.dataset.optionIndex)] === btn.dataset.value;
      btn.classList.toggle('knr-editorial-quick-add__variant--active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const imgEl = bar.querySelector('[data-knr-editorial-image]');
    const src = findMediaSrc(product, variant);
    if (imgEl && src) {
      imgEl.src = src;
    }
  }

  function syncMainPicker(optionIndex, value) {
    const main = getMainPicker();
    if (!main) return;

    const group = main.querySelectorAll('[data-knr-option-group]')[optionIndex];
    if (!group) return;

    group.querySelectorAll('[data-knr-option]').forEach((input) => {
      const link = input.closest('.knr-product-main__option-link');
      if (input.value === value) {
        input.checked = true;
        link?.classList.add('knr-product-main__option-link--active');
      } else {
        link?.classList.remove('knr-product-main__option-link--active');
      }
    });

    const selectedInput = group.querySelector(`[data-knr-option][value="${CSS.escape(value)}"]`);
    selectedInput?.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function initBar(bar) {
    bar.querySelectorAll('[data-knr-editorial-option]').forEach((btn) => {
      btn.addEventListener('click', () => {
        syncMainPicker(Number(btn.dataset.optionIndex), btn.dataset.value);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-knr-editorial-quick-add]').forEach(initBar);

    document.addEventListener('knr:variant-change', (event) => {
      const { variant, product } = event.detail || {};
      if (!variant) return;

      document.querySelectorAll('[data-knr-editorial-quick-add]').forEach((bar) => {
        updateQuickAddBar(bar, variant, product);
      });
    });

    const main = getMainPicker();
    const product = getProductFromMain();
    if (main && product) {
      const urlVariantId = new URLSearchParams(window.location.search).get('variant');
      const initialVariant =
        product.variants.find((v) => String(v.id) === urlVariantId) ||
        product.variants.find((v) => v.available) ||
        product.variants[0];

      if (initialVariant) {
        document.querySelectorAll('[data-knr-editorial-quick-add]').forEach((bar) => {
          updateQuickAddBar(bar, initialVariant, product);
        });
      }
    }
  });
})();
