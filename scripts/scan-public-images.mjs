// Lists the optional generated images that exist in /public, so the app can pick them up
// without touching the file system at runtime (Cloudflare Workers has no disk).
// Runs automatically before dev and build.
import { existsSync, writeFileSync } from "node:fs";

const candidates = [
  "/hero/hero-bg.webp",
  ...["audio", "wear", "carry", "desk", "kicks"].map((c) => `/categories/${c}.webp`),
];
const present = candidates.filter((p) => existsSync(new URL(`../public${p}`, import.meta.url)));
writeFileSync(new URL("../data/local-images.json", import.meta.url), JSON.stringify(present, null, 2) + "\n");
console.log(`[scan-public-images] ${present.length} optional image(s) found`);
