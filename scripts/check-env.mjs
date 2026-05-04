import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");

const envFiles = [".env", ".env.local", ".dev.vars"];
const loaded = {};
const loadedFiles = [];

function cleanValue(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadEnvFile(file) {
  if (!existsSync(file)) {
    return;
  }

  loadedFiles.push(file);
  for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const normalized = line.startsWith("export ") ? line.slice(7).trim() : line;
    const equalsIndex = normalized.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = normalized.slice(0, equalsIndex).trim();
    const value = normalized.slice(equalsIndex + 1);
    loaded[key] = cleanValue(value);
  }
}

for (const file of envFiles) {
  loadEnvFile(file);
}

const env = { ...loaded, ...process.env };

const groups = [
  {
    title: "Core launch",
    required: true,
    vars: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SITE_URL"
    ]
  },
  {
    title: "Paid tracking",
    required: false,
    vars: [
      "NEXT_PUBLIC_GTM_ID",
      "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
      "NEXT_PUBLIC_GOOGLE_ADS_ID",
      "NEXT_PUBLIC_GOOGLE_LEAD_CONVERSION_LABEL",
      "NEXT_PUBLIC_GOOGLE_DASHBOARD_START_CONVERSION_LABEL",
      "NEXT_PUBLIC_GOOGLE_CALCULATOR_LEAD_CONVERSION_LABEL",
      "NEXT_PUBLIC_META_PIXEL_ID"
    ]
  },
  {
    title: "Server-only integrations",
    required: false,
    vars: [
      "SUPABASE_SERVICE_ROLE_KEY",
      "META_CAPI_ACCESS_TOKEN",
      "META_CAPI_GRAPH_API_VERSION",
      "META_CAPI_TEST_EVENT_CODE"
    ]
  }
];

function hasValue(key) {
  return Boolean(String(env[key] || "").trim());
}

const missingRequired = [];

console.log("FORZA environment check");
console.log(`Loaded local env files: ${loadedFiles.length ? loadedFiles.join(", ") : "none"}`);
console.log("");

for (const group of groups) {
  console.log(group.title);
  for (const key of group.vars) {
    const present = hasValue(key);
    if (!present && group.required) {
      missingRequired.push(key);
    }
    console.log(`  ${present ? "OK" : group.required ? "MISSING" : "blank"} ${key}`);
  }
  console.log("");
}

const leakedPublicSecrets = Object.keys(env).filter((key) => {
  if (!key.startsWith("NEXT_PUBLIC_")) {
    return false;
  }
  return /SERVICE_ROLE|SECRET|ACCESS_TOKEN|PRIVATE/i.test(key);
});

if (leakedPublicSecrets.length) {
  console.log("Public secret naming risk");
  for (const key of leakedPublicSecrets) {
    console.log(`  MISSING SAFETY: ${key} should not be NEXT_PUBLIC_`);
  }
  console.log("");
}

if (missingRequired.length || leakedPublicSecrets.length) {
  console.log("Result");
  if (missingRequired.length) {
    console.log(`  Missing required launch vars: ${missingRequired.join(", ")}`);
  }
  if (leakedPublicSecrets.length) {
    console.log(`  Unsafe public secret names: ${leakedPublicSecrets.join(", ")}`);
  }
  if (strict) {
    process.exit(1);
  }
  console.log("  Non-strict mode: warnings only.");
} else {
  console.log("Result");
  console.log("  Required launch vars are present and no public secret naming risks were found.");
}
