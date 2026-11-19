import { cp, mkdir, rm } from "node:fs/promises";

const source = new URL("../frontend/", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const assets = new URL("client/", dist);

await rm(dist, { recursive: true, force: true });
await mkdir(assets, { recursive: true });
await cp(source, assets, { recursive: true });

console.log("Artefato estático gerado em dist/client/.");
