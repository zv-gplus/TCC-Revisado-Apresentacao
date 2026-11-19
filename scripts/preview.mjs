import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const [source, ...options] = process.argv.slice(2);
const wrangler = fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url));
const configHome = fileURLToPath(new URL("../.wrangler/config/", import.meta.url));

// A configuração de produção mantém a data do Worker. A prévia usa uma data aceita pelo workerd local.
const args = ["dev", "--config", "wrangler.jsonc", "--local", "--inspector-port", "0", "--compatibility-date", "2026-05-15"];
if (source === "frontend") args.push("--assets", "./frontend");

// Aceita também os sinalizadores usados pelo comando de inicialização do ambiente.
for (const option of options) {
  if (option === "--strictPort") continue;
  args.push(option === "--host" ? "--ip" : option);
}

const result = spawnSync(process.execPath, [wrangler, ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || configHome,
    WRANGLER_SEND_METRICS: "false",
    WRANGLER_WRITE_LOGS: "false",
  },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
