// Cover tint roles for the Modern design. Plain JS so both the token generator (Node) and the
// client helper (coverTint.ts) use the same mapping.
//
// The palettes and tones mirror the apps' ColorSchemeBuilder (synara-android,
// material-color-utilities/.../ColorSchemeBuilder.kt): the primary palette keeps the seed's chroma,
// secondary is the seed hue at chroma 16, tertiary is hue + 60 at chroma 24, neutrals are chroma 4 / 8.
import { Hct, TonalPalette, hexFromArgb } from './mcu.js'

/** The neutral seed of the Modern design: the iOS AccentColor. */
export const SEED_HEX = '#FF8A00'

/**
 * @param {number} seed ARGB seed colour
 */
export function appPalettes(seed) {
  const hue = Hct.fromInt(seed).hue
  return {
    primary: TonalPalette.fromInt(seed),
    secondary: TonalPalette.fromHueAndChroma(hue, 16),
    tertiary: TonalPalette.fromHueAndChroma((hue + 60) % 360, 24),
    neutral: TonalPalette.fromHueAndChroma(hue, 4),
    neutralVariant: TonalPalette.fromHueAndChroma(hue, 8),
  }
}

/**
 * Tint role -> [palette, dark tone, light tone]. These become `--tint-<role>` on a `.tint` element.
 * @type {Record<string, [ 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutralVariant', number, number ]>}
 */
export const TINT_ROLES = {
  primary: ['primary', 80, 40],
  'on-primary': ['primary', 20, 100],
  container: ['primary', 30, 90],
  'on-container': ['primary', 90, 10],
  'secondary-container': ['secondary', 30, 90],
  'on-secondary-container': ['secondary', 90, 10],
  tertiary: ['tertiary', 80, 40],
  vivid: ['primary', 55, 70],
  surface: ['neutral', 12, 94],
  'surface-high': ['neutral', 17, 92],
  ink: ['neutral', 90, 10],
  muted: ['neutralVariant', 80, 30],
  outline: ['neutralVariant', 60, 50],
}

/**
 * Both modes of the tint roles for a seed, as hex strings.
 * @param {number} seed ARGB seed colour
 * @returns {{ dark: Record<string, string>, light: Record<string, string> }}
 */
export function tintVars(seed) {
  const p = appPalettes(seed)
  /** @type {Record<string, string>} */
  const dark = {}
  /** @type {Record<string, string>} */
  const light = {}
  for (const [role, [pal, d, l]] of Object.entries(TINT_ROLES)) {
    dark[role] = hexFromArgb(p[pal].tone(d))
    light[role] = hexFromArgb(p[pal].tone(l))
  }
  return { dark, light }
}
