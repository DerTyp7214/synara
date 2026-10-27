<script lang="ts">
    import { onMount } from 'svelte';
    import Shot from './Shot.svelte';
    import type { ShotKey } from './shots';
    import { prefersReducedMotion } from '$lib/designs/modern/motion';

    // Two shots of the same screen stacked in one frame. The top one (`over`) is clipped at a divider
    // (clip-path: inset() from --rv), so dragging the handle reveals it on the left and leaves `base` on
    // the right. The control is a real range input (arrow keys, Home/End, screen readers); pointer drags
    // and taps on the screen set it too. On first view it sweeps a little and back once (not under
    // reduced motion). `look` picks the Modern glass handle or the Retro fader knob.
    let {
        base,
        baseAlt,
        over,
        overAlt,
        label,
        sizes,
        look = 'modern'
    }: {
        base: ShotKey;
        baseAlt: string;
        over: ShotKey;
        overAlt: string;
        label: string;
        sizes: string;
        look?: 'modern' | 'retro';
    } = $props();

    let value = $state(50);
    let el: HTMLElement | undefined = $state();
    let input: HTMLInputElement | undefined = $state();
    let dragging = $state(false);
    // Input modality: the focus ring is for keyboard users. A pointer press sets it, any key clears it
    // (Chrome can match :focus-visible on a range input focused by the pointer).
    let pointerMode = $state(false);

    function setFromX(clientX: number) {
        if (!el) return;
        const r = el.getBoundingClientRect();
        value = Math.round(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
    }
    function down(e: PointerEvent) {
        if (e.button !== 0) return;
        // No compatibility mousedown: it would move focus off the input and start a text selection.
        e.preventDefault();
        pointerMode = true;
        dragging = true;
        el?.setPointerCapture(e.pointerId);
        // Keyboard control continues from where the pointer left it.
        input?.focus({ preventScroll: true });
        setFromX(e.clientX);
    }
    function move(e: PointerEvent) {
        if (dragging) setFromX(e.clientX);
    }
    function up(e: PointerEvent) {
        dragging = false;
        if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    }

    // The hint: 50 -> 64 -> 38 -> 50 over about 1.4 s, once, when it first scrolls into view.
    onMount(() => {
        if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
        let raf = 0;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                const start = performance.now();
                const keys = [50, 64, 38, 50];
                const dur = 1400;
                const frame = (now: number) => {
                    if (dragging) return;
                    const t = Math.min(1, (now - start) / dur);
                    const seg = Math.min(keys.length - 2, Math.floor(t * (keys.length - 1)));
                    const local = t * (keys.length - 1) - seg;
                    const ease = 0.5 - Math.cos(local * Math.PI) / 2;
                    value = Math.round((keys[seg] + (keys[seg + 1] - keys[seg]) * ease) * 10) / 10;
                    if (t < 1) raf = requestAnimationFrame(frame);
                };
                raf = requestAnimationFrame(frame);
            },
            { threshold: 0.6 }
        );
        io.observe(el);
        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    });
</script>

<div
    class="rv rv-{look}"
    class:dragging
    data-pointer={pointerMode ? '' : undefined}
    style:--rv="{value}%"
    bind:this={el}
    onpointerdown={down}
    onpointermove={move}
    onpointerup={up}
    onpointercancel={up}
    role="presentation"
>
    <div class="rv-base"><Shot key={base} alt={baseAlt} {sizes}/></div>
    <div class="rv-over"><Shot key={over} alt={overAlt} {sizes}/></div>
    <span class="rv-line" aria-hidden="true"></span>
    <span class="rv-handle" aria-hidden="true">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6 3 12l6 6M15 6l6 6-6 6"/></svg>
    </span>
    <input
        class="rv-input"
        type="range"
        min="0"
        max="100"
        step="1"
        bind:value
        bind:this={input}
        onkeydown={() => (pointerMode = false)}
        onfocus={() => {
            if (!dragging) pointerMode = false;
        }}
        aria-label={label}
        aria-valuetext="{Math.round(value)}% revealed"
    />
</div>

<style>
    .rv {
        position: relative;
        /* Vertical swipes still scroll the page; horizontal drags move the divider. */
        touch-action: pan-y;
        cursor: ew-resize;
        user-select: none;
        -webkit-user-select: none;
    }
    .rv :global(img) {
        pointer-events: none;
        -webkit-user-drag: none;
    }
    .rv-over {
        position: absolute;
        inset: 0;
        clip-path: inset(0 calc(100% - var(--rv)) 0 0);
    }
    .rv-line {
        position: absolute;
        top: 0;
        bottom: 0;
        left: var(--rv);
        width: 2px;
        margin-left: -1px;
        background: rgb(255 255 255 / 0.9);
        box-shadow: 0 0 0 1px rgb(0 0 0 / 0.25), 0 0 12px rgb(0 0 0 / 0.35);
    }
    .rv-handle {
        position: absolute;
        top: 50%;
        left: var(--rv);
        display: grid;
        place-items: center;
        translate: -50% -50%;
        pointer-events: none;
    }
    /* A fixed-size block glyph in a fixed-size grid box: centred the same way focused or not. */
    .rv-handle svg {
        display: block;
        width: 1.25rem;
        height: 1.25rem;
        margin: 0;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.25;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    /* The real control: covers the screen, invisible. Pointer input goes to the container instead. */
    .rv-input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        pointer-events: none;
    }
    .rv:not([data-pointer]):has(.rv-input:focus-visible) .rv-handle {
        outline: 2px solid var(--color-accent);
        outline-offset: 3px;
    }

    /* Modern: an iOS glass knob. */
    .rv-modern .rv-handle {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 50%;
        background: var(--glass-specular), rgb(255 255 255 / 0.55);
        -webkit-backdrop-filter: blur(12px) saturate(1.6);
        backdrop-filter: blur(12px) saturate(1.6);
        box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 0.8),
            inset 0 0 0 1px rgb(255 255 255 / 0.5),
            0 4px 14px -4px rgb(0 0 0 / 0.45);
        color: #1c1c1e;
        transition: scale var(--m-dur-press) var(--ease-spring);
    }
    .rv-modern.dragging .rv-handle {
        scale: 1.12;
    }

    /* Retro: a fader knob with a legend line. */
    .rv-retro .rv-line {
        width: 2px;
        background: var(--color-accent);
        box-shadow: 0 0 6px color-mix(in oklab, var(--color-accent) 70%, transparent);
    }
    .rv-retro .rv-handle {
        width: 1.75rem;
        height: 3rem;
        border-radius: var(--radius-key);
        border: 1px solid var(--key-edge);
        background:
            repeating-linear-gradient(180deg, transparent 0 5px, rgb(0 0 0 / 0.18) 5px 6px),
            linear-gradient(180deg, var(--key-top), var(--key-bottom));
        box-shadow: inset 0 1px 0 var(--key-hl), 0 3px 8px -2px rgb(0 0 0 / 0.6);
        color: var(--color-ink);
    }
    .rv-retro .rv-handle svg {
        display: none;
    }
    .rv-retro .rv-handle::after {
        content: '';
        width: 60%;
        height: 2px;
        background: var(--color-accent);
        border-radius: 1px;
    }
    .rv-retro:not([data-pointer]):has(.rv-input:focus-visible) .rv-handle {
        outline-color: var(--color-accent);
    }
</style>
