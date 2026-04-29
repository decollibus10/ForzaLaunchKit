(function () {
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  const pct = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1
  });

  const defaults = {
    state: "NJ",
    position: "first",
    monthlyRevenue: 35000,
    monthsInBusiness: 24,
    averageBalance: 4200,
    negativeDays: 2,
    nsfs: 0,
    existingWeekly: 0,
    capitalPool: 75000,
    reservePct: 30,
    activeExposure: 0,
    singleExposurePct: 15,
    advance: 10000,
    factor: 1.5,
    discountFactor: 1.1,
    termDays: 90
  };

  const ids = Object.keys(defaults);

  function el(id) {
    return document.getElementById(id);
  }

  function number(id) {
    return Number(el(id).value || 0);
  }

  function value(id) {
    return el(id).value;
  }

  function setText(id, text) {
    el(id).textContent = text;
  }

  function clamp(num, min, max) {
    return Math.min(max, Math.max(min, num));
  }

  function calculate() {
    const state = value("state");
    const position = value("position");
    const monthlyRevenue = number("monthlyRevenue");
    const monthsInBusiness = number("monthsInBusiness");
    const averageBalance = number("averageBalance");
    const negativeDays = number("negativeDays");
    const nsfs = number("nsfs");
    const existingWeekly = number("existingWeekly");
    const capitalPool = number("capitalPool");
    const reservePct = number("reservePct") / 100;
    const activeExposure = number("activeExposure");
    const singleExposurePct = number("singleExposurePct") / 100;
    const advance = number("advance");
    const factor = number("factor");
    const discountFactor = number("discountFactor");
    const termDays = Math.max(1, number("termDays"));

    const purchased = advance * factor;
    const discountAmount = advance * discountFactor;
    const standardSpread = purchased - advance;
    const discountSpread = discountAmount - advance;

    const deployableCapital = capitalPool * (1 - reservePct);
    const availableCapacity = deployableCapital - activeExposure;
    const merchantLimit = capitalPool * singleExposurePct;
    const estimatedMonthlyRemittance = purchased / (termDays / 30);
    const estimatedWeeklyRemittance = purchased / (termDays / 7);
    const estimatedDailyRemittance = purchased / termDays;
    const holdback = monthlyRevenue > 0 ? estimatedMonthlyRemittance / monthlyRevenue : 1;
    const combinedLoad = monthlyRevenue > 0 ? (estimatedMonthlyRemittance + existingWeekly * 4.33) / monthlyRevenue : 1;

    let score = 100;
    const notes = [];

    function deduct(points, note) {
      score -= points;
      notes.push(note);
    }

    if (state !== "NJ") deduct(45, "Outside the NJ-only pilot box.");
    if (advance < 5000 || advance > 15000) deduct(20, "Advance amount is outside the $5k-$15k first-deal pilot range.");
    if (monthlyRevenue < 15000) deduct(30, "Monthly gross revenue is below the $15k launch minimum.");
    if (monthsInBusiness < 12) deduct(30, "Time in business is below the 12-month launch minimum.");
    if (advance > availableCapacity) deduct(25, "Advance exceeds available deployable capacity after reserve and active exposure.");
    if (advance > merchantLimit) deduct(20, "Advance exceeds the selected single-merchant exposure limit.");
    if (averageBalance < estimatedDailyRemittance * 5) deduct(10, "Average daily balance may be thin compared with estimated daily remittance.");
    if (negativeDays > 5) deduct(12, "Negative days are elevated for the last 90 days.");
    if (nsfs > 2) deduct(12, "NSFs/returns are elevated for the last 90 days.");
    if (position === "second-top") deduct(10, "Second-position file needs senior contract, current balance, and combined-load review.");
    if (position === "stacked") deduct(35, "Multiple active positions are a major pilot risk flag.");
    if (holdback > 0.18) deduct(12, "Estimated holdback is above 18% of monthly revenue.");
    if (combinedLoad > 0.24) deduct(15, "Combined remittance load is above 24% of monthly revenue.");
    if (factor < 1.5) deduct(5, "Factor is below the base launch positioning; confirm margin and risk support it.");
    if (discountFactor < 1.1) deduct(5, "Discount factor is below the planned 1.10 example; confirm approval.");

    score = clamp(Math.round(score), 0, 100);

    let decision = "Pass";
    let decisionText = "Within the launch box based on these inputs. Complete document verification, counsel-approved terms, and final approval memo before any offer.";
    let className = "pass";

    if (score < 70) {
      decision = "Manual Review";
      decisionText = "The deal has meaningful risk or policy exceptions. Tighten structure, reduce advance, request more support, or decline.";
      className = "caution";
    }

    if (score < 50 || state !== "NJ" || monthlyRevenue < 15000 || monthsInBusiness < 12 || position === "stacked") {
      decision = "Do Not Offer Yet";
      decisionText = "This file is outside the current pilot box or carries too much risk based on the entered facts.";
      className = "stop";
    }

    if (notes.length === 0) {
      notes.push("No automatic risk flags based on the current tool inputs.");
    }
    notes.push("Confirm UCC/tax lien search, entity status, owner identity, bank statements, and existing contract review before final approval.");
    notes.push("Eligibility and this score are not an offer, approval, or commitment to fund.");

    setText("purchasedAmount", money.format(purchased));
    setText("standardSpread", money.format(standardSpread));
    setText("discountAmount", money.format(discountAmount));
    setText("discountSpread", money.format(discountSpread));
    setText("deployableCapital", money.format(deployableCapital));
    setText("availableCapacity", money.format(availableCapacity));
    setText("merchantLimit", money.format(merchantLimit));
    setText("capacityStatus", advance <= availableCapacity && advance <= merchantLimit ? "Within selected limits" : "Over selected limit");
    setText("monthlyRemittance", money.format(estimatedMonthlyRemittance));
    setText("weeklyRemittance", money.format(estimatedWeeklyRemittance));
    setText("dailyRemittance", money.format(estimatedDailyRemittance));
    setText("holdbackPct", pct.format(holdback));
    setText("combinedLoad", pct.format(combinedLoad));
    setText("decisionTitle", decision);
    setText("decisionText", decisionText);
    setText("scoreValue", String(score));

    const panel = el("decisionPanel");
    panel.className = `panel decision ${className}`;

    const list = el("riskNotes");
    list.innerHTML = "";
    notes.forEach((note) => {
      const item = document.createElement("li");
      item.textContent = note;
      list.appendChild(item);
    });
  }

  function reset() {
    Object.entries(defaults).forEach(([id, defaultValue]) => {
      el(id).value = defaultValue;
    });
    calculate();
  }

  document.addEventListener("DOMContentLoaded", () => {
    ids.forEach((id) => {
      el(id).addEventListener("input", calculate);
      el(id).addEventListener("change", calculate);
    });

    el("resetBtn").addEventListener("click", reset);
    el("printBtn").addEventListener("click", () => window.print());
    calculate();
  });
})();
