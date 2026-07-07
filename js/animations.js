/* =====================================================
   Sweet Crumbs Bakery — animations.js
   Scroll-reveal via IntersectionObserver
   ===================================================== */
(function () {
  "use strict";

  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("revealed"); });
    return;
  }

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  els.forEach(function (el) { io.observe(el); });

  /* Allow dynamically-injected content to be observed */
  window.SC = window.SC || {};
  window.SC.refreshReveals = function () {
    document.querySelectorAll("[data-reveal]:not(.revealed)").forEach(function (el) { io.observe(el); });
  };

  /* Parallax for floating decor */
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
