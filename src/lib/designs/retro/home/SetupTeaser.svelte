<script lang="ts">
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import Inline from '$lib/components/content/Inline.svelte';
    import { minimalCompose } from '$lib/releases';
    import { sections, setupSteps } from '$lib/components/home/content';

    const compose = minimalCompose('stable');
</script>

<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
    <div class="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
        <h2 id="host-heading" class="h-section">{sections.host.title}</h2>
        <p class="lead mt-5">{sections.host.lead}</p>
        <ol class="mt-8 space-y-3.5 text-ink/90">
            {#each setupSteps as step, i (i)}
                <li class="flex gap-3"><span class="step">{i + 1}</span><span><Inline text={step}/></span></li>
            {/each}
        </ol>
        <div class="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="/server/" class="key">Read the server guide</a>
            <p class="meta">{sections.host.postgres} <a class="link" href="/server/#setup-h">See the server guide</a>.</p>
        </div>
    </div>
    <CodeBlock title="compose.yaml (minimal)" code={compose}/>
</div>

<style>
    .step {
        display: inline-grid;
        place-items: center;
        flex-shrink: 0;
        width: 1.625rem;
        height: 1.625rem;
        border-radius: var(--radius-key);
        background: var(--color-recess);
        box-shadow: var(--well);
        font-family: var(--font-mono);
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--color-ink);
        margin-top: 0.05rem;
    }
</style>
