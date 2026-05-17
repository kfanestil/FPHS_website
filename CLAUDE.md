# FPHM Website — Design System Context

This workspace is for **Fanny Pack Home Services (FPHS)** — a local handyman/home-services company.

---

## Design System Location

Full source lives at:
`/Users/kielfanestil/Documents/2-Work/Fanny Pack Home Services/Fonts Logos Assets/Fanny Pack Home Services Design System/`

Key files:
- `README.md` — full brand + voice + visual guidelines
- `colors_and_type.css` — all CSS tokens (colors, type, spacing, radii, shadows, motion)
- `ui_kits/website/styles.css` — component-level CSS (nav, hero, cards, buttons, form, footer)
- `ui_kits/website/*.jsx` — Nav, Hero, ServicesGrid, QuoteForm, Testimonials, Footer, HowItWorks
- `ui_kits/website/index.html` — assembled page reference
- `assets/logo-circle.png` — primary logo
- `assets/logo-icon.svg` — fanny-pack glyph
- `assets/logo-wordmark.svg` — wordmark only
- `assets/texture-canvas.svg` — optional kraft paper grain

---

## Brand Snapshot

**Promise:** Honest pros. Reasonable price. Quality work.
**Visual DNA:** Navy (`#2C3E50`) + safety-orange (`#ED7D31`) + warm bone canvas (`#F8F5F0`).
**Voice:** Plain-spoken neighbor. Confident, not boastful. No jargon. Sentence case in body; UPPERCASE in display/headings.

---

## HTML Design Rules — Non-Negotiable

When creating any HTML for this project:

1. **Always link `colors_and_type.css`** at the top (or inline all tokens). Never hard-code hex values or pixel sizes — use `var(--brand-navy)`, `var(--s-5)`, etc.
2. **Page background = `--bone` (#F8F5F0).** Never pure white as page bg.
3. **Primary font:** Archivo Black (display/headings, UPPERCASE) + DM Sans (body) — load from Google Fonts:
   `@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap");`
4. **Orange is an accent, not a flood.** Use it for CTAs, eyebrows, active states, one accent stripe per page.
5. **Icons:** Lucide via CDN. `<script src="https://unpkg.com/lucide@latest"></script>` + `lucide.createIcons()`.
6. **Buttons:** pill shape (`border-radius: 999px`). Primary = orange + `--shadow-press`. Secondary = navy.
7. **Cards:** `--r-4` (16px), `--shadow-1`, `1px solid var(--line-1)` border on hover.
8. **Nav:** sticky, 72px, navy background. Never transparent/glass.
9. **No glass-morphism, no backdrop-blur, no gradients in backgrounds.**
10. **No left-border-only accent cards.**
11. **No emoji as UI icons.**

---

## Color Tokens (Key)

```css
--brand-navy:       #2C3E50
--brand-navy-deep:  #1F2D3A
--brand-orange:     #ED7D31
--brand-orange-deep:#C9621A
--brand-orange-soft:#FBD9BD
--bone:             #F8F5F0   /* default page bg */
--bone-deep:        #EFEAE1
--paper:            #FFFFFF
--ink-900:          #1B232C   /* primary text */
--ink-700:          #3A4754
--ink-500:          #6A7785
```

## Spacing (8pt scale)
`--s-1: 4px | --s-2: 8px | --s-3: 12px | --s-4: 16px | --s-5: 24px | --s-6: 32px | --s-7: 48px | --s-8: 64px | --s-9: 96px | --s-10: 128px`

## Radii
`--r-1: 4px | --r-2: 8px | --r-3: 12px | --r-4: 16px | --r-pill: 999px`

---

## Services Offered

Indoor: plumbing, electrical, carpentry, drywall, mounting, appliances, doors/locks
Outdoor: decks & fences, lawn mowing/trimming, pool cleaning
Maintenance: home cleaning, small-engine repair, permit-free small remodels + general odd jobs

---

## Copy Voice Quick Rules

- Plain English. "We'll fix it" over "Comprehensive home maintenance solutions."
- UPPERCASE for display headings. Sentence case for body + UI.
- Eyebrows/labels: UPPERCASE TRACKED in orange.
- Use "We" / "You." Never "the customer" / "the client."
- Favored words: fix, patch, hang, mount, swap, replace, run, estimate, quote, pro, tech
- Avoid: solutions, leverage, holistic, world-class, best-in-class, deliverable
- No emoji in product/marketing UI.
