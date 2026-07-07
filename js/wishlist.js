/* =====================================================
   Sweet Crumbs Bakery — wishlist.js
   localStorage wishlist toggle + render
   ===================================================== */
(function () {
  "use strict";

  const KEY = "sc-wishlist";
  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(w) { localStorage.setItem(KEY, JSON.stringify(w)); updateCount(); }

  function updateCount() {
    const count = read().length;
    document.querySelectorAll("[data-wishlist-count]").forEach(function (el) {
      el.textContent = count;
      el.style.display = count ? "grid" : "none";
    });
  }

  window.SC = window.SC || {};
  window.SC.wishlist = {
    has: function (id) { return read().some(function (i) { return i.id === id; }); },
    toggle: function (item) {
      let w = read();
      if (w.some(function (i) { return i.id === item.id; })) {
        w = w.filter(function (i) { return i.id !== item.id; });
        write(w); return false;
      }
      w.push(item); write(w); return true;
    },
    items: read
  };

  /* Mark active hearts on load */
  function syncHearts() {
    document.querySelectorAll("[data-wishlist]").forEach(function (btn) {
      btn.classList.toggle("active", window.SC.wishlist.has(btn.dataset.id));
    });
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-wishlist]");
    if (!btn) return;
    e.preventDefault();
    const d = btn.dataset;
    const added = window.SC.wishlist.toggle({ id: d.id, name: d.name, price: +d.price, image: d.image, cat: d.cat, rating: d.rating });
    btn.classList.toggle("active", added);
    window.SC.toast(added ? "Saved to wishlist" : "Removed", d.name, added ? "💖" : "🤍");
    if (window.renderWishlistPage) window.renderWishlistPage();
  });

  /* ---------- Wishlist page ---------- */
  const grid = document.getElementById("wishlistGrid");
  if (grid) {
    window.renderWishlistPage = function () {
      const w = read();
      const empty = document.getElementById("wishlistEmpty");
      if (!w.length) { grid.innerHTML = ""; if (empty) empty.style.display = "block"; grid.style.display = "none"; return; }
      if (empty) empty.style.display = "none";
      grid.style.display = "grid";
      grid.innerHTML = w.map(function (p) {
        return (
          '<article class="card product-card">' +
            '<div class="product-card__media">' +
              '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
              '<div class="product-card__actions">' +
                '<button class="mini-btn active" data-wishlist data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.image + '" data-cat="' + (p.cat||"") + '" aria-label="Remove from wishlist">' +
                  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.7-8 11-8 11z"/></svg>' +
                "</button>" +
              "</div>" +
            "</div>" +
            '<div class="product-card__body">' +
              '<span class="product-card__cat">' + (p.cat || "Bakery") + "</span>" +
              '<h3 class="product-card__title">' + p.name + "</h3>" +
              '<div class="product-card__foot">' +
                '<span class="price">₹' + (+p.price).toLocaleString("en-IN") + "</span>" +
                '<button class="btn btn--primary btn--sm" data-add-cart data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.image + '" data-cat="' + (p.cat||"") + '">Add</button>' +
              "</div>" +
            "</div>" +
          "</article>"
        );
      }).join("");
    };
    window.renderWishlistPage();
  }

  syncHearts();
  updateCount();
})();
