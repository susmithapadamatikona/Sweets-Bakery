/* =====================================================
   Sweet Crumbs Bakery — cart.js
   localStorage cart, add/remove/qty, coupon, totals
   ===================================================== */
(function () {
  "use strict";

  const KEY = "sc-cart";
  const COUPONS = { SWEET10: 0.10, CRUMBS20: 0.20, WELCOME15: 0.15, FESTIVE25: 0.25 };
  const SHIP = 40;

  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(c) { localStorage.setItem(KEY, JSON.stringify(c)); updateCount(); }

  function updateCount() {
    const cart = read();
    const count = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = count;
      el.style.display = count ? "grid" : "none";
    });
  }

  window.SC = window.SC || {};
  window.SC.cart = {
    add: function (item) {
      const cart = read();
      const found = cart.find(function (i) { return i.id === item.id; });
      if (found) found.qty += (item.qty || 1);
      else cart.push({ id: item.id, name: item.name, price: +item.price, image: item.image, qty: item.qty || 1, cat: item.cat || "" });
      write(cart);
    },
    remove: function (id) { write(read().filter(function (i) { return i.id !== id; })); },
    setQty: function (id, qty) {
      const cart = read();
      const it = cart.find(function (i) { return i.id === id; });
      if (it) { it.qty = Math.max(1, qty); write(cart); }
    },
    items: read,
    count: function () { return read().reduce(function (s, i) { return s + i.qty; }, 0); }
  };

  /* Delegate: add-to-cart buttons anywhere */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-add-cart]");
    if (!btn) return;
    e.preventDefault();
    const d = btn.dataset;
    const qtyInput = document.querySelector("#detailQty");
    const qty = btn.hasAttribute("data-use-qty") && qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    window.SC.cart.add({ id: d.id, name: d.name, price: d.price, image: d.image, cat: d.cat, qty: qty });
    window.SC.toast("Added to cart", d.name + " × " + qty, "🛒");
    btn.classList.add("pulse");
    setTimeout(function () { btn.classList.remove("pulse"); }, 600);
  });

  /* ---------- Cart page rendering ---------- */
  const cartWrap = document.getElementById("cartItems");
  if (cartWrap) {
    let discount = 0, appliedCode = "";

    function money(n) { return "₹" + n.toLocaleString("en-IN"); }

    function render() {
      const cart = read();
      const emptyEl = document.getElementById("cartEmpty");
      const contentEl = document.getElementById("cartContent");
      if (!cart.length) {
        if (emptyEl) emptyEl.style.display = "block";
        if (contentEl) contentEl.style.display = "none";
        return;
      }
      if (emptyEl) emptyEl.style.display = "none";
      if (contentEl) contentEl.style.display = "grid";

      cartWrap.innerHTML = cart.map(function (i) {
        return (
          '<div class="cart-row" data-id="' + i.id + '">' +
            '<div class="cart-product">' +
              '<img src="' + i.image + '" alt="' + i.name + '" loading="lazy">' +
              '<div><b>' + i.name + '</b><small>' + (i.cat || "Bakery") + '</small></div>' +
            "</div>" +
            '<div><span class="cart-labels">Price:</span>' + money(i.price) + "</div>" +
            '<div><span class="cart-labels">Qty:</span>' +
              '<div class="cart-qty"><button data-dec>-</button><input value="' + i.qty + '" readonly><button data-inc>+</button></div>' +
            "</div>" +
            '<div><span class="cart-labels">Total:</span><b>' + money(i.price * i.qty) + "</b></div>" +
            '<button class="cart-remove" data-remove aria-label="Remove">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
            "</button>" +
          "</div>"
        );
      }).join("");
      totals();
    }

    function totals() {
      const cart = read();
      const sub = cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
      const disc = Math.round(sub * discount);
      const ship = cart.length ? SHIP : 0;
      const total = sub - disc + ship;
      setText("sumSubtotal", money(sub));
      setText("sumShip", money(ship));
      setText("sumDiscount", "-" + money(disc));
      setText("sumTotal", money(total));
      const discRow = document.getElementById("discountRow");
      if (discRow) discRow.style.display = disc ? "flex" : "none";
    }
    function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

    cartWrap.addEventListener("click", function (e) {
      const row = e.target.closest(".cart-row");
      if (!row) return;
      const id = row.getAttribute("data-id");
      if (e.target.closest("[data-remove]")) { window.SC.cart.remove(id); render(); window.SC.toast("Removed", "Item removed from cart", "🗑️"); }
      else if (e.target.closest("[data-inc]")) { const it = read().find(function (i) { return i.id === id; }); window.SC.cart.setQty(id, it.qty + 1); render(); }
      else if (e.target.closest("[data-dec]")) { const it = read().find(function (i) { return i.id === id; }); window.SC.cart.setQty(id, it.qty - 1); render(); }
    });

    const couponBtn = document.getElementById("applyCoupon");
    if (couponBtn) {
      couponBtn.addEventListener("click", function () {
        const input = document.getElementById("couponInput");
        const code = (input.value || "").trim().toUpperCase();
        if (COUPONS[code]) {
          discount = COUPONS[code]; appliedCode = code;
          window.SC.toast("Coupon applied!", code + " — " + (discount * 100) + "% off 🎉", "🎟️");
          totals();
        } else {
          discount = 0;
          window.SC.toast("Invalid coupon", "Try SWEET10 or CRUMBS20", "⚠️");
          totals();
        }
      });
    }
    render();
  }

  updateCount();
})();
