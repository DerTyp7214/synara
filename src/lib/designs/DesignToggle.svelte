<script lang="ts">
    import BoomBox from '@lucide/svelte/icons/boom-box';
    import Smartphone from '@lucide/svelte/icons/smartphone';
    import type { DesignPref } from '$lib/theme';
    import { design } from './design.svelte';
    import { crossfade } from './modern/motion';

    // "Design: Retro / Modern". One component, two idioms (CSS by the <html data-design> attribute):
    // Retro: a two-position slide switch like ThemeToggle. Modern: a glass segmented control.
    // The lever/thumb position comes from the attribute, so it is right before hydration too.
    let { class: className = '' }: { class?: string } = $props();

    const options: { id: DesignPref; name: string; icon: typeof BoomBox }[] = [
        { id: 'retro', name: 'Retro', icon: BoomBox },
        { id: 'modern', name: 'Modern', icon: Smartphone }
    ];

    // Prerendered as Modern (the default; the server store says so too) and follows the store after
    // hydration. A constant start value means a client on Retro gets a real update, not a stale attribute.
    // eslint-disable-next-line svelte/prefer-writable-derived -- must hydrate as the prerendered value, see above
    let value = $state<DesignPref>('modern');
    $effect(() => {
        value = design.current;
    });

    let buttons: HTMLButtonElement[] = $state([]);

    function select(id: DesignPref) {
        // Leaving or staying on Modern crossfades (Modern motion); from Retro it switches instantly.
        if (id !== design.current) crossfade(() => design.set(id));
    }

    // Radio group keyboard model: arrows move and select; Home/End jump.
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

<div role="radiogroup" aria-label="Design" class="dsw {className}">
    {#each options as o, i (o.id)}
        <button
                type="button"
                role="radio"
                aria-checked={value === o.id}
                tabindex={value === o.id ? 0 : -1}
                title="Design: {o.name}"
                class="opt opt-{o.id}"
                bind:this={buttons[i]}
                onclick={() => select(o.id)}
                onkeydown={(e) => onKeydown(e, i)}
        >
            <o.icon class="icon" aria-hidden="true"/>
            <span class="txt">{o.name}</span>
        </button>
    {/each}
    <span class="slot" aria-hidden="true"><span class="lever"></span></span>
</div>

<style>
    /* ---- Retro: a two-position slide switch, same build as ThemeToggle ---- */
    .dsw {
        position: relative;
        display: inline-grid;
        grid-template-columns: 1fr 1fr;
        width: 2.75rem;
        padding: 0.3rem 0.25rem;
        border-radius: var(--radius-key);
        color: var(--color-faint);
    }
    .dsw:has(:focus-visible) {
        outline: 2px solid var(--color-accent);
        outline-offset: 3px;
    }
    .opt {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* legend on top, the slot (absolutely placed below) underneath */
        padding-bottom: calc(0.2rem + 0.875rem);
        cursor: pointer;
        color: inherit;
        outline: none;
    }
    .dsw:hover {
        color: var(--color-muted);
    }
    .opt :global(.icon) {
        width: 0.625rem;
        height: 0.625rem;
    }
    /* The lit legend follows the attribute too (correct before hydration). */
    :global(:root:not([data-design='modern'])) .opt-retro,
    :global([data-design='modern']) .opt-modern {
        color: var(--color-ink);
    }
    .txt {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
    .slot {
        position: absolute;
        left: 0.25rem;
        right: 0.25rem;
        bottom: 0.3rem;
        display: block;
        height: 0.875rem;
        padding: 2px;
        border-radius: 3px;
        background: var(--color-recess);
        box-shadow: var(--well);
        pointer-events: none;
    }
    .lever {
        display: block;
        width: 50%;
        height: 100%;
        border-radius: 2px;
        border: 1px solid var(--key-edge);
        background: linear-gradient(90deg, var(--key-bottom), var(--key-top) 45%, var(--key-bottom));
        box-shadow: inset 0 1px 0 var(--key-hl), 0 1px 2px rgb(0 0 0 / 0.4);
        transition: transform 180ms var(--ease-out-soft);
    }
    :global([data-design='modern']) .lever {
        transform: translateX(100%);
    }

    /* ---- Modern: a Liquid Glass segmented control with a sliding thumb ---- */
    :global([data-design='modern']) .dsw {
        width: auto;
        padding: 2px;
        border-radius: 999px;
        color: var(--color-muted);
        background: var(--glass-specular), var(--glass-bg);
        -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
        backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
        border: 1px solid var(--glass-border);
        box-shadow: inset 0 1px 0 var(--glass-highlight);
    }
    :global([data-design='modern']) .dsw:has(:focus-visible) {
        outline-offset: 2px;
    }
    :global([data-design='modern']) .opt {
        flex-direction: row;
        justify-content: center;
        gap: 0.3rem;
        min-width: 2.25rem;
        min-height: 1.875rem;
        padding: 0 0.6rem;
        border-radius: 999px;
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: -0.01em;
    }
    :global([data-design='modern']) .opt :global(.icon) {
        width: 0.9375rem;
        height: 0.9375rem;
    }
    :global([data-design='modern']) .slot {
        inset: 2px;
        height: auto;
        padding: 0;
        border-radius: 999px;
        background: none;
        box-shadow: none;
    }
    :global([data-design='modern']) .lever {
        border: 0;
        border-radius: 999px;
        background: var(--m-thumb);
        box-shadow: none;
        transition: transform var(--m-dur-control) var(--ease-spring);
    }
    /* Phones: icons only. Wider: the names, as in an iOS segmented control. */
    @media (min-width: 40rem) {
        :global([data-design='modern']) .opt :global(.icon) {
            display: none;
        }
        :global([data-design='modern']) .txt {
            position: static;
            width: auto;
            height: auto;
            overflow: visible;
            clip-path: none;
        }
    }
    @media (prefers-reduced-transparency: reduce) {
        :global([data-design='modern']) .dsw {
            background: var(--glass-solid);
            -webkit-backdrop-filter: none;
            backdrop-filter: none;
        }
    }
</style>
