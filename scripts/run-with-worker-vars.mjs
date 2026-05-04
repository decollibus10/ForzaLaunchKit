import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import process from "node:process";

const WRANGLER_CONFIG = "wrangler.jsonc";
const REQUIRED_PUBLIC_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SITE_URL"
];

function stripJsonComments(input) {
  let output = "";
  let inString = false;
  let quote = "";
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
        output += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === "\"" || char === "'") {
      inString = true;
      quote = char;
      output += char;
      continue;
    }

    if (char === "/" && next === "/") {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    output += char;
  }

  return output;
}

function loadWranglerVars() {
  const raw = readFileSync(WRANGLER_CONFIG, "utf8");
  const parsed = JSON.parse(stripJsonComments(raw).replace(/,\s*([}\]])/g, "$1"));
  return parsed.vars || {};
}

function isLocalUrl(value) {
  return /(^|\b)(localhost|127\.0\.0\.1|0\.0\.0\.0)(\b|:)/i.test(value);
}

function validateProductionVars(vars) {
  const missing = REQUIRED_PUBLIC_VARS.filter((key) => !String(vars[key] || "").trim());
  if (missing.length) {
    throw new Error(`Missing Worker vars in ${WRANGLER_CONFIG}: ${missing.join(", ")}`);
  }

  const supabaseUrl = String(vars.NEXT_PUBLIC_SUPABASE_URL);
  const siteUrl = String(vars.NEXT_PUBLIC_SITE_URL);
  if (!supabaseUrl.startsWith("https://") || isLocalUrl(supabaseUrl)) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be the public Supabase Cloud URL for deploy commands.");
  }
  if (!siteUrl.startsWith("https://") || isLocalUrl(siteUrl)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be the public production URL for deploy commands.");
  }
}

const separatorIndex = process.argv.indexOf("--");
if (separatorIndex === -1 || separatorIndex === process.argv.length - 1) {
  console.error("Usage: node scripts/run-with-worker-vars.mjs -- <command> [args...]");
  process.exit(1);
}

const command = process.argv[separatorIndex + 1];
const commandArgs = process.argv.slice(separatorIndex + 2);

let vars;
try {
  vars = loadWranglerVars();
  validateProductionVars(vars);
} catch (error) {
  console.error(`Worker env check failed: ${error.message}`);
  process.exit(1);
}

const env = { ...process.env, ...vars };
console.log(`Using production Worker vars from ${WRANGLER_CONFIG}: ${Object.keys(vars).join(", ")}`);

const child = spawn(command, commandArgs, {
  env,
  stdio: "inherit",
  shell: process.platform === "win32"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
