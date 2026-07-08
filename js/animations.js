/* =====================================================
   Sweet Crumbs Bakery — animations.js
   Drives scroll animations through AOS (Animate On Scroll),
   mapping the site's existing [data-reveal] markup onto AOS.
   Falls back to a lightweight IntersectionObserver if AOS
   is unavailable.
   ===================================================== */
(function () {
  "use strict";

  // data-reveal value  ->  AOS animation name
  const MAP = { up: "fade-up", down: "fade-down", left: "fade-right", right: "fade-left", zoom: "zoom-in" };

  function toAos(el) {
    const v = el.getAttribute("data-reveal") || "up";
    el.setAttribute("data-aos", MAP[v] || "fade-up");
    const d = el.getAttribute("data-delay");
    if (d) el.setAttribute("data-aos-delay", (parseInt(d, 10) || 0) * 100);
    el.removeAttribute("data-reveal"); // hand control to AOS
  }

  window.SC = window.SC || {};

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.AOS && !reduceMotion) {
    document.querySelectorAll("[data-reveal]").forEach(toAos);
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 90
    });
    // Re-map + refresh when content is injected dynamically (products, wishlist, …)
    window.SC.refreshReveals = function () {
      document.querySelectorAll("[data-reveal]").forEach(toAos);
      AOS.refreshHard();
    };
  } else if (reduceMotion) {
    // Respect reduced-motion: reveal everything instantly, no animation
    const show = function () {
      document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("revealed"); });
    };
    show();
    window.SC.refreshReveals = show;
  } else {
    /* ---------- Fallback: IntersectionObserver reveal ---------- */
    const els = document.querySelectorAll("[data-reveal]");
    if (els.length) {
      if (!("IntersectionObserver" in window)) {
        els.forEach(function (el) { el.classList.add("revealed"); });
      } else {
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { entry.target.classList.add("revealed"); io.unobserve(entry.target); }
          });
        }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
        els.forEach(function (el) { io.observe(el); });
        window.SC.refreshReveals = function () {
          document.querySelectorAll("[data-reveal]:not(.revealed)").forEach(function (el) { io.observe(el); });
        };
      }
    }
  }

  /* ---------- Parallax for floating decor ---------- */
  const floaters = document.querySelectorAll("[data-parallax]");
  if (floaters.length) {
    window.addEventListener("scroll", function () {
      const y = window.scrollY;
      floaters.forEach(function (f) {
        const speed = parseFloat(f.getAttribute("data-parallax")) || 0.2;
        f.style.transform = "translateY(" + (y * speed) + "px)";
      });
    }, { passive: true });
  }
})();
