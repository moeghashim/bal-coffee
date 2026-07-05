// Enforces the commerce isolation boundary: `@shopify/hydrogen` may only be
// imported inside lib/commerce/. This is the mechanical guarantee behind
// "pull upstream Hydrogen updates without breaking the app" (HYDROGEN_MIGRATION.md).
// Run via `pnpm check:boundary` (part of `pnpm test`) and in CI.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const ROOTS = ["app", "components", "lib"];
// Root-level server entrypoints that could reach for Hydrogen directly and
// bypass the boundary (they live outside the scanned ROOTS).
const ROOT_FILES = ["proxy.ts", "middleware.ts"];
const ALLOWED_PREFIX = ["lib", "commerce"].join(sep);
const NEEDLE = "@shopify/hydrogen";
const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) continue;
    if (full.startsWith(ALLOWED_PREFIX)) continue;
    if (readFileSync(full, "utf8").includes(NEEDLE)) violations.push(full);
  }
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    // root may not exist; ignore
  }
}

for (const file of ROOT_FILES) {
  if (existsSync(file) && readFileSync(file, "utf8").includes(NEEDLE)) {
    violations.push(file);
  }
}

if (violations.length > 0) {
  console.error(
    `Import boundary violation: "${NEEDLE}" may only be imported inside ` +
      `${ALLOWED_PREFIX}/. Found in:\n` +
      violations.map((v) => `  ${v}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `Import boundary OK: "${NEEDLE}" is confined to ${ALLOWED_PREFIX}/.`,
);
