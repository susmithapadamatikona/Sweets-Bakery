/* =====================================================
   Sweet Crumbs Bakery — products.js
   Catalog data, grid render, filters, sort, quick view
   ===================================================== */
(function () {
  "use strict";

  function img(id) { return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=700&q=70"; }

  /* ---------- Catalog ---------- */
  const PRODUCTS = [
    { id: "p1",  name: "Belgian Chocolate Cake", cat: "Cake",     price: 899, old: 1099, rating: 4.9, badge: "Bestseller", img: img("1578985545062-69928b1d9587") },
    { id: "p2",  name: "Strawberry Cream Cake",   cat: "Cake",     price: 749, old: 0,    rating: 4.8, badge: "",           img: img("1565958011703-44f9829ba187") },
    { id: "p3",  name: "Red Velvet Cupcakes",     cat: "Cupcake",  price: 349, old: 420,  rating: 4.7, badge: "Sale",       img: img("1486427944299-d1955d23e34d") },
    { id: "p4",  name: "Vanilla Swirl Cupcakes",  cat: "Cupcake",  price: 299, old: 0,    rating: 4.6, badge: "",           img: img("1587668178277-295251f900ce") },
    { id: "p5",  name: "Choco Chip Cookies",      cat: "Cookies",  price: 249, old: 0,    rating: 4.8, badge: "New",        img: img("1499636136210-6f4ee915583e") },
    { id: "p6",  name: "Butter Shortbread",       cat: "Cookies",  price: 219, old: 269,  rating: 4.5, badge: "Sale",       img: img("1558961363-fa8fdf82db35") },
    { id: "p7",  name: "Artisan Sourdough",       cat: "Bread",    price: 189, old: 0,    rating: 4.9, badge: "Fresh",      img: img("1509440159596-0249088772ff") },
    { id: "p8",  name: "Multigrain Loaf",         cat: "Bread",    price: 159, old: 0,    rating: 4.6, badge: "",           img: img("1549931319-a545dcf3bc73") },
    { id: "p9",  name: "Glazed Donuts (6pc)",     cat: "Donuts",   price: 329, old: 399,  rating: 4.7, badge: "Sale",       img: img("1551024601-bec78aea704b") },
    { id: "p10", name: "Rainbow Sprinkle Donuts", cat: "Donuts",   price: 359, old: 0,    rating: 4.8, badge: "Popular",    img: img("1533910534207-90f31029a78e") },
    { id: "p11", name: "Butter Croissant (4pc)",  cat: "Pastries", price: 279, old: 0,    rating: 4.9, badge: "Bestseller", img: img("1555507036-ab1f4038808a") },
    { id: "p12", name: "Almond Danish",           cat: "Pastries", price: 259, old: 0,    rating: 4.6, badge: "",           img: img("1509365465985-25d11c17e812") },
    { id: "p13", name: "French Macarons (9pc)",   cat: "Macarons", price: 549, old: 649,  rating: 4.9, badge: "Premium",    img: img("1569864358642-9d1684040f43") },
    { id: "p14", name: "Pistachio Macarons",      cat: "Macarons", price: 599, old: 0,    rating: 4.8, badge: "",           img: img("1558326567-98ae2405596b") },
    { id: "p15", name: "Fudge Brownies (4pc)",    cat: "Brownies", price: 299, old: 349,  rating: 4.9, badge: "Sale",       img: img("1606313564200-e75d5e30476c") },
    { id: "p16", name: "Walnut Brownie Box",      cat: "Brownies", price: 379, old: 0,    rating: 4.7, badge: "",           img: img("1564355808539-22fda35bed7e") },
    { id: "p17", name: "Classic Gulab Jamun",     cat: "Sweets",   price: 399, old: 0,    rating: 4.8, badge: "Festive",    img: img("1601050690597-df0568f70950") },
    { id: "p18", name: "Kaju Katli Box",          cat: "Sweets",   price: 649, old: 799,  rating: 4.9, badge: "Sale",       img: img("1666181862036-fd12c9a1a2d0") },
    { id: "p19", name: "Black Forest Cake",       cat: "Cake",     price: 849, old: 0,    rating: 4.8, badge: "",           img: img("1464349095431-e9a21285b5f3") },
    { id: "p20", name: "Blueberry Muffins",       cat: "Cupcake",  price: 289, old: 0,    rating: 4.6, badge: "New",        img: img("1607958996333-41aaf7caefaa") },
    { id: "p21", name: "Oatmeal Raisin Cookies",  cat: "Cookies",  price: 229, old: 0,    rating: 4.5, badge: "",           img: img("1490567674331-72de84996c8f") },
    { id: "p22", name: "Baguette Trio",           cat: "Bread",    price: 199, old: 0,    rating: 4.7, badge: "Fresh",      img: img("1585478259715-876acc5be8eb") },
    { id: "p23", name: "Chocolate Eclair (4pc)",  cat: "Pastries", price: 319, old: 369,  rating: 4.8, badge: "Sale",       img: img("1608198093002-ad4e005484ec") },
    { id: "p24", name: "Wedding Tier Cake",       cat: "Cake",     price: 2499, old: 0,   rating: 5.0, badge: "Premium",    img: img("1535254973040-607b474cb50d") }
  ];
  window.PRODUCTS = PRODUCTS;

  const heart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.7-8 11-8 11z"/></svg>';
  const eye = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';

  function stars(r) {
    let full = Math.floor(r), out = "";
    for (let i = 0; i < 5; i++) out += (i < full ? "★" : (i < r ? "⯨" : "☆"));
    return out;
  }

  function cardHTML(p) {
    const badge = p.badge ? '<span class="product-card__badge ' + (p.badge === "Sale" ? "sale" : "") + '">' + p.badge + "</span>" : "";
    const old = p.old ? ' <del>₹' + p.old + "</del>" : "";
    return (
      '<article class="card product-card" data-cat="' + p.cat + '" data-price="' + p.price + '" data-rating="' + p.rating + '" data-name="' + p.name.toLowerCase() + '" data-reveal="up">' +
        '<div class="product-card__media">' +
          badge +
          '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          '<div class="product-card__actions">' +
            '<button class="mini-btn" data-wishlist data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.img + '" data-cat="' + p.cat + '" data-rating="' + p.rating + '" aria-label="Add to wishlist">' + heart + "</button>" +
            '<button class="mini-btn" data-quick-view data-id="' + p.id + '" aria-label="Quick view">' + eye + "</button>" +
          "</div>" +
          '<div class="product-card__quick">' +
            '<button class="btn btn--primary btn--block btn--sm" data-add-cart data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.img + '" data-cat="' + p.cat + '">Add to Cart</button>' +
          "</div>" +
        "</div>" +
        '<div class="product-card__body">' +
          '<span class="product-card__cat">' + p.cat + "</span>" +
          '<a href="product-details.html?id=' + p.id + '"><h3 class="product-card__title">' + p.name + "</h3></a>" +
          '<div class="rating">' + stars(p.rating) + "<span>" + p.rating.toFixed(1) + "</span></div>" +
          '<div class="product-card__foot">' +
            '<span class="price">₹' + p.price + old + "</span>" +
            '<button class="mini-btn" data-add-cart data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.img + '" data-cat="' + p.cat + '" style="background:var(--grad-primary);color:#fff" aria-label="Add to cart">' +
              '<svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }
  window.SC = window.SC || {};
  window.SC.cardHTML = cardHTML;

  /* ---------- Products listing page ---------- */
  const grid = document.getElementById("productGrid");
  if (grid) {
    let state = { cat: "all", search: "", maxPrice: 2600, minStar: 0, sort: "featured", page: 1, perPage: 9 };

    // Read ?cat= from URL
    const params = new URLSearchParams(location.search);
    if (params.get("cat")) state.cat = params.get("cat");

    function apply() {
      let list = PRODUCTS.filter(function (p) {
        return (state.cat === "all" || p.cat.toLowerCase() === state.cat.toLowerCase()) &&
               p.price <= state.maxPrice &&
               p.rating >= state.minStar &&
               (state.search === "" || p.name.toLowerCase().includes(state.search) || p.cat.toLowerCase().includes(state.search));
      });
      if (state.sort === "low") list.sort(function (a, b) { return a.price - b.price; });
      else if (state.sort === "high") list.sort(function (a, b) { return b.price - a.price; });
      else if (state.sort === "rating") list.sort(function (a, b) { return b.rating - a.rating; });
      else if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });

      const rc = document.getElementById("resultCount");
      if (rc) rc.innerHTML = "<b>" + list.length + "</b> delicious item" + (list.length !== 1 ? "s" : "");

      const totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
      if (state.page > totalPages) state.page = 1;
      const paged = list.slice((state.page - 1) * state.perPage, state.page * state.perPage);

      if (!list.length) {
        grid.innerHTML = '<div class="no-results"><div class="emoji">🍩</div><h3>No treats found</h3><p>Try adjusting your filters or search.</p></div>';
      } else {
        grid.innerHTML = paged.map(cardHTML).join("");
      }
      renderPagination(totalPages);
      if (window.SC.refreshReveals) window.SC.refreshReveals();
      // re-sync wishlist hearts
      document.querySelectorAll("[data-wishlist]").forEach(function (b) {
        if (window.SC.wishlist) b.classList.toggle("active", window.SC.wishlist.has(b.dataset.id));
      });
    }

    function renderPagination(total) {
      const pg = document.getElementById("pagination");
      if (!pg) return;
      if (total <= 1) { pg.innerHTML = ""; return; }
      let html = "";
      for (let i = 1; i <= total; i++) html += '<a href="#" data-page="' + i + '" class="' + (i === state.page ? "active" : "") + '">' + i + "</a>";
      pg.innerHTML = html;
    }

    // Category filters
    document.querySelectorAll("[data-filter-cat]").forEach(function (el) {
      el.addEventListener("click", function () {
        document.querySelectorAll("[data-filter-cat]").forEach(function (x) { x.classList.remove("active"); });
        el.classList.add("active");
        state.cat = el.getAttribute("data-filter-cat"); state.page = 1; apply();
      });
      if (el.getAttribute("data-filter-cat") === state.cat) el.classList.add("active");
    });
    // Search
    const search = document.getElementById("searchProducts");
    if (search) search.addEventListener("input", function () { state.search = search.value.trim().toLowerCase(); state.page = 1; apply(); });
    // Sort
    const sort = document.getElementById("sortSelect");
    if (sort) sort.addEventListener("change", function () { state.sort = sort.value; apply(); });
    // Price range
    const range = document.getElementById("priceRange");
    if (range) range.addEventListener("input", function () {
      state.maxPrice = +range.value;
      const pv = document.getElementById("priceVal"); if (pv) pv.textContent = "₹" + range.value;
      state.page = 1; apply();
    });
    // Star filter
    document.querySelectorAll("[data-star]").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll("[data-star]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        state.minStar = +b.getAttribute("data-star"); state.page = 1; apply();
      });
    });
    // Pagination
    const pg = document.getElementById("pagination");
    if (pg) pg.addEventListener("click", function (e) {
      const a = e.target.closest("[data-page]"); if (!a) return;
      e.preventDefault(); state.page = +a.getAttribute("data-page");
      apply(); window.scrollTo({ top: grid.offsetTop - 120, behavior: "smooth" });
    });
    // View toggle
    document.querySelectorAll("[data-view]").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll("[data-view]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        grid.classList.toggle("list-view", b.getAttribute("data-view") === "list");
      });
    });

    apply();
  }

  /* ---------- Related products (on details page) ---------- */
  const related = document.getElementById("relatedGrid");
  if (related) {
    const params = new URLSearchParams(location.search);
    const curId = params.get("id") || "p1";
    const cur = PRODUCTS.find(function (p) { return p.id === curId; }) || PRODUCTS[0];
    const rel = PRODUCTS.filter(function (p) { return p.cat === cur.cat && p.id !== cur.id; }).slice(0, 4);
    const fill = PRODUCTS.filter(function (p) { return p.cat !== cur.cat; }).slice(0, 4 - rel.length);
    related.innerHTML = rel.concat(fill).map(cardHTML).join("");
  }

  /* ---------- Quick View Modal ---------- */
  let modal;
  function buildModal() {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML =
      '<div class="modal__backdrop" data-close-modal></div>' +
      '<div class="modal__card"><button class="modal__close" data-close-modal aria-label="Close">✕</button>' +
      '<div class="details-grid" style="padding:34px;gap:34px" id="modalBody"></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) { if (e.target.closest("[data-close-modal]")) close(); });
  }
  function open(p) {
    if (!modal) buildModal();
    const old = p.old ? ' <del style="font-size:18px">₹' + p.old + "</del>" : "";
    document.getElementById("modalBody").innerHTML =
      '<div><div class="gallery-main" style="cursor:default"><img src="' + p.img + '" alt="' + p.name + '"></div></div>' +
      '<div class="details-info">' +
        '<span class="product-card__cat">' + p.cat + "</span>" +
        "<h1 style='font-size:30px'>" + p.name + "</h1>" +
        '<div class="rating" style="margin:8px 0">' + stars(p.rating) + "<span>" + p.rating.toFixed(1) + " rating</span></div>" +
        '<div class="price" style="font-size:30px">₹' + p.price + old + "</div>" +
        '<p class="details-desc" style="margin:14px 0">Freshly handcrafted ' + p.name.toLowerCase() + ", baked this morning with premium ingredients and lots of love. A perfect treat for any occasion.</p>" +
        '<div class="details-actions">' +
          '<button class="btn btn--primary" data-add-cart data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.img + '" data-cat="' + p.cat + '">Add to Cart</button>' +
          '<a class="btn btn--outline" href="product-details.html?id=' + p.id + '">Full Details</a>' +
        "</div>" +
      "</div>";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() { if (modal) modal.classList.remove("open"); document.body.style.overflow = ""; }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-quick-view]");
    if (!btn) return;
    e.preventDefault();
    const p = PRODUCTS.find(function (x) { return x.id === btn.dataset.id; });
    if (p) open(p);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  /* ---------- Populate product-details from ?id= ---------- */
  const detailRoot = document.getElementById("productDetail");
  if (detailRoot) {
    const params = new URLSearchParams(location.search);
    const p = PRODUCTS.find(function (x) { return x.id === params.get("id"); }) || PRODUCTS[0];
    const set = function (sel, val) { const el = detailRoot.querySelector(sel); if (el) el.textContent = val; };
    set("[data-d-name]", p.name);
    set("[data-d-cat]", p.cat);
    set("[data-d-price]", "₹" + p.price);
    set("[data-d-rating]", p.rating.toFixed(1));
    const rat = detailRoot.querySelector("[data-d-stars]"); if (rat) rat.textContent = stars(p.rating);
    detailRoot.querySelectorAll("[data-d-img]").forEach(function (im) { im.src = p.img; im.alt = p.name; });
    const bc = document.querySelector("[data-breadcrumb-name]"); if (bc) bc.textContent = p.name;
    const addBtn = detailRoot.querySelector("[data-add-cart]");
    if (addBtn) { addBtn.dataset.id = p.id; addBtn.dataset.name = p.name; addBtn.dataset.price = p.price; addBtn.dataset.image = p.img; addBtn.dataset.cat = p.cat; }
    const wl = detailRoot.querySelector("[data-wishlist]");
    if (wl) { wl.dataset.id = p.id; wl.dataset.name = p.name; wl.dataset.price = p.price; wl.dataset.image = p.img; wl.dataset.cat = p.cat; if (window.SC.wishlist) wl.classList.toggle("active", window.SC.wishlist.has(p.id)); }
    document.title = p.name + " — Sweet Crumbs Bakery";
  }
})();
