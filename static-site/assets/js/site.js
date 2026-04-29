(function () {
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-primary-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function fillUtmFields() {
    const params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
      document.querySelectorAll('input[name="' + key + '"]').forEach((input) => {
        input.value = params.get(key) || "";
      });
    });
    document.querySelectorAll('input[name="source_page"]').forEach((input) => {
      input.value = window.location.pathname;
    });
  }

  function evaluatePrequal(form) {
    const value = (name) => {
      const field = form.querySelector('[name="' + name + '"]');
      return field ? field.value : "";
    };

    const state = value("business_state");
    const revenue = value("monthly_revenue");
    const time = value("time_in_business");
    const amount = value("desired_funding");
    const positions = value("existing_positions");

    if (!state || !revenue || !time || !amount || !positions) return null;

    if (state !== "NJ") {
      return {
        tone: "stop",
        title: "Outside the current pilot area",
        body: "FORZA is focused on New Jersey businesses for launch. Your details can still be reviewed for future expansion."
      };
    }

    if (revenue === "under-15" || time === "under-12") {
      return {
        tone: "stop",
        title: "May not fit the first pilot yet",
        body: "The launch criteria start at 12+ months in business and $15k+ monthly gross revenue. A human review can still confirm next steps."
      };
    }

    if (amount !== "5-15" || positions === "stacked" || positions === "unknown") {
      return {
        tone: "warning",
        title: "Manual review likely",
        body: "Your business may need additional review because of funding amount or existing positions. This is not a decline or approval."
      };
    }

    return {
      tone: "fit",
      title: "Strong pilot fit based on the basics",
      body: "A human review comes next, including revenue, balances, existing positions, entity status, and document verification."
    };
  }

  function showResult(form) {
    const result = evaluatePrequal(form);
    const output = form.querySelector("[data-forza-result]");
    if (!output || !result) return;

    output.className = "eligibility-result is-visible";
    if (result.tone === "warning") output.classList.add("is-warning");
    if (result.tone === "stop") output.classList.add("is-stop");
    output.innerHTML = "<strong>" + result.title + "</strong><br>" + result.body;
  }

  function showStaticStatus(form) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.hidden = false;
    status.textContent = "Static preview only: no lead data was sent. Add HubSpot portal and form IDs in config/forza-site.json, then rebuild before launch.";
  }

  function initForms() {
    document.querySelectorAll("[data-forza-prequal]").forEach((form) => {
      form.addEventListener("change", () => showResult(form));
      form.addEventListener("submit", (event) => {
        showResult(form);
        if (form.dataset.static === "true") {
          event.preventDefault();
          showStaticStatus(form);
        }
      });
    });

    document.querySelectorAll("form[data-static='true']:not([data-forza-prequal])").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        showStaticStatus(form);
      });
    });
  }

  function initCalculator() {
    const calc = document.querySelector("[data-forza-calculator]");
    if (!calc) return;

    const advanceRange = calc.querySelector("[data-advance-range]");
    const factorRange = calc.querySelector("[data-factor-range]");
    const advanceOut = document.querySelector("[data-advance-output]");
    const factorOut = document.querySelector("[data-factor-output]");
    const paybackOut = document.querySelector("[data-payback-output]");
    const discountOut = document.querySelector("[data-discount-output]");
    const savingsOut = document.querySelector("[data-savings-output]");

    function render() {
      const advance = Number(advanceRange.value);
      const factor = Number(factorRange.value);
      const purchased = advance * factor;
      const discount = advance * 1.1;
      const savings = Math.max(0, purchased - discount);

      advanceOut.textContent = money.format(advance);
      factorOut.textContent = factor.toFixed(2);
      paybackOut.textContent = money.format(purchased);
      discountOut.textContent = money.format(discount);
      savingsOut.textContent = money.format(savings);
    }

    advanceRange.addEventListener("input", render);
    factorRange.addEventListener("input", render);
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    fillUtmFields();
    initForms();
    initCalculator();
  });
})();
