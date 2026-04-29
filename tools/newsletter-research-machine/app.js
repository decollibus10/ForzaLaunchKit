(function () {
  const storageKey = "newsletter-research-machine-v1";

  const categories = [
    { id: "Underwriting Intelligence", target: 40 },
    { id: "Niche Wealth / Assets", target: 20 },
    { id: "Operator Memos", target: 15 },
    { id: "Contrarian Market Observations", target: 10 },
    { id: "Deal Teardowns", target: 10 },
    { id: "Reader Mail / Conversion Learnings", target: 5 }
  ];

  const options = {
    status: ["captured", "scored", "evidence", "review", "drafting", "editing", "approved", "published", "blocked", "archived"],
    assetClass: ["MCA / private credit", "Receivables", "Local services", "Niche real assets", "Online business", "Collectibles", "Special situations", "Other"],
    signalType: ["live deal observation", "underwriting edge case", "contrarian market observation", "book note", "filing note", "podcast note", "investor letter", "social signal", "reader reply", "conversion signal"],
    underwritingTheme: ["cash-flow quality", "remittance pressure", "stacking", "fraud / verification", "concentration", "pricing", "legal / process", "servicing / reconciliation", "borrower psychology"],
    marketRegime: ["tight credit", "loose credit", "rising defaults", "liquidity stress", "asset inflation", "regulatory pressure", "operator reset"],
    audienceIntent: ["learn", "decide", "avoid mistake", "compare options", "find opportunity", "improve underwriting", "understand risk"],
    evidenceStrength: ["anecdote", "pattern", "dataset / export", "document-backed", "primary source", "repeatable operator rule"],
    confidence: ["low", "medium", "high"],
    monetizationRole: ["free trust builder", "paid conversion", "paid retention", "lead magnet", "referral bait", "product insight"],
    repurposePotential: ["low", "medium", "high"],
    confidentiality: ["public", "sanitized private", "private not approved", "sensitive do not use"]
  };

  const scoreFields = [
    { id: "proprietaryEdge", label: "Proprietary edge", max: 20 },
    { id: "economicStakes", label: "Economic stakes", max: 15 },
    { id: "timeliness", label: "Timeliness", max: 10 },
    { id: "contrarianity", label: "Contrarianity", max: 10 },
    { id: "evidenceDepth", label: "Evidence depth", max: 15 },
    { id: "audiencePull", label: "Audience pull", max: 10 },
    { id: "subscriberFit", label: "Subscriber conversion fit", max: 10 },
    { id: "repurposeLeverage", label: "Repurpose leverage", max: 5 },
    { id: "operatorCredibility", label: "Operator credibility", max: 5 },
    { id: "riskPenalty", label: "Risk penalty", max: 30, penalty: true }
  ];

  const viewFilters = [
    "What To Write Next",
    "Allocation Drift",
    "Proprietary Edge Queue",
    "Paid Conversion Candidates",
    "Stale But Valuable",
    "Needs Evidence",
    "Do Not Publish Yet",
    "All Ideas"
  ];

  const gates = [
    ["Private observation approval", "Required before evidence pack or draft use."],
    ["Thesis approval", "Required before ghostwriting."],
    ["Claim and compliance review", "Required before publication."],
    ["Distribution approval", "Required before posting or scheduling."],
    ["Analytics interpretation approval", "Required before major allocation changes."],
    ["Dead-angle review", "Required before any strong claim ships."]
  ];

  const prompts = {
    "Capture Agent": [
      "You are the Capture Agent for an operator-led research newsletter.",
      "Convert raw observations into structured idea records.",
      "Preserve the original signal, identify source type, assign taxonomy tags, estimate confidentiality risk, and recommend the next action.",
      "Do not write article prose. Do not use private details publicly unless the record is approved for public use.",
      "",
      "Return JSON with: title, normalized_observation, source_type, asset_class, signal_type, underwriting_theme, market_regime, audience_intent, evidence_strength, confidentiality, private_flag, approved_for_public_use, possible_thesis, counterargument_needed, next_action."
    ].join("\n"),
    "Deal Scout": [
      "You are Deal Scout.",
      "Extract the investable/operator signal from deal notes, filings, books, calls, podcasts, investor letters, reader replies, and market chatter.",
      "Do not write prose.",
      "Return facts, anomaly, underwriting implication, comparable pattern, and evidence gaps.",
      "Highlight what is proprietary, what is commodity, and what cannot be published yet.",
      "",
      "Return JSON with: facts, anomaly, operator_signal, underwriting_implication, comparable_pattern, edge_ledger_entry, evidence_gaps, publishability."
    ].join("\n"),
    "Skeptic / Short Seller": [
      "You are the Skeptic / Short Seller.",
      "Assume the thesis is wrong.",
      "Identify base-rate errors, selection bias, hidden incentives, weak evidence, legal/compliance risk, missing data, and where the operator may be talking their book.",
      "Your job is not to be cynical; your job is to prevent sloppy conviction.",
      "",
      "Return JSON with: bear_case, base_rate_risks, selection_bias_risks, legal_or_claim_risks, missing_evidence, questions_for_operator, thesis_survives, revision_required."
    ].join("\n"),
    Ghostwriter: [
      "You are the Ghostwriter for a high-trust operator newsletter.",
      "Write like an institutional operator explaining a money pattern to smart builders.",
      "Use only approved evidence. Preserve uncertainty.",
      "Avoid generic finance filler, hype, and unsupported claims.",
      "The piece should teach judgment, not merely summarize information.",
      "",
      "Return JSON with: titles, dek, outline, free_section, paid_section, claim_register, reader_action, next_seed_questions."
    ].join("\n"),
    Editor: [
      "You are the Editor.",
      "Cut unsupported claims, sharpen the thesis, improve sequence, flag compliance issues, remove filler, and ensure the memo earns reader trust.",
      "Preserve the operator's point of view.",
      "Do not sand down useful contrarian judgment, but force every strong claim to carry evidence or caveat.",
      "",
      "Return JSON with: edited_draft, claim_checklist, dead_angle_review, publication_recommendation, required_changes."
    ].join("\n"),
    "Distribution Repurposer": [
      "You are the Distribution Repurposer.",
      "Turn the approved memo into native assets for Substack, LinkedIn, X, paid teasers, and lead magnets without flattening the insight.",
      "Preserve nuance. Do not overpromise. Make each asset work in its native channel.",
      "",
      "Return JSON with: substack_title, substack_preview, linkedin_post, x_thread, paid_subscriber_teaser, lead_magnet_excerpt, next_article_seed, utm_notes."
    ].join("\n"),
    "Analytics Feedback Agent": [
      "You are the Analytics Feedback Agent.",
      "Translate subscriber and channel behavior into editorial decisions, not vanity metrics.",
      "Focus on retention, paid conversion, reply quality, saves, qualified inbound, and evidence of trust.",
      "Recommend what to write more of, less of, or differently.",
      "",
      "Return JSON with: retention_signals, conversion_signals, trust_signals, topic_allocation_adjustments, ideas_to_promote, ideas_to_pause, next_seeds."
    ].join("\n")
  };

  const sampleIdeas = [
    {
      id: "idea_2026_0001",
      title: "Second-position files can hide senior-remittance pressure",
      status: "captured",
      category: "Underwriting Intelligence",
      assetClass: "MCA / private credit",
      signalType: "underwriting edge case",
      underwritingTheme: "remittance pressure",
      marketRegime: "tight credit",
      audienceIntent: "avoid mistake",
      evidenceStrength: "pattern",
      confidence: "medium",
      monetizationRole: "paid conversion",
      repurposePotential: "high",
      confidentiality: "private not approved",
      privateFlag: true,
      approvedForPublicUse: false,
      source: "internal deal note",
      observation: "A deal can look fundable until senior balance, ACH cadence, and true daily cash buffer are reconciled.",
      thesis: "Second-position risk is often an information-quality problem before it is a pricing problem.",
      counterargument: "Some second-position files are rational if senior balance is verified and revenue is stable.",
      readerAction: "Ask which obligation consumes cash before asking what factor rate is acceptable.",
      nextAction: "Sanitize examples and collect two more cases.",
      publishWindow: "2026-W18",
      createdAt: "2026-04-29",
      publishedAt: "",
      scoreInputs: {
        proprietaryEdge: 18,
        economicStakes: 13,
        timeliness: 8,
        contrarianity: 7,
        evidenceDepth: 9,
        audiencePull: 8,
        subscriberFit: 9,
        repurposeLeverage: 4,
        operatorCredibility: 5,
        riskPenalty: 9
      }
    },
    {
      id: "idea_2026_0002",
      title: "When not to use an MCA is better trust-building than another pricing explainer",
      status: "scored",
      category: "Operator Memos",
      assetClass: "MCA / private credit",
      signalType: "conversion signal",
      underwritingTheme: "borrower psychology",
      marketRegime: "regulatory pressure",
      audienceIntent: "decide",
      evidenceStrength: "document-backed",
      confidence: "high",
      monetizationRole: "free trust builder",
      repurposePotential: "medium",
      confidentiality: "public",
      privateFlag: false,
      approvedForPublicUse: true,
      source: "docs/content-calendar.md",
      observation: "Risk-aware education creates more trust than generic growth copy.",
      thesis: "The anti-fit memo may convert better long term than the funding pitch.",
      counterargument: "A negative-fit article can suppress low-quality leads but may reduce short-term volume.",
      readerAction: "Disqualify yourself before the market does it for you.",
      nextAction: "Draft outline.",
      publishWindow: "2026-W19",
      createdAt: "2026-04-29",
      publishedAt: "2026-04-12",
      scoreInputs: {
        proprietaryEdge: 12,
        economicStakes: 10,
        timeliness: 7,
        contrarianity: 8,
        evidenceDepth: 11,
        audiencePull: 9,
        subscriberFit: 7,
        repurposeLeverage: 4,
        operatorCredibility: 5,
        riskPenalty: 2
      }
    },
    {
      id: "idea_2026_0003",
      title: "Average daily balance is a better story than monthly revenue",
      status: "evidence",
      category: "Underwriting Intelligence",
      assetClass: "MCA / private credit",
      signalType: "live deal observation",
      underwritingTheme: "cash-flow quality",
      marketRegime: "liquidity stress",
      audienceIntent: "improve underwriting",
      evidenceStrength: "pattern",
      confidence: "medium",
      monetizationRole: "paid retention",
      repurposePotential: "high",
      confidentiality: "sanitized private",
      privateFlag: true,
      approvedForPublicUse: true,
      source: "docs/risk-scorecard.csv",
      observation: "Monthly deposits can flatter a business that runs too close to zero between inflows.",
      thesis: "The cash buffer is the underwriting story most operators skip.",
      counterargument: "Some seasonal operators intentionally run lean and should not be penalized mechanically.",
      readerAction: "Look at the valleys, not just the gross deposit number.",
      nextAction: "Build evidence pack from risk scorecard and sanitized examples.",
      publishWindow: "2026-W20",
      createdAt: "2026-04-29",
      publishedAt: "",
      scoreInputs: {
        proprietaryEdge: 17,
        economicStakes: 14,
        timeliness: 8,
        contrarianity: 6,
        evidenceDepth: 12,
        audiencePull: 8,
        subscriberFit: 8,
        repurposeLeverage: 4,
        operatorCredibility: 5,
        riskPenalty: 6
      }
    },
    {
      id: "idea_2026_0004",
      title: "The operator memo as an underwriting asset",
      status: "captured",
      category: "Operator Memos",
      assetClass: "Other",
      signalType: "book note",
      underwritingTheme: "legal / process",
      marketRegime: "operator reset",
      audienceIntent: "learn",
      evidenceStrength: "anecdote",
      confidence: "medium",
      monetizationRole: "product insight",
      repurposePotential: "medium",
      confidentiality: "public",
      privateFlag: false,
      approvedForPublicUse: true,
      source: "reading notes",
      observation: "The memo format forces claims, caveats, and next actions into one artifact.",
      thesis: "Writing is not marketing residue; it is a way to improve the decision system.",
      counterargument: "More process can become a substitute for talking to customers and borrowers.",
      readerAction: "Attach the memo to the decision, not the publishing calendar.",
      nextAction: "Run Skeptic review.",
      publishWindow: "2026-W21",
      createdAt: "2026-04-18",
      publishedAt: "",
      scoreInputs: {
        proprietaryEdge: 10,
        economicStakes: 8,
        timeliness: 6,
        contrarianity: 7,
        evidenceDepth: 7,
        audiencePull: 7,
        subscriberFit: 6,
        repurposeLeverage: 4,
        operatorCredibility: 4,
        riskPenalty: 1
      }
    },
    {
      id: "idea_2026_0005",
      title: "The checklist that should exist before funding-day urgency takes over",
      status: "published",
      category: "Deal Teardowns",
      assetClass: "MCA / private credit",
      signalType: "underwriting edge case",
      underwritingTheme: "legal / process",
      marketRegime: "operator reset",
      audienceIntent: "avoid mistake",
      evidenceStrength: "document-backed",
      confidence: "high",
      monetizationRole: "lead magnet",
      repurposePotential: "high",
      confidentiality: "public",
      privateFlag: false,
      approvedForPublicUse: true,
      source: "docs/funding-day-checklist.md",
      observation: "Funding-day controls protect against process shortcuts when urgency rises.",
      thesis: "The most dangerous underwriting error may happen after the file already looks approved.",
      counterargument: "Too many gates can slow legitimate deals and frustrate merchants.",
      readerAction: "Separate final verification from sales momentum.",
      nextAction: "Capture follow-up replies.",
      publishWindow: "2026-W16",
      createdAt: "2026-04-01",
      publishedAt: "2026-04-20",
      scoreInputs: {
        proprietaryEdge: 13,
        economicStakes: 12,
        timeliness: 7,
        contrarianity: 6,
        evidenceDepth: 13,
        audiencePull: 8,
        subscriberFit: 7,
        repurposeLeverage: 5,
        operatorCredibility: 5,
        riskPenalty: 3
      }
    }
  ];

  let ideas = loadIdeas();
  let selectedId = ideas[0] ? ideas[0].id : "";

  function el(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function clamp(num, min, max) {
    return Math.min(max, Math.max(min, num));
  }

  function daysSince(dateString) {
    if (!dateString) return 0;
    const then = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(then.getTime())) return 0;
    return Math.max(0, Math.round((Date.now() - then.getTime()) / 86400000));
  }

  function makeId() {
    const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    return `idea_${stamp}`;
  }

  function loadIdeas() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return sampleIdeas;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.ideas) && parsed.ideas.length ? parsed.ideas : sampleIdeas;
    } catch (error) {
      return sampleIdeas;
    }
  }

  function saveIdeas() {
    window.localStorage.setItem(storageKey, JSON.stringify({ ideas }, null, 2));
  }

  function setOptions(selectId, values) {
    const node = el(selectId);
    node.innerHTML = values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  }

  function baseScore(idea) {
    const input = idea.scoreInputs || {};
    const total = scoreFields.reduce((sum, field) => {
      const value = Number(input[field.id] || 0);
      return field.penalty ? sum - value : sum + value;
    }, 0);
    return clamp(Math.round(total), 0, 100);
  }

  function publishedIdeas() {
    return ideas
      .filter((idea) => idea.publishedAt || idea.status === "published")
      .slice()
      .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")));
  }

  function categoryShare(category, count) {
    const recent = publishedIdeas().slice(0, count);
    if (!recent.length) return 0;
    const matching = recent.filter((idea) => idea.category === category).length;
    return Math.round((matching / recent.length) * 100);
  }

  function allocationBoost(idea) {
    const category = categories.find((item) => item.id === idea.category);
    if (!category) return 0;
    const share4 = categoryShare(idea.category, 4);
    const gap = category.target - share4;
    return clamp(Math.round(gap / 4), -8, 10);
  }

  function isBlocked(idea) {
    return idea.status === "blocked" ||
      idea.confidentiality === "sensitive do not use" ||
      (idea.privateFlag && !idea.approvedForPublicUse);
  }

  function blockersFor(idea) {
    const blockers = [];
    if (idea.status === "blocked") blockers.push("Status is blocked.");
    if (idea.confidentiality === "sensitive do not use") blockers.push("Confidentiality is sensitive do not use.");
    if (idea.privateFlag && !idea.approvedForPublicUse) blockers.push("Private signal needs approval.");
    if (Number((idea.scoreInputs || {}).riskPenalty || 0) >= 20) blockers.push("Risk penalty is high.");
    if (!idea.thesis) blockers.push("Missing thesis.");
    if (!idea.counterargument) blockers.push("Missing counterargument.");
    if (!idea.readerAction) blockers.push("Missing reader action.");
    if (Number((idea.scoreInputs || {}).evidenceDepth || 0) < 8) blockers.push("Evidence depth is weak.");
    return blockers;
  }

  function isReady(idea) {
    const input = idea.scoreInputs || {};
    return !isBlocked(idea) &&
      baseScore(idea) >= 65 &&
      Number(input.evidenceDepth || 0) >= 8 &&
      Boolean(idea.thesis && idea.counterargument && idea.readerAction);
  }

  function priorityScore(idea) {
    const input = idea.scoreInputs || {};
    const recent = publishedIdeas()[0];
    const freshness = daysSince(idea.createdAt) <= 14 ? 4 : daysSince(idea.createdAt) <= 45 ? 2 : 0;
    const paidFit = String(idea.monetizationRole || "").includes("paid") ? 4 : 0;
    const evidenceReady = Number(input.evidenceDepth || 0) >= 10 && !isBlocked(idea) ? 5 : -4;
    const repetition = recent && recent.category === idea.category ? 6 : 0;
    const gatePenalty = isBlocked(idea) ? 40 : 0;
    return clamp(Math.round(baseScore(idea) + allocationBoost(idea) + freshness + paidFit + evidenceReady - repetition - gatePenalty), 0, 125);
  }

  function rankedIdeas() {
    return ideas
      .filter((idea) => idea.status !== "published" && idea.status !== "archived")
      .slice()
      .sort((a, b) => priorityScore(b) - priorityScore(a));
  }

  function topPick() {
    return rankedIdeas().find(isReady) || rankedIdeas()[0] || null;
  }

  function renderScoreSliders() {
    el("scoreSliders").innerHTML = scoreFields.map((field) => `
      <div class="score-control">
        <div class="score-label">
          <span>${escapeHtml(field.label)}</span>
          <strong><span id="${field.id}Value">0</span> / ${field.max}</strong>
        </div>
        <input id="${field.id}" type="range" min="0" max="${field.max}" step="1">
      </div>
    `).join("");

    scoreFields.forEach((field) => {
      const node = el(field.id);
      node.addEventListener("input", () => {
        el(`${field.id}Value`).textContent = node.value;
        previewCurrentScore();
      });
    });
  }

  function previewCurrentScore() {
    scoreFields.forEach((field) => {
      const valueNode = el(`${field.id}Value`);
      if (valueNode) valueNode.textContent = el(field.id).value;
    });
  }

  function populateForm(idea) {
    if (!idea) return;
    el("ideaId").value = idea.id;
    el("title").value = idea.title || "";
    el("status").value = idea.status || "captured";
    el("category").value = idea.category || categories[0].id;
    el("assetClass").value = idea.assetClass || options.assetClass[0];
    el("signalType").value = idea.signalType || options.signalType[0];
    el("underwritingTheme").value = idea.underwritingTheme || options.underwritingTheme[0];
    el("marketRegime").value = idea.marketRegime || options.marketRegime[0];
    el("audienceIntent").value = idea.audienceIntent || options.audienceIntent[0];
    el("evidenceStrength").value = idea.evidenceStrength || options.evidenceStrength[0];
    el("confidence").value = idea.confidence || "medium";
    el("monetizationRole").value = idea.monetizationRole || options.monetizationRole[0];
    el("repurposePotential").value = idea.repurposePotential || "medium";
    el("confidentiality").value = idea.confidentiality || "public";
    el("source").value = idea.source || "";
    el("observation").value = idea.observation || "";
    el("thesis").value = idea.thesis || "";
    el("counterargument").value = idea.counterargument || "";
    el("readerAction").value = idea.readerAction || "";
    el("nextAction").value = idea.nextAction || "";
    el("publishWindow").value = idea.publishWindow || "";
    el("publishedAt").value = idea.publishedAt || "";
    el("privateFlag").checked = Boolean(idea.privateFlag);
    el("approvedForPublicUse").checked = Boolean(idea.approvedForPublicUse);

    const input = idea.scoreInputs || {};
    scoreFields.forEach((field) => {
      el(field.id).value = Number(input[field.id] || 0);
    });
    previewCurrentScore();
  }

  function formIdea() {
    const existing = ideas.find((idea) => idea.id === el("ideaId").value);
    const scoreInputs = {};
    scoreFields.forEach((field) => {
      scoreInputs[field.id] = Number(el(field.id).value || 0);
    });
    const explicitPublishedAt = el("publishedAt").value;
    const publishedAt = explicitPublishedAt || (el("status").value === "published" ? existing && existing.publishedAt || today() : "");

    return {
      id: el("ideaId").value || makeId(),
      title: el("title").value.trim() || "Untitled idea",
      status: el("status").value,
      category: el("category").value,
      assetClass: el("assetClass").value,
      signalType: el("signalType").value,
      underwritingTheme: el("underwritingTheme").value,
      marketRegime: el("marketRegime").value,
      audienceIntent: el("audienceIntent").value,
      evidenceStrength: el("evidenceStrength").value,
      confidence: el("confidence").value,
      monetizationRole: el("monetizationRole").value,
      repurposePotential: el("repurposePotential").value,
      confidentiality: el("confidentiality").value,
      privateFlag: el("privateFlag").checked,
      approvedForPublicUse: el("approvedForPublicUse").checked,
      source: el("source").value.trim(),
      observation: el("observation").value.trim(),
      thesis: el("thesis").value.trim(),
      counterargument: el("counterargument").value.trim(),
      readerAction: el("readerAction").value.trim(),
      nextAction: el("nextAction").value.trim(),
      publishWindow: el("publishWindow").value.trim(),
      publishedAt,
      createdAt: existing && existing.createdAt ? existing.createdAt : today(),
      scoreInputs
    };
  }

  function saveFormIdea(event) {
    event.preventDefault();
    const nextIdea = formIdea();
    const index = ideas.findIndex((idea) => idea.id === nextIdea.id);
    if (index >= 0) {
      ideas[index] = nextIdea;
    } else {
      ideas.unshift(nextIdea);
    }
    selectedId = nextIdea.id;
    saveIdeas();
    render();
  }

  function createNewIdea() {
    const fresh = {
      id: makeId(),
      title: "",
      status: "captured",
      category: "Underwriting Intelligence",
      assetClass: "MCA / private credit",
      signalType: "live deal observation",
      underwritingTheme: "cash-flow quality",
      marketRegime: "liquidity stress",
      audienceIntent: "improve underwriting",
      evidenceStrength: "anecdote",
      confidence: "medium",
      monetizationRole: "paid conversion",
      repurposePotential: "high",
      confidentiality: "private not approved",
      privateFlag: true,
      approvedForPublicUse: false,
      source: "",
      observation: "",
      thesis: "",
      counterargument: "",
      readerAction: "",
      nextAction: "Normalize and score.",
      publishWindow: "",
      createdAt: today(),
      publishedAt: "",
      scoreInputs: {
        proprietaryEdge: 10,
        economicStakes: 8,
        timeliness: 5,
        contrarianity: 5,
        evidenceDepth: 5,
        audiencePull: 5,
        subscriberFit: 5,
        repurposeLeverage: 3,
        operatorCredibility: 3,
        riskPenalty: 5
      }
    };
    ideas.unshift(fresh);
    selectedId = fresh.id;
    saveIdeas();
    render();
  }

  function deleteCurrentIdea() {
    if (!selectedId) return;
    const selected = ideas.find((idea) => idea.id === selectedId);
    if (!selected) return;
    const ok = window.confirm(`Delete "${selected.title || "Untitled idea"}"?`);
    if (!ok) return;
    ideas = ideas.filter((idea) => idea.id !== selectedId);
    selectedId = ideas[0] ? ideas[0].id : "";
    saveIdeas();
    render();
  }

  function setSelected(id) {
    selectedId = id;
    const selected = ideas.find((idea) => idea.id === selectedId);
    populateForm(selected);
    renderCards();
  }

  function ideaCard(idea, index) {
    const score = baseScore(idea);
    const priority = priorityScore(idea);
    const blocked = isBlocked(idea);
    const ready = isReady(idea);
    const blockers = blockersFor(idea).slice(0, 3);
    const className = blocked ? "blocked" : ready ? "ready" : "";
    const statusLabel = blocked ? "blocked" : ready ? "ready" : idea.status;

    return `
      <article class="idea-card ${className}">
        <div class="meta-row">
          <span class="status-pill ${className}">${escapeHtml(statusLabel)}</span>
          <span class="meta">Base ${score}</span>
          <span class="meta">Priority ${priority}</span>
          <span class="meta">Rank ${index + 1}</span>
        </div>
        <div>
          <h3>${escapeHtml(idea.title || "Untitled idea")}</h3>
          <p class="meta">${escapeHtml(idea.thesis || idea.observation || "No thesis yet.")}</p>
        </div>
        <div class="tag-row">
          <span class="tag">${escapeHtml(idea.category)}</span>
          <span class="tag">${escapeHtml(idea.signalType)}</span>
          <span class="tag">${escapeHtml(idea.underwritingTheme)}</span>
          <span class="tag">${escapeHtml(idea.marketRegime || "market regime")}</span>
          <span class="tag">${escapeHtml(idea.evidenceStrength || "evidence")}</span>
          <span class="tag">${escapeHtml(idea.monetizationRole)}</span>
        </div>
        ${blockers.length ? `<p class="meta">Blockers: ${escapeHtml(blockers.join(" "))}</p>` : ""}
        <button type="button" data-select="${escapeHtml(idea.id)}">Load idea</button>
      </article>
    `;
  }

  function filteredIdeas() {
    const view = el("viewFilter") ? el("viewFilter").value : "All Ideas";
    const ranked = rankedIdeas();

    if (view === "What To Write Next") return ranked;
    if (view === "Proprietary Edge Queue") return ranked.filter((idea) => Number((idea.scoreInputs || {}).proprietaryEdge || 0) >= 14);
    if (view === "Paid Conversion Candidates") return ranked.filter((idea) => String(idea.monetizationRole || "").includes("paid") || Number((idea.scoreInputs || {}).subscriberFit || 0) >= 8);
    if (view === "Stale But Valuable") return ranked.filter((idea) => daysSince(idea.createdAt) > 30 && baseScore(idea) >= 70);
    if (view === "Needs Evidence") return ranked.filter((idea) => Number((idea.scoreInputs || {}).evidenceDepth || 0) < 8);
    if (view === "Do Not Publish Yet") return ranked.filter((idea) => isBlocked(idea) || Number((idea.scoreInputs || {}).riskPenalty || 0) >= 15);
    if (view === "Allocation Drift") return ranked.filter((idea) => allocationBoost(idea) > 0);
    return ideas;
  }

  function bindCardButtons(rootId) {
    el(rootId).querySelectorAll("[data-select]").forEach((button) => {
      button.addEventListener("click", () => setSelected(button.getAttribute("data-select")));
    });
  }

  function renderCards() {
    const next = rankedIdeas().slice(0, 5);
    el("nextIdeas").innerHTML = next.length ? next.map(ideaCard).join("") : '<p class="empty">No ideas in the queue.</p>';
    bindCardButtons("nextIdeas");

    const visible = filteredIdeas();
    el("ideaCards").innerHTML = visible.length ? visible.map(ideaCard).join("") : '<p class="empty">No ideas match this view.</p>';
    bindCardButtons("ideaCards");
  }

  function renderAllocation() {
    el("allocationTable").innerHTML = categories.map((category) => {
      const share4 = categoryShare(category.id, 4);
      const share8 = categoryShare(category.id, 8);
      const drift = share4 - category.target;
      const fill = clamp(share4, 0, 100);
      const direction = drift > 0 ? `+${drift}` : String(drift);
      return `
        <div class="allocation-row">
          <strong>${escapeHtml(category.id)}</strong>
          <div class="bar" aria-label="${escapeHtml(category.id)} trailing share">
            <div class="bar-fill" style="width:${fill}%"></div>
          </div>
          <span>Target ${category.target}% | 4w ${share4}% | 8w ${share8}% | Drift ${direction}</span>
        </div>
      `;
    }).join("");
  }

  function renderDashboard() {
    const ready = ideas.filter(isReady);
    const blocked = ideas.filter(isBlocked);
    const pick = topPick();

    el("ideaCount").textContent = String(ideas.length);
    el("readyCount").textContent = String(ready.length);
    el("blockedCount").textContent = String(blocked.length);
    el("topPriority").textContent = String(pick ? priorityScore(pick) : 0);

    const pickPanel = el("weeklyPickPanel");
    if (!pick) {
      pickPanel.className = "panel decision";
      el("weeklyPickTitle").textContent = "No candidate yet";
      el("weeklyPickText").textContent = "Add or score ideas to generate a weekly pick.";
      el("weeklyPickScore").textContent = "0";
      return;
    }

    const blockedPick = isBlocked(pick);
    const readyPick = isReady(pick);
    pickPanel.className = `panel decision ${blockedPick ? "blocked" : readyPick ? "ready" : ""}`;
    el("weeklyPickTitle").textContent = pick.title || "Untitled idea";
    el("weeklyPickText").textContent = readyPick
      ? `${pick.thesis} Next action: ${pick.nextAction || "Run memo workflow."}`
      : `Highest-priority queue item, but needs work: ${blockersFor(pick).slice(0, 2).join(" ") || "complete evidence and approvals."}`;
    el("weeklyPickScore").textContent = String(priorityScore(pick));
  }

  function renderAgents() {
    const agent = el("agentSelect").value || Object.keys(prompts)[0];
    el("promptBox").textContent = prompts[agent];
    el("gateGrid").innerHTML = gates.map(([title, body]) => `
      <div class="gate">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(body)}</span>
      </div>
    `).join("");
  }

  function generateBrief() {
    const pick = topPick();
    const queue = rankedIdeas().slice(0, 5);
    const lines = [
      "# Weekly Operator Brief",
      "",
      `Date: ${today()}`,
      "",
      "## Recommended Memo",
      ""
    ];

    if (pick) {
      lines.push(`Title: ${pick.title}`);
      lines.push(`Base score: ${baseScore(pick)}`);
      lines.push(`Priority score: ${priorityScore(pick)}`);
      lines.push(`Category: ${pick.category}`);
      lines.push(`Confidentiality: ${pick.confidentiality}`);
      lines.push(`Ready: ${isReady(pick) ? "yes" : "no"}`);
      lines.push("");
      lines.push("Thesis:");
      lines.push(pick.thesis || "Missing.");
      lines.push("");
      lines.push("Proprietary observation:");
      lines.push(pick.observation || "Missing.");
      lines.push("");
      lines.push("Falsifiable counterpoint:");
      lines.push(pick.counterargument || "Missing.");
      lines.push("");
      lines.push("Reader action:");
      lines.push(pick.readerAction || "Missing.");
      lines.push("");
      const blockers = blockersFor(pick);
      lines.push("Blockers:");
      lines.push(blockers.length ? blockers.map((item) => `- ${item}`).join("\n") : "- None.");
      lines.push("");
      lines.push("Agent sequence:");
      lines.push("- Deal Scout: extract facts, anomaly, underwriting implication, comparable pattern, evidence gaps.");
      lines.push("- Skeptic: attack base rates, selection bias, legal/claim risk, and missing data.");
      lines.push("- Ghostwriter: draft from approved evidence only.");
      lines.push("- Editor: claim review, dead-angle review, publication recommendation.");
      lines.push("- Distribution Repurposer: Substack teaser, LinkedIn post, X thread, paid teaser, lead magnet excerpt, next seed.");
    } else {
      lines.push("No pick available.");
    }

    lines.push("");
    lines.push("## Top Queue");
    if (queue.length) {
      queue.forEach((idea, index) => {
        lines.push(`${index + 1}. ${idea.title} | priority ${priorityScore(idea)} | ${idea.category}`);
      });
    } else {
      lines.push("- No queue items.");
    }

    lines.push("");
    lines.push("## Allocation Snapshot");
    categories.forEach((category) => {
      lines.push(`- ${category.id}: target ${category.target}%, trailing 4 ${categoryShare(category.id, 4)}%, trailing 8 ${categoryShare(category.id, 8)}%.`);
    });

    lines.push("");
    lines.push("## Distribution Pack Checklist");
    lines.push("- Substack article");
    lines.push("- LinkedIn post");
    lines.push("- X thread");
    lines.push("- Paid subscriber teaser");
    lines.push("- Lead magnet or memo excerpt");
    lines.push("- Next article seed");

    return lines.join("\n");
  }

  function renderWeeklyBrief() {
    el("weeklyBrief").value = generateBrief();
  }

  function render() {
    const selected = ideas.find((idea) => idea.id === selectedId) || ideas[0];
    if (selected) {
      selectedId = selected.id;
      populateForm(selected);
    }
    renderDashboard();
    renderCards();
    renderAllocation();
    renderAgents();
    renderWeeklyBrief();
  }

  function exportData() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      ideas
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-research-machine-${today()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        if (!Array.isArray(parsed.ideas)) throw new Error("Missing ideas array.");
        ideas = parsed.ideas;
        selectedId = ideas[0] ? ideas[0].id : "";
        saveIdeas();
        render();
      } catch (error) {
        window.alert(`Import failed: ${error.message}`);
      }
    };
    reader.readAsText(file);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  function resetSample() {
    const ok = window.confirm("Reset the dashboard to the sample research queue?");
    if (!ok) return;
    ideas = sampleIdeas.map((idea) => JSON.parse(JSON.stringify(idea)));
    selectedId = ideas[0].id;
    saveIdeas();
    render();
  }

  function setupTabs() {
    document.querySelectorAll(".tabs button").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.getAttribute("data-tab");
        document.querySelectorAll(".tabs button").forEach((item) => item.classList.toggle("active", item === button));
        document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `${tab}Tab`));
      });
    });
  }

  function setup() {
    setOptions("status", options.status);
    setOptions("category", categories.map((category) => category.id));
    setOptions("assetClass", options.assetClass);
    setOptions("signalType", options.signalType);
    setOptions("underwritingTheme", options.underwritingTheme);
    setOptions("marketRegime", options.marketRegime);
    setOptions("audienceIntent", options.audienceIntent);
    setOptions("evidenceStrength", options.evidenceStrength);
    setOptions("confidence", options.confidence);
    setOptions("monetizationRole", options.monetizationRole);
    setOptions("repurposePotential", options.repurposePotential);
    setOptions("confidentiality", options.confidentiality);
    setOptions("viewFilter", viewFilters);
    setOptions("agentSelect", Object.keys(prompts));
    renderScoreSliders();
    setupTabs();

    el("ideaForm").addEventListener("submit", saveFormIdea);
    el("newIdeaBtn").addEventListener("click", createNewIdea);
    el("deleteIdeaBtn").addEventListener("click", deleteCurrentIdea);
    el("viewFilter").addEventListener("change", renderCards);
    el("agentSelect").addEventListener("change", renderAgents);
    el("copyPromptBtn").addEventListener("click", () => copyText(el("promptBox").textContent));
    el("copyBriefBtn").addEventListener("click", () => copyText(el("weeklyBrief").value));
    el("printBtn").addEventListener("click", () => window.print());
    el("resetBtn").addEventListener("click", resetSample);
    el("exportBtn").addEventListener("click", exportData);
    el("importBtn").addEventListener("click", () => el("importFile").click());
    el("importFile").addEventListener("change", (event) => importData(event.target.files[0]));

    render();
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
