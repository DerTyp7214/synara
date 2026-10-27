<script lang="ts">
    import { tick, untrack } from 'svelte';

    type Item = { id: string; text: string; depth: 2 | 3 };
    type Group = { key: string; head: Item | null; children: Item[] };

    let {
        toc,
        activeId = '',
        /** Scrolling panel to keep the active entry in view (the side column). Must be position: relative. */
        scroller,
        idPrefix
    }: { toc: Item[]; activeId?: string; scroller?: HTMLElement; idPrefix: string } = $props();

    /** Groups with more children than this start collapsed. */
    const COLLAPSE_OVER = 12;
    /** Show the filter field when the list is at least this long. */
    const FILTER_FROM = 30;

    // Each h3 belongs to the h2 before it. h3s before the first h2 form a group without a head.
    const groups = $derived.by(() => {
        const out: Group[] = [];
        for (const item of toc) {
            if (item.depth === 2 || !out.length) {
                out.push(item.depth === 2 ? { key: item.id, head: item, children: [] } : { key: `_${item.id}`, head: null, children: [item] });
            } else out[out.length - 1].children.push(item);
        }
        return out;
    });

    let open = $state<Record<string, boolean>>({});
    let query = $state('');
    let panel: HTMLElement | undefined = $state();

    const q = $derived(query.trim().toLowerCase());
    const matches = (i: Item) => i.text.toLowerCase().includes(q);
    const visible = $derived(
        q
            ? groups
                  .map((g) => ({ ...g, children: g.children.filter(matches), headMatch: !!g.head && matches(g.head) }))
                  .filter((g) => g.headMatch || g.children.length)
            : groups.map((g) => ({ ...g, headMatch: true }))
    );

    const isOpen = (g: Group) => (q ? true : (open[g.key] ?? g.children.length <= COLLAPSE_OVER));

    function onToggle(g: Group, e: Event) {
        if (q) return;
        open[g.key] = (e.currentTarget as HTMLDetailsElement).open;
    }

    // Expand the group that holds the active heading, and keep the active entry in view in the side panel.
    $effect(() => {
        const id = activeId;
        if (!id) return;
        untrack(() => {
            const g = groups.find((x) => x.head?.id === id || x.children.some((c) => c.id === id));
            if (g && g.children.length && !isOpen(g)) open[g.key] = true;
        });
        const box = scroller;
        if (!box) return;
        tick().then(() => {
            const el = panel?.querySelector<HTMLElement>('a[aria-current]');
            if (!el) return;
            const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
            if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - el.offsetHeight) {
                box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3) });
            }
        });
    });
</script>

<div class="toc-body" bind:this={panel}>
    {#if toc.length >= FILTER_FROM}
        <label class="filter">
            <span class="sr-only">Filter headings</span>
            <input type="search" placeholder="Filter headings" bind:value={query} autocomplete="off" spellcheck="false"
                   aria-controls="{idPrefix}-list"/>
        </label>
    {/if}

    <ul id="{idPrefix}-list" class="groups">
        {#each visible as g (g.key)}
            <li>
                {#if g.head && g.children.length}
                    <details class="disclosure" open={isOpen(g)} ontoggle={(e) => onToggle(g, e)}>
                        <summary>
                            <a href="#{g.head.id}" aria-current={activeId === g.head.id ? 'location' : undefined}><span class="led" aria-hidden="true"></span>{g.head.text}</a>
                            <span class="count" aria-label="{g.children.length} sections">{g.children.length}</span>
                        </summary>
                        <ul class="sub">
                            {#each g.children as c (c.id)}
                                <li><a href="#{c.id}" aria-current={activeId === c.id ? 'location' : undefined}><span class="led" aria-hidden="true"></span>{c.text}</a></li>
                            {/each}
                        </ul>
                    </details>
                {:else if g.head}
                    <a class="solo" href="#{g.head.id}" aria-current={activeId === g.head.id ? 'location' : undefined}><span class="led" aria-hidden="true"></span>{g.head.text}</a>
                {:else}
                    <ul class="sub flat">
                        {#each g.children as c (c.id)}
                            <li><a href="#{c.id}" aria-current={activeId === c.id ? 'location' : undefined}><span class="led" aria-hidden="true"></span>{c.text}</a></li>
                        {/each}
                    </ul>
                {/if}
            </li>
        {:else}
            <li class="meta">No heading matches “{query}”.</li>
        {/each}
    </ul>
</div>

<style>
    .filter {
        display: block;
        margin-bottom: 0.75rem;
    }
    .filter input {
        width: 100%;
        min-height: 2.25rem;
        padding: 0.35rem 0.65rem;
        border-radius: var(--radius-key);
        background: var(--color-recess);
        box-shadow: var(--well);
        border: 0;
        font-family: var(--font-mono);
        font-size: 0.8125rem;
        color: var(--color-ink);
    }
    .filter input::placeholder {
        color: var(--color-faint);
    }
    .groups > li + li {
        margin-top: 0.15rem;
    }
    a {
        display: flex;
        align-items: baseline;
        gap: 0.55rem;
        min-width: 0;
        padding: 0.22rem 0;
        font-size: 0.875rem;
        line-height: 1.35;
        color: var(--color-muted);
        overflow-wrap: anywhere;
    }
    a:hover,
    a[aria-current] {
        color: var(--color-ink);
    }
    a .led {
        width: 0.3125rem;
        height: 0.3125rem;
        transform: translateY(-0.1em);
    }
    a[aria-current] .led {
        background: radial-gradient(circle at 40% 35%, #ffd2b0 0 18%, var(--color-accent) 55%);
        box-shadow: 0 0 0.4rem color-mix(in oklab, var(--color-accent) 75%, transparent);
    }
    summary {
        display: flex !important;
        align-items: baseline;
        width: 100%;
    }
    /* The shared .disclosure triangle rotates via transform; only offset it with position here. */
    summary::before {
        flex-shrink: 0;
        position: relative;
        top: -0.05em;
    }
    summary a {
        flex: 1;
    }
    .count {
        flex-shrink: 0;
        font-family: var(--font-mono);
        font-size: 0.6875rem;
        color: var(--color-faint);
    }
    .solo {
        padding-left: 0.95rem;
    }
    .sub {
        margin: 0.1rem 0 0.4rem 0.95rem;
        padding-left: 0.6rem;
        border-left: 1px solid var(--color-line);
    }
    .sub.flat {
        margin-top: 0;
    }
    .sub a {
        font-size: 0.8125rem;
    }
</style>
