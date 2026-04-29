(function () {
  function configured(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function scriptHost(region) {
    if (region && region !== "na1") return "https://js-" + region + ".hsforms.net/forms/embed/v2.js";
    return "https://js.hsforms.net/forms/embed/v2.js";
  }

  function loadScript(region, callback) {
    if (window.hbspt && window.hbspt.forms) {
      callback();
      return;
    }

    const existing = document.querySelector("script[data-hubspot-embed]");
    if (existing) {
      existing.addEventListener("load", callback, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = scriptHost(region);
    script.async = true;
    script.defer = true;
    script.dataset.hubspotEmbed = "true";
    script.addEventListener("load", callback, { once: true });
    document.head.appendChild(script);
  }

  function createForm(kind, shell, config) {
    const formIds = {
      funding: config.fundingFormId,
      audit: config.auditFormId,
      resource: config.resourceFormId,
      investor: config.investorFormId
    };
    const formId = formIds[kind];
    const target = shell.querySelector("[data-hubspot-target]");
    if (!target || !configured(config.portalId) || !configured(formId)) return;

    loadScript(config.region || "na1", () => {
      if (!window.hbspt || !window.hbspt.forms) return;
      shell.classList.add("is-live");
      window.hbspt.forms.create({
        portalId: config.portalId,
        formId,
        region: config.region || "na1",
        target: "#" + target.id
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const config = window.FORZA_HUBSPOT || {};
    document.querySelectorAll("[data-hubspot-form-shell]").forEach((shell) => {
      createForm(shell.dataset.hubspotFormShell, shell, config);
    });
  });
})();
