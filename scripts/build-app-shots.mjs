#!/usr/bin/env node
// Converts the raw app screenshots in shots/ (gitignored) into the responsive images used by /apps/, and
// writes the manifest the page reads (sizes, widths, which themes exist).
//
// Each size is written twice: AVIF (served first, through <picture>) and WebP (the fallback).
// The screenshots are mostly dark gradients and saturated UI colour, which lossy WebP at the default
// settings turns into 16 px blocks and colour fringes. AVIF at quality 65 with full-resolution chroma
// (4:4:4) keeps the gradients as smooth as the PNG and is still smaller than the old WebP. The WebP
// fallback uses quality 90, sharp RGB-to-YUV conversion and no spatial noise shaping, which removes
// most of the blocking.
//
//   pnpm build:app-shots
//
// Needs ImageMagick 7 (`magick`) with AVIF (libheif) on PATH. Output goes to
// static/apps/<platform>/<name>-<theme>-<w>.{avif,webp}
// and src/lib/components/apps/shots.ts. Both are committed; the raw shots are not.
//
// Sources: iOS from shots/ios/admin/{dark,light} (iPhone 17 Pro Max, 1320x2868), Android from
// shots/android (Pixel 8, 1080x2400, `-light` twins), desktop from shots/desktop (3200x2000, `-light`
// twins; the fullscreen player screens are dark-only by design).
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const SHOTS = root + 'shots/'
const OUT = root + 'static/apps/'
const MANIFEST = root + 'src/lib/components/apps/shots.ts'
const AVIF = ['-quality', '65', '-define', 'heic:chroma=444', '-define', 'heic:speed=4']
const WEBP = [
  '-quality',
  '90',
  '-define',
  'webp:method=6',
  '-define',
  'webp:use-sharp-yuv=true',
  '-define',
  'webp:sns-strength=0',
]
const TMP = mkdtempSync(join(tmpdir(), 'app-shots-'))

const PHONE_HERO = [360, 720, 1080]
const PHONE = [360, 720]
const DESKTOP = [800, 1600]
const WIDGET = [400, 800]

/**
 * key: used by the page. dark/light: source files (light may be missing: the dark shot is used in both
 * themes). crop: ImageMagick geometry (WxH+X+Y in source pixels) applied to both themes before resizing.
 * @type {{ key: string, platform: 'ios' | 'android' | 'desktop', dark: string, light?: string, widths: number[], crop?: string }[]}
 */
const SHOT_LIST = [
  // iOS (user "Sam")
  {
    key: 'ios-now-playing',
    platform: 'ios',
    dark: 'ios/admin/dark/01-now-playing.png',
    light: 'ios/admin/light/01-now-playing.png',
    widths: PHONE_HERO,
  },
  {
    key: 'ios-home',
    platform: 'ios',
    dark: 'ios/admin/dark/02-home.png',
    light: 'ios/admin/light/02-home.png',
    widths: PHONE,
  },
  // Same screen with Settings > General > Colorful Home Cards on, for the reveal slider.
  {
    key: 'ios-home-colorful',
    platform: 'ios',
    dark: 'ios/admin/dark/02-home-colorful.png',
    light: 'ios/admin/light/02-home-colorful.png',
    widths: PHONE,
  },
  // The setup sheets shown after the first login.
  {
    key: 'ios-setup-sync',
    platform: 'ios',
    dark: 'ios/admin/dark/15-setup-sync.png',
    light: 'ios/admin/light/15-setup-sync.png',
    widths: PHONE,
  },
  {
    key: 'ios-setup-remote',
    platform: 'ios',
    dark: 'ios/admin/dark/16-setup-remote-control.png',
    light: 'ios/admin/light/16-setup-remote-control.png',
    widths: PHONE,
  },
  {
    key: 'ios-setup-optional',
    platform: 'ios',
    dark: 'ios/admin/dark/17-setup-optional-features.png',
    light: 'ios/admin/light/17-setup-optional-features.png',
    widths: PHONE,
  },
  {
    key: 'ios-album',
    platform: 'ios',
    dark: 'ios/admin/dark/03-album.png',
    light: 'ios/admin/light/03-album.png',
    widths: PHONE,
  },
  {
    key: 'ios-lyrics',
    platform: 'ios',
    dark: 'ios/admin/dark/04-lyrics.png',
    light: 'ios/admin/light/04-lyrics.png',
    widths: PHONE,
  },
  {
    key: 'ios-stats',
    platform: 'ios',
    dark: 'ios/admin/dark/05-listening-stats-all-time.png',
    light: 'ios/admin/light/05-listening-stats-all-time.png',
    widths: PHONE,
  },
  {
    key: 'ios-connect',
    platform: 'ios',
    dark: 'ios/admin/dark/13-server-setup.png',
    light: 'ios/admin/light/13-server-setup.png',
    widths: PHONE,
  },
  {
    key: 'ios-login',
    platform: 'ios',
    dark: 'ios/admin/dark/14-login.png',
    light: 'ios/admin/light/14-login.png',
    widths: PHONE,
  },
  // Only the Synara widget with a little wallpaper around it: the rest of that Home Screen shows other
  // apps (and a test runner), the Synara icon label, the dock and the status bar. The label starts at y 833.
  {
    key: 'ios-widget',
    platform: 'ios',
    dark: 'ios/admin/light/10-home-screen-widget.png',
    widths: WIDGET,
    crop: '1194x578+63+252',
  },
  // 422x514 canvas; the screen content is 410x502 (the rest is a black margin).
  {
    key: 'ios-watch',
    platform: 'ios',
    dark: 'ios/11-apple-watch.png',
    widths: [205, 410],
    crop: '410x502+0+0',
  },

  // Android
  {
    key: 'android-now-playing',
    platform: 'android',
    dark: 'android/android-01-now-playing.png',
    light: 'android/android-01-now-playing-light.png',
    widths: PHONE_HERO,
  },
  {
    key: 'android-home',
    platform: 'android',
    dark: 'android/android-02-home.png',
    light: 'android/android-02-home-light.png',
    widths: PHONE,
  },
  {
    key: 'android-album',
    platform: 'android',
    dark: 'android/android-03-album.png',
    light: 'android/android-03-album-light.png',
    widths: PHONE,
  },
  {
    key: 'android-lyrics',
    platform: 'android',
    dark: 'android/android-10-lyrics.png',
    light: 'android/android-10-lyrics-light.png',
    widths: PHONE,
  },
  {
    key: 'android-stats',
    platform: 'android',
    dark: 'android/android-04-stats.png',
    light: 'android/android-04-stats-light.png',
    widths: PHONE,
  },
  {
    key: 'android-connect',
    platform: 'android',
    dark: 'android/android-11-connect.png',
    light: 'android/android-11-connect-light.png',
    widths: PHONE,
  },
  {
    key: 'android-login',
    platform: 'android',
    dark: 'android/android-12-login.png',
    light: 'android/android-12-login-light.png',
    widths: PHONE,
  },
  // Only the widget (x 67 to 1012, y 791 to 1062) with a 40 px margin: no launcher icons, search bar or status bar.
  {
    key: 'android-widget',
    platform: 'android',
    dark: 'android/android-07-widget.png',
    light: 'android/android-07-widget-light.png',
    widths: WIDGET,
    crop: '1026x352+47+751',
  },
  {
    key: 'android-notification',
    platform: 'android',
    dark: 'android/android-08-notification.png',
    light: 'android/android-08-notification-light.png',
    widths: [540, 1080],
  },

  // Desktop
  {
    key: 'desktop-album',
    platform: 'desktop',
    dark: 'desktop/desktop-02-album.png',
    light: 'desktop/desktop-02-album-light.png',
    widths: DESKTOP,
  },
  {
    key: 'desktop-visualizer',
    platform: 'desktop',
    dark: 'desktop/desktop-04-fullscreen-visualizer.png',
    widths: DESKTOP,
  },
  {
    key: 'desktop-stats',
    platform: 'desktop',
    dark: 'desktop/desktop-06-stats.png',
    light: 'desktop/desktop-06-stats-light.png',
    widths: DESKTOP,
  },
  {
    key: 'desktop-library',
    platform: 'desktop',
    dark: 'desktop/desktop-05-library.png',
    light: 'desktop/desktop-05-library-light.png',
    widths: DESKTOP,
  },
  {
    key: 'desktop-connect',
    platform: 'desktop',
    dark: 'desktop/desktop-11-connect.png',
    light: 'desktop/desktop-11-connect-light.png',
    widths: DESKTOP,
  },
  {
    key: 'desktop-login',
    platform: 'desktop',
    dark: 'desktop/desktop-12-login.png',
    light: 'desktop/desktop-12-login-light.png',
    widths: DESKTOP,
  },
  {
    key: 'desktop-lyrics',
    platform: 'desktop',
    dark: 'desktop/desktop-08-lyrics.png',
    widths: DESKTOP,
  },
  {
    key: 'desktop-queue',
    platform: 'desktop',
    dark: 'desktop/desktop-09-queue.png',
    widths: DESKTOP,
  },
]

function size(file, crop) {
  const args = [file]
  if (crop) args.push('-crop', crop, '+repage')
  args.push('-format', '%w %h', 'info:')
  const [w, h] = execFileSync('magick', args, { encoding: 'utf8' }).trim().split(' ').map(Number)
  return { w, h }
}

/** Resize once to a lossless intermediate, then encode it as AVIF and WebP. Returns the bytes written. */
function convert(src, destBase, width, crop) {
  const mid = join(TMP, 'mid.png')
  const args = [src]
  if (crop) args.push('-crop', crop, '+repage')
  args.push(
    '-colorspace',
    'sRGB',
    '-depth',
    '8',
    '-filter',
    'Lanczos',
    '-resize',
    `${width}x`,
    '-strip',
    mid
  )
  execFileSync('magick', args)
  execFileSync('magick', [mid, ...AVIF, `${destBase}.avif`])
  execFileSync('magick', [mid, ...WEBP, `${destBase}.webp`])
  return statSync(`${destBase}.avif`).size + statSync(`${destBase}.webp`).size
}

const missing = SHOT_LIST.flatMap((s) => [s.dark, s.light].filter(Boolean)).filter(
  (f) => !existsSync(SHOTS + f)
)
if (missing.length) {
  console.error(
    `Missing source shots (shots/ is gitignored, so it is only on machines that have it):\n  ${missing.join('\n  ')}`
  )
  process.exit(1)
}

rmSync(OUT, { recursive: true, force: true })
const manifest = {}
let total = 0
for (const s of SHOT_LIST) {
  mkdirSync(OUT + s.platform, { recursive: true })
  const { w, h } = size(SHOTS + s.dark, s.crop)
  const name = s.key.slice(s.platform.length + 1)
  const themes = s.light ? ['dark', 'light'] : ['dark']
  for (const theme of themes) {
    for (const width of s.widths) {
      const dest = `${OUT}${s.platform}/${name}-${theme}-${width}`
      total += convert(SHOTS + (theme === 'dark' ? s.dark : s.light), dest, width, s.crop)
    }
  }
  manifest[s.key] = {
    base: `/apps/${s.platform}/${name}`,
    w,
    h,
    widths: s.widths,
    light: Boolean(s.light),
  }
  console.log(`${s.key}: ${w}x${h} -> ${s.widths.join('/')} (${themes.join(', ')})`)
}

const ts = `// Generated by scripts/build-app-shots.mjs (pnpm build:app-shots). Do not edit.
// base: the URL prefix, files are <base>-<dark|light>-<width>.{avif,webp}. light: false means the dark shot
// is shown in both themes. w/h: the source size (aspect ratio).

export type ShotInfo = { base: string; w: number; h: number; widths: number[]; light: boolean };

export const shots = ${JSON.stringify(manifest, null, '\t')} as const satisfies Record<string, ShotInfo>;

export type ShotKey = keyof typeof shots;
`
writeFileSync(MANIFEST, ts)
rmSync(TMP, { recursive: true, force: true })
console.log(
  `\n${Object.keys(manifest).length} shots, ${(total / 1024 / 1024).toFixed(2)} MiB in static/apps/`
)
