<script lang="ts">
    import Server from '@lucide/svelte/icons/server';
    import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import { serverFallsBack, serverImage, serverTag, type Channel } from '$lib/releases';

    let { channel }: { channel: Channel } = $props();
    import { server } from './content';
</script>

<article class="module min-w-0" aria-labelledby="server-h">
    <div class="module-head">
        <h2 id="server-h" class="module-title"><Server class="size-5" aria-hidden="true"/>Server</h2>
        <span class="readout text-muted">:{serverTag(channel)}</span>
    </div>
    <div class="module-body">
        <p class="meta">{server.body}</p>
        {#if serverFallsBack(channel)}
            <p class="mt-4 flex gap-2.5 text-[0.9375rem] text-warn">
                <TriangleAlert class="mt-0.5 size-4 shrink-0" aria-hidden="true"/>
                {server.fallback}
            </p>
        {/if}
        <CodeBlock class="mt-4" title="Image" code={`docker pull ${serverImage(channel)}`}/>
        <a href={channel === 'dev' ? '/server/?channel=dev' : '/server/'} class="key mt-5">Set up a server</a>
    </div>
</article>
