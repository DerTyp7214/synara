<script lang="ts">
    import { onMount } from 'svelte';
    import Download from '@lucide/svelte/icons/download';
    import Play from '@lucide/svelte/icons/play';
    import Pause from '@lucide/svelte/icons/pause';
    import Rewind from '@lucide/svelte/icons/rewind';
    import FastForward from '@lucide/svelte/icons/fast-forward';
    import Heart from '@lucide/svelte/icons/heart';
    import Shuffle from '@lucide/svelte/icons/shuffle';
    import Repeat from '@lucide/svelte/icons/repeat';
    import { hero } from '$lib/components/home/content';
    import { design } from '$lib/designs/design.svelte';
    import { prefersReducedMotion } from '../motion';
    import './home.css';

    // Modern hero: a large title beside a glass "now playing" card modelled on the iOS player.
    // A small playback demo with two CC BY 4.0 songs (no audio). Like the app, the colours follow the playing
    // cover: each song has a build-time tint (.tint-<cover>), and the registered --tint-* colours
    // (modern.css) transition when the class changes. Each song shows SHOW seconds of real-time progress
    // from its start offset, then the player moves on to the next song and loops.
    type Song = {
        title: string;
        artist: string;
        album: string;
        duration: number;
        from: number;
        cover: string;
        tint: string;
        source: string;
    };
    const songs: Song[] = [
        {
            title: 'Light Years',
            artist: 'Stellardrone',
            album: 'Light Years',
            duration: 364, // 6:04
            from: 150,
            cover: '/demo/covers/light-years.webp',
            tint: 'tint-light-years',
            source: 'https://stellardrone.bandcamp.com/album/light-years'
        },
        {
            title: 'Night Owl',
            artist: 'Broke For Free',
            album: 'Directionless EP',
            duration: 194, // 3:14
            from: 65,
            cover: '/demo/covers/directionless.webp',
            tint: 'tint-directionless',
            source: 'https://brokeforfree.bandcamp.com/album/directionless-ep'
        }
    ];
    const SHOW = 16; // seconds on screen per song
    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    let index = $state(0);
    let elapsed = $state(songs[0].from);
    // Paused until mounted. It starts playing unless the visitor prefers reduced motion.
    let playing = $state(false);
    let visible = $state(true);
    let tabVisible = $state(true);
    const song = $derived(songs[index]);
    const running = $derived(playing && visible && tabVisible && design.isModern);

    let card: HTMLElement | undefined = $state();

    function go(i: number) {
        index = (i + songs.length) % songs.length;
        elapsed = songs[index].from;
    }

    // One rAF loop, only while playing, on screen, in a visible tab and on Modern.
    $effect(() => {
        if (!running) return;
        let raf = 0;
        let last = performance.now();
        const frame = (now: number) => {
            elapsed += Math.min(0.25, (now - last) / 1000);
            last = now;
            const cur = songs[index];
            if (elapsed >= Math.min(cur.duration, cur.from + SHOW)) go(index + 1);
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    });

    onMount(() => {
        playing = !prefersReducedMotion();
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        if (card) io.observe(card);
        const onVis = () => (tabVisible = !document.hidden);
        onVis();
        document.addEventListener('visibilitychange', onVis);
        return () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', onVis);
        };
    });
</script>

<section class="m-hero tint {song.tint}" aria-labelledby="m-hero-h">
    <div class="backdrop" aria-hidden="true">
        {#each songs as s, i (s.cover)}
            <img src={s.cover} alt="" draggable="false" width="600" height="600" decoding="async" class={i === index ? 'on' : ''}/>
        {/each}
    </div>

    <div class="shell layout">
        <div class="copy">
            <h1 id="m-hero-h" class="h-display">{hero.title}</h1>
            <p class="lead">{hero.lead}</p>
            <div class="actions">
                <a href="/download/" class="key key-primary key-lg"><Download class="size-[1.1rem]" aria-hidden="true"/>Download</a>
                <a href="/server/" class="key key-lg">Run the server</a>
            </div>
            <p class="licence">{hero.licence}</p>
        </div>

        <div class="stage">
            <figure class="player glass mh-squircle" bind:this={card} aria-label="Demo of the Synara player">
                <div class="cover mh-squircle">
                    {#each songs as s, i (s.cover)}
                        <img src={s.cover} alt="" draggable="false" width="600" height="600" decoding="async" class={i === index ? 'on' : ''}/>
                    {/each}
                </div>
                <div class="track">
                    <div class="min-w-0">
                        <p class="title">{song.title}</p>
                        <p class="artist">{song.artist}</p>
                    </div>
                    <span class="heart" aria-hidden="true"><Heart/></span>
                </div>
                <div class="scrubber" aria-hidden="true">
                    <span class="bar"><span class="fill" style="width: {(elapsed / song.duration) * 100}%"></span></span>
                    <span class="times"><span>{fmt(elapsed)}</span><span class="format">{hero.formats[0]}</span><span>{fmt(song.duration)}</span></span>
                </div>
                <div class="controls">
                    <span class="ctl small" aria-hidden="true"><Shuffle/></span>
                    <button type="button" class="ctl" aria-label="Previous demo song" onclick={() => go(index - 1)}><Rewind aria-hidden="true"/></button>
                    <button
                            type="button"
                            class="play {playing ? 'is-playing' : ''}"
                            aria-label={playing ? 'Pause the demo' : 'Play the demo'}
                            onclick={() => (playing = !playing)}
                    >
                        {#if playing}<Pause aria-hidden="true"/>{:else}<Play aria-hidden="true"/>{/if}
                    </button>
                    <button type="button" class="ctl" aria-label="Next demo song" onclick={() => go(index + 1)}><FastForward aria-hidden="true"/></button>
                    <span class="ctl small" aria-hidden="true"><Repeat/></span>
                </div>
            </figure>
            <p class="credit">
                Cover: <a href={song.source} rel="noopener">{song.album}</a> by {song.artist},
                <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener">CC BY 4.0</a>
            </p>
        </div>
    </div>
</section>

<style>
    .m-hero {
        position: relative;
        isolation: isolate;
        /* Run under the floating header, so the bar's glass has the cover colour behind it. */
        margin-top: calc(-1 * var(--header-h));
        padding-block: calc(var(--header-h) + 2rem) 3rem;
        overflow: clip;
        color: var(--tint-ink);
        /* The --tint-* colours are registered (<color>, modern.css), so a song change blends the palette. */
        transition-property:
            --tint-primary, --tint-on-primary, --tint-container, --tint-on-container, --tint-surface,
            --tint-surface-high, --tint-ink, --tint-muted, --tint-outline, --tint-vivid;
        transition-duration: var(--m-tint-dur);
        transition-timing-function: var(--m-ease-in-out);
    }

    /* A soft cover-derived backdrop: the cover itself, heavily blurred, over the tinted surface, fading
     * into the grouped page background. */
    .backdrop {
        position: absolute;
        inset: 0;
        z-index: -1;
        background: var(--tint-surface);
        /* The mask sits on the container, after the image's blur, so nothing bleeds past the fade. */
        /* Even colour over the whole hero (also when stacked); only the last stretch fades into the page. */
        -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 calc(100% - 16rem), transparent 100%);
        mask-image: linear-gradient(180deg, #000 0%, #000 calc(100% - 16rem), transparent 100%);
    }
    .backdrop img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 72%;
        filter: var(--m-cover-backdrop-filter);
        opacity: 0;
        transform: scale(1.15);
        transition: opacity var(--m-tint-dur) var(--m-ease-in-out);
    }
    .backdrop img.on {
        opacity: var(--m-cover-backdrop-opacity);
    }

    .backdrop::after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--m-cover-backdrop-veil);
    }

    .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 3rem;
    }
    .copy {
        max-width: 36rem;
    }
    .copy .lead {
        margin-top: 1.25rem;
        color: var(--tint-muted);
    }
    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 2rem;
    }
    /* Buttons take the cover's colour, like the app's controls on the now-playing screen. */
    /* The secondary button sits on the colourful backdrop, so it is a glass capsule (AA on any cover). */
    .actions :global(.key) {
        background: var(--glass-specular), var(--glass-bg);
        -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
        backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
        box-shadow: inset 0 0 0 1px var(--glass-border);
        color: var(--tint-primary);
    }
    .actions :global(.key:hover) {
        background: var(--glass-specular), color-mix(in oklab, var(--glass-solid) 85%, transparent);
    }
    .actions :global(.key-primary),
    .actions :global(.key-primary:hover) {
        background: var(--tint-primary);
        color: var(--tint-on-primary);
        box-shadow: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
    }
    .actions :global(.key-primary:hover) {
        background: color-mix(in oklab, var(--tint-primary) 88%, var(--tint-ink));
    }
    .licence {
        margin-top: 1.5rem;
        font-size: var(--ios-subheadline-size);
        letter-spacing: var(--ios-subheadline-tracking);
        color: var(--tint-muted);
    }

    /* ---- The player card: large glass card (28), cover inset 16 with a concentric 12 radius ---- */
    /* The stage is a size container: the card's parts scale with it (cqi), and a wide stage (stacked
     * layout on landscape phones and small tablets) turns the card sideways, like the iPad player. */
    .stage {
        container-type: inline-size;
        width: 100%;
        max-width: 36rem;
    }
    .player {
        --pad: clamp(0.75rem, 4.2cqi, 1rem);
        --play: clamp(3.25rem, 17cqi, 4rem);
        --ctl: clamp(2.5rem, 12cqi, 2.75rem);
        --glyph: clamp(1.375rem, 7cqi, 1.625rem);
        margin: 0;
        padding: var(--pad) var(--pad) calc(var(--pad) + 0.25rem);
        border-radius: var(--m-radius-card-lg);
        color: var(--tint-ink);
    }
    .cover {
        position: relative;
        display: block;
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: calc(var(--m-radius-card-lg) - var(--pad));
        box-shadow: 0 12px 28px -12px rgb(0 0 0 / 0.5);
    }
    .cover img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity var(--m-tint-dur) var(--m-ease-in-out);
    }
    .cover img.on {
        opacity: 1;
    }
    .track {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 1.125rem;
        padding-inline: 0.25rem;
    }
    .title {
        font-family: var(--font-display);
        font-size: clamp(var(--ios-title3-size), 5.8cqi, var(--ios-title2-size));
        line-height: var(--ios-title2-leading);
        font-weight: 700;
        letter-spacing: -0.01em;
    }
    .artist {
        font-size: var(--ios-body-size);
        letter-spacing: var(--ios-body-tracking);
        color: var(--tint-muted);
    }
    .heart {
        flex-shrink: 0;
        display: inline-grid;
        place-items: center;
        margin-bottom: 0.25rem;
        color: var(--tint-ink);
    }
    .heart :global(svg) {
        width: 1.5rem;
        height: 1.5rem;
        stroke-width: 1.75;
    }
    .scrubber {
        display: block;
        margin-top: 1.125rem;
        padding-inline: 0.25rem;
    }
    .bar {
        display: block;
        height: 0.3125rem;
        border-radius: var(--m-radius-capsule);
        background: color-mix(in oklab, var(--tint-ink) 22%, transparent);
        overflow: hidden;
    }
    .fill {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: var(--tint-ink);
    }
    .times {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
        font-size: var(--ios-caption1-size);
        font-variant-numeric: tabular-nums;
        font-weight: 500;
        color: var(--tint-muted);
    }
    /* The app's centre accessory under the scrubber (audio format). */
    .times .format {
        font-size: var(--ios-caption2-size);
        font-weight: 600;
        letter-spacing: 0.02em;
    }
    .controls {
        display: grid;
        grid-template-columns: 1fr 1fr auto 1fr 1fr;
        align-items: center;
        justify-items: center;
        margin-top: 0.75rem;
    }
    .ctl {
        display: inline-grid;
        place-items: center;
        color: var(--tint-ink);
    }
    button.ctl {
        width: var(--ctl);
        height: var(--ctl);
        border-radius: 50%;
        cursor: pointer;
        transition:
            transform var(--m-dur-press) var(--ease-spring),
            background-color var(--dur-ui);
    }
    button.ctl:hover {
        background: color-mix(in oklab, var(--tint-ink) 10%, transparent);
    }
    button.ctl:active {
        transform: scale(0.88);
    }
    .ctl :global(svg) {
        width: var(--glyph);
        height: var(--glyph);
        fill: currentColor;
        stroke-width: 1.5;
    }
    .ctl.small :global(svg) {
        width: 1.25rem;
        height: 1.25rem;
        fill: none;
        stroke-width: 2;
        color: var(--tint-muted);
    }
    /* Play/Pause: the app's morphing button. A rounded square while playing, a circle when paused. */
    /* Play/Pause: the app's LiquidGlassContainer button, a glass rounded square (a circle when paused)
     * tinted by the cover, with the glyph in the cover's primary colour. */
    .play {
        display: inline-grid;
        place-items: center;
        width: var(--play);
        height: var(--play);
        border-radius: calc(var(--play) / 2);
        background:
            var(--glass-specular),
            color-mix(in oklab, var(--tint-container) 72%, transparent);
        box-shadow:
            inset 0 1px 0 var(--glass-highlight),
            inset 0 0 0 1px var(--glass-border),
            0 6px 16px -8px rgb(0 0 0 / 0.35);
        color: var(--tint-primary);
        cursor: pointer;
        transition:
            border-radius var(--m-dur-panel) var(--ease-spring),
            transform var(--m-dur-press) var(--ease-spring);
    }
    .play.is-playing {
        border-radius: calc(var(--play) * 0.34);
    }
    .play:active {
        transform: scale(0.92);
    }
    .play :global(svg) {
        width: calc(var(--play) * 0.44);
        height: calc(var(--play) * 0.44);
        fill: currentColor;
        stroke-width: 1.5;
    }
    .credit {
        margin-top: 0.75rem;
        padding-inline: 0.5rem;
        font-size: var(--ios-caption1-size);
        color: var(--tint-muted);
    }
    .credit a {
        color: inherit;
        text-decoration: underline;
        text-decoration-color: color-mix(in oklab, currentColor 40%, transparent);
        text-underline-offset: 2px;
    }
    .credit a:hover {
        color: var(--tint-ink);
    }

    /* A wide stage (stacked, about 32rem and up): cover on the left, the rest beside it. */
    @container (min-width: 32rem) {
        .player {
            display: grid;
            grid-template-columns: minmax(0, 0.92fr) minmax(0, 1fr);
            /* Spacer rows above and below keep the three blocks together, centred on the cover. */
            grid-template-rows: 1fr auto auto auto 1fr;
            column-gap: 1.25rem;
            padding: var(--pad);
        }
        .cover {
            grid-row: 1 / -1;
            align-self: center;
        }
        .track {
            margin-top: 0;
        }
        .track,
        .scrubber,
        .controls {
            grid-column: 2;
        }
        .track {
            grid-row: 2;
        }
        .scrubber {
            grid-row: 3;
        }
        .controls {
            grid-row: 4;
        }
    }

    /* Side by side from tablet portrait up, with the card scaling with the viewport. */
    @media (min-width: 48rem) {
        .layout {
            grid-template-columns: minmax(0, 1fr) clamp(16.5rem, 31vw, 23.5rem);
            align-items: center;
            gap: clamp(2rem, 5vw, 5rem);
        }
        .stage {
            max-width: none;
        }
        .m-hero {
            padding-block: calc(var(--header-h) + clamp(2.5rem, 5vw, 4.5rem)) clamp(3rem, 5vw, 4.5rem);
        }
    }
    @media (prefers-reduced-transparency: reduce) {
        .backdrop img {
            display: none;
        }
    }
</style>
