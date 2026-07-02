(function () {
  function formatMoney(cents, format) {
    if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(cents, format);
    }
    return (cents / 100).toFixed(2);
  }

  function getSelectedOptions(container) {
    const options = [];
    container.querySelectorAll('[data-knr-option]').forEach((input) => {
      if (input.type === 'radio' && !input.checked) return;
      options.push(input.value);
    });
    return options;
  }

  function findVariant(product, selectedOptions) {
    return product.variants.find((variant) => {
      return variant.options.every((option, index) => option === selectedOptions[index]);
    });
  }

  function updatePrice(container, variant, moneyFormat) {
    const priceEl = container.querySelector('[data-knr-current-price]');
    const compareWrap = container.querySelector('[data-knr-compare-wrap]');
    const compareEl = container.querySelector('[data-knr-compare-at]');
    const priceRoot = container.querySelector('[data-knr-price]');

    if (priceEl) {
      priceEl.textContent = formatMoney(variant.price, moneyFormat);
    }

    const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;

    if (compareEl && compareWrap) {
      if (onSale) {
        compareEl.textContent = formatMoney(variant.compare_at_price, moneyFormat);
        compareWrap.hidden = false;
        compareWrap.classList.remove('knr-price__compare--hidden');
      } else {
        compareWrap.hidden = true;
        compareWrap.classList.add('knr-price__compare--hidden');
      }
    }

    if (priceRoot) {
      priceRoot.classList.toggle('knr-price--on-sale', onSale);
      priceRoot.classList.toggle('knr-price--sold-out', !variant.available);
    }
  }

  function updateGallery(container, variant) {
    if (!variant.featured_media) return;

    const mainImage = container.querySelector('[data-knr-main-image]');
    if (!mainImage) return;

    const media = variant.featured_media;
    if (media.preview_image && media.preview_image.src) {
      mainImage.src = media.preview_image.src;
      mainImage.srcset = '';
      if (media.preview_image.alt) {
        mainImage.alt = media.preview_image.alt;
      }
    }
  }

  function updateForm(container, variant) {
    const idInput = container.querySelector('[data-knr-variant-id]');
    if (idInput) {
      idInput.value = variant.id;
      idInput.disabled = !variant.available;
    }

    const submitBtn = container.querySelector('[data-knr-add-to-cart]');
    if (submitBtn) {
      submitBtn.disabled = !variant.available;
      submitBtn.textContent = variant.available
        ? submitBtn.dataset.labelAvailable || 'Add to cart'
        : submitBtn.dataset.labelSoldOut || 'Sold out';
    }
  }

  function updateUrl(variantId) {
    if (!window.history.replaceState) return;
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variantId);
    window.history.replaceState({}, '', url.toString());
  }

  function initContainer(container) {
    const jsonEl = container.querySelector('[data-knr-product-json]');
    if (!jsonEl) return;

    const product = JSON.parse(jsonEl.textContent);
    const moneyFormat = container.dataset.moneyFormat || '${{amount}}';

    function handleChange() {
      const selectedOptions = getSelectedOptions(container);
      const variant = findVariant(product, selectedOptions);
      if (!variant) return;

      updatePrice(container, variant, moneyFormat);
      updateGallery(container, variant);
      updateForm(container, variant);
      updateUrl(variant.id);

      container.dispatchEvent(
        new CustomEvent('knr:variant-change', {
          bubbles: true,
          detail: { variant, product },
        })
      );
    }

    container.querySelectorAll('[data-knr-option]').forEach((input) => {
      input.addEventListener('change', handleChange);
    });

    const urlVariantId = new URLSearchParams(window.location.search).get('variant');
    if (urlVariantId) {
      const urlVariant = product.variants.find((v) => String(v.id) === urlVariantId);
      if (urlVariant) {
        urlVariant.options.forEach((value, index) => {
          const group = container.querySelectorAll('[data-knr-option-group]')[index];
          if (!group) return;
          group.querySelectorAll('[data-knr-option]').forEach((input) => {
            if (input.value === value) {
              input.checked = true;
              input.closest('.knr-product-main__option-value')?.classList.add('knr-product-main__option-value--selected');
            } else {
              input.closest('.knr-product-main__option-value')?.classList.remove('knr-product-main__option-value--selected');
            }
          });
        });
        updatePrice(container, urlVariant, moneyFormat);
        updateGallery(container, urlVariant);
        updateForm(container, urlVariant);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-knr-variant-picker]').forEach(initContainer);
  });
})();
