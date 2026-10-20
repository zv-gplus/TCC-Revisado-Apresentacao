import { cp, mkdir, rm } from "node:fs/promises";

// Caminhos relativos ao projeto, independentemente da pasta do terminal.
const source = new URL("../frontend/", import.meta.url);
const destination = new URL("../public/", import.meta.url);
// public/ é gerada exclusivamente a partir de frontend/.
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
