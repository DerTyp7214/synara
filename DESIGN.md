# Synara design system: SR-1

Direction: **hi-fi hardware**. The site is the front panel of a piece of audio equipment ("Synara SR-1, network music
server") and its owner's manual. Think Braun/Rams restraint with the tactile detail of a Technics or Nakamichi deck:
anodised graphite (dark) or off-white aluminium (light) faceplates, silk-screened legends, push-keys, LEDs, an amber
display and analogue VU meters.

The hardware is for **chrome and interaction** (header, hero, modules, keys, switches, code). Long-form text (docs,
privacy, feature descriptions) is a calm, high-contrast reading column. Source of truth: `src/app.css`.

The one memorable thing is the hero front panel: the amber display and the moving VU meters. Everything else stays quiet.

## Tokens (Tailwind utilities are generated from them)

| Token | Utility examples | Use |
|---|---|---|
| `bg` | `bg-bg` | page background: the shelf the gear sits on |
| `surface` | `bg-surface` | faceplates, modules |
| `raised` | `bg-raised` | light fills, hover |
| `recess` | `bg-recess` | wells, slots, inline code, the rear panel (footer) |
| `ink` / `muted` / `faint` | `text-ink` … | primary / secondary / tertiary text. `faint` is still AA on `bg` and `surface` |
| `line` / `line-strong` | `border-line` | hairlines; strong for plates and tags |
| `accent` | `bg-accent` | indicator orange: lit LEDs, primary key, patch cables. Not for text |
| `accent-ink` | `text-accent-ink` | accent as text (AA in both themes) |
| `on-accent` | | text on the orange key |
| `ok` / `warn` | `text-ok`, `text-warn` | status |
| `led-off` | | unlit LED |
| `lcd` / `lcd-ink` / `lcd-dim` / `lcd-ghost` | `text-(--color-lcd-ink)` | the amber display. **Identical in both themes**: it is a lit panel, not paper |

Tailwind's default palette is removed (`--color-*: initial`).

CSS variables (in `@layer theme`, switched per theme): `--brush` (hairline brushing), `--plate-shade`, `--plate-edge`,
`--plate-drop` (faceplate bevel and the tight shadow of an object on a shelf), `--well` (inset), `--key-top/bottom/edge/hl/drop/ink`
(key caps), `--scroll-thumb/-hover/-track`, `--section-space`, `--gutter`, `--header-h`, `--dur-ui`, `--dur-reveal`.

Radii by hierarchy: `--radius-plate` (7px, faceplates and modules) > `--radius-key` (4px, keys, wells, displays) > `--radius-tight`
(3px, inline code, tags). No pills.

## Type

Self-hosted woff2 in `static/fonts` (SIL OFL 1.1, latin subsets from Fontsource; licences in `static/fonts/OFL.txt`).

- `font-sans` **Barlow** 400/500/600 (+400 italic): body and headings. A DIN-like grotesk, readable at length.
- `font-label` **Barlow Condensed** 500/600: silk-screened legends, keys, switches. Uppercase, tracked.
- `font-mono` **IBM Plex Mono** 400/500: code, readouts, the display's text lines.
- `font-lcd` **Doto** (variable): dot-matrix numerals on the display only (time, NO SIGNAL). Never for body text.

Scale (all Barlow 600, tight tracking): `.h-display` (36→60px, one per page, the `h1`), `.h-section` (28→40px, `h2`),
`.h-title` (20→24px), `.h-sub` (17px). `.lead` (18→20px muted, max 38rem), `.meta` (15px muted), `.label` (14px sentence case),
`.readout` (mono 13px, tabular). Body 17px / 1.6; `.prose` 17px / 1.7, max 44rem.

`.legend` is the faceplate label: condensed caps, 12px, tracked, `faint`. Use it **on hardware only**: module heads, switch
labels, meter captions, footer jack groups. It is not an eyebrow above section headings.

## Components (`@layer components`; utilities override them)

Layout: `.shell` (76rem), `.shell-narrow` (46rem), `.section`, `.section-ruled`.

Surfaces
- `.faceplate`: brushed plate with bevel. The hero, the CTA rack unit, strips of channel modules.
- `.module` + `.module-head` (legend strip: `.module-title` on the heading, status LED/readout on the right) + `.module-body`.
  `.module.is-selected` is the "yours / lit" modifier (accent border); pair it with a lit LED or `.tag-lit`.
- `.module-blank`: dashed blanking plate for an empty slot (Apple, "Coming soon").
- `.well`: recessed slot. `.screw` (absolute; set `--screw-angle`), `.vents` (decorative slot strip). Screws only on the hero,
  the share player, the spec plate (env table) and the footer rating plate.

Indicators: `.led` (off), `.led.on` (orange), `.led.ok` (green). `.tag`, `.tag-lit` (small engraved status: Coming soon, Your system).

Keys (buttons and button-links)
- `.key` neutral cap; `.key-primary` orange cap (**one per view region**); `.key-quiet` (no cap, for tertiary actions).
- Sizes `.key-sm`, `.key-lg`, `.key-icon`. Keys press down 2px on `:active`. Labels are written in sentence case in markup; CSS
  sets them in condensed caps.
- `.selector`: a recessed slot of keys with an LED each. Children are `<button aria-pressed>` (or `aria-selected`/`aria-current="true"`).
  Used for Stable/Dev (`ChannelToggle`) and SQLite/Postgres/Full (`SetupSteps`).

Display
- `.lcd`: amber-on-dark glass with a glow. `.lcd-dim` for secondary text on it, `.lcd-dots` for Doto numerals.
- `CodeBlock.svelte` is a terminal module: legend strip with a Copy key, the code on an `.lcd`. It has `min-width: 0` and
  `max-width: 100%`, so it never widens a grid or the page; long lines scroll inside it.

Other: `.disclosure` (shared `details > summary` with a triangle), `.spec` (spec-sheet `dl`: `div > dt + dd` rows),
`.link`, `.code-inline`, `.kbd`, `.prose` (docs/privacy; `pre` is a recessed well with Shiki dual themes).

Scrollbars are thin everywhere: a faceplate-coloured thumb, and an amber thumb on a dark track inside `.lcd`.

## Shared components (`src/lib/components`)
- `Header.svelte`: a rack strip. Logo, engraved `SR-1` badge, nav as a bank of push-buttons (LED lit on the current page),
  theme switch, power LED. Hidden on `/share/`.
- `ThemeToggle.svelte`: a three-position slide switch (system / light / dark). Click moves the lever one step.
- `Footer.svelte`: the rear panel. Vents, link groups as jacks, and a rating plate (Server GPL-2.0, Apps free, ©).
- `home/HeroVisual.svelte`: the display section: now-playing readout and two VU meters (rAF, see Motion) with a Pause demo key.
- `home/HowItWorks.svelte`: a patch bay. Server OUT jack cabled to each client's input; Apple is an unpatched blank plate.
- Logos: `Logo.svelte` (ribbon S; the only place the gold-flame-rose gradient appears), `Logo_TEXT`, `Logo_LONG` (sized by font-size).
- Icons: `@lucide/svelte`, per-icon imports, `aria-hidden="true"` next to text.

## Copy lives in data
Facts are in `home/content.ts`, `download/content.ts`, `server/content.ts`; release logic in `$lib/releases.ts`. Markup should
not hardcode product claims.

## Theming
Dark (graphite) is default; light (off-white aluminium) applies via the OS or `<html data-theme="light">`; `data-theme="dark"`
forces dark. The inline script in `app.html` applies `localStorage['synara-theme']` before paint; `$lib/theme.ts` holds the
`theme-color` values (`#1c1c1e` / `#e6e5e0`). Prefer tokens; if you must branch use the `light:` / `dark:` custom variants.
Base CSS variables live in `@layer theme` so the light overrides win; don't move them out of the layer.

## Docs delivery
Docs HTML is not part of the serialized page data. `+page.server.ts` returns metadata only; `+page.ts` adds the HTML
(`$lib/docs/html.ts`): from the docs pipeline during prerender, from the already-rendered `<article data-doc>` when hydrating,
and from the target's prerendered page on client-side navigation.

## Do / don't
- Do: left-align; keep one bold element per page; use legends, LEDs and screws where they label real hardware-like structure;
  sentence case in copy; keep prose plain and readable.
- Don't: gradient buttons or gradient text; display serifs; three identical soft-shadow cards; a gradient bar above headings;
  a giant floating logo; glass/blur panels; glow blobs; legends above every section heading; hardware chrome inside prose;
  new colours outside the tokens; the amber display for anything but readouts and code.

## Motion
- The VU meters and the display's clock are the one moving element. They run on `requestAnimationFrame`, stop when off-screen
  or the tab is hidden, can be paused with the Pause demo key, and are static under `prefers-reduced-motion`.
- The 404 "NO SIGNAL" blinks four times, then stops; none under reduced motion.
- Response motion only otherwise: key press (2px), switch lever, disclosure triangle, menu drop. Animate `transform`/`opacity`.
