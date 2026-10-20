import {cp, mkdir} from 'node:fs/promises';

// Caminhos relativos ao projeto, independentemente da pasta do terminal.
const source = new URL('../frontend/', import.meta.url);
const destination = new URL('../public/', import.meta.url);
await mkdir(destination, {recursive: true});
await cp(source, destination, {recursive: true});
