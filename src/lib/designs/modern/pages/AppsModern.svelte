<script lang="ts">
    import Download from '@lucide/svelte/icons/download';
    import Device from '$lib/components/apps/Device.svelte';
    import Shot from '$lib/components/apps/Shot.svelte';
    import RevealShot from '$lib/components/apps/RevealShot.svelte';
    import PlatformChips from '$lib/components/apps/PlatformChips.svelte';
    import { page, platforms, setup, sheetsIntro } from '$lib/components/apps/content';
    import { reveal } from '../reveal';
    import '../home/home.css';

    // Modern /apps/: an iOS product page. Per app: a large title beside the hero device, floating on a soft
    // backdrop tinted by the cover it shows (Light Years). Then a snap-scrolling gallery of headline screens,
    // the connect / log in / listen sequence, and the extras on grouped cards. Galleries scroll inside
    // themselves, never the page.
    const sizes = {
        hero: { iphone: '(min-width: 64rem) 21rem, 70vw', pixel: '(min-width: 64rem) 21rem, 70vw', window: '(min-width: 76rem) 70rem, 94vw' },
        screen: { iphone: '15rem', pixel: '15rem', window: '(min-width: 48rem) 40rem, 84vw' },
        step: { iphone: '(min-width: 48rem) 12rem, 30vw', pixel: '(min-width: 48rem) 12rem, 30vw', window: '(min-width: 48rem) 26rem, 80vw' }
    } as const;
</script>

<div class="ma">
    <header class="shell ma-intro">
        <h1 id="m-apps-h" class="h-display">{page.title}</h1>
        <p class="lead">{page.lead}</p>
        <nav class="ma-jump" aria-label="Apps on this page">
            {#each platforms as p (p.id)}
                <a href="#m-apps-{p.id}" class="key key-sm">{p.short}</a>
            {/each}
        </nav>
    </header>

    {#each platforms as p, i (p.id)}
        <section id="m-apps-{p.id}" class="ma-plat ma-{p.frame}" aria-labelledby="m-apps-{p.id}-h">
            <div class="ma-stage tint tint-light-years">
                <div class="ma-backdrop" aria-hidden="true">
                    <img src="/demo/covers/light-years.webp" alt="" width="600" height="600" loading="lazy" decoding="async"/>
                </div>
                <div class="shell ma-hero">
                    <div class="ma-copy">
                        <div class="ma-title">
                            <h2 id="m-apps-{p.id}-h" class="h-section">{p.title}</h2>
                            {#if p.soon}<span class="tag ma-soon">Coming soon</span>{/if}
                        </div>
                        <p class="lead">{p.body}</p>
                        <ul class="ma-chips" aria-label="Platforms">
                            {#each p.platforms as name (name)}<li>{name}</li>{/each}
                        </ul>
                        {#if p.download}
                            <div class="ma-actions">
                                <a href={p.download.href} class="key key-primary key-lg">
                                    <Download class="size-[1.1rem]" aria-hidden="true"/>{p.download.label}<span class="sr-only"> {p.short}</span>
                                </a>
                            </div>
                        {/if}
                    </div>
                    <figure class="ma-hero-dev">
                        <Device kind={p.frame}>
                            <Shot key={p.hero.key} alt={p.hero.alt} sizes={sizes.hero[p.frame]} priority={i === 0}/>
                        </Device>
                    </figure>
                </div>
            </div>

            <div class="shell">
                <!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrollable region must be focusable for keyboard scrolling) -->
                <div
                    class="ma-gallery"
                    role="region"
                    aria-label="{p.short} screens"
                    tabindex="0"
                    use:reveal
                >
                    <ul class="ma-track">
                        {#each p.screens as s (s.key)}
                            <li class="ma-item">
                                <figure>
                                    <Device kind={p.frame}>
                                        {#if s.reveal}
                                            <RevealShot base={s.key} baseAlt={s.alt} over={s.reveal.key} overAlt={s.reveal.alt}
                                                        label={s.reveal.label} sizes={sizes.screen[p.frame]}/>
                                        {:else}
                                            <Shot key={s.key} alt={s.alt} sizes={sizes.screen[p.frame]}/>
                                        {/if}
                                    </Device>
                                    <figcaption>
                                        {s.caption}
                                        {#if s.reveal}<span class="ma-cap-note">{s.reveal.note}</span>{/if}
                                    </figcaption>
                                </figure>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="ma-setup" use:reveal>
                    <h3 class="h-title">{setup.title}</h3>
                    <p class="mh-sub ma-setup-sub">{setup.body}</p>
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrollable region must be focusable for keyboard scrolling) -->
                    <div class="ma-steps-wrap" role="region" aria-label="{setup.title}, {p.short}" tabindex={p.frame === 'window' ? 0 : undefined}>
                        <ol class="ma-steps">
                            {#each p.setup as s, n (s.key + n)}
                                <li class="ma-step">
                                    <figure>
                                        <Device kind={p.frame}>
                                            <Shot key={s.key} alt={s.alt} sizes={sizes.step[p.frame]}/>
                                        </Device>
                                        <figcaption><span class="ma-num" aria-hidden="true">{n + 1}</span>{s.caption}</figcaption>
                                    </figure>
                                </li>
                            {/each}
                        </ol>
                    </div>
                </div>

                {#if p.sheets}
                    <div class="ma-sheets-block" use:reveal>
                        <h3 class="h-title">{sheetsIntro.title}</h3>
                        <p class="mh-sub ma-setup-sub">{sheetsIntro.body}</p>
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrollable region must be focusable for keyboard scrolling) -->
                        <div class="ma-sheets-wrap" role="region" aria-label="{sheetsIntro.title}, {p.short}" tabindex="0">
                            <ul class="ma-sheets">
                                {#each p.sheets as sh (sh.shot)}
                                    <li class="ma-sheet mh-squircle">
                                        <div class="ma-sheet-stage">
                                            <div class="ma-sheet-dev">
                                                <Device kind="iphone">
                                                    <Shot key={sh.shot} alt={sh.alt} sizes="14rem"/>
                                                </Device>
                                            </div>
                                        </div>
                                        <h4 class="ma-sheet-h">{sh.title}</h4>
                                        <ul class="ma-sheet-list">
                                            {#each sh.features as f (f.name)}
                                                <li>
                                                    <p class="mh-title">{f.name}</p>
                                                    <p class="mh-sub">{f.body}</p>
                                                    <PlatformChips rows={f.on}/>
                                                </li>
                                            {/each}
                                        </ul>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                {/if}

                <ul class="ma-extras" use:reveal>
                    {#each p.extras as x (x.key)}
                        <li class="mh-group ma-extra">
                            <div class="ma-extra-stage {x.tint ? `tint tint-${x.tint}` : ''} ma-x-{x.frame}">
                                <div class="ma-extra-dev">
                                    <Device kind={x.frame}>
                                        <Shot key={x.key} alt={x.alt} sizes={x.frame === 'window' ? '(min-width: 48rem) 36rem, 90vw' : x.frame === 'card' ? '(min-width: 30rem) 22rem, 80vw' : '15rem'}/>
                                    </Device>
                                </div>
                            </div>
                            <p class="mh-title ma-extra-cap">{x.caption}</p>
                        </li>
                    {/each}
                </ul>
            </div>
        </section>
    {/each}
</div>

<style>
    .ma {
        padding-bottom: 1rem;
    }
    .ma-intro {
        padding-top: clamp(1.5rem, 4vw, 3.5rem);
        padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
    }
    .ma-intro .lead {
        margin-top: 1rem;
    }
    .ma-jump {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }

    /* ---- Platform section ---- */
    .ma-plat {
        scroll-margin-top: var(--header-h);
        padding-bottom: clamp(2.5rem, 5vw, 4.5rem);
    }
    /* The stage: the cover, heavily blurred, over the tinted surface, fading into the grouped background.
     * Same recipe as the home hero, so text on it stays AA. */
    .ma-stage {
        position: relative;
        isolation: isolate;
        overflow: clip;
        padding-block: clamp(2rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3.5rem);
        color: var(--tint-ink);
    }
    .ma-backdrop {
        position: absolute;
        inset: 0;
        z-index: -1;
        background: var(--tint-surface);
        -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 55%, transparent 100%);
        mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 55%, transparent 100%);
    }
    .ma-backdrop img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 60%;
        filter: var(--m-cover-backdrop-filter);
        opacity: var(--m-cover-backdrop-opacity);
        transform: scale(1.15);
    }
    .ma-backdrop::after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--m-cover-backdrop-veil);
    }

    .ma-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 2.5rem;
        align-items: center;
    }
    .ma-copy {
        max-width: 34rem;
    }
    .ma-title {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem 0.875rem;
    }
    .ma-copy .lead {
        margin-top: 1rem;
        color: var(--tint-muted);
    }
    .ma-soon {
        color: var(--tint-ink);
        border-color: var(--tint-outline);
        background: color-mix(in oklab, var(--tint-surface-high) 70%, transparent);
    }
    .ma-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }
    /* Platform chips: small glass capsules, they sit on the cover colour. */
    .ma-chips li {
        padding: 0.375rem 0.875rem;
        border-radius: var(--m-radius-capsule);
        background: var(--glass-specular), var(--glass-bg);
        -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
        backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
        box-shadow: inset 0 0 0 1px var(--glass-border);
        font-size: var(--ios-subheadline-size);
        font-weight: 600;
        letter-spacing: var(--ios-subheadline-tracking);
        color: var(--tint-ink);
    }
    .ma-actions {
        margin-top: 1.75rem;
    }
    .ma-actions :global(.key-primary),
    .ma-actions :global(.key-primary:hover) {
        background: var(--tint-primary);
        color: var(--tint-on-primary);
    }
    .ma-hero-dev {
        margin: 0;
        justify-self: center;
        width: min(19rem, 72vw);
    }
    /* Desktop: the window is the picture, so it goes full width under the copy. */
    .ma-window .ma-hero-dev {
        width: 100%;
    }

    /* ---- Gallery: snap-scrolls inside itself, bleeding to the screen edge on small screens ---- */
    .ma-gallery {
        /* Bleeds into the gutter and keeps padding all round, so the frames' shadows are never clipped
         * by the scroll container. The first item still lines up with the shell. */
        margin: -1rem calc(-1 * var(--gutter)) 0;
        padding: 1rem var(--gutter) 1.5rem;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scroll-padding-inline: var(--gutter);
        scrollbar-width: thin;
        border-radius: var(--m-radius-group);
    }
    .ma-gallery:focus-visible,
    .ma-steps-wrap:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
    }
    .ma-track {
        display: flex;
        gap: clamp(1rem, 3vw, 2rem);
        width: max-content;
    }
    .ma-item {
        scroll-snap-align: start;
        width: clamp(10.5rem, 40vw, 15rem);
    }
    .ma-window .ma-item {
        width: min(40rem, 84vw);
    }
    .ma-item figure,
    .ma-step figure {
        margin: 0;
    }
    figcaption {
        margin-top: 0.875rem;
        font-size: var(--ios-subheadline-size);
        font-weight: 600;
        letter-spacing: var(--ios-subheadline-tracking);
        color: var(--color-ink);
        text-align: center;
    }

    /* ---- Connect, log in, listen: a real sequence, so it is numbered ---- */
    .ma-setup {
        margin-top: clamp(2.5rem, 5vw, 4rem);
    }
    .ma-setup-sub {
        max-width: 36rem;
    }
    .ma-steps-wrap {
        margin-top: 1.5rem;
        border-radius: var(--m-radius-group);
    }
    .ma-steps {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 12rem));
        gap: clamp(0.75rem, 3vw, 2.5rem);
    }
    .ma-window .ma-steps-wrap {
        margin-inline: calc(-1 * var(--gutter));
        margin-top: 0.5rem;
        padding: 1rem var(--gutter) 1.5rem;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scroll-padding-inline: var(--gutter);
        scrollbar-width: thin;
    }
    .ma-window .ma-steps {
        grid-template-columns: repeat(3, min(24rem, 78vw));
        width: max-content;
    }
    .ma-window .ma-step {
        scroll-snap-align: start;
    }
    .ma-step figcaption {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }
    .ma-num {
        display: inline-grid;
        place-items: center;
        width: 1.625rem;
        height: 1.625rem;
        border-radius: 50%;
        background: var(--m-primary-container);
        color: var(--m-on-primary-container);
        font-size: var(--ios-footnote-size);
        font-weight: 700;
        font-variant-numeric: tabular-nums;
    }

    .ma-cap-note {
        display: block;
        margin-top: 0.125rem;
        font-weight: 400;
        color: var(--color-muted);
    }

    /* ---- After you log in: three sheets, each a grouped card with its phone and its features ---- */
    .ma-sheets-block {
        margin-top: clamp(2.5rem, 5vw, 4rem);
    }
    .ma-sheets-wrap {
        margin: 0.5rem calc(-1 * var(--gutter)) 0;
        padding: 1rem var(--gutter) 1.5rem;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scroll-padding-inline: var(--gutter);
        scrollbar-width: thin;
    }
    .ma-sheets-wrap:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: -2px;
    }
    .ma-sheets {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: min(20rem, 82vw);
        gap: 1rem;
        width: max-content;
    }
    .ma-sheet {
        scroll-snap-align: start;
        display: flex;
        flex-direction: column;
        border-radius: var(--m-radius-group);
        background: var(--m-grouped-bg-2);
        overflow: hidden;
    }
    .ma-sheet-stage {
        display: grid;
        place-items: center;
        padding: 1.75rem 1rem 1.5rem;
        background: var(--ma-stage);
        --ma-stage: var(--m-grouped-bg-3);
    }
    :global(:root[data-theme='light']) .ma-sheet-stage {
        --ma-stage: var(--m-grouped-bg-2);
    }
    @media (prefers-color-scheme: light) {
        :global(:root:not([data-theme='dark'])) .ma-sheet-stage {
            --ma-stage: var(--m-grouped-bg-2);
        }
    }
    .ma-sheet-dev {
        width: 12.5rem;
    }
    .ma-sheet-h {
        padding: 1rem 1.25rem 0.25rem;
        border-top: 1px solid var(--color-line);
        font-family: var(--font-display);
        font-size: var(--ios-title3-size);
        line-height: var(--ios-title3-leading);
        font-weight: 600;
        color: var(--color-ink);
    }
    .ma-sheet-list {
        padding: 0 1.25rem 1.25rem;
    }
    .ma-sheet-list li {
        padding-block: 0.75rem;
    }
    .ma-sheet-list li + li {
        border-top: 1px solid var(--color-line);
    }
    .ma-sheet-list .mh-title {
        font-size: var(--ios-callout-size);
    }

    /* ---- Extras: grouped cards ---- */
    .ma-extras {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
        margin-top: clamp(2.5rem, 5vw, 4rem);
    }
    .ma-extra {
        display: flex;
        flex-direction: column;
    }
    /* The card is one grouped surface: the picture sits on a stage inside it and the caption below,
     * split by a hairline. Dark: the stage is the tertiary fill. Light: the tertiary level is the page
     * colour, so the stage stays on the card surface. */
    .ma-extra-stage {
        --ma-stage: var(--m-grouped-bg-3);
        display: grid;
        place-items: center;
        flex: 1;
        padding: 2rem 1.25rem;
        background: var(--ma-stage);
        overflow: hidden;
    }
    :global(:root[data-theme='light']) .ma-extra-stage {
        --ma-stage: var(--m-grouped-bg-2);
    }
    @media (prefers-color-scheme: light) {
        :global(:root:not([data-theme='dark'])) .ma-extra-stage {
            --ma-stage: var(--m-grouped-bg-2);
        }
    }
    .ma-extra-stage.tint {
        background: var(--tint-container);
    }
    .ma-extra-dev {
        width: 13rem;
    }
    /* The widget floats on the stage as its own card. */
    .ma-x-card .ma-extra-dev {
        width: min(22rem, 100%);
    }
    .ma-x-pixel-top .ma-extra-dev {
        width: 15rem;
    }
    .ma-x-watch .ma-extra-dev {
        width: 11rem;
    }
    .ma-x-window {
        padding: 1.25rem;
    }
    .ma-x-window .ma-extra-dev {
        width: 100%;
    }
    .ma-extra-cap {
        position: relative;
        padding: 0.875rem 1.25rem 1rem;
        background: var(--m-grouped-bg-2);
        border-top: 1px solid var(--color-line);
    }

    @media (min-width: 48rem) {
        .ma-extras {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    @media (min-width: 64rem) {
        .ma-sheets {
            grid-auto-flow: row;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            width: auto;
        }
        .ma-hero {
            grid-template-columns: minmax(0, 1fr) 19rem;
            gap: 4rem;
        }
        .ma-hero-dev {
            width: 100%;
        }
        .ma-window .ma-hero {
            grid-template-columns: minmax(0, 1fr);
            gap: 3rem;
        }
    }
    @media (prefers-reduced-transparency: reduce) {
        .ma-backdrop img {
            display: none;
        }
    }

    /* Scroll reveal (reveal.ts): only blocks that start below the fold, only on Modern. */
    :global([data-design='modern'] .m-reveal-pending) {
        opacity: 0;
    }
</style>
