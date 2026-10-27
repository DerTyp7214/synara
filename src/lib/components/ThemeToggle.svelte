<script lang="ts">
    import { onMount } from 'svelte';
    import Monitor from '@lucide/svelte/icons/monitor';
    import Sun from '@lucide/svelte/icons/sun';
    import Moon from '@lucide/svelte/icons/moon';
    import { applyThemePref, readThemePref, type ThemePref } from '$lib/theme';

    let { class: className = '' }: { class?: string } = $props();

    const order: ThemePref[] = ['system', 'light', 'dark'];
    const names: Record<ThemePref, string> = { system: 'System', light: 'Light', dark: 'Dark' };

    let pref = $state<ThemePref>('system');
    let next = $derived(order[(order.indexOf(pref) + 1) % order.length]);
    let pos = $derived(order.indexOf(pref));

    onMount(() => {
        pref = readThemePref();
    });

    function cycle() {
        pref = next;
        applyThemePref(pref);
    }
</script>

<!-- A three-position slide switch: system / light / dark. Clicking moves the lever one step. -->
<button
        type="button"
        class="switch {className}"
        onclick={cycle}
        aria-label="Theme: {names[pref]}. Switch to {names[next].toLowerCase()}."
        title="Theme: {names[pref]}"
>
    <span class="legends" aria-hidden="true">
        <Monitor class="size-2.5 {pos === 0 ? 'on' : ''}"/>
        <Sun class="size-2.5 {pos === 1 ? 'on' : ''}"/>
        <Moon class="size-2.5 {pos === 2 ? 'on' : ''}"/>
    </span>
    <span class="slot" aria-hidden="true">
        <span class="lever" style="transform: translateX({pos * 100}%)"></span>
    </span>
</button>

<style>
    .switch {
        display: inline-flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.2rem;
        width: 3.75rem;
        padding: 0.3rem 0.25rem;
        border-radius: var(--radius-key);
        cursor: pointer;
        color: var(--color-faint);
    }
    .switch:hover {
        color: var(--color-muted);
    }
    .legends {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
    }
    .legends :global(.on) {
        color: var(--color-ink);
    }
    .slot {
        position: relative;
        display: block;
        height: 0.875rem;
        padding: 2px;
        border-radius: 3px;
        background: var(--color-recess);
        box-shadow: var(--well);
    }
    .lever {
        display: block;
        width: 33.333%;
        height: 100%;
        border-radius: 2px;
        border: 1px solid var(--key-edge);
        background: linear-gradient(90deg, var(--key-bottom), var(--key-top) 45%, var(--key-bottom));
        box-shadow: inset 0 1px 0 var(--key-hl), 0 1px 2px rgb(0 0 0 / 0.4);
        transition: transform 180ms var(--ease-out-soft);
    }
</style>
