/* =====================================================
   Sweet Crumbs Bakery — dashboard.js
   User identity + in-page panel switching (no reloads)
   ===================================================== */
(function () {
  "use strict";

  function get(key, fallback) {
    try { return localStorage.getItem(key) || fallback; }
    catch (e) { return fallback; }
  }

  const email = get("sc_user_email", "guest@sweetcrumbs.com");
  const role = get("sc_user_role", "Customer");
  const name = get("sc_user_name", "");

  // Logged-in email (top-right) + role
  document.querySelectorAll("[data-user-email]").forEach(function (el) { el.textContent = email; });
  document.querySelectorAll("[data-user-role]").forEach(function (el) { el.textContent = role; });

  const displayName = name || email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  document.querySelectorAll("[data-user-name]").forEach(function (el) { el.textContent = displayName; });
  document.querySelectorAll("[data-user-initial]").forEach(function (el) {
    el.textContent = (displayName.trim()[0] || "🧁").toUpperCase();
  });

  // Prefill the settings form
  document.querySelectorAll("[data-fill-email]").forEach(function (i) { i.value = email; });
  document.querySelectorAll("[data-fill-role]").forEach(function (i) { i.value = role; });
  document.querySelectorAll("[data-fill-name]").forEach(function (i) { i.value = displayName; });

  /* ---------- Panel switching (stays inside the dashboard) ---------- */
  const menuLinks = Array.prototype.slice.call(document.querySelectorAll(".dash-menu a[data-panel]"));
  const panels = Array.prototype.slice.call(document.querySelectorAll(".dash-panel"));
  const subEl = document.querySelector("[data-panel-sub]");

  // Mobile off-canvas drawer
  const sidebar = document.querySelector(".dash-sidebar");
  const overlay = document.querySelector("[data-dash-overlay]");
  function openMenu() { if (sidebar) sidebar.classList.add("open"); if (overlay) overlay.classList.add("show"); }
  function closeMenu() { if (sidebar) sidebar.classList.remove("open"); if (overlay) overlay.classList.remove("show"); }
  document.querySelectorAll("[data-dash-menu-toggle]").forEach(function (b) { b.addEventListener("click", openMenu); });
  document.querySelectorAll("[data-dash-menu-close]").forEach(function (b) { b.addEventListener("click", closeMenu); });
  if (overlay) overlay.addEventListener("click", closeMenu);

  const SUBTITLES = {
    dashboard: "Here's what's baking in your account today.",
    orders: "Every treat you've ordered, freshly tracked.",
    favourites: "The treats you keep coming back for.",
    menu: "Browse every freshly baked treat by category.",
    offers: "Sweet savings, handpicked for you.",
    cart: "Ready to check out your goodies?",
    rewards: "Earn and redeem your sweet points.",
    settings: "Keep your account details fresh.",
    help: "We're here to help — sweetly."
  };

  function showPanel(id) {
    if (!document.getElementById("panel-" + id)) id = "dashboard";
    panels.forEach(function (p) { p.classList.toggle("active", p.id === "panel-" + id); });
    menuLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-panel") === id); });
    if (subEl && SUBTITLES[id]) subEl.textContent = SUBTITLES[id];
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* ignore */ }
    closeMenu(); // dismiss the mobile drawer after choosing a section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  menuLinks.forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); showPanel(a.getAttribute("data-panel")); });
  });
  // In-content shortcuts (quick actions, "View all")
  document.querySelectorAll("[data-goto]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); showPanel(b.getAttribute("data-goto")); });
  });

  /* ---------- Render Menu + Favourites from the catalog ---------- */
  const PRODUCTS = window.PRODUCTS || [];

  function treatCard(p) {
    return '<a class="dash-treat" href="product-details.html?id=' + p.id + '">' +
      '<div class="dash-treat__img"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></div>' +
      '<div class="dash-treat__body">' +
        '<span class="dash-treat__cat">' + p.cat + "</span>" +
        "<b>" + p.name + "</b>" +
        '<div class="dash-treat__foot"><span class="price">₹' + p.price + "</span>" +
        '<span class="rating">★ ' + p.rating.toFixed(1) + "</span></div>" +
      "</div></a>";
  }

  const favGrid = document.getElementById("dashFavGrid");
  if (favGrid && PRODUCTS.length) {
    const favIds = ["p1", "p3", "p9", "p13", "p15", "p17"];
    const favs = PRODUCTS.filter(function (p) { return favIds.indexOf(p.id) > -1; });
    favGrid.innerHTML = favs.map(treatCard).join("");
  }

  const menuGrid = document.getElementById("dashMenuGrid");
  const menuChips = document.getElementById("dashMenuChips");
  if (menuGrid && PRODUCTS.length) {
    const cats = ["All"].concat(PRODUCTS.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    function renderMenu(cat) {
      const list = cat === "All" ? PRODUCTS : PRODUCTS.filter(function (p) { return p.cat === cat; });
      menuGrid.innerHTML = list.map(treatCard).join("");
    }
    if (menuChips) {
      menuChips.innerHTML = cats.map(function (c, i) {
        return '<button class="dash-chip' + (i === 0 ? " active" : "") + '" data-cat="' + c + '">' + c + "</button>";
      }).join("");
      menuChips.addEventListener("click", function (e) {
        const chip = e.target.closest(".dash-chip");
        if (!chip) return;
        menuChips.querySelectorAll(".dash-chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        renderMenu(chip.getAttribute("data-cat"));
      });
    }
    renderMenu("All");
  }

  /* ---------- Settings save (demo) ---------- */
  document.querySelectorAll("[data-settings-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const newName = form.querySelector("[data-fill-name]");
      const newEmail = form.querySelector("[data-fill-email]");
      try {
        if (newName && newName.value) localStorage.setItem("sc_user_name", newName.value.trim());
        if (newEmail && newEmail.value) localStorage.setItem("sc_user_email", newEmail.value.trim());
      } catch (err) { /* ignore */ }
      // Reflect changes immediately in the topbar
      if (newEmail) document.querySelectorAll("[data-user-email]").forEach(function (el) { el.textContent = newEmail.value.trim(); });
      if (newName) document.querySelectorAll("[data-user-name]").forEach(function (el) { el.textContent = newName.value.trim(); });
      if (window.SC && window.SC.toast) window.SC.toast("Saved ✨", "Your details are up to date", "✅");
    });
  });

  /* ---------- Logout ---------- */
  document.querySelectorAll("[data-logout]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      try {
        localStorage.removeItem("sc_user_email");
        localStorage.removeItem("sc_user_role");
        localStorage.removeItem("sc_user_name");
      } catch (err) { /* ignore */ }
      if (window.SC && window.SC.toast) window.SC.toast("Logged out", "See you soon! 🍪", "👋");
      setTimeout(function () { location.href = "login.html"; }, 700);
    });
  });

  /* ---------- Open the panel named in the URL hash ---------- */
  showPanel((location.hash || "").replace("#", "") || "dashboard");
})();
