(function () {
  const activeMediaIndexBySection = new Map();

  function filterMediaForVariant(mediaList, variant) {
    const variantId = variant.id;
    const featuredId = variant.featured_media_id;

    return mediaList.filter(function (media) {
      if (media.media_type && media.media_type !== 'image') return false;
      if (!media.attached_to_variant) return true;
      if (media.id === featuredId) return true;
      if (media.variant_ids && media.variant_ids.indexOf(variantId) !== -1) return true;
      return false;
    });
  }

  function assignSlotsFromIndex(filtered, activeIndex, variant, product, preferFeatured) {
    if (!filtered.length) {
      return { hero: null, cell2: null, cell3: null, activeIndex: 0 };
    }

    let index = activeIndex;
    if (index < 0 || index >= filtered.length) index = 0;

    if (preferFeatured) {
      const featuredId = variant.featured_media_id || product.featured_media_id;
      if (featuredId) {
        const featuredIndex = filtered.findIndex(function (m) {
          return m.id === featuredId;
        });
        if (featuredIndex >= 0) index = featuredIndex;
      }
    }

    const hero = filtered[index];
    const rest = filtered.filter(function (m) {
      return m.id !== hero.id;
    });

    return {
      hero: hero,
      cell2: rest[0] || null,
      cell3: rest[1] || null,
      activeIndex: index,
    };
  }

  function renderSlot(slotEl, media, objectFit, allowHide) {
    if (!slotEl) return;

    if (!media) {
      if (allowHide !== false) slotEl.hidden = true;
      return;
    }

    slotEl.hidden = false;
    slotEl.dataset.mediaId = media.id;

    let img = slotEl.querySelector('[data-knr-media-image]');
    if (!img) {
      img = document.createElement('img');
      img.className = 'knr-product-media-grid__img';
      img.setAttribute('data-knr-media-image', '');
      const zoom = slotEl.querySelector('[data-knr-media-zoom]');
      if (zoom) slotEl.insertBefore(img, zoom);
      else slotEl.appendChild(img);
    }

    img.src = media.src;
    if (media.srcset) img.srcset = media.srcset;
    else img.removeAttribute('srcset');
    img.alt = media.alt || '';
    img.style.objectFit = objectFit || 'cover';
  }

  function renderMediaDots(container, filtered, activeIndex) {
    const dotsRoot = container.querySelector('[data-knr-media-dots]');
    if (!dotsRoot) return;

    dotsRoot.innerHTML = '';

    if (filtered.length <= 1) {
      dotsRoot.hidden = true;
      return;
    }

    dotsRoot.hidden = false;

    filtered.forEach(function (media, index) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'knr-product-main__media-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Image ' + (index + 1));
      dot.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false');
      dot.dataset.mediaIndex = String(index);
      if (index === activeIndex) dot.classList.add('knr-product-main__media-dot--active');
      dot.addEventListener('click', function () {
        setActiveMediaIndex(container, index);
      });
      dotsRoot.appendChild(dot);
    });
  }

  function setActiveMediaIndex(container, index) {
    activeMediaIndexBySection.set(container.dataset.sectionId, index);

    const jsonEl = container.querySelector('[data-knr-product-json]');
    if (!jsonEl) return;

    const product = JSON.parse(jsonEl.textContent);
    const selectedOptions = [];
    container.querySelectorAll('[data-knr-option]').forEach(function (input) {
      if (input.type === 'radio' && !input.checked) return;
      selectedOptions.push(input.value);
    });

    let variant = product.variants[0];
    if (selectedOptions.length) {
      variant =
        product.variants.find(function (v) {
          return v.options.every(function (opt, i) {
            return opt === selectedOptions[i];
          });
        }) || variant;
    }

    updateMediaGrid(container, variant, product, index, false);
  }

  function updateMediaGrid(container, variant, product, forcedIndex, preferFeatured) {
    const grid = container.querySelector('[data-knr-media-grid]');
    if (!grid || !product.media) return;

    const sectionId = container.dataset.sectionId;
    const objectFit = grid.dataset.mediaFit || 'cover';
    const filtered = filterMediaForVariant(product.media, variant);

    let activeIndex =
      typeof forcedIndex === 'number'
        ? forcedIndex
        : activeMediaIndexBySection.get(sectionId) || 0;

    const useFeatured =
      typeof preferFeatured === 'boolean'
        ? preferFeatured
        : typeof forcedIndex === 'number' && forcedIndex === 0;

    const slots = assignSlotsFromIndex(filtered, activeIndex, variant, product, useFeatured);
    activeMediaIndexBySection.set(sectionId, slots.activeIndex);

    renderSlot(grid.querySelector('[data-knr-media-slot="hero"]'), slots.hero, objectFit, false);
    renderSlot(grid.querySelector('[data-knr-media-slot="cell2"]'), slots.cell2, objectFit);
    renderSlot(grid.querySelector('[data-knr-media-slot="cell3"]'), slots.cell3, objectFit);

    const secondary = grid.querySelector('[data-knr-media-secondary]');
    if (secondary) {
      const cell2 = grid.querySelector('[data-knr-media-slot="cell2"]');
      const cell3 = grid.querySelector('[data-knr-media-slot="cell3"]');
      secondary.hidden = Boolean(cell2?.hidden && cell3?.hidden);
    }

    renderMediaDots(container, filtered, slots.activeIndex);
    updateHeroNav(container, filtered, slots.activeIndex);
    updateUnitPrice(container, variant);
  }

  function updateHeroNav(container, filtered, activeIndex) {
    const nextBtn = container.querySelector('[data-knr-media-next]');
    if (!nextBtn) return;

    if (filtered.length <= 1) {
      nextBtn.hidden = true;
      return;
    }

    nextBtn.hidden = activeIndex >= filtered.length - 1;
  }

  function initHeroNav(container) {
    const nextBtn = container.querySelector('[data-knr-media-next]');
    if (!nextBtn) return;

    nextBtn.addEventListener('click', function () {
      const sectionId = container.dataset.sectionId;
      const current = activeMediaIndexBySection.get(sectionId) || 0;
      setActiveMediaIndex(container, current + 1);
    });
  }

  function updateUnitPrice(container, variant) {
    const unitEl = container.querySelector('[data-knr-unit-price]');
    if (!unitEl) return;

    if (!variant.unit_price_formatted) {
      unitEl.hidden = true;
      unitEl.textContent = '';
      return;
    }

    unitEl.hidden = false;
    unitEl.textContent = variant.unit_price_formatted;
  }

  function initLightbox(container) {
    const lightbox = container.querySelector('[data-knr-media-lightbox]');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('[data-knr-lightbox-img]');
    const closeBtn = lightbox.querySelector('[data-knr-lightbox-close]');

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove('knr-media-lightbox-open');
    }

    function openLightbox(src, alt) {
      if (!src) return;
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.classList.add('knr-media-lightbox-open');
    }

    container.querySelectorAll('[data-knr-media-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cell = btn.closest('[data-knr-media-slot]');
        const img = cell?.querySelector('[data-knr-media-image]');
        if (img) openLightbox(img.currentSrc || img.src, img.alt);
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  function initAccordions(container) {
    const root = container.querySelector('[data-knr-product-accordions]');
    if (!root) return;

    root.querySelectorAll('[data-knr-accordion-trigger]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        toggleAccordionItem(root, trigger);
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAccordionItem(root, trigger);
        }
      });
    });
  }

  function toggleAccordionItem(root, trigger) {
    const item = trigger.closest('[data-knr-accordion-item]');
    const panel = item?.querySelector('[data-knr-accordion-panel]');
    const isOpen = item?.classList.contains('knr-product-accordions__item--open');

    root.querySelectorAll('[data-knr-accordion-item]').forEach(function (other) {
      other.classList.remove('knr-product-accordions__item--open');
      const otherPanel = other.querySelector('[data-knr-accordion-panel]');
      const otherTrigger = other.querySelector('[data-knr-accordion-trigger]');
      if (otherPanel) otherPanel.hidden = true;
      if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen && item && panel) {
      item.classList.add('knr-product-accordions__item--open');
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }
  }

  function initVariantLinkStyles(container) {
    container.querySelectorAll('[data-knr-option]').forEach(function (input) {
      input.addEventListener('change', function () {
        const group = input.closest('[data-knr-option-group]');
        group?.querySelectorAll('.knr-product-main__option-link').forEach(function (label) {
          label.classList.remove('knr-product-main__option-link--active');
        });
        input.closest('.knr-product-main__option-link')?.classList.add('knr-product-main__option-link--active');
      });
    });
  }

  function initMediaGallery(container) {
    const jsonEl = container.querySelector('[data-knr-product-json]');
    if (!jsonEl) return;

    const product = JSON.parse(jsonEl.textContent);
    const variant = product.variants[0];
    if (variant) {
      activeMediaIndexBySection.set(container.dataset.sectionId, 0);
      updateMediaGrid(container, variant, product, 0, true);
    }
  }

  window.knrProductGallery = {
    updateMediaGrid: function (container, variant, product) {
      updateMediaGrid(container, variant, product, 0, true);
    },
    updateUnitPrice: updateUnitPrice,
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.knr-product-main[data-section-id]').forEach(function (container) {
      initLightbox(container);
      initAccordions(container);
      initVariantLinkStyles(container);
      initHeroNav(container);
      initMediaGallery(container);
    });
  });
})();
