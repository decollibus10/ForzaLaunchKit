import process from "node:process";

const args = process.argv.slice(2);
const config = {
  baseUrl: process.env.SMOKE_BASE_URL || "http://localhost:8787",
  timeoutMs: Number(process.env.SMOKE_TIMEOUT_MS || 10000),
  retries: Number(process.env.SMOKE_RETRIES || 30),
  writeLead: process.env.SMOKE_WRITE === "1"
};

for (const arg of args) {
  if (arg.startsWith("--base=")) {
    config.baseUrl = arg.slice("--base=".length);
  } else if (arg.startsWith("--timeout=")) {
    config.timeoutMs = Number(arg.slice("--timeout=".length));
  } else if (arg.startsWith("--retries=")) {
    config.retries = Number(arg.slice("--retries=".length));
  } else if (arg === "--write") {
    config.writeLead = true;
  } else if (arg === "--read-only") {
    config.writeLead = false;
  }
}

const routes = [
  {
    path: "/",
    text: ["FORZA ClearMatch", "Create Your Offer Dashboard"]
  },
  {
    path: "/compare",
    text: ["Compare an offer", "cash pressure"]
  },
  {
    path: "/calculator",
    text: ["MCA factor-rate calculator", "cash pressure"]
  },
  {
    path: "/login",
    text: ["magic-link", "Email"]
  },
  {
    path: "/funnels/offer-dashboard-nj",
    text: ["Create a private MCA offer dashboard", "$500/month"]
  },
  {
    path: "/funnels/compare-mca-offers-nj",
    text: ["Compare MCA offers side by side", "before you sign"]
  },
  {
    path: "/funnels/mca-second-opinion-nj",
    text: ["second opinion", "MCA offer"]
  },
  {
    path: "/funnels/factor-rate-calculator-nj",
    text: ["Calculate MCA payback", "cash pressure"]
  }
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function urlFor(path) {
  return new URL(path, config.baseUrl).toString();
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function retry(name, fn) {
  let lastError;
  for (let attempt = 1; attempt <= config.retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === config.retries) {
        break;
      }
      await sleep(Math.min(1000, 100 + attempt * 100));
    }
  }
  throw new Error(`${name} failed after ${config.retries} attempts: ${lastError.message}`);
}

async function checkRoute(route) {
  const target = urlFor(route.path);
  const response = await fetchWithTimeout(target, {
    headers: { Accept: "text/html" }
  });
  const body = await response.text();

  if (response.status !== 200) {
    throw new Error(`${route.path} returned ${response.status}`);
  }

  const missingText = route.text.filter((text) => !body.includes(text));
  if (missingText.length) {
    if (body.includes("404: This page could not be found.")) {
      throw new Error(`${route.path} rendered the Next.js 404 page`);
    }
    throw new Error(`${route.path} missing expected text: ${missingText.join(", ")}`);
  }

  console.log(`OK ${route.path}`);
}

async function checkLeadWrite() {
  const email = `smoke+${Date.now()}@example.com`;
  const response = await fetchWithTimeout(urlFor("/api/leads"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      businessName: "FORZA Smoke Test",
      fullName: "Smoke Test",
      contactConsent: true,
      marketingConsent: false,
      funnel: "smoke_test",
      funnelIntent: "dashboard_account",
      sourcePage: "/smoke-test",
      landingUrl: urlFor("/smoke-test"),
      utmSource: "smoke",
      utmMedium: "test",
      utmCampaign: "smoke_test"
    })
  });

  if (![200, 202].includes(response.status)) {
    throw new Error(`/api/leads returned ${response.status}: ${await response.text()}`);
  }

  const json = await response.json();
  if (!json.id || !json.nextUrl || !String(json.nextUrl).startsWith("/login")) {
    throw new Error(`/api/leads returned an invalid handoff: ${JSON.stringify(json)}`);
  }

  console.log(`OK /api/leads -> ${json.nextUrl}`);
}

console.log(`FORZA smoke test: ${config.baseUrl}`);
console.log(`Lead write: ${config.writeLead ? "enabled" : "disabled"}`);

await retry("route checks", async () => {
  for (const route of routes) {
    await checkRoute(route);
  }
});

if (config.writeLead) {
  await retry("lead write", checkLeadWrite);
}

console.log("Smoke test passed.");
