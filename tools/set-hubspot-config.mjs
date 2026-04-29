#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "config", "forza-site.json");

function readArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

const args = readArgs();
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
config.hubspot = {
  portalId: args.portalId ?? process.env.HUBSPOT_PORTAL_ID ?? config.hubspot?.portalId ?? "",
  region: args.region ?? process.env.HUBSPOT_REGION ?? config.hubspot?.region ?? "na1",
  fundingFormId: args.fundingFormId ?? process.env.HUBSPOT_FUNDING_FORM_ID ?? config.hubspot?.fundingFormId ?? "",
  auditFormId: args.auditFormId ?? process.env.HUBSPOT_AI_AUDIT_FORM_ID ?? config.hubspot?.auditFormId ?? "",
  resourceFormId: args.resourceFormId ?? process.env.HUBSPOT_RESOURCE_FORM_ID ?? config.hubspot?.resourceFormId ?? "",
  investorFormId: args.investorFormId ?? process.env.HUBSPOT_INVESTOR_FORM_ID ?? config.hubspot?.investorFormId ?? ""
};

fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Updated ${path.relative(ROOT, CONFIG_PATH)}`);
