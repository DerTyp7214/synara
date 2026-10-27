<script lang="ts">
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import Inline from '$lib/components/content/Inline.svelte';
    import { minimalCompose } from '$lib/releases';
    import { sections, setupSteps } from '$lib/components/home/content';
    import './home.css';

    // Modern setup teaser: the steps as a numbered inset-grouped list (they are a real sequence), the
    // compose file beside them.
    const compose = minimalCompose('stable');
</script>

<section class="mh-section" aria-labelledby="m-host-h">
    <div class="shell layout">
        <div class="copy">
            <h2 id="m-host-h" class="h-section">{sections.host.title}</h2>
            <p class="lead mt-4">{sections.host.lead}</p>
            <ol class="mh-group steps">
                {#each setupSteps as step, i (i)}
                    <li class="mh-row">
                        <span class="num" aria-hidden="true">{i + 1}</span>
                        <span class="text"><Inline text={step}/></span>
                    </li>
                {/each}
            </ol>
            <div class="actions">
                <a href="/server/" class="key">Read the server guide</a>
                <p class="meta">{sections.host.postgres} <a class="link" href="/server/#setup-h">See the server guide</a>.</p>
            </div>
        </div>
        <CodeBlock title="compose.yaml (minimal)" code={compose}/>
    </div>
</section>

<style>
    .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        align-items: start;
        gap: 2.5rem;
    }
    .steps {
        margin-top: 2rem;
    }
    .steps :global(.mh-row) {
        --mh-tile: 1.75rem;
        align-items: center;
    }
    .num {
        display: inline-grid;
        place-items: center;
        flex-shrink: 0;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background: var(--m-tint-fill);
        color: var(--color-accent-ink);
        font-size: var(--ios-subheadline-size);
        font-weight: 700;
        font-variant-numeric: tabular-nums;
    }
    .text {
        font-size: var(--ios-body-size);
        letter-spacing: var(--ios-body-tracking);
        color: var(--color-ink);
    }
    .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem 1.25rem;
        margin-top: 1.75rem;
    }
    @media (min-width: 64rem) {
        .layout {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
            gap: 4rem;
        }
        .copy {
            position: sticky;
            top: calc(var(--header-h) + 2rem);
        }
    }
</style>
