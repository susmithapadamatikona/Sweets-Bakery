/* =====================================================
   Sweet Crumbs Bakery — search.js
   Header search -> live suggestions + redirect
   ===================================================== */
(function () {
  "use strict";

  document.querySelectorAll("[data-search-form]").forEach(function (form) {
    const input = form.querySelector("input");
    if (!input) return;

    // suggestion dropdown
    let box = document.createElement("div");
    box.className = "search-suggest";
    box.style.cssText = "position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow-md);overflow:hidden;z-index:60;display:none;";
    form.style.position = "relative";
    form.appendChild(box);

    function suggestions(q) {
      const list = (window.PRODUCTS || []).filter(function (p) {
        return p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      }).slice(0, 5);
      if (!q || !list.length) { box.style.display = "none"; return; }
      box.innerHTML = list.map(function (p) {
        return '<a href="product-details.html?id=' + p.id + '" style="display:flex;gap:12px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--border)">' +
          '<img src="' + p.img + '" alt="" style="width:44px;height:44px;border-radius:10px;object-fit:cover">' +
          '<div><b style="display:block;font-size:14px">' + p.name + '</b><small style="color:var(--text-muted)">' + p.cat + " · ₹" + p.price + "</small></div></a>";
      }).join("");
      box.style.display = "block";
    }

    input.addEventListener("input", function () { suggestions(input.value.trim().toLowerCase()); });
    input.addEventListener("focus", function () { if (input.value.trim()) suggestions(input.value.trim().toLowerCase()); });
    document.addEventListener("click", function (e) { if (!form.contains(e.target)) box.style.display = "none"; });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const q = input.value.trim();
      if (q) location.href = "products.html?search=" + encodeURIComponent(q);
    });
  });

  // If products page loaded with ?search=, prime the field
  const params = new URLSearchParams(location.search);
  if (params.get("search")) {
    const sp = document.getElementById("searchProducts");
    if (sp) { sp.value = params.get("search"); sp.dispatchEvent(new Event("input")); }
  }
})();
