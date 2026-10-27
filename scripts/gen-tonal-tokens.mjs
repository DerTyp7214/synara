#!/usr/bin/env node
// Generates src/lib/designs/modern/tokens.css: the colour roles, glass tokens and iOS text-style scale
// of the Modern design, plus the build-time cover tint of the hero cover.
//
//   pnpm gen:tokens
//
// Colour: a tonal scheme from the iOS AccentColor #FF8A00 (iosApp/SynaraWidget/Assets.xcassets), built
// with material-color-utilities' DynamicScheme from the same palettes as the apps' ColorSchemeBuilder
// (primary keeps the seed chroma, secondary c16, tertiary hue+60 c24, neutral c4, neutral variant c8).
// Cover tint: QuantizerCelebi + Score on the downscaled cover (needs ImageMagick `magick` on PATH),
// then the tint roles from src/lib/designs/modern/tonal.js, which the client helper shares.
//
// The output is committed. Re-run after changing the seed, the cover or the role mapping, then update
// the matching hex values in src/app.html and src/lib/theme.ts (this script prints them and warns
// when app.html is out of date).
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  argbFromHex,
  argbFromRgb,
  DynamicScheme,
  hexFromArgb,
  Hct,
  MaterialDynamicColors,
  QuantizerCelebi,
  Score,
  TonalPalette,
} from '@material/material-color-utilities'
import { appPalettes, SEED_HEX, tintVars, TINT_ROLES } from '../src/lib/designs/modern/tonal.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const OUT = root + 'src/lib/designs/modern/tokens.css'
const COVERS = [
  { name: 'light-years', file: 'static/demo/covers/light-years.webp' },
  { name: 'directionless', file: 'static/demo/covers/directionless.webp' },
]

const seed = argbFromHex(SEED_HEX)
const mdc = MaterialDynamicColors

/** @param {boolean} isDark */
function scheme(isDark) {
  const p = appPalettes(seed)
  return new DynamicScheme({
    sourceColorArgb: seed,
    variant: 2, // Variant.TONAL_SPOT (the enum is not exported from the 0.3 entry point)
    contrastLevel: 0,
    isDark,
    primaryPalette: p.primary,
    secondaryPalette: p.secondary,
    tertiaryPalette: p.tertiary,
    neutralPalette: p.neutral,
    neutralVariantPalette: p.neutralVariant,
  })
}

const hex = (argb) => hexFromArgb(argb).toLowerCase()
const rgbA = (argb, a) => `rgb(${(argb >> 16) & 255} ${(argb >> 8) & 255} ${argb & 255} / ${a})`
const lum = (argb) => {
  const c = [(argb >> 16) & 255, (argb >> 8) & 255, argb & 255].map((v) => {
    v /= 255
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

// Status hues: iOS systemGreen / systemYellow, on the same tonal footing as the scheme.
const okPalette = TonalPalette.fromHueAndChroma(Hct.fromInt(argbFromHex('#34C759')).hue, 48)
const warnPalette = TonalPalette.fromHueAndChroma(Hct.fromInt(argbFromHex('#FFCC00')).hue, 56)

/** @param {boolean} isDark */
function roles(isDark) {
  const s = scheme(isDark)
  const p = appPalettes(seed)
  const g = (dc) => dc.getArgb(s)
  const on = g(mdc.onSurface)
  // iOS grouped backgrounds. systemGroupedBackground is neutral grey, so these come from a
  // neutral palette (chroma 0) rather than the scheme's chroma-4 neutrals:
  //   grouped    = systemGroupedBackground (the page)
  //   grouped-2  = secondarySystemGroupedBackground (cards and inset-grouped rows)
  //   grouped-3  = tertiarySystemGroupedBackground (fills inside a card)
  const gp = TonalPalette.fromHueAndChroma(0, 0)
  const [grouped, grouped2, grouped3] = (isDark ? [4, 12, 18] : [95, 100, 96]).map((t) =>
    gp.tone(t)
  )
  // faint (tertiary text) must stay AA on every grouped level: tone 65 / 42 of the neutral variant.
  const faint = p.neutralVariant.tone(isDark ? 65 : 42)
  const a = {
    raw: { on, grouped, grouped2, grouped3, faint },
    generic: {
      '--color-bg': hex(grouped),
      '--color-surface': hex(grouped2),
      '--color-raised': hex(
        isDark ? g(mdc.surfaceContainerHighest) : g(mdc.surfaceContainerLowest)
      ),
      '--color-recess': hex(grouped3),
      '--color-ink': hex(on),
      '--color-muted': hex(g(mdc.onSurfaceVariant)),
      '--color-faint': hex(faint),
      '--color-line': rgbA(on, isDark ? 0.14 : 0.13),
      '--color-line-strong': rgbA(on, isDark ? 0.26 : 0.24),
      '--color-accent': hex(g(mdc.primary)),
      '--color-accent-ink': hex(g(mdc.primary)),
      '--color-on-accent': hex(g(mdc.onPrimary)),
      '--color-ok': hex(okPalette.tone(isDark ? 80 : 40)),
      '--color-warn': hex(warnPalette.tone(isDark ? 80 : 40)),
    },
    modern: {
      '--m-seed': SEED_HEX.toLowerCase(),
      '--m-grouped-bg': hex(grouped),
      '--m-grouped-bg-2': hex(grouped2),
      '--m-grouped-bg-3': hex(grouped3),
      '--m-surface': hex(g(mdc.surface)),
      '--m-surface-container-lowest': hex(g(mdc.surfaceContainerLowest)),
      '--m-surface-container-low': hex(g(mdc.surfaceContainerLow)),
      '--m-surface-container': hex(g(mdc.surfaceContainer)),
      '--m-surface-container-high': hex(g(mdc.surfaceContainerHigh)),
      '--m-surface-container-highest': hex(g(mdc.surfaceContainerHighest)),
      '--m-on-surface': hex(on),
      '--m-on-surface-variant': hex(g(mdc.onSurfaceVariant)),
      '--m-primary': hex(g(mdc.primary)),
      '--m-on-primary': hex(g(mdc.onPrimary)),
      '--m-primary-container': hex(g(mdc.primaryContainer)),
      '--m-on-primary-container': hex(g(mdc.onPrimaryContainer)),
      '--m-secondary': hex(g(mdc.secondary)),
      '--m-on-secondary': hex(g(mdc.onSecondary)),
      '--m-secondary-container': hex(g(mdc.secondaryContainer)),
      '--m-on-secondary-container': hex(g(mdc.onSecondaryContainer)),
      '--m-tertiary': hex(g(mdc.tertiary)),
      '--m-on-tertiary': hex(g(mdc.onTertiary)),
      '--m-tertiary-container': hex(g(mdc.tertiaryContainer)),
      '--m-on-tertiary-container': hex(g(mdc.onTertiaryContainer)),
      '--m-error': hex(g(mdc.error)),
      '--m-on-error': hex(g(mdc.onError)),
      '--m-outline': hex(g(mdc.outline)),
      '--m-outline-variant': hex(g(mdc.outlineVariant)),
      // Fills for tinted controls (iOS "tinted" buttons, the segmented-control track).
      '--m-tint-fill': rgbA(g(mdc.primary), isDark ? 0.2 : 0.14),
      '--m-tint-fill-hover': rgbA(g(mdc.primary), isDark ? 0.28 : 0.2),
      '--m-fill': rgbA(on, isDark ? 0.12 : 0.07),
      '--m-fill-strong': rgbA(on, isDark ? 0.2 : 0.12),
    },
    glass: isDark
      ? {
          '--glass-bg': rgbA(grouped3, 0.6),
          '--glass-solid': hex(grouped3),
          '--glass-border': 'rgb(255 255 255 / 0.12)',
          '--glass-highlight': 'rgb(255 255 255 / 0.22)',
          '--glass-specular':
            'linear-gradient(180deg, rgb(255 255 255 / 0.10), rgb(255 255 255 / 0) 42%)',
          '--glass-shadow': '0 10px 30px -8px rgb(0 0 0 / 0.55), 0 1px 3px rgb(0 0 0 / 0.3)',
        }
      : {
          '--glass-bg': 'rgb(255 255 255 / 0.62)',
          '--glass-solid': hex(g(mdc.surfaceContainerLowest)),
          '--glass-border': 'rgb(255 255 255 / 0.7)',
          '--glass-highlight': 'rgb(255 255 255 / 0.95)',
          '--glass-specular':
            'linear-gradient(180deg, rgb(255 255 255 / 0.55), rgb(255 255 255 / 0) 45%)',
          '--glass-shadow': '0 10px 30px -10px rgb(0 0 0 / 0.18), 0 1px 3px rgb(0 0 0 / 0.08)',
        },
  }
  return a
}

// iOS text styles (Large / default Dynamic Type size), in px. Weights are the emphasised weights the app
// uses for headings; body styles stay regular. Tracking follows SF Pro's size-specific tracking.
const TYPE = [
  ['large-title', 34, 41, 700, '0.011em'],
  ['title1', 28, 34, 700, '0.013em'],
  ['title2', 22, 28, 700, '0.016em'],
  ['title3', 20, 25, 600, '0.019em'],
  ['headline', 17, 22, 600, '-0.025em'],
  ['body', 17, 22, 400, '-0.025em'],
  ['callout', 16, 21, 400, '-0.02em'],
  ['subheadline', 15, 20, 400, '-0.015em'],
  ['footnote', 13, 18, 400, '-0.006em'],
  ['caption1', 12, 16, 400, '0'],
  ['caption2', 11, 13, 400, '0.006em'],
]

function coverSeed(file) {
  const buf = execFileSync('magick', [root + file, '-resize', '128x128!', '-depth', '8', 'rgb:-'], {
    maxBuffer: 1 << 24,
  })
  const pixels = []
  for (let i = 0; i + 2 < buf.length; i += 3)
    pixels.push(argbFromRgb(buf[i], buf[i + 1], buf[i + 2]))
  // QuantizerWsmeans seeds extra clusters with Math.random; pin it so the output is reproducible.
  const random = Math.random
  let st = 0x5eed
  Math.random = () => {
    st = (st + 0x6d2b79f5) | 0
    let t = Math.imul(st ^ (st >>> 15), 1 | st)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const ranked = Score.score(QuantizerCelebi.quantize(pixels, 128), {
    desired: 1,
    fallbackColorARGB: seed,
  })
  Math.random = random
  return ranked[0]
}

const decls = (obj, indent) =>
  Object.entries(obj)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n')

const dark = roles(true)
const light = roles(false)

// Contrast report and guard: text roles must be AA (4.5) on every grouped level.
const report = []
let failed = false
for (const [mode, r] of [
  ['dark', dark],
  ['light', light],
]) {
  for (const role of ['--color-ink', '--color-muted', '--color-faint', '--color-accent-ink']) {
    const fg = argbFromHex(r.generic[role])
    for (const [bgName, bg] of [
      ['grouped', r.raw.grouped],
      ['grouped-2', r.raw.grouped2],
      ['grouped-3', r.raw.grouped3],
    ]) {
      const c = contrast(fg, bg)
      if (c < 4.5) failed = true
      report.push(`${mode.padEnd(5)} ${role.padEnd(20)} on ${bgName.padEnd(9)} ${c.toFixed(2)}`)
    }
  }
  const c = contrast(
    argbFromHex(r.generic['--color-on-accent']),
    argbFromHex(r.generic['--color-accent'])
  )
  if (c < 4.5) failed = true
  report.push(`${mode.padEnd(5)} on-accent on accent             ${c.toFixed(2)}`)
}

const typeDecls = TYPE.map(
  ([n, size, lh, w, tr]) =>
    `\t\t--ios-${n}-size: ${size / 16}rem;\n\t\t--ios-${n}-leading: ${lh / 16}rem;\n\t\t--ios-${n}-weight: ${w};\n\t\t--ios-${n}-tracking: ${tr};`
).join('\n')

const tintRoleNames = Object.keys(TINT_ROLES)
const tintMap = (mode) =>
  tintRoleNames
    .map((r) => `\t--tint-${r}: var(--tint-${r}-${mode}, var(--tint-${r}-base-${mode}));`)
    .join('\n')
const base = tintVars(seed)
const tintBase = (mode) =>
  tintRoleNames.map((r) => `\t--tint-${r}-base-${mode}: ${base[mode][r].toLowerCase()};`).join('\n')

const covers = COVERS.map(({ name, file }) => {
  const s = coverSeed(file)
  const t = tintVars(s)
  const lines = [`.tint-${name} {`, `\t/* ${file}: seed ${hex(s)} */`, `\t--tint-seed: ${hex(s)};`]
  for (const mode of ['dark', 'light'])
    for (const r of tintRoleNames) lines.push(`\t--tint-${r}-${mode}: ${t[mode][r].toLowerCase()};`)
  lines.push('}')
  return { name, seed: hex(s), css: lines.join('\n') }
})

const css = `/*
 * GENERATED by scripts/gen-tonal-tokens.mjs (pnpm gen:tokens). Do not edit by hand.
 * Modern design tokens: tonal roles from seed ${SEED_HEX} (iOS AccentColor), glass tokens,
 * the iOS text-style scale and build-time cover tints. See DESIGN.md, "Modern".
 */

@layer theme {
	:root[data-design="modern"] {
		/* Generic roles (both designs define these). Dark first; light below. */
${decls(dark.generic, '\t\t')}

		/* Modern roles: grouped backgrounds, surface containers, tonal accents. */
${decls(dark.modern, '\t\t')}

		/* Liquid Glass */
${decls(dark.glass, '\t\t')}
		--glass-blur: 24px;
		--glass-saturate: 180%;

		/* iOS text styles: --ios-<style>-size / -leading / -weight / -tracking */
${typeDecls}

		@variant light {
${decls(light.generic, '\t\t\t')}

${decls(light.modern, '\t\t\t')}

${decls(light.glass, '\t\t\t')}
		}
	}
}

/*
 * Cover tints. Put \`.tint\` on a container to get --tint-<role> for the current theme
 * (roles: ${tintRoleNames.join(', ')}).
 * A cover class (.tint-<cover>) or coverTint.ts supplies --tint-<role>-dark / -light; without them the
 * roles fall back to the base seed.
 */
@layer base {
	.tint {
${tintBase('dark').replace(/^\t/gm, '\t\t')}
${tintBase('light').replace(/^\t/gm, '\t\t')}
${tintMap('dark').replace(/^\t/gm, '\t\t')}
		@variant light {
${tintMap('light').replace(/^\t/gm, '\t\t\t')}
		}
	}

${covers.map((c) => c.css.replace(/^/gm, '\t')).join('\n\n')}
}
`

writeFileSync(OUT, css)
console.log('wrote', OUT.replace(root, ''))
console.log(report.join('\n'))
const meta = {
  'modern dark bg': dark.generic['--color-bg'],
  'modern light bg': light.generic['--color-bg'],
  'modern dark ink': dark.generic['--color-ink'],
  'modern light ink': light.generic['--color-ink'],
}
console.log('pre-paint / theme-color values:', meta)
for (const c of covers) console.log(`cover ${c.name}: seed ${c.seed}`)

const appHtml = readFileSync(root + 'src/app.html', 'utf8')
const missing = Object.values(meta).filter((v) => !appHtml.includes(v))
if (missing.length)
  console.warn(
    'WARNING: src/app.html is missing',
    missing,
    '- update its pre-paint table and META.'
  )
if (failed) {
  console.error('Contrast below 4.5:1, see the report above.')
  process.exit(1)
}
