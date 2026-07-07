/* =====================================================
   Sweet Crumbs Bakery — slider.js
   Testimonial carousel (auto + dots + swipe)
   ===================================================== */
(function () {
  "use strict";

  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    const track = slider.querySelector(".testi-track");
    const slides = slider.querySelectorAll(".testi-slide");
    const dotsWrap = slider.querySelector(".testi-nav");
    if (!track || !slides.length) return;

    let index = 0;
    let timer;

    // build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        const d = document.createElement("button");
        d.className = "testi-dot" + (i === 0 ? " active" : "");
        d.setAttribute("aria-label", "Go to slide " + (i + 1));
        d.addEventListener("click", function () { go(i); reset(); });
        dotsWrap.appendChild(d);
      });
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (index * 100) + "%)";
      if (dotsWrap) dotsWrap.querySelectorAll(".testi-dot").forEach(function (d, di) {
        d.classList.toggle("active", di === index);
      });
    }
    function next() { go(index + 1); }
    function reset() { clearInterval(timer); timer = setInterval(next, 5000); }

    // prev/next buttons if present
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");
    if (prevBtn) prevBtn.addEventListener("click", function () { go(index - 1); reset(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(index + 1); reset(); });

    // touch swipe
    let startX = 0;
    slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) { dx < 0 ? next() : go(index - 1); reset(); }
    });

    // pause on hover
    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", reset);

    reset();
  });
})();
