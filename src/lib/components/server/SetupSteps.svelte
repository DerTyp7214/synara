<script lang="ts">
    import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import Inline from '$lib/components/content/Inline.svelte';
    import ChannelToggle from '$lib/components/download/ChannelToggle.svelte';
    import { fullCompose, minimalCompose, postgresCompose, serverFallsBack, serverImage, type Channel } from '$lib/releases';
    import { composeVariants, firstSteps, startCommands } from './content';

    let channel = $state<Channel>('stable');
    type Variant = keyof typeof composeVariants;
    const variants = Object.keys(composeVariants) as Variant[];
    const builders: Record<Variant, (c: Channel) => string> = { sqlite: minimalCompose, postgres: postgresCompose, full: fullCompose };
    let variant = $state<Variant>('sqlite');

    const compose = $derived(builders[variant](channel));
</script>

<ol class="space-y-16">
    <li class="step grid grid-cols-1 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        <div>
            <span class="num" aria-hidden="true">1</span>
            <h3 class="h-title mt-4">Write a compose file</h3>
            <p class="meta mt-2">
                Save it as <code class="code-inline">compose.yaml</code> in an empty folder. Change every
                <code class="code-inline">change-me</code> value before the first start.
            </p>
        </div>
        <div class="min-w-0">
            <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
                <div class="flex flex-col gap-2">
                    <span class="legend" id="compose-legend">Setup</span>
                    <div class="selector" role="group" aria-labelledby="compose-legend">
                        {#each variants as v (v)}
                            <button type="button" aria-pressed={variant === v} onclick={() => (variant = v)}>{composeVariants[v].label}</button>
                        {/each}
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="legend">Image</span>
                    <ChannelToggle bind:channel/>
                </div>
            </div>
            <p class="meta mt-4">{composeVariants[variant].body}</p>
            {#if serverFallsBack(channel)}
                <p class="mt-3 flex gap-2.5 text-[0.9375rem] text-warn">
                    <TriangleAlert class="mt-0.5 size-4 shrink-0" aria-hidden="true"/>
                    <span>No stable server image yet, so this file uses the dev images (<code class="code-inline">{serverImage(channel)}</code>).</span>
                </p>
            {/if}
            <CodeBlock class="mt-4" title="compose.yaml ({composeVariants[variant].label})" code={compose}/>
        </div>
    </li>

    <li class="step grid grid-cols-1 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        <div>
            <span class="num" aria-hidden="true">2</span>
            <h3 class="h-title mt-4">Start it</h3>
            <p class="meta mt-2">The server listens on port 8080. Follow the log until it's ready.</p>
        </div>
        <div class="min-w-0">
            <CodeBlock title="Terminal" code={startCommands}/>
        </div>
    </li>

    <li class="step grid grid-cols-1 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        <div>
            <span class="num" aria-hidden="true">3</span>
            <h3 class="h-title mt-4">Connect an app</h3>
            <p class="meta mt-2">Use the admin account from your compose file. <a class="link" href="/download/">Get the apps</a>.</p>
        </div>
        <ol class="min-w-0 list-inside list-[lower-alpha] divide-y divide-line border-y border-line marker:text-faint">
            {#each firstSteps as s, i (i)}
                <li class="py-3.5"><Inline text={s}/></li>
            {/each}
        </ol>
    </li>
</ol>

<style>
    .num {
        display: inline-grid;
        place-items: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: var(--radius-key);
        background: var(--color-recess);
        box-shadow: var(--well);
        font-family: var(--font-mono);
        font-weight: 500;
        font-size: 0.9375rem;
        color: var(--color-ink);
    }
</style>
