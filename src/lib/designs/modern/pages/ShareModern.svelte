<script lang="ts">
    import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
    import Disc3 from '@lucide/svelte/icons/disc-3';
    import Info from '@lucide/svelte/icons/info';
    import Play from '@lucide/svelte/icons/play';
    import PlatformIcon from '$lib/components/share/PlatformIcon.svelte';
    import type { ShareLink } from '$lib/share/resolve';
    import '$lib/designs/modern/pages/groups.css';

    let {
        empty,
        loading,
        kind,
        title,
        artists,
        album,
        durationLabel,
        cover,
        round,
        initials,
        links,
        deeplink,
        mbLink,
        ids,
        onCoverFailed
    }: {
        empty: boolean;
        loading: boolean;
        kind: string;
        title: string;
        artists: string;
        album: string | undefined;
        durationLabel: string | null;
        cover: string | undefined;
        round: boolean;
        initials: string;
        links: ShareLink[];
        deeplink: string;
        mbLink: string | null | undefined;
        ids: { label: string; value: string }[];
        onCoverFailed: () => void;
    } = $props();

    let root: HTMLElement | undefined = $state();
    // The tint needs a CORS-readable image. If the host refuses the CORS request, show the cover without it.
    let cors = $state(true);
    let coverLoaded = $state(false);

    $effect(() => {
        cover;
        cors = true;
        coverLoaded = false;
        if (root) root.style.cssText = ''; // drop the previous cover's tint
    });

    async function tintFrom(img: HTMLImageElement) {
        coverLoaded = true;
        if (!root || !cors) return;
        try {
            // Loaded on demand: the quantiser is only needed here.
            const m = await import('$lib/designs/modern/coverTint');
            if (!m.applyCoverTint(img, root)) m.clearTint(root);
        } catch {
            /* keep the base tint */
        }
    }

    function coverError() {
        if (cors) cors = false;
        else onCoverFailed();
    }
</script>

<div class="ms tint" bind:this={root}>
    {#if cover}<div class="ms-bg" style:background-image="url({JSON.stringify(cover)})" aria-hidden="true"></div>{/if}

    <header class="ms-top">
        <a href="/" class="brand" aria-label="Synara home">
            <img src="/brand/app-icon-fg.svg" alt="" width="32" height="32" class="brand-icon"/>
            <span class="brand-name">Synara</span>
        </a>
    </header>

    <main class="ms-stage">
        {#if empty}
            <section class="ms-empty" aria-labelledby="ms-empty-h">
                <img src="/brand/app-icon-fg.svg" alt="" width="96" height="96" class="ms-empty-icon"/>
                <h1 id="ms-empty-h">Nothing shared yet</h1>
                <p>
                    This page shows songs, albums and artists that someone shared from Synara.
                    Open a share link from the app to see it.
                </p>
                <a href="/download/" class="key key-primary key-lg">Get the app</a>
            </section>
        {:else}
            <div class="ms-grid">
                <section class="ms-card glass glass-card-lg" class:resolved={!loading} aria-busy={loading} aria-label="Shared {kind.toLowerCase()}">
                    <div class="ms-cover" class:round class:loaded={coverLoaded}>
                        {#if cover}
                            {#key cors}
                                <img
                                    src={cover}
                                    alt="Cover art for {title}"
                                    crossorigin={cors ? 'anonymous' : undefined}
                                    onload={(e) => tintFrom(e.currentTarget as HTMLImageElement)}
                                    onerror={coverError}
                                />
                            {/key}
                        {:else if loading}
                            <div class="ms-fill skeleton" aria-hidden="true"></div>
                        {:else}
                            <div class="ms-fill ms-initials" aria-hidden="true">{#if initials}{initials}{:else}<Disc3 class="size-1/3"/>{/if}</div>
                        {/if}
                    </div>

                    <div class="ms-info">
                        <p class="ms-kind">Shared {kind.toLowerCase()}{#if durationLabel}<span class="sr-only">, {durationLabel}</span>{/if}</p>
                        <h1 class="ms-title">{title}</h1>
                        {#if artists}<p class="ms-artist">{artists}</p>{/if}
                        {#if album}<p class="ms-album">From {album}</p>{/if}
                        {#if durationLabel}<p class="ms-time" aria-hidden="true">{durationLabel}</p>{/if}

                        <a href={deeplink} class="ms-play key key-primary key-lg">
                            <Play class="size-5 fill-current" aria-hidden="true"/>Open in Synara
                        </a>
                    </div>
                </section>

                <div class="ms-side">
                    <section aria-labelledby="ms-links-h">
                        <h2 id="ms-links-h" class="ms-head">Listen elsewhere</h2>
                        {#if links.length > 0}
                            <ul class="ms-list">
                                {#each links as link, i (link.name)}
                                    <li style:--i={i}>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" class="ms-row">
                                            <span class="ms-ico" aria-hidden="true"><PlatformIcon name={link.name} class="size-5"/></span>
                                            <span class="ms-name">{link.name}</span>
                                            <ArrowUpRight class="size-4.5 shrink-0 opacity-70" aria-hidden="true"/>
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        {:else if loading}
                            <ul class="ms-list" aria-hidden="true">
                                {#each [0, 1, 2] as i (i)}
                                    <li class="ms-row"><span class="ms-ico skeleton"></span><span class="ms-line skeleton"></span></li>
                                {/each}
                            </ul>
                            <span class="sr-only">Looking for streaming links</span>
                        {:else}
                            <div class="ms-list">
                                <p class="ms-row ms-none"><Info class="size-5 shrink-0" aria-hidden="true"/> No streaming links found for this one.</p>
                            </div>
                        {/if}
                    </section>

                    {#if mbLink || ids.length}
                        <section aria-label="More details">
                            <ul class="ms-list">
                                {#if mbLink}
                                    <li>
                                        <a href={mbLink} target="_blank" rel="noopener noreferrer" class="ms-row">
                                            <span class="ms-name">View on MusicBrainz</span>
                                            <ArrowUpRight class="size-4.5 shrink-0 opacity-70" aria-hidden="true"/>
                                        </a>
                                    </li>
                                {/if}
                                {#if ids.length}
                                    <li>
                                        <dl class="ms-ids">
                                            {#each ids as id (id.label)}<dt>{id.label}</dt><dd>{id.value}</dd>{/each}
                                        </dl>
                                    </li>
                                {/if}
                            </ul>
                        </section>
                    {/if}
                </div>
            </div>
        {/if}
    </main>

    <footer class="ms-foot">
        {#if !empty}<a href="/download/" class="link meta">Don’t have Synara? Get the app</a>{/if}
    </footer>
</div>

<style>
    .ms {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        background: var(--tint-surface);
        color: var(--tint-ink);
    }
    /* The cover, blurred: the colour the glass card floats over (like the iOS now-playing backdrop). */
    .ms-bg {
        position: absolute;
        inset: -4rem;
        z-index: -1;
        background-size: cover;
        background-position: center;
        filter: blur(56px) saturate(1.5);
        opacity: 0.5;
        transform: translateZ(0);
    }
    @media (prefers-color-scheme: light) {
        :global(:root:not([data-theme='dark'])) .ms-bg {
            opacity: 0.42;
        }
    }
    :global(:root[data-theme='light']) .ms-bg {
        opacity: 0.42;
    }
    .ms-top,
    .ms-stage,
    .ms-foot {
        width: 100%;
        max-width: 62rem;
        margin-inline: auto;
        padding-inline: var(--gutter);
    }
    .ms-top {
        padding-top: 1.25rem;
    }
    .brand {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-ink);
        border-radius: var(--radius-tight);
    }
    .brand-icon {
        width: 2rem;
        height: 2rem;
    }
    .brand-name {
        font-family: var(--font-display);
        font-size: var(--ios-headline-size);
        font-weight: 700;
        letter-spacing: -0.02em;
    }
    .ms-stage {
        flex: 1;
        display: grid;
        align-items: center;
        padding-block: 1.5rem;
    }
    .ms-foot {
        padding-block: 0.5rem 2rem;
        text-align: center;
    }

    .ms-grid {
        display: grid;
        gap: 1.5rem;
        width: 100%;
        max-width: 26rem;
        margin-inline: auto;
    }
    @media (min-width: 52rem) {
        .ms-grid {
            max-width: none;
            grid-template-columns: minmax(0, 26rem) minmax(0, 1fr);
            gap: 2.5rem;
            align-items: center;
        }
    }

    /* The player card: cover first, text and one prominent action beneath. */
    .ms-card {
        display: grid;
        gap: 1.25rem;
        padding: 0.875rem 0.875rem 1.25rem;
        color: var(--color-ink);
    }
    .ms-cover {
        border-radius: calc(var(--m-radius-card-lg) - 0.875rem);
        overflow: hidden;
        aspect-ratio: 1;
        background: var(--tint-container);
        box-shadow: 0 14px 34px -12px rgb(0 0 0 / 0.5);
    }
    .ms-cover.round {
        border-radius: 50%;
    }
    .ms-cover img,
    .ms-fill {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .ms-initials {
        display: grid;
        place-items: center;
        background: var(--tint-container);
        color: var(--tint-on-container);
        font-size: clamp(3.5rem, 16vw, 6rem);
        font-weight: 700;
        letter-spacing: -0.02em;
    }
    .ms-info {
        padding-inline: 0.5rem;
    }
    .ms-kind {
        font-size: var(--ios-footnote-size);
        font-weight: 600;
        color: var(--color-muted);
    }
    .ms-title {
        margin-top: 0.25rem;
        font-family: var(--font-display);
        font-size: clamp(1.625rem, 1.2rem + 1.6vw, 2rem);
        font-weight: 700;
        line-height: 1.15;
        letter-spacing: -0.02em;
        overflow-wrap: anywhere;
        text-wrap: balance;
    }
    .ms-artist {
        margin-top: 0.25rem;
        font-size: var(--ios-title3-size);
        line-height: 1.3;
        color: color-mix(in oklab, var(--tint-primary) 45%, var(--color-ink));
        overflow-wrap: anywhere;
    }
    .ms-album {
        margin-top: 0.125rem;
        font-size: var(--ios-subheadline-size);
        color: var(--color-muted);
        overflow-wrap: anywhere;
    }
    .ms-time {
        margin-top: 0.75rem;
        font-size: var(--ios-footnote-size);
        font-variant-numeric: tabular-nums;
        color: var(--color-muted);
    }
    .ms-play {
        width: 100%;
        margin-top: 1.25rem;
        background: var(--tint-primary);
        color: var(--tint-on-primary);
    }
    .ms-play:hover {
        background: var(--tint-primary);
        filter: brightness(1.08);
    }

    /* Streaming links: rows on a cover-tinted grouped surface. */
    .ms-side {
        display: grid;
        gap: 1.5rem;
    }
    .ms-head {
        padding: 0 1rem 0.5rem;
        font-size: var(--ios-footnote-size);
        font-weight: 600;
        color: var(--color-muted);
    }
    .ms-list {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        border-radius: var(--m-radius-group);
        background: var(--tint-surface-high);
    }
    .ms-row {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.875rem;
        min-height: 3.5rem;
        padding: 0.625rem 1rem;
        color: var(--tint-ink);
        transition: background-color var(--dur-ui);
    }
    a.ms-row:hover {
        background: color-mix(in oklab, var(--tint-ink) 7%, transparent);
    }
    a.ms-row:active {
        background: color-mix(in oklab, var(--tint-ink) 12%, transparent);
    }
    a.ms-row:focus-visible {
        outline-offset: -3px;
    }
    .ms-list > li + li > .ms-row::before,
    .ms-list > li + li::before {
        content: '';
        position: absolute;
        top: 0;
        left: 1rem;
        right: 0;
        height: 1px;
        background: var(--tint-outline);
        opacity: 0.3;
    }
    .ms-list > li {
        position: relative;
    }
    .ms-ico {
        flex: none;
        display: grid;
        place-items: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.625rem;
        background: var(--tint-container);
        color: var(--tint-on-container);
    }
    .ms-name {
        flex: 1;
        min-width: 0;
        font-size: var(--ios-body-size);
        font-weight: 500;
    }
    .ms-none {
        color: var(--tint-muted);
        font-size: var(--ios-subheadline-size);
    }
    .ms-line {
        height: 0.875rem;
        width: 40%;
        border-radius: 999px;
    }
    .ms-ids {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.4rem 1rem;
        padding: 0.875rem 1rem;
        font-size: var(--ios-footnote-size);
    }
    .ms-ids dt {
        font-weight: 600;
        color: var(--tint-muted);
    }
    .ms-ids dd {
        font-family: var(--font-mono);
        overflow-wrap: anywhere;
        user-select: all;
    }

    /* Motion: the card settles in once the lookup has finished, link rows stagger in, the cover fades up.
     * All of it is off under prefers-reduced-motion. */
    @media (prefers-reduced-motion: no-preference) {
        .ms-card.resolved {
            animation: pop 460ms var(--ease-spring, cubic-bezier(0.3, 1.25, 0.5, 1)) both;
        }
        .ms-list > li {
            animation: rise 420ms var(--ease-out-soft, cubic-bezier(0.2, 0.7, 0.2, 1)) both;
            animation-delay: calc(var(--i, 0) * 60ms + 120ms);
        }
        .ms-cover img {
            opacity: 0;
            transition: opacity 360ms var(--ease-out-soft, ease-out);
        }
        .ms-cover.loaded img {
            opacity: 1;
        }
    }
    @keyframes pop {
        from {
            opacity: 0.6;
            transform: scale(0.97);
        }
    }
    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
    }

    .skeleton {
        background: linear-gradient(90deg, var(--tint-container) 0%, var(--tint-surface-high) 50%, var(--tint-container) 100%);
        background-size: 200% 100%;
        animation: shimmer 1.4s linear infinite;
        opacity: 0.7;
    }
    @keyframes shimmer {
        to {
            background-position: -200% 0;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .skeleton {
            animation: none;
        }
    }

    /* Empty state: an iOS "content unavailable" view. */
    .ms-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        max-width: 24rem;
        margin-inline: auto;
        text-align: center;
    }
    .ms-empty-icon {
        width: 6rem;
        height: 6rem;
        margin-bottom: 0.5rem;
    }
    .ms-empty h1 {
        font-family: var(--font-display);
        font-size: var(--ios-title1-size);
        font-weight: 700;
        letter-spacing: -0.015em;
    }
    .ms-empty p {
        color: var(--color-muted);
        font-size: var(--ios-callout-size);
        line-height: 1.45;
    }
    .ms-empty .key {
        margin-top: 0.75rem;
        background: var(--tint-primary);
        color: var(--tint-on-primary);
    }
</style>
