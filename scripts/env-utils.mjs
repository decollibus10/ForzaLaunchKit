import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const WRANGLER_CONFIG = "wrangler.jsonc";
export const DEFAULT_ENV_FILES = [
  ".env.production.local",
  ".env.local",
  ".env",
  ".dev.vars"
];
export const REQUIRED_PUBLIC_VARS = [
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

export function cleanValue(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function loadEnvFiles(files = DEFAULT_ENV_FILES) {
  const loaded = {};
  const loadedFiles = [];

  for (const file of files) {
    const absolutePath = resolve(file);
    if (!existsSync(absolutePath)) {
      continue;
    }

    loadedFiles.push(file);

    for (const rawLine of readFileSync(absolutePath, "utf8").split(/\r?\n/)) {
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
      loaded[key] = cleanValue(normalized.slice(equalsIndex + 1));
    }
  }

  return { loaded, loadedFiles };
}

export function loadWranglerVars(configPath = WRANGLER_CONFIG) {
  const raw = readFileSync(resolve(configPath), "utf8");
  const parsed = JSON.parse(stripJsonComments(raw).replace(/,\s*([}\]])/g, "$1"));
  return parsed.vars || {};
}

export function resolveWorkerVars(options = {}) {
  const envFiles = options.envFiles || DEFAULT_ENV_FILES;
  const wranglerConfig = options.wranglerConfig || WRANGLER_CONFIG;
  const extraKeys = options.extraKeys || [];
  const { loaded: envFileVars, loadedFiles } = loadEnvFiles(envFiles);
  const wranglerVars = loadWranglerVars(wranglerConfig);
  const keys = new Set([
    ...Object.keys(wranglerVars),
    ...REQUIRED_PUBLIC_VARS,
    ...extraKeys
  ]);
  const resolved = {};

  for (const key of keys) {
    const value = process.env[key] ?? envFileVars[key] ?? wranglerVars[key];
    if (value !== undefined) {
      resolved[key] = value;
    }
  }

  return {
    vars: resolved,
    loadedFiles,
    wranglerConfig
  };
}

export function isLocalUrl(value) {
  return /(^|\b)(localhost|127\.0\.0\.1|0\.0\.0\.0)(\b|:)/i.test(value);
}

export function isSupabaseCloudUrl(value) {
  try {
    return new URL(value).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export function validateProductionVars(vars) {
  const missing = REQUIRED_PUBLIC_VARS.filter((key) => !String(vars[key] || "").trim());
  if (missing.length) {
    throw new Error(
      `Missing deploy vars: ${missing.join(", ")}. Set them from a self-hosted Supabase instance in .env.production.local or the shell.`
    );
  }

  const supabaseUrl = String(vars.NEXT_PUBLIC_SUPABASE_URL);
  const siteUrl = String(vars.NEXT_PUBLIC_SITE_URL);
  if (!supabaseUrl.startsWith("https://") || isLocalUrl(supabaseUrl)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a public HTTPS URL for the self-hosted Supabase gateway, for example https://supabase.forza-funding.com."
    );
  }
  if (isSupabaseCloudUrl(supabaseUrl)) {
    throw new Error(
      "Supabase Cloud URLs are disabled for deploy commands. Use the local CLI stack for development or a network-reachable self-hosted Supabase gateway for public deploys."
    );
  }
  if (!siteUrl.startsWith("https://") || isLocalUrl(siteUrl)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be the public production URL for deploy commands.");
  }
}
