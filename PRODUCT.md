# Product

## Register

brand

## Users
Two audiences, in this order:
1. **Hiring managers, recruiters and fellow developers** opening the shop from a portfolio link. They spend 30–120 seconds, usually on a laptop and sometimes on a phone. They judge craft: how it moves, how it feels to touch, whether the details hold up (focus states, RTL, empty states, reduced motion).
2. **The fictional VOLT shopper**: a design-literate buyer of premium tech and lifestyle accessories who browses at night on a phone and checks out on a laptop.

## Product Purpose
VOLT is a demo e-commerce store (mock data, no real payments) that shows production-grade frontend craft. Success means a reviewer finishes a full browse → product → cart → checkout → success flow without hitting a rough edge, and remembers the store afterwards.

## Brand Personality
**Charged, precise, unapologetic.** VOLT sells objects that feel engineered. The voice is short, confident, a little dry. Energy comes from the electric-lime accent, heavy wide type and decisive motion, not from clutter. References: Nothing (monochrome hardware with one signal color, dot-matrix restraint), Teenage Engineering (objects on plain plates, playful but exact), Shopify Plus flagship stores (fast, confident commerce UX).

## Anti-references
- Generic Shopify/Tailwind templates: centered hero + three identical feature cards + gradient blobs.
- Glassmorphism everywhere, gradient headline text, neon "cyberpunk" overload.
- Cream/beige editorial magazine look with serif italics.
- Amazon-style density: badges, banners and upsells fighting for attention.

## Design Principles
1. **One signal color.** Lime means "act here" (CTAs, live states, sale). Every other use dilutes it.
2. **Objects on plates.** Products always sit on the same ink plate, in both themes, so the catalog reads as one collection.
3. **Motion is feedback, not decoration.** Every animation confirms an action or shows hierarchy; nothing loops for attention except the hero.
4. **Craft is in the edges.** Empty states, errors, RTL, keyboard and reduced motion get the same polish as the hero.
5. **Fast feels premium.** Lighthouse 90+ is part of the brand, not an afterthought.

## Accessibility & Inclusion
- WCAG 2.2 AA: text contrast ≥ 4.5:1, visible focus rings, full keyboard paths through cart and checkout.
- Lime is never used as text color on light backgrounds (it fails contrast). It is a fill with ink text on top.
- `prefers-reduced-motion`: parallax, marquee, page transitions and confetti turn into crossfades or stay still.
- Full RTL support for Arabic through logical properties. Icons that show direction flip in RTL.
