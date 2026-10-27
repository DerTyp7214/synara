<script lang="ts">
    import Smartphone from '@lucide/svelte/icons/smartphone';
    import Laptop from '@lucide/svelte/icons/laptop';
    import Apple from '@lucide/svelte/icons/apple';
    import { platforms, serverFacts, type Platform } from './content';

    // Signal flow, drawn as a patch bay: the server's output is cabled to each client's input.
    const icons: Record<Platform['id'], typeof Laptop> = { android: Smartphone, desktop: Laptop, apple: Apple };
    const clients = platforms;
    const ys = [50, 150, 250];
</script>

<div class="bay">
    <!-- Server module -->
    <section class="module server" aria-label="Your server">
        <div class="module-head">
            <span class="legend">Source</span>
            <span class="legend inline-flex items-center gap-2"><span class="led ok" aria-hidden="true"></span>Online</span>
        </div>
        <div class="module-body">
            <p class="h-title">Your server</p>
            <p class="meta mt-1">Any machine that runs Docker</p>
            <dl class="lcd facts mt-5">
                {#each serverFacts as f (f.term)}
                    <div>
                        <dt class="lcd-dim">{f.term}</dt>
                        <dd>{f.value}</dd>
                    </div>
                {/each}
            </dl>
        </div>
        <span class="jack out" aria-hidden="true"><span class="legend">Out</span></span>
    </section>

    <!-- Cables (large screens) -->
    <svg class="cables" viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden="true">
        {#each ys as y, i (y)}
            {#if !clients[i].soon}
                <path d="M0 150 C 50 150, 50 {y}, 100 {y}" class="cable-shadow" vector-effect="non-scaling-stroke"/>
                <path d="M0 150 C 50 150, 50 {y}, 100 {y}" class="cable" vector-effect="non-scaling-stroke"/>
            {/if}
        {/each}
    </svg>

    <!-- Client modules -->
    <ul class="clients">
        {#each clients as c (c.id)}
            {@const Icon = icons[c.id]}
            <li class="client {c.soon ? 'module-blank soon' : 'module live'}">
                <span class="jack in {c.soon ? 'empty' : ''}" aria-hidden="true"></span>
                <span class="icon" aria-hidden="true"><Icon class="size-5"/></span>
                <div class="min-w-0 flex-1">
                    <p class="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span class="h-sub {c.soon ? 'text-muted' : ''}">{c.name}</span>
                        {#if c.soon}<span class="tag">Coming soon</span>{/if}
                    </p>
                    <p class="meta mt-0.5">{c.detail}</p>
                </div>
                <span class="led {c.soon ? '' : 'on'}" aria-hidden="true"></span>
            </li>
        {/each}
    </ul>
</div>

<style>
    .bay {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        position: relative;
    }
    .server {
        position: relative;
        z-index: 1;
    }
    .facts {
        padding: 0.75rem 1rem;
        font-size: 0.8125rem;
    }
    .facts div {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding-block: 0.3rem;
    }
    .facts div + div {
        border-top: 1px solid var(--color-lcd-ghost);
    }
    .facts dt {
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 0.75rem;
    }
    .facts dd {
        text-align: right;
    }

    /* Jacks */
    .jack {
        position: absolute;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: radial-gradient(circle, #000 0 32%, #8d8b84 36% 58%, #4b4a46 62% 70%, transparent 72%);
        box-shadow: 0 1px 0 rgb(255 255 255 / 0.06);
        z-index: 2;
    }
    .jack.empty {
        background: radial-gradient(circle, #000 0 32%, color-mix(in oklab, var(--color-faint) 70%, transparent) 36% 58%, transparent 62%);
    }
    .jack .legend {
        position: absolute;
        top: -1.35rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.625rem;
    }
    /* Mobile: the server's output sits on its bottom edge, the inputs on each client's left edge. */
    .jack.out {
        left: 1.875rem;
        bottom: -0.625rem;
    }
    .jack.out .legend {
        top: auto;
        left: 1.75rem;
        bottom: 0.1rem;
        transform: none;
    }
    .jack.in {
        left: -0.625rem;
        top: calc(50% - 0.625rem);
    }

    .cables {
        display: none;
    }

    .clients {
        position: relative;
        display: grid;
        gap: 1rem;
        margin-top: 2.5rem;
        margin-left: 3.25rem;
    }
    .client {
        position: relative;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.25rem 1rem 1.5rem;
    }
    /* Mobile cable: an elbow from above into each patched input, continuing down to the next one */
    .client.live::before {
        content: '';
        position: absolute;
        left: -0.75rem;
        top: calc(-1rem - 1.5px);
        height: calc(50% + 1rem + 3px);
        width: 0.6rem;
        border-left: 3px solid var(--color-accent);
        border-bottom: 3px solid var(--color-accent);
        border-bottom-left-radius: 6px;
    }
    .client.live:first-child::before {
        top: -2.5rem;
        height: calc(50% + 2.5rem + 1.5px);
    }
    .client.live:has(~ .client.live)::after {
        content: '';
        position: absolute;
        left: -0.75rem;
        top: 50%;
        bottom: 0;
        border-left: 3px solid var(--color-accent);
    }
    .icon {
        display: grid;
        place-items: center;
        flex-shrink: 0;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: var(--radius-key);
        background: var(--color-recess);
        box-shadow: var(--well);
        color: var(--color-ink);
    }
    .soon .icon {
        color: var(--color-faint);
        background: transparent;
        box-shadow: none;
        border: 1px dashed var(--color-line-strong);
    }

    @media (min-width: 64rem) {
        .bay {
            grid-template-columns: minmax(0, 1fr) 8rem minmax(0, 1.15fr);
            align-items: center;
        }
        .jack.out {
            left: auto;
            bottom: auto;
            right: -0.625rem;
            top: calc(50% - 0.625rem);
        }
        .jack.out .legend {
            top: -1.35rem;
            left: 50%;
            bottom: auto;
            transform: translateX(-50%);
        }
        .cables {
            display: block;
            width: 100%;
            height: 100%;
            overflow: visible;
        }
        .cable {
            fill: none;
            stroke: var(--color-accent);
            stroke-width: 3;
            stroke-linecap: round;
        }
        .cable-shadow {
            fill: none;
            stroke: rgb(0 0 0 / 0.35);
            stroke-width: 5;
            transform: translateY(2px);
        }
        .clients {
            grid-template-rows: repeat(3, minmax(0, 1fr));
            height: 100%;
            margin: 0;
            gap: 0;
        }
        .client {
            margin-block: 0.5rem;
        }
        .client.live::before,
        .client.live::after {
            display: none;
        }
    }
</style>
