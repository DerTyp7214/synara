<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { CHANNELS, channelFromUrl, writeChannelToUrl, type Channel } from '$lib/releases';

    let { channel = $bindable('stable'), class: className = '' }: { channel?: Channel; class?: string } = $props();

    // Prerendered HTML is always Stable; the query string is only read in the browser.
    onMount(() => {
        channel = channelFromUrl(page.url);
    });

    function select(c: Channel) {
        channel = c;
        writeChannelToUrl(c);
    }
</script>

<div class="selector {className}" role="group" aria-label="Release channel">
    {#each CHANNELS as c (c.id)}
        <button type="button" aria-pressed={channel === c.id} onclick={() => select(c.id)}>{c.label}</button>
    {/each}
</div>
