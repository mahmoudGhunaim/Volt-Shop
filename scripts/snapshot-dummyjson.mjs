// Saves the DummyJSON products VOLT uses into data/dummyjson-snapshot.json.
// The app reads the live API and falls back to this file when the API is unreachable.
// Run: node scripts/snapshot-dummyjson.mjs
import { writeFile } from "node:fs/promises";

const ids = [101, 100, 107, 103, 99, 106, 94, 98, 190, 93, 194, 175, 173, 176, 172, 174, 78, 79, 159, 102, 105, 88, 90, 91];
const res = await fetch("https://dummyjson.com/products?limit=0");
if (!res.ok) throw new Error(`DummyJSON responded ${res.status}`);
const { products } = await res.json();
const picked = ids.map((id) => {
  const p = products.find((x) => x.id === id);
  if (!p) throw new Error(`Product ${id} missing from DummyJSON`);
  return p;
});
await writeFile(new URL("../data/dummyjson-snapshot.json", import.meta.url), JSON.stringify({ products: picked }, null, 2) + "\n");
console.log(`Saved ${picked.length} products`);
