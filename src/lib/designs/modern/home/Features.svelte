<script lang="ts">
    import AudioWaveform from '@lucide/svelte/icons/audio-waveform';
    import Import from '@lucide/svelte/icons/import';
    import Tags from '@lucide/svelte/icons/tags';
    import MicVocal from '@lucide/svelte/icons/mic-vocal';
    import History from '@lucide/svelte/icons/history';
    import Users from '@lucide/svelte/icons/users';
    import MonitorSmartphone from '@lucide/svelte/icons/monitor-smartphone';
    import Radio from '@lucide/svelte/icons/radio';
    import Plug from '@lucide/svelte/icons/plug';
    import MessagesSquare from '@lucide/svelte/icons/messages-square';
    import Puzzle from '@lucide/svelte/icons/puzzle';
    import Lightbulb from '@lucide/svelte/icons/lightbulb';
    import ArchiveRestore from '@lucide/svelte/icons/archive-restore';
    import Sparkles from '@lucide/svelte/icons/sparkles';
    import Laptop from '@lucide/svelte/icons/laptop';
    import Smartphone from '@lucide/svelte/icons/smartphone';
    import Apple from '@lucide/svelte/icons/apple';
    import Check from '@lucide/svelte/icons/check';
    import Inline from '$lib/components/content/Inline.svelte';
    import { apps, features, leadFeatures, sections } from '$lib/components/home/content';
    import './home.css';

    // Modern features: two larger cards for the lead features, then everything else as inset-grouped
    // rows with leading icon tiles (iOS Settings), then the apps behind a segmented control.
    const { lossless, imports } = leadFeatures;

    // Icon and tile tone per feature title. Unknown titles fall back to a neutral sparkle.
    type Tone = 'primary' | 'secondary' | 'tertiary';
    const look: Record<string, [typeof Tags, Tone]> = {
        'MusicBrainz metadata': [Tags, 'secondary'],
        'Synced lyrics': [MicVocal, 'primary'],
        'Scrobbling and history': [History, 'tertiary'],
        'Shared listens': [Users, 'secondary'],
        'Multi-device playback': [MonitorSmartphone, 'primary'],
        'Radio and podcasts': [Radio, 'tertiary'],
        'Subsonic-compatible API': [Plug, 'secondary'],
        'MCP server': [MessagesSquare, 'primary'],
        Plugins: [Puzzle, 'tertiary'],
        'Philips Hue': [Lightbulb, 'secondary'],
        Backups: [ArchiveRestore, 'primary']
    };
    // Wide screens: two groups side by side, the apps under the first one. Split the rows so both
    // columns end at about the same height (rough px model: a row is ~52 px plus ~21 px per line).
    const rowH = (f: { body: string }) => 52 + 21 * Math.ceil(f.body.length / 72);
    const APPS_H = 60 + 16 + 72 + 44 * Math.max(...apps.map((a) => a.items.length)) + 16;
    const all = features.reduce((n, f) => n + rowH(f), 0);
    let half = 1;
    for (let i = 1, acc = 0, best = Infinity; i < features.length; i++) {
        acc += rowH(features[i - 1]);
        const d = Math.abs(acc + APPS_H - (all - acc));
        if (d < best) [best, half] = [d, i];
    }
    const columns = [features.slice(0, half), features.slice(half)];

    // Apps: a segmented control (tabs). Arrow keys move between segments.
    const appIcons: Record<string, typeof Laptop> = { Desktop: Laptop, Android: Smartphone, Apple };
    let selected = $state(0);
    let switched = $state(false); // fade the panel in on a switch, not on page load
    let tabs: HTMLButtonElement[] = $state([]);

    function onTabKey(e: KeyboardEvent, i: number) {
        let j = -1;
        if (e.key === 'ArrowRight') j = (i + 1) % apps.length;
        else if (e.key === 'ArrowLeft') j = (i - 1 + apps.length) % apps.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = apps.length - 1;
        if (j < 0) return;
        e.preventDefault();
        selected = j;
        switched = true;
        tabs[j]?.focus();
    }
</script>

<section class="mh-section" aria-labelledby="m-features-h">
    <div class="shell">
        <h2 id="m-features-h" class="h-section max-w-2xl">{sections.features.title}</h2>

        <!-- Lead features -->
        <div class="leads">
            <article class="mh-group lead-card">
                <span class="mh-tile lg mh-tile-primary" aria-hidden="true"><AudioWaveform/></span>
                <h3 class="h-title mt-5">{lossless.title}</h3>
                <p class="mh-sub mt-2!">{lossless.body}</p>
                <div class="formats" aria-hidden="true">
                    {#each lossless.formats as f, i (f)}
                        <span class={i === 0 ? 'on' : ''}>{f}</span>
                    {/each}
                </div>
            </article>

            <article class="mh-group lead-card">
                <span class="mh-tile lg mh-tile-secondary" aria-hidden="true"><Import/></span>
                <h3 class="h-title mt-5">{imports.title}</h3>
                <p class="mh-sub mt-2!">{imports.body}</p>
                <ul class="sources" aria-label="Import sources">
                    {#each imports.sources as name (name)}
                        <li>{name}</li>
                    {/each}
                </ul>
            </article>
        </div>

        <!-- Everything else: Settings-style rows -->
        <div class="lists">
            {#each columns as col, c (c)}
                <ul class="mh-group list-{c}">
                    {#each col as f (f.title)}
                        {@const [Icon, tone] = look[f.title] ?? [Sparkles, 'secondary']}
                        <li class="mh-row">
                            <span class="mh-tile mh-tile-{tone}" aria-hidden="true"><Icon/></span>
                            <div class="min-w-0">
                                <h3 class="mh-title">{f.title}</h3>
                                <p class="mh-sub"><Inline text={f.body}/></p>
                            </div>
                        </li>
                    {/each}
                </ul>
            {/each}

            <!-- Apps -->
            <div class="apps">
                <div class="apps-head">
                    <h3 class="h-title" id="m-apps-h">The apps</h3>
                    <div class="selector" role="tablist" aria-labelledby="m-apps-h">
                        {#each apps as app, i (app.name)}
                            <button
                                    type="button"
                                    role="tab"
                                    id="m-app-tab-{i}"
                                    aria-selected={selected === i}
                                    aria-controls="m-app-panel-{i}"
                                    tabindex={selected === i ? 0 : -1}
                                    bind:this={tabs[i]}
                                    onclick={() => ((selected = i), (switched = true))}
                                    onkeydown={(e) => onTabKey(e, i)}
                            >{app.name}</button>
                        {/each}
                    </div>
                </div>

                {#each apps as app, i (app.name)}
                    {@const Icon = appIcons[app.name] ?? Laptop}
                    <div
                            class="mh-group app-panel {switched ? 'm-rise-in' : ''}"
                            id="m-app-panel-{i}"
                            role="tabpanel"
                            aria-labelledby="m-app-tab-{i}"
                            hidden={selected !== i}
                    >
                        <div class="mh-row app-head">
                            <span class="mh-tile lg {app.soon ? 'mh-tile-neutral' : 'mh-tile-primary'}" aria-hidden="true"><Icon/></span>
                            <div class="min-w-0 flex-1">
                                <p class="app-name">{app.name}</p>
                                <p class="mh-sub">{app.note}</p>
                            </div>
                            {#if app.soon}<span class="tag self-center">Coming soon</span>{/if}
                        </div>
                        <ul class="app-items {app.soon ? 'soon' : ''}">
                            {#each app.items as item (item)}
                                <li>
                                    {#if !app.soon}<Check class="check" aria-hidden="true"/>{/if}
                                    <span>{item}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

<style>
    .leads {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
        margin-top: 2.5rem;
    }
    .lead-card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 1.5rem 1.5rem 1.625rem;
    }
    .lead-card .mh-sub {
        max-width: 34rem;
        margin-bottom: 1.5rem;
    }

    /* A quiet, non-interactive picture of the stream options: the original is the selected segment. */
    .formats {
        display: inline-flex;
        gap: 0;
        margin-top: auto;
        padding: 2px;
        border-radius: var(--m-radius-capsule);
        background: var(--m-seg-track);
        box-shadow: inset 0 0 0 1px var(--m-seg-border);
    }
    .formats span {
        min-width: 5rem;
        padding: 0.375rem 1rem;
        border-radius: var(--m-radius-capsule);
        text-align: center;
        font-size: var(--ios-subheadline-size);
        font-weight: 500;
        color: var(--color-muted);
    }
    .formats span.on {
        font-weight: 600;
        color: var(--color-ink);
        background: var(--m-thumb);
        box-shadow: none;
    }
    .sources {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: auto;
    }
    .sources li {
        padding: 0.375rem 0.875rem;
        border-radius: var(--m-radius-capsule);
        background: var(--m-grouped-bg-3);
        font-size: var(--ios-subheadline-size);
        font-weight: 500;
        color: var(--color-ink);
    }

    .lists {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        grid-template-areas: 'a' 'b' 'apps';
        gap: 1rem;
        margin-top: 1rem;
    }
    .list-0 {
        grid-area: a;
    }
    .list-1 {
        grid-area: b;
    }
    .apps {
        grid-area: apps;
        margin-top: 2.5rem;
    }
    .apps-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem 1.5rem;
        margin-bottom: 1rem;
        padding-left: 1rem;
    }
    .app-panel[hidden] {
        display: none;
    }
    .app-head {
        align-items: center;
        padding-block: 1rem;
    }
    .app-name {
        font-family: var(--font-display);
        font-size: var(--ios-title3-size);
        line-height: var(--ios-title3-leading);
        font-weight: 600;
        color: var(--color-ink);
    }
    .app-items li {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-height: 2.75rem;
        padding: 0.5rem 1rem;
        font-size: var(--ios-body-size);
        letter-spacing: var(--ios-body-tracking);
        color: var(--color-ink);
    }
    .app-items li::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 1rem;
        border-top: 1px solid var(--color-line);
    }
    .app-items.soon li {
        color: var(--color-muted);
    }
    .app-items :global(.check) {
        width: 1.125rem;
        height: 1.125rem;
        flex-shrink: 0;
        color: var(--color-accent-ink);
        stroke-width: 2.5;
    }

    @media (min-width: 64rem) {
        .leads {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-items: stretch;
            margin-top: 3rem;
        }
        .lead-card {
            padding: 2rem 2rem 2.125rem;
        }
        .lists {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: auto 1fr;
            grid-template-areas: 'a b' 'apps b';
            align-items: start;
        }
        .apps {
            margin-top: 1.5rem;
        }
    }
</style>
