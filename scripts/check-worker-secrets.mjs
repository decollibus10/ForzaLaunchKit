import { spawnSync } from "node:child_process";
import process from "node:process";

const args = new Set(process.argv.slice(2));
const wranglerEnv = {
  ...process.env,
  WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH || ".wrangler/logs"
};
const requiredSecrets = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
];

if (args.has("--paid")) {
  requiredSecrets.push("META_CAPI_ACCESS_TOKEN");
}

function looksLikeJwt(value) {
  return (
    value.startsWith("eyJ") ||
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
  );
}

function redact(value) {
  if (value.length <= 8) {
    return "[redacted]";
  }
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

if (!String(process.env.CLOUDFLARE_API_TOKEN || "").trim()) {
  console.error(
    "Worker secret check failed. CLOUDFLARE_API_TOKEN is required before Wrangler can validate secret names."
  );
  process.exit(1);
}

const result = spawnSync("npx", ["wrangler", "secret", "list"], {
  env: wranglerEnv,
  encoding: "utf8"
});

if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout);
  process.exit(result.status || 1);
}

let secrets;
try {
  secrets = JSON.parse(result.stdout);
} catch {
  console.error("Unable to parse Wrangler secret list output.");
  process.exit(1);
}

const secretNames = secrets.map((secret) => secret.name);
const jwtNamedSecrets = secretNames.filter(looksLikeJwt);
const missingSecrets = requiredSecrets.filter((name) => !secretNames.includes(name));

if (jwtNamedSecrets.length || missingSecrets.length) {
  console.error("Worker secret check failed.");
  if (jwtNamedSecrets.length) {
    console.error(
      `Secret names that look like key values: ${jwtNamedSecrets.map(redact).join(", ")}`
    );
    console.error("Delete those misnamed secrets and rotate the exposed Supabase service-role key.");
  }
  if (missingSecrets.length) {
    console.error(`Missing required secret names: ${missingSecrets.join(", ")}`);
  }
  process.exit(1);
}

console.log(`Worker secrets OK: ${requiredSecrets.join(", ")}`);
