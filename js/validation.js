/* =====================================================
   Sweet Crumbs Bakery — validation.js
   Client-side form validation + password strength
   ===================================================== */
(function () {
  "use strict";

  const rules = {
    required: function (v) { return v.trim() !== "" || "This field is required"; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address"; },
    phone: function (v) { return /^[+]?[\d\s-]{7,15}$/.test(v) || "Enter a valid phone number"; },
    min6: function (v) { return v.length >= 6 || "Must be at least 6 characters"; },
    name: function (v) { return v.trim().length >= 2 || "Enter your full name"; }
  };

  function validateField(field) {
    const input = field.querySelector("input, textarea, select");
    if (!input) return true;
    const errEl = field.querySelector(".field-error");
    const checks = (input.getAttribute("data-validate") || "").split("|").filter(Boolean);
    let msg = "";
    for (let i = 0; i < checks.length; i++) {
      const res = rules[checks[i]] ? rules[checks[i]](input.value) : true;
      if (res !== true) { msg = res; break; }
    }
    // confirm password
    if (input.hasAttribute("data-match")) {
      const other = document.querySelector(input.getAttribute("data-match"));
      if (other && input.value !== other.value) msg = "Passwords do not match";
    }
    input.classList.toggle("invalid", !!msg);
    input.classList.toggle("valid", !msg && input.value.trim() !== "");
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  document.querySelectorAll("[data-validate-form]").forEach(function (form) {
    const fields = form.querySelectorAll(".field");
    fields.forEach(function (f) {
      const input = f.querySelector("input, textarea, select");
      if (input) input.addEventListener("blur", function () { validateField(f); });
      if (input) input.addEventListener("input", function () { if (input.classList.contains("invalid")) validateField(f); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;
      fields.forEach(function (f) { if (!validateField(f)) ok = false; });
      // required checkbox (e.g. terms)
      const term = form.querySelector('input[data-required-check]');
      if (term && !term.checked) { ok = false; window.SC.toast("Please agree", "Accept the terms to continue", "⚠️"); }
      if (ok) {
        // Persist auth info so the dashboard can greet the user
        try {
          const emailInput = form.querySelector('input[type="email"]');
          const roleSelect = form.querySelector("[data-role]");
          const nameInput = form.querySelector('input[data-validate*="name"]');
          if (emailInput && emailInput.value) localStorage.setItem("sc_user_email", emailInput.value.trim());
          if (roleSelect && roleSelect.value) localStorage.setItem("sc_user_role", roleSelect.value);
          // Store the name on register; clear it on login (no name field) so the
          // dashboard greeting always reflects the email actually used to sign in.
          if (nameInput && nameInput.value) localStorage.setItem("sc_user_name", nameInput.value.trim());
          else if (emailInput) localStorage.removeItem("sc_user_name");
        } catch (err) { /* storage unavailable — non-fatal */ }

        const msg = form.getAttribute("data-success") || "Success!";
        const redirect = form.getAttribute("data-redirect");
        const submitBtn = form.querySelector("button[type='submit'], button:not([type])");
        const animate = submitBtn && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

        if (animate) {
          // Loading spinner → success checkmark before proceeding
          submitBtn.classList.add("is-loading");
          setTimeout(function () {
            submitBtn.classList.remove("is-loading");
            submitBtn.classList.add("is-success");
            window.SC.toast("Done 🎉", msg, "✅");
          }, 600);
        } else {
          window.SC.toast("Done 🎉", msg, "✅");
        }

        if (redirect) {
          setTimeout(function () { location.href = redirect; }, animate ? 1250 : 900);
        } else {
          setTimeout(function () {
            form.reset();
            form.querySelectorAll(".valid").forEach(function (i) { i.classList.remove("valid"); });
            if (submitBtn) submitBtn.classList.remove("is-success");
          }, animate ? 1400 : 200);
        }
      } else {
        const firstErr = form.querySelector(".invalid");
        if (firstErr) firstErr.focus();
      }
    });
  });

  /* ---------- Password toggle ---------- */
  document.querySelectorAll("[data-toggle-pass]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const input = document.querySelector(btn.getAttribute("data-toggle-pass"));
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show
        ? '<svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.9 17.9A10.4 10.4 0 0112 20C5 20 1 12 1 12a18.4 18.4 0 015.1-5.9m3.9-1.8A10.4 10.4 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.2 3.2M1 1l22 22"/></svg>'
        : '<svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  });

  /* ---------- Password strength meter ---------- */
  const passStrength = document.querySelector("[data-strength]");
  if (passStrength) {
    const bar = document.querySelector(".strength__bar");
    const label = document.querySelector(".strength__label");
    passStrength.addEventListener("input", function () {
      const v = passStrength.value;
      let score = 0;
      if (v.length >= 6) score++;
      if (v.length >= 10) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      const pct = [0, 20, 40, 60, 80, 100][score];
      const colors = ["#ddd", "#d64545", "#e0872f", "#e0c02f", "#8bbf4a", "#4b9b6b"];
      const labels = ["", "Very weak", "Weak", "Fair", "Good", "Strong"];
      if (bar) { bar.style.width = pct + "%"; bar.style.background = colors[score]; }
      if (label) label.textContent = v ? "Strength: " + labels[score] : "";
    });
  }

  /* ---------- Checkout payment method selection ---------- */
  document.querySelectorAll(".pay-method").forEach(function (m) {
    m.addEventListener("click", function () {
      document.querySelectorAll(".pay-method").forEach(function (x) { x.classList.remove("selected"); });
      m.classList.add("selected");
      const radio = m.querySelector('input[type="radio"]'); if (radio) radio.checked = true;
    });
  });
})();
