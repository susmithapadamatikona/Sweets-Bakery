/* =====================================================
   Sweet Crumbs Bakery — slider.js
   Testimonial carousel powered by Swiper.
   Falls back gracefully (static stack) if Swiper is absent.
   ===================================================== */
(function () {
  "use strict";

  const sliders = document.querySelectorAll(".testi-swiper");
  if (!sliders.length) return;

  if (!window.Swiper) {
    // No Swiper on this page → just show the slides, no error.
    sliders.forEach(function (el) { el.classList.add("no-swiper"); });
    return;
  }

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  sliders.forEach(function (el) {
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      speed: reduce ? 0 : 650,
      autoHeight: true,
      effect: "slide",
      autoplay: reduce ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      keyboard: { enabled: true },
      a11y: { enabled: true },
      pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev")
      }
    });
  });
})();
