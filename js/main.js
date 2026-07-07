/* =====================================================
   Sweet Crumbs Bakery — main.js
   Core UI: preloader, theme, cursor, counters, toast,
   scroll-to-top, accordion, tabs, ripple, newsletter
   ===================================================== */
(function () {
  "use strict";

  /* ---------- Global helper: Toast ---------- */
  window.SC = window.SC || {};
  window.SC.toast = function (title, msg, icon) {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.innerHTML =
      '<div class="toast__icon">' + (icon || "🧁") + "</div>" +
      "<div><b>" + title + "</b><small>" + (msg || "") + "</small></div>";
    wrap.appendChild(t);
    setTimeout(function () {
      t.classList.add("out");
      setTimeout(function () { t.remove(); }, 400);
    }, 3200);
  };

  /* ---------- Preloader ---------- */
  (function () {
    var hidden = false;
    function hide() {
      if (hidden) return; hidden = true;
      var pre = document.getElementById("preloader");
      if (pre) pre.classList.add("hidden");
    }
    if (document.readyState === "complete") hide();
    window.addEventListener("load", hide);
    // Fallback: never trap the user if slow external images stall the load event.
    setTimeout(hide, 1200);
  })();

  /* ---------- Dark Mode Toggle (persisted) ---------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("sc-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  function bindTheme() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      updateThemeIcon(btn);
      btn.addEventListener("click", function () {
        const isDark = root.getAttribute("data-theme") === "dark";
        const next = isDark ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("sc-theme", next);
        document.querySelectorAll("[data-theme-toggle]").forEach(updateThemeIcon);
      });
    });
  }
  function updateThemeIcon(btn) {
    const isDark = root.getAttribute("data-theme") === "dark";
    btn.innerHTML = isDark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';
  }

  /* ---------- Counter Animation ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1800;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Scroll To Top ---------- */
  const stBtn = document.querySelector(".scroll-top");
  if (stBtn) {
    window.addEventListener("scroll", function () {
      stBtn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    stBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Custom Cursor ---------- */
  if (window.matchMedia("(pointer:fine)").matches && window.innerWidth > 900) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot"; ring.className = "cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    let rx = 0, ry = 0, dx = 0, dy = 0;
    document.addEventListener("mousemove", function (e) {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = "translate(" + dx + "px," + dy + "px) translate(-50%,-50%)";
    });
    function follow() {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(follow);
    }
    follow();
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a,button,.chip,.mini-btn,.icon-btn,[data-cursor]")) ring.classList.add("grow");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("a,button,.chip,.mini-btn,.icon-btn,[data-cursor]")) ring.classList.remove("grow");
    });
  }

  /* ---------- Button Ripple ---------- */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const r = document.createElement("span");
    r.className = "ripple";
    const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size + "px";
    r.style.left = (e.clientX - rect.left - size / 2) + "px";
    r.style.top = (e.clientY - rect.top - size / 2) + "px";
    btn.appendChild(r);
    setTimeout(function () { r.remove(); }, 600);
  });

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      const item = q.closest(".faq-item");
      const ans = item.querySelector(".faq-a");
      const open = item.classList.contains("open");
      // close siblings for clean accordion
      const group = item.parentElement;
      group.querySelectorAll(".faq-item.open").forEach(function (it) {
        if (it !== item) { it.classList.remove("open"); it.querySelector(".faq-a").style.maxHeight = null; }
      });
      item.classList.toggle("open", !open);
      ans.style.maxHeight = open ? null : ans.scrollHeight + "px";
    });
  });

  /* ---------- Tabs (product details) ---------- */
  document.querySelectorAll(".tab-nav").forEach(function (nav) {
    nav.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-tab]");
      if (!btn) return;
      const target = btn.getAttribute("data-tab");
      const scope = nav.closest(".tabs") || document;
      nav.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      scope.querySelectorAll(".tab-panel").forEach(function (p) {
        p.classList.toggle("active", p.id === target);
      });
    });
  });

  /* ---------- Copy coupon ---------- */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".copy-btn, [data-copy]");
    if (!btn) return;
    const code = btn.getAttribute("data-copy") || (btn.closest(".coupon") && btn.closest(".coupon").querySelector("code").textContent);
    if (!code) return;
    if (navigator.clipboard) navigator.clipboard.writeText(code.trim());
    window.SC.toast("Coupon copied!", code.trim() + " is ready to use 🎉", "🎟️");
  });

  /* ---------- Newsletter forms ---------- */
  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        window.SC.toast("Subscribed!", "Sweet deals are on the way 🍩", "📬");
        form.reset();
      } else {
        window.SC.toast("Oops!", "Please enter a valid email address", "⚠️");
      }
    });
  });

  /* ---------- Auto year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Lazy-load images (native + fallback fade) ---------- */
  document.querySelectorAll("img[loading='lazy']").forEach(function (img) {
    if (img.complete) img.classList.add("loaded");
    else img.addEventListener("load", function () { img.classList.add("loaded"); });
  });

  /* ---------- Graceful image fallback (broken/offline) ---------- */
  const EMOJIS = ["🍰", "🧁", "🍞", "🍩", "🥐", "🍪", "🥧", "🎂"];
  function placeholder(seed) {
    const emoji = EMOJIS[Math.abs(hash(seed)) % EMOJIS.length];
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#F4D4C1"/><stop offset="1" stop-color="#EBCAAE"/></linearGradient></defs>' +
      '<rect width="600" height="450" fill="url(#g)"/>' +
      '<text x="50%" y="52%" font-size="150" text-anchor="middle" dominant-baseline="middle">' + emoji + "</text></svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function hash(s) { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }
  window.SC.placeholder = placeholder;
  document.addEventListener("error", function (e) {
    const img = e.target;
    if (img.tagName === "IMG" && !img.dataset.fallback) {
      img.dataset.fallback = "1";
      img.src = placeholder(img.alt || img.src);
    }
  }, true);

  bindTheme();
})();
