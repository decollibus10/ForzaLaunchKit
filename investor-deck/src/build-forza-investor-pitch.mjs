import fs from "node:fs";
import path from "node:path";

const {
  Presentation,
  PresentationFile,
  row,
  column,
  grid,
  layers,
  panel,
  text,
  image,
  shape,
  chart,
  rule,
  fill,
  hug,
  fixed,
  wrap,
  grow,
  fr,
  auto,
} = await import("@oai/artifact-tool");

const OUT = "/Users/moof/Documents/New project 2/investor-deck";
const W = 1920;
const H = 1080;

const C = {
  paper: "#F7F6EF",
  paper2: "#EFEDE5",
  ink: "#17211C",
  muted: "#59645F",
  line: "#D9DDD7",
  green: "#0F4A32",
  green2: "#173D2D",
  gold: "#B38A3C",
  clay: "#7D5842",
  white: "#FFFFFF",
  danger: "#8A332A",
};

const font = {
  display: "Georgia",
  body: "Aptos",
  mono: "Courier New",
};

function dataUrl(relPath) {
  const full = path.join(OUT, relPath);
  const ext = path.extname(full).toLowerCase().replace(".", "");
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(full, "base64")}`;
}

const assets = {
  hero: dataUrl("../forza-capital-partners-theme/assets/images/forza-operations-hero.png"),
  home: dataUrl("scratch/assets/home-preview.png"),
  dealDesk: dataUrl("scratch/assets/deal-desk.png"),
};

const presentation = Presentation.create({ slideSize: { width: W, height: H } });

function t(value, opts = {}) {
  return text(value, {
    width: opts.width ?? fill,
    height: opts.height ?? hug,
    ...opts,
    style: {
      fontFace: opts.fontFace ?? font.body,
      fontSize: opts.fontSize ?? 30,
      color: opts.color ?? C.ink,
      bold: opts.bold,
      italic: opts.italic,
      ...opts.style,
    },
  });
}

function eyebrow(value, color = C.gold) {
  return t(value, {
    name: "eyebrow",
    width: fill,
    fontSize: 17,
    color,
    bold: true,
    style: { letterSpacing: 1.4 },
  });
}

function title(value, opts = {}) {
  return t(value, {
    name: "slide-title",
    width: opts.width ?? fill,
    fontFace: font.display,
    fontSize: opts.fontSize ?? 62,
    color: opts.color ?? C.ink,
    bold: true,
    ...opts,
  });
}

function body(value, opts = {}) {
  return t(value, {
    name: opts.name ?? "body",
    width: opts.width ?? wrap(1050),
    fontSize: opts.fontSize ?? 28,
    color: opts.color ?? C.muted,
    ...opts,
  });
}

function source(value) {
  return t(value, {
    name: "source",
    width: fill,
    fontSize: 13,
    color: "#7A837F",
  });
}

function stat(value, label, opts = {}) {
  return column({ name: opts.name ?? "stat", width: opts.width ?? fill, height: opts.height ?? hug, gap: opts.gap ?? 8 }, [
    t(value, {
      name: "stat-value",
      width: fill,
      fontFace: opts.valueFace ?? font.display,
      fontSize: opts.fontSize ?? 72,
      color: opts.color ?? C.green,
      bold: true,
    }),
    rule({ name: "stat-rule", width: fixed(opts.ruleWidth ?? 120), stroke: opts.ruleColor ?? C.gold, weight: 4 }),
    t(label, {
      name: "stat-label",
      width: fill,
      fontSize: opts.labelSize ?? 24,
      color: opts.labelColor ?? C.muted,
      bold: opts.labelBold ?? false,
    }),
  ]);
}

function smallLabel(value, opts = {}) {
  return t(value, {
    width: opts.width ?? fill,
    fontSize: opts.fontSize ?? 18,
    color: opts.color ?? C.muted,
    bold: true,
  });
}

function miniMetric(value, label, opts = {}) {
  return column({ name: opts.name ?? "mini-metric", width: fill, height: hug, gap: 4 }, [
    t(value, { width: fill, fontSize: opts.valueSize ?? 33, color: opts.color ?? C.green, bold: true }),
    t(label, { width: fill, fontSize: opts.labelSize ?? 15, color: opts.labelColor ?? C.muted }),
  ]);
}

function bulletList(items, opts = {}) {
  return column({ name: opts.name ?? "bullet-list", width: opts.width ?? fill, height: hug, gap: opts.gap ?? 16 }, items.map((item, idx) =>
    row({ name: `bullet-${idx}`, width: fill, height: hug, gap: 14, align: "start" }, [
      shape({ name: `dot-${idx}`, width: fixed(10), height: fixed(10), fill: opts.dotColor ?? C.gold, geometry: "ellipse" }),
      t(item, { width: fill, fontSize: opts.fontSize ?? 25, color: opts.color ?? C.ink }),
    ]),
  ));
}

function slideRoot(children, opts = {}) {
  const slide = presentation.slides.add();
  slide.compose(
    layers({ name: "slide-root", width: fill, height: fill }, [
      shape({ name: "background", width: fill, height: fill, fill: opts.background ?? C.paper }),
      ...(opts.accent
        ? [
            shape({
              name: "accent-field",
              width: fixed(opts.accent.width),
              height: fill,
              fill: opts.accent.fill,
            }),
          ]
        : []),
      column(
        {
          name: "content",
          width: fill,
          height: fill,
          padding: opts.padding ?? { x: 96, y: 74 },
          gap: opts.gap ?? 28,
        },
        children,
      ),
    ]),
    { frame: { left: 0, top: 0, width: W, height: H }, baseUnit: 8 },
  );
  return slide;
}

function titleStack(eyebrowText, titleText, subtitleText, opts = {}) {
  return column({ name: "title-stack", width: fill, height: hug, gap: 16 }, [
    eyebrow(eyebrowText, opts.eyebrowColor ?? C.gold),
    title(titleText, { fontSize: opts.titleSize ?? 58, width: opts.titleWidth ?? fill, color: opts.titleColor ?? C.ink }),
    subtitleText ? body(subtitleText, { width: opts.subtitleWidth ?? wrap(1260), fontSize: opts.subtitleSize ?? 26, color: opts.subtitleColor ?? C.muted }) : null,
  ].filter(Boolean));
}

function footer(page, extra = "") {
  return row({ name: "footer", width: fill, height: hug, align: "center", justify: "between" }, [
    t("FORZA CAPITAL PARTNERS LLC", { width: wrap(620), fontSize: 13, color: C.muted, bold: true }),
    t(extra || `Investor pitch · ${page}`, { width: wrap(620), fontSize: 13, color: C.muted }),
  ]);
}

// 1. Cover
slideRoot(
  [
    row({ name: "cover-grid", width: fill, height: grow(1), gap: 60, align: "center" }, [
      column({ name: "cover-type", width: grow(0.92), height: hug, gap: 22 }, [
        eyebrow("INVESTOR PITCH · APRIL 2026"),
        title("Disciplined capital for NJ businesses with real receivables.", {
          fontSize: 76,
          width: wrap(820),
        }),
        body("FORZA CAPITAL PARTNERS LLC pairs a narrow receivables-purchase launch box with a separate AI Automation Audit offer and a compliance-first operating model.", {
          width: wrap(800),
          fontSize: 29,
        }),
        rule({ name: "cover-rule", width: fixed(260), stroke: C.gold, weight: 6 }),
        t("Seeking pilot capital and strategic partners for a controlled New Jersey launch.", {
          width: wrap(760),
          fontSize: 25,
          color: C.green,
          bold: true,
        }),
      ]),
      image({
        name: "cover-hero",
        dataUrl: assets.hero,
        width: grow(1.08),
        height: fixed(720),
        fit: "cover",
        alt: "Small business operations desk with tablet, invoices, and payment terminal",
      }),
    ]),
    footer(1, "Prepared for investor discussions"),
  ],
  { background: C.paper },
);

// 2. Market wedge
slideRoot([
  titleStack("WHY NEW JERSEY", "A dense local SMB base, narrow enough to underwrite manually.", "FORZA starts where focus matters: one state, small first checks, service businesses, and controls before scale."),
  grid({ name: "market-stats", width: fill, height: grow(1), columns: [fr(1), fr(1), fr(1)], columnGap: 42, alignItems: "center" }, [
    stat("979k", "small businesses in New Jersey", { fontSize: 86, ruleWidth: 150 }),
    stat("99.6%", "of New Jersey businesses are small businesses", { fontSize: 86, color: C.clay, ruleWidth: 150 }),
    stat("1.7M", "small-business employees statewide", { fontSize: 86, color: C.green2, ruleWidth: 150 }),
  ]),
  body("The wedge is not national origination volume. It is a local, controlled pilot with enough demand density to learn quickly without spreading compliance and underwriting thin.", {
    width: wrap(1420),
    fontSize: 27,
    color: C.ink,
  }),
  source("Source: U.S. SBA Office of Advocacy, 2024 Small Business Profile: New Jersey."),
]);

// 3. Problem
slideRoot([
  titleStack("THE CASH-FLOW GAP", "Small firms still seek small-dollar capital for operating needs.", "The gap FORZA serves is practical: payroll, inventory, repairs, receivables timing, and uneven cash flow."),
  row({ name: "problem-body", width: fill, height: grow(1), gap: 44, align: "center" }, [
    column({ name: "problem-chart-block", width: grow(1.05), height: hug, gap: 14 }, [
      chart({
        name: "sbcs-chart",
        chartType: "bar",
        width: fill,
        height: fixed(420),
        config: {
          categories: ["Applied", "<$50k", "OpEx", "None"],
          series: [{ name: "Share", values: [59, 40, 56, 24] }],
          legend: { visible: false },
        },
      }),
      grid({ name: "chart-direct-labels", width: fill, height: hug, columns: [fr(1), fr(1), fr(1), fr(1)], columnGap: 18 }, [
        miniMetric("59%", "applied for financing"),
        miniMetric("40%", "sought <$50k"),
        miniMetric("56%", "for operating expenses", { color: C.clay }),
        miniMetric("24%", "received none", { color: C.gold }),
      ]),
    ]),
    column({ name: "problem-points", width: grow(0.75), height: hug, gap: 24 }, [
      stat("51%", "reported uneven cash flow as a financial challenge", { fontSize: 68, color: C.gold, ruleColor: C.green }),
      bulletList([
        "Bank and SBA processes often do not match a $5k-$15k timing need.",
        "Existing debt is a rising denial factor, so underwriting discipline is part of the product.",
        "Speed matters, but careless speed destroys the portfolio.",
      ], { fontSize: 24, dotColor: C.green }),
    ]),
  ]),
  source("Source: Federal Reserve Banks, 2025 Small Business Credit Survey: Report on Employer Firms."),
]);

// 4. Solution
slideRoot([
  titleStack("THE FORZA MODEL", "A receivables-purchase product designed to stay inside the guardrails.", "The launch offer is intentionally constrained so every file can be reviewed before money leaves the building."),
  grid({ name: "solution-grid", width: fill, height: grow(1), columns: [fr(0.95), fr(1.05)], columnGap: 56, alignItems: "center" }, [
    column({ name: "solution-left", width: fill, height: hug, gap: 28 }, [
      stat("$5k-$15k", "first funding requests", { fontSize: 78, color: C.green }),
      stat("1.50x", "illustrative starting factor", { fontSize: 78, color: C.clay }),
      stat("1.10x", "eligible 30-day discount example", { fontSize: 78, color: C.gold }),
    ]),
    column({ name: "solution-right", width: fill, height: hug, gap: 22 }, [
      bulletList([
        "NJ-only business receivables purchase, not consumer lending.",
        "12+ months in business and $15k+ monthly gross revenue.",
        "Public forms collect business basics only; sensitive documents move to secure review.",
        "AI Automation Audit stays separate from funding decisions.",
      ], { fontSize: 28, dotColor: C.gold }),
      body("The model rejects the MCA industry’s weakest habit: scaling volume before controls.", {
        width: wrap(820),
        fontSize: 30,
        color: C.green,
      }),
    ]),
  ]),
  footer(4),
]);

// 5. Built launch asset
slideRoot([
  titleStack("LAUNCH ASSETS", "The investor conversation starts with a working funnel, not an idea.", "The site, static export, lead forms, content plan, and operating docs are already assembled for review and iteration."),
  row({ name: "asset-row", width: fill, height: grow(1), gap: 44, align: "center" }, [
    image({
      name: "website-preview",
      dataUrl: assets.home,
      width: grow(1.18),
      height: fixed(600),
      fit: "cover",
      alt: "FORZA website homepage preview",
    }),
    column({ name: "asset-list", width: grow(0.72), height: hug, gap: 22 }, [
      bulletList([
        "WordPress theme and uploadable theme zip.",
        "Static site export ready for Cloudflare Pages review.",
        "Eligibility and AI audit forms with lead routing plan.",
        "SEO calendar, starter articles, and industry page copy.",
        "Launch checklist, underwriting playbook, and counsel packet.",
      ], { fontSize: 25, dotColor: C.green }),
    ]),
  ]),
  footer(5, "Product and launch materials are editable in the workspace"),
]);

// 6. Lead engine
slideRoot([
  titleStack("GO-TO-MARKET", "Organic first. Paid second. HubSpot underneath.", "FORZA’s acquisition plan is built around high-intent education, industry landing pages, and conservative Meta testing."),
  grid({ name: "funnel-grid", width: fill, height: grow(1), columns: [fr(1), auto, fr(1), auto, fr(1), auto, fr(1)], columnGap: 22, alignItems: "center" }, [
    stat("SEO", "NJ funding guides and industry pages", { fontSize: 50, labelSize: 21, ruleWidth: 80, gap: 4, height: fixed(190) }),
    t("→", { width: fixed(50), fontSize: 42, color: C.gold, bold: true }),
    stat("Form", "short eligibility review only", { fontSize: 50, labelSize: 21, ruleWidth: 80, color: C.clay, gap: 4, height: fixed(190) }),
    t("→", { width: fixed(50), fontSize: 42, color: C.gold, bold: true }),
    stat("CRM", "HubSpot stages and SLAs", { fontSize: 50, labelSize: 21, ruleWidth: 80, color: C.green2, gap: 4, height: fixed(190) }),
    t("→", { width: fixed(50), fontSize: 42, color: C.gold, bold: true }),
    stat("Call", "secure docs after human review", { fontSize: 50, labelSize: 21, ruleWidth: 80, color: C.green, gap: 4, height: fixed(190) }),
  ]),
  row({ name: "gtm-notes", width: fill, height: hug, gap: 60 }, [
    body("Meta test budget: under $1k/month, statewide NJ, education-first, no guaranteed approval language.", { width: wrap(780), fontSize: 27, color: C.ink }),
    body("Weekly content cadence: MCA basics, factor rates, reconciliation, second-position risk, and NJ service-business guides.", { width: wrap(780), fontSize: 27, color: C.ink }),
  ]),
  footer(6),
]);

// 7. Underwriting controls
slideRoot([
  titleStack("RISK DESIGN", "The underwriting surface is operational from day one.", "FORZA’s internal Deal Desk turns the launch box into a repeatable approval memo: fit, exposure, remittance load, and risk notes."),
  row({ name: "risk-row", width: fill, height: grow(1), gap: 44, align: "center" }, [
    column({ name: "risk-copy", width: grow(0.72), height: hug, gap: 22 }, [
      bulletList([
        "Capital reserve and single-merchant exposure controls.",
        "Average balance, negative-day, NSF, and existing-position checks.",
        "Combined remittance load and holdback thresholds.",
        "UCC/tax lien, entity status, identity, and senior contract review before final approval.",
      ], { fontSize: 26, dotColor: C.gold }),
    ]),
    image({
      name: "deal-desk-preview",
      dataUrl: assets.dealDesk,
      width: grow(1.12),
      height: fixed(610),
      fit: "cover",
      alt: "FORZA Deal Desk internal calculator preview",
    }),
  ]),
  footer(7, "Deal Desk is an internal planning tool, not an approval engine"),
]);

// 8. Economics and portfolio box
slideRoot([
  titleStack("PILOT ECONOMICS", "Small checks create room to learn before scaling exposure.", "The launch model favors controlled gross spread, liquidity reserves, and concentration discipline over maximum origination volume."),
  grid({ name: "economics-grid", width: fill, height: grow(1), columns: [fr(1), fr(1)], columnGap: 56, alignItems: "center" }, [
    column({ name: "example-math", width: fill, height: hug, gap: 24 }, [
      stat("$10k", "example advance", { fontSize: 70, ruleWidth: 100 }),
      stat("$15k", "purchased receivables at 1.50x", { fontSize: 70, color: C.green2, ruleWidth: 100 }),
      stat("$11k", "eligible 30-day discount amount at 1.10x", { fontSize: 70, color: C.gold, ruleWidth: 100 }),
    ]),
    column({ name: "portfolio-rules", width: fill, height: hug, gap: 24 }, [
      t("Portfolio controls", { width: fill, fontSize: 34, color: C.ink, bold: true }),
      bulletList([
        "$75k sample founder pool in current model.",
        "30% reserve leaves $52.5k deployable capital.",
        "15% max single-merchant exposure default.",
        "Stop-loss trigger pauses originations if two active files become materially delinquent.",
      ], { fontSize: 26, dotColor: C.green }),
      source("Source: FORZA portfolio allocation model in launch kit. Example only; final terms require counsel and investor agreement."),
    ]),
  ]),
]);

// 9. AI audit line
slideRoot([
  titleStack("ADJACENT REVENUE", "AI consulting is a separate line, not a funding add-on.", "The AI Automation Audit gives FORZA a differentiated conversation with the same local service-business audience while keeping funding decisions clean."),
  grid({ name: "ai-grid", width: fill, height: grow(1), columns: [fr(1), fr(1), fr(1)], columnGap: 42, alignItems: "center" }, [
    stat("Map", "manual workflows: calls, follow-up, invoices, scheduling", { fontSize: 58, color: C.green }),
    stat("Score", "opportunities by ROI and implementation effort", { fontSize: 58, color: C.clay }),
    stat("Refer", "optional implementation after audit; never required for funding", { fontSize: 58, color: C.gold }),
  ]),
  body("Investor value: more qualified conversations, more data about SMB pain, and a non-capital-intensive revenue path.", {
    width: wrap(1300),
    fontSize: 30,
    color: C.ink,
  }),
  footer(9),
]);

// 10. Investor ask
slideRoot([
  titleStack("INVESTOR ASK", "Proposed pilot capital: $250k-$500k.", "This is an editable discussion range for investors; the final structure should be set by counsel and documented in the operating model."),
  grid({ name: "ask-grid", width: fill, height: grow(1), columns: [fr(0.95), fr(1.05)], columnGap: 58, alignItems: "center" }, [
    column({ name: "ask-left", width: fill, height: hug, gap: 26 }, [
      stat("$250k-$500k", "pilot capital range for investor conversations", { fontSize: 76, color: C.green, ruleWidth: 170 }),
      body("Target: fund a controlled cohort of first-position NJ deals, measure repayment/reconciliation behavior, and establish underwriting feedback loops before expanding.", {
        width: wrap(740),
        fontSize: 28,
        color: C.ink,
      }),
    ]),
    column({ name: "use-of-funds", width: fill, height: hug, gap: 22 }, [
      t("Use of funds", { width: fill, fontSize: 34, bold: true, color: C.ink }),
      bulletList([
        "70% dedicated funding pool and liquidity reserve.",
        "10% legal, compliance, agreements, disclosures, and servicing process.",
        "10% acquisition: SEO content, landing pages, and small Meta tests.",
        "10% operations: CRM, secure document workflow, reporting, and portfolio controls.",
      ], { fontSize: 26, dotColor: C.gold }),
    ]),
  ]),
  footer(10, "Investment terms are placeholders until reviewed by counsel"),
]);

// 11. Milestones
slideRoot([
  titleStack("90-DAY PLAN", "Move from built launch kit to measured portfolio.", "The first investor update should be about qualified lead flow, underwriting signal, and repayment behavior—not vanity traffic."),
  grid({ name: "milestones", width: fill, height: grow(1), columns: [fr(0.8), fr(1.2), fr(1.0)], columnGap: 28, rowGap: 18, alignItems: "start" }, [
    smallLabel("Window", { color: C.gold }),
    smallLabel("Milestone", { color: C.gold }),
    smallLabel("Investor signal", { color: C.gold }),
    t("Days 1-30", { fontSize: 25, bold: true }),
    t("Counsel review, CRM wiring, final forms, first SEO pages indexed.", { fontSize: 25, color: C.ink }),
    t("Launch readiness and compliance quality.", { fontSize: 25, color: C.muted }),
    rule({ columnSpan: 3, width: fill, stroke: C.line, weight: 1 }),
    t("Days 31-60", { fontSize: 25, bold: true }),
    t("Meta test, checklist lead magnet, first calls, first document reviews.", { fontSize: 25, color: C.ink }),
    t("Qualified lead rate and underwriting funnel loss.", { fontSize: 25, color: C.muted }),
    rule({ columnSpan: 3, width: fill, stroke: C.line, weight: 1 }),
    t("Days 61-90", { fontSize: 25, bold: true }),
    t("First controlled deals, weekly portfolio review, reconciliation tests.", { fontSize: 25, color: C.ink }),
    t("Repayment behavior, exception rate, and capital recycling.", { fontSize: 25, color: C.muted }),
  ]),
  footer(11),
]);

// 12. Close / sources
slideRoot([
  titleStack("WHY FORZA CAN WIN", "The wedge is focus: local, small, controlled, and disclosure-ready.", "Investors are not being asked to fund a volume machine. They are being asked to back a measured capital product with a built funnel and explicit risk controls."),
  row({ name: "close-row", width: fill, height: grow(1), gap: 54, align: "center" }, [
    column({ name: "close-claim", width: grow(0.9), height: hug, gap: 20 }, [
      stat("NJ-only", "tight geography", { fontSize: 66, color: C.green }),
      stat("Manual-first", "underwriting posture", { fontSize: 66, color: C.clay }),
      stat("Built assets", "site, content, CRM plan, Deal Desk", { fontSize: 66, color: C.gold }),
    ]),
    column({ name: "sources", width: grow(1.1), height: hug, gap: 12 }, [
      t("Source anchors", { width: fill, fontSize: 32, bold: true, color: C.ink }),
      source("SBA Office of Advocacy, 2024 Small Business Profile: New Jersey."),
      source("Federal Reserve Banks, 2025 Small Business Credit Survey: Report on Employer Firms."),
      source("New Jersey A4580/S1760 commercial financing disclosure proposals, 2026-2027 session."),
      source("FORZA launch kit: underwriting playbook, lead-generation engine, portfolio allocation model, Deal Desk."),
      body("Confidential discussion draft. Investment terms, securities compliance, and commercial-financing disclosures should be reviewed by counsel before closing any capital.", {
        width: wrap(860),
        fontSize: 23,
        color: C.clay,
      }),
    ]),
  ]),
  footer(12, "Confidential · discussion draft"),
]);

fs.mkdirSync(path.join(OUT, "output"), { recursive: true });
fs.mkdirSync(path.join(OUT, "scratch", "previews"), { recursive: true });

const pptxBlob = await PresentationFile.exportPptx(presentation);
await pptxBlob.save(path.join(OUT, "output", "output.pptx"));

for (let i = 0; i < presentation.slides.count; i += 1) {
  const slide = presentation.slides.getItem(i);
  const png = await presentation.export({ slide, format: "png" });
  const bytes = Buffer.from(await png.arrayBuffer());
  fs.writeFileSync(path.join(OUT, "scratch", "previews", `slide-${String(i + 1).padStart(2, "0")}.png`), bytes);
}

console.log(JSON.stringify({
  slides: presentation.slides.count,
  pptx: path.join(OUT, "output", "output.pptx"),
  previews: path.join(OUT, "scratch", "previews"),
}, null, 2));
