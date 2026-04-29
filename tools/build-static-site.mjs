#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "static-site");
const THEME = path.join(ROOT, "forza-capital-partners-theme");
const CONFIG_PATH = path.join(ROOT, "config", "forza-site.json");
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const SITE_URL = CONFIG.siteUrl || "https://forza-capital-partners.example";
const SITE_NAME = "FORZA CAPITAL PARTNERS LLC";
const HERO_IMAGE = "/assets/images/forza-operations-hero.png";
const HUBSPOT = {
  portalId: "",
  region: "na1",
  fundingFormId: "",
  auditFormId: "",
  resourceFormId: "",
  investorFormId: "",
  ...(CONFIG.hubspot || {})
};

const navLinks = [
  ["Funding", "/business-funding/"],
  ["Eligibility", "/eligibility/"],
  ["How It Works", "/how-it-works/"],
  ["AI Audit", "/ai-automation-audit/"],
  ["Insights", "/insights/"],
  ["Contact", "/contact/"]
];

const articleFiles = [
  "revenue-based-funding-vs-bank-loans-nj.md",
  "how-factor-rates-work-merchant-cash-advance.md",
  "what-reconciliation-means-revenue-based-funding.md",
  "when-not-to-use-merchant-cash-advance.md"
];

const industryPages = [
  {
    slug: "contractor-funding-nj",
    label: "Contractors",
    formIndustry: "contractor",
    title: "Contractor funding for New Jersey trades and service companies.",
    description: "Receivables-based funding education and eligibility for New Jersey contractors, trades, and home service businesses.",
    intro: "For contractors, cash flow pressure often comes from labor, materials, deposits, and slow-paying customers. FORZA reviews whether a short receivables-purchase structure fits the business, not just whether the owner wants fast cash.",
    useCases: ["Materials for confirmed jobs", "Payroll timing between draws", "Equipment repair", "Receivables gap coverage", "Marketing tied to booked service demand"],
    cautions: ["Large unpaid tax balances", "Unverified project pipeline", "Multiple stacked advances", "Thin margins after payroll and materials"]
  },
  {
    slug: "restaurant-funding-nj",
    label: "Restaurants",
    formIndustry: "restaurant",
    title: "Restaurant funding for eligible New Jersey operators.",
    description: "Working-capital education and eligibility for New Jersey restaurants, cafes, and food service businesses.",
    intro: "Restaurants can have strong sales and still feel pressure from food costs, payroll, repairs, seasonality, and vendor timing. FORZA looks for consistent revenue, supportable remittance, and a specific business use of funds.",
    useCases: ["Inventory before a busy period", "Kitchen or POS repair", "Payroll timing", "Vendor catch-up with a plan", "Local marketing for near-term demand"],
    cautions: ["Frequent overdrafts", "Sales drop without a recovery plan", "Unclear vendor debt", "Remittance that would crowd out payroll or rent"]
  },
  {
    slug: "salon-funding-nj",
    label: "Salons",
    formIndustry: "salon",
    title: "Salon and wellness funding for New Jersey businesses.",
    description: "Receivables-purchase funding education for New Jersey salons, barbershops, spas, and wellness studios.",
    intro: "Salons and wellness businesses often need capital for supplies, booth buildouts, scheduling tools, equipment, or marketing. FORZA's first review starts with revenue consistency and whether the request fits the narrow NJ pilot.",
    useCases: ["Chair or equipment upgrades", "Inventory and retail products", "Booking and follow-up systems", "Payroll or contractor timing", "Local promotion for measurable bookings"],
    cautions: ["Revenue under the pilot threshold", "High chargebacks or refunds", "Owner draws that exceed cash flow", "No clear use of funds"]
  },
  {
    slug: "auto-repair-funding-nj",
    label: "Repair Shops",
    formIndustry: "repair",
    title: "Auto repair and service-shop funding in New Jersey.",
    description: "Funding education and eligibility for New Jersey auto repair, maintenance, and local service shops.",
    intro: "Repair shops can need short-term capital for parts, lifts, diagnostic tools, payroll, or vendor timing. FORZA reviews bank activity, average balances, current obligations, and whether revenue can support the structure.",
    useCases: ["Parts for booked work", "Lift or equipment repair", "Payroll timing", "Vendor terms cleanup", "Marketing tied to service appointments"],
    cautions: ["Unstable deposit activity", "Stacked funding positions", "Tax liens that need counsel review", "Funding requests above the pilot range"]
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relativePath, contents) {
  const target = path.join(OUT, relativePath);
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, contents);
}

function routeFile(route, contents) {
  const target = route === "/" ? "index.html" : path.join(route.replace(/^\/|\/$/g, ""), "index.html");
  writeFile(target, contents);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: markdown };

  const meta = {};
  for (const line of match[1].split("\n")) {
    const item = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!item) continue;
    meta[item[1]] = item[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: match[2].trim() };
}

function markdownTable(lines, start) {
  const tableLines = [];
  let i = start;
  while (i < lines.length && /^\|/.test(lines[i].trim())) {
    tableLines.push(lines[i].trim());
    i += 1;
  }

  const rows = tableLines
    .filter((line) => !/^\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

  if (rows.length === 0) return { html: "", next: i };
  const [head, ...body] = rows;
  const headHtml = head.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("");
  const bodyHtml = body
    .map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`)
    .join("\n");

  return {
    html: `<div class="table-scroll"><table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`,
    next: i
  };
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      i += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(`<li>${inlineMarkdown(lines[i].trim().slice(2))}</li>`);
        i += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (line.startsWith("|") && lines[i + 1] && lines[i + 1].trim().startsWith("|")) {
      const table = markdownTable(lines, i);
      html.push(table.html);
      i = table.next;
      continue;
    }

    const paragraph = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("### ") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("|")
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}

function loadArticles() {
  return articleFiles.map((file) => {
    const raw = fs.readFileSync(path.join(ROOT, "docs", "seo-articles", file), "utf8");
    const { meta, body } = parseFrontMatter(raw);
    const bodyWithoutH1 = body.replace(/^# .+\n+/, "");
    const summaryBlock = bodyWithoutH1
      .split(/\n\n+/)
      .find((block) => block.trim() && !block.trim().startsWith("#") && !block.trim().startsWith("-"));
    return {
      ...meta,
      route: `/insights/${meta.slug}/`,
      summary: meta.meta_description || (summaryBlock ? summaryBlock.replace(/\s+/g, " ").slice(0, 180) : ""),
      html: markdownToHtml(bodyWithoutH1)
    };
  });
}

function brand() {
  return `
    <span class="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img" focusable="false">
        <path d="M32 6 56 20v24L32 58 8 44V20L32 6Z" fill="currentColor" opacity=".16"></path>
        <path d="M32 10 52 22 32 34 12 22 32 10Z" fill="currentColor"></path>
        <path d="M20 28h28L32 54h-9l11-18H20v-8Z" fill="#fff"></path>
        <path d="M34 26 46 19v16H34v-9Z" fill="#fff" opacity=".9"></path>
      </svg>
    </span>
    <span><strong>FORZA</strong><small>CAPITAL PARTNERS LLC</small></span>
  `;
}

function header(activePath) {
  const nav = navLinks
    .map(([label, href]) => {
      const current = href === activePath ? ' aria-current="page"' : "";
      return `<li><a href="${href}"${current}>${label}</a></li>`;
    })
    .join("");

  return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="topbar">
        <div class="container topbar-inner">
          <span>New Jersey only</span>
          <span>Business receivables purchase funding</span>
          <span>AI Automation Audit available separately</span>
        </div>
      </div>
      <div class="container nav-shell">
        <a class="brand" href="/" aria-label="${SITE_NAME} home">${brand()}</a>
        <button class="nav-toggle" type="button" aria-controls="primary-menu" aria-expanded="false" data-nav-toggle>
          <span></span><span></span><span></span>
          <span class="screen-reader-text">Menu</span>
        </button>
        <nav class="primary-nav" id="primary-menu" aria-label="Primary navigation" data-primary-nav>
          <ul class="preview-menu">${nav}</ul>
        </nav>
        <a class="button button-primary nav-cta" href="/eligibility/">Check eligibility <span aria-hidden="true">-&gt;</span></a>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="brand footer-brand" href="/">${brand()}</a>
          <p>NJ-only business receivables purchase funding and separate AI Automation Audit consulting.</p>
          <p class="footer-small">Entity ID 0451396744. Filed in New Jersey on January 10, 2026.</p>
        </div>
        <div>
          <h2>Funding</h2>
          <a href="/business-funding/">Business Funding</a>
          <a href="/nj-business-funding/">NJ Business Funding</a>
          <a href="/eligibility/">Eligibility</a>
          <a href="/how-it-works/">How It Works</a>
          <a href="/disclosures/">Disclosures</a>
        </div>
        <div>
          <h2>Company</h2>
          <a href="/ai-automation-audit/">AI Automation Audit</a>
          <a href="/insights/">Insights</a>
          <a href="/investor-overview/">Investor Overview</a>
          <a href="/resources/nj-funding-readiness-checklist/">Funding Readiness Checklist</a>
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
        </div>
        <div>
          <h2>Important</h2>
          <a href="/privacy/">Privacy Policy</a>
          <a href="/terms/">Terms of Use</a>
          <p class="footer-small">Eligibility review is not approval. FORZA does not offer consumer loans.</p>
        </div>
      </div>
      <div class="container legal-line"><p>&copy; 2026 ${SITE_NAME}. All rights reserved.</p></div>
    </footer>
  `;
}

function schemaFor(pathname) {
  const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: SITE_NAME,
    legalName: SITE_NAME,
    url: canonical,
    areaServed: "New Jersey",
    foundingDate: "2026-01-10",
    identifier: "0451396744",
    sameAs: []
  };
}

function layout({ title, description, pathname, activePath, body }) {
  const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/css/main.css">
  <script type="application/ld+json">${JSON.stringify(schemaFor(pathname))}</script>
</head>
<body>
  ${header(activePath || pathname)}
  <main id="main">${body}</main>
  ${footer()}
  <script src="/assets/js/forza-config.js" defer></script>
  <script src="/assets/js/site.js" defer></script>
  <script src="/assets/js/hubspot-forms.js" defer></script>
</body>
</html>
`;
}

function selected(value, expected) {
  return value === expected ? " selected" : "";
}

function prequalForm(options = {}) {
  const industry = options.industry || "";
  return `
    <form class="forza-form prequal-form" method="post" action="#" data-forza-prequal data-static="true">
      <input type="hidden" name="lead_type" value="funding_eligibility">
      <input type="hidden" name="source_page" value="">
      <input type="hidden" name="utm_source" value="">
      <input type="hidden" name="utm_medium" value="">
      <input type="hidden" name="utm_campaign" value="">
      <input type="hidden" name="utm_content" value="">
      <input type="hidden" name="utm_term" value="">
      <div class="form-grid">
        <label><span>Business legal name</span><input type="text" name="business_name" placeholder="Your registered business name" required></label>
        <label><span>Owner name</span><input type="text" name="owner_name" placeholder="First and last name" required></label>
        <label><span>Business email</span><input type="email" name="email" placeholder="you@business.com" required></label>
        <label><span>Phone number</span><input type="tel" name="phone" placeholder="(732) 555-0123" required></label>
        <label><span>Business location</span><select name="business_state" required><option value="">Select one</option><option value="NJ">New Jersey</option><option value="other">Outside New Jersey</option></select></label>
        <label><span>Industry</span><select name="industry" required><option value="">Select one</option><option value="contractor"${selected(industry, "contractor")}>Contractor / trades</option><option value="restaurant"${selected(industry, "restaurant")}>Restaurant / food service</option><option value="salon"${selected(industry, "salon")}>Salon / wellness</option><option value="repair"${selected(industry, "repair")}>Repair / auto / service shop</option><option value="professional"${selected(industry, "professional")}>Professional services</option><option value="other"${selected(industry, "other")}>Other local service business</option></select></label>
        <label><span>Monthly gross revenue</span><select name="monthly_revenue" required><option value="">Select one</option><option value="under-15">Under $15k/month</option><option value="15-25">$15k-$25k/month</option><option value="25-50">$25k-$50k/month</option><option value="50-plus">$50k+/month</option></select></label>
        <label><span>Time in business</span><select name="time_in_business" required><option value="">Select one</option><option value="under-12">Under 12 months</option><option value="12-24">12-24 months</option><option value="24-plus">24+ months</option></select></label>
        <label><span>Funding amount</span><select name="desired_funding" required><option value="">Select one</option><option value="5-15">$5k-$15k</option><option value="15-35">$15k-$35k</option><option value="35-plus">$35k+</option></select></label>
        <label><span>Existing funding</span><select name="existing_positions" required><option value="">Select one</option><option value="none">No active advance</option><option value="top-tier">One position with a top-tier lender</option><option value="stacked">Multiple active advances</option><option value="unknown">Not sure</option></select></label>
        <label class="form-span"><span>Use of funds</span><textarea name="use_of_funds" rows="4" placeholder="Payroll, inventory, equipment, receivables gap, marketing, repairs..." required></textarea></label>
      </div>
      <label class="consent-line">
        <input type="checkbox" name="consent" value="1" required>
        <span>I understand this is a business funding eligibility review for NJ businesses, not a guarantee of approval or a commitment to fund.</span>
      </label>
      <div class="form-actions">
        <button class="button button-primary" type="submit">Check eligibility <span aria-hidden="true">-&gt;</span></button>
        <p class="form-note">No SSNs, bank logins, or statements are collected on this form.</p>
      </div>
      <div class="eligibility-result" data-forza-result aria-live="polite"></div>
      <div class="static-form-status status-notice" data-form-status hidden aria-live="polite"></div>
    </form>
  `;
}

function aiAuditForm() {
  return `
    <form class="forza-form ai-audit-form" method="post" action="#" data-static="true">
      <input type="hidden" name="lead_type" value="ai_audit">
      <input type="hidden" name="source_page" value="">
      <input type="hidden" name="utm_source" value="">
      <input type="hidden" name="utm_medium" value="">
      <input type="hidden" name="utm_campaign" value="">
      <input type="hidden" name="utm_content" value="">
      <input type="hidden" name="utm_term" value="">
      <div class="form-grid">
        <label><span>Business name</span><input type="text" name="business_name" required></label>
        <label><span>Contact name</span><input type="text" name="contact_name" required></label>
        <label><span>Business email</span><input type="email" name="email" required></label>
        <label><span>Phone number</span><input type="tel" name="phone" required></label>
        <label><span>Workflow to review</span><select name="workflow_area" required><option value="">Select one</option><option>Lead capture and follow-up</option><option>Scheduling and dispatch</option><option>Invoicing and collections</option><option>Reporting and admin</option><option>Customer support</option><option>Not sure yet</option></select></label>
        <label><span>Current tools</span><input type="text" name="current_tools" placeholder="CRM, phone system, spreadsheet, POS..."></label>
        <label class="form-span"><span>Where work feels manual</span><textarea name="bottleneck" rows="5" required></textarea></label>
      </div>
      <label class="consent-line">
        <input type="checkbox" name="consent" value="1" required>
        <span>I understand the AI Automation Audit is a separate consulting inquiry and is not required for funding eligibility.</span>
      </label>
      <div class="form-actions">
        <button class="button button-primary" type="submit">Request audit review <span aria-hidden="true">-&gt;</span></button>
      </div>
      <div class="static-form-status status-notice" data-form-status hidden aria-live="polite"></div>
    </form>
  `;
}

function resourceForm() {
  return `
    <form class="forza-form resource-form" method="post" action="#" data-static="true">
      <input type="hidden" name="lead_type" value="nj_funding_readiness_checklist">
      <input type="hidden" name="source_page" value="">
      <input type="hidden" name="utm_source" value="">
      <input type="hidden" name="utm_medium" value="">
      <input type="hidden" name="utm_campaign" value="">
      <input type="hidden" name="utm_content" value="">
      <input type="hidden" name="utm_term" value="">
      <div class="form-grid">
        <label><span>Business name</span><input type="text" name="business_name" required></label>
        <label><span>Contact name</span><input type="text" name="contact_name" required></label>
        <label><span>Business email</span><input type="email" name="email" required></label>
        <label><span>Business location</span><select name="business_state" required><option value="">Select one</option><option value="NJ">New Jersey</option><option value="other">Outside New Jersey</option></select></label>
        <label><span>Monthly gross revenue</span><select name="monthly_revenue" required><option value="">Select one</option><option value="under-15">Under $15k/month</option><option value="15-25">$15k-$25k/month</option><option value="25-50">$25k-$50k/month</option><option value="50-plus">$50k+/month</option></select></label>
        <label><span>Time in business</span><select name="time_in_business" required><option value="">Select one</option><option value="under-12">Under 12 months</option><option value="12-24">12-24 months</option><option value="24-plus">24+ months</option></select></label>
      </div>
      <label class="consent-line">
        <input type="checkbox" name="consent" value="1" required>
        <span>I understand this resource is educational only and does not guarantee funding approval or create a commitment to fund.</span>
      </label>
      <div class="form-actions">
        <button class="button button-primary" type="submit">Get the checklist <span aria-hidden="true">-&gt;</span></button>
      </div>
      <div class="static-form-status status-notice" data-form-status hidden aria-live="polite"></div>
    </form>
  `;
}

function investorOverviewForm() {
  return `
    <form class="forza-form investor-form" method="post" action="#" data-static="true">
      <input type="hidden" name="lead_type" value="investor_overview_request">
      <input type="hidden" name="source_page" value="">
      <input type="hidden" name="utm_source" value="">
      <input type="hidden" name="utm_medium" value="">
      <input type="hidden" name="utm_campaign" value="">
      <input type="hidden" name="utm_content" value="">
      <input type="hidden" name="utm_term" value="">
      <div class="form-grid">
        <label><span>Name</span><input type="text" name="contact_name" required></label>
        <label><span>Email</span><input type="email" name="email" required></label>
        <label><span>Investor profile</span><select name="investor_profile" required><option value="">Select one</option><option value="individual">Individual investor</option><option value="business-owner">Business owner / operator</option><option value="real-estate">Real estate / private credit investor</option><option value="family-office">Family office / investment entity</option><option value="advisor">CPA / attorney / advisor</option><option value="other">Other</option></select></label>
        <label><span>Location</span><input type="text" name="investor_location" placeholder="City, state" required></label>
        <label><span>Conversation type</span><select name="conversation_type" required><option value="">Select one</option><option value="overview">Investor overview</option><option value="operator">Strategic operator conversation</option><option value="advisor">Advisor / referral conversation</option></select></label>
        <label><span>Accredited investor status</span><select name="accredited_status" required><option value="">Select one</option><option value="yes">I believe I am accredited</option><option value="entity">I represent an investment entity</option><option value="not-sure">Not sure yet</option></select></label>
        <label class="form-span"><span>What interests you?</span><textarea name="investor_interest" rows="4" placeholder="Private credit, SMB cash-flow gaps, NJ business funding, operator experience..." required></textarea></label>
      </div>
      <label class="consent-line">
        <input type="checkbox" name="consent" value="1" required>
        <span>I understand this is a request for information only, not an offer to sell securities or a solicitation to buy securities.</span>
      </label>
      <div class="form-actions">
        <button class="button button-primary" type="submit">Request investor overview <span aria-hidden="true">-&gt;</span></button>
      </div>
      <div class="static-form-status status-notice" data-form-status hidden aria-live="polite"></div>
    </form>
  `;
}

function hubspotShell(kind, fallbackHtml) {
  const ids = {
    funding: "hubspot-funding-form",
    audit: "hubspot-audit-form",
    resource: "hubspot-resource-form",
    investor: "hubspot-investor-form"
  };
  const id = ids[kind] || "hubspot-form";
  return `
    <div class="hubspot-form-shell" data-hubspot-form-shell="${kind}">
      <div id="${id}" class="hubspot-render-target" data-hubspot-target></div>
      <div class="hubspot-fallback" data-hubspot-fallback>${fallbackHtml}</div>
    </div>
  `;
}

function articleCard(article) {
  return `
    <article class="post-card">
      <p class="eyebrow">${escapeHtml(article.category || "Insights")}</p>
      <h2><a href="${article.route}">${escapeHtml(article.title)}</a></h2>
      <p>${escapeHtml(article.summary)}</p>
      <a class="text-link" href="${article.route}">Read article <span aria-hidden="true">-&gt;</span></a>
    </article>
  `;
}

function homePage(articles) {
  return layout({
    title: `${SITE_NAME} | NJ Business Funding`,
    description: "NJ-only business receivables purchase funding and separate AI Automation Audit consulting.",
    pathname: "/",
    activePath: "/",
    body: `
      <section class="hero" id="funding">
        <div class="container hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">New Jersey business funding</p>
            <h1>Working capital backed by your receivables.</h1>
            <p class="lede">${SITE_NAME} helps eligible New Jersey businesses access revenue-based funding through a future receivables purchase.</p>
            <div class="hero-points" aria-label="Funding highlights">
              <span>Receivables-based review</span>
              <span>$5k-$15k pilot offers</span>
              <span>AI consulting sold separately</span>
            </div>
            <div class="button-row">
              <a class="button button-primary" href="/eligibility/">Check eligibility <span aria-hidden="true">-&gt;</span></a>
              <a class="button button-secondary" href="/how-it-works/">How it works</a>
            </div>
            <p class="fine-print">Eligibility check is not approval or a commitment to fund. No sensitive documents are collected on the public form.</p>
          </div>
          <div class="hero-media">
            <img src="${HERO_IMAGE}" alt="Small business operations desk with tablet, invoices, and payment terminal">
            <div class="rate-card">
              <span>Example starting structure</span>
              <strong>1.50 factor</strong>
              <small>Eligible 30-day discount may reduce total purchased amount to 1.10x.</small>
            </div>
          </div>
        </div>
        <div class="container trust-strip">
          <div><strong>NJ focused</strong><span>Statewide pilot for New Jersey businesses.</span></div>
          <div><strong>Business only</strong><span>Receivables purchase, not consumer lending.</span></div>
          <div><strong>Disclosure-ready</strong><span>Examples and terms designed for review.</span></div>
          <div><strong>No COJ</strong><span>No confession-of-judgment posture.</span></div>
        </div>
      </section>

      <section class="section" id="eligibility">
        <div class="container two-column">
          <div class="section-copy">
            <p class="eyebrow">Eligibility snapshot</p>
            <h2>Built for service businesses with real receivables.</h2>
            <p>FORZA's first pilot is intentionally narrow: small advances, NJ-only geography, and businesses with enough operating history to review cash flow responsibly.</p>
            <ul class="check-list">
              <li>Based in New Jersey</li>
              <li>12+ months in business</li>
              <li>$15k+ monthly gross revenue</li>
              <li>Seeking $5k-$15k for business use</li>
              <li>First position preferred; second position reviewed carefully</li>
            </ul>
          </div>
          <div class="form-card">
            <h2>Check eligibility</h2>
            <p>Tell us the basics. A human review comes before any document request or offer.</p>
            ${hubspotShell("funding", prequalForm())}
          </div>
        </div>
      </section>

      <section class="section pricing-section" id="pricing">
        <div class="container pricing-grid">
          <div class="pricing-panel">
            <p class="eyebrow">Transparent example</p>
            <h2>See the factor-rate math before a call.</h2>
            <p>Use the calculator to understand purchased receivables at a starting 1.50 factor rate and the potential 30-day discount structure.</p>
            <div class="calculator" data-forza-calculator>
              <label><span>Advance amount</span><input type="range" min="5000" max="15000" step="1000" value="10000" data-advance-range></label>
              <label><span>Factor rate</span><input type="range" min="1.50" max="1.80" step="0.05" value="1.50" data-factor-range></label>
            </div>
            <p class="fine-print">Example only. Final terms depend on receivables, risk profile, existing positions, and signed agreement.</p>
          </div>
          <div class="math-card" data-calculator-output>
            <div><span>Advance</span><strong data-advance-output>$10,000</strong></div>
            <div><span>Factor rate</span><strong data-factor-output>1.50</strong></div>
            <div><span>Purchased amount</span><strong data-payback-output>$15,000</strong></div>
            <div><span>Potential 30-day discount amount</span><strong data-discount-output>$11,000</strong></div>
            <div class="highlight"><span>Potential discount savings</span><strong data-savings-output>$4,000</strong></div>
          </div>
        </div>
      </section>

      <section class="section muted" id="process">
        <div class="container process-grid">
          <div class="section-copy">
            <p class="eyebrow">How it works</p>
            <h2>A manual process, not an instant promise.</h2>
          </div>
          <ol class="steps">
            <li><strong>Pre-qualify</strong><span>Submit business basics without sensitive documents.</span></li>
            <li><strong>Review</strong><span>FORZA checks revenue, balances, existing positions, liens, and business fit.</span></li>
            <li><strong>Offer</strong><span>Eligible merchants receive counsel-reviewed terms and examples.</span></li>
            <li><strong>Service</strong><span>Remittance starts with revenue percentage or weekly ACH with reconciliation.</span></li>
          </ol>
        </div>
      </section>

      <section class="section ai-band" id="ai-audit">
        <div class="container ai-grid">
          <div>
            <p class="eyebrow">Separate business line</p>
            <h2>AI Automation Audit</h2>
            <p>Map repetitive work, call handling, follow-up, reporting, invoices, and scheduling into practical automation opportunities.</p>
            <ul class="check-list compact">
              <li>Workflow and tool review</li>
              <li>AI opportunity map</li>
              <li>Prioritized implementation recommendations</li>
            </ul>
          </div>
          <div class="ai-actions">
            <a class="button button-secondary" href="/ai-automation-audit/">Learn about the audit <span aria-hidden="true">-&gt;</span></a>
            <p class="fine-print">Funding customers are not required to buy consulting.</p>
          </div>
        </div>
      </section>

      <section class="section muted lead-paths">
        <div class="container section-heading-row">
          <div>
            <p class="eyebrow">Lead paths</p>
            <h2>Built for local search and campaign traffic.</h2>
          </div>
          <a class="text-link" href="/nj-business-funding/">View NJ funding hub <span aria-hidden="true">-&gt;</span></a>
        </div>
        <div class="container post-grid wide">
          <article class="post-card">
            <p class="eyebrow">Local SEO</p>
            <h2><a href="/nj-business-funding/">New Jersey business funding hub</a></h2>
            <p>A statewide landing page for funding-intent searches and broad NJ campaign traffic.</p>
          </article>
          <article class="post-card">
            <p class="eyebrow">Lead magnet</p>
            <h2><a href="/resources/nj-funding-readiness-checklist/">NJ Funding Readiness Checklist</a></h2>
            <p>A low-friction resource for owners who are researching before they are ready for a call.</p>
          </article>
        </div>
      </section>

      <section class="section insights-preview" id="insights">
        <div class="container section-heading-row">
          <div>
            <p class="eyebrow">Insights</p>
            <h2>Weekly NJ funding education.</h2>
          </div>
          <a class="text-link" href="/insights/">View all insights <span aria-hidden="true">-&gt;</span></a>
        </div>
        <div class="container post-grid">
          ${articles.slice(0, 3).map(articleCard).join("")}
        </div>
      </section>
    `
  });
}

function pageHero(eyebrow, title, lede, media = true) {
  if (!media) {
    return `
      <section class="page-hero">
        <div class="container narrow">
          <p class="eyebrow">${eyebrow}</p>
          <h1>${title}</h1>
          <p class="lede">${lede}</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="page-hero">
      <div class="container page-hero-grid">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h1>${title}</h1>
          <p class="lede">${lede}</p>
        </div>
        <div class="page-media">
          <img src="${HERO_IMAGE}" alt="Business desk with receivables documents and tablet">
        </div>
      </div>
    </section>
  `;
}

function industryCards() {
  return industryPages
    .map((page) => `
      <article class="post-card">
        <p class="eyebrow">NJ industry page</p>
        <h2><a href="/industries/${page.slug}/">${escapeHtml(page.label)}</a></h2>
        <p>${escapeHtml(page.description)}</p>
        <a class="text-link" href="/industries/${page.slug}/">Open page <span aria-hidden="true">-&gt;</span></a>
      </article>
    `)
    .join("");
}

function njFundingLanding(articles) {
  return layout({
    title: `New Jersey Business Funding | ${SITE_NAME}`,
    description: "NJ business funding eligibility, industry pages, and revenue-based funding education from FORZA CAPITAL PARTNERS LLC.",
    pathname: "/nj-business-funding/",
    activePath: "/business-funding/",
    body: `
      ${pageHero("NJ business funding", "A local funding funnel for eligible New Jersey businesses.", "This page is built for organic and paid lead generation: local search intent, clear pilot criteria, conservative claims, and a short eligibility form.", true)}
      <section class="section">
        <div class="container two-column align-start">
          <div class="section-copy">
            <p class="eyebrow">Lead fit</p>
            <h2>The best first conversations are specific.</h2>
            <p>FORZA is not trying to capture every business financing lead. The launch funnel is built around NJ service businesses that can explain revenue, use of funds, existing positions, and timing.</p>
            <ul class="check-list">
              <li>NJ business only at launch</li>
              <li>12+ months operating history</li>
              <li>$15k+ monthly gross revenue</li>
              <li>$5k-$15k first funding request</li>
              <li>No sensitive public document upload</li>
            </ul>
            <p class="fine-print">Leads outside the box are routed to manual review or future expansion rather than forced into an offer.</p>
          </div>
          <div class="form-card large">
            <h2>Check eligibility</h2>
            <p>Use the short form for funding basics. A call comes before document requests.</p>
            ${hubspotShell("funding", prequalForm())}
          </div>
        </div>
      </section>
      <section class="section muted">
        <div class="container section-heading-row">
          <div>
            <p class="eyebrow">Organic lead pages</p>
            <h2>Industry pages for high-intent searches.</h2>
          </div>
          <a class="text-link" href="/resources/nj-funding-readiness-checklist/">Get the checklist <span aria-hidden="true">-&gt;</span></a>
        </div>
        <div class="container post-grid wide">${industryCards()}</div>
      </section>
      <section class="section">
        <div class="container post-grid">
          ${articles.slice(0, 3).map(articleCard).join("")}
        </div>
      </section>
    `
  });
}

function industryLandingPage(page) {
  const useCases = page.useCases.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const cautions = page.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return layout({
    title: `${page.label} Funding in NJ | ${SITE_NAME}`,
    description: page.description,
    pathname: `/industries/${page.slug}/`,
    activePath: "/business-funding/",
    body: `
      ${pageHero(page.label, escapeHtml(page.title), escapeHtml(page.intro), true)}
      <section class="section">
        <div class="container two-column align-start">
          <div class="section-copy">
            <p class="eyebrow">Common use cases</p>
            <h2>Funding should have a job to do.</h2>
            <ul class="check-list">${useCases}</ul>
          </div>
          <div class="sidebar-panel">
            <h2>Manual review flags</h2>
            <p>These do not automatically mean decline, but they should slow the process down.</p>
            <ul class="content-list compact">${cautions}</ul>
          </div>
        </div>
      </section>
      <section class="section muted">
        <div class="container two-column align-start">
          <div class="section-copy">
            <p class="eyebrow">Next step</p>
            <h2>Start with a short NJ eligibility check.</h2>
            <p>FORZA reviews business basics first. Bank statements, senior contracts, and other sensitive items should be requested after a call through a secure process.</p>
          </div>
          <div class="form-card large">
            <h2>${escapeHtml(page.label)} eligibility</h2>
            <p>Industry is pre-selected in the fallback form for easier testing.</p>
            ${hubspotShell("funding", prequalForm({ industry: page.formIndustry }))}
          </div>
        </div>
      </section>
    `
  });
}

function resourcesIndex() {
  return layout({
    title: `Resources | ${SITE_NAME}`,
    description: "Lead generation resources for New Jersey business owners evaluating revenue-based funding.",
    pathname: "/resources/",
    activePath: "/insights/",
    body: `
      ${pageHero("Resources", "Practical tools for NJ business funding decisions.", "Use these resources before a funding call to understand whether a receivables-purchase structure may fit.", false)}
      <section class="section">
        <div class="container post-grid">
          <article class="post-card">
            <p class="eyebrow">Checklist</p>
            <h2><a href="/resources/nj-funding-readiness-checklist/">NJ Funding Readiness Checklist</a></h2>
            <p>A short readiness checklist for owners comparing MCA, revenue-based funding, and other options.</p>
            <a class="text-link" href="/resources/nj-funding-readiness-checklist/">Open resource <span aria-hidden="true">-&gt;</span></a>
          </article>
        </div>
      </section>
    `
  });
}

function checklistPage() {
  return layout({
    title: `NJ Funding Readiness Checklist | ${SITE_NAME}`,
    description: "Download or request the NJ Funding Readiness Checklist from FORZA CAPITAL PARTNERS LLC.",
    pathname: "/resources/nj-funding-readiness-checklist/",
    activePath: "/insights/",
    body: `
      ${pageHero("Lead magnet", "NJ Funding Readiness Checklist.", "A simple pre-call checklist for business owners comparing receivables-purchase funding, MCA offers, and other working-capital options.", true)}
      <section class="section">
        <div class="container two-column align-start">
          <div class="section-copy">
            <p class="eyebrow">What it covers</p>
            <h2>Know what to gather before a funding conversation.</h2>
            <ul class="check-list">
              <li>Revenue and deposit review basics</li>
              <li>Questions to ask about factor rates and fees</li>
              <li>How to think about existing advances</li>
              <li>Reconciliation questions to raise before signing</li>
              <li>Red flags that suggest waiting or using another option</li>
            </ul>
            <p class="fine-print">This resource is educational only. It is not approval, legal advice, financial advice, or a commitment to fund.</p>
          </div>
          <div class="form-card large">
            <h2>Get the checklist</h2>
            <p>Use this form for the resource. Funding review still starts with the eligibility form.</p>
            ${hubspotShell("resource", resourceForm())}
          </div>
        </div>
      </section>
    `
  });
}

function investorOverviewPage() {
  return layout({
    title: `Investor Overview | ${SITE_NAME}`,
    description: "Request a private investor overview for FORZA CAPITAL PARTNERS LLC. Information-only page; not a securities offer.",
    pathname: "/investor-overview/",
    activePath: "/about/",
    body: `
      ${pageHero("Private investor conversations", "Cash-flow timing behind real business orders.", "New Jersey businesses can win contracts, purchase orders, and service work before the revenue arrives. FORZA is building a disciplined, technology-assisted receivables funding platform for that gap.", true)}
      <section class="section">
        <div class="container two-column align-start">
          <div class="section-copy">
            <p class="eyebrow">Investor thesis</p>
            <h2>Merchants need capital before receivables turn into cash.</h2>
            <p>FORZA's edge is a private operating workflow for lead intake, file packaging, underwriting memos, risk flags, offer math, and servicing discipline. The Deal Desk itself stays private.</p>
            <ul class="check-list">
              <li>Merchant demand from contract and order timing gaps</li>
              <li>Small pilot sizes before larger capital deployment</li>
              <li>Human-reviewed, technology-assisted underwriting</li>
              <li>Compliance-aware document and disclosure process</li>
              <li>Investor reporting designed around portfolio discipline</li>
            </ul>
            <p class="fine-print">This page is for preliminary information requests only. It is not an offer to sell securities or a solicitation to buy securities. Any investment discussion would require appropriate legal documents, investor qualification, and counsel-approved process.</p>
          </div>
          <div class="form-card large">
            <h2>Request investor overview</h2>
            <p>Start a private conversation. No returns, terms, or offering details are provided through this public page.</p>
            ${hubspotShell("investor", investorOverviewForm())}
          </div>
        </div>
      </section>
      <section class="section muted">
        <div class="container three-grid">
          <article class="info-card"><h2>Problem</h2><p>Businesses can win orders and contracts but still lack working capital to fulfill labor, inventory, materials, or timing gaps.</p></article>
          <article class="info-card"><h2>Approach</h2><p>FORZA reviews merchant basics, receivables, cash-flow signals, existing positions, and use of funds before any offer discussion.</p></article>
          <article class="info-card"><h2>Discipline</h2><p>The platform is designed around small pilot deals, red-flag review, reconciliation awareness, and counsel-reviewed documents.</p></article>
        </div>
      </section>
    `
  });
}

function buildPages(articles) {
  const articleCards = articles.map(articleCard).join("");

  routeFile("/", homePage(articles));
  routeFile("/nj-business-funding/", njFundingLanding(articles));
  routeFile("/resources/", resourcesIndex());
  routeFile("/resources/nj-funding-readiness-checklist/", checklistPage());
  routeFile("/investor-overview/", investorOverviewPage());

  for (const page of industryPages) {
    routeFile(`/industries/${page.slug}/`, industryLandingPage(page));
  }

  routeFile("/business-funding/", layout({
    title: `Business Funding | ${SITE_NAME}`,
    description: "Revenue-based business funding for eligible New Jersey businesses.",
    pathname: "/business-funding/",
    body: `
      ${pageHero("Business funding", "Revenue-based funding for eligible NJ businesses.", "FORZA purchases a portion of future receivables from qualified New Jersey businesses. The structure is built for business cash flow, not consumer lending.")}
      <section class="section">
        <div class="container three-grid">
          <article class="info-card"><h2>Who it is for</h2><p>NJ service businesses with 12+ months operating history, $15k+ monthly gross revenue, and a business use for $5k-$15k in working capital.</p></article>
          <article class="info-card"><h2>How offers start</h2><p>Base offers may start at a 1.50 factor rate, with terms depending on receivables, balances, existing positions, risk profile, and final agreement.</p></article>
          <article class="info-card"><h2>How remittance works</h2><p>FORZA prioritizes revenue-percentage remittance, then weekly ACH with reconciliation, and uses daily fixed ACH only where risk warrants it.</p></article>
        </div>
      </section>
      <section class="section muted">
        <div class="container two-column">
          <div><p class="eyebrow">Position policy</p><h2>First position preferred. Second position reviewed carefully.</h2><p>FORZA prefers to be first position. Second-position files may be reviewed only when the senior lender is top-tier and cash flow supports both obligations.</p></div>
          <div><p class="eyebrow">Contract posture</p><h2>Performance guaranty, no confession of judgment.</h2><p>The intended security posture is focused on truthful reporting, cooperation, and performance obligations, with no confession-of-judgment approach.</p></div>
        </div>
      </section>
    `
  }));

  routeFile("/eligibility/", layout({
    title: `Check Eligibility | ${SITE_NAME}`,
    description: "Check basic eligibility for the FORZA New Jersey funding pilot.",
    pathname: "/eligibility/",
    body: `
      ${pageHero("Eligibility", "Check whether your NJ business fits the pilot.", "The public form asks for business basics only. Sensitive documents are requested only after a call through a secure process.", false)}
      <section class="section">
        <div class="container two-column align-start">
          <div class="section-copy">
            <p class="eyebrow">Pilot box</p>
            <h2>Current launch criteria.</h2>
            <ul class="check-list">
              <li>New Jersey business location</li>
              <li>12+ months in business</li>
              <li>$15k+ monthly gross revenue</li>
              <li>$5k-$15k first funding request</li>
              <li>Business-purpose use of funds</li>
              <li>First position preferred</li>
            </ul>
          </div>
          <div class="form-card large">
            <h2>Short pre-qual form</h2>
            <p>A human review comes before any offer, document request, or funding decision.</p>
            ${hubspotShell("funding", prequalForm())}
          </div>
        </div>
      </section>
    `
  }));

  routeFile("/how-it-works/", layout({
    title: `How It Works | ${SITE_NAME}`,
    description: "FORZA funding flow from eligibility review through underwriting, offer, funding, and servicing.",
    pathname: "/how-it-works/",
    body: `
      ${pageHero("How it works", "From eligibility to servicing, every file gets human review.", "FORZA is designed as a narrow NJ pilot with manual underwriting, counsel-reviewed offer language, and no sensitive document collection on the public site.", false)}
      <section class="section">
        <div class="container">
          <ol class="timeline">
            <article><span>01</span><h2>Eligibility form</h2><p>The lead shares business basics: location, revenue band, time in business, desired funding, existing positions, and use of funds.</p></article>
            <article><span>02</span><h2>Funding call</h2><p>FORZA confirms fit, explains that eligibility is not approval, and outlines documents needed through a secure process.</p></article>
            <article><span>03</span><h2>Manual underwriting</h2><p>Review covers revenue, balances, negative days, NSFs, current positions, entity status, liens, owner identity, and use of funds.</p></article>
            <article><span>04</span><h2>Offer and disclosure</h2><p>Eligible merchants receive written terms and factor-rate math subject to counsel-reviewed documentation.</p></article>
            <article><span>05</span><h2>Funding and servicing</h2><p>Remittance starts with revenue percentage or weekly ACH with real reconciliation. Daily fixed ACH is reserved for higher-risk files.</p></article>
          </ol>
        </div>
      </section>
    `
  }));

  routeFile("/ai-automation-audit/", layout({
    title: `AI Automation Audit | ${SITE_NAME}`,
    description: "Separate AI consulting audit for service business workflows, follow-up, reporting, scheduling, and admin automation.",
    pathname: "/ai-automation-audit/",
    body: `
      ${pageHero("AI Automation Audit", "Find the repetitive work slowing your business down.", "The audit is a separate consulting offer that maps workflows, tools, handoffs, and practical AI opportunities for service businesses.")}
      <section class="section">
        <div class="container two-column align-start">
          <div class="section-copy">
            <p class="eyebrow">Audit output</p>
            <h2>A practical map, not a vague AI pitch.</h2>
            <ul class="check-list">
              <li>Workflow and tool inventory</li>
              <li>Lead capture, follow-up, scheduling, invoicing, and reporting review</li>
              <li>Automation opportunity map by effort and ROI</li>
              <li>Prioritized recommendations for implementation</li>
              <li>Optional implementation scope after the audit</li>
            </ul>
            <p class="fine-print">AI consulting is not required for funding eligibility and does not change funding review, terms, or obligations.</p>
          </div>
          <div class="form-card large">
            <h2>Request an audit review</h2>
            <p>Tell FORZA where operations feel manual, slow, or easy to miss.</p>
            ${hubspotShell("audit", aiAuditForm())}
          </div>
        </div>
      </section>
    `
  }));

  routeFile("/insights/", layout({
    title: `Insights | ${SITE_NAME}`,
    description: "Educational articles for New Jersey business owners comparing MCA, revenue-based funding, factor rates, and reconciliation.",
    pathname: "/insights/",
    body: `
      ${pageHero("Insights", "Plain-English funding education for NJ owners.", "Weekly content will build organic search authority while keeping product claims conservative and clear.", false)}
      <section class="section">
        <div class="container post-grid wide">${articleCards}</div>
      </section>
    `
  }));

  routeFile("/about/", layout({
    title: `About | ${SITE_NAME}`,
    description: "About FORZA CAPITAL PARTNERS LLC and the NJ-only launch posture.",
    pathname: "/about/",
    body: `
      ${pageHero("About", "A narrow, NJ-only funding pilot with separate AI consulting.", "FORZA CAPITAL PARTNERS LLC was filed in New Jersey on January 10, 2026, under entity ID 0451396744.", false)}
      <section class="section">
        <div class="container two-column align-start">
          <div class="prose">
            <h2>Launch posture</h2>
            <p>FORZA is being built to fund from owner capital first, review each merchant manually, and keep contract and servicing language in front of counsel before any deal is funded.</p>
            <h2>Scope</h2>
            <p>The first funding box is intentionally small: New Jersey businesses, 12+ months operating history, $15k+ monthly gross revenue, and first funding requests of $5k-$15k.</p>
          </div>
          <aside class="sidebar-panel">
            <h2>Operating principles</h2>
            <ul class="check-list compact">
              <li>Business funding only</li>
              <li>No consumer loan positioning</li>
              <li>No public sensitive document upload</li>
              <li>No confession-of-judgment posture</li>
              <li>AI consulting sold separately</li>
            </ul>
          </aside>
        </div>
      </section>
    `
  }));

  routeFile("/contact/", layout({
    title: `Contact | ${SITE_NAME}`,
    description: "Contact FORZA for NJ business funding eligibility or an AI Automation Audit.",
    pathname: "/contact/",
    body: `
      ${pageHero("Contact", "Start with the right inquiry.", "Funding eligibility and AI Automation Audit requests use separate forms so consulting is never bundled into funding.", false)}
      <section class="section">
        <div class="container two-column align-start">
          <div class="form-card large">
            <h2>Funding eligibility</h2>
            <p>Use the short funding form for NJ business receivables-purchase review.</p>
            ${hubspotShell("funding", prequalForm())}
          </div>
          <div class="form-card large">
            <h2>AI Automation Audit</h2>
            <p>Use the audit form for consulting only.</p>
            ${hubspotShell("audit", aiAuditForm())}
          </div>
        </div>
      </section>
    `
  }));

  routeFile("/privacy/", layout({
    title: `Privacy Policy | ${SITE_NAME}`,
    description: "Privacy policy starter for FORZA CAPITAL PARTNERS LLC. Counsel review required before public launch.",
    pathname: "/privacy/",
    body: `
      ${pageHero("Privacy Policy", "Privacy language for staging review.", "This page is a starter policy and should be reviewed by counsel before indexing or lead generation begins.", false)}
      <section class="section"><div class="container prose">
        <h2>Information collected</h2>
        <p>The website is designed to collect business contact information and basic eligibility details only. It should not collect SSNs, bank logins, bank statements, contracts, tax documents, or other sensitive files through public forms.</p>
        <h2>How information is used</h2>
        <p>Information may be used to review funding eligibility, respond to AI Automation Audit inquiries, schedule calls, maintain CRM records, and improve website performance.</p>
        <h2>Third-party tools</h2>
        <p>The launch stack may use Cloudflare Pages for hosting, HubSpot for CRM/forms, Google Workspace for email, Google Search Console, analytics tools, and Meta advertising pixels only after approval.</p>
        <h2>Security</h2>
        <p>Sensitive documents should be requested after a call through a secure process, not through public website forms. Access should be limited to business need.</p>
        <h2>Counsel review</h2>
        <p>This page is not legal advice. Privacy, consent, retention, tracking, and disclosure language should be reviewed before launch.</p>
      </div></section>
    `
  }));

  routeFile("/terms/", layout({
    title: `Terms of Use | ${SITE_NAME}`,
    description: "Terms of use starter for FORZA CAPITAL PARTNERS LLC. Counsel review required before public launch.",
    pathname: "/terms/",
    body: `
      ${pageHero("Terms of Use", "Website terms for staging review.", "These terms are a starter draft for counsel review before public launch.", false)}
      <section class="section"><div class="container prose">
        <h2>Business use only</h2>
        <p>This website is intended for business users. FORZA does not offer consumer loans or personal-purpose financing through this site.</p>
        <h2>No guarantee or commitment</h2>
        <p>Submitting a form does not guarantee approval, create a funding commitment, or obligate FORZA to make an offer.</p>
        <h2>Educational content</h2>
        <p>Articles and examples are educational only and are not legal, tax, accounting, or financial advice.</p>
        <h2>Example terms</h2>
        <p>Factor-rate examples and discount examples are illustrative. Final terms depend on underwriting, verification, documentation, and signed agreements.</p>
        <h2>Counsel review</h2>
        <p>These terms should be reviewed and customized by qualified counsel before launch.</p>
      </div></section>
    `
  }));

  routeFile("/disclosures/", layout({
    title: `Disclosures | ${SITE_NAME}`,
    description: "Important business funding disclosures for FORZA CAPITAL PARTNERS LLC.",
    pathname: "/disclosures/",
    body: `
      ${pageHero("Disclosures", "Important funding disclosures.", "This page should be reviewed by counsel before launch and updated as New Jersey commercial financing rules evolve.", false)}
      <section class="section"><div class="container prose">
        <h2>Business funding only</h2>
        <p>${SITE_NAME} is planning business receivables purchase funding for New Jersey businesses. The website does not offer consumer loans or personal-purpose financing.</p>
        <h2>Eligibility is not approval</h2>
        <p>Submitting an eligibility form does not guarantee approval, create a funding commitment, or obligate FORZA to make an offer. Final terms depend on underwriting, documentation, verification, and signed agreements.</p>
        <h2>Receivables purchase positioning</h2>
        <p>FORZA's intended funding product is a purchase of future business receivables. Public copy may reference merchant cash advance or MCA for education and search visibility, but final agreements should preserve the actual receivables-purchase structure.</p>
        <h2>Factor-rate examples</h2>
        <p>Example pricing may show a starting 1.50 factor rate and an eligible 30-day discount to a 1.10 total purchased amount. Examples are illustrative and are not promises of availability, approval, total cost, or repayment timing.</p>
        <h2>Reconciliation</h2>
        <p>Revenue-based funding should include a clear reconciliation process so remittance can be reviewed against actual business revenue when required by the agreement.</p>
        <h2>No confession of judgment</h2>
        <p>The planned contract posture avoids confession-of-judgment provisions. New Jersey restricts confession-of-judgment provisions in business financing contracts, including cash advances.</p>
        <h2>Counsel review required</h2>
        <p>Contracts, disclosures, advertisements, privacy language, servicing processes, and collection practices should be reviewed by qualified counsel before FORZA funds any deal.</p>
      </div></section>
    `
  }));

  for (const article of articles) {
    routeFile(article.route, layout({
      title: article.meta_title || `${article.title} | FORZA`,
      description: article.meta_description,
      pathname: article.route,
      activePath: "/insights/",
      body: `
        ${pageHero(article.category || "Insights", escapeHtml(article.title), escapeHtml(article.meta_description || ""), false)}
        <section class="section">
          <article class="container prose article-body">
            ${article.html}
            <hr>
            <p><strong>${escapeHtml(article.cta || "Check eligibility.")}</strong></p>
            <p><a class="button button-primary" href="/eligibility/">Check eligibility <span aria-hidden="true">-&gt;</span></a></p>
          </article>
        </section>
      `
    }));
  }
}

function buildAssets() {
  ensureDir(path.join(OUT, "assets", "css"));
  ensureDir(path.join(OUT, "assets", "js"));
  ensureDir(path.join(OUT, "assets", "images"));

  fs.copyFileSync(
    path.join(THEME, "assets", "images", "forza-operations-hero.png"),
    path.join(OUT, "assets", "images", "forza-operations-hero.png")
  );

  writeFile("assets/images/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#173d2d"/><path d="M32 8 54 21 32 34 10 21 32 8Z" fill="#b38a3c"/><path d="M19 28h28L32 56h-9l11-19H19v-9Z" fill="#fff"/></svg>`);

  const baseCss = fs.readFileSync(path.join(THEME, "assets", "css", "main.css"), "utf8");
  writeFile("assets/css/main.css", `${baseCss}

.primary-nav a[aria-current="page"] {
  color: var(--green);
}

.hubspot-render-target {
  display: none;
}

.hubspot-form-shell.is-live .hubspot-render-target {
  display: block;
}

.hubspot-form-shell.is-live .hubspot-fallback {
  display: none;
}

.static-form-status[hidden] {
  display: none;
}

.timeline {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.article-body .button {
  margin-top: 8px;
}

.article-body table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.article-body th,
.article-body td {
  padding: 13px 14px;
  border: 1px solid var(--line);
  text-align: left;
}

.article-body th {
  background: var(--soft);
  color: var(--ink);
}

.table-scroll {
  overflow-x: auto;
  margin: 22px 0;
}

.site-generated-note {
  margin-top: 16px;
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 1040px) {
  .timeline {
    grid-template-columns: 1fr;
  }
}
`);

  writeFile("assets/js/forza-config.js", `window.FORZA_HUBSPOT = ${JSON.stringify(HUBSPOT, null, 2)};
`);

  writeFile("assets/js/site.js", `(function () {
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
`);

  writeFile("assets/js/hubspot-forms.js", `(function () {
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
`);
}

function buildMetaFiles(articles) {
  const routes = [
    "/",
    "/business-funding/",
    "/nj-business-funding/",
    "/eligibility/",
    "/how-it-works/",
    "/ai-automation-audit/",
    "/insights/",
    "/resources/",
    "/resources/nj-funding-readiness-checklist/",
    "/investor-overview/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/terms/",
    "/disclosures/",
    ...industryPages.map((page) => `/industries/${page.slug}/`),
    ...articles.map((article) => article.route)
  ];

  writeFile("_headers", `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Robots-Tag: noindex, nofollow

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);

  writeFile("_redirects", `/funding /business-funding/ 301
/check-eligibility /eligibility/ 301
/merchant-cash-advance /business-funding/ 301
/mca /business-funding/ 301
/nj-mca /nj-business-funding/ 301
/nj-funding /nj-business-funding/ 301
/apply /eligibility/ 301
/readiness-checklist /resources/nj-funding-readiness-checklist/ 301
/investor /investor-overview/ 301
/investors /investor-overview/ 301
/investor-overview-request /investor-overview/ 301
/contractor-funding /industries/contractor-funding-nj/ 301
/restaurant-funding /industries/restaurant-funding-nj/ 301
/salon-funding /industries/salon-funding-nj/ 301
/auto-repair-funding /industries/auto-repair-funding-nj/ 301
/ai-audit /ai-automation-audit/ 301
`);

  writeFile("robots.txt", `User-agent: *
Disallow: /

# Staging default. After counsel/domain approval, change this to:
# User-agent: *
# Allow: /
# Sitemap: ${SITE_URL}/sitemap.xml
`);

  const urls = routes
    .map((route) => `  <url><loc>${SITE_URL}${route === "/" ? "/" : route}</loc></url>`)
    .join("\n");
  writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

  writeFile("README.md", `# FORZA Static Site

This is the Cloudflare Pages-ready static version of the FORZA CAPITAL PARTNERS LLC website.

## Local Preview

\`\`\`bash
npm run serve:static
\`\`\`

Then open:

\`\`\`text
http://localhost:4173/
\`\`\`

## Build

\`\`\`bash
npm run build:static
\`\`\`

The generated site intentionally blocks indexing by default through \`robots.txt\`, page meta tags, and \`_headers\`.

## HubSpot Forms

Lead capture is disabled until HubSpot IDs are added in:

\`\`\`text
config/forza-site.json
\`\`\`

The config supports \`fundingFormId\`, \`auditFormId\`, \`resourceFormId\`, and \`investorFormId\`. The fallback forms preview the fields and eligibility logic only. They do not send lead data.

## Lead Generation Pages

- \`/nj-business-funding/\` - statewide funding hub for SEO and paid campaigns.
- \`/industries/contractor-funding-nj/\` - contractor and trades page.
- \`/industries/restaurant-funding-nj/\` - restaurant and food service page.
- \`/industries/salon-funding-nj/\` - salon and wellness page.
- \`/industries/auto-repair-funding-nj/\` - auto repair and service-shop page.
- \`/resources/nj-funding-readiness-checklist/\` - lead magnet page.
- \`/investor-overview/\` - private investor conversation request page.

## Before Public Launch

- Replace \`${SITE_URL}\` with the real domain in \`config/forza-site.json\`.
- Add HubSpot portal and form IDs.
- Remove the staging noindex controls only after counsel/content review.
- Submit the final sitemap in Google Search Console.
`);
}

function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  const articles = loadArticles();
  buildAssets();
  buildPages(articles);
  buildMetaFiles(articles);

  console.log(`Built static site in ${path.relative(ROOT, OUT)}`);
}

main();
