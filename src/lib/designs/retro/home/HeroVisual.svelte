<script lang="ts">
  import { onMount } from 'svelte'
  import Play from '@lucide/svelte/icons/play'
  import Pause from '@lucide/svelte/icons/pause'
  import { design } from '$lib/designs/design.svelte'

  // The display section of the front panel: a now-playing readout and stereo VU meters.
  // Fictional track; nothing here is a real screenshot.
  const DURATION = 258 // 4:18
  const START = 96
  const SEGMENTS = 32
  const segs = Array.from({ length: SEGMENTS }, (_, i) => i)

  const lyrics = [
    { at: 88, text: 'the harbour lights are counting down' },
    { at: 98, text: 'every ferry going home without us' },
    { at: 108, text: 'so we stay until the water turns to gold' },
    { at: 118, text: 'and the radio forgets our names' },
    { at: 128, text: 'low tide, low tide hours' },
  ]

  let elapsed = $state(START)
  let playing = $state(true)
  let still = $state(false) // prefers-reduced-motion

  const progress = $derived(elapsed / DURATION)
  const current = $derived(lyrics.reduce((acc, l, i) => (elapsed >= l.at ? i : acc), -1))
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  // VU scale: position (0..1) of each mark along the arc. Real VU scales are not linear.
  const marks: [string, number, boolean][] = [
    ['20', 0, false],
    ['10', 0.22, false],
    ['7', 0.35, false],
    ['5', 0.45, false],
    ['3', 0.58, false],
    ['2', 0.65, false],
    ['1', 0.73, false],
    ['0', 0.8, true],
    ['1', 0.86, true],
    ['2', 0.93, true],
    ['3', 1, true],
  ]
  const SWEEP = 96 // degrees, -48 .. +48
  const CX = 80,
    CY = 122,
    R = 84
  const angle = (f: number) => -SWEEP / 2 + f * SWEEP
  const pt = (f: number, r: number) => {
    const a = (angle(f) * Math.PI) / 180
    return [CX + r * Math.sin(a), CY - r * Math.cos(a)].map((n) => Math.round(n * 100) / 100)
  }
  const arc = (f0: number, f1: number, r: number) => {
    const [x0, y0] = pt(f0, r)
    const [x1, y1] = pt(f1, r)
    return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`
  }
  const REST = 0.5 // where the needles sit when motion is reduced

  let needles: SVGGElement[] = $state([])
  let peaks: HTMLSpanElement[] = $state([])
  // start/stop of the meter loop, set on mount. The loop only runs while Retro is the active design.
  let loop: { start: () => void; stop: () => void } | null = null

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    still = reduce.matches
    const level = [0, 0]
    let visible = true
    let raf = 0
    let last = performance.now()
    let tick = 0

    const set = () => {
      needles.forEach((n, i) =>
        n?.setAttribute('transform', `rotate(${angle(level[i]).toFixed(2)} ${CX} ${CY})`)
      )
      peaks.forEach((p, i) => p?.classList.toggle('on', level[i] > 0.8))
    }

    // A cheap synthetic programme signal: a kick on the beat, a slow swell, some jitter.
    const signal = (t: number, ch: number) => {
      const beat = (t * 2.07) % 1 // ~124 bpm
      const kick = Math.exp(-beat * 7) * 0.32
      const swell = 0.5 + 0.12 * Math.sin(t * 0.45 + ch) + 0.07 * Math.sin(t * 1.7 + ch * 2.1)
      const jitter = (Math.sin(t * 13.1 + ch * 5) + Math.sin(t * 7.3 + ch)) * 0.035
      return Math.min(1.03, Math.max(0, swell + kick + jitter))
    }

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const t = now / 1000
      for (let ch = 0; ch < 2; ch++) {
        const target = playing ? signal(t, ch) : 0
        // VU ballistics: roughly 300 ms to reach the reading.
        const k = 1 - Math.exp(-dt / (playing ? 0.09 : 0.22))
        level[ch] += (target - level[ch]) * k
      }
      set()
      tick += dt
      if (tick >= 1) {
        tick -= 1
        if (playing) elapsed = elapsed >= 138 ? START : elapsed + 1
      }
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (raf || still || !visible || document.hidden || !design.isRetro) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    loop = { start, stop }
    if (still) {
      level[0] = REST
      level[1] = REST - 0.04
      set()
    } else start()

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
      else stop()
    })
    if (needles[0]) io.observe(needles[0].ownerSVGElement!)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    const onMotion = () => {
      still = reduce.matches
      if (still) {
        stop()
        level[0] = REST
        level[1] = REST - 0.04
        set()
      } else start()
    }
    reduce.addEventListener('change', onMotion)
    return () => {
      stop()
      loop = null
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      reduce.removeEventListener('change', onMotion)
    }
  })

  // Follow design switches: stop the loop when Modern takes over, resume when Retro returns.
  $effect(() => {
    const retro = design.isRetro
    if (!loop) return
    if (retro) loop.start()
    else loop.stop()
  })
</script>

<figure
  class="display"
  aria-label="Illustration: the Synara player showing a lossless track, synced lyrics and level meters"
>
  <div class="lcd screen" aria-hidden="true">
    <div class="row small lcd-dim">
      <span class="text-(--color-lcd-ink)">{playing && !still ? '▶ PLAY' : '❚❚ PAUSE'}</span>
      <span>TRK 04</span>
      <span>FLAC 24/96</span>
    </div>

    <div class="mt-2 flex items-end justify-between gap-4">
      <span class="time lcd-dots">{fmt(elapsed)}</span>
      <span class="small lcd-dim pb-1.5 text-right">
        <span class="block">-{fmt(DURATION - elapsed)}</span>
        <span class="block">OUT DESKTOP</span>
      </span>
    </div>

    <div class="segs mt-3">
      {#each segs as i (i)}
        <span class:lit={i / SEGMENTS < progress}></span>
      {/each}
    </div>

    <p class="title mt-3">LOW TIDE HOURS</p>
    <p class="small lcd-dim truncate">MARROW COAST / HARBOUR LIGHTS</p>
    <p class="lyric mt-3 truncate">{current >= 0 ? lyrics[current].text : ''}</p>

    <div class="row small lcd-dim mt-3 border-t border-(--color-lcd-ghost) pt-2">
      <span><span class="dot"></span>SERVER ONLINE</span>
      <span>QUEUE SHARED</span>
    </div>
  </div>

  <div class="meters mt-5">
    {#each [0, 1] as ch (ch)}
      <div class="meter" aria-hidden="true">
        <svg viewBox="0 0 160 92" class="block w-full">
          <defs>
            <linearGradient id="vu-face-{ch}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#f7e2b0" />
              <stop offset="1" stop-color="#e7b968" />
            </linearGradient>
          </defs>
          <rect width="160" height="92" fill="url(#vu-face-{ch})" />
          <path d={arc(0, 0.8, R)} class="scale" />
          <path d={arc(0.8, 1, R)} class="scale red" />
          <path d={arc(0.8, 1, R - 3)} class="redband" />
          {#each marks as [label, f, red], i (i)}
            {@const [x0, y0] = pt(f, R)}
            {@const [x1, y1] = pt(f, R + 6)}
            {@const [tx, ty] = pt(f, R + 13)}
            <line x1={x0} y1={y0} x2={x1} y2={y1} class="tick {red ? 'red' : ''}" />
            <text x={tx} y={ty + 2.5} class="num {red ? 'red' : ''}">{label}</text>
          {/each}
          <text x="80" y="74" class="vu">VU</text>
          <text x="14" y="84" class="ch">{ch === 0 ? 'L' : 'R'}</text>
          <g bind:this={needles[ch]} transform="rotate({angle(0)} {CX} {CY})">
            <line x1={CX} y1={CY} x2={CX} y2={CY - R - 5} class="needle" />
          </g>
          <rect width="160" height="92" class="glass" />
        </svg>
        <span class="peak" bind:this={peaks[ch]}></span>
      </div>
    {/each}
  </div>

  <div class="mt-4 flex items-center gap-3">
    <button type="button" class="key key-sm" onclick={() => (playing = !playing)} disabled={still}>
      {#if playing && !still}<Pause class="size-3.5 fill-current" aria-hidden="true" /> Pause demo{:else}<Play
          class="size-3.5 fill-current"
          aria-hidden="true"
        /> Play demo{/if}
    </button>
    <span class="legend">Level</span>
  </div>
</figure>

<style>
  .screen {
    padding: 1rem 1.15rem 0.85rem;
    /* faint dot matrix behind the characters */
    background-image:
      radial-gradient(var(--color-lcd-ghost) 0.6px, transparent 0.9px),
      linear-gradient(160deg, rgb(255 255 255 / 0.045) 0%, transparent 38%),
      radial-gradient(120% 90% at 50% 0%, #1f1408 0%, var(--color-lcd) 70%);
    background-size:
      4px 4px,
      auto,
      auto;
  }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .small {
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    line-height: 1.5;
  }
  .time {
    font-size: clamp(3rem, 2.2rem + 3.2vw, 4.25rem);
    line-height: 0.85;
    text-shadow: 0 0 0.9rem rgb(255 160 50 / 0.45);
  }
  .title {
    font-weight: 500;
    font-size: 1.0625rem;
    letter-spacing: 0.08em;
  }
  .lyric {
    font-size: 0.875rem;
    min-height: 1.4em;
  }
  .dot {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    margin-right: 0.45rem;
    border-radius: 50%;
    background: var(--color-lcd-ink);
    box-shadow: 0 0 0.35rem var(--color-lcd-ink);
    vertical-align: 0.05em;
  }
  .segs {
    display: grid;
    grid-template-columns: repeat(32, 1fr);
    gap: 2px;
    height: 0.4rem;
  }
  .segs span {
    background: var(--color-lcd-ghost);
    border-radius: 1px;
  }
  .segs span.lit {
    background: var(--color-lcd-ink);
    box-shadow: 0 0 0.3rem rgb(255 160 50 / 0.5);
  }

  .meters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .meter {
    position: relative;
    padding: 4px;
    border-radius: var(--radius-key);
    background: color-mix(in oklab, var(--color-recess) 80%, #000);
    box-shadow: var(--well);
  }
  .meter svg {
    border-radius: 2px;
  }
  .scale {
    fill: none;
    stroke: #2a1d0c;
    stroke-width: 1;
  }
  .scale.red,
  .tick.red {
    stroke: #b3260b;
  }
  .redband {
    fill: none;
    stroke: #b3260b;
    stroke-width: 4;
    opacity: 0.85;
  }
  .tick {
    stroke: #2a1d0c;
    stroke-width: 1.2;
  }
  .num {
    font-family: var(--font-label);
    font-weight: 600;
    font-size: 8.5px;
    text-anchor: middle;
    fill: #2a1d0c;
  }
  .num.red {
    fill: #b3260b;
  }
  .vu {
    font-family: var(--font-label);
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-anchor: middle;
    fill: #2a1d0c;
  }
  .ch {
    font-family: var(--font-label);
    font-weight: 600;
    font-size: 9px;
    fill: #5a4320;
  }
  .needle {
    stroke: #17110a;
    stroke-width: 1.3;
    stroke-linecap: round;
  }
  .glass {
    fill: none;
    stroke: rgb(0 0 0 / 0.25);
    stroke-width: 1;
  }
  .peak {
    position: absolute;
    right: 0.6rem;
    bottom: 0.55rem;
    width: 0.35rem;
    height: 0.35rem;
    border-radius: 50%;
    background: #6d1a08;
    transition:
      background-color 60ms,
      box-shadow 60ms;
  }
  .peak:global(.on) {
    background: #ff3d14;
    box-shadow: 0 0 0.4rem #ff3d14;
  }
</style>
