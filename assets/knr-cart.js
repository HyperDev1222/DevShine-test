(function () {
  function updateCartBadges(itemCount) {
    document.querySelectorAll('[data-knr-cart-count]').forEach((el) => {
      el.textContent = itemCount;
      el.hidden = itemCount < 1;
    });

    document.querySelectorAll('[data-knr-cart-badge]').forEach((el) => {
      el.hidden = itemCount < 1;
      el.classList.toggle('knr-header__cart-badge--empty', itemCount < 1);
    });
  }

  function fetchCartCount() {
    return fetch(`${window.routes?.cart_url || '/cart'}.js`)
      .then((response) => response.json())
      .then((cart) => {
        updateCartBadges(cart.item_count);
        return cart;
      })
      .catch(() => null);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-knr-add-to-cart-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const submitBtn = form.querySelector('[data-knr-add-to-cart]');
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(form);

        fetch(`${window.routes?.cart_add_url || '/cart/add'}.js`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status && data.status !== 200) {
              throw new Error(data.description || data.message);
            }
            return fetchCartCount();
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            if (submitBtn) submitBtn.disabled = false;
          });
      });
    });
  });

  window.knrCart = { fetchCartCount, updateCartBadges };
})();
