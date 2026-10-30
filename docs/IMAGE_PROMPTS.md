# VOLT — Image Generation Prompts

**Product images come from DummyJSON** (transparent 3D cutouts on cdn.dummyjson.com), so you don't need to generate any.
The images below are **optional site art** that adds atmosphere. Save files at the exact paths listed. Until a file exists, the site uses a DummyJSON product cutout on a gradient plate instead.

**Format:** generate PNG/JPG at the listed size, then convert to `.webp` (quality 82). Squoosh or `npx sharp-cli` both work.

---

## 1. Style anchor (paste in front of every prompt below)

> Bold minimal campaign photograph, deep ink navy-black environment (#0B0B12), a soft violet (#7C5CFF) to electric lime (#C6FF3D) gradient glow in the background at low intensity, clean graphic composition with lots of negative space, premium tech lifestyle, no text, no logos, cinematic, sharp.

> **Negative prompt (if your tool supports it):** text, watermark, logo, brand name, letters, extra objects, clutter, hands with extra fingers, blurry, low resolution, plastic toy look, oversaturated neon, cyberpunk city.

---

## 2. Site imagery

| File | Size | Prompt (after the anchor) |
|---|---|---|
| `public/hero/hero-bg.webp` | 2400×1400 | Empty dark studio space with a large soft circular violet glow off-center to the right and a faint lime haze at the bottom, subtle film grain, no objects. |
| `public/categories/audio.webp` | 1600×2000 | Over-ear headphones resting on a stack of dark acoustic foam panels, violet glow behind. |
| `public/categories/wear.webp` | 1600×1000 | Titanium field watch on a dark slate surface, crown catching a lime highlight, macro framing. |
| `public/categories/carry.webp` | 1600×1000 | Black technical backpack with roll-top standing upright, water droplets on the fabric, violet rim light. |
| `public/categories/desk.webp` | 1600×2000 | Minimal dark desk setup from above: low-profile mechanical keyboard, mouse, felt desk mat, small lamp casting a warm-white circle, one lime keycap. |
| `public/categories/kicks.webp` | 2000×1000 | Single white and graphite running sneaker floating mid-air at a dynamic angle, lime outsole, violet glow behind. |
| `public/promo/promo-drop.webp` | 2400×1200 | Three products (earbuds case, watch, sneaker) arranged on stepped dark plinths of different heights, dramatic top light, lime glow at the base. |
| `public/og/og-default.png` | 1200×630 | Over-ear headphones on the right third, large empty dark area on the left for the logo (added later in code). |

---

## 3. Checklist

- [ ] 1 hero background
- [ ] 5 category tiles
- [ ] 1 promo banner
- [ ] 1 Open Graph image

**Total: 8 images, all optional.** The site picks each one up on the next build.
