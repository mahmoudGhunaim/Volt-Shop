# VOLT design system

The visual system as built. Tokens live in `app/globals.css`; brand settings in `config/site.ts`.

## Concept

**Objects on plates, one signal color.** Every product sits on the same ink plate (`--plate`) in both themes, so the catalog reads as one collection. Electric lime means "act here": CTAs, sale badges, live states. Violet handles atmosphere: glows, focus in light mode, links.

## Color (OKLCH)

| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg` | #0B0B12 | #F5F4F0 | Page |
| `--surface` / `--surface-2` | #15151F / #1C1C28 | #FFFFFF / warm grey | Panels, hover fills |
| `--border` | #262633 | #E4E2DC | Hairlines |
| `--fg` | #F5F4F0 | #0B0B12 | Text |
| `--muted` | #9A9AAE (7.1:1) | #6B6B7B (4.75:1) | Secondary text |
| `--lime` | #C6FF3D | #A3E000 | Fill only, ink text on top (16.6:1) |
| `--violet` | #7C5CFF | #7C5CFF | Glows, gradients |
| `--violet-text` | #9D85FF | #5B3FE0 | Links and accents as text |
| `--danger` | #FF5C7A | darker red (5:1) | Errors, low stock |
| `--plate` | #15151F | #15151F | Product stage, both themes |

Rules: lime is never text on light backgrounds. Gradient meshes (`mesh`, `mesh-soft`) stay at low opacity and fade out with a mask so no section ends in a hard edge.

## Typography

- **Display:** Archivo at 125% width, weight 800, echoing the logo's wide squared letters. Letter-spacing −0.02 to −0.035em.
- **Body:** Geist, 16px, line-height 1.6 (1.65 on dark).
- **Arabic:** IBM Plex Sans Arabic for everything, weight 700 for headings, normal tracking.
- **Numerals:** Doto (dot matrix), only in the promo countdown and the card preview.
- **Scale:** `text-display` 2.75→6rem, `text-h1` 2.25→4rem, `text-h2` 1.75→2.75rem, `text-h3` 1.25→1.5rem, all fluid with `clamp()`.

## Shape and space

Radii 4 / 8 / 14 / 20px, pill buttons. Horizontal gutter `clamp(1rem, …, 2.5rem)`, max width 96rem. Layering scale: dropdown 10, sticky 20, header 30, overlay 40, drawer 50, modal 60, toast 70, tooltip 80.

## Motion

Easing `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) everywhere, with no bounce. Durations: 120ms press, 200ms hover, 320–420ms drawers, 500ms page transitions (client navigations only). Buttons scale to 0.96 on press; primary buttons gain a lime halo on hover. Framer Motion uses `MotionConfig reducedMotion="user"`, and CSS animations stop under `prefers-reduced-motion`.

## Components

- **Product card:** 4:5 plate, cutout at 12% inset, hover crossfade to the second image (or a scale-and-tilt), violet underglow, quick add and Quick View slide up on hover (always visible on touch).
- **Buttons:** primary (lime), secondary (ink/chalk), outline, ghost, danger. Sizes sm 36px, md 44px, lg 56px.
- **Sheet:** Radix Dialog plus Framer Motion. `start`/`end` are logical sides, so the cart comes from the left in RTL.
- **Badges:** "New" uses a chalk chip, discounts a lime chip with `−14%`.
