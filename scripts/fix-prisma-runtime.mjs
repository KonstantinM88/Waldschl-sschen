import { access, writeFile } from "node:fs/promises";
import path from "node:path";

const runtimeDir = path.join(
  process.cwd(),
  "node_modules",
  "@prisma",
  "client",
  "runtime"
);

await access(path.join(runtimeDir, "client.js"));
await access(path.join(runtimeDir, "client.mjs"));

await Promise.all([
  writeFile(
    path.join(runtimeDir, "library.js"),
    'module.exports = require("./client.js");\n',
    "utf8"
  ),
  writeFile(
    path.join(runtimeDir, "library.mjs"),
    'export * from "./client.mjs";\n',
    "utf8"
  ),
  writeFile(
    path.join(runtimeDir, "library.d.ts"),
    'export * from "./client";\n',
    "utf8"
  ),
  writeFile(
    path.join(runtimeDir, "library.d.mts"),
    'export * from "./client.d.mts";\n',
    "utf8"
  ),
]);
