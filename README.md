# Creative Minds — Carousel Machine

Tweet-style Instagram carousels (1080×1350, 4:5) rendered from a JSON file.

## Make a carousel

1. Copy an existing folder in `carousels/` to `carousels/<NNN-slug>/`.
2. Edit `carousel.json`: one entry per slide with `text` and a `graphic`.
3. Run `npm run render -- carousels/<NNN-slug>` (or `npm run render` for all).
4. PNGs + `caption.txt` land in `carousels/<NNN-slug>/output/`.

Setup once: `npm install`.

## Slide text

- Blank line = new paragraph. `**bold**` for the step title (e.g. `**3. Your website.**`).
- Keep step slides to a bold title plus 1–2 short sentences; the renderer warns if a slide overflows.

## Graphics

Every slide picks a component from `src/graphics/index.mjs` and passes `props`:

| type | use for |
|---|---|
| `scorecard` | hook: pass/fail checklist with a big score |
| `brand-mismatch` | the same brand shown inconsistently |
| `browser-compare` | old site vs new site |
| `social-profile` | inactive Instagram profile |
| `founder-profile` | dead founder account + trust meter |
| `stock-vs-real` | stock photo vs real photo |
| `message-bubbles` | jargon answer vs clear answer |
| `testimonial` | review card + case-study stat |
| `checklist` | CTA: empty boxes for the reader to score themselves |

Add new components to the same file and register them in the `graphics` export.

## Brand

`brand.json` holds the name, handle, verified badge, and avatar. Set `"avatar": "assets/headshot.jpg"` once a headshot is added (blank silhouette until then).
