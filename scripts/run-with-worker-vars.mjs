import { spawn } from "node:child_process";
import process from "node:process";
import { resolveWorkerVars, validateProductionVars } from "./env-utils.mjs";

const separatorIndex = process.argv.indexOf("--");
if (separatorIndex === -1 || separatorIndex === process.argv.length - 1) {
  console.error("Usage: node scripts/run-with-worker-vars.mjs -- <command> [args...]");
  process.exit(1);
}

const command = process.argv[separatorIndex + 1];
const commandArgs = process.argv.slice(separatorIndex + 2);

let resolved;
try {
  resolved = resolveWorkerVars({
    extraKeys: ["META_CAPI_GRAPH_API_VERSION"]
  });
  validateProductionVars(resolved.vars);
} catch (error) {
  console.error(`Worker env check failed: ${error.message}`);
  process.exit(1);
}

const env = {
  ...process.env,
  ...resolved.vars,
  WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH || ".wrangler/logs"
};
const envSources = resolved.loadedFiles.length ? resolved.loadedFiles.join(", ") : "none";
console.log(
  `Using production Worker vars from ${envSources} and ${resolved.wranglerConfig}: ${Object.keys(resolved.vars).join(", ")}`
);

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
