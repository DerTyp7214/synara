<script lang="ts">
    import Apple from '@lucide/svelte/icons/apple';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import Download from '@lucide/svelte/icons/download';
    import Laptop from '@lucide/svelte/icons/laptop';
    import Monitor from '@lucide/svelte/icons/monitor';
    import Server from '@lucide/svelte/icons/server';
    import Smartphone from '@lucide/svelte/icons/smartphone';
    import Terminal from '@lucide/svelte/icons/terminal';
    import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import ChannelToggle from '$lib/components/download/ChannelToggle.svelte';
    import { android as androidCopy, apple, channelNotes, desktop, intro, server as serverCopy } from '$lib/components/download/content';
    import {
        DESKTOP_FILES,
        androidApkUrl,
        desktopFallsBack,
        desktopLinks,
        formatDate,
        formatSize,
        pacmanSnippet,
        serverFallsBack,
        serverImage,
        serverTag,
        type AndroidInfo,
        type Channel,
        type DesktopFileKind,
        type VisitorOs
    } from '$lib/releases';
    import '$lib/designs/modern/pages/groups.css';

    // State is owned by the page (one fetch for both designs); this view only renders it.
    let {
        channel = $bindable('stable'),
        os,
        desktopUpdated,
        android,
        recommended
    }: {
        channel: Channel;
        os: VisitorOs;
        desktopUpdated: string | null;
        android: Partial<Record<Channel, AndroidInfo>>;
        recommended: DesktopFileKind | null;
    } = $props();

    const links = $derived(desktopLinks(channel, 'Synara'));
    const classic = $derived(desktopLinks(channel, 'ClassicApp'));
    const mobile = $derived(os === 'android' || os === 'ios');
    const info = $derived(android[channel]);
    // Content swaps with a short crossfade, but only after the visitor used the switch (not on load).
    let swapped = $state(false);
    const platformIcon = { deb: Monitor, tar: Monitor, msi: Monitor, dmg: Laptop } as const;
</script>

<div class="shell mp">
    <header class="mp-side">
        <h1 id="m-download-h" class="h-display">{intro.title}</h1>
        <p class="lead mt-4">{intro.lead}</p>

        <div class="mt-8" onclickcapture={() => (swapped = true)}>
            <p class="mg-head" aria-hidden="true">Release channel</p>
            <ChannelToggle bind:channel class="w-full"/>
            <p class="mg-foot" aria-live="polite">{channelNotes[channel]}</p>
        </div>
    </header>

    <div class="mp-main">
        <section style:order={mobile ? 1 : 2} aria-labelledby="m-android-h">
            <h2 id="m-android-h" class="mg-head">Android</h2>
            {#key channel}
            <ul class="mg-list" class:swap={swapped}>
                <li class="mg-row has-icon" class:yours={os === 'android'}>
                    <span class="mg-icon" aria-hidden="true"><Smartphone class="size-5"/></span>
                    <div class="mg-text">
                        <p class="mg-title">
                            Synara for Android
                            {#if os === 'android'}<span class="tag tag-lit">Your system</span>{/if}
                        </p>
                        <p class="mg-sub">
                            APK{#if info}, updated {formatDate(info.updated)}, {formatSize(info.size)}{/if}
                        </p>
                    </div>
                    <a href={androidApkUrl(channel)} class="mg-btn key key-sm {os === 'android' || os === null ? 'key-primary' : ''}">
                        <Download class="size-4" aria-hidden="true"/><span class="lbl">Download</span><span class="sr-only"> Android APK</span>
                    </a>
                </li>
            </ul>
            {/key}
            <p class="mg-foot">{androidCopy.body} {androidCopy.install}</p>
        </section>

        <section style:order={mobile ? 2 : 1} aria-labelledby="m-desktop-h">
            <h2 id="m-desktop-h" class="mg-head">Desktop</h2>
            {#key channel}
            <ul class="mg-list" class:swap={swapped}>
                {#each DESKTOP_FILES as f (f.kind)}
                    {@const isRec = recommended === f.kind}
                    {@const Icon = platformIcon[f.kind]}
                    <li class="mg-row has-icon" class:yours={isRec}>
                        <span class="mg-icon" aria-hidden="true"><Icon class="size-5"/></span>
                        <div class="mg-text">
                            <p class="mg-title">
                                {f.label}
                                {#if isRec}<span class="tag tag-lit">Your system</span>{/if}
                            </p>
                            <p class="mg-sub">{f.format}, <span class="mono">{f.ext}</span></p>
                        </div>
                        <a href={links[f.kind]} class="mg-btn key key-sm {isRec ? 'key-primary' : ''}">
                            <Download class="size-4" aria-hidden="true"/><span class="lbl">Download</span><span class="sr-only"> {f.label} {f.ext}</span>
                        </a>
                    </li>
                {/each}
            </ul>
            {/key}
            {#if desktopFallsBack(channel)}
                <p class="mg-foot warn">
                    <TriangleAlert class="mt-px size-4 shrink-0" aria-hidden="true"/>
                    <span>{desktop.fallback}</span>
                </p>
            {/if}
            <p class="mg-foot">
                {desktop.body}{#if desktopUpdated}{' '}Updated {formatDate(desktopUpdated)}.{/if}
            </p>

            <details class="mg-disclosure mt-4">
                <summary class="mg-row mg-list" style="min-height:3.5rem">
                    <span class="mg-text"><span class="mg-title">Classic build</span></span>
                    <ChevronRight class="mg-chev size-5" aria-hidden="true"/>
                </summary>
                <p class="mg-foot">{desktop.classic}</p>
                <ul class="mg-list mt-3">
                    {#each DESKTOP_FILES as f (f.kind)}
                        <li class="mg-row">
                            <div class="mg-text">
                                <p class="mg-title">{f.label}</p>
                                <p class="mg-sub mono">{f.ext}</p>
                            </div>
                            <a href={classic[f.kind]} class="mg-btn key key-quiet key-sm">
                                <Download class="size-4" aria-hidden="true"/><span class="lbl">Download</span><span class="sr-only"> classic {f.label} {f.ext}</span>
                            </a>
                        </li>
                    {/each}
                </ul>
            </details>
        </section>

        <section style:order="3" aria-labelledby="m-arch-h">
            <h2 id="m-arch-h" class="mg-head">Arch Linux</h2>
            {#key channel}
            <div class="mg-list" class:swap={swapped}>
                <div class="mg-body">
                    <p class="mg-sub">
                        Add the Synara repository to <code class="code-inline">/etc/pacman.conf</code>, then install.
                    </p>
                    <CodeBlock title="/etc/pacman.conf" code={pacmanSnippet(channel)}/>
                    <CodeBlock title="Terminal: Synara" code="sudo pacman -Sy synara"/>
                    <CodeBlock title="Terminal: Classic build" code="sudo pacman -Sy synara-classic"/>
                </div>
            </div>
            {/key}
        </section>

        <section style:order="4" aria-labelledby="m-server-h">
            <h2 id="m-server-h" class="mg-head">Server</h2>
            {#key channel}
            <div class="mg-list" class:swap={swapped}>
                <div class="mg-row has-icon">
                    <span class="mg-icon" aria-hidden="true"><Server class="size-5"/></span>
                    <div class="mg-text">
                        <p class="mg-title">Docker image <span class="tag mono">:{serverTag(channel)}</span></p>
                        <p class="mg-sub">{serverCopy.body}</p>
                    </div>
                </div>
                <div class="mg-body">
                    <CodeBlock title="Image" code={`docker pull ${serverImage(channel)}`}/>
                    <div class="btn-row">
                        <a href={channel === 'dev' ? '/server/?channel=dev' : '/server/'} class="key">Set up a server</a>
                    </div>
                </div>
            </div>
            {/key}
            {#if serverFallsBack(channel)}
                <p class="mg-foot warn">
                    <TriangleAlert class="mt-px size-4 shrink-0" aria-hidden="true"/>
                    <span>{serverCopy.fallback}</span>
                </p>
            {/if}
        </section>

        <section style:order="5" aria-labelledby="m-apple-h">
            <h2 id="m-apple-h" class="mg-head">Apple</h2>
            <ul class="mg-list">
                <li class="mg-row has-icon">
                    <span class="mg-icon dim" aria-hidden="true"><Apple class="size-5"/></span>
                    <div class="mg-text">
                        <p class="mg-title">iPhone, iPad, Mac and more <span class="tag">Coming soon</span></p>
                        <p class="mg-sub">{apple.body}{#if os === 'ios'}{' '}{apple.meanwhile}{/if}</p>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</div>
