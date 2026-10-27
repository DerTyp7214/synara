/**
 * Cover tint (Modern design): the web counterpart of the apps' extractSeedColor + ColorSchemeBuilder.
 * Extracts a seed colour from a loaded cover <img> and sets the `--tint-<role>-dark/-light` variables on
 * an element, which `.tint` (tokens.css) turns into `--tint-<role>` for the current theme.
 *
 *   <div class="tint" bind:this={card}> <img src={cover} crossorigin="anonymous" onload={(e) => applyCoverTint(e.currentTarget, card)} /> </div>
 *
 * The image must be same-origin or served with CORS (and loaded with crossorigin="anonymous"), or the
 * canvas is tainted: then nothing is set and the element keeps the base tint. Never throws.
 * Static covers should use a build-time class instead (.tint-light-years, from pnpm gen:tokens).
 */
import { QuantizerCelebi, Score, argbFromRgb } from './mcu.js'
import { tintVars, TINT_ROLES } from './tonal.js'

const SIZE = 64 // downscale target: plenty for a dominant colour, cheap to quantise

/** Seed colour (ARGB) of an image, or null when it can't be read (CORS, not decoded, no canvas). */
export function seedFromImage(img: HTMLImageElement): number | null {
  try {
    if (!img.complete || !img.naturalWidth) return null
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = SIZE
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, SIZE, SIZE)
    const data = ctx.getImageData(0, 0, SIZE, SIZE).data // throws SecurityError when tainted
    const pixels: number[] = []
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 255) continue
      pixels.push(argbFromRgb(data[i], data[i + 1], data[i + 2]))
    }
    if (!pixels.length) return null
    const ranked = Score.score(QuantizerCelebi.quantize(pixels, 128), { desired: 1, filter: true })
    return ranked[0] ?? null
  } catch {
    return null
  }
}

/** Set the tint variables for `seed` on `el` (and add `.tint`). */
export function setTint(el: HTMLElement, seed: number): void {
  const t = tintVars(seed)
  for (const role of Object.keys(TINT_ROLES)) {
    el.style.setProperty(`--tint-${role}-dark`, t.dark[role])
    el.style.setProperty(`--tint-${role}-light`, t.light[role])
  }
  el.classList.add('tint')
}

/** Remove a runtime tint from `el`; it falls back to its class tint or the base seed. */
export function clearTint(el: HTMLElement): void {
  for (const role of Object.keys(TINT_ROLES)) {
    el.style.removeProperty(`--tint-${role}-dark`)
    el.style.removeProperty(`--tint-${role}-light`)
  }
}

/** Extract a seed from `img` and tint `el` with it. Returns false (and changes nothing) on failure. */
export function applyCoverTint(img: HTMLImageElement, el: HTMLElement): boolean {
  const seed = seedFromImage(img)
  if (seed === null) return false
  setTint(el, seed)
  return true
}
