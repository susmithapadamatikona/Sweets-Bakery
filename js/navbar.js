/* =====================================================
   Sweet Crumbs Bakery — navbar.js
   Sticky header, mobile drawer, active link
   ===================================================== */
(function () {
  "use strict";

  const header = document.querySelector(".header");
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  const overlay = document.querySelector(".overlay");

  /* Sticky / scrolled state */
  if (header) {
    const onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile drawer */
  function openMenu() {
    if (mobileNav) mobileNav.classList.add("open");
    if (overlay) overlay.classList.add("show");
    if (hamburger) hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (mobileNav) mobileNav.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
    if (hamburger) hamburger.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      mobileNav && mobileNav.classList.contains("open") ? closeMenu() : openMenu();
    });
  }
  if (overlay) overlay.addEventListener("click", closeMenu);
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    const closeBtn = mobileNav.querySelector("[data-close-menu]");
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* Active link based on current page */
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav__link").forEach(function (link) {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
})();
