# Mathew Bandara — Official Website

A cinematic, editorial single-page portfolio for **Mathew Bandara** — announcer,
public speaker, scriptwriter and voice-over artist.

Built as a dependency-free static site: semantic HTML, one hand-written CSS file and one
small vanilla JavaScript file. No build step, no framework, no tracking. It deploys to
GitHub Pages (or any static host) exactly as it sits in this repository.

---

## 1. What is in this repository

```
/
├── index.html                 # The complete homepage (all sections, dialogs, templates)
├── favicon.svg                # MB monogram (also PNG + apple-touch icons)
├── site.webmanifest           # Installable "app" metadata
├── .nojekyll                  # Lets GitHub Pages serve files as-is
└── assets/
    ├── css/main.css           # Design system, layout, motion, responsive rules
    ├── js/main.js             # SITE_CONFIG + navigation, dialogs, lightbox, form logic
    ├── fonts/                 # Self-hosted Playfair Display + Inter (SIL OFL 1.1)
    ├── images/                # Optimised WebP + JPG pairs, OG card, portrait placeholder
    └── media/                 # Empty drop-zone for your audio / video (see its README)
```

---

## 2. Run it locally

Any static file server works. For example:

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

Opening `index.html` directly from the file system also works, but a local server gives
you accurate font and image caching behaviour.

---

## 3. Launch checklist — everything you must supply

Nothing below has been invented. Every item is either a designed placeholder or an empty
configuration value. Search the two files for `CONFIGURE` to find them quickly.

### 3.1 Contact details — `assets/js/main.js`

```js
const SITE_CONFIG = {
  email: "",           // e.g. "hello@mathewbandara.com"
  whatsapp: "",        // digits only, international format: "94771234567"
  whatsappMessage: "Hello Mathew, I would like to discuss a project.",
  formEndpoint: "",    // HTTPS JSON endpoint — required to actually deliver the form
  socials: {
    instagram: "",     // full https:// links
    facebook: "",
    youtube: "",
    linkedin: ""
  }
};
```

Behaviour while these are empty:

| Value missing   | What visitors see                                                         |
| --------------- | ------------------------------------------------------------------------- |
| `email`         | "Not configured yet" in the Direct Lines card                             |
| `whatsapp`      | "Not configured yet" in the Direct Lines card                             |
| `formEndpoint`  | The form validates fully, then states honestly that nothing was sent      |
| any social link | The icon renders as a non-link labelled "link not configured yet"         |

As soon as a value is filled in, the matching link, button or live form appears with no
other code changes. The yellow **Setup needed** note disappears automatically once email,
WhatsApp, a valid HTTPS endpoint and all four social links are configured.

### 3.2 Portrait — `assets/images/portrait-mathew-*.{jpg,webp}`

The current portrait is a **clearly labelled placeholder** — an MB monogram, not a
fabricated photograph. Replace it with a real headshot:

1. Prepare a portrait crop, **3:4 ratio** (e.g. 1200 × 1500 px), with dark, cinematic lighting.
2. Export two widths — 600 px and 1000 px — as both WebP and JPG using the same file names:
   `portrait-mathew-600.webp`, `portrait-mathew-1000.webp`,
   `portrait-mathew-600.jpg`, `portrait-mathew-1000.jpg`.
3. Update the `alt` text on the portrait `<img>` in `index.html` to describe the real photo.
4. Delete the caption line above the scroll cue that reads
   `Portrait placeholder — add your professional photograph`.

The hero frames the image at 4:5, so keep the subject's eyes in the upper third.

### 3.3 Gallery photographs — `assets/images/gallery-*`

Six gallery slots exist: Event Announcing, Public Speaking, Scriptwriting, Voice-Over
Projects, Behind the Scenes, Featured Moments. They currently use atmospheric,
non-identifiable imagery (microphones, stages, scripts, studios) — **not** fake photos of
Mathew or invented events.

To replace one:

1. Export your photo at the slot's aspect ratio, in WebP + JPG at two sizes.
2. Update the `<source srcset>` and `<img src>` inside that card.
3. Update the `alt` text, plus `data-image`, `data-image-webp` and `data-image-alt` on the
   same `<button>` (these power the lightbox).

| Slot | Card class | Ratio | Suggested sizes |
| ---- | ---------- | ----- | --------------- |
| Event Announcing | `.gallery__item--a` | 2:3 portrait | 560 / 848 |
| Public Speaking | `.gallery__item--b` | 16:9 landscape | 560 / 1000 |
| Scriptwriting | `.gallery__item--c` | 16:9 landscape | 700 / 1100 |
| Voice-Over Projects | `.gallery__item--d` | 9:16 portrait | 560 / 768 |
| Behind the Scenes | `.gallery__item--e` | 21:9 landscape | 800 / 1400 |
| Featured Moments | `.gallery__item--f` | 2:3 portrait | 480 / 768 |

### 3.4 Service imagery — `assets/images/service-*`

Four supporting images (announcing, speaking, scriptwriting, voice-over). Same replacement
process: WebP + JPG at 560 px and 1000 px wide, 16:10 crop.

### 3.5 Audio and video — `assets/media/`

See `assets/media/README.md`. Add the file first, then point the gallery card at it with
`data-media-type` and `data-media-src`. Until then the lightbox shows a labelled slot,
never a broken player. Nothing autoplays.

### 3.6 Domain, metadata and sharing

- Replace every `https://mathewbandara.example/` in `index.html` (canonical, Open Graph,
  Twitter card, JSON-LD) with the final domain.
- Update `og-card.jpg` (1200 × 630) if you want your portrait on the share card.
- Update `index.html` `<title>` / `<meta name="description">` only if the positioning changes.

### 3.7 Contact form endpoint

The form posts JSON:

```json
{ "name": "…", "email": "…", "service": "…", "message": "…", "page": "https://…" }
```

to `SITE_CONFIG.formEndpoint` with a 20-second timeout, and treats any `2xx` response as
success. It includes a honeypot field, accessible inline errors, an error summary and a
polite live region for status messages. Any of these work without extra code:

- **Formspree** — `https://formspree.io/f/xxxxxxx`
- **Basin** — `https://usebasin.com/f/xxxxxxx`
- **Netlify Forms / your own function** — provide a JSON-accepting HTTPS URL

The endpoint must allow CORS from your domain. Nothing is ever sent while the field is empty.

---

## 4. Brand and design system

| Token | Value | Used for |
| ----- | ----- | -------- |
| Premium gold | `#D4AF37` | highlights, buttons, active nav, key words |
| Deep gold | `#B8942E` | gradients, secondary accents |
| Pure white | `#FFFFFF` | (available) |
| Elegant off-white | `#F7F5F0` | light section background, primary text on dark |
| Deep black | `#0A0A0A` | page and hero background |
| Charcoal | `#151515` | alternating card surfaces |
| Maroon red | `#800020` | signature section, dramatic glow |
| Deep maroon | `#4A0016` | gradients, atmosphere |
| Accessible gold ink | `#6E5410` | gold text on light backgrounds (contrast-safe) |

Typography pairs **Playfair Display** (display serif, self-hosted variable font) with
**Inter** (interface sans). Both are subset to Latin and include Sinhala fallbacks
(`Noto Serif Sinhala`, `Iskoola Pota`) in the font stacks, so Sinhala copy can be added
later after loading a Sinhala webfont.

All colours, spacing, type scales and easing curves live in the `:root` block at the top
of `assets/css/main.css`.

---

## 5. Interaction and accessibility notes

- Sticky header with a gold scroll-progress line and scroll-spy active navigation.
- Mobile menu: focus moves into the menu, the page behind is `inert`, `Esc` closes and
  focus returns to the toggle. Closed automatically when a link is used or the viewport
  becomes desktop.
- Services open accessible `<dialog>` detail panels; the CTA carries the chosen service
  into the contact form and focuses it.
- Gallery opens a keyboard-navigable lightbox (`←`/`→`, `Esc`, focus restoration, live
  region announcing "Project 3 of 6").
- Form: inline errors tied with `aria-describedby`, `aria-invalid`, a focused error
  summary, honeypot spam trap, and honest "not configured" messaging.
- `prefers-reduced-motion` disables entrance and reveal animations; content is fully
  visible without JavaScript.
- Skip link, visible gold focus rings, semantic landmarks and 0 axe-core violations at
  1440 px and 390 px.
- Images are served as WebP with JPG fallback, sized with `srcset`/`sizes`, and
  below-the-fold images are lazy-loaded. The portrait reserves its 4:5 box to avoid
  layout shift.

---

## 6. Deploying to GitHub Pages

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Choose the branch and the `/ (root)` folder, then save.
4. Add your custom domain in the same panel once DNS is ready.

`.nojekyll` is already present so every asset is served untouched.

---

## 7. Verification performed

- Rendered and reviewed at 1440, 1280, 1024, 768, 390 and 360 px — no horizontal
  overflow, no clipped headlines, no missing images (`document.images` all complete).
- `axe-core` (WCAG 2.1 A/AA + best practice): **0 violations** on desktop and mobile.
- `html-validate` (recommended ruleset): **0 errors**.
- Interaction tests: hero CTAs, scroll-spy, mobile menu open/close (touch, `Esc`, link
  navigation), service dialogs, gallery lightbox with arrow keys and `Esc`, form
  validation, unconfigured-submit messaging, and a mocked 200/500 endpoint round-trip.
- No-JavaScript and reduced-motion modes both show the full page and working anchors.

---

## 8. Licence notes

- Fonts: Playfair Display and Inter, SIL Open Font License 1.1 — licence texts in
  `assets/fonts/`.
- Imagery in `assets/images/` was generated for this project as atmospheric editorial
  placeholders. Replace with authentic photography before presenting it as Mathew's work.
