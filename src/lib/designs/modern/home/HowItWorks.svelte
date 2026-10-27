<script lang="ts">
    import Server from '@lucide/svelte/icons/server';
    import Smartphone from '@lucide/svelte/icons/smartphone';
    import Laptop from '@lucide/svelte/icons/laptop';
    import Apple from '@lucide/svelte/icons/apple';
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import { platforms, sections, serverFacts, type Platform } from '$lib/components/home/content';
    import './home.css';

    // Modern "how it works": the server as a grouped card with value rows (like Settings > About), then
    // the apps as an inset-grouped list. One arrow between them, no cables.
    const icons: Record<Platform['id'], typeof Laptop> = { android: Smartphone, desktop: Laptop, apple: Apple };
</script>

<section class="mh-section" aria-labelledby="m-how-h">
    <div class="shell">
        <div class="intro">
            <h2 id="m-how-h" class="h-section">{sections.how.title}</h2>
            <p class="lead">{sections.how.lead}</p>
        </div>

        <div class="flow">
            <section class="mh-group server" aria-labelledby="m-how-server">
                <div class="server-head">
                    <span class="mh-tile lg mh-tile-primary" aria-hidden="true"><Server/></span>
                    <div class="min-w-0">
                        <h3 id="m-how-server" class="mh-title">Your server</h3>
                        <p class="mh-sub">Any machine that runs Docker</p>
                    </div>
                </div>
                <dl class="facts">
                    {#each serverFacts as f (f.term)}
                        <div>
                            <dt>{f.term}</dt>
                            <dd class={f.mono ? 'mono' : ''}>{f.value}</dd>
                        </div>
                    {/each}
                </dl>
            </section>

            <span class="arrow" aria-hidden="true"><ArrowRight/></span>

            <section aria-labelledby="m-how-apps">
                <h3 id="m-how-apps" class="mh-group-h">Apps</h3>
                <ul class="mh-group">
                    {#each platforms as c (c.id)}
                        {@const Icon = icons[c.id]}
                        <li class="mh-row {c.soon ? 'soon' : ''}">
                            <span class="mh-tile {c.soon ? 'mh-tile-neutral' : 'mh-tile-secondary'}" aria-hidden="true"><Icon/></span>
                            <div class="min-w-0 flex-1">
                                <p class="row-title-line">
                                    <span class="mh-title">{c.name}</span>
                                    {#if c.soon}<span class="tag">Coming soon</span>{/if}
                                </p>
                                <p class="mh-sub">{c.detail}</p>
                            </div>
                        </li>
                    {/each}
                </ul>
            </section>
        </div>

        <p class="note">{sections.how.note}</p>
    </div>
</section>

<style>
    .intro {
        max-width: 40rem;
    }
    .intro .lead {
        margin-top: 1rem;
    }
    .flow {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        justify-items: stretch;
        gap: 1rem;
        margin-top: 2.5rem;
    }
    .server {
        padding: 1rem 0 0.25rem;
    }
    .server-head {
        display: flex;
        align-items: center;
        gap: 0.875rem;
        padding: 0 1rem 0.875rem;
    }
    .facts > div {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-left: 1rem;
        padding: 0.6875rem 1rem 0.6875rem 0;
        border-top: 1px solid var(--color-line);
        font-size: var(--ios-body-size);
        letter-spacing: var(--ios-body-tracking);
    }
    .facts dt {
        color: var(--color-ink);
    }
    .facts dd {
        text-align: right;
        color: var(--color-muted);
    }
    .facts dd.mono {
        font-family: var(--font-mono);
        font-size: 0.9375rem;
        letter-spacing: 0;
    }

    .arrow {
        display: grid;
        place-items: center;
        justify-self: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background: var(--m-fill);
        color: var(--color-muted);
        transform: rotate(90deg);
    }
    .arrow :global(svg) {
        width: 1.125rem;
        height: 1.125rem;
    }

    .soon :global(.mh-title) {
        color: var(--color-muted);
    }
    .row-title-line {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.25rem 0.625rem;
    }
    .note {
        max-width: 40rem;
        margin-top: 2rem;
        font-size: var(--ios-subheadline-size);
        letter-spacing: var(--ios-subheadline-tracking);
        color: var(--color-muted);
    }

    @media (min-width: 64rem) {
        .flow {
            grid-template-columns: minmax(0, 5fr) auto minmax(0, 6fr);
            align-items: center;
            gap: 1.5rem;
            margin-top: 3.5rem;
        }
        .arrow {
            transform: none;
        }
    }
</style>
