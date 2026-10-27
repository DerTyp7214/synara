# Synara design system

The site has two designs that visitors switch between: **Modern** (the default: the iOS 26 app, Liquid Glass, grouped
surfaces, SF type) and **Retro** ("SR-1" hi-fi hardware). Content, data and logic are shared; each design owns its look and,
where it matters, its own layouts and components.

Sources of truth: `src/app.css` (shared base and Retro), `src/lib/designs/modern/tokens.css` (generated Modern tokens),
`src/lib/designs/modern/modern.css` (Modern baseline styles).

## Shared principles

- One page, one job. Left-aligned, sentence case, plain readable prose; one bold element per page.
- Colours only from tokens. Both designs define the same **generic roles**, so most markup styles itself through them:
  `bg`, `surface`, `raised`, `recess`, `ink`, `muted`, `faint` (still AA on `bg`/`surface`), `line`, `line-strong`, `accent`
  (fills), `accent-ink` (accent as text, AA), `on-accent`, `ok`, `warn`. Utilities: `bg-surface`, `text-muted`, `border-line` ...
- Semantic classes are shared too and each design restyles them: `.shell`, `.section`, `.h-display/-section/-title/-sub`,
  `.lead`, `.meta`, `.label`, `.legend`, `.module` (+ `-head/-body/-title`, `.is-selected`), `.module-blank`, `.faceplate`,
  `.well`, `.key` (+ `-primary/-quiet/-sm/-lg/-icon`), `.selector`, `.lcd`, `.code-block`, `.disclosure`, `.tag`, `.spec`,
  `.link`, `.code-inline`, `.kbd`, `.prose`, `.mmd-*`.
- Shared components stay in `src/lib/components` (CodeBlock, Inline, Logo*, PlatformIcon, the download/server components)
  and style through tokens and semantic classes only.
- Accessibility in both: AA contrast, visible focus, keyboard-operable controls, reduced motion respected; decoration is
  `aria-hidden`.
- Icons: `@lucide/svelte`, per-icon imports, `aria-hidden="true"` next to text.

### Theme and design switching

- Two independent axes on `<html>`: `data-theme="light|dark"` (absent = follow the OS; dark is the fallback) and
  `data-design="modern"` (absent = Retro). `app.html` ships `data-design="modern"`, so prerendered and no-JS HTML is
  Modern/system; the inline script removes the attribute for a stored or requested Retro. There is no server-side branching.
- `localStorage['synara-theme']` and `localStorage['synara-design']`. The inline script in `src/app.html` applies both
  before first paint, honours `?design=modern|retro` (applies and saves it; the query stays in the URL), sets the
  `theme-color` META for design x theme, and preloads the active design's fonts (Inter for Modern on non-Apple platforms,
  Barlow for Retro). Its pre-paint `<style>`
  holds the background/ink per design x theme.
- `$lib/theme.ts`: `readThemePref`/`applyThemePref`, `readDesignPref`/`applyDesignPref`, `META_COLOR` (design x theme).
  Keep its colours, `app.html` and `tokens.css` in sync (`pnpm gen:tokens` warns when `app.html` is stale).
- Tokens are defined once per design: dark values first, then a nested `@variant light { ... }`, which expands to both the
  stored choice and the OS preference. If you must branch in markup, use the `light:` / `dark:` custom variants.
- Toggles: `designs/retro/ThemeToggle.svelte` (Retro theme switch), `designs/modern/ThemeSegmented.svelte` (Modern theme
  control, System / Light / Dark) and `designs/DesignToggle.svelte` ("Design: Retro / Modern", a radiogroup with arrow-key
  support; Retro idiom = slide switch, Modern idiom = segmented control, by CSS). Both theme controls re-read the stored
  theme when the design changes, so switching designs mid-session shows the right position.

## Variants: one prerendered page, two designs

The design is only known on the client, so markup that differs per design is **rendered for both** and the inactive one is
hidden by CSS (global rule in `app.css`, `display: none !important`):

```svelte
<div class="design-retro contents"><HeroVisual /></div>
<div class="design-modern contents"><ModernHero /></div>
```

- Use `contents` on the wrappers when the children are layout items (sticky header, `mt-auto` footer, page sections): the
  wrapper then adds no box, so the active design lays out exactly as without it.
- Ids must stay unique across both variants (prefix Modern ones, e.g. `m-hero-h`). An in-page anchor both designs need
  (`/#features`) goes on a shared element around the two variants, not inside one of them.

- Don't choose markup with JavaScript (`{#if design.isModern}`): prerendered HTML would be wrong for Modern visitors until
  hydration, and hydration would mismatch.
- Gate **expensive JavaScript** on the store instead: `import { design } from '$lib/designs/design.svelte'` gives
  `design.current` (`'retro' | 'modern'`), `design.isRetro`, `design.isModern`, `design.set()`, `design.sync()`. It reads the
  `<html>` attribute (server: always `'modern'`, the default), is re-synced when the root layout mounts and follows the toggle. Example:
  the Retro VU meters (`designs/retro/home/HeroVisual.svelte`) only run their rAF loop while `design.isRetro`, and stop/resume
  on a switch via `$effect`. Combine it with an IntersectionObserver for visibility.
- State that the toggle shows before hydration (lever position, lit legend) comes from the attribute in CSS
  (`:global([data-design='modern']) ...`), not from the store.
- Shared data and logic live in shared modules (`$lib/releases.ts`, `$lib/share/resolve.ts`, the `content.ts` files,
  `$lib/nav.ts` for header/footer links). A page fetches once and passes the result to both views. Hardware wording ("SR-1",
  "Power", "No signal") belongs to the Retro components, not to shared content.
- Keep the second variant lean: it costs prerendered HTML on every page. Check the gzip size of `build/index.html`.
- Folders: `src/lib/designs/retro/*`, `src/lib/designs/modern/*`, shared design plumbing in `src/lib/designs/`.

## Shared content and data

### Copy lives in data

Facts are in `src/lib/components/home/content.ts`, `download/content.ts`, `server/content.ts`; release logic in `$lib/releases.ts`. Markup should
not hardcode product claims.

### Docs delivery

Docs HTML is not part of the serialized page data. `+page.server.ts` returns metadata only; `+page.ts` adds the HTML
(`$lib/docs/html.ts`): from the docs pipeline during prerender, from the already-rendered `<article data-doc>` when hydrating,
and from the target's prerendered page on client-side navigation.

## Retro (SR-1)

Direction: **hi-fi hardware**. The site is the front panel of a piece of audio equipment ("Synara SR-1, network music
server") and its owner's manual. Think Braun/Rams restraint with the tactile detail of a Technics or Nakamichi deck:
anodised graphite (dark) or off-white aluminium (light) faceplates, silk-screened legends, push-keys, LEDs, an amber
display and analogue VU meters.

The hardware is for **chrome and interaction** (header, hero, modules, keys, switches, code). Long-form text (docs,
privacy, feature descriptions) is a calm, high-contrast reading column.

The one memorable thing is the hero front panel: the amber display and the moving VU meters. Everything else stays quiet.

### Tokens (Tailwind utilities are generated from them)

| Token                                       | Utility examples         | Use                                                                            |
| ------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------ |
| `bg`                                        | `bg-bg`                  | page background: the shelf the gear sits on                                    |
| `surface`                                   | `bg-surface`             | faceplates, modules                                                            |
| `raised`                                    | `bg-raised`              | light fills, hover                                                             |
| `recess`                                    | `bg-recess`              | wells, slots, inline code, the rear panel (footer)                             |
| `ink` / `muted` / `faint`                   | `text-ink` …             | primary / secondary / tertiary text. `faint` is still AA on `bg` and `surface` |
| `line` / `line-strong`                      | `border-line`            | hairlines; strong for plates and tags                                          |
| `accent`                                    | `bg-accent`              | indicator orange: lit LEDs, primary key, patch cables. Not for text            |
| `accent-ink`                                | `text-accent-ink`        | accent as text (AA in both themes)                                             |
| `on-accent`                                 |                          | text on the orange key                                                         |
| `ok` / `warn`                               | `text-ok`, `text-warn`   | status                                                                         |
| `led-off`                                   |                          | unlit LED                                                                      |
| `lcd` / `lcd-ink` / `lcd-dim` / `lcd-ghost` | `text-(--color-lcd-ink)` | the amber display. **Identical in both themes**: it is a lit panel, not paper  |

Tailwind's default palette is removed (`--color-*: initial`).

CSS variables (in `@layer theme`, switched per theme): `--brush` (hairline brushing), `--plate-shade`, `--plate-edge`,
`--plate-drop` (faceplate bevel and the tight shadow of an object on a shelf), `--well` (inset), `--key-top/bottom/edge/hl/drop/ink`
(key caps), `--scroll-thumb/-hover/-track`, `--section-space`, `--gutter`, `--header-h`, `--dur-ui`, `--dur-reveal`.

Radii by hierarchy: `--radius-plate` (7px, faceplates and modules) > `--radius-key` (4px, keys, wells, displays) > `--radius-tight`
(3px, inline code, tags). No pills.

### Type

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

### Components (`@layer components`; utilities override them)

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

### Retro components (`src/lib/designs/retro`, shared ones in `src/lib/components`)

- `designs/retro/Header.svelte`: a rack strip. Logo, engraved `SR-1` badge, nav as a bank of push-buttons (LED lit on the current page),
  design switch, theme switch, power LED. Hidden on `/share/`.
- `designs/retro/ThemeToggle.svelte`: a three-position slide switch (system / light / dark). Click moves the lever one step.
- `designs/retro/Footer.svelte`: the rear panel. Vents, link groups as jacks, and a rating plate (Server GPL-2.0, Apps free, ©).
- `designs/retro/home/HeroVisual.svelte`: the display section: now-playing readout and two VU meters (rAF, see Motion) with a Pause demo key.
- `designs/retro/home/HowItWorks.svelte`: a patch bay. Server OUT jack cabled to each client's input; Apple is an unpatched blank plate.
- `designs/retro/home/Features.svelte`, `SetupTeaser.svelte`: the spec sheet and the compose teaser (copy from `components/home/content.ts`).
- Logos: `Logo.svelte` (ribbon S; the only place the gold-flame-rose gradient appears), `Logo_TEXT`, `Logo_LONG` (sized by font-size).
- Icons: `@lucide/svelte`, per-icon imports, `aria-hidden="true"` next to text.

### Theming

Dark (graphite) is default; light (off-white aluminium) applies via the OS or `<html data-theme="light">`; `data-theme="dark"`
forces dark. The inline script in `app.html` applies `localStorage['synara-theme']` before paint; `$lib/theme.ts` holds the
`theme-color` values (`#1c1c1e` / `#e6e5e0`). Prefer tokens; if you must branch use the `light:` / `dark:` custom variants.
Base CSS variables live in `@layer theme`: dark values on `:root`, light values once in a nested `@variant light { }`
(it expands to both `data-theme="light"` and the OS preference). Don't move them out of the layer.

### Do / don't

- Do: left-align; keep one bold element per page; use legends, LEDs and screws where they label real hardware-like structure;
  sentence case in copy; keep prose plain and readable.
- Don't: gradient buttons or gradient text; display serifs; three identical soft-shadow cards; a gradient bar above headings;
  a giant floating logo; glass/blur panels; glow blobs; legends above every section heading; hardware chrome inside prose;
  new colours outside the tokens; the amber display for anything but readouts and code.

### Motion

- The VU meters and the display's clock are the one moving element. They run on `requestAnimationFrame`, stop when off-screen
  or the tab is hidden, can be paused with the Pause demo key, and are static under `prefers-reduced-motion`.
- The 404 "NO SIGNAL" blinks four times, then stops; none under reduced motion.
- Response motion only otherwise: key press (2px), switch lever, disclosure triangle, menu drop. Animate `transform`/`opacity`.

## Modern (iOS 26)

Direction: **the iOS app on the web**. Grouped backgrounds, inset-grouped cards, Liquid Glass on chrome, SF type, capsule
buttons, segmented controls, restrained spring motion. The reference is the real app: `synara-android/iosApp/iosApp/UI/`
(SwiftUI, iOS 26 deployment target, `.glassEffect(...)` throughout) and its screenshots. It should not read as Retro with the
screws removed, nor as a generic template.

Files: `src/lib/designs/modern/tokens.css` (generated, committed), `modern.css` (hand-written), `tonal.js` (tint roles),
`coverTint.ts` (runtime cover tint), `mcu.js` (small deep imports of material-color-utilities), `motion.ts` (View
Transition helpers), the components listed under "Modern components", and `pages/*` (inner pages).

### Colour

- Tonal roles from the shared `AppColorScheme` idea: `scripts/gen-tonal-tokens.mjs` (`pnpm gen:tokens`) builds a
  material-color-utilities `DynamicScheme` from seed **#FF8A00** (the iOS AccentColor) with the apps' `ColorSchemeBuilder`
  palettes (primary keeps the seed chroma, secondary c16, tertiary hue+60 c24, neutral c4, neutral variant c8), dark and light,
  and fails if a text role drops below 4.5:1 on any grouped level.
- Generic roles are mapped for Modern (`--color-bg` = grouped background, `--color-surface` = card, `--color-recess` = fill
  inside a card, `--color-accent` = primary, ...), so shared markup works unchanged.
- Modern-only roles (use as `bg-(--m-grouped-bg-2)`, `text-(--m-on-primary-container)` ...):
  - grouped backgrounds, neutral like `systemGroupedBackground`: `--m-grouped-bg` (page), `--m-grouped-bg-2` (cards, rows),
    `--m-grouped-bg-3` (fills inside a card);
  - `--m-surface`, `--m-surface-container-lowest|low||high|highest`, `--m-on-surface`, `--m-on-surface-variant`;
  - `--m-primary|secondary|tertiary|error` with `--m-on-*`, `--m-*-container`, `--m-on-*-container`;
  - `--m-outline`, `--m-outline-variant`;
  - fills: `--m-tint-fill` / `--m-tint-fill-hover` (tinted buttons), `--m-fill` / `--m-fill-strong` (neutral control
    fills, segmented track), `--m-thumb` (selected segment); `--m-seed` (#FF8A00, raw).
- **Cover tints**: sections that show a cover take their palette from it, like the app. Put `.tint` on the container and use
  `--tint-primary`, `--tint-on-primary`, `--tint-container`, `--tint-on-container`, `--tint-secondary-container`,
  `--tint-on-secondary-container`, `--tint-tertiary`, `--tint-vivid` (backdrop blobs), `--tint-surface`, `--tint-surface-high`,
  `--tint-ink`, `--tint-muted`, `--tint-outline` (they follow the theme).
  - Static covers: a build-time class from the generator, e.g. `class="tint tint-light-years"` for
    `/demo/covers/light-years.webp` (Stellardrone, _Light Years_) and `.tint-directionless` for
    `/demo/covers/directionless.webp` (Broke For Free, _Directionless EP_). Both are CC BY 4.0: credit them where shown
    (see `static/demo/covers/ATTRIBUTION.txt`). Add covers to `COVERS` in the generator.
  - Runtime covers (share page): `applyCoverTint(img, el)` from `$lib/designs/modern/coverTint` (QuantizerCelebi + Score on a
    64 px canvas, then the same roles). The image needs CORS (`crossorigin="anonymous"`); on failure it changes nothing and
    the base seed applies. About 12 kB gzip: load it with a dynamic `import()` on the page that needs it.
  - Without a cover, `.tint` falls back to the #FF8A00 roles.
- Retro-only variables have Modern values so unconverted components don't break: `--brush`, `--plate-*` and `--well` are
  flat/none; `--key-*` become the segment thumb; `--color-lcd*` become a grouped surface with ink text (no amber);
  `--color-led-off` = outline variant; `--font-label` = sans, `--font-lcd` = mono. Don't use them in new Modern code.

### Liquid Glass

- `.glass` (Tailwind utility): `--glass-specular` over `--glass-bg`, `backdrop-filter: blur(var(--glass-blur))
saturate(var(--glass-saturate))`, a `--glass-border` rim, an inner `--glass-highlight` line and `--glass-shadow`.
  `.glass-card` (16, `Theme.cornerRadius`) and `.glass-card-lg` (28, `largeCornerRadius`) add the app's explicit glass shapes;
  `.capsule` for pills.
- Fallbacks are built in: `prefers-reduced-transparency: reduce` and no `backdrop-filter` support give `--glass-solid`.
- Use it on **chrome** only, as iOS does: nav bar, toolbars, the player card, controls, floating panels (TOC). Glass needs
  something behind it: put it over the cover, a cover-tinted backdrop or scrolling content. Content cards stay on grouped
  surfaces.

### Shapes

- Native first: capsules (`--m-radius-capsule`) for buttons, pills, tags and segmented controls; circles for icon buttons
  (`.key-icon`); inset-grouped cards at `--m-radius-group` (26 px; `--radius-plate` maps to it).
- Concentric nesting: inner radius = outer radius - inset. `--radius-key` is 14 px = 26 - 12 for things inset 0.75rem in a
  card; compute others with `calc(var(--m-radius-group) - <inset>)`.
- 16 / 28 (`--m-radius-card`, `--m-radius-card-lg`) only for custom glass cards (and code blocks, which mirror them).
- `corner-shape: squircle` is applied to cards where supported (progressive enhancement; never to capsules).

### Type

- `--font-sans`: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", system-ui, sans-serif`. Real
  SF on Apple platforms (it can't be self-hosted); self-hosted **Inter** (variable, latin, `static/fonts/Inter-var.woff2`,
  OFL) elsewhere. Inter sits before `system-ui` on purpose: `system-ui` always resolves, so nothing after it would ever load.
  `--font-display` puts SF Pro Display first for headings. `--font-mono`: `"SF Mono", ui-monospace, SFMono-Regular, Menlo,
"IBM Plex Mono", monospace`.
- iOS text styles as tokens `--ios-<style>-size|-leading|-weight|-tracking` for `large-title`, `title1`, `title2`, `title3`,
  `headline`, `body`, `callout`, `subheadline`, `footnote`, `caption1`, `caption2` (Large Dynamic Type sizes: 34, 28, 22, 20,
  17, 17, 16, 15, 13, 12, 11 px). Headings use the emphasised weights (700/600). The web's big headings scale the iOS sizes
  up: `.h-display` from Large Title to 56 px, `.h-section` from Title 1 to 40 px.
- `.legend` becomes a grouped-section header (footnote, semibold, secondary, sentence case). No condensed caps anywhere.

### Component idioms (baseline reskin of the shared classes)

- Buttons: `.key` = **tinted** capsule (accent text on `--m-tint-fill`), `.key-primary` = **prominent** (accent fill,
  `on-accent` text, one per region), `.key-quiet` = **plain** (accent text, fill on hover). Press = scale 0.97 with a spring, no 2 px drop.
- `.selector` = iOS segmented control, as in the app's `GlassSegmentedControl` (see `shots/ios/*/05-listening-stats`,
  `08-search`): a light track (`--m-seg-track` with a `--m-seg-border` rim), equal segments, and one thumb that is a
  translucent dark pill (`--m-thumb`: black 32% dark, 8% light, no shadow). It slides to the
  `aria-pressed|selected|current="true"` child (CSS `:has()`, up to 5 segments; without `:has()` the selected segment carries
  the thumb). `ThemeSegmented`, `DesignToggle` and the features picture use the same tokens.
- `.module` / `.faceplate` = inset-grouped cards on the grouped background (no bevel, no shadow). `.module-head` keeps a hairline
  separator; `.module-title` is a headline. `.module.is-selected` keeps an accent rim.
- `.lcd` and `.code-block` = secondary-grouped surfaces with ink text, tertiary when nested in a card. Code stays mono.
- `.disclosure` = tinted label with a chevron. `.tag` = small capsule (`.tag-lit` tinted). `.spec` = grouped rows.
- `.prose`: SF headings, accent links with a light underline, discs for lists, grouped-surface `pre`.
- `.mmd-panel` (Mermaid) = grouped surface; viewport on the tertiary fill.
- Scrollbars: thin and neutral everywhere, including displays.
- Hardware decoration is hidden: `.screw`, `.vents`, `.led`, `.jack`, `.model`, `.power` get `display: none` (all
  `aria-hidden`, so nothing is lost). The selector's LED pseudo-element is gone too.
- One Phase-1 override is left at the end of `modern.css`: displays drawn by scoped styles (`.lcd.screen`, the share player
  until it has a Modern variant). Delete it with that variant.

### Modern components (`src/lib/designs/modern`)

- `Header.svelte`: a floating Liquid Glass capsule (52 px, sticky, 10 px from the top; `--header-h` is 4.25rem on Modern
  so sticky things clear it). Logo, then the `nav.ts` links as tab-bar items: the current page is a neutral pill
  (`--m-fill-strong`) with an accent label and `aria-current="page"`, as in the app's tab bar; hash links are never current. From lg up, the design switch and
  `ThemeSegmented` sit in the bar on a plain fill (no glass on glass). Below lg, a circle menu button opens a floating
  glass panel (28 radius, thicker glass because it holds text over text) with the links as rows and both controls with
  labels. Esc closes it and returns focus to the button. Opening it focuses the first item. A click outside closes it.
- `Footer.svelte`: plain grouped footer. Wordmark and one-line description, two link groups (footnote type), then a hairline
  and the `Server: GPL-2.0, apps free` / © line. No glass.
- `ErrorState.svelte` (used by `+error.svelte`): an iOS empty state (ContentUnavailableView). A 56 px line symbol
  (`link-2-off` for 404, `triangle-alert` otherwise), Title 1 "Page not found", one line of direction, and Home (prominent),
  Docs and Download (tinted) capsules. It is centred, as iOS empty states are.
- `home/*` (styles shared in `home/home.css`, prefixed `mh-`):
  - `Hero.svelte`: a large title with lead, buttons and licence, beside a glass now-playing card (`.glass`, 28 radius,
    cover inset 16 with a concentric 12 radius) modelled on the iOS player (`shots/ios/*/01-now-playing`): cover,
    title/artist with a heart, a thin progress bar with elapsed and total time and the format as the centre accessory,
    and shuffle / rewind / play-pause / fast-forward / repeat. Play/Pause is the app's glass button: cover-tinted glass
    with the glyph in `--tint-primary`. It is a small playback demo without audio, with two CC BY 4.0
    songs (Stellardrone, _Light Years_, and Broke For Free, "Night Owl" from _Directionless EP_). Each plays about 16 s
    of real-time progress from an offset and then moves on to the next, looping. Play/Pause (it morphs between a
    rounded square and a circle like the app's button) and Previous/Next (rewind and fast-forward glyphs) are real buttons. Shuffle and repeat are
    decoration, and the ticking times are `aria-hidden`. One rAF loop runs only while playing, on screen
    (IntersectionObserver), in a visible tab and on Modern. Under reduced motion the demo starts paused. Colour follows
    the cover like the app: the section carries the current song's build-time tint class (`.tint-light-years`,
    `.tint-directionless`), the registered `--tint-*` colours transition over `--m-tint-dur`, and the cover and the
    blurred cover backdrop (`--m-cover-backdrop-filter|opacity|veil`, per theme; the veil keeps text AA) crossfade. The
    credit line under the card follows the song. Layout: stacked below 48rem, with copy and card in one 36rem
    column (the credit aligned with the card). From 48rem it is side by side, with the card at
    `clamp(16.5rem, 31vw, 23.5rem)`. The stage is a size container: the card's padding, title, play button, transport
    buttons and glyphs scale with `cqi`, and a stage of 32rem or wider (a stacked layout on landscape phones or small
    tablets) lays the card out sideways, with the cover on the left. The backdrop stays even over the whole hero and
    fades only in its last 16rem. The secondary button is a glass capsule because it sits on colour.
  - `HowItWorks.svelte`: the server as a grouped card with value rows (term left, value right, like Settings > About),
    one arrow in a circle, then the apps as an inset-grouped list with leading icon tiles. Apple is muted with a
    "Coming soon" tag. No cables.
  - `Features.svelte`: two larger lead cards (an icon tile, Title 2, the body, and a quiet picture: the stream options
    as a non-interactive segmented control and the import sources as capsules). The other features follow as Settings
    rows (`.mh-row`: a 30 px tonal icon tile, a headline and a subheadline summary, like the app's `SettingLabel`) in two
    groups split to balance height. The apps follow behind a segmented control (`.selector` as `role="tablist"`, arrow
    keys), and the panel is a grouped list with checkmarks (none for "coming soon").
  - `SetupTeaser.svelte`: the steps as a numbered inset-grouped list (a real sequence) beside the shared `CodeBlock`.
  - `Cta.svelte`: an App Store-style listing row. A 64 px squircle tile with the app icon's foreground mark
    (`$lib/components/AppIcon.svelte`, `static/brand/app-icon-fg.svg`), the title and platforms, and the actions trailing.
- List idiom (`home.css`): `.mh-group` (grouped card, 26 radius), `.mh-group-h` (footnote section header), `.mh-row`
  (row with an inset separator that starts at the text), `.mh-tile` (+ `.lg`, `-primary|-secondary|-tertiary|-neutral`
  tonal containers), `.mh-title`, `.mh-sub`, `.mh-squircle`.
- Every Modern id is prefixed `m-`. All copy comes from `components/home/content.ts` and `nav.ts`. The only strings
  that live in the components are the ones Retro already had (e.g. "Your server", "Any machine that runs Docker").

### Motion

Response motion in the iOS idiom, Modern only (every rule is scoped to `[data-design=modern]`). Under
`prefers-reduced-motion` it is instant: `app.css` zeroes transitions and animations, and the script-driven View
Transitions are skipped (`canTransition()` in `designs/modern/motion.ts`).

| Token                  | Value                             | Use                                               |
| ---------------------- | --------------------------------- | ------------------------------------------------- |
| `--m-dur-press`        | 160ms                             | button press, hover fills                         |
| `--m-dur-control`      | 320ms                             | segment thumb, switches, chevron                  |
| `--m-dur-panel`        | 380ms                             | menus, popovers, disclosure height, tab panels    |
| `--m-dur-page`         | 340ms                             | page push, theme/design crossfade                 |
| `--ease-spring`        | `cubic-bezier(0.3, 1.25, 0.5, 1)` | bouncy: thumbs, toggles, presses, the play button |
| `--m-ease-spring-soft` | `cubic-bezier(0.25, 1.1, 0.4, 1)` | slight overshoot: panels popping in               |
| `--m-ease-out`         | `cubic-bezier(0.22, 1, 0.36, 1)`  | heights, fades, page pushes                       |
| `--m-ease-in-out`      | `cubic-bezier(0.42, 0, 0.2, 1)`   | crossfades                                        |
| `--m-tint-dur`         | 1200ms                            | a cover change re-tinting a section               |

- Cover tints blend: `modern.css` registers the `--tint-*` roles with `@property` as `<color>`, so a section can
  `transition-property: --tint-primary, --tint-ink, ...` when its cover class (or `coverTint.ts` values) changes.
  Registration alone changes nothing; without a transition they still switch instantly. Don't write
  `var(--tint-x, fallback)`: a registered property always has a value (transparent outside `.tint`).

- Page changes: `onNavigate` in `+layout.svelte` wraps the navigation in `document.startViewTransition` (Modern only,
  never for same-page hash links, silently skipped where unsupported). The root pushes: the old page goes 1.5rem left and
  fades, and the new one comes in from 2.5rem right. The glass bar has `view-transition-name: m-nav` and stays put.
- Theme and design switches: `crossfade(update)` from `designs/modern/motion.ts` (a View Transition with `.m-vt-fade` on
  `<html>`). Switching from Retro is instant.
- Disclosures: every `<details>` on Modern animates its content's height and opacity (`::details-content` +
  `interpolate-size: allow-keywords`, where supported. Elsewhere it opens instantly). `.disclosure`'s chevron turns with
  the spring.
- Segmented controls (`.selector`, `ThemeSegmented`, `DesignToggle`): the thumb slides with `--ease-spring`.
- Buttons: `.key` presses to 0.97, and circle buttons to 0.92.
- Panels: utilities `m-pop-in` (scale 0.92 and fade, set `transform-origin`), `m-fade-in` and `m-rise-in` (fade with a
  6 px rise, e.g. a switched tab panel). Don't run them on page load.
- No ambient loops: the VU meters don't run on Modern, and nothing animates on page load.

### Do / don't

- Do: grouped backgrounds with inset-grouped cards; glass on chrome over something colourful; capsule controls; concentric
  radii; cover-derived colour where a cover is shown; SF/Inter at the iOS scale; system-like line icons (lucide).
- Don't: Retro hardware (screws, LEDs, condensed caps, the amber display, bevels) or its wording; glass on content cards or
  over flat empty backgrounds; gradient buttons or gradient text; three identical soft-shadow cards; glow blobs that aren't
  cover-derived; radii other than capsule/circle/group/concentric/16/28; colours outside the tokens.
