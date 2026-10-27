<script lang="ts">
    import { onMount } from 'svelte';
    import { afterNavigate } from '$app/navigation';
    import ArrowLeft from '@lucide/svelte/icons/arrow-left';
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import Github from '@lucide/svelte/icons/github';
    import Toc from './Toc.svelte';
    import { attachZoom } from './zoom';
    import '$lib/designs/modern/pages/docs-motion.css';

    type Link = { title: string; href: string } | null;
    let { data }: {
        data: {
            title: string; html: string; hasMermaid: boolean; editUrl: string; file: string; sha: string;
            toc: { id: string; text: string; depth: 2 | 3 }[]; prev: Link; next: Link;
        };
    } = $props();

    let article: HTMLElement | undefined = $state();
    let activeId = $state('');
    let tocPanel: HTMLElement | undefined = $state();

    function isLight() {
        const t = document.documentElement.getAttribute('data-theme');
        return t ? t === 'light' : matchMedia('(prefers-color-scheme: light)').matches;
    }

    let renderToken = 0;
    async function renderMermaid() {
        if (!article) return;
        const blocks = article.querySelectorAll<HTMLElement>('pre.mermaid');
        if (!blocks.length) return;
        const token = ++renderToken;
        const { default: mermaid } = await import('mermaid');
        const light = isLight();
        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'base',
            fontFamily: document.documentElement.dataset.design === 'modern'
                ? getComputedStyle(document.body).fontFamily
                : 'Barlow, ui-sans-serif, system-ui, sans-serif',
            themeVariables: light
                ? { background: '#e6e5e0', primaryColor: '#fbfaf7', primaryTextColor: '#1b1b1a', primaryBorderColor: '#a53b05',
                    lineColor: '#54534d', secondaryColor: '#f2f1ed', tertiaryColor: '#e6e5e0', noteBkgColor: '#f2f1ed', noteTextColor: '#1b1b1a',
                    actorBkg: '#fbfaf7', actorBorder: '#a53b05', actorTextColor: '#1b1b1a', signalColor: '#54534d', signalTextColor: '#1b1b1a' }
                : { background: '#1c1c1e', primaryColor: '#313136', primaryTextColor: '#edece7', primaryBorderColor: '#ff9b5e',
                    lineColor: '#aaa9a3', secondaryColor: '#26262a', tertiaryColor: '#1c1c1e', noteBkgColor: '#26262a', noteTextColor: '#edece7',
                    actorBkg: '#313136', actorBorder: '#ff9b5e', actorTextColor: '#edece7', signalColor: '#aaa9a3', signalTextColor: '#edece7' }
        });
        let n = 0;
        for (const el of blocks) {
            if (token !== renderToken) return;
            const src = el.dataset.src ?? el.textContent ?? '';
            el.dataset.src = src;
            try {
                const { svg } = await mermaid.render(`mmd-${token}-${n++}`, src);
                el.innerHTML = svg;
                el.dataset.rendered = 'true';
                attachZoom(el);
            } catch (e) {
                console.error('mermaid render failed', e);
                el.textContent = src;
            }
        }
    }

    onMount(() => {
        // From now on this article is live DOM (mermaid may have rewritten it), not the prerendered markup.
        if (article) article.dataset.hydrated = 'true';
        const obs = new MutationObserver(() => renderMermaid());
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-design'] });
        const mq = matchMedia('(prefers-color-scheme: light)');
        const onMq = () => renderMermaid();
        mq.addEventListener('change', onMq);
        return () => {
            obs.disconnect();
            mq.removeEventListener('change', onMq);
        };
    });

    afterNavigate(() => {
        if (data.hasMermaid) renderMermaid();
    });

    // Scroll-spy for the "On this page" list.
    $effect(() => {
        data.toc;
        if (!article || !data.toc.length) return;
        const heads = data.toc.map((t) => document.getElementById(t.id)).filter((e): e is HTMLElement => !!e);
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) if (e.isIntersecting) activeId = e.target.id;
            },
            { rootMargin: '-80px 0px -70% 0px' }
        );
        heads.forEach((h) => io.observe(h));
        return () => io.disconnect();
    });
</script>

<svelte:head>
    <title>{data.title} | Synara Docs</title>
    <meta name="description" content="{data.title}: Synara server and API documentation."/>
</svelte:head>

<div class="doc-grid">
    <div class="doc-col">
        {#if data.toc.length > 1}
            <details class="disclosure toc-inline">
                <summary>On this page</summary>
                <nav class="toc-inline-body" aria-label="On this page">
                    <Toc toc={data.toc} {activeId} idPrefix="toc-inline"/>
                </nav>
            </details>
        {/if}
        <article class="prose" data-doc={data.file} bind:this={article}>
            {@html data.html}
        </article>

        <footer class="doc-foot">
            <a class="edit" href={data.editUrl} target="_blank" rel="noopener">
                <Github class="size-4" aria-hidden="true"/>
                Edit on GitHub
                <span class="sha">{data.file} @ {data.sha}</span>
            </a>
            <nav class="pn" aria-label="Previous and next">
                {#if data.prev}
                    <a href={data.prev.href} class="prev">
                        <small class="legend"><ArrowLeft class="size-3.5" aria-hidden="true"/> Previous</small>
                        <span>{data.prev.title}</span>
                    </a>
                {:else}<span></span>{/if}
                {#if data.next}
                    <a href={data.next.href} class="next">
                        <small class="legend">Next <ArrowRight class="size-3.5" aria-hidden="true"/></small>
                        <span>{data.next.title}</span>
                    </a>
                {/if}
            </nav>
        </footer>
    </div>

    {#if data.toc.length > 1}
        <aside class="toc" aria-label="On this page">
            <h2 class="legend">On this page</h2>
            <div class="toc-scroll" bind:this={tocPanel}>
                <Toc toc={data.toc} {activeId} scroller={tocPanel} idPrefix="toc-side"/>
            </div>
        </aside>
    {/if}
</div>

<style>
    .doc-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 2rem 3rem;
    }
    .doc-col {
        min-width: 0;
    }
    .doc-col :global(.prose) {
        max-width: 70ch;
    }
    .doc-col :global(.prose h1) {
        font-size: clamp(2rem, 1.5rem + 1.8vw, 2.75rem);
        overflow-wrap: anywhere;
    }
    .doc-col :global(.prose :is(h1, h2, h3, h4)) {
        scroll-margin-top: calc(var(--header-h) + 1rem);
    }
    .doc-col :global(.prose :is(h2, h3, h4) a.anchor:hover::after) {
        content: ' #';
        color: var(--color-faint);
    }
    .doc-col :global(.prose p),
    .doc-col :global(.prose li) {
        overflow-wrap: break-word;
    }
    .doc-col :global(.prose table) {
        max-width: 100%;
    }
    .doc-col :global(.prose td code),
    .doc-col :global(.prose th code) {
        white-space: nowrap;
    }
    .doc-col :global(.prose pre.mermaid) {
        background: var(--color-surface) !important;
        box-shadow: inset 0 0 0 1px var(--color-line);
        font-family: var(--font-sans);
        text-align: center;
        white-space: pre;
        color: var(--color-faint);
    }
    .doc-col :global(.prose pre.mermaid[data-rendered='true']) {
        padding: 0;
        white-space: normal;
        text-align: left;
        color: inherit;
        background: none !important;
        box-shadow: none;
        overflow: visible;
    }

    .doc-foot {
        max-width: 44rem;
        margin-top: 4rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--color-line);
    }
    .edit {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--color-muted);
    }
    .edit:hover {
        color: var(--color-ink);
    }
    .sha {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-faint);
    }
    .pn {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    .pn a {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.85rem 1.1rem;
        border: 1px solid var(--color-line);
        border-radius: var(--radius-plate);
        background: var(--plate-shade), var(--brush), var(--color-surface);
        box-shadow: var(--plate-edge), var(--plate-drop);
        min-width: 0;
        transition: border-color var(--dur-ui);
    }
    .pn a:hover {
        border-color: color-mix(in oklab, var(--color-accent) 60%, transparent);
    }
    .pn small {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }
    .pn span {
        color: var(--color-ink);
        font-weight: 500;
        overflow-wrap: anywhere;
    }
    .pn .next {
        grid-column: 2;
        text-align: right;
        align-items: flex-end;
    }

    .toc {
        display: none;
    }
    .toc-inline {
        max-width: 44rem;
        margin-bottom: 1.75rem;
        padding: 0.7rem 1rem;
        border-radius: var(--radius-plate);
        border: 1px solid var(--color-line);
        background: var(--plate-shade), var(--brush), var(--color-surface);
        box-shadow: var(--plate-edge);
    }
    .toc-inline > summary {
        font-family: var(--font-label);
        font-weight: 600;
        font-size: 0.875rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        min-height: 1.75rem;
    }
    .toc-inline-body {
        margin-top: 0.75rem;
        max-height: 60dvh;
        overflow-y: auto;
        overscroll-behavior: contain;
    }
    @media (min-width: 80rem) {
        .doc-grid {
            grid-template-columns: minmax(0, 1fr) 16rem;
            align-items: start;
        }
        .toc-inline {
            display: none;
        }
        .toc {
            display: flex;
            flex-direction: column;
            position: sticky;
            top: calc(var(--header-h) + 1.5rem);
            max-height: calc(100dvh - var(--header-h) - 3rem);
            border-left: 1px solid var(--color-line);
            padding-left: 1rem;
        }
        .toc h2 {
            margin-bottom: 0.6rem;
        }
        .toc-scroll {
            position: relative;
            min-height: 0;
            overflow-y: auto;
            overscroll-behavior: contain;
            padding: 0 0.25rem 1rem 0;
        }
    }
    /* ---------- Modern: grouped cards, a glass floating TOC, a calm reading column ---------- */
    :global(:root[data-design='modern']) .toc-inline {
        border: 0;
        border-radius: var(--m-radius-group);
        background: var(--m-grouped-bg-2);
        box-shadow: none;
        padding: 0.5rem 1rem;
    }
    :global(:root[data-design='modern']) .toc-inline > summary {
        font-family: var(--font-sans);
        font-size: var(--ios-callout-size);
        font-weight: 500;
        letter-spacing: var(--ios-callout-tracking);
        text-transform: none;
        min-height: 2.5rem;
        display: flex;
        align-items: center;
    }
    :global(:root[data-design='modern']) .pn a {
        border: 0;
        border-radius: var(--m-radius-group);
        background: var(--m-grouped-bg-2);
        box-shadow: none;
        transition: background-color var(--dur-ui);
    }
    :global(:root[data-design='modern']) .pn a:hover {
        background: var(--m-grouped-bg-3);
    }
    :global(:root[data-design='modern']) .pn span {
        color: var(--color-accent-ink);
        font-weight: 600;
    }
    :global(:root[data-design='modern']) .doc-foot {
        border-top-color: var(--color-line);
    }
    :global(:root[data-design='modern']) .doc-col :global(.prose pre.mermaid) {
        background: var(--m-grouped-bg-2) !important;
        box-shadow: none;
        border-radius: var(--m-radius-card);
    }
    @media (min-width: 80rem) {
        /* The TOC floats over the scrolling page as a glass panel. */
        :global(:root[data-design='modern']) .toc {
            padding: 0.875rem 0.5rem 0.5rem 1rem;
            border: 1px solid var(--glass-border);
            border-radius: var(--m-radius-group);
            background: var(--glass-specular), var(--glass-bg);
            -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
            backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
            box-shadow: inset 0 1px 0 var(--glass-highlight), var(--glass-shadow);
        }
        :global(:root[data-design='modern']) .toc h2 {
            margin-bottom: 0.4rem;
        }
    }
    @media (prefers-reduced-transparency: reduce) {
        :global(:root[data-design='modern']) .toc {
            background: var(--glass-solid);
            -webkit-backdrop-filter: none;
            backdrop-filter: none;
        }
    }
</style>
