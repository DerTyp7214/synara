<script lang="ts">
    import { onMount } from 'svelte';
    import ChannelToggle from '$lib/components/download/ChannelToggle.svelte';
    import DesktopDownloads from '$lib/components/download/DesktopDownloads.svelte';
    import AndroidDownload from '$lib/components/download/AndroidDownload.svelte';
    import AppleCard from '$lib/components/download/AppleCard.svelte';
    import ServerImage from '$lib/components/download/ServerImage.svelte';
    import {
        detectOs,
        fetchAndroidInfo,
        fetchDesktopUpdated,
        recommendedDesktopFile,
        type AndroidInfo,
        type Channel,
        type VisitorOs
    } from '$lib/releases';

    let channel = $state<Channel>('stable');
    let os = $state<VisitorOs>(null);
    let desktopUpdated = $state<string | null>(null);
    let android = $state<Partial<Record<Channel, AndroidInfo>>>({});

    onMount(() => {
        os = detectOs();
        const ctrl = new AbortController();
        fetchDesktopUpdated(ctrl.signal)
            .then((d) => (desktopUpdated = d))
            .catch(() => {});
        fetchAndroidInfo(ctrl.signal)
            .then((a) => (android = a))
            .catch(() => {});
        return () => ctrl.abort();
    });

    const mobile = $derived(os === 'android' || os === 'ios');
    import { channelNotes, intro } from '$lib/components/download/content';
</script>

<svelte:head>
    <title>Download | Synara</title>
    <meta
            name="description"
            content="Download Synara for Android, Linux, Windows and macOS, add the Arch Linux repository, or pull the server image. Stable and dev channels."
    />
</svelte:head>

<section class="pt-10 pb-10 md:pt-16 md:pb-12" aria-labelledby="download-h">
    <div class="shell">
        <h1 id="download-h" class="h-display">{intro.title}</h1>
        <p class="lead mt-5">{intro.lead}</p>

        <div class="channel mt-9">
            <span class="legend">Release channel</span>
            <ChannelToggle bind:channel/>
            <p class="meta" aria-live="polite">{channelNotes[channel]}</p>
        </div>
    </div>
</section>

<div class="pb-(--section-space)">
    <div class="shell grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div class="min-w-0 {mobile ? 'order-2 lg:order-none' : ''}">
            <DesktopDownloads {channel} updated={desktopUpdated} recommended={recommendedDesktopFile(os)}/>
        </div>
        <div class="flex min-w-0 flex-col gap-5 {mobile ? 'order-1 lg:order-none' : ''}">
            <AndroidDownload {channel} info={android[channel]} yours={os === 'android'} primary={os === null || os === 'android'}/>
            <AppleCard yours={os === 'ios'}/>
            <ServerImage {channel}/>
        </div>
    </div>
</div>

<style>
    .channel {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
    @media (min-width: 40rem) {
        .channel {
            flex-direction: row;
            align-items: center;
            gap: 1.25rem;
        }
    }
</style>
