<script lang="ts">
  import type { Snippet } from 'svelte'

  // Device frames for the /apps/ screenshots, drawn in CSS (no bitmap mockups). The screenshot goes in
  // `children` and is masked by the display shape. `look` picks the Modern (titanium, floating) or the
  // Retro (plain dark bezel for a display module) finish. Sizes are in cqw of the frame, so a frame
  // scales as one piece at any width.
  //
  // iPhone 17 Pro Max, from Apple's product bezel (Apple Design Resources, "Bezel-iPhone-17", PNG
  // "iPhone 17 Pro Max - Silver - Portrait", 1470x3000): the display opening is 1320x2868 at (75, 66),
  // the same size as a screenshot. Its corner reaches the 45 degree point 56 px in from the corner,
  // which a circular radius of 191 px matches (56 / (1 - 1/sqrt 2)), so 14.47% of the display width.
  // The band around the display is 47 px: a 27 px black border and a 20 px titanium rim.
  // The Dynamic Island is measured from the screenshots that contain it (02-home, 08-search,
  // 15/16-setup): x 517.7 to 801.3, y 41.7 to 151.3 of 1320x2868, a capsule.
  //
  // Pixel 8: 1080x2400. Corner radius, bezel and punch-hole size are estimates (not published). The
  // camera is centred on the status bar text (y 50 to 81 in the screenshots).
  //
  // Apple Watch Ultra 3, from Apple's bezel ("AW Ultra 3", 600x960): the display opening is 422x514 and
  // its corner reaches 45 degrees 34 px in, so a radius of about 116 px (27.5% of the width). The
  // screenshot's content is 410x502 (the rest is a black margin, cropped by the build script).
  //
  // card: a cropped Home Screen widget (the widget plus a little wallpaper), shown as a floating card
  // with its own rounded corners and no phone around it.
  type Kind = 'iphone' | 'pixel' | 'pixel-top' | 'watch' | 'window' | 'card'
  let {
    kind,
    look = 'modern',
    children,
    class: cls = '',
  }: { kind: Kind; look?: 'modern' | 'retro'; children: Snippet; class?: string } = $props()
</script>

<div class="dv dv-{kind} dv-{look} {cls}">
  <div class="body">
    <div class="screen">
      {@render children()}
      {#if kind === 'iphone'}<span class="island" aria-hidden="true"></span>{/if}
      {#if kind === 'pixel' || kind === 'pixel-top'}<span class="camera" aria-hidden="true"
        ></span>{/if}
    </div>
  </div>
  {#if kind === 'watch'}<span class="crown" aria-hidden="true"></span><span
      class="side"
      aria-hidden="true"
    ></span>{/if}
</div>

<style>
  /* Shadows reach at most about 6cqw sideways and 12cqw below a frame. Containers that clip (scrolling
     * galleries) keep that much padding around their frames. */
  .dv {
    container-type: inline-size;
    position: relative;
    width: 100%;
    /* Physical materials: the display glass is black on every device, the rim follows the look. */
    --dv-glass: #000;
    --dv-rim: color-mix(in oklab, var(--color-ink) 42%, var(--color-bg));
    --dv-rim-hi: color-mix(in oklab, var(--color-ink) 70%, var(--color-bg));
    --dv-rim-lo: color-mix(in oklab, var(--color-ink) 22%, var(--color-bg));
  }
  .body {
    position: relative;
  }
  .screen {
    position: relative;
    overflow: hidden;
    background: var(--dv-glass);
    /* Keeps the rounded mask crisp while the frame is transformed (Safari). */
    isolation: isolate;
  }
  /* No display here: Shot shows/hides its theme twins with display utilities. */
  .screen :global(img) {
    width: 100%;
    height: auto;
  }

  /* ---------- iPhone 17 Pro Max ----------
     * D = frame width = 100cqw. Display S = 1320 / (1320 + 2 * 47) D = 93.35cqw.
     * Band 47 px = 3.324cqw (black 1.909, titanium 1.415). Display radius 191 px = 13.51cqw, outer
     * radius 13.51 + 3.324 = 16.83cqw (concentric). */
  .dv-iphone .body {
    padding: 1.415cqw;
    border-radius: 16.83cqw;
  }
  .dv-iphone .screen {
    aspect-ratio: 1320 / 2868;
    border-radius: 13.51cqw;
    box-shadow: 0 0 0 1.909cqw var(--dv-glass);
    margin: 1.909cqw;
  }
  .island {
    position: absolute;
    left: 39.22%;
    top: 1.454%;
    width: 21.48%;
    height: 3.821%;
    border-radius: 999px;
    background: var(--dv-glass);
  }

  /* ---------- Pixel 8 (estimated) ----------
     * Band 3.8cqw (black 2.2, aluminium 1.6). Display S = 92.4cqw, radius 10% of S = 9.24cqw. */
  .dv-pixel .body,
  .dv-pixel-top .body {
    padding: 1.6cqw;
    border-radius: 13.04cqw;
  }
  .dv-pixel .screen,
  .dv-pixel-top .screen {
    aspect-ratio: 1080 / 2400;
    border-radius: 9.24cqw;
    box-shadow: 0 0 0 2.2cqw var(--dv-glass);
    margin: 2.2cqw;
  }
  /* Punch-hole: 44 px across, centred at y 66 of 2400. */
  .camera {
    position: absolute;
    left: 47.96%;
    top: 1.833%;
    width: 4.07%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--dv-glass);
    box-shadow: inset 0 0 0 0.3cqw color-mix(in oklab, var(--dv-glass) 70%, #fff);
  }
  /* The notification shot is the top 1010 px of the screen: the phone's top half, fading out. */
  .dv-pixel-top .screen {
    aspect-ratio: 1080 / 1010;
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }
  .dv-pixel-top .camera {
    top: calc(1.833% * 2400 / 1010);
    width: 4.07%;
  }
  .dv-pixel-top .body {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
    padding-bottom: 0;
    -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent);
    mask-image: linear-gradient(180deg, #000 70%, transparent);
  }
  .dv-pixel-top .screen {
    margin-bottom: 0;
  }

  /* ---------- Apple Watch Ultra 3 ----------
     * The body is 94cqw wide (6cqw on the right for the crown): case 5.2cqw + black border 3.2cqw, so the
     * display is 77.2cqw. Display radius 27.5% of that = 21.2cqw, concentric case radius 29.6cqw. */
  .dv-watch .body {
    width: 94cqw;
    padding: 8.4cqw;
    border-radius: 29.6cqw;
  }
  .dv-watch .screen {
    aspect-ratio: 410 / 502;
    border-radius: 21.2cqw;
    box-shadow: 0 0 0 3.2cqw var(--dv-glass);
    margin: 0;
  }
  .crown {
    position: absolute;
    right: 1.2cqw;
    top: 32%;
    width: 5.5cqw;
    height: 17cqw;
    border-radius: 1.6cqw;
    background: var(--dv-rim);
  }
  .side {
    position: absolute;
    right: 3cqw;
    top: 56%;
    width: 3cqw;
    height: 22cqw;
    border-radius: 1.2cqw;
    background: var(--dv-rim-lo);
  }

  /* ---------- Desktop window ----------
     * The screenshots already contain the app window, so the frame is the window's edge and shadow. */
  .dv-window .screen {
    aspect-ratio: 1600 / 1000;
    border-radius: 1.1cqw;
  }

  /* ---------- Widget card ---------- */
  .dv-card .screen {
    border-radius: 7cqw;
  }

  /* ---------- Modern finish: titanium rim, floating ---------- */
  .dv-modern.dv-iphone .body,
  .dv-modern.dv-pixel .body,
  .dv-modern.dv-pixel-top .body,
  .dv-modern.dv-watch .body {
    background: linear-gradient(
      135deg,
      var(--dv-rim-hi),
      var(--dv-rim) 30%,
      var(--dv-rim-lo) 55%,
      var(--dv-rim) 80%,
      var(--dv-rim-hi)
    );
    box-shadow:
      inset 0 0 0 0.25cqw color-mix(in oklab, var(--dv-rim-hi) 60%, transparent),
      0 2cqw 5cqw -2cqw rgb(0 0 0 / 0.4),
      0 6cqw 12cqw -6cqw rgb(0 0 0 / 0.3);
  }
  .dv-modern.dv-watch .crown {
    background: linear-gradient(90deg, var(--dv-rim-lo), var(--dv-rim-hi) 45%, var(--dv-rim));
  }
  .dv-modern.dv-card .screen {
    box-shadow:
      0 0 0 1px color-mix(in oklab, var(--color-ink) 12%, transparent),
      0 2cqw 5cqw -2cqw rgb(0 0 0 / 0.4),
      0 6cqw 12cqw -5cqw rgb(0 0 0 / 0.35);
  }
  .dv-modern.dv-window .screen {
    box-shadow:
      0 0 0 1px color-mix(in oklab, var(--color-ink) 16%, transparent),
      0 1cqw 2.5cqw -1cqw rgb(0 0 0 / 0.35),
      0 2.5cqw 5cqw -2cqw rgb(0 0 0 / 0.35);
  }

  /* ---------- Retro finish: a plain dark bezel that sits in a display module ---------- */
  .dv-retro {
    --dv-rim: var(--color-lcd);
  }
  .dv-retro.dv-iphone .body,
  .dv-retro.dv-pixel .body,
  .dv-retro.dv-pixel-top .body,
  .dv-retro.dv-watch .body {
    background: var(--color-lcd);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.07),
      0 0 0 1px rgb(0 0 0 / 0.5);
  }
  .dv-retro.dv-card .body {
    padding: 2cqw;
    border-radius: 9cqw;
    background: var(--color-lcd);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.07),
      0 0 0 1px rgb(0 0 0 / 0.5);
  }
  .dv-retro.dv-window .body {
    padding: 1.4cqw;
    border-radius: var(--radius-key);
    background: var(--color-lcd);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.07),
      0 0 0 1px rgb(0 0 0 / 0.5);
  }
  .dv-retro.dv-window .screen {
    border-radius: 2px;
  }
  .dv-retro .crown,
  .dv-retro .side {
    background: var(--color-lcd);
  }
</style>
