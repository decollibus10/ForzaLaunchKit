#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const config = JSON.parse(fs.readFileSync(path.join(ROOT, "config", "forza-site.json"), "utf8"));

const checks = [
  ["static-site exists", fs.existsSync(path.join(ROOT, "static-site", "index.html"))],
  ["noindex meta present", fs.readFileSync(path.join(ROOT, "static-site", "index.html"), "utf8").includes("noindex,nofollow")],
  ["robots blocks staging", fs.readFileSync(path.join(ROOT, "static-site", "robots.txt"), "utf8").includes("Disallow: /")],
  ["headers block staging", fs.readFileSync(path.join(ROOT, "static-site", "_headers"), "utf8").includes("X-Robots-Tag: noindex, nofollow")],
  ["funding landing page exists", fs.existsSync(path.join(ROOT, "static-site", "nj-business-funding", "index.html"))],
  ["checklist page exists", fs.existsSync(path.join(ROOT, "static-site", "resources", "nj-funding-readiness-checklist", "index.html"))],
  ["investor overview page exists", fs.existsSync(path.join(ROOT, "static-site", "investor-overview", "index.html"))],
  ["HubSpot portal configured", Boolean(config.hubspot?.portalId)],
  ["HubSpot funding form configured", Boolean(config.hubspot?.fundingFormId)],
  ["HubSpot audit form configured", Boolean(config.hubspot?.auditFormId)],
  ["HubSpot resource form configured", Boolean(config.hubspot?.resourceFormId)],
  ["HubSpot investor form configured", Boolean(config.hubspot?.investorFormId)]
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "WARN"} ${label}`);
  if (!ok && !label.startsWith("HubSpot")) failed += 1;
}

if (failed > 0) process.exit(1);
