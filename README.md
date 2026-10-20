# Creative Minds — Carousel Machine

Tweet-style Instagram carousels (1080×1350, 4:5) rendered from a JSON file.

## Make a carousel

1. Copy an existing folder in `carousels/` to `carousels/<NNN-slug>/`.
2. Edit `carousel.json`: one entry per slide with `text` and a `graphic`.
3. Run `npm run render -- carousels/<NNN-slug>` (or `npm run render` for all).
4. PNGs + `caption.txt` land in `carousels/<NNN-slug>/output/`.

Setup once: `npm install`.

## Creative rules

1. **The hook graphic withholds.** Slide 1 never lists or labels the answers. It teases:
   redacted lines, blurred items, circles with no explanation, a torn-off total. The reader
   has to swipe to find out.
2. **Nothing should look AI-generated.** No neon glows, glassy dark cards, gradient blobs,
   pill badges or emoji-as-illustration. Graphics should look like real objects a person
   made or marked up: screenshots with marker, typed paper, receipts, sticky notes.

## Slide text

- Blank line = new paragraph. `**bold**` for the step title (e.g. `**3. Your website.**`).
- Keep step slides to a bold title plus 1–2 short sentences; the renderer warns if a slide overflows.

## Graphics — marked-up screenshots (house style)

Every slide uses `"type": "shot"`: a light-mode screenshot mock-up that gets red-marker
annotations drawn on it (`src/graphics/screens.mjs` + `src/ink.js`). Screenshots auto-scale
to fill the space under the copy.

```json
{ "type": "shot", "props": {
    "kind": "ig", "rotate": -1.5, "username": "northside.co", "followers": "1,204",
    "ink": [
      { "type": "circle", "target": "followers", "label": "?" },
      { "type": "note", "text": "who is this?", "near": "followers", "side": "right", "arrowTo": "followers" }
    ] } }
```

**Kinds** (and the parts you can target):

| kind | targets |
|---|---|
| `ig` | avatar, posts, followers, following, name, category, bio-N, link, tile-N, empty |
| `old-site` | title, marquee, links, image, counter, copyright |
| `hero` | eyebrow, headline, sub, button |
| `team` | heading, member-N |
| `about` | photo, filename, heading, body |
| `testimonials` | t-N, quote-N, who-N, result-N |
| `linkedin` | avatar, name, headline, followers, activity |
| `google` | query, result-N, panel, panel-photo, rating, panel-website, panel-social |
| `logos` | logo-N |
| `video` | player, caption, volume, title |
| `notes` | title, item-N, footer |
| `quiz` | headline, button |

**Ink marks:** `circle`, `underline`, `strike`, `check`, `cross` (each takes `target`, optional
`pad`, `label`), and `note` (handwritten text placed with `near` + `side` + `dx`/`dy`, or
absolute `x`/`y`; `arrowTo` draws an arrow to a target).

`tactile.mjs` keeps the case-file and receipt directions as occasional alternates.
The dark-panel graphics in `index.mjs` are legacy and break creative rule 2, so don't use them.

## Brand

`brand.json` holds the name, handle, verified badge, and avatar. Set `"avatar": "assets/headshot.jpg"` once a headshot is added (blank silhouette until then).
