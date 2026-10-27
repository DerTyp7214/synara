<script lang="ts">
    import { page } from '$app/state';
    import Play from '@lucide/svelte/icons/play';
    import ExternalLink from '@lucide/svelte/icons/external-link';
    import Logo_LONG from '$lib/components/Logo_LONG.svelte';
    import PlatformIcon from '$lib/components/share/PlatformIcon.svelte';
    import ShareModern from '$lib/designs/modern/pages/ShareModern.svelte';
    import { design } from '$lib/designs/design.svelte';
    import {
        parseShareParams,
        resolveShare,
        musicBrainzUrl,
        type ShareLink,
        type ShareMeta,
    } from '$lib/share/resolve';

    let params = $derived(parseShareParams(page.url.searchParams));
    let empty = $derived(!params.title && params.artists.length === 0);

    let meta = $state<ShareMeta>({});
    let links = $state<ShareLink[]>([]);
    let loading = $state(false);
    let coverFailed = $state(false);

    $effect(() => {
        const p = params;
        meta = {};
        links = [];
        coverFailed = false;
        if (!p.title && p.artists.length === 0) {
            loading = false;
            return;
        }
        loading = true;
        const ac = new AbortController();
        resolveShare(p, ac.signal, r => {
            meta = r.meta;
            links = r.links;
        }).finally(() => {
            if (!ac.signal.aborted) loading = false;
        });
        return () => ac.abort();
    });

    const kindLabel = { song: 'Song', album: 'Album', artist: 'Artist' } as const;

    let paramArtists = $derived(params.artists.join(', '));
    let title = $derived(meta.title ?? params.title ?? (params.artists[0] ?? 'Unknown title'));
    let artists = $derived(params.type === 'artist' ? '' : (meta.artist ?? paramArtists));
    let cover = $derived(coverFailed ? undefined : meta.cover);
    let durationMs = $derived(params.type === 'song' ? (meta.durationMs ?? params.durationMs) : null);

    function formatDuration(ms: number) {
        const total = Math.round(ms / 1000);
        const s = total % 60;
        return `${Math.floor(total / 60)}:${s < 10 ? '0' : ''}${s}`;
    }

    let initials = $derived(
        title.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase(),
    );
    let deeplink = $derived(`synara://share${page.url.search}`);
    let mbLink = $derived(musicBrainzUrl(params));
    let pageTitle = $derived(
        empty ? 'Shared music | Synara' : `${title}${artists ? ` by ${artists}` : ''} | Synara`,
    );
    let hasIds = $derived(!!(params.mbid || params.isrc || params.barcode));
    let idRows = $derived(
        [
            { label: 'MBID', value: params.mbid },
            { label: 'ISRC', value: params.isrc },
            { label: 'Barcode', value: params.barcode },
        ].filter((r): r is { label: string; value: string } => !!r.value),
    );
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<!-- /share/ is client-only (ssr = false), so the design can pick the markup without a hydration mismatch. -->
{#if design.isModern}
    <ShareModern
        {empty}
        {loading}
        kind={kindLabel[params.type]}
        {title}
        {artists}
        album={params.type === 'song' && meta.album && meta.album !== title ? meta.album : undefined}
        durationLabel={durationMs ? formatDuration(durationMs) : null}
        {cover}
        round={params.type === 'artist'}
        {initials}
        {links}
        {deeplink}
        {mbLink}
        ids={idRows}
        onCoverFailed={() => (coverFailed = true)}
    />
{:else}
<div class="share">
    <header class="top">
        <a href="/" class="brand" aria-label="Synara home">
            <Logo_LONG class="text-[0.95rem]"/>
        </a>
    </header>

    <main class="stage">
        {#if empty}
            <section class="module empty">
                <div class="module-head">
                    <span class="legend">Input</span>
                    <span class="legend inline-flex items-center gap-2"><span class="led" aria-hidden="true"></span>No signal</span>
                </div>
                <div class="module-body">
                    <h1 class="h-title">Nothing shared here yet</h1>
                    <p class="meta mt-3">
                        This page shows songs, albums and artists that someone shared from Synara.
                        Open a share link from the app to see it.
                    </p>
                    <a href="/download/" class="key key-primary mt-6">Get the app</a>
                </div>
            </section>
        {:else}
            <section class="player faceplate" aria-busy={loading}>
                <span class="screw top-2.5 left-2.5" aria-hidden="true"></span>
                <span class="screw top-2.5 right-2.5" style="--screw-angle: -30deg" aria-hidden="true"></span>
                <span class="screw bottom-2.5 left-2.5" style="--screw-angle: 70deg" aria-hidden="true"></span>
                <span class="screw right-2.5 bottom-2.5" style="--screw-angle: 10deg" aria-hidden="true"></span>

                <div class="art">
                    <div class="window">
                        {#if cover}
                            <img src={cover} alt="Cover art for {title}" class="art-img" draggable="false" onerror={() => (coverFailed = true)} />
                        {:else if loading}
                            <div class="art-img skeleton" aria-hidden="true"></div>
                        {:else}
                            <div class="art-img art-fallback lcd" class:round={params.type === 'artist'} aria-hidden="true">
                                <span class="lcd-dots">{initials || '♪'}</span>
                            </div>
                        {/if}
                        <span class="sheen" aria-hidden="true"></span>
                    </div>
                </div>

                <div class="body">
                    <div class="lcd screen">
                        <p class="status lcd-dim">
                            <span>Shared {kindLabel[params.type].toLowerCase()}{#if durationMs}<span class="sr-only">, {formatDuration(durationMs)}</span>{/if}</span>
                            {#if durationMs}<span class="time lcd-dots" aria-hidden="true">{formatDuration(durationMs)}</span>{/if}
                        </p>
                        <h1 class="name">{title}</h1>
                        {#if artists}<p class="artists">{artists}</p>{/if}
                        {#if params.type === 'song' && meta.album && meta.album !== title}
                            <p class="album lcd-dim">From {meta.album}</p>
                        {/if}
                    </div>

                    <a href={deeplink} class="play key key-primary key-lg mt-5 w-full">
                        <Play class="size-5 fill-current" aria-hidden="true" />Open in Synara
                    </a>

                    <div class="links" aria-label="Listen elsewhere">
                        {#if links.length > 0}
                            <p class="legend mb-2.5">Listen elsewhere</p>
                            <ul class="inputs">
                                {#each links as link (link.name)}
                                    <li>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" class="input key">
                                            <span class="led" aria-hidden="true"></span>
                                            <PlatformIcon name={link.name} class="size-4.5 shrink-0" />
                                            <span class="truncate">{link.name}</span>
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        {:else if loading}
                            <div class="inputs" aria-hidden="true">
                                {#each [0, 1, 2, 3] as i (i)}<div class="chip-skel skeleton"></div>{/each}
                            </div>
                            <span class="sr-only">Looking for streaming links</span>
                        {:else}
                            <p class="meta">No streaming links found for this one.</p>
                        {/if}
                    </div>

                    {#if mbLink || hasIds}
                        <div class="extra">
                            {#if mbLink}
                                <a href={mbLink} target="_blank" rel="noopener noreferrer" class="link meta inline-flex items-center gap-1.5">
                                    View on MusicBrainz <ExternalLink class="size-3.5" aria-hidden="true" />
                                </a>
                            {/if}
                            {#if hasIds}
                                <details class="disclosure ids">
                                    <summary>IDs</summary>
                                    <dl>
                                        {#if params.mbid}<dt>MBID</dt><dd>{params.mbid}</dd>{/if}
                                        {#if params.isrc}<dt>ISRC</dt><dd>{params.isrc}</dd>{/if}
                                        {#if params.barcode}<dt>Barcode</dt><dd>{params.barcode}</dd>{/if}
                                    </dl>
                                </details>
                            {/if}
                        </div>
                    {/if}
                </div>
            </section>
        {/if}
    </main>

    <footer class="foot">
        {#if !empty}<a href="/download/" class="link meta">Don’t have Synara? Get the app</a>{/if}
    </footer>
</div>
{/if}

<style>
    /* The title and artist sit in an LCD (not selectable); people copy song names. */
    .screen :is(.name, .artists, .album) {
        -webkit-user-select: text;
        user-select: text;
    }
    .share {
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        background: var(--color-bg);
    }
    .top {
        padding: 1.25rem var(--gutter) 0;
        max-width: 60rem;
        width: 100%;
        margin-inline: auto;
    }
    .brand {
        display: inline-flex;
        color: var(--color-ink);
        border-radius: var(--radius-tight);
    }
    .stage {
        flex: 1;
        display: grid;
        align-items: center;
        padding: 1.5rem var(--gutter);
        max-width: 60rem;
        width: 100%;
        margin-inline: auto;
    }
    .player {
        display: grid;
        gap: 1.5rem;
        padding: 1.75rem 1.25rem 1.5rem;
        width: 100%;
        max-width: 28rem;
        margin-inline: auto;
    }
    .empty {
        max-width: 28rem;
        width: 100%;
        margin-inline: auto;
    }

    /* Cover art behind a glass window set into the panel */
    .window {
        position: relative;
        padding: 5px;
        border-radius: var(--radius-key);
        background: color-mix(in oklab, var(--color-recess) 80%, #000);
        box-shadow: var(--well);
    }
    .art-img {
        display: block;
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 2px;
        background: var(--color-recess);
    }
    .sheen {
        position: absolute;
        inset: 5px;
        border-radius: 2px;
        pointer-events: none;
        background: linear-gradient(135deg, rgb(255 255 255 / 0.16) 0%, rgb(255 255 255 / 0.04) 32%, transparent 33%);
        box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.06);
    }
    .art-fallback {
        display: grid;
        place-items: center;
        border-radius: 2px;
        font-size: clamp(3.5rem, 16vw, 6rem);
        box-shadow: none;
    }
    .art-fallback.round {
        border-radius: 50%;
    }

    .screen {
        padding: 0.9rem 1.1rem 1rem;
    }
    .status {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1rem;
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    .status .time {
        font-size: 1.625rem;
        line-height: 1;
        color: var(--color-lcd-ink);
        letter-spacing: 0.04em;
    }
    .name {
        margin-top: 0.5rem;
        font-weight: 500;
        font-size: clamp(1.375rem, 5vw, 1.875rem);
        line-height: 1.2;
        overflow-wrap: anywhere;
        text-wrap: balance;
    }
    .artists {
        margin-top: 0.3rem;
        font-size: 1rem;
        overflow-wrap: anywhere;
    }
    .album {
        margin-top: 0.15rem;
        font-size: 0.8125rem;
        overflow-wrap: anywhere;
    }

    .play {
        min-height: 3.5rem;
        font-size: 1.125rem;
    }

    .links {
        margin-top: 1.5rem;
    }
    .inputs {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 0.5rem;
    }
    @media (min-width: 26rem) {
        .inputs {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    .input {
        width: 100%;
        justify-content: flex-start;
        gap: 0.6rem;
        font-size: 0.9375rem;
        letter-spacing: 0.05em;
    }
    .input:hover .led {
        background: radial-gradient(circle at 40% 35%, #ffd2b0 0 18%, var(--color-accent) 55%);
        box-shadow: 0 0 0.4rem color-mix(in oklab, var(--color-accent) 75%, transparent);
    }
    .chip-skel {
        height: 2.75rem;
        border-radius: var(--radius-key);
    }
    .skeleton {
        background: linear-gradient(90deg, var(--color-recess) 0%, var(--color-raised) 50%, var(--color-recess) 100%);
        background-size: 200% 100%;
        animation: shimmer 1.4s linear infinite;
    }
    @keyframes shimmer {
        to { background-position: -200% 0; }
    }
    @media (prefers-reduced-motion: reduce) {
        .skeleton { animation: none; }
    }

    .extra {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.75rem 1.5rem;
        margin-top: 1.25rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-line);
    }
    .ids {
        flex: 1 1 100%;
    }
    .ids dl {
        margin-top: 0.75rem;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.35rem 1rem;
        font-size: 0.8125rem;
    }
    .ids dt {
        font-family: var(--font-label);
        font-weight: 600;
        letter-spacing: 0.1em;
        color: var(--color-faint);
    }
    .ids dd {
        font-family: var(--font-mono);
        overflow-wrap: anywhere;
        user-select: all;
    }

    .foot {
        padding: 0.5rem var(--gutter) 2rem;
        text-align: center;
    }

    @media (min-width: 48rem) {
        .player {
            max-width: 60rem;
            grid-template-columns: minmax(0, 21rem) minmax(0, 1fr);
            gap: 2.5rem;
            padding: 2.5rem;
            align-items: start;
        }
    }
</style>
