<script lang="ts">
    import Download from '@lucide/svelte/icons/download';
    import Device from '$lib/components/apps/Device.svelte';
    import Shot from '$lib/components/apps/Shot.svelte';
    import RevealShot from '$lib/components/apps/RevealShot.svelte';
    import PlatformChips from '$lib/components/apps/PlatformChips.svelte';
    import { page, platforms, setup, sheetsIntro } from '$lib/components/apps/content';

    // Retro /apps/: each app is a rack of display modules. The screenshots sit behind a plain dark bezel
    // in a recessed well, and the module's legend strip names the screen. The platform list is a row of
    // LED tags (lit = available now, unlit = coming soon). The rows of modules scroll inside their rack.
    const sizes = {
        hero: { iphone: '(min-width: 64rem) 18rem, 64vw', pixel: '(min-width: 64rem) 18rem, 64vw', window: '(min-width: 76rem) 44rem, 92vw' },
        screen: { iphone: '13rem', pixel: '13rem', window: '(min-width: 48rem) 34rem, 80vw' },
        step: { iphone: '(min-width: 48rem) 11rem, 28vw', pixel: '(min-width: 48rem) 11rem, 28vw', window: '(min-width: 48rem) 24rem, 78vw' }
    } as const;
</script>

<section class="ra-intro" aria-labelledby="apps-h">
    <div class="shell">
        <h1 id="apps-h" class="h-display">{page.title}</h1>
        <p class="lead mt-5">{page.lead}</p>
        <nav class="mt-8 flex flex-wrap gap-3" aria-label="Apps on this page">
            {#each platforms as p (p.id)}
                <a href="#apps-{p.id}" class="key key-sm">{p.short}</a>
            {/each}
        </nav>
    </div>
</section>

{#each platforms as p, i (p.id)}
    <section id="apps-{p.id}" class="section section-ruled ra-plat ra-{p.frame}" aria-labelledby="apps-{p.id}-h">
        <div class="shell">
            <div class="ra-head">
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <h2 id="apps-{p.id}-h" class="h-section">{p.title}</h2>
                        {#if p.soon}<span class="tag">Coming soon</span>{/if}
                    </div>
                    <p class="lead mt-5">{p.body}</p>
                    <ul class="ra-tags" aria-label="Platforms">
                        {#each p.platforms as name (name)}
                            <li class="tag {p.soon ? '' : 'tag-lit'}"><span class="led {p.soon ? '' : 'on'}" aria-hidden="true"></span>{name}</li>
                        {/each}
                    </ul>
                    {#if p.download}
                        <a href={p.download.href} class="key key-primary key-lg mt-8">
                            <Download class="size-4.5" aria-hidden="true"/>{p.download.label}<span class="sr-only"> {p.short}</span>
                        </a>
                    {/if}
                </div>

                <figure class="module ra-hero">
                    <figcaption class="module-head">
                        <span class="legend">{p.short} display</span>
                        <span class="legend inline-flex items-center gap-2"><span class="led {p.soon ? '' : 'on'}" aria-hidden="true"></span>{p.hero.caption}</span>
                    </figcaption>
                    <div class="ra-bay">
                        <div class="ra-hero-dev">
                            <Device kind={p.frame} look="retro">
                                <Shot key={p.hero.key} alt={p.hero.alt} sizes={sizes.hero[p.frame]} priority={i === 0}/>
                            </Device>
                        </div>
                    </div>
                </figure>
            </div>

            <!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrollable region must be focusable for keyboard scrolling) -->
            <div class="faceplate ra-rack mt-10" role="region" aria-label="{p.short} screens" tabindex="0">
                <ul class="ra-track">
                    {#each p.screens as s (s.key)}
                        <li>
                            <figure class="module ra-mod">
                                <figcaption class="module-head">
                                    <span class="legend">{s.caption}</span>
                                    {#if s.reveal}<span class="sr-only">{s.reveal.note}</span>{/if}
                                </figcaption>
                                <div class="ra-bay">
                                    <div class="ra-dev">
                                        <Device kind={p.frame} look="retro">
                                            {#if s.reveal}
                                                <RevealShot look="retro" base={s.key} baseAlt={s.alt} over={s.reveal.key} overAlt={s.reveal.alt}
                                                            label={s.reveal.label} sizes={sizes.screen[p.frame]}/>
                                            {:else}
                                                <Shot key={s.key} alt={s.alt} sizes={sizes.screen[p.frame]}/>
                                            {/if}
                                        </Device>
                                    </div>
                                </div>
                                {#if s.reveal}
                                    <p class="ra-fader-legend" aria-hidden="true"><span class="legend">Colorful</span><span class="legend">Default</span></p>
                                {/if}
                            </figure>
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="mt-12">
                <h3 class="h-title">{setup.title}</h3>
                <p class="meta mt-1.5">{setup.body}</p>
                <!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrollable region must be focusable for keyboard scrolling) -->
                <div class="ra-steps-wrap mt-6" role="region" aria-label="{setup.title}, {p.short}" tabindex={p.frame === 'window' ? 0 : undefined}>
                    <ol class="ra-steps">
                        {#each p.setup as s, n (s.key + n)}
                            <li>
                                <figure class="module ra-mod">
                                    <figcaption class="module-head">
                                        <span class="legend text-ink!"><span class="ra-num">{n + 1}</span>{s.caption}</span>
                                    </figcaption>
                                    <div class="ra-bay">
                                        <div class="ra-dev">
                                            <Device kind={p.frame} look="retro">
                                                <Shot key={s.key} alt={s.alt} sizes={sizes.step[p.frame]}/>
                                            </Device>
                                        </div>
                                    </div>
                                </figure>
                            </li>
                        {/each}
                    </ol>
                </div>
            </div>

            {#if p.sheets}
                <div class="mt-12">
                    <h3 class="h-title">{sheetsIntro.title}</h3>
                    <p class="meta mt-1.5">{sheetsIntro.body}</p>
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrollable region must be focusable for keyboard scrolling) -->
                    <div class="ra-sheets-wrap mt-6" role="region" aria-label="{sheetsIntro.title}, {p.short}" tabindex="0">
                        <ul class="ra-sheets">
                            {#each p.sheets as sh (sh.shot)}
                                <li class="module ra-sheet">
                                    <div class="module-head"><h4 class="legend text-ink!">{sh.title}</h4></div>
                                    <div class="ra-bay">
                                        <div class="ra-sheet-dev">
                                            <Device kind="iphone" look="retro">
                                                <Shot key={sh.shot} alt={sh.alt} sizes="12rem"/>
                                            </Device>
                                        </div>
                                    </div>
                                    <ul class="ra-feats">
                                        {#each sh.features as f (f.name)}
                                            <li>
                                                <p class="h-sub">{f.name}</p>
                                                <p class="meta">{f.body}</p>
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

            <ul class="ra-extras mt-12">
                {#each p.extras as x (x.key)}
                    <li>
                        <figure class="module ra-mod ra-extra">
                            <figcaption class="module-head"><span class="legend">{x.caption}</span></figcaption>
                            <div class="ra-bay ra-x-{x.frame}">
                                <div class="ra-dev">
                                    <Device kind={x.frame} look="retro">
                                        <Shot key={x.key} alt={x.alt} sizes={x.frame === 'window' ? '(min-width: 48rem) 34rem, 88vw' : x.frame === 'card' ? '(min-width: 30rem) 22rem, 80vw' : '13rem'}/>
                                    </Device>
                                </div>
                            </div>
                        </figure>
                    </li>
                {/each}
            </ul>
        </div>
    </section>
{/each}

<style>
    .ra-intro {
        padding-block: 2.5rem 2.5rem;
    }
    @media (min-width: 48rem) {
        .ra-intro {
            padding-block: 4rem 3rem;
        }
    }
    .ra-plat {
        scroll-margin-top: var(--header-h);
    }
    .ra-head {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 2.5rem;
        align-items: start;
    }
    .ra-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }
    .ra-tags .led {
        width: 0.375rem;
        height: 0.375rem;
    }
    .ra-hero {
        margin: 0;
    }
    /* The display bay: a recessed well the bezel sits in. */
    .ra-bay {
        display: grid;
        place-items: center;
        margin: 0.75rem;
        padding: 1.25rem;
        border-radius: var(--radius-key);
        background: var(--color-recess);
        box-shadow: var(--well);
    }
    .ra-hero-dev {
        width: min(17rem, 64vw);
    }
    .ra-window .ra-hero-dev {
        width: 100%;
    }

    /* The rack: a faceplate whose row of modules scrolls inside it. */
    .ra-rack,
    .ra-steps-wrap {
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scrollbar-width: thin;
    }
    .ra-rack {
        padding: 0.875rem;
        scroll-padding-inline: 0.875rem;
    }
    .ra-rack:focus-visible,
    .ra-steps-wrap:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 3px;
    }
    .ra-track {
        display: flex;
        gap: 0.875rem;
        width: max-content;
    }
    .ra-track > li {
        scroll-snap-align: start;
        width: clamp(11rem, 44vw, 14rem);
    }
    .ra-window .ra-track > li {
        width: min(36rem, 80vw);
    }
    .ra-mod {
        margin: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .ra-mod .module-head {
        padding-inline: 0.875rem;
    }
    .ra-mod .ra-bay {
        flex: 1;
        margin: 0.5rem;
        padding: 0.875rem;
    }
    .ra-dev {
        width: 100%;
    }

    .ra-steps {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 13rem));
        gap: 0.75rem;
    }
    .ra-window .ra-steps {
        grid-template-columns: repeat(3, min(26rem, 78vw));
        width: max-content;
    }
    .ra-steps > li {
        scroll-snap-align: start;
    }
    .ra-num {
        display: inline-grid;
        place-items: center;
        min-width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.5rem;
        border-radius: var(--radius-tight);
        background: var(--color-recess);
        box-shadow: var(--well);
        color: var(--color-accent-ink);
        font-family: var(--font-mono);
        letter-spacing: 0;
    }
    /* Narrow phone steps: tighter bays so three fit side by side. */
    @media (max-width: 30rem) {
        .ra-steps .ra-mod .module-head {
            padding-inline: 0.5rem;
        }
        .ra-steps .ra-mod .ra-bay {
            margin: 0.375rem;
            padding: 0.5rem;
        }
        .ra-steps .ra-num {
            display: flex;
            width: 1.25rem;
            margin: 0 0 0.25rem;
        }
    }

    .ra-fader-legend {
        display: flex;
        justify-content: space-between;
        padding: 0 0.875rem 0.625rem;
    }

    /* After you log in: one module per sheet, the phone in its bay and the features below. */
    .ra-sheets-wrap {
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scrollbar-width: thin;
        padding-bottom: 0.5rem;
    }
    .ra-sheets-wrap:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 3px;
    }
    .ra-sheets {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: min(19rem, 82vw);
        gap: 0.875rem;
        width: max-content;
    }
    .ra-sheet {
        scroll-snap-align: start;
        display: flex;
        flex-direction: column;
    }
    .ra-sheet .module-head {
        padding-inline: 0.875rem;
    }
    .ra-sheet .ra-bay {
        margin: 0.5rem;
        padding: 0.875rem;
    }
    .ra-sheet-dev {
        width: 11.5rem;
    }
    .ra-feats {
        padding: 0.25rem 1rem 1rem;
    }
    .ra-feats li {
        padding-block: 0.75rem;
    }
    .ra-feats li + li {
        border-top: 1px solid var(--color-line);
    }
    .ra-feats .meta {
        margin-top: 0.25rem;
    }
    @media (min-width: 64rem) {
        .ra-sheets {
            grid-auto-flow: row;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            width: auto;
        }
    }

    .ra-extras {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
    }
    .ra-x-card .ra-dev {
        width: min(22rem, 100%);
    }
    .ra-x-pixel-top .ra-dev {
        width: 15rem;
    }
    .ra-x-watch .ra-dev {
        width: 10rem;
    }

    @media (min-width: 48rem) {
        .ra-extras {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    @media (min-width: 64rem) {
        .ra-head {
            grid-template-columns: minmax(0, 1fr) 22rem;
            gap: 4rem;
            align-items: center;
        }
        .ra-window .ra-head {
            grid-template-columns: minmax(0, 1fr);
            gap: 2.5rem;
        }
        .ra-hero-dev {
            width: 100%;
        }
    }
</style>
