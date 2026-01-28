<script lang="ts">
    import { page } from '$app/state';

    let titleParam = $derived(page.url.searchParams.get('title') ?? 'Unknown Title');
    let artistsParam = $derived(page.url.searchParams.getAll('artist'));
    let durationParam = $derived(page.url.searchParams.get('duration'));
    let mbid = $derived(page.url.searchParams.get('mbid'));

    let mbData = $state<any>(null);
    let loading = $state(false);

    $effect(() => {
        if (mbid) {
            loading = true;
            fetch(`https://musicbrainz.org/ws/2/recording/${mbid}?fmt=json&inc=artist-credits+releases`)
                .then(res => res.json())
                .then(data => {
                    mbData = data;
                    loading = false;
                })
                .catch(err => {
                    console.error("Failed to fetch MB data", err);
                    loading = false;
                });
        } else {
            mbData = null;
        }
    });

    let displayTitle = $derived(mbData?.title ?? titleParam);

    let displayArtists = $derived.by(() => {
        if (mbData?.['artist-credit']) {
            return mbData['artist-credit'].map((c: any) => c.name + (c.joinphrase || '')).join('');
        }
        return artistsParam.length > 0 ? artistsParam.join(', ') : 'Unknown Artist';
    });

    function formatDuration(ms: number) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
    }

    let displayDuration = $derived(
        mbData?.length
            ? formatDuration(mbData.length)
            : durationParam
    );

    let deeplink = $derived(`synara://share${page.url.search}`);
    let mbLink = $derived(mbid ? `https://musicbrainz.org/recording/${mbid}` : null);
</script>

<div class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-surface-900">
    <!-- Background Effects -->
    <div class="absolute w-150 h-150 bg-primary-500/20 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-10"></div>

    <div class="container mx-auto p-4 flex flex-col items-center justify-center relative z-20">
        <div class="card p-8 w-full max-w-2xl bg-surface-100-800-token shadow-xl space-y-6 text-center border border-surface-200-700-token rounded-container-token backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
            <h1 class="h3 font-bold uppercase tracking-widest opacity-60">Shared Track</h1>

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

                {#if mbLink}
                    <a href={mbLink} target="_blank" rel="noopener noreferrer" class="btn preset-tonal w-full">
                        View on MusicBrainz
                    </a>
                {/if}
            </div>

            {#if mbid}
                <div class="text-xs opacity-50 font-mono mt-2 break-all">
                    MBID: {mbid}
                </div>
            {/if}
        </div>
    </div>
</div>
