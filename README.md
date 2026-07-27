# hateem.dev

Personal site for **Mohamad Hateem bin Nazamid** — final-year BSc (Hons) Computer
Science at Universiti Teknologi MARA, Shah Alam.

The site has one job: land a 14-week industrial training internship running
**September to December 2026** at a Malaysian ICT company. Two audiences read it —
HR and intern coordinators who spend under a minute, and engineering leads who
read the write-ups and check the code — so the page is built to be skimmable at
the top and substantial further down.

Homepage and scaffold only. No dark mode, blog, i18n, CMS, analytics, or project
detail pages in this pass.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`) |
| Fonts | `next/font` — Archivo (variable, `wdth` axis) and IBM Plex Mono |
| Content | `next-mdx-remote` + `gray-matter` |
| Icons | `lucide-react` (available; the current design needs none) |
| Hosting | Vercel — `/` is statically prerendered, `/api/contact` is a function |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm start            # serve the production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
```

## Structure

```
src/
  app/
    layout.tsx            fonts, metadata, skip link
    page.tsx              composes the homepage sections in order
    globals.css           design tokens, Tailwind theme, keyframes
    icon.svg              favicon (Next serves this automatically)
    api/contact/route.ts  form handler — validation + honeypot
  components/
    Nav.tsx  Hero.tsx  SelectedWork.tsx  Background.tsx
    Toolkit.tsx  Elsewhere.tsx  Contact.tsx  ContactForm.tsx  Footer.tsx
    AllocationStrip.tsx   the hero's signature timeline
    allocation.ts         the timeline data — edit this, not the component
    Section.tsx           section shell: rhythm, hairline, mono h2 label
    Container.tsx         the one layout container (1080px, 24/48px padding)
    Reveal.tsx            scroll-into-view fade, safely degradable
    MonoLink.tsx          mono text link with a 44px hit area
  content/projects/       one .mdx file per project
  lib/
    projects.ts           reads project frontmatter at build time
    site.ts               shared facts: email, links, availability
public/
  resume.pdf              PLACEHOLDER — replace with the real résumé
  covers/*.svg            PLACEHOLDER cover art, 16:9
```

## Design system

### Tokens

Every colour lives in `:root` in `src/app/globals.css` and is aliased into
Tailwind's `@theme`, so `bg-paper`, `text-ink-muted` and `border-rule` all
generate from the same values. **Change the values in `:root`; never hard-code a
colour in a component.**

```
--paper       #F5F6F4   page background
--surface     #FFFFFF   raised surfaces, sparingly
--ink         #15191C   primary text
--ink-muted   #6B7176   secondary text, captions
--rule        #DDE1DE   hairlines, borders
--signal      #1F7A5A   deep green — the single accent
--signal-tint #E4F0EA   accent background wash
```

### The accent is rationed

`--signal` is semantic, not decorative. It marks availability, live status and
things that are genuinely open. It is used **five times** on the loaded page:

1. the hero availability dot
2. the open scheduling slot in the allocation strip (and its legend entry)
3. the primary "See the work" button
4. body links
5. the large contact email

Adding a sixth use weakens all five. The metrics under each project and the
"Send message" button are deliberately plain for this reason.

One contrast note: `--signal` on `--signal-tint` measures **4.49:1**, which
misses WCAG AA for normal text by a hundredth. So the availability pill's label
is `--ink` (the dot and the tint wash carry the accent), and the open slot's
label — where the brief calls for green explicitly — is weight 500, sits in an
`aria-hidden` graphic, and has its accessible equivalent in the legend below at
4.86:1. If you would rather have strict AA on every green-on-tint pairing,
changing `--signal` to `#1E7657` takes it to 4.74:1 and is visually
indistinguishable.

### Type

- **Archivo** for display and body. The hero name uses the real `wdth` 125 axis
  at weight 600 via the `.name-expanded` helper — not a synthetic stretch.
- **IBM Plex Mono** for structural and data text only: section labels, timeline
  blocks, chips, metrics, dates, key-value pairs. It never appears in prose.

| Role | Mobile | Desktop |
|---|---|---|
| Name (h1) | 40px | 84px |
| Section heading | 26px | 38px |
| Body | 16px | 17px |
| Mono label | 12px | 13px |
| Caption | 14px | 14px |

Body text never drops below 16px. Line height 1.6 for prose, 1.1 for the h1.

### Layout and motion

Single column, 1080px max, 24px page padding on mobile and 48px from `md`.
Vertical rhythm is 72px between sections on mobile, 140px on desktop. Sections
are separated by whitespace and at most one hairline.

Two motions, no more: the allocation strip draws in left to right over ~600ms on
first load with the open slot arriving last, and content fades and rises 300ms as
it scrolls into view. Both are wrapped in `prefers-reduced-motion`.

## Adding a project

1. Create `src/content/projects/<slug>.mdx`. The filename becomes the slug.
2. Fill in the frontmatter:

```yaml
---
title: Project Name
tagline: One line describing what it is
stack: [React, FastAPI, Postgres]
metrics:
  - p95 latency < 200ms          # up to three are shown
shots:
  - src: /shots/<slug>1.png
    alt: Describe what's on screen, for screen readers
demoVideo:                        # optional — renders as slide 0 ahead of shots,
                                   # a poster + play button; see ProjectShots.tsx
  src: /shots/<slug>-demo.mp4
  poster: /shots/<slug>-demo-poster.jpg
  alt: Describe what's happening in the clip, for screen readers
  duration: "0:57"
note: Optional caveat shown under the links
demoUrl: https://example.com     # optional — renders the primary "View live demo" button
details:                          # optional — omit the whole block to hide the
                                   # "Details" toggle entirely, no empty panel
  problem: 1-2 sentences on the actual problem this solves
  built:
    - 3-4 concrete bullets
    - prefer specifics over generic ("what") statements
  hardPart: One short paragraph on a single real technical challenge
  stackNotes: Optional one-liner the stack chips above don't capture
  repoUrl: https://github.com/you/repo   # optional
featured: false                   # featured gets the larger heading
order: 3                          # controls position in Selected work
---
```

3. Drop 1-3 screenshots (16:9) at `public/shots/`, referenced by `shots` above
   — see `ProjectShots.tsx`. Each needs a non-empty `alt`.
4. Write the body below the frontmatter. It is read and typed today but not
   rendered, because the detail pages are not built yet.

Nothing else needs touching — `Selected work` picks the file up automatically via
`src/lib/projects.ts`, which throws at build time if `title`, `tagline`, `shots`,
or a present-but-malformed `details`/`demoVideo` block is missing/invalid.

### Adding a demo video

`demoVideo` is optional and loads zero bytes until a visitor clicks play —
`ProjectShots.tsx` renders a poster image behind a play button and only mounts
the `<video>` element on click. To keep it that way, any clip added under
`public/shots/` must be re-encoded first:

```bash
ffmpeg -i raw-recording.mp4 \
  -c:v libx264 -preset slow -crf 30 \
  -profile:v high -level 4.0 -pix_fmt yuv420p \
  -g 60 -an -movflags +faststart \
  <slug>-demo.mp4
```

- `-movflags +faststart` is mandatory — without it the browser must download
  the entire file before playback can start, not just the first chunk.
- `-an` drops the audio track. Keep it only if the recording actually has
  sound; a silent AAC track is pure dead weight.
- Target **under ~6 MB** for a ~60s 720p clip. `-crf 30` gets screen
  recordings of mostly-static UI most of the way there; go to `32` if still
  too large, or down to `26` if text turns mushy.
- Grab a poster frame from a populated moment, not a blank loading state:
  `ffmpeg -i <slug>-demo.mp4 -ss 00:00:08 -frames:v 1 -q:v 3 <slug>-demo-poster.jpg`.

The filename is the cache key (`next.config.ts` sets a one-year `immutable`
`Cache-Control` on `/shots/*.mp4`) — re-encoding a clip means renaming it, not
overwriting it in place.

## Editing the timeline

The allocation strip is entirely data-driven. Open
`src/components/allocation.ts` and edit `AXIS` and `LANES`; positions, widths,
draw order and label decisions are all derived.

- Months are `[year, month]` with month 1–12. `start` is inclusive, `end` is
  exclusive, so Sep–Dec 2026 is `start: [2026, 9], end: [2027, 1]`.
- Geometry is clamped to the axis, so a mistyped date cannot make the strip
  overflow its container.
- Labels adapt to block width via `LABEL_THRESHOLD`: blocks under 12% of the axis
  drop their in-block label at narrow widths and rely on the legend; blocks at or
  above 20% get their name as well as their range.

## Outstanding TODOs

| Where | What |
|---|---|
| `public/resume.pdf` | Placeholder PDF. Overwrite with the real résumé, same filename — no code change needed. |
| `public/covers/*.svg` | Placeholder cover art. Replace with real 16:9 screenshots. |
| `src/lib/site.ts` | `linkedin` is `#`. Add the real profile URL. |
| `src/components/Background.tsx` | Two placeholder paragraphs to replace with your own prose. |
| `src/components/Toolkit.tsx` | Seeded only from what this page evidences. Add what's missing, remove anything you would not want to be asked about. |
| `src/app/api/contact/route.ts` | Wire up Resend and add `RESEND_API_KEY` in Vercel. The route validates and logs today. |

## Contact form

`ContactForm.tsx` posts JSON to `/api/contact`. The route validates the fields,
enforces length limits, and checks a honeypot field named `company` — which is
clipped to 1px rather than `display: none` (some bots skip hidden inputs),
carries `tabindex="-1"`, and returns the **same success response a human gets**
when filled, so a bot learns nothing. The email provider is not wired up yet; see
the TODO in the route.

## Verified

Against a production build, on Chromium:

- Lighthouse mobile: **performance 98–99, accessibility 100, best practices 100,
  SEO 100**, CLS 0
- Zero horizontal overflow at 360, 390, 768 and 1440px — checked on the document
  and on every element's box
- One `h1`, heading order `h1 → h2 → h3` with no skipped levels
- Every interactive element at least 44×44px
- All 19 keyboard focus stops show a visible ring, in visual order, behind a skip
  link
- Content stays fully visible with JavaScript disabled and under
  `prefers-reduced-motion: reduce`

360px is the baseline width, not 375 — a lot of Android devices in Malaysia sit
at 360.

## Deploying

Push to the default branch and import the repo on Vercel. No configuration
needed; `output: "export"` is deliberately **not** used because `/api/contact`
requires a server runtime.
