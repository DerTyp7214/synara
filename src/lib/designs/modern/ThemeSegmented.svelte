<script lang="ts">
    import Monitor from '@lucide/svelte/icons/monitor';
    import Sun from '@lucide/svelte/icons/sun';
    import Moon from '@lucide/svelte/icons/moon';
    import { applyThemePref, readThemePref, type ThemePref } from '$lib/theme';
    import { design } from '$lib/designs/design.svelte';
    import { crossfade } from './motion';

    // Modern theme control: an iOS segmented control, System / Light / Dark.
    // The thumb position comes from the <html data-theme> attribute in CSS, so it is right before
    // hydration; the checked state follows localStorage after mount.
    let { class: className = '', labels = false }: { class?: string; labels?: boolean } = $props();

    const options: { id: ThemePref; name: string; icon: typeof Sun }[] = [
        { id: 'system', name: 'System', icon: Monitor },
        { id: 'light', name: 'Light', icon: Sun },
        { id: 'dark', name: 'Dark', icon: Moon }
    ];

    let pref = $state<ThemePref>('system');
    // Re-read on mount and whenever the design changes (the other design's control may have set it).
    $effect(() => {
        void design.current;
        pref = readThemePref();
    });

    let buttons: HTMLButtonElement[] = $state([]);

    function select(id: ThemePref) {
        if (id === pref) return;
        pref = id;
        crossfade(() => applyThemePref(id));
    }

    function onKeydown(e: KeyboardEvent, i: number) {
        let j = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % options.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + options.length) % options.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = options.length - 1;
        if (j < 0) return;
        e.preventDefault();
        select(options[j].id);
        buttons[j]?.focus();
    }
</script>

<div role="radiogroup" aria-label="Appearance" class="seg {labels ? 'with-labels' : ''} {className}">
    <span class="thumb" aria-hidden="true"></span>
    {#each options as o, i (o.id)}
        <button
                type="button"
                role="radio"
                aria-checked={pref === o.id}
                tabindex={pref === o.id ? 0 : -1}
                title={o.name}
                class="seg-opt"
                bind:this={buttons[i]}
                onclick={() => select(o.id)}
                onkeydown={(e) => onKeydown(e, i)}
        >
            <o.icon class="seg-icon" aria-hidden="true"/>
            <span class={labels ? '' : 'sr-only'}>{o.name}</span>
        </button>
    {/each}
</div>

<style>
    .seg {
        --i: 0;
        position: relative;
        isolation: isolate;
        display: inline-grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        padding: 2px;
        border-radius: var(--m-radius-capsule);
        background: var(--m-seg-track);
        box-shadow: inset 0 0 0 1px var(--m-seg-border);
        color: var(--color-ink);
    }
    :global(:root[data-theme='light']) .seg {
        --i: 1;
    }
    :global(:root[data-theme='dark']) .seg {
        --i: 2;
    }
    .seg:has(:focus-visible) {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
    }
    .thumb {
        position: absolute;
        z-index: -1;
        top: 2px;
        bottom: 2px;
        left: 2px;
        width: calc((100% - 4px) / 3);
        border-radius: var(--m-radius-capsule);
        background: var(--m-thumb);
        box-shadow: none;
        transform: translateX(calc(100% * var(--i)));
        transition: transform var(--m-dur-control) var(--ease-spring);
    }
    .seg-opt {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        min-width: 2.25rem;
        min-height: 1.875rem;
        padding: 0 0.55rem;
        border-radius: var(--m-radius-capsule);
        font-size: var(--ios-footnote-size);
        font-weight: 600;
        letter-spacing: -0.01em;
        color: var(--color-muted);
        cursor: pointer;
        outline: none;
        transition: color var(--dur-ui);
    }
    .seg-opt:hover,
    .seg-opt[aria-checked='true'] {
        color: var(--color-ink);
    }
    .seg :global(.seg-icon) {
        width: 0.9375rem;
        height: 0.9375rem;
    }
    .with-labels .seg-opt {
        min-height: 2.25rem;
        font-size: var(--ios-subheadline-size);
    }
</style>
