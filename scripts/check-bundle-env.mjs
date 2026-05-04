import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const roots = [".next", ".open-next"];
const localPatterns = [
  "http://127.0.0.1:58321",
  "http://localhost:58321",
  "http://127.0.0.1:3000"
];
const expectedProductionPatterns = [
  "https://rhofkdvolzgbhoananoi.supabase.co",
  "https://forza-funding.com"
];
const ignoredPathSegments = [
  `${join(".next", "dev")}${"/"}`,
  `${join(".next", "cache")}${"/"}`
];
const textExtensions = new Set([
  ".js",
  ".mjs",
  ".json",
  ".html",
  ".txt",
  ".map",
  ".css"
]);

function extension(path) {
  const index = path.lastIndexOf(".");
  return index === -1 ? "" : path.slice(index);
}

function walk(path, files = []) {
  let stats;
  try {
    stats = statSync(path);
  } catch {
    return files;
  }

  if (stats.isDirectory()) {
    for (const entry of readdirSync(path)) {
      walk(join(path, entry), files);
    }
  } else if (
    stats.isFile() &&
    !ignoredPathSegments.some((segment) => path.includes(segment)) &&
    textExtensions.has(extension(path)) &&
    stats.size <= 5_000_000
  ) {
    files.push(path);
  }

  return files;
}

const files = roots.flatMap((root) => walk(root));
const findings = [];
const foundProductionPatterns = new Set();

for (const file of files) {
  const body = readFileSync(file, "utf8");
  for (const pattern of localPatterns) {
    if (body.includes(pattern)) {
      findings.push(`${file}: contains ${pattern}`);
    }
  }
  for (const pattern of expectedProductionPatterns) {
    if (body.includes(pattern)) {
      foundProductionPatterns.add(pattern);
    }
  }
}

if (findings.length) {
  console.error("Bundle env check failed. Local Supabase/site URLs were found in build output.");
  for (const finding of findings.slice(0, 20)) {
    console.error(`  ${finding}`);
  }
  process.exit(1);
}

const missingExpected = expectedProductionPatterns.filter(
  (pattern) => !foundProductionPatterns.has(pattern)
);

if (missingExpected.length) {
  console.error(
    `Bundle env check failed. Expected production values were not found: ${missingExpected.join(", ")}`
  );
  process.exit(1);
}

console.log("Bundle env check passed: production URLs present, local URLs absent.");
