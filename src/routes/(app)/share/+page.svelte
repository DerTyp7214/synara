<script lang="ts">
    import { page } from '$app/state';
    import { PUBLIC_LINKRESOLVER_API_KEY } from '$env/static/public';

    let typeParam = $derived(page.url.searchParams.get('type') ?? 'song');
    let titleParam = $derived(page.url.searchParams.get('title') ?? 'Unknown Title');
    let artistsParam = $derived(page.url.searchParams.getAll('artist'));
    let durationParam = $derived(page.url.searchParams.get('duration'));
    let mbid = $derived(page.url.searchParams.get('mbid'));
    let isrc = $derived(page.url.searchParams.get('isrc'));
    let barcode = $derived(page.url.searchParams.get('barcode'));

    let trackData = $state<any>(null);
    let streamingLinks = $state<{ name: string; url: string }[]>([]);
    let loading = $state(false);

    const platforms = [
        { id: 'spotify', name: 'Spotify' },
        { id: 'appleMusic', name: 'Apple Music' },
        { id: 'youtubeMusic', name: 'YouTube Music' },
        { id: 'soundcloud', name: 'SoundCloud' },
        { id: 'deezer', name: 'Deezer' },
        { id: 'tidal', name: 'Tidal' },
        { id: 'bandcamp', name: 'Bandcamp' },
        { id: 'napster', name: 'Napster' },
        { id: 'amazonMusic', name: 'Amazon Music' },
        { id: 'discogs', name: 'Discogs' },
    ];

    const mbDomainMap: Record<string, string> = {
        'open.spotify.com': 'Spotify',
        'music.apple.com': 'Apple Music',
        'itunes.apple.com': 'Apple Music',
        'music.youtube.com': 'YouTube Music',
        'soundcloud.com': 'SoundCloud',
        'deezer.com': 'Deezer',
        'tidal.com': 'Tidal',
        'bandcamp.com': 'Bandcamp',
        'music.amazon.com': 'Amazon Music',
        'napster.com': 'Napster',
        'discogs.com': 'Discogs',
    };

    function extractResolverLinks(links: Record<string, string>): { name: string; url: string }[] {
        return platforms
            .filter(p => links[p.id])
            .map(p => ({ name: p.name, url: links[p.id] }));
    }

    $effect(() => {
        const query = [titleParam, ...artistsParam].join(' ');
        if (!query.trim()) return;

        loading = true;
        streamingLinks = [];
        trackData = null;

        let cancelled = false;

        const encodedQuery = encodeURIComponent(query).replace(/%20/g, '+');
        const fetchItunes = (entity: string) =>
            fetch(`https://itunes.apple.com/search?term=${encodedQuery}&entity=${entity}&limit=1`)
                .then(r => r.json());

        const primaryEntity = typeParam === 'album' ? 'album' : 'song';

        const directLookupId = typeParam === 'song' ? isrc : barcode;
        const directLookupParam = typeParam === 'song' ? 'isrc' : 'upc';

        const fetchItunesDirect = () => directLookupId
            ? fetch(`https://itunes.apple.com/lookup?${directLookupParam}=${encodeURIComponent(directLookupId)}`)
                .then(r => r.json())
                .then((d: any) => d.results?.[0] ?? null)
            : Promise.resolve(null);

        const itunesPromise = fetchItunesDirect()
            .then((direct: any) => {
                if (direct) return direct;
                return fetchItunes(primaryEntity).then((data: any) => {
                    if (data.results?.length > 0) return data.results[0];
                    if (typeParam === 'album') {
                        console.log('Album search failed, falling back to song search');
                        return fetchItunes('song').then((d: any) => d.results?.[0] ?? null);
                    }
                    return null;
                });
            })
            .then((result: any) => {
                if (result && !cancelled) trackData = result;
                return result;
            });

        (async () => {
            try {
                const lookupId = typeParam === 'song' ? isrc : barcode;
                const lookupParam = typeParam === 'song' ? 'isrc' : 'upc';

                if (lookupId) {
                    const r = await fetch(`https://linkresolver.synara.audio/resolve?${lookupParam}=${encodeURIComponent(lookupId)}`, {
                        headers: { 'X-API-Key': PUBLIC_LINKRESOLVER_API_KEY }
                    });
                    if (!cancelled && r.ok) {
                        const data = await r.json();
                        const links = extractResolverLinks(data.links ?? {});
                        if (links.length > 0) {
                            streamingLinks = links;
                            return;
                        }
                    }
                }

                if (cancelled) return;

                if (mbid) {
                    const mbType = typeParam === 'album' ? 'release' : 'recording';
                    const r = await fetch(`https://musicbrainz.org/ws/2/${mbType}/${mbid}?inc=url-rels&fmt=json`);
                    if (!cancelled && r.ok) {
                        const data = await r.json();
                        const mbLinks: { name: string; url: string }[] = [];
                        for (const rel of (data?.relations ?? [])) {
                            const resource = rel?.url?.resource;
                            if (!resource) continue;
                            try {
                                const hostname = new URL(resource).hostname.replace(/^www\./, '');
                                const name = mbDomainMap[hostname];
                                if (name && !mbLinks.some(l => l.name === name)) {
                                    mbLinks.push({ name, url: resource });
                                }
                            } catch {}
                        }
                        if (mbLinks.length > 0) {
                            streamingLinks = mbLinks;
                            return;
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch streaming links', err);
            } finally {
                if (!cancelled) loading = false;
            }
        })();

        itunesPromise.catch((err: any) => console.error('Failed to fetch iTunes data', err));

        return () => { cancelled = true; };
    });

    let displayTitle = $derived(
        (typeParam === 'album' ? trackData?.collectionName : trackData?.trackName) ?? titleParam
    );
    let displayArtists = $derived(
        (typeParam === 'album' && trackData?.collectionArtistName)
            ? trackData.collectionArtistName
            : (trackData?.artistName ?? (artistsParam.length > 0 ? artistsParam.join(', ') : 'Unknown Artist'))
    );

    let displayCover = $derived(trackData?.artworkUrl100?.replace('100x100', '600x600'));

    function formatDuration(ms: number) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds;
    }

    let displayDuration = $derived(
        typeParam === 'song'
            ? (trackData?.trackTimeMillis
                ? formatDuration(trackData.trackTimeMillis)
                : (durationParam ? formatDuration(Number(durationParam)) : null))
            : null
    );

    let deeplink = $derived(`synara://share${page.url.search}`);
    let mbLink = $derived(mbid ? `https://musicbrainz.org/${typeParam === 'album' ? 'release' : 'recording'}/${mbid}` : null);
</script>

<div class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-surface-900">
    <!-- Background Effects -->
    <div class="absolute w-150 h-150 bg-primary-500/20 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-10"></div>

    <div class="container mx-auto p-4 flex flex-col items-center justify-center relative z-20">
        <div class="card p-8 w-full max-w-2xl bg-surface-100-800-token shadow-xl space-y-6 text-center border border-surface-200-700-token rounded-container-token backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
            <h1 class="h3 font-bold uppercase tracking-widest opacity-60">Shared {typeParam === 'album' ? 'Album' : 'Song'}</h1>

            {#if displayCover}
                <img src={displayCover} alt="Album Art" class="w-48 h-48 mx-auto rounded-lg shadow-2xl" />
            {/if}

            <div class="space-y-2">
                <h2 class="h1 font-bold text-primary-500">{displayTitle}</h2>
                <p class="h3 text-surface-600-300-token">
                    {displayArtists}
                </p>
            </div>

            {#if displayDuration}
                <div class="badge preset-filled-surface">
                    Duration: {displayDuration}
                </div>
            {/if}

            <div class="flex flex-col gap-3 w-full pt-4">
                <a href={deeplink} class="btn preset-filled-primary-500 font-bold w-full shadow-lg shadow-primary-500/20">
                    Open in Synara
                </a>

                {#if loading}
                    <div class="placeholder animate-pulse h-10 w-full rounded-token"></div>
                {:else if streamingLinks.length > 0}
                    <div class="grid grid-cols-2 gap-2 w-full">
                        {#each streamingLinks as link}
                            <a href={link.url} target="_blank" rel="noopener noreferrer" class="btn preset-tonal">
                                {link.name}
                            </a>
                        {/each}
                    </div>
                {/if}

                {#if mbLink}
                    <a href={mbLink} target="_blank" rel="noopener noreferrer" class="btn preset-tonal w-full">
                        View on MusicBrainz
                    </a>
                {/if}
            </div>

            {#if mbid || isrc || barcode}
                <div class="text-xs opacity-50 font-mono mt-2 space-y-1">
                    {#if mbid}<div class="break-all">MBID: {mbid}</div>{/if}
                    {#if isrc}<div class="break-all">ISRC: {isrc}</div>{/if}
                    {#if barcode}<div class="break-all">Barcode: {barcode}</div>{/if}
                </div>
            {/if}
        </div>
    </div>
</div>
